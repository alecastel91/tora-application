"use client";

import Link from "next/link";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const supremeFont = {
  fontFamily: "var(--font-supreme), var(--font-space-grotesk), sans-serif",
};

/**
 * Beat 7 — the close. Restates the invitation and drives to /apply.
 */
export function FinalCtaSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[72vh] flex flex-col items-center justify-center px-6 text-center pt-16 pb-28">
      <SectionReveal>
        <h2
          className="max-w-3xl text-4xl md:text-6xl font-black uppercase tracking-tight text-white"
          style={headingFont}
        >
          {t("home_final_cta_title")}
        </h2>
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <p className="mt-6 max-w-md text-white/50 text-sm md:text-base leading-relaxed" style={supremeFont}>
          {t("home_final_cta_sub")}
        </p>
      </SectionReveal>

      <SectionReveal delay={0.2}>
        <Link
          href="/apply"
          className="inline-block mt-12 px-12 py-4 rounded-full border border-white/60 text-white text-xs font-semibold uppercase tracking-[0.25em] hover:bg-infrared hover:border-infrared hover:text-white transition-all duration-300"
          style={supremeFont}
        >
          {t("apply_for_membership")}
        </Link>
      </SectionReveal>

      <SectionReveal delay={0.3}>
        <a
          href="https://instagram.com/tora.hub"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 text-white/30 hover:text-white transition-colors text-[10px] uppercase tracking-[0.3em]"
          style={supremeFont}
        >
          @tora.hub
        </a>
      </SectionReveal>
    </section>
  );
}
