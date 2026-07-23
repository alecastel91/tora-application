import { NextResponse } from 'next/server';

/**
 * Resolve a referral code (from an invite link's ?ref=) to its inviter so the
 * apply form can tag the application. Proxies backend GET /public/referral/:code.
 * Returns only the inviter's display name — no PII.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    if (!code) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
      return NextResponse.json({ valid: false }, { status: 500 });
    }

    const res = await fetch(
      `${backendUrl}/public/referral/${encodeURIComponent(code)}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (err) {
    console.error('[public/referral] Error:', err);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
