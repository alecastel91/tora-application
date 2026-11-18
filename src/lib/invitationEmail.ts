import { Resend } from 'resend';
import { buildAddProfileApproved, buildFullInvitation, buildProfileOnlyInvitation, type BuiltEmail } from './memberEmails';

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
// Packages with complimentary Premium; ADMIN's lifetime has no catalog line, so it
// shows this duration as written. STANDARD is the Free tier: no Premium.
const PREMIUM_DURATION: Record<string, string> = {
  FOUNDING: '3 months Premium', LAUNCH: '1 month Premium', INFLUENCER: '12 months Premium', ADMIN: 'Lifetime Premium',
};

const HEADERS = {
  'List-Unsubscribe': '<mailto:support@torahub.io?subject=Unsubscribe>',
  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
};

async function send(email: string, built: BuiltEmail, label: string, extraHeaders = true): Promise<SendResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TORA <invitation@mail.torahub.io>',
      replyTo: 'support@torahub.io',
      to: [email],
      subject: built.subject,
      html: built.html,
      text: built.text,
      ...(extraHeaders ? { headers: HEADERS } : {}),
    });
    if (error) {
      console.error('Resend error:', error);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error(`${label} email error:`, err);
    return { ok: false, error: err instanceof Error ? err.message : `Failed to send ${label} email` };
  }
}

export async function sendInvitationEmail(input: {
  firstName: string;
  email: string;
  role: string;
  couponCode: string;
  couponPackage?: string | null;
  /** PROFILE_ONLY (pre-launch default): profile, verification and public page now, the app at launch. */
  accessLevel?: string | null;
  /** The applicant's language (the application's); English when unknown. */
  lang?: string | null;
}): Promise<SendResult> {
  const firstName = input.firstName?.trim() || '';
  const pkgKey = (input.couponPackage || 'STANDARD').toUpperCase();
  const built = input.accessLevel === 'PROFILE_ONLY'
    ? buildProfileOnlyInvitation({ firstName, role: input.role, couponCode: input.couponCode, couponPackage: pkgKey, lang: input.lang })
    : buildFullInvitation({
      firstName, role: input.role, couponCode: input.couponCode, couponPackage: pkgKey,
      isPremium: pkgKey in PREMIUM_DURATION, pkgDuration: PREMIUM_DURATION[pkgKey] || '', lang: input.lang,
    });
  return send(input.email, built, 'Invitation');
}

export async function sendAddProfileApprovedEmail(input: {
  firstName: string;
  email: string;
  role: string;
  profileName: string;
  lang?: string | null;
}): Promise<SendResult> {
  return send(input.email, buildAddProfileApproved({ role: input.role, profileName: input.profileName, lang: input.lang }), 'Add-profile-approved', false);
}
