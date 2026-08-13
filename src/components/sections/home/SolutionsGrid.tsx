"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { JOURNEY } from "./home.data";
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

        {/* One step per row on phones — founding-page journey rows: number
            left, copy right, in sequence. */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3" style={bodyFont}>
          {JOURNEY.map((s, i) => (
            <SectionReveal key={s.id} delay={i * 0.05}>
              <div
                onClick={() => open(s.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(s.id); } }}
                className="group relative flex h-full cursor-pointer flex-row items-start gap-4 rounded-2xl border border-white/10 bg-[#0d0d12]/50 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-infrared/60"
              >
                <span className="shrink-0 text-3xl font-black leading-none text-infrared" style={headingFont}>
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold uppercase tracking-wide text-white" style={headingFont}>{t(s.titleKey)}</h3>
                    <span className="shrink-0 opacity-80 [&>svg]:h-[22px] [&>svg]:w-[22px]">{s.icon}</span>
                  </div>
                  <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-white/55">{t(s.descKey)}</p>
                  <span className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/35 transition-colors group-hover:text-infrared">
                    {t("home_tap_explore")}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
