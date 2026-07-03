"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const bodyFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Beat 6 — the ethos. Invite-only / curated positioning that sets up the Apply CTA.
 */
export function EthosSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <SectionReveal>
        <div className="laser-line w-24 h-px mx-auto mb-10 opacity-60" />
      </SectionReveal>
      <SectionReveal>
        <h2
          className="max-w-3xl text-3xl md:text-5xl font-black uppercase tracking-tight text-white"
          style={headingFont}
        >
          {t("home_ethos_title")}
        </h2>
      </SectionReveal>
      <SectionReveal delay={0.1}>
        <p className="mt-6 max-w-xl text-white/50 text-sm md:text-base leading-relaxed" style={bodyFont}>
          {t("home_ethos_sub")}
        </p>
      </SectionReveal>
    </section>
  );
}
