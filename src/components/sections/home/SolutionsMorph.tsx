"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { JOURNEY } from "./home.data";
import { useHomeDrawer } from "./HomeDrawer";
import { solutionBoxes, type Box } from "./morphLayout";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const bodyFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Beat 5 desktop — the role clusters regroup into 5 solution clusters (NodeField)
 * while these 5 cards resolve on top, on the shared solutionBoxes layout. Falls
 * back to SolutionsGrid on mobile / reduced motion.
 */
export function SolutionsMorph() {
  const { t } = useLanguage();
  const { open } = useHomeDrawer();
  const ref = useRef<HTMLElement>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);

  useLayoutEffect(() => {
    const measure = () => setBoxes(solutionBoxes(window.innerWidth, window.innerHeight));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const opacity = useTransform(scrollYProgress, [0.04, 0.18, 0.8, 0.94], [0, 1, 1, 0]);
  const eyebrow = useTransform(scrollYProgress, [0.02, 0.12, 0.85, 0.95], [0, 1, 1, 0]);

  return (
    // -95vh overlap: role clusters sweep almost directly into the five solution clusters
    <section id="solutions" ref={ref} className="relative" style={{ height: "220vh", marginTop: "-95vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden pointer-events-none">
        <motion.div
          style={{ opacity: eyebrow }}
          className="absolute top-24 left-1/2 -translate-x-1/2 text-center px-6"
        >
          <span className="text-white/90 text-2xl md:text-3xl font-black uppercase tracking-tight" style={headingFont}>
            {t("home_solutions_title")}
          </span>
        </motion.div>

        {boxes.map((b, i) => {
          const s = JOURNEY[i];
          if (!s) return null;
          return (
            <motion.div
              key={s.id}
              style={{ opacity, position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h }}
              className="group pointer-events-auto flex cursor-pointer flex-col rounded-2xl p-5 text-left transition-transform hover:-translate-y-1"
              onClick={() => open(s.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(s.id); } }}
            >
              {/* Founding-page journey card: neutral glass, numbered step. */}
              <div
                className="absolute inset-0 rounded-2xl backdrop-blur-md transition-colors duration-300 group-hover:border-infrared/60"
                style={{
                  background: "rgba(13,13,18,0.5)", // half-glass: blurred dots read as bokeh, copy stays legible
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <div className="relative flex items-start justify-between">
                <span className="text-4xl font-black leading-none text-infrared" style={headingFont}>
                  {i + 1}
                </span>
                <span className="mt-0.5 opacity-80 [&>svg]:h-[26px] [&>svg]:w-[26px]">{s.icon}</span>
              </div>
              <h3 className="relative mt-4 text-base font-bold uppercase tracking-wide text-white lg:text-lg" style={headingFont}>
                {t(s.titleKey)}
              </h3>
              <p className="relative mt-2 flex-1 text-[13px] leading-relaxed text-white/55" style={bodyFont}>
                {t(s.descKey)}
              </p>
              <span className="relative mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/35 transition-colors group-hover:text-infrared">
                {t("home_tap_explore")}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
