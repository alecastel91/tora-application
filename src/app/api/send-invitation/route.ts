import { NextResponse } from 'next/server';
import { sendInvitationEmail } from '@/lib/invitationEmail';

/**
 * Single-row invitation email (admin dashboard "Send Invitation").
 * The email body and tier copy live in src/lib/invitationEmail.ts, shared
 * with the bulk route so both paths send the identical message.
 */
export async function POST(request: Request) {
  try {
    const { firstName, email, role, couponCode, couponPackage } = await request.json();
    if (!email || !couponCode) {
      return NextResponse.json({ error: 'email and couponCode are required' }, { status: 400 });
    }

    const result = await sendInvitationEmail({ firstName, email, role, couponCode, couponPackage });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: { id: result.id } });
  } catch (error) {
    console.error('Invitation email API error:', error);
    return NextResponse.json({ error: 'Failed to send invitation email' }, { status: 500 });
  }
}
