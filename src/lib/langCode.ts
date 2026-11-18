/**
 * The app's language codes for TORA emails (en ja zh ko es fr it pt). Kept
 * apart from emailCopy so client code can use it without bundling the catalogs.
 */
export type EmailLang = 'en' | 'ja' | 'zh' | 'ko' | 'es' | 'fr' | 'it' | 'pt';
const LANGS: EmailLang[] = ['en', 'ja', 'zh', 'ko', 'es', 'fr', 'it', 'pt'];
// The site's picker codes (JP/CN/KR…) map onto the app's.
const ALIAS: Record<string, EmailLang> = { jp: 'ja', cn: 'zh', kr: 'ko' };

export function normLang(lang?: string | null): EmailLang {
  const l = String(lang || '').toLowerCase().slice(0, 2);
  const code = ALIAS[l] || l;
  return (LANGS as string[]).includes(code) ? (code as EmailLang) : 'en';
}
