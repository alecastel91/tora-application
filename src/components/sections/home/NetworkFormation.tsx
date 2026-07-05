"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const bodyFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Beats 2–3 — the problem, then the shift. A tall pinned section: as it scrolls,
 * the NodeField (fixed canvas behind) reads this section's position and animates
 * the pink nodes from scattered → connected, while the two headlines cross-fade
 * over the top. NodeField and this component both key off #network, so they stay
 * in sync without wiring.
 */
export function NetworkFormation() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // True crossfade: the fades overlap around p=0.47 (no dead frame between the
  // two headlines) and each hands off through a soft blur, so the swap reads as
  // one continuous dissolve rather than a cut.
  const problemOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1, 0]);
  const problemY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);
  const problemFilter = useTransform(scrollYProgress, [0.3, 0.5], ["blur(0px)", "blur(10px)"]);
  const shiftOpacity = useTransform(scrollYProgress, [0.44, 0.64, 1], [0, 1, 1]);
  const shiftY = useTransform(scrollYProgress, [0.44, 0.68], [40, 0]);
  const shiftFilter = useTransform(scrollYProgress, [0.44, 0.64], ["blur(10px)", "blur(0px)"]);

  return (
    <section id="network" ref={ref} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-6">
        {/* Soft scrim so the headlines stay legible over the node globe behind */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 55% 45% at center, rgba(0,0,0,0.55), transparent 70%)" }}
        />
        {/* The tension */}
        <motion.div
          style={{ opacity: problemOpacity, y: problemY, filter: problemFilter }}
          className="absolute max-w-3xl text-center"
        >
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] uppercase tracking-tight text-white/85"
            style={headingFont}
          >
            {t("home_problem")}
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-white/45 text-sm md:text-base leading-relaxed" style={bodyFont}>
            {t("home_problem_sub")}
          </p>
        </motion.div>

        {/* The shift */}
        <motion.div
          style={{ opacity: shiftOpacity, y: shiftY, filter: shiftFilter }}
          className="absolute max-w-4xl text-center"
        >
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] uppercase tracking-tight text-white"
            style={headingFont}
          >
            {t("home_shift")}
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-infrared/80 text-sm md:text-base leading-relaxed uppercase tracking-widest" style={bodyFont}>
            {t("home_shift_sub")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
