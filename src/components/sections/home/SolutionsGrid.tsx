"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOLUTIONS } from "./home.data";
import { useHomeDrawer } from "./HomeDrawer";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const bodyFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Beat 5 fallback — the 5 solutions as a responsive grid. Used on mobile and
 * under reduced motion (SolutionsRail handles the desktop horizontal scroll).
 */
export function SolutionsGrid() {
  const { t } = useLanguage();
  const { open } = useHomeDrawer();

  return (
    <section id="solutions" className="relative scroll-mt-20 py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionReveal className="text-center mb-14">
          <h2 className="max-w-3xl mx-auto text-3xl md:text-5xl font-black uppercase tracking-tight text-white" style={headingFont}>
            {t("home_solutions_title")}
          </h2>
        </SectionReveal>

        {/* One solution per row on phones — the 5 steps read as a sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={bodyFont}>
          {SOLUTIONS.map((s, i) => (
            <SectionReveal key={s.id} delay={i * 0.05}>
              <div
                onClick={() => open(s.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(s.id); } }}
                className="group h-full cursor-pointer"
              >
                <GlassCard className="border-white/5 h-full transition-colors group-hover:border-infrared/40">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                      {s.icon}
                    </div>
                    <span className="text-infrared text-sm font-bold uppercase tracking-widest">{t(s.titleKey)}</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mt-4">{t(s.descKey)}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/35 transition-colors group-hover:text-white/70">
                    Tap to explore
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </GlassCard>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
