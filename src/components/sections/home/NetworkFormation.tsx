"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const bodyFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Beats 2–3 — the problem, then the shift. Plain flowing blocks (no pin, no
 * fade): the headlines scroll past like a normal long page over the globe,
 * kept close together so the narrative reads as one continuous movement into
 * the roles beat. Each block carries a soft radial scrim for legibility over
 * the node globe behind.
 *
 * pointer-events-none: purely text, never intercepts clicks meant for the
 * layers around it.
 */
export function NetworkFormation() {
  const { t } = useLanguage();

  const scrim = (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(ellipse 55% 45% at center, rgba(0,0,0,0.55), transparent 70%)" }}
    />
  );

  return (
    <section id="network" className="relative pointer-events-none">
      {/* The tension */}
      <div className="relative min-h-[70vh] flex items-center justify-center px-6">
        {scrim}
        <div className="relative max-w-4xl text-center">
          {/* whitespace-pre-line: the translations break one phrase per line */}
          <h2
            className="whitespace-pre-line text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] uppercase tracking-tight text-white/85"
            style={headingFont}
          >
            {t("home_problem")}
          </h2>
          <p className="whitespace-pre-line mt-6 mx-auto max-w-xl text-white/45 text-sm md:text-base leading-relaxed" style={bodyFont}>
            {t("home_problem_sub")}
          </p>
        </div>
      </div>

      {/* The shift */}
      <div className="relative min-h-[70vh] flex items-center justify-center px-6">
        {scrim}
        <div className="relative max-w-4xl text-center">
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] uppercase tracking-tight text-white"
            style={headingFont}
          >
            {t("home_shift")}
          </h2>
          <p className="whitespace-pre-line mt-6 mx-auto max-w-xl text-infrared/80 text-sm md:text-base leading-relaxed uppercase tracking-widest" style={bodyFont}>
            {t("home_shift_sub")}
          </p>
        </div>
      </div>
    </section>
  );
}
