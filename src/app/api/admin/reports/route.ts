import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side proxy for reported News posts (prod backend). The API key
 * stays server-side; src/proxy.ts session-gates /api/admin/*.
 */
async function proxyProd(path: string, init?: { method?: string; body?: unknown }) {
  const backendUrl = process.env.BACKEND_API_URL;
  const apiKey = process.env.INVITATION_API_KEY;
  if (!backendUrl || !apiKey) {
    return NextResponse.json({ error: 'Server misconfigured: BACKEND_API_URL or INVITATION_API_KEY missing' }, { status: 500 });
  }
  try {
    const res = await fetch(`${backendUrl}/admin${path}`, {
      method: init?.method || 'GET',
      headers: { 'x-api-key': apiKey, ...(init?.body ? { 'Content-Type': 'application/json' } : {}) },
      ...(init?.body ? { body: JSON.stringify(init.body) } : {}),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[admin/reports]', path, err);
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }
}

export async function GET() {
  return proxyProd('/reports');
}

export async function POST(req: NextRequest) {
  const { postId, action } = await req.json();
  if (typeof postId !== 'string' || !/^[0-9a-f-]{36}$/i.test(postId)) {
    return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
  }
  return proxyProd(`/reports/${postId}`, { method: 'POST', body: { action } });
}
