import { NextResponse } from 'next/server';

/**
 * Public duplicate-check for the apply form. No auth — the form on
 * torahub.io is anonymous. Returns only { exists, allowReapply }, no
 * PII, so this path doesn't re-introduce the leak we just closed.
 *
 * Query: ?email=...&env=production|test
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || '';
    const env = searchParams.get('env') || 'production';

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'valid email is required' }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Server misconfigured: BACKEND_API_URL missing' },
        { status: 500 }
      );
    }

    const res = await fetch(
      `${backendUrl}/public/waitlist/check?email=${encodeURIComponent(email)}&env=${encodeURIComponent(env)}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[public/waitlist/check] Error:', err);
    return NextResponse.json({ error: 'Check failed' }, { status: 500 });
  }
}
