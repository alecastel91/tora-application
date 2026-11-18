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

export type EmailLang = 'en' | 'ja' | 'zh' | 'ko' | 'es' | 'fr' | 'it' | 'pt';
type Catalog = Record<string, Record<string, string | string[]>>;
const CATALOG: Record<EmailLang, Catalog> = { en, ja, zh, ko, es, fr, it, pt } as Record<EmailLang, Catalog>;
const LOCALE: Record<EmailLang, string> = { en: 'en-GB', ja: 'ja-JP', zh: 'zh-CN', ko: 'ko-KR', es: 'es-ES', fr: 'fr-FR', it: 'it-IT', pt: 'pt-BR' };
// The site's picker codes (JP/CN/KR…) map onto the app's.
const ALIAS: Record<string, EmailLang> = { jp: 'ja', cn: 'zh', kr: 'ko' };
const NAME_VARS = ['firstName', 'name'];

export function normLang(lang?: string | null): EmailLang {
  const l = String(lang || '').toLowerCase().slice(0, 2);
  const code = ALIAS[l] || l;
  return (code in CATALOG ? code : 'en') as EmailLang;
}

function fill(str: string, vars: Record<string, string | number | undefined | null>) {
  let s = str;
  // An empty name drops the name and the comma or honorific around it.
  for (const v of NAME_VARS) {
    if (s.includes(`{{${v}}}`) && !String(vars[v] ?? '').trim()) {
      // "Thanks, {{name}}." → "Thanks." · "Hi {{name}}, after…" → "Hi, after…" · "{{name}}さん、…" → "…"
      const left = new RegExp(`[,，、]\\s*\\{\\{${v}\\}\\}\\s*(さん|님)?`);
      s = (left.test(s) ? s.replace(left, '') : s.replace(new RegExp(`\\s*\\{\\{${v}\\}\\}\\s*(さん|님)?`), ''))
        .replace(/^[\s,，、]+/, '').replace(/\s{2,}/g, ' ').replace(/\s+([.,!?:;。、！？])/g, '$1').trim();
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
  date.toLocaleDateString(LOCALE[normLang(lang)], { day: 'numeric', month: 'long', year: 'numeric' });
