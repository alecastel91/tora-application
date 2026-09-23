import { NextRequest } from 'next/server';
import { proxyAdmin } from '../_lib';

/**
 * Admin billing-currency override for one account (prod backend).
 * Body: { email, currency: 'EUR' | 'JPY' | 'USD' | null }. The backend
 * refuses (409) once the account's currency is fixed by a Stripe customer.
 */
export async function POST(req: NextRequest) {
  const { email, currency } = await req.json();
  return proxyAdmin('prod', '/billing-currency', { method: 'POST', body: { email, currency } });
}
