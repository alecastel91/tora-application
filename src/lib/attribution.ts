/**
 * Campaign attribution — remembers which campaign brought a visitor, so the
 * application they submit later can be labelled with it.
 *
 * ACCEPTANCE CRITERIA
 *   B1. Reads utm_source, utm_medium, utm_campaign, utm_content, utm_term from
 *       the current URL. Captures only when at least utm_source is present.
 *   B2. Stores under localStorage key `tora_attribution`: the utm values,
 *       landing_path (pathname only, never the query string), referrer_host
 *       (hostname of an EXTERNAL document.referrer, otherwise omitted),
 *       first_seen_at (ISO now) and expires_at (now + 30 days).
 *   B3. Last touch: a new tagged visit overwrites the stored entry. An
 *       untagged visit NEVER overwrites and never clears a live entry.
 *   B4. An expired entry is ignored and removed on the next read or capture.
 *   B5. Every localStorage access is wrapped. If storage is blocked, throws, or
 *       holds malformed JSON, every function here returns quietly and the site
 *       and form keep working. Attribution is a nice-to-have, never a blocker.
 *   B6. Sanitisation (mirrored by the DB trigger in
 *       tora-backend/migrations/006_waitlist_attribution.sql):
 *         - utm_*        trimmed, lowercased, spaces -> "-", keep [a-z0-9._-],
 *                        max 100 chars
 *         - landing_path same but "/" is also kept, max 200 chars
 *         - referrer_host same, max 100 chars
 *         - first_seen_at kept only if it parses as a real ISO date
 *         - a key whose value sanitises to "" is dropped
 *   B7. Unknown VALUES are preserved. A campaign name never seen before must
 *       survive — only the key set is fixed, never the vocabulary of values.
 *   B8. forSubmit() returns the stored entry WITHOUT expires_at, or null.
 *   B9. No cookies, no network calls, no third-party anything.
 */

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_path?: string;
  referrer_host?: string;
  first_seen_at?: string;
};

type Stored = Attribution & { expires_at?: string };

const KEY = "tora_attribution";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/** B6: one rule, two character sets — paths keep "/", everything else does not. */
function clean(raw: string | null | undefined, max: number, allowSlash = false): string | undefined {
  if (typeof raw !== "string") return undefined;
  const pattern = allowSlash ? /[^a-z0-9._/-]/g : /[^a-z0-9._-]/g;
  const value = raw.trim().toLowerCase().replace(/\s+/g, "-").replace(pattern, "").slice(0, max);
  return value.length > 0 ? value : undefined;
}

/** B6: a date is validated, not character-stripped — ISO contains ":" and "T". */
function cleanDate(raw: string | null | undefined): string | undefined {
  if (typeof raw !== "string") return undefined;
  const t = Date.parse(raw);
  return Number.isNaN(t) ? undefined : new Date(t).toISOString();
}

/** Drops unknown keys and anything that sanitises away. Shared by read and write. */
function sanitise(input: Partial<Stored>): Attribution {
  const out: Attribution = {};
  for (const k of UTM_KEYS) {
    const v = clean(input[k], 100);
    if (v) out[k] = v;
  }
  const path = clean(input.landing_path, 200, true);
  if (path) out.landing_path = path;
  const host = clean(input.referrer_host, 100);
  if (host) out.referrer_host = host;
  const seen = cleanDate(input.first_seen_at);
  if (seen) out.first_seen_at = seen;
  return out;
}

// B5: every storage touch goes through these two.
function readRaw(): Stored | null {
  try {
    const text = window.localStorage.getItem(KEY);
    if (!text) return null;
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Stored) : null;
  } catch {
    return null;
  }
}

function writeRaw(value: Stored): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* storage blocked or full — attribution is optional, carry on */
  }
}

function clearRaw(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* same */
  }
}

const isExpired = (entry: Stored): boolean => {
  const t = entry.expires_at ? Date.parse(entry.expires_at) : NaN;
  return Number.isNaN(t) || t <= Date.now();
};

/**
 * B1-B4. Call on every page load. Captures when the URL carries utm_source;
 * otherwise only prunes an expired entry, so an untagged visit can never
 * overwrite or clear a live one.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const existing = readRaw();
  if (existing && isExpired(existing)) clearRaw(); // B4

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return;
  }

  const source = clean(params.get("utm_source"), 100);
  if (!source) return; // B3: untagged visit — nothing to do

  const fresh: Attribution = { utm_source: source };
  for (const k of UTM_KEYS) {
    if (k === "utm_source") continue;
    const v = clean(params.get(k), 100);
    if (v) fresh[k] = v;
  }

  const path = clean(window.location.pathname, 200, true); // B2: pathname only
  if (path) fresh.landing_path = path;

  // B2: referrer only when it is genuinely external.
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) {
        const cleaned = clean(host, 100);
        if (cleaned) fresh.referrer_host = cleaned;
      }
    }
  } catch {
    /* malformed referrer — skip it, keep the rest */
  }

  fresh.first_seen_at = new Date().toISOString();

  writeRaw({ ...sanitise(fresh), expires_at: new Date(Date.now() + TTL_MS).toISOString() });
}

/**
 * B8. The payload for the application insert: sanitised, no expires_at, or
 * null when there is nothing live to report.
 */
export function attributionForSubmit(): Attribution | null {
  if (typeof window === "undefined") return null;

  const entry = readRaw();
  if (!entry) return null;
  if (isExpired(entry)) {
    clearRaw(); // B4
    return null;
  }

  const clean = sanitise(entry);
  return Object.keys(clean).length > 0 ? clean : null;
}

export const ATTRIBUTION_STORAGE_KEY = KEY;
