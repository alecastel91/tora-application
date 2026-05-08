import { NextResponse } from 'next/server';

/**
 * Server-side proxy for the admin "Delete User (GDPR)" action.
 * Forwards to tora-backend-sql `/api/admin/delete-user` with the
 * INVITATION_API_KEY (which guards admin operations on the backend).
 *
 * Body: { email: string, dryRun?: boolean }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.email || typeof body.email !== 'string') {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_API_URL;
    const apiKey = process.env.INVITATION_API_KEY;
    if (!backendUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: BACKEND_API_URL or INVITATION_API_KEY missing' },
        { status: 500 }
      );
    }

    const res = await fetch(`${backendUrl}/admin/delete-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[admin/delete-user] Backend rejected:', res.status, data);
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[admin/delete-user] Error:', err);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
