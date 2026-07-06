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
              className="rounded-2xl p-4 flex flex-col overflow-hidden"
            >
              {/* Dark glass, same family as the role cards */}
              <div
                className="absolute inset-0 rounded-2xl backdrop-blur-md"
                style={{
                  background: "linear-gradient(165deg, rgba(13,13,18,0.88), rgba(13,13,18,0.66))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 0 60px -26px rgba(255,51,102,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-infrared/50" />

              <div className="relative flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,51,102,0.07)", border: "1px solid rgba(255,51,102,0.28)" }}
                >
                  {s.icon}
                </div>
                <div className="text-white/[0.13] text-2xl font-black tabular-nums leading-none" style={headingFont}>
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="relative mt-auto">
                <div className="text-infrared text-[13px] font-bold uppercase tracking-[0.2em] mb-1.5">{t(s.titleKey)}</div>
                <p className="text-white/55 text-xs leading-snug" style={bodyFont}>
                  {t(s.descKey)}
                </p>
                {/* Step indicator — the five solutions are the booking pipeline, in order */}
                <div className="flex items-center gap-1.5 mt-3.5">
                  {SOLUTIONS.map((_, d) => (
                    <span
                      key={d}
                      className={`h-[3px] rounded-full transition-none ${d === i ? "w-5 bg-infrared" : "w-[3px] bg-white/20"}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
