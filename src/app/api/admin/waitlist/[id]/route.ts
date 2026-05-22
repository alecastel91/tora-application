import { NextResponse } from 'next/server';

/**
 * PATCH a waitlist row's status (APPROVED / INVITED / DECLINED / PENDING).
 * Used by the admin dashboard's approve + send-invitation flows.
 *
 * Query: ?env=production|test
 * Body:  { status?: string, invited_at?: string }
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    const body = await request.json();
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

    const res = await fetch(`${backendUrl}/admin/waitlist/${encodeURIComponent(id)}?env=${encodeURIComponent(env)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('[admin/waitlist PATCH] Backend rejected:', res.status, data);
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[admin/waitlist PATCH] Error:', err);
    return NextResponse.json({ error: 'Failed to update waitlist row' }, { status: 500 });
  }
}
