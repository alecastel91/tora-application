import { NextResponse } from 'next/server';
import { sendAddProfileApprovedEmail } from '@/lib/invitationEmail';

export async function POST(request: Request) {
  try {
    const { firstName, email, role, profileName } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    console.log('📧 Sending add-profile-approved email to:', email);
    const result = await sendAddProfileApprovedEmail({ firstName, email, role, profileName });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: { id: result.id } });
  } catch (error) {
    console.error('Add-profile-approved email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
