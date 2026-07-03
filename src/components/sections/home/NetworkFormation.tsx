"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const bodyFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Beats 2–3 — the problem, then the shift. Phase-1 version: stacked scroll
 * reveals. Phase 2 upgrades this into a pinned scene where pink nodes scatter
 * (problem) then connect into the network (shift).
 */
export function NetworkFormation() {
  const { t } = useLanguage();

  return (
    <section id="network" className="relative scroll-mt-20">
      {/* The tension */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <SectionReveal>
          <h2
            className="max-w-3xl text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] uppercase tracking-tight text-white/85"
            style={headingFont}
          >
            {t("home_problem")}
          </h2>
        </SectionReveal>
        <SectionReveal delay={0.1}>
          <p className="mt-6 max-w-xl text-white/45 text-sm md:text-base leading-relaxed" style={bodyFont}>
            {t("home_problem_sub")}
          </p>
        </SectionReveal>
      </div>

      {/* The shift */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <SectionReveal>
          <h2
            className="max-w-4xl text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] uppercase tracking-tight text-white"
            style={headingFont}
          >
            {t("home_shift")}
          </h2>
        </SectionReveal>
        <SectionReveal delay={0.1}>
          <p className="mt-6 max-w-xl text-infrared/80 text-sm md:text-base leading-relaxed uppercase tracking-widest" style={bodyFont}>
            {t("home_shift_sub")}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
