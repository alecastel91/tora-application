import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AddProfileApprovedEmail } from '../../../../emails/add-profile-approved';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, email, role, profileName } = await request.json();

    console.log('📧 Sending add-profile-approved email to:', email);

    const { data, error } = await resend.emails.send({
      from: 'TORA <invitation@mail.torahub.io>',
      to: [email],
      subject: 'Your New Profile is Active - TORA',
      react: AddProfileApprovedEmail({ firstName, role, profileName }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Add-profile-approved email sent to:', email);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Add-profile-approved email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
