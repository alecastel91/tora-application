import { NextRequest, NextResponse } from 'next/server';
import { proxyBeta } from '../_lib';

export async function GET() {
  return proxyBeta('/matrix');
}

/** Hand-tick one cell: { profileId, code, status }. */
export async function PUT(req: NextRequest) {
  const { profileId, code, status } = await req.json();
  // Path-safe ids only, so a crafted value cannot leave the beta namespace.
  if (typeof profileId !== 'string' || !/^[0-9a-f-]{36}$/i.test(profileId) || typeof code !== 'string' || !/^[A-Za-z0-9_-]{1,20}$/.test(code)) {
    return NextResponse.json({ error: 'Invalid task' }, { status: 400 });
  }
  return proxyBeta(`/tasks/${profileId}/${code}`, { method: 'PUT', body: { status } });
}
