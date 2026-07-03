"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOLUTIONS } from "./home.data";
import { solutionBoxes, type Box } from "./morphLayout";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const bodyFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };
const supremeFont = { fontFamily: "var(--font-supreme), var(--font-space-grotesk), sans-serif" };

/**
 * Beat 5 desktop — the role clusters regroup into 5 solution clusters (NodeField)
 * while these 5 cards resolve on top, on the shared solutionBoxes layout. Falls
 * back to SolutionsGrid on mobile / reduced motion.
 */
export function SolutionsMorph() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);

  useLayoutEffect(() => {
    const measure = () => setBoxes(solutionBoxes(window.innerWidth, window.innerHeight));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.28, 0.72, 0.9], [0, 1, 1, 0]);
  const eyebrow = useTransform(scrollYProgress, [0.06, 0.2, 0.8, 0.92], [0, 1, 1, 0]);

  return (
    <section id="solutions" ref={ref} className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ opacity: eyebrow }}
          className="absolute top-24 left-1/2 -translate-x-1/2 text-center px-6"
        >
          <span className="text-white/45 text-[11px] md:text-xs uppercase tracking-[0.3em]" style={supremeFont}>
            {t("home_solutions_title")}
          </span>
        </motion.div>

        {boxes.map((b, i) => {
          const s = SOLUTIONS[i];
          if (!s) return null;
          return (
            <motion.div
              key={s.id}
              style={{ opacity, position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h }}
              className="rounded-xl p-5 flex flex-col"
            >
              <div className="absolute inset-0 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-sm" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-infrared/40" />
              <div className="relative text-white/15 text-3xl font-black tabular-nums leading-none" style={headingFont}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="relative mt-auto">
                <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                  {s.icon}
                </div>
                <div className="text-infrared text-sm font-bold uppercase tracking-widest mb-2">{t(s.titleKey)}</div>
                <p className="text-white/65 text-[13px] leading-relaxed" style={bodyFont}>
                  {t(s.descKey)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
