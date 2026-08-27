import { NextRequest, NextResponse } from 'next/server';
import { proxyBeta } from '../../../_lib';

export async function POST(req: NextRequest, { params }: { params: Promise<{ trackerId: string }> }) {
  const { trackerId } = await params;
  // Path-safe: the id is interpolated into the backend URL.
  if (!/^[A-Za-z0-9-]+$/.test(trackerId)) {
    return NextResponse.json({ error: 'Invalid tracker id' }, { status: 400 });
  }
  const body = await req.json().catch(() => ({}));
  return proxyBeta(`/testers/${trackerId}/email`, { method: 'POST', body });
}
