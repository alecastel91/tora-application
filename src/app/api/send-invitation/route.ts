import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { InvitationAcceptedEmail } from '../../../../emails/invitation-accepted';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, email, role, couponCode, couponPackage } = await request.json();

    // Map coupon package to a friendly membership label.
    // STANDARD intentionally avoids saying "Standard" — every TORA member is exclusive.
    const packageInfo: Record<string, { label: string; duration: string }> = {
      FOUNDING: { label: 'Founding Member', duration: '3 months Premium · Complimentary' },
      LAUNCH: { label: 'Launch Member', duration: '1 month Premium · Complimentary' },
      INFLUENCER: { label: 'Influencer Member', duration: '12 months Premium · Complimentary' },
      STANDARD: { label: 'TORA Member', duration: '7-day Premium Trial' },
    };
    const pkgKey = (couponPackage || 'STANDARD').toUpperCase();
    const pkg = packageInfo[pkgKey] || packageInfo.STANDARD;
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

    // Send invitation email to approved applicant using React component
    const { data, error } = await resend.emails.send({
      from: 'TORA <invitation@mail.torahub.io>',
      to: [email],
      subject: 'Welcome to TORA - Your Invitation',
      react: InvitationAcceptedEmail({
        firstName,
        invitationCode: couponCode,
        tierTitle: tier.title,
        tierBenefit: tier.benefit,
        tierDescription: tier.description,
      }),
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
