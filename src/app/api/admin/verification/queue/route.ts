import { NextResponse } from 'next/server';

/**
 * Server-side proxy for the verification admin queue. The Express backend
 * lists profiles in CODE_ISSUED / PENDING_REVIEW; the API key stays
 * server-side and src/proxy.ts already session-gates /api/admin/*.
 */
export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_API_URL;
    const apiKey = process.env.INVITATION_API_KEY;
    if (!backendUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: BACKEND_API_URL or INVITATION_API_KEY missing' },
        { status: 500 }
      );
    }

    const res = await fetch(`${backendUrl}/admin/verification/queue`, {
      headers: { 'x-api-key': apiKey },
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('[admin/verification queue] Backend rejected:', res.status, data);
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[admin/verification queue] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch verification queue' }, { status: 500 });
  }
}
