import { NextRequest, NextResponse } from 'next/server';
import { proxyBeta } from '../../../_lib';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ trackerId: string }> }) {
  const { trackerId } = await params;
  if (!/^[A-Za-z0-9-]+$/.test(trackerId)) {
    return NextResponse.json({ error: 'Invalid tracker id' }, { status: 400 });
  }
  return proxyBeta(`/testers/${trackerId}/invite`, { method: 'POST', body: {} });
}
