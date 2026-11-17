/**
 * TORA email shell, design A (Obsidian), as chosen 2026-11-17: dark page,
 * opaque card with a crimson top rule, a small wordmark on its own dark tile
 * (so Gmail's colour inversion can never erase the white logo), the globe
 * mark beside it, one crimson button, and the Instagram icon in the footer.
 *
 * Email-safe on purpose: tables, inline styles, bgcolor attributes and PNG
 * images only (Gmail drops SVG). Server-only — returns an HTML string for
 * Resend's `html` field. Every new email should use this shell; the older
 * react-email templates move onto it one by one.
 */

const ASSETS = 'https://www.torahub.io/email-assets';
const FONT = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const CRIMSON = '#DE2A57';
const C = { bg: '#0A0A0C', card: '#101015', inset: '#0C0C11', line: '#1E1E26', text: '#F2F2F5', mute: '#9A9AA8', dim: '#62626E' };
export const ROLE_COLOR: Record<string, string> = { ARTIST: '#6B5FFF', AGENT: '#00C875', PROMOTER: '#FFB800', VENUE: '#FF5757' };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const p = (html: string, css: string) => `<p style="margin:0;${css}">${html}</p>`;
export const label = (s: string) => p(esc(s), `font:600 11px/14px ${FONT};letter-spacing:0.14em;text-transform:uppercase;color:${C.dim};`);

export const pill = (text: string, color = C.mute) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;"><tr>
    <td style="padding:4px 10px;border-radius:999px;border:1px solid ${color};font:600 11px/14px ${FONT};letter-spacing:0.1em;text-transform:uppercase;color:${color};">&#9679;&nbsp;${esc(text)}</td></tr></table>`;

export const button = (text: string, href: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;"><tr><td bgcolor="${CRIMSON}" style="border-radius:10px;">
    <a href="${esc(href)}" style="display:inline-block;padding:14px 26px;font:600 15px/20px ${FONT};color:#FFFFFF;border-radius:10px;text-decoration:none;">${esc(text)}&nbsp;&rarr;</a></td></tr></table>`;

/** A numbered list of steps: [title, body][]. */
export const steps = (items: [string, string][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
    ${items.map(([title, body], i) => `<tr><td width="34" valign="top" style="padding:0 0 16px;"><div style="width:24px;height:24px;border-radius:12px;border:1px solid ${C.line};font:600 12px/24px ${FONT};color:${C.text};text-align:center;">${i + 1}</div></td>
      <td valign="top" style="padding:2px 0 16px;">${p(esc(title), `margin-bottom:2px;font:600 14px/20px ${FONT};color:${C.text};`)}${p(body, `font:400 13px/19px ${FONT};color:${C.mute};`)}</td></tr>`).join('')}
  </table>`;

/** An inset box: a small label over one big value and an optional line. */
export const valueBox = (title: string, value: string, sub?: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.inset}" style="background:${C.inset};border:1px solid ${C.line};border-radius:12px;border-collapse:separate;">
    <tr><td style="padding:18px 20px;">
      <div style="margin-bottom:6px;">${label(title)}</div>
      ${p(esc(value), `font:700 22px/28px ${FONT};letter-spacing:0.06em;color:${C.text};`)}
      ${sub ? p(sub, `margin-top:4px;font:400 13px/18px ${FONT};color:${C.mute};`) : ''}
    </td></tr></table>`;

export const note = (html: string) =>
  p(html, `border-top:1px solid ${C.line};padding-top:14px;font:400 13px/19px ${FONT};color:${C.dim};`);

export const link = (text: string, href: string) => `<a href="${esc(href)}" style="color:${C.text};text-decoration:underline;">${esc(text)}</a>`;

/**
 * The page around the content. `body` is already-built HTML (use the helpers
 * above); `heading` and `lead` are plain text.
 */
export function emailShell({ title, preheader, eyebrow, heading, lead, body, footReason }: {
  title: string;
  preheader: string;
  eyebrow?: string; // pill HTML
  heading: string;
  lead: string;
  body: string;
  footReason: string;
}): string {
  const header = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td valign="middle"><img src="${ASSETS}/tora-logo-tile.png" width="116" height="36" alt="TORA" style="display:block;width:116px;height:36px;margin-left:-10px;"></td>
        <td valign="middle" style="padding-left:6px;"><img src="${ASSETS}/tora-globe-60.png" width="30" height="30" alt="" style="display:block;width:30px;height:30px;"></td></tr></table></td>
      <td align="right" class="hide-sm" style="font:600 10px/14px ${FONT};letter-spacing:0.22em;color:${C.dim};">WHERE MUSIC MEETS</td></tr></table>`;

  return `<!DOCTYPE html>
<html lang="en">
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
        ${eyebrow || ''}
        <h1 class="h1" style="margin:18px 0 12px;font:700 28px/34px ${FONT};letter-spacing:-0.01em;color:${C.text};">${esc(heading)}</h1>
        ${p(esc(lead), `margin-bottom:24px;font:400 15px/24px ${FONT};color:${C.mute};`)}
        ${body}
      </td></tr></table>
    </td></tr>
    <tr><td class="px" style="padding:24px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td valign="top">
          ${p(esc(footReason), `font:400 12px/18px ${FONT};color:${C.dim};`)}
          ${p(`<a href="mailto:support@torahub.io" style="color:${C.mute};text-decoration:none;">support@torahub.io</a> &middot; <a href="https://torahub.io" style="color:${C.mute};text-decoration:none;">torahub.io</a>`, `margin-top:6px;font:400 12px/18px ${FONT};color:${C.mute};`)}
        </td>
        <td valign="top" align="right" width="44"><a href="https://instagram.com/tora.hub"><img src="${ASSETS}/instagram-tile.png" width="32" height="32" alt="Instagram" style="display:block;width:32px;height:32px;"></a></td>
      </tr></table>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
