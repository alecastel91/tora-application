import { NextRequest } from 'next/server';
import { proxyAdmin, postReportAction } from '../_lib';

export const GET = () => proxyAdmin('prod', '/reports');
export const POST = (req: NextRequest) => postReportAction('prod', req);
