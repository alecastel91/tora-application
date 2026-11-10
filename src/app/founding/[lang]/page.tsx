import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { FoundingExperience } from "../_components/FoundingExperience";
import { CONTENT, LANGS } from "../_content";
import type { LangCode } from "../_content/types";
import EN from "@/translations/EN.json";
import ES from "@/translations/ES.json";
import FR from "@/translations/FR.json";
import IT from "@/translations/IT.json";
import PT from "@/translations/PT.json";
import JP from "@/translations/JP.json";
import CN from "@/translations/CN.json";
import KR from "@/translations/KR.json";

/**
 * The five screens the homepage shows, in the homepage's order, read from the
 * site catalogue rather than restated in FoundingContent — the strings are
 * already natively reviewed in all eight languages, so this page says what the
 * homepage says without a single new key to translate. Server-side only: the
 * catalogues never reach the browser.
 */
const CATALOGUE: Record<LangCode, Record<string, string>> = {
  en: EN, es: ES, fr: FR, it: IT, pt: PT, jp: JP, cn: CN, kr: KR,
};

const JOURNEY_KEYS = [
  ["home_journey_discover_title", "home_journey_discover_desc"],
  ["feature_calendar_title", "feature_calendar_desc"],
  ["feature_tour_title", "feature_tour_desc"],
  ["home_journey_offer_title", "home_journey_offer_desc"],
  ["feature_contracts_title", "home_journey_confirmed_desc"],
] as const;

/**
 * Unlisted founding-members presentation, one static page per language at
 * /founding/<lang>. Not linked from any nav, excluded from sitemap.ts,
 * disallowed in robots.ts, and noindex — reachable only via the shared link.
 * The language lives in the URL so a link can be sent in a recipient's language.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((l) => ({ lang: l.code }));
}

export const metadata: Metadata = {
  title: "Founding Members",
  description:
    "A closer look at TORA — the professional network for the club music industry.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "TORA — Founding Members",
    description:
      "A closer look at TORA — the professional network for the club music industry.",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TORA — Founding Members",
    description:
      "A closer look at TORA — the professional network for the club music industry.",
    images: ["/opengraph-image.png"],
  },
};

export default async function FoundingLangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const content = CONTENT[lang as LangCode];
  if (!content) notFound();

  const cat = CATALOGUE[lang as LangCode];
  const journey = JOURNEY_KEYS.map(([title, body]) => ({
    title: cat[title],
    body: cat[body],
  }));

  return (
    <LenisProvider>
      <FoundingExperience content={content} lang={lang as LangCode} journey={journey} />
    </LenisProvider>
  );
}
