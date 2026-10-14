import { NextRequest } from 'next/server';
import { proxyAdmin, moderationAction } from '../../_lib';

export const GET = () => proxyAdmin('beta', '/moderation');
export const POST = (req: NextRequest) => moderationAction('beta', req);
