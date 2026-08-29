import { NextRequest, NextResponse } from 'next/server';
import { proxyBeta } from '../../../_lib';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string; action: string }> }) {
  const { id, action } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !['approve', 'decline'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  return proxyBeta(`/applications/${id}/${action}`, { method: 'POST', body: {} });
}
