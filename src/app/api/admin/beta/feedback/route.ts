import { NextRequest } from 'next/server';
import { proxyBeta } from '../_lib';

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search || '';
  return proxyBeta(`/feedback${qs}`);
}

export async function PUT(req: NextRequest) {
  const { id, ...body } = await req.json();
  return proxyBeta(`/feedback/${id}`, { method: 'PUT', body });
}
