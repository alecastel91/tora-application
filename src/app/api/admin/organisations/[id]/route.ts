import { NextRequest } from 'next/server';
import { proxyAdmin } from '../../_lib';

/** One organisation with its members and their subscription state. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyAdmin('prod', `/organisations/${id}`);
}
