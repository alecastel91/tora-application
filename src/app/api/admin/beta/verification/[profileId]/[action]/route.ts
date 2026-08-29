import { NextRequest, NextResponse } from 'next/server';
import { proxyBeta } from '../../../_lib';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ profileId: string; action: string }> }) {
  const { profileId, action } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(profileId) || !['verify', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  return proxyBeta(`/verification/${profileId}/${action}`, { method: 'POST', body: {} });
}
