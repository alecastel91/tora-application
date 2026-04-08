import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AddProfileReceivedEmail } from '../../../../emails/add-profile-received';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, email, role, profileName } = await request.json();

    console.log('📧 Sending add-profile-received email to:', email);

    const { data, error } = await resend.emails.send({
      from: 'TORA <noreply@mail.torahub.io>',
      to: [email],
      subject: 'New Profile Application Received - TORA',
      react: AddProfileReceivedEmail({ firstName, role, profileName }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Add-profile-received email sent to:', email);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Add-profile-received email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
