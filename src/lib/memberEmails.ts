import { ROLE_COLOR, button, detailsBox, emailShell, esc, htmlToText, note, pill, signoff, steps, valueBox } from './emailShell';
import { copyFor, formatDay, normLang, type T } from './emailCopy';

/**
 * Every email the website sends, in the recipient's language (`lang`, from
 * the application; English when unknown). Each builder returns
 * { subject, html, text }: text is derived from the html, so the two never drift.
 */

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'https://app.torahub.io';
const gap = (px: number) => `<div style="height:${px}px;line-height:${px}px;">&nbsp;</div>`;
const SUPPORT = '<a href="mailto:support@torahub.io" style="color:#9A9AA8;">support@torahub.io</a>';
const IG = '<a href="https://instagram.com/tora.hub" style="color:#9A9AA8;">@tora.hub</a>';
// Catalog notes name the address and handle in plain text; the html links them.
const linkify = (s: string) => esc(s).replace('support@torahub.io', SUPPORT).replace('@tora.hub', IG);
const stepsOf = (t: T, group: string) => steps([1, 2, 3].map((i) => [t(`${group}.step${i}.title`), esc(t(`${group}.step${i}.body`))] as [string, string]));
const roleKey = (role: string) => String(role || '').toUpperCase();
// Role word for "your new {{role}} profile": the glossary's role name, from the catalog.
const roleWord = (t: T, role: string) => (['ARTIST', 'AGENT', 'PROMOTER', 'VENUE'].includes(roleKey(role)) ? t(`_shared.role.${roleKey(role)}`) : String(role || ''));

export type BuiltEmail = { subject: string; html: string; text: string };
const done = (subject: string, html: string): BuiltEmail => ({ subject, html, text: htmlToText(html) });

// One table per invitation package: its catalog slug drives the badge
// (_shared.pill.<slug>Member), the gift (_shared.gift.<slug>.*) and the
// pre-launch gift note (invitationProfileOnly.note.gift<Slug>). STANDARD has none.
const PKG: Record<string, string> = { FOUNDING: 'founding', LAUNCH: 'launch', INFLUENCER: 'influencer' };
const slugOf = (pkg?: string | null) => PKG[String(pkg || '').toUpperCase()];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const pillFor = (t: T, pkg?: string | null) => t(`_shared.pill.${slugOf(pkg) ? `${slugOf(pkg)}Member` : 'toraMember'}`);

/** Application received: the first email anyone gets from TORA. */
export function buildApplicationReceived(input: { firstName: string; email: string; role: string; lang?: string | null }): BuiltEmail {
  const L = normLang(input.lang); const t = copyFor(L);
  const rk = roleKey(input.role);
  const roleNoun = ['ARTIST', 'AGENT', 'PROMOTER', 'VENUE'].includes(rk) ? t(`applicationReceived.roleNoun.${rk}`) : '';
  return done(t('applicationReceived.subject'), emailShell({
    lang: L, title: t('applicationReceived.pill'), preheader: t('applicationReceived.preheader'),
    eyebrow: pill(t('applicationReceived.pill'), ROLE_COLOR[rk] || '#9A9AA8', 'center'),
    heading: t('applicationReceived.heading', { firstName: input.firstName }),
    lead: t('applicationReceived.lead', { roleNoun }),
    hero: button(t('applicationReceived.button'), 'https://torahub.io/features', 'center'),
    body: stepsOf(t, 'applicationReceived')
      + detailsBox(t('applicationReceived.details.title'), [
        [t('applicationReceived.details.email'), esc(input.email)],
        ...(roleNoun ? [[t('applicationReceived.details.role'), esc(cap(roleWord(t, rk)))] as [string, string]] : []),
        [t('applicationReceived.details.submitted'), esc(formatDay(new Date(), L))],
      ])
      + signoff(linkify(t('applicationReceived.closing')), t('_shared.signoff.team')),
    footReason: t('_shared.footReason.applied'),
  }));
}

