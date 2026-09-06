import { NextRequest, NextResponse } from 'next/server';

/**
 * Shared server-side proxy for the admin dashboard and the beta cockpit.
 * Session gating comes from src/proxy.ts (/api/admin/:path*); the API key
 * never leaves the server. 'beta' targets the beta backend under
 * /admin/beta (falling back to the prod pair for local dev where both
 * stacks are the same).
 */
export type AdminTarget = 'prod' | 'beta';

const targets: Record<AdminTarget, () => { backendUrl?: string; apiKey?: string; base: string }> = {
  prod: () => ({ backendUrl: process.env.BACKEND_API_URL, apiKey: process.env.INVITATION_API_KEY, base: '/admin' }),
  beta: () => ({
    backendUrl: process.env.BETA_BACKEND_API_URL || process.env.BACKEND_API_URL,
    apiKey: process.env.BETA_INVITATION_API_KEY || process.env.INVITATION_API_KEY,
    base: '/admin/beta',
  }),
};

export async function proxyAdmin(target: AdminTarget, path: string, init?: { method?: string; body?: unknown }) {
  const { backendUrl, apiKey, base } = targets[target]();
  if (!backendUrl || !apiKey) {
    return NextResponse.json({ error: `Server misconfigured: ${target} backend env missing` }, { status: 500 });
  }
  try {
    const res = await fetch(`${backendUrl}${base}${path}`, {
      method: init?.method || 'GET',
      headers: { 'x-api-key': apiKey, ...(init?.body ? { 'Content-Type': 'application/json' } : {}) },
      ...(init?.body ? { body: JSON.stringify(init.body) } : {}),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`[admin proxy ${target}]`, path, err);
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }
}

export const isUuid = (v: unknown): v is string =>
  typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

/** POST { postId, action } → /reports/:postId on the chosen backend. */
export async function postReportAction(target: AdminTarget, req: NextRequest) {
  const { postId, action } = await req.json();
  // The id joins the upstream URL, so it must be a plain uuid (no traversal).
  if (!isUuid(postId)) return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
  return proxyAdmin(target, `/reports/${postId}`, { method: 'POST', body: { action } });
}
