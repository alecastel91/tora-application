import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { InvitationAcceptedEmail } from '../../../../emails/invitation-accepted';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, email, role, couponCode, couponPackage } = await request.json();

    // Map coupon package to a friendly membership label.
    // STANDARD intentionally avoids saying "Standard" — every TORA member is exclusive.
    // STANDARD is the Free tier: no Premium trial (the old "7-day Premium Trial" is gone).
    const packageInfo: Record<string, { label: string; duration: string }> = {
      FOUNDING: { label: 'Founding Member', duration: '3 months Premium · Complimentary' },
      LAUNCH: { label: 'Launch Member', duration: '1 month Premium · Complimentary' },
      INFLUENCER: { label: 'Influencer Member', duration: '12 months Premium · Complimentary' },
      ADMIN: { label: 'Admin', duration: 'Lifetime Premium · Complimentary' },
      STANDARD: { label: 'TORA Member', duration: 'Free membership' },
    };
    const pkgKey = (couponPackage || 'STANDARD').toUpperCase();
    const pkg = packageInfo[pkgKey] || packageInfo.STANDARD;
    // Premium follows the resolved package, so an unknown key (which falls back
    // to STANDARD above) is treated as Free too.
    const isPremium = pkg !== packageInfo.STANDARD;
    const membershipTier = pkg.label;
    const premiumDuration = pkg.duration;

    // Map role to tier information
    const tierInfo = {
      ARTIST: {
        title: 'Artist Membership',
        benefit: `${membershipTier} • ${premiumDuration}`,
        description: 'Connect with venues, promoters, and agents worldwide. Book gigs, manage your calendar, and grow your career in the club music industry.'
      },
      PROMOTER: {
        title: 'Promoter Membership',
        benefit: `${membershipTier} • ${premiumDuration}`,
        description: 'Discover and book talented artists for your events. Access a global network of club music professionals and streamline your booking process.'
      },
      VENUE: {
        title: 'Venue Membership',
        benefit: `${membershipTier} • ${premiumDuration}`,
        description: 'Connect with artists and promoters to fill your calendar. Find the perfect acts for your venue and manage bookings efficiently.'
      },
      AGENT: {
        title: 'Agent Membership',
        benefit: `${membershipTier} • ${premiumDuration}`,
        description: 'Represent artists and manage their bookings in one platform. Connect your roster with venues and promoters, track deals, and grow your business.'
      }
    };

    const tier = tierInfo[role as keyof typeof tierInfo] || tierInfo.ARTIST;

    console.log('📧 Sending invitation email with variables:', {
      firstName,
      email,
      role,
      couponCode,
      tierTitle: tier.title
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.torahub.io';

    // Plain-text fallback — significantly improves deliverability with Gmail / Outlook
    // (spam filters dock messages that ship HTML only).
    const plainText = [
      `Hi ${firstName},`,
      ``,
      `Your application to TORA has been accepted. Welcome.`,
      ``,
      `Your exclusive invitation code: ${couponCode}`,
      ``,
      `Membership: ${tier.title} (${tier.benefit})`,
      ``,
      `${tier.description}`,
      ``,
      `How to join:`,
      `1. Visit ${appUrl}`,
      `2. Enter your invitation code during signup`,
      `3. Complete your profile and start connecting`,
      ``,
      `Questions? Reply to this email or contact support@torahub.io`,
      ``,
      `— The TORA Team`,
      `https://torahub.io`,
    ].join('\n');

    // Send invitation email to approved applicant using React component
    const { data, error } = await resend.emails.send({
      from: 'TORA <invitation@mail.torahub.io>',
      replyTo: 'support@torahub.io',
      to: [email],
      subject: `${firstName}, your TORA invitation is ready`,
      react: InvitationAcceptedEmail({
        firstName,
        invitationCode: couponCode,
        tierTitle: tier.title,
        tierBenefit: tier.benefit,
        tierDescription: tier.description,
        appUrl,
        isPremium,
      }),
      text: plainText,
      headers: {
        'List-Unsubscribe': '<mailto:support@torahub.io?subject=Unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Invitation email sent successfully to:', email);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Invitation email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation email' },
      { status: 500 }
    );
  }
}
