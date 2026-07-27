import type { Metadata } from "next";
import Image from "next/image";

/**
 * Unlisted founding-members deck page.
 * - Not linked from any nav, excluded from sitemap.ts, disallowed in robots.ts.
 * - `noindex` so it never lands in search results.
 * - The deck itself is a static PDF at /public/founding/tora-deck.pdf — swap that
 *   file to update the deck without changing the link.
 */

const DECK_URL = "/founding/tora-deck.pdf";

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

const supremeFont = {
  fontFamily:
    "var(--font-supreme), var(--font-space-grotesk), var(--font-rajdhani), sans-serif",
};
const bodyFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

export default function FoundingPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-5 py-16 md:py-20">
      {/* Header */}
      <header className="flex flex-col items-center text-center max-w-2xl">
        <Image
          src="/tora_logo_transparent.png"
          alt="TORA"
          width={500}
          height={166}
          className="w-[220px] md:w-[300px] h-auto object-contain"
          priority
        />

        <span
          className="mt-8 text-infrared text-[11px] md:text-[12px] uppercase tracking-[0.32em]"
          style={{ ...supremeFont, fontWeight: 400 }}
        >
          Founding Members
        </span>

        <h1
          className="mt-4 text-2xl md:text-4xl font-semibold leading-tight text-white"
          style={supremeFont}
        >
          You&rsquo;re among the first.
        </h1>

        <p
          className="mt-4 text-white/55 text-sm md:text-base leading-relaxed max-w-xl"
          style={bodyFont}
        >
          A closer look at what we&rsquo;re building — the professional network for the
          club music industry — and why the people who join at the start shape what it
          becomes.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={DECK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full bg-infrared text-white text-[11px] font-semibold uppercase tracking-[0.22em] hover:opacity-90 transition-opacity"
            style={supremeFont}
          >
            Open the deck
          </a>
          <a
            href={DECK_URL}
            download
            className="px-8 py-3 rounded-full border border-white/40 text-white text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-white/10 transition-colors"
            style={supremeFont}
          >
            Download PDF
          </a>
        </div>
      </header>

      {/* Embedded deck — desktop/tablet only; mobile browsers render inline PDFs
          unreliably, so there the buttons above are the path in. */}
      <div className="hidden md:block w-full max-w-5xl mt-14">
        <div className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] shadow-2xl">
          <iframe
            src={`${DECK_URL}#view=FitH&toolbar=1`}
            title="TORA — Founding Members deck"
            className="w-full h-[80vh]"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 flex flex-col items-center gap-2 text-center">
        <span
          className="text-white/40 text-[10px] uppercase tracking-[0.3em]"
          style={supremeFont}
        >
          Where Music Meets
        </span>
        <a
          href="mailto:support@torahub.io"
          className="text-white/35 text-xs hover:text-white/70 transition-colors"
          style={bodyFont}
        >
          support@torahub.io
        </a>
      </footer>
    </main>
  );
}
