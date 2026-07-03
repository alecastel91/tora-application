"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOLUTIONS } from "./home.data";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const bodyFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };
const supremeFont = { fontFamily: "var(--font-supreme), var(--font-space-grotesk), sans-serif" };

/**
 * Beat 5 desktop — a pinned section whose card track scrolls horizontally as you
 * scroll down. Section height = viewport + horizontal travel, so vertical scroll
 * maps ~1:1 to sideways movement. Falls back to SolutionsGrid on mobile / reduced
 * motion. Travel is measured (ResizeObserver) so it stays correct on resize.
 */
export function SolutionsRail() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distanceRef = useRef(0);
  const [viewportH, setViewportH] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 800));
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      distanceRef.current = d;
      setDistance(d);
      setViewportH(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Read the latest measured distance each frame (survives resize).
  const x = useTransform(scrollYProgress, (v) => -(v * distanceRef.current));

  return (
    <section id="solutions" ref={sectionRef} style={{ height: viewportH + distance }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center px-6">
          <span className="text-white/40 text-[11px] md:text-xs uppercase tracking-[0.3em]" style={supremeFont}>
            {t("home_solutions_title")}
          </span>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex items-center gap-6 px-[8vw] will-change-transform">
          {SOLUTIONS.map((s, i) => (
            <div
              key={s.id}
              className="glass-card relative shrink-0 w-[78vw] max-w-[440px] md:w-[440px] h-[58vh] max-h-[440px] p-8 md:p-10 flex flex-col"
              style={bodyFont}
            >
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-infrared/40" />
              <div className="text-white/20 text-5xl md:text-6xl font-black tabular-nums" style={headingFont}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-auto">
                <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                  <div className="scale-125">{s.icon}</div>
                </div>
                <div className="text-infrared text-lg font-bold uppercase tracking-widest mb-3">{t(s.titleKey)}</div>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">{t(s.descKey)}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
