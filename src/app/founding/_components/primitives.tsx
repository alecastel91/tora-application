"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import type { ReactNode } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** The one palette, re-exported here so /founding keeps its import surface. */
export { ROLE_COLORS as ROLE } from "@/components/sections/shared/pageParts";

export const supreme = {
  fontFamily:
    "var(--font-supreme), var(--font-space-grotesk), var(--font-rajdhani), sans-serif",
};
export const rajdhani = { fontFamily: "var(--font-rajdhani), sans-serif" };
export const grotesk = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/** Thin infrared bar fixed at the very top, tracking whole-page scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-infrared lg:hidden"
      style={{ scaleX, boxShadow: "0 0 12px rgba(255,51,102,0.7)" }}
    />
  );
}

/** Scroll-reveal wrapper — fade + rise + gentle deblur as it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Small uppercase section eyebrow with an infrared tick. */
export function Eyebrow({
  children,
  color = "#FF3366",
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8" style={{ background: color }} />
      <span
        className="text-[11px] md:text-xs uppercase tracking-[0.32em]"
        style={{ ...supreme, color, fontWeight: 500 }}
      >
        {children}
      </span>
    </div>
  );
}

/**
 * Phone frame the viewer can scroll UP/DOWN inside (real overflow container),
 * starting at the top of the screenshot. Use when we want the reader to explore
 * the full app page at their own pace rather than tie it to page scroll.
 */
export function ScrollInsidePhone({
  src,
  alt,
  glow = "#FF3366",
  className = "",
  frameRatio = 2.05,
  scrollLabel = "Scroll",
}: {
  src: string;
  alt: string;
  glow?: string;
  className?: string;
  frameRatio?: number;
  scrollLabel?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`relative ${className}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[3rem] blur-3xl"
        style={{ background: glow, opacity: 0.16 }}
      />
      <div className="mx-auto w-[230px] sm:w-[260px] rounded-[2.4rem] bg-[#0a0a0f] p-2 shadow-2xl">
        <div
          className="relative overflow-hidden rounded-[1.9rem]"
          style={{ aspectRatio: `1 / ${frameRatio}` }}
        >
          <div
            data-lenis-prevent
            className="h-full w-full overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(255,51,102,0.5)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20"
            tabIndex={0}
            aria-label={alt}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} loading="lazy" className="block w-full" />
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#050505] to-transparent" />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-white/55 backdrop-blur-sm"
          >
            {scrollLabel} ↕
          </span>
        </div>
      </div>
    </motion.div>
  );
}
