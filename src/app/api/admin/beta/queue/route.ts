import { proxyBeta } from '../_lib';

export async function GET() {
  return proxyBeta('/queue');
}
