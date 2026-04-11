import { NextResponse } from 'next/server';

/**
 * Server-side proxy for the admin dashboard's "Send Invitation" action.
 *
 * Why this exists: the admin dashboard runs in the browser, and Next.js
 * refuses to expose any process.env.* variable to the browser unless its
 * name starts with NEXT_PUBLIC_. The INVITATION_API_KEY must NOT be public
 * (it would leak into the JS bundle), so we proxy the call through this
 * route which runs server-side and CAN read non-public env vars.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendUrl = process.env.BACKEND_API_URL;
    const apiKey = process.env.INVITATION_API_KEY;

    if (!backendUrl) {
      console.error('[admin/send-invitation] BACKEND_API_URL is not set');
      return NextResponse.json(
        { error: 'Server misconfigured: BACKEND_API_URL missing' },
        { status: 500 }
      );
    }

    if (!apiKey) {
      console.error('[admin/send-invitation] INVITATION_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server misconfigured: INVITATION_API_KEY missing' },
        { status: 500 }
      );
    }

    const upstream = await fetch(`${backendUrl}/invitations/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    const upstreamBody = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      console.error(
        '[admin/send-invitation] Backend rejected request:',
        upstream.status,
        upstreamBody
      );
      return NextResponse.json(
        {
          error:
            upstreamBody?.error ||
            `Backend returned ${upstream.status}`,
        },
        { status: upstream.status }
      );
    }

    return NextResponse.json(upstreamBody);
  } catch (error) {
    console.error('[admin/send-invitation] Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to reach invitation backend' },
      { status: 502 }
    );
  }
}
