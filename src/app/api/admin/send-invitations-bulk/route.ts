import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { isUuid } from '../_lib';
import { sendInvitationEmail, sendAddProfileApprovedEmail } from '@/lib/invitationEmail';

/**
 * "Invite all approved" — one batch of the bulk invitation run.
 *
 * The dashboard calls this repeatedly with small batches of waitlist row ids
 * (BATCH_MAX at a time) so each call stays well inside the serverless time
 * limit even for hundreds of applicants; progress and failures are shown
 * client-side between calls.
 *
 * Per row it mirrors the single "Send Invitation" flow exactly:
 *   1. create the invitation record on the backend (holds the code),
 *   2. mark the waitlist row INVITED with the code + timestamp,
 *   3. send the email (invitation with code, or "profile approved" for
 *      ADD_PROFILE rows).
 *
 * Safe to re-run: the row's status is re-read from the backend right before
 * sending and anything not APPROVED is skipped, so an interrupted run can be
 * resumed without double-inviting anyone. Sends are spaced SEND_GAP_MS apart
 * to stay under Resend's per-second cap.
 *
 * Session-gated by src/proxy.ts (/api/admin/:path*).
 *
 * Body:  { env: 'production' | 'test', items: [{ id, couponPackage? }] }
 * Reply: { results: [{ id, name, email, status: 'invited'|'invited_email_failed'|'skipped'|'failed', code?, error? }] }
 */

export const maxDuration = 60;

const BATCH_MAX = 5;
const SEND_GAP_MS = 700;

type Row = {
  id: string;
  status: string;
  role: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  profile_name: string | null;
  phone_number: string | null;
  zone: string | null;
  country: string | null;
  city: string | null;
  genres: string | null;
  instagram: string | null;
  resident_advisor: string | null;
  soundcloud: string | null;
  website: string | null;
  linkedin: string | null;
  agency_name: string | null;
  venue_capacity: string | null;
  existing_user_id: string | null;
  application_type: string | null;
};

type Result = {
  id: string;
  name: string;
  email: string;
  status: 'invited' | 'invited_email_failed' | 'skipped' | 'failed';
  code?: string;
  error?: string;
};

const makeCode = () => {
  // Same shape as the dashboard's codes (TORA-XXXX-XXXX) but from a CSPRNG.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(8);
  const chunk = (from: number) =>
    Array.from(bytes.subarray(from, from + 4), (b) => alphabet[b % alphabet.length]).join('');
  return `TORA-${chunk(0)}-${chunk(4)}`;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_API_URL;
  const apiKey = process.env.INVITATION_API_KEY;
  if (!backendUrl || !apiKey) {
    return NextResponse.json({ error: 'Server misconfigured: BACKEND_API_URL or INVITATION_API_KEY missing' }, { status: 500 });
  }

  let body: { env?: string; items?: { id: string; couponPackage?: string }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const env = body.env === 'test' ? 'test' : 'production';
  const items = Array.isArray(body.items) ? body.items.slice(0, BATCH_MAX) : [];
  if (items.length === 0) return NextResponse.json({ error: 'items is required' }, { status: 400 });
  if (items.some((it) => !isUuid(it?.id))) {
    return NextResponse.json({ error: 'Every item needs a uuid id' }, { status: 400 });
  }

  const headers = { 'Content-Type': 'application/json', 'x-api-key': apiKey };

  // Fresh read so a row invited moments ago (by hand, or by an earlier batch)
  // is skipped instead of invited twice.
  const listRes = await fetch(`${backendUrl}/admin/waitlist?env=${env}`, { headers: { 'x-api-key': apiKey }, cache: 'no-store' });
  const listBody = await listRes.json().catch(() => ({}));
  if (!listRes.ok) {
    return NextResponse.json({ error: listBody?.error || `Backend returned ${listRes.status}` }, { status: 502 });
  }
  const rows = new Map<string, Row>((listBody.rows as Row[] || []).map((r) => [r.id, r]));

  const results: Result[] = [];
  let first = true;

  for (const item of items) {
    const row = rows.get(item.id);
    const name = row ? (row.profile_name || `${row.first_name || ''} ${row.last_name || ''}`.trim()) : item.id;
    const email = row?.email || '';

    if (!row) {
      results.push({ id: item.id, name, email, status: 'failed', error: 'Row not found' });
      continue;
    }
    if (row.status !== 'APPROVED') {
      results.push({ id: row.id, name, email, status: 'skipped', error: `Status is ${row.status}` });
      continue;
    }

    if (!first) await sleep(SEND_GAP_MS);
    first = false;

    const code = makeCode();
    const couponPackage = (item.couponPackage || 'STANDARD').toUpperCase();

    try {
      // 1. Invitation record on the backend
      const createRes = await fetch(`${backendUrl}/invitations/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: row.email,
          code,
          couponPackage,
          existingUserId: row.existing_user_id,
          applicationType: row.application_type,
          firstName: row.first_name,
          lastName: row.last_name,
          profileName: row.profile_name,
          role: row.role,
          phone: row.phone_number,
          zone: row.zone,
          country: row.country,
          city: row.city,
          genres: row.genres,
          instagram: row.instagram,
          residentAdvisor: row.resident_advisor,
          soundcloud: row.soundcloud,
          website: row.website,
          linkedin: row.linkedin,
          agencyName: row.agency_name,
          venueCapacity: row.venue_capacity,
        }),
      });
      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(`Backend rejected invitation: ${err?.error || createRes.statusText}`);
      }

      // 2. Waitlist row → INVITED
      const patchRes = await fetch(`${backendUrl}/admin/waitlist/${encodeURIComponent(row.id)}?env=${env}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: 'INVITED', coupon_code: code, invited_at: new Date().toISOString() }),
      });
      if (!patchRes.ok) {
        const err = await patchRes.json().catch(() => ({}));
        throw new Error(`Invitation ${code} saved but waitlist update failed: ${err?.error || patchRes.statusText}`);
      }

      // 3. Email
      const emailResult = row.application_type === 'ADD_PROFILE'
        ? await sendAddProfileApprovedEmail({
            firstName: row.first_name || row.profile_name || '',
            email: row.email,
            role: row.role,
            profileName: row.profile_name || '',
          })
        : await sendInvitationEmail({
            firstName: row.profile_name || row.first_name || '',
            email: row.email,
            role: row.role,
            couponCode: code,
            couponPackage,
          });

      results.push(emailResult.ok
        ? { id: row.id, name, email, status: 'invited', code }
        : { id: row.id, name, email, status: 'invited_email_failed', code, error: emailResult.error });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[admin/send-invitations-bulk]', row.id, message);
      results.push({ id: row.id, name, email, status: 'failed', code, error: message });
    }
  }

  return NextResponse.json({ results });
}
