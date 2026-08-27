import { NextRequest, NextResponse } from 'next/server';
import { proxyBeta } from '../_lib';

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search || '';
  return proxyBeta(`/feedback${qs}`);
}

export async function PUT(req: NextRequest) {
  const { id, ...body } = await req.json();
  // Path-safe: an unvalidated id could traverse (../..) out of the beta
  // namespace and reach arbitrary API-key-authenticated admin endpoints —
  // exactly what the beta scope split must prevent.
  if (typeof id !== 'string' || !/^[A-Za-z0-9-]+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid feedback id' }, { status: 400 });
  }
  return proxyBeta(`/feedback/${id}`, { method: 'PUT', body });
}