/** Pre-launch invitation: profile, verification and public page now, the app at launch. */
export function buildProfileOnlyInvitation(input: { firstName: string; role: string; couponCode: string; couponPackage?: string | null; lang?: string | null }): BuiltEmail {
  const L = normLang(input.lang); const t = copyFor(L);
  const pkg = String(input.couponPackage || '').toUpperCase();
  const giftNote = slugOf(pkg) && `note.gift${cap(slugOf(pkg))}`;
  const host = appUrl().replace(/^https?:\/\//, '');
  return done(t('invitationProfileOnly.subject', { firstName: input.firstName }), emailShell({
    lang: L, icon: 'ticket', title: t('invitationProfileOnly.heading', { firstName: input.firstName }), preheader: t('invitationProfileOnly.preheader'),
    eyebrow: pill(pillFor(t, pkg), ROLE_COLOR[roleKey(input.role)], 'center'),
    heading: t('invitationProfileOnly.heading', { firstName: input.firstName }),
    lead: t('invitationProfileOnly.lead'),
    hero: valueBox(t('_shared.box.invitationCode'), input.couponCode, esc(t('_shared.box.signupAtWithEmail', { appHost: host })), 'center')
      + gap(24) + button(t('invitationProfileOnly.button'), `${appUrl()}/?code=${encodeURIComponent(input.couponCode)}`, 'center'),
    body: stepsOf(t, 'invitationProfileOnly')
      + note(esc(`${t('invitationProfileOnly.note')}${giftNote ? ` ${t(`invitationProfileOnly.${giftNote}`)}` : ''}`)),
    footReason: t('_shared.footReason.accepted'),
  }));
}

/** Full invitation, once TORA is open: the code goes straight into the full app. */
export function buildFullInvitation(input: { firstName: string; role: string; couponCode: string; couponPackage?: string | null; lang?: string | null }): BuiltEmail {
  const L = normLang(input.lang); const t = copyFor(L);
  const pkg = String(input.couponPackage || '').toUpperCase();
  // Complimentary Premium: a gift package, or ADMIN's lifetime (no catalog line, plan name stays English).
  const membership = slugOf(pkg) ? t(`_shared.gift.${slugOf(pkg)}.value`) : pkg === 'ADMIN' ? 'Lifetime Premium' : null;
  const host = appUrl().replace(/^https?:\/\//, '');
  return done(t('invitationFull.subject', { firstName: input.firstName }), emailShell({
    lang: L, icon: 'ticket', title: t('invitationFull.heading', { firstName: input.firstName }), preheader: t('invitationFull.preheader'),
    eyebrow: pill(pillFor(t, pkg), ROLE_COLOR[roleKey(input.role)], 'center'),
    heading: t('invitationFull.heading', { firstName: input.firstName }),
    lead: t('invitationFull.lead'),
    hero: [
      valueBox(t('_shared.box.invitationCode'), input.couponCode, esc(t('_shared.box.signupAtWithEmail', { appHost: host })), 'center'),
      gap(12),
      membership
        ? valueBox(t('invitationFull.box.membership'), membership, esc(t('invitationFull.box.membershipHint')), 'center') + gap(24)
        : gap(12),
      button(t('invitationFull.button'), `${appUrl()}/?code=${encodeURIComponent(input.couponCode)}`, 'center'),
    ].join(''),
    body: stepsOf(t, 'invitationFull') + note(linkify(t('invitationFull.note'))),
    footReason: t('_shared.footReason.accepted'),
  }));
}

export function buildAddProfileReceived({ role, profileName, lang }: { role: string; profileName: string; lang?: string | null }): BuiltEmail {
  const L = normLang(lang); const t = copyFor(L); const r = roleWord(t, role);
  return done(t('addProfileReceived.subject'), emailShell({
    lang: L, icon: 'plus', title: t('addProfileReceived.subject'), preheader: t('addProfileReceived.preheader'),
    heading: t('addProfileReceived.heading', { role: r }),
    lead: t('addProfileReceived.lead', { role: r, profileName }),
    body: stepsOf(t, 'addProfileReceived') + note(linkify(t('addProfileReceived.note'))),
    footReason: t('addProfileReceived.footReason'),
  }));
}

export function buildAddProfileApproved({ role, profileName, lang }: { role: string; profileName: string; lang?: string | null }): BuiltEmail {
  const L = normLang(lang); const t = copyFor(L); const r = roleWord(t, role);
  return done(t('addProfileApproved.subject'), emailShell({
    lang: L, icon: 'plus', title: t('addProfileApproved.subject'), preheader: t('addProfileApproved.preheader', { role: r }),
    heading: t('addProfileApproved.heading', { role: r }),
    lead: t('addProfileApproved.lead', { profileName }),
    body: button(t('_shared.button.openTora'), appUrl()) + gap(20) + note(linkify(t('addProfileApproved.note'))),
    footReason: t('addProfileApproved.footReason'),
  }));
}

export function buildDeclined({ lang }: { lang?: string | null } = {}): BuiltEmail {
  const L = normLang(lang); const t = copyFor(L);
  return done(t('applicationDeclined.subject'), emailShell({
    lang: L, icon: 'mail', title: t('applicationDeclined.subject'), preheader: t('applicationDeclined.preheader'),
    heading: t('applicationDeclined.heading'),
    lead: t('applicationDeclined.lead'),
    body: note(linkify(t('applicationDeclined.note'))),
    footReason: t('_shared.footReason.applied'),
  }));
}
