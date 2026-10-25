import { NextRequest } from 'next/server';
import { proxyAdmin } from '../../../_lib';

/** Force a recount of the agency's artist total. Since the flat Agent plan
 *  (2026-10-26) this changes no one's rate — it only refreshes the number. */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyAdmin('prod', `/organisations/${id}/resync`, { method: 'POST' });
}
