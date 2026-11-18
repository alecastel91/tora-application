/**
 * TORA email shell, design A (Obsidian), as chosen 2026-11-17: dark page,
 * opaque card with a crimson top rule, a small wordmark on its own dark tile
 * (so Gmail's colour inversion can never erase the white logo), the globe
 * mark beside it, one crimson button, and the Instagram icon in the footer.
 * A member's first emails pass `hero`: the wordmark centred, a big glowing
 * globe, and everything down to the call to action centred (design A1).
 * Main communication uses `hero` with its own big icon; operational emails stay
 * left-aligned with a small icon right of the headline. `icon` names a
 * tora-icon-<name> asset (globe = the brand globe). Twin of
 * tora-backend/src/services/emailShell.js — keep the two in step.
 *
 * Email-safe on purpose: tables, inline styles, bgcolor attributes and PNG
 * images only (Gmail drops SVG). Server-only — returns an HTML string for
 * Resend's `html` field. Every email the website sends uses this shell.
 */

// EMAIL_ASSETS_URL only for local previews; real emails always load the hosted PNGs.
const ASSETS = process.env.EMAIL_ASSETS_URL || 'https://www.torahub.io/email-assets';
const FONT = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const CRIMSON = '#DE2A57';
const C = { bg: '#0A0A0C', card: '#101015', inset: '#0C0C11', line: '#1E1E26', text: '#F2F2F5', mute: '#9A9AA8', dim: '#62626E' };
export const ROLE_COLOR: Record<string, string> = { ARTIST: '#6B5FFF', AGENT: '#00C875', PROMOTER: '#FFB800', VENUE: '#FF5757' };

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const p = (html: string, css: string) => `<p style="margin:0;${css}">${html}</p>`;
export const label = (s: string) => p(esc(s), `font:600 11px/14px ${FONT};letter-spacing:0.14em;text-transform:uppercase;color:${C.dim};`);

type Align = 'left' | 'center';
// Tables only centre in Outlook through the align attribute, so centred pieces ask for it.
const alignAttr = (align: Align) => (align === 'center' ? ' align="center"' : '');

export const pill = (text: string, color = C.mute, align: Align = 'left') =>
  `<table role="presentation"${alignAttr(align)} cellpadding="0" cellspacing="0" style="border-collapse:separate;"><tr>
    <td style="padding:4px 10px;border-radius:999px;border:1px solid ${color};font:600 11px/14px ${FONT};letter-spacing:0.1em;text-transform:uppercase;color:${color};">&#9679;&nbsp;${esc(text)}</td></tr></table>`;

// Padding sits on the cell too: Outlook ignores it on the link and would shrink the button to a strip.
export const button = (text: string, href: string, align: Align = 'left') =>
  `<table role="presentation"${alignAttr(align)} cellpadding="0" cellspacing="0" style="border-collapse:separate;"><tr><td bgcolor="${CRIMSON}" style="border-radius:10px;padding:14px 26px;">
    <a href="${esc(href)}" style="display:inline-block;font:600 15px/20px ${FONT};color:#FFFFFF;text-decoration:none;">${esc(text)}&nbsp;&rarr;</a></td></tr></table>`;

