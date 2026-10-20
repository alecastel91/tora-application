import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Fallback path for submitting an application.
 *
 * WHY THIS EXISTS
 *   The form normally writes straight from the browser to supabase.co. Plenty
 *   of corporate networks block that host outright, so the write never leaves
 *   the building and the applicant is lost — silently, because the form used
 *   to show the confirmation either way. Observed on a real office network on
 *   2026-10-20: two applications vanished, the same one succeeded instantly
 *   from a phone on mobile data.
 *
 *   The browser can always reach torahub.io — it just loaded the page from
 *   here — and this route runs on Vercel, outside any customer firewall. So
 *   when the direct write fails, the form posts here instead and we do the
 *   write server-side.
 *
 * ACCEPTANCE CRITERIA
 *   M1. Same destination, same permissions: the public anon key and the same
 *       `waitlist_anon_insert` RLS policy the browser already uses. No service
 *       role, no new secret, no privilege the page did not already have.
 *   M2. No new exposure. That key ships in every page today, so anything this
 *       route allows was already possible by posting to Supabase directly.
 *   M3. Column whitelist. Only the fields the form sends are written; anything
 *       else in the body is dropped rather than passed through to the table.
 *   M4. Attribution must never cost an application: if the insert fails and
 *       the payload carried `attribution`, retry once without it. Losing a
 *       campaign label is acceptable; losing the applicant is not.
 *   M5. Honest status codes. 200 only when a row was really written, so the
 *       form can trust the answer and show the error state when it must.
 *   M6. Never leaks internals to the client: errors are logged server-side and
 *       answered with a short generic message.
 */

// The browser-safe pair, used here on the server — see M1/M2.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// M3 — exactly the columns ApplicationForm sends, nothing more.
const ALLOWED = [
  "phone_number", "role", "first_name", "last_name", "profile_name", "email",
  "zone", "country", "city", "genres", "instagram", "resident_advisor",
  "soundcloud", "agency_name", "website", "linkedin", "venue_capacity",
  "attribution",
] as const;

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[public/apply] Supabase env missing");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // M3
  const row: Record<string, unknown> = {};
  for (const key of ALLOWED) {
    if (body[key] !== undefined) row[key] = body[key];
  }
  if (!row.email) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const table = (process.env.NEXT_PUBLIC_ENV_MODE || "production") === "test" ? "waitlist_test" : "waitlist";
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { error } = await supabase.from(table).insert([row]);
  if (!error) return NextResponse.json({ ok: true });

  // M4 — one more go without the campaign label.
  if (row.attribution !== undefined) {
    console.error("[public/apply] insert failed, retrying without attribution:", error.message);
    const { attribution: _dropped, ...withoutAttribution } = row;
    void _dropped;
    const retry = await supabase.from(table).insert([withoutAttribution]);
    if (!retry.error) return NextResponse.json({ ok: true, attributionDropped: true });
    console.error("[public/apply] retry failed:", retry.error.message);
  } else {
    console.error("[public/apply] insert failed:", error.message);
  }

  // M5 + M6
  return NextResponse.json({ error: "Could not save the application" }, { status: 502 });
}
