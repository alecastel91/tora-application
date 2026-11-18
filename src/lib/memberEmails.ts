import { ROLE_COLOR, button, emailShell, note, pill, steps, valueBox } from './emailShell';

/**
 * Website-sent emails on the shared shell (design A): the full invitation
 * (after launch), add-profile received / approved, and the decline. The
 * profile-only invitation and application-received build their own in place.
 */

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'https://app.torahub.io';
const gap = (px: number) => `<div style="height:${px}px;line-height:${px}px;">&nbsp;</div>`;
const roleWord = (role: string) => {
  const r = String(role || '').toLowerCase();
  return r ? r[0].toUpperCase() + r.slice(1) : 'new';
};
const SUPPORT = '<a href="mailto:support@torahub.io" style="color:#9A9AA8;">support@torahub.io</a>';

/** Full invitation, once TORA is open: the code goes straight into the full app. */
export function buildFullInvitationHtml(input: {
  firstName: string; role: string; couponCode: string; pkgLabel: string; pkgDuration: string; isPremium: boolean;
}) {
  const { firstName, role, couponCode, pkgLabel, pkgDuration, isPremium } = input;
  const signupUrl = `${appUrl()}/?code=${encodeURIComponent(couponCode)}`;
  return emailShell({
    title: "You're in",
    preheader: 'Your invitation code is inside. Sign up and go straight into TORA.',
    icon: 'ticket',
    eyebrow: pill(pkgLabel, ROLE_COLOR[String(role || '').toUpperCase()], 'center'),
    heading: firstName ? `You're in, ${firstName}` : "You're in",
    lead: 'Your application was accepted. Sign up with your code and you go straight into the full app: search, connections, offers, contracts and payments, with the whole club music industry.',
    hero: [
      valueBox('Your invitation code', couponCode, `Sign up at ${appUrl().replace(/^https?:\/\//, '')} with this email address`, 'center'),
      gap(12),
      isPremium ? valueBox('Your membership', pkgDuration, 'Starts the day you sign up. Nothing to pay, no card needed.', 'center') + gap(24) : gap(12),
      button('Create your account', signupUrl, 'center'),
    ].join(''),
    body: steps([
      ['Sign up', 'Use the code above and this email address. About a minute.'],
      ['Set up your profile', 'Photos, bio, genres and links: what people see when they find you.'],
      ['Verify it', 'A quick Instagram message to @tora.verify confirms it is really you and unlocks offers and requests.'],
    ]) + note(`Questions? Reply to this email or write to ${SUPPORT}.`),
    footReason: 'You are receiving this because your application to TORA was accepted.',
  });
}

export function buildAddProfileReceivedHtml({ role, profileName }: { role: string; profileName: string }) {
  return emailShell({
    title: 'New profile application received',
    preheader: 'We will review it and email you when it is ready.',
    icon: 'plus',
    heading: `We received your ${roleWord(role)} profile application`,
    lead: `Your application for a new ${roleWord(role)} profile (${profileName}) is in review. No further action is needed from you.`,
    body: steps([
      ['Review', 'Our team reviews your new profile application.'],
      ['Added to your account', 'If approved, the new profile appears automatically in your account.'],
      ['Confirmation', 'You receive an email when it is ready.'],
    ]) + note(`Questions? Write to ${SUPPORT}.`),
    footReason: 'You are receiving this because you applied for a new profile on TORA.',
  });
}

export function buildAddProfileApprovedHtml({ role, profileName }: { role: string; profileName: string }) {
  return emailShell({
    title: 'Your new profile is active',
    preheader: `Your new ${roleWord(role)} profile is ready to use.`,
    icon: 'plus',
    heading: `Your new ${roleWord(role)} profile is active`,
    lead: `${profileName} has been approved and is now active on TORA. Switch to it right away from the profile switcher in the app. No additional sign-up or code is needed.`,
    body: button('Open TORA', appUrl()) + gap(20) + note(`Open TORA and tap your profile icon to switch. Questions? Write to ${SUPPORT}.`),
    footReason: 'You are receiving this because your new profile application was approved.',
  });
}

export function buildDeclinedHtml() {
  return emailShell({
    title: 'Update on your TORA application',
    preheader: 'An update on your application to TORA.',
    icon: 'mail',
    heading: 'Update on your application',
    lead: "Thank you for your interest in TORA. After careful review, we're unable to approve your application at this time. Our community is curated to keep it professional and trusted, and we weren't able to find the right fit at this stage. This may change as the community grows.",
    body: note(`As TORA grows we will open up to more members, and you are welcome to apply again later. Follow <a href="https://instagram.com/tora.hub" style="color:#9A9AA8;">@tora.hub</a> for new openings. If you believe this decision was made in error, write to ${SUPPORT}.`),
    footReason: 'You are receiving this because you applied to join TORA.',
  });
}

