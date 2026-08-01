import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { FoundingExperience } from "../_components/FoundingExperience";
import { CONTENT, LANGS } from "../_content";
import type { LangCode } from "../_content/types";

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

  return (
    <LenisProvider>
      <FoundingExperience content={content} lang={lang as LangCode} />
    </LenisProvider>
  );
}
