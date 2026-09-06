import { NextRequest } from 'next/server';
import { proxyAdmin, postReportAction } from '../../_lib';

export const GET = () => proxyAdmin('beta', '/reports');
export const POST = (req: NextRequest) => postReportAction('beta', req);