/** A numbered list of steps: [title, body][]. */
export const steps = (items: [string, string][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
    ${items.map(([title, body], i) => `<tr><td width="34" valign="top" style="padding:0 0 16px;"><div style="width:24px;height:24px;border-radius:12px;border:1px solid ${C.line};font:600 12px/24px ${FONT};color:${C.text};text-align:center;">${i + 1}</div></td>
      <td valign="top" style="padding:2px 0 16px;">${p(esc(title), `margin-bottom:2px;font:600 14px/20px ${FONT};color:${C.text};`)}${p(body, `font:400 13px/19px ${FONT};color:${C.mute};`)}</td></tr>`).join('')}
  </table>`;

/** An inset box: a small label over one big value and an optional line (`subHtml` is not escaped). */
export const valueBox = (title: string, value: string, subHtml?: string, align: Align = 'left') =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.inset}" style="background:${C.inset};border:1px solid ${C.line};border-radius:12px;border-collapse:separate;">
    <tr><td align="${align}" style="padding:18px 20px;text-align:${align};">
      <div style="margin-bottom:6px;">${label(title)}</div>
      ${p(esc(value), `font:700 22px/28px ${FONT};letter-spacing:0.06em;color:${C.text};`)}
      ${subHtml ? p(subHtml, `margin-top:4px;font:400 13px/18px ${FONT};color:${C.mute};`) : ''}
    </td></tr></table>`;

export const note = (html: string) =>
  p(html, `border-top:1px solid ${C.line};padding-top:14px;font:400 13px/19px ${FONT};color:${C.dim};`);

export const link = (text: string, href: string) => `<a href="${esc(href)}" style="color:${C.text};text-decoration:underline;">${esc(text)}</a>`;

const centred = (html: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="text-align:center;">${html}</td></tr></table>`;

/**
 * The page around the content. `body` is already-built HTML (use the helpers
 * above); `heading` and `lead` are plain text. `hero` is the centred block
 * under the lead (a code, a button); passing it switches to the hero layout,
 * and its pieces should be built with align 'center' (eyebrow included).
 */
export type EmailIcon = 'globe' | 'ticket' | 'check' | 'clock' | 'spark' | 'crown' | 'people' | 'contract' | 'receipt' | 'lock' | 'hourglass' | 'pause' | 'card' | 'shield' | 'plus' | 'mail';
const iconSrc = (icon: EmailIcon, size: 'hero' | '60') => (icon === 'globe'
  ? `${ASSETS}/${size === 'hero' ? 'tora-globe-hero' : 'tora-globe-60'}.png`
  : `${ASSETS}/tora-icon-${icon}-${size}.png`);

export function emailShell({ title, preheader, eyebrow, heading, lead, hero, body, footReason, icon = 'globe', lang = 'en' }: {
  title: string;
  preheader: string;
  eyebrow?: string; // pill HTML
  heading: string;
  lead?: string;
  hero?: string;
  body: string;
  footReason: string;
  icon?: EmailIcon;
  lang?: string;
}): string {
  const header = hero !== undefined
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
        <img src="${ASSETS}/tora-logo-tile.png" width="140" height="43" alt="TORA" style="display:block;margin:0 auto;width:140px;height:43px;"></td></tr></table>`
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td valign="middle"><img src="${ASSETS}/tora-logo-tile.png" width="116" height="36" alt="TORA" style="display:block;width:116px;height:36px;margin-left:-10px;"></td>
        <td valign="middle" style="padding-left:6px;"><img src="${ASSETS}/tora-globe-60.png" width="30" height="30" alt="" style="display:block;width:30px;height:30px;"></td></tr></table></td></tr></table>`;

  const h1 = (align: string) =>
    `<h1 class="h1" style="margin:18px 0 12px;font:700 28px/34px ${FONT};letter-spacing:-0.01em;color:${C.text};text-align:${align};">${esc(heading)}</h1>`;
  const intro = hero !== undefined
    ? centred(`<img src="${iconSrc(icon, 'hero')}" width="180" height="180" alt="" style="display:block;margin:-8px auto 4px;width:180px;height:180px;">
        ${eyebrow || ''}${h1('center')}
        ${lead ? p(esc(lead), `margin:0 auto 24px;max-width:440px;font:400 15px/24px ${FONT};color:${C.mute};text-align:center;`) : ''}
        ${hero}`) + (body ? '<div style="height:8px;line-height:8px;">&nbsp;</div>' : '')
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td valign="top">${eyebrow || ''}${h1('left')}</td>
        <td valign="top" align="right" width="56" style="padding-top:4px;"><img src="${iconSrc(icon, '60')}" width="44" height="44" alt="" style="display:block;width:44px;height:44px;"></td></tr></table>
        ${lead ? p(esc(lead), `margin-bottom:24px;font:400 15px/24px ${FONT};color:${C.mute};`) : ''}`;

  return `<!DOCTYPE html>
<html lang="${esc(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(title)}</title>
<style>
  :root{color-scheme:dark;supported-color-schemes:dark;}
  body{margin:0;padding:0;-webkit-text-size-adjust:100%;}
  table{border-collapse:collapse;} img{border:0;outline:none;}
  @media only screen and (max-width:620px){
    .px{padding-left:20px!important;padding-right:20px!important;}
    .h1{font-size:24px!important;line-height:30px!important;}
    .hide-sm{display:none!important;}
  }
</style>
</head>
<body bgcolor="${C.bg}" style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.bg}" style="background:${C.bg};">
<tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
    <tr><td class="px" style="padding:0 32px 20px;">${header}</td></tr>
    <tr><td bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.line};border-top:3px solid ${CRIMSON};border-radius:16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td class="px" style="padding:32px;">
        ${intro}
        ${body}
      </td></tr></table>
    </td></tr>
    <tr><td class="px" align="center" style="padding:28px 32px 0;text-align:center;">
      ${p(esc(footReason), `font:400 12px/18px ${FONT};color:${C.dim};text-align:center;`)}
      ${p(`<a href="mailto:support@torahub.io" style="color:${C.mute};text-decoration:none;">support@torahub.io</a> &middot; <a href="https://torahub.io" style="color:${C.mute};text-decoration:none;">torahub.io</a>`, `margin-top:6px;font:400 12px/18px ${FONT};color:${C.mute};text-align:center;`)}
      <a href="https://instagram.com/tora.hub"><img src="${ASSETS}/instagram-tile.png" width="32" height="32" alt="Instagram" style="display:block;margin:16px auto 12px;width:32px;height:32px;"></a>
      ${p('WHERE MUSIC MEETS', `font:600 10px/14px ${FONT};letter-spacing:0.22em;color:${C.dim};text-align:center;`)}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

/** Plain-text twin of an email built with this shell: the visible words and every link, in reading order. */
export function htmlToText(html: string): string {
  return html
    .replace(/<head>[\s\S]*?<\/head>/i, '')
    .replace(/<div style="display:none[^>]*>[\s\S]*?<\/div>/i, '')
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, label: string) => {
      const l = label.replace(/<[^>]+>/g, '').replace(/&nbsp;&rarr;|&rarr;/g, '').trim();
      // A label that is the link itself ("torahub.io") prints once, as the full URL.
      if (!l || href.replace(/^https?:\/\//, '').startsWith(l)) return href;
      return href.startsWith('mailto:') ? l : `${l}: ${href}`;
    })
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h1|tr|table|div)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&#9679;/g, '').replace(/&rarr;/g, '→')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter((l, i, a) => l || (a[i - 1] && a[i - 1].trim()))
    .join('\n').replace(/^(\d)\n+/gm, '$1. ').replace(/\n{3,}/g, '\n\n').trim();
}
