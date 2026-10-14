import { NextRequest } from 'next/server';
import { proxyAdmin, moderationAction } from '../_lib';

export const GET = () => proxyAdmin('prod', '/moderation');
export const POST = (req: NextRequest) => moderationAction('prod', req);
