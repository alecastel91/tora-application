import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ROLE_COLOR, button, emailShell, esc, note, pill, steps } from '@/lib/emailShell';

const resend = new Resend(process.env.RESEND_API_KEY);

const ROLE_NOUN: Record<string, string> = { ARTIST: 'an artist', AGENT: 'an agent', PROMOTER: 'a promoter', VENUE: 'a venue' };

// Application received: the first email anyone gets from TORA, so it uses the hero shell.
export async function POST(request: Request) {
  try {
    const { firstName: rawName, email, role } = await request.json();
    if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    const firstName = String(rawName || '').trim().slice(0, 60) || 'there';
    const roleKey = String(role || '').toUpperCase();
    const submittedDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const asRole = ROLE_NOUN[roleKey] ? ` as ${ROLE_NOUN[roleKey]}` : '';

    const html = emailShell({
      title: 'Application received',
      preheader: 'We read every application by hand. Here is what happens next.',
      eyebrow: pill('Application received', ROLE_COLOR[roleKey] || '#9A9AA8', 'center'),
      heading: `Thanks, ${firstName}. We've got it`,
      lead: `Your application to join TORA${asRole} is in review. We read every one by hand and reply by email.`,
      hero: button('See how TORA works', 'https://torahub.io/features', 'center'),
      body: [
        steps([
          ['Review', 'We check every application so the network stays professional and trusted.'],
          ['Your invitation', 'If you are approved, your invitation code arrives by email. You can set up your profile and public page straight away.'],
          ['Launch', 'Search, offers, contracts and payments open for every member at launch.'],
        ]),
        note(`Applied with ${esc(email)} on ${submittedDate}. Follow <a href="https://instagram.com/tora.hub" style="color:#9A9AA8;">@tora.hub</a> for launch news.`),
      ].join('\n'),
      footReason: 'You are receiving this because you applied to join TORA.',
    });

    const text = [
      `Hi ${firstName},`,
      ``,
      `Your application to join TORA${asRole} is in review. We read every one by hand and reply by email.`,
      ``,
      `What happens next:`,
      `1. Review: we check every application so the network stays professional and trusted.`,
      `2. Your invitation: if you are approved, your invitation code arrives by email. You can set up your profile and public page straight away.`,
      `3. Launch: search, offers, contracts and payments open for every member at launch.`,
      ``,
      `Applied with ${email} on ${submittedDate}.`,
      `Follow @tora.hub on Instagram for launch news. Questions? support@torahub.io`,
      ``,
      `— The TORA Team`,
    ].join('\n');

    const { data, error } = await resend.emails.send({
      from: 'TORA <noreply@mail.torahub.io>',
      replyTo: 'support@torahub.io',
      to: [email],
      subject: 'Application received - TORA',
      html,
      text,
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
