/**
 * Campaign attribution, admin side: reading the `attribution` column that the
 * website writes onto each application.
 *
 * ACCEPTANCE CRITERIA
 *   H1. Pure display and filter helpers. No fetching, no state, no mutation —
 *       the admin page and the recap both read the same rows and must agree.
 *   H2. A row with no attribution is "Direct". That is a normal, expected
 *       outcome (storage blocked, different device, untagged link), not an
 *       error, and it must never render as blank or "undefined".
 *   H3. Values come from the database, so they are treated as data, never as a
 *       fixed vocabulary — a campaign name nobody has seen before groups,
 *       filters and exports like any other.
 *   H4. Filtering is client-side on purpose: 152 prod rows today, and the page
 *       already loads every row for its status, role and search filters.
 *   H5. Defensive against shape: the column is jsonb, so a row could in
 *       principle hold something unexpected. Anything that is not a plain
 *       object reads as Direct rather than throwing.
 */

export type RowAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_path?: string;
  referrer_host?: string;
  first_seen_at?: string;
} | null;

export const DIRECT = "direct";

/** H5: narrow unknown jsonb to something safe to read. */
function asObject(a: unknown): Record<string, unknown> | null {
  return a && typeof a === "object" && !Array.isArray(a) ? (a as Record<string, unknown>) : null;
}

function field(a: unknown, key: string): string | undefined {
  const obj = asObject(a);
  const v = obj?.[key];
  return typeof v === "string" && v.trim().length > 0 ? v : undefined;
}

/** Grouping/filter key. H2: no attribution -> "direct". */
export const sourceKey = (a: unknown): string => field(a, "utm_source") ?? DIRECT;

/** What the badge shows. H2 + H3: unknown sources render as themselves. */
export const sourceLabel = (a: unknown): string => {
  const s = field(a, "utm_source");
  return s ? s.toUpperCase() : "DIRECT";
};

export const campaignKey = (a: unknown): string => field(a, "utm_campaign") ?? "";

/** "launch · simone-video" under the badge; empty string when there is nothing to add. */
export const campaignDetail = (a: unknown): string =>
  [field(a, "utm_campaign"), field(a, "utm_content")].filter(Boolean).join(" · ");

/** Medium and referrer, for the row's small print. */
export const mediumLabel = (a: unknown): string => field(a, "utm_medium") ?? "";
export const referrerLabel = (a: unknown): string => field(a, "referrer_host") ?? "";

/** H3: options are built from what is actually present, never hard-coded. */
export function distinctSources(rows: { attribution?: unknown }[]): string[] {
  const seen = new Set<string>();
  rows.forEach((r) => seen.add(sourceKey(r.attribution)));
  // Direct last: it is the biggest bucket and the least interesting.
  return [...seen].filter((s) => s !== DIRECT).sort().concat(seen.has(DIRECT) ? [DIRECT] : []);
}

export function distinctCampaigns(rows: { attribution?: unknown }[]): string[] {
  const seen = new Set<string>();
  rows.forEach((r) => { const c = campaignKey(r.attribution); if (c) seen.add(c); });
  return [...seen].sort();
}

/** H4. "all" on either filter means no constraint from that filter. */
export function matchesAttribution(
  a: unknown,
  source: string,
  campaign: string,
): boolean {
  if (source !== "all" && sourceKey(a) !== source) return false;
  if (campaign !== "all" && campaignKey(a) !== campaign) return false;
  return true;
}

/** Flat columns for the CSV export. Keys match the header names used there. */
export function attributionCsv(a: unknown): Record<string, string> {
  return {
    source: field(a, "utm_source") ?? "",
    medium: field(a, "utm_medium") ?? "",
    campaign: field(a, "utm_campaign") ?? "",
    content: field(a, "utm_content") ?? "",
    referrer: field(a, "referrer_host") ?? "",
    landing_path: field(a, "landing_path") ?? "",
  };
}
