import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildDeclined } from '@/lib/memberEmails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, language } = await request.json();
    const built = buildDeclined({ lang: language });

    const { data, error } = await resend.emails.send({
      from: 'TORA <noreply@mail.torahub.io>',
      to: [email],
      subject: built.subject,
      html: built.html,
      text: built.text,
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
