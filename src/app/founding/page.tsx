import type { Metadata } from "next";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { FoundingExperience } from "./_components/FoundingExperience";

/**
 * Unlisted founding-members presentation — a scroll-driven adaptation of the
 * TORA deck. Not linked from any nav, excluded from sitemap.ts, disallowed in
 * robots.ts, and noindex, so it's reachable only via the shared link.
 */

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

export default function FoundingPage() {
  return (
    <LenisProvider>
      <FoundingExperience />
    </LenisProvider>
  );
}
