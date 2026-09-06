import { NextRequest, NextResponse } from 'next/server';
import { proxyBeta } from '../_lib';

export async function GET() {
  return proxyBeta('/reports');
}

export async function POST(req: NextRequest) {
  const { postId, action } = await req.json();
  // Path-safe: the id joins the upstream URL, so it must stay a plain uuid.
  if (typeof postId !== 'string' || !/^[0-9a-f-]{36}$/i.test(postId)) {
    return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
  }
  return proxyBeta(`/reports/${postId}`, { method: 'POST', body: { action } });
}
