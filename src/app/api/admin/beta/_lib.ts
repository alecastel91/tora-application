import { proxyAdmin } from '../_lib';

/** /api/admin/beta/* → the beta backend under /admin/beta. */
export const proxyBeta = (path: string, init?: { method?: string; body?: unknown }) => proxyAdmin('beta', path, init);
