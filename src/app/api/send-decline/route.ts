import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ApplicationDeclinedEmail } from '../../../../emails/application-declined';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, email } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'TORA <noreply@mail.torahub.io>',
      to: [email],
      subject: 'Application Update - TORA',
      react: ApplicationDeclinedEmail({ firstName, email }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Decline email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send decline email' },
      { status: 500 }
    );
  }
}
