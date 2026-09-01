import { NextRequest } from 'next/server';
import { proxyBeta } from '../_lib';

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const qs = new URLSearchParams({
    wave: p.get('wave') === '1' ? '1' : '2',
    role: String(p.get('role') || 'ARTIST'),
    tier: String(p.get('tier') || 'YEARLY'),
    ...(p.get('admin') === '1' ? { admin: '1' } : {}),
    ...(p.get('verification') === '1' ? { verification: '1' } : {}),
  });
  return proxyBeta(`/preview?${qs.toString()}`);
}
