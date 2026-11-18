import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildDeclinedHtml } from '@/lib/memberEmails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, email } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'TORA <noreply@mail.torahub.io>',
      to: [email],
      subject: 'Update on your TORA application',
      html: buildDeclinedHtml(),
      text: `Hi ${firstName || 'there'},\n\nThank you for your interest in TORA. After careful review, we're unable to approve your application at this time. As TORA grows we will open up to more members, and you are welcome to apply again later.\n\nQuestions: support@torahub.io\n\n— The TORA Team`,
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
