import { NextResponse } from 'next/server';

/**
 * Server-side proxy for the admin dashboard's waitlist list endpoint.
 * Reads via the Express backend (service_role bypasses RLS); the previous
 * direct-Supabase reads stopped working once we enabled RLS on the
 * waitlist table to close the anon-readable PII leak.
 *
 * Query: ?env=production|test
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const env = searchParams.get('env') || 'production';

    const backendUrl = process.env.BACKEND_API_URL;
    const apiKey = process.env.INVITATION_API_KEY;
    if (!backendUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: BACKEND_API_URL or INVITATION_API_KEY missing' },
        { status: 500 }
      );
    }

    const res = await fetch(`${backendUrl}/admin/waitlist?env=${encodeURIComponent(env)}`, {
      headers: { 'x-api-key': apiKey },
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('[admin/waitlist GET] Backend rejected:', res.status, data);
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[admin/waitlist GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
  }
}
