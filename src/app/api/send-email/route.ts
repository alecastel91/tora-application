import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildApplicationReceived } from '@/lib/memberEmails';

const resend = new Resend(process.env.RESEND_API_KEY);

// Application received: the first email anyone gets from TORA, so it uses the hero shell.
export async function POST(request: Request) {
  try {
    const { firstName: rawName, email, role, language } = await request.json();
    if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    const firstName = String(rawName || '').trim().slice(0, 60);
    const built = buildApplicationReceived({ firstName, email, role, lang: language });

    const { data, error } = await resend.emails.send({
      from: 'TORA <noreply@mail.torahub.io>',
      replyTo: 'support@torahub.io',
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
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
