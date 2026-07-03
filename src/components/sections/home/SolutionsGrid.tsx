"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOLUTIONS } from "./home.data";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const bodyFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Beat 5 fallback — the 5 solutions as a responsive grid. Used on mobile and
 * under reduced motion (SolutionsRail handles the desktop horizontal scroll).
 */
export function SolutionsGrid() {
  const { t } = useLanguage();

  return (
    <section id="solutions" className="relative scroll-mt-20 py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionReveal className="text-center mb-14">
          <h2 className="max-w-3xl mx-auto text-3xl md:text-5xl font-black uppercase tracking-tight text-white" style={headingFont}>
            {t("home_solutions_title")}
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={bodyFont}>
          {SOLUTIONS.map((s, i) => (
            <SectionReveal key={s.id} delay={i * 0.05}>
              <GlassCard className="border-white/5 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                    {s.icon}
                  </div>
                  <span className="text-infrared text-sm font-bold uppercase tracking-widest">{t(s.titleKey)}</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mt-4">{t(s.descKey)}</p>
              </GlassCard>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
