import { proxyAdmin } from '../_lib';

/** Agency organisations on prod: name, members, artist total, band. */
export async function GET() {
  return proxyAdmin('prod', '/organisations');
}
