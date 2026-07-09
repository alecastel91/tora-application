import { NextResponse } from 'next/server';

const ALLOWED_ACTIONS = new Set(['verify', 'reject']);

/**
 * Server-side proxy for verify/reject decisions on a pending profile.
 * Session-gated by src/proxy.ts; API key stays server-side.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ profileId: string; action: string }> }
) {
  try {
    const { profileId, action } = await params;
    if (!ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_API_URL;
    const apiKey = process.env.INVITATION_API_KEY;
    if (!backendUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: BACKEND_API_URL or INVITATION_API_KEY missing' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const res = await fetch(
      `${backendUrl}/admin/verification/${encodeURIComponent(profileId)}/${action}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({ reviewedBy: body.reviewedBy || 'dashboard' }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      console.error(`[admin/verification ${action}] Backend rejected:`, res.status, data);
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[admin/verification action] Error:', err);
    return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 });
  }
}
