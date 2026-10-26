import { NextRequest } from 'next/server';
import { proxyAdmin } from '../../../_lib';

/** Force a recount of the agency's artist total. */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyAdmin('prod', `/organisations/${id}/resync`, { method: 'POST' });
}
