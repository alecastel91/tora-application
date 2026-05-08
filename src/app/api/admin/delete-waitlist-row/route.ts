import { NextResponse } from 'next/server';

/**
 * Server-side proxy for the admin "remove this waitlist row" action.
 * Distinct from /api/admin/delete-user (GDPR) — only deletes the
 * specific waitlist row, leaves the user account and any other rows
 * for the same email untouched.
 *
 * Body: { id: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.id || typeof body.id !== 'string') {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_API_URL;
    const apiKey = process.env.INVITATION_API_KEY;
    if (!backendUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: BACKEND_API_URL or INVITATION_API_KEY missing' },
        { status: 500 }
      );
    }

    const res = await fetch(`${backendUrl}/admin/delete-waitlist-row`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[admin/delete-waitlist-row] Backend rejected:', res.status, data);
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[admin/delete-waitlist-row] Error:', err);
    return NextResponse.json({ error: 'Failed to delete row' }, { status: 500 });
  }
}
