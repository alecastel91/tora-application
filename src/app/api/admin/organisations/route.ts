import { proxyAdmin } from '../_lib';

/** Agency organisations on prod: name, members, artist total. */
export async function GET() {
  return proxyAdmin('prod', '/organisations');
}
