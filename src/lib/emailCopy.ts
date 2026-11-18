/**
 * Email copy in the member's language — twin of tora-backend's
 * src/services/emailCopy.js, reading the same reviewed catalogs
 * (./email-i18n, natively checked 2026-11-18). A missing translation falls
 * back to English; a key missing from English too throws.
 */
import en from './email-i18n/en.json';
import ja from './email-i18n/ja.json';
import zh from './email-i18n/zh.json';
import ko from './email-i18n/ko.json';
import es from './email-i18n/es.json';
import fr from './email-i18n/fr.json';
import it from './email-i18n/it.json';
import pt from './email-i18n/pt.json';
import { normLang, type EmailLang } from './langCode';

export { normLang, type EmailLang };

type Catalog = Record<string, Record<string, string | string[]>>;
const CATALOG: Record<EmailLang, Catalog> = { en, ja, zh, ko, es, fr, it, pt } as Record<EmailLang, Catalog>;
const LOCALE: Record<EmailLang, string> = { en: 'en-GB', ja: 'ja-JP', zh: 'zh-CN', ko: 'ko-KR', es: 'es-ES', fr: 'fr-FR', it: 'it-IT', pt: 'pt-BR' };
const NAME_VARS = ['firstName', 'name'];

function fill(str: string, vars: Record<string, string | number | undefined | null>) {
  let s = str;
  // An empty name drops the name and the comma or honorific around it.
  for (const v of NAME_VARS) {
    if (s.includes(`{{${v}}}`) && !String(vars[v] ?? '').trim()) {
      // "Thanks, {{name}}." → "Thanks." · "Hi {{name}}, after…" → "Hi, after…" · "{{name}}さん、…" → "…"
      // Only the spot where the name was is tidied: French keeps its space before ; : ! ?
      const left = new RegExp(`[,，、]\\s*\\{\\{${v}\\}\\}\\s*(さん|님)?`);
      s = (left.test(s) ? s.replace(left, '\u0000') : s.replace(new RegExp(`\\s*\\{\\{${v}\\}\\}\\s*(さん|님)?`), '\u0000'))
        .replace(/^[\s,，、]*\u0000[\s,，、]*/, '').replace(/\s*\u0000\s*([.,!?:;。、！？])/, '$1').replace(/\s*\u0000\s*/, ' ').trim();
      s = s.charAt(0).toUpperCase() + s.slice(1);
    }
  }
  return s.replace(/\{\{(\w+)\}\}/g, (_, v) => (vars[v] == null ? '' : String(vars[v])));
}

export type T = (path: string, vars?: Record<string, string | number | undefined | null>) => string;

/** `t('applicationReceived.lead', { roleNoun })` in `lang`. */
export function copyFor(lang?: string | null): T {
  const L = normLang(lang);
  return (path, vars = {}) => {
    const dot = path.indexOf('.');
    const group = path.slice(0, dot); const key = path.slice(dot + 1);
    const str = CATALOG[L][group]?.[key] ?? CATALOG.en[group]?.[key];
    if (typeof str !== 'string') throw new Error(`Missing email copy: ${path}`);
    return fill(str, vars);
  };
}

export const formatDay = (date: Date, lang?: string | null) =>
  // Pinned to UTC like the backend twin: the same date never prints a day apart.
  date.toLocaleDateString(LOCALE[normLang(lang)], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
