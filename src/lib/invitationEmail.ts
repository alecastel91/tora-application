import { Resend } from 'resend';
import { InvitationAcceptedEmail } from '../../emails/invitation-accepted';
import { AddProfileApprovedEmail } from '../../emails/add-profile-approved';

/**
 * Server-only email senders for the admin invitation flows.
 *
 * Shared by the single-row routes (/api/send-invitation,
 * /api/send-add-profile-approved) and the bulk route
 * (/api/admin/send-invitations-bulk) so the copy, tiers and headers can't
 * drift between "one at a time" and "invite all approved".
 */

const resend = new Resend(process.env.RESEND_API_KEY);

export type SendResult = { ok: true; id?: string } | { ok: false; error: string };

// STANDARD intentionally avoids saying "Standard" — every TORA member is exclusive.
// STANDARD is the Free tier: no Premium trial.
const packageInfo: Record<string, { label: string; duration: string }> = {
  FOUNDING: { label: 'Founding Member', duration: '3 months Premium · Complimentary' },
  LAUNCH: { label: 'Launch Member', duration: '1 month Premium · Complimentary' },
  INFLUENCER: { label: 'Influencer Member', duration: '12 months Premium · Complimentary' },
  ADMIN: { label: 'Admin', duration: 'Lifetime Premium · Complimentary' },
  STANDARD: { label: 'TORA Member', duration: 'Free membership' },
};

export async function sendInvitationEmail(input: {
  firstName: string;
  email: string;
  role: string;
  couponCode: string;
  couponPackage?: string | null;
}): Promise<SendResult> {
  const { firstName, email, role, couponCode, couponPackage } = input;

  const pkgKey = (couponPackage || 'STANDARD').toUpperCase();
  const pkg = packageInfo[pkgKey] || packageInfo.STANDARD;
  // Premium follows the resolved package, so an unknown key (which falls back
  // to STANDARD above) is treated as Free too.
  const isPremium = pkg !== packageInfo.STANDARD;
  const benefit = `${pkg.label} • ${pkg.duration}`;

  const tierInfo = {
    ARTIST: {
      title: 'Artist Membership',
      benefit,
      description: 'Connect with venues, promoters, and agents worldwide. Book gigs, manage your calendar, and grow your career in the club music industry.',
    },
    PROMOTER: {
      title: 'Promoter Membership',
      benefit,
      description: 'Discover and book talented artists for your events. Access a global network of club music professionals and streamline your booking process.',
    },
    VENUE: {
      title: 'Venue Membership',
      benefit,
      description: 'Connect with artists and promoters to fill your calendar. Find the perfect acts for your venue and manage bookings efficiently.',
    },
    AGENT: {
      title: 'Agent Membership',
      benefit,
      description: 'Represent artists and manage their bookings in one platform. Connect your roster with venues and promoters, track deals, and grow your business.',
    },
  };
  // The waitlist stores roles in title case ("Venue"); the tier map is uppercase.
  const tier = tierInfo[String(role || '').toUpperCase() as keyof typeof tierInfo] || tierInfo.ARTIST;

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

  try {
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
      return { ok: false, error: error.message };
    }
    console.log('✅ Invitation email sent successfully to:', email);
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error('Invitation email error:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to send invitation email' };
  }
}

export async function sendAddProfileApprovedEmail(input: {
  firstName: string;
  email: string;
  role: string;
  profileName: string;
}): Promise<SendResult> {
  const { firstName, email, role, profileName } = input;
  try {
    const { data, error } = await resend.emails.send({
      from: 'TORA <invitation@mail.torahub.io>',
      to: [email],
      subject: 'Your New Profile is Active - TORA',
      react: AddProfileApprovedEmail({ firstName, role, profileName }),
    });
    if (error) {
      console.error('Resend error:', error);
      return { ok: false, error: error.message };
    }
    console.log('✅ Add-profile-approved email sent to:', email);
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error('Add-profile-approved email error:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to send email' };
  }
}
