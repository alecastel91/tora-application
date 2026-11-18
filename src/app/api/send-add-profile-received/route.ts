import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildAddProfileReceived } from '@/lib/memberEmails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, role, profileName, language } = await request.json();
    const built = buildAddProfileReceived({ role, profileName, lang: language });

    console.log('📧 Sending add-profile-received email to:', email);

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
