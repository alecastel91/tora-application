import { NextResponse } from 'next/server';

/**
 * Shared proxy for /admin/beta — targets the BETA backend, not prod.
 * Session gating comes from src/proxy.ts (/api/admin/:path*).
 * Env: BETA_BACKEND_API_URL + BETA_INVITATION_API_KEY (fall back to the
 * prod pair for local dev where both stacks are the same).
 */
export async function proxyBeta(path: string, init?: { method?: string; body?: unknown }) {
  const backendUrl = process.env.BETA_BACKEND_API_URL || process.env.BACKEND_API_URL;
  const apiKey = process.env.BETA_INVITATION_API_KEY || process.env.INVITATION_API_KEY;
  if (!backendUrl || !apiKey) {
    return NextResponse.json({ error: 'Server misconfigured: beta backend env missing' }, { status: 500 });
  }
  try {
    const res = await fetch(`${backendUrl}/admin/beta${path}`, {
      method: init?.method || 'GET',
      headers: { 'x-api-key': apiKey, ...(init?.body ? { 'Content-Type': 'application/json' } : {}) },
      ...(init?.body ? { body: JSON.stringify(init.body) } : {}),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[admin/beta proxy]', path, err);
    return NextResponse.json({ error: 'Beta backend unreachable' }, { status: 502 });
  }
}
