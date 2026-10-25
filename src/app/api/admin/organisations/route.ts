import { proxyAdmin } from '../_lib';

/** Agency organisations on prod: name, members, artist total. An agency is a
 *  team on members' profiles — it does not affect anyone's price. */
export async function GET() {
  return proxyAdmin('prod', '/organisations');
}
