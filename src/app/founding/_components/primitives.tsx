"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

export const ROLE = {
  artist: "#6B5FFF",
  agent: "#00C875",
  promoter: "#FFB800",
  venue: "#FF5757",
} as const;

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
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-infrared"
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

/** Section wrapper — consistent vertical rhythm + max width. */
export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32 ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * Phone device frame around an app screenshot, with a soft role-colored glow.
 * Screenshots are pre-cropped beta captures (no TEST banner).
 */
export function PhoneFrame({
  src,
  alt,
  glow = "#FF3366",
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  glow?: string;
  className?: string;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Gentle vertical float as the device passes through the viewport.
  const drift = useTransform(scrollYProgress, [0, 1], [34, -34]);
  const y = useSpring(drift, { stiffness: 60, damping: 20, restDelta: 0.001 });

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, rotateX: 8 }}
      whileInView={{ opacity: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{ perspective: 1200 }}
    >
      <motion.div style={reduce ? undefined : { y }}>
        {/* ambient glow — soft pulse in the role accent */}
        <motion.div
          aria-hidden
          className="absolute -inset-8 -z-10 rounded-[3rem] blur-3xl"
          style={{ background: glow }}
          initial={{ opacity: 0.14 }}
          animate={reduce ? { opacity: 0.14 } : { opacity: [0.11, 0.22, 0.11] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="mx-auto w-[230px] sm:w-[260px] rounded-[2.4rem] border border-white/12 bg-[#050505] p-2 shadow-2xl">
          <div className="overflow-hidden rounded-[1.9rem] border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Phone frame whose (tall) screenshot scrolls INSIDE the frame as the section
 * passes through the viewport — reveals a full app page without taking the whole
 * page height. `imgRatio` = screenshot height/width (so we know how far to travel).
 * Under reduced motion the frame simply shows the top of the screenshot.
 */
export function ScrollablePhone({
  src,
  alt,
  imgRatio,
  glow = "#FF3366",
  className = "",
  frameRatio = 2.16,
}: {
  src: string;
  alt: string;
  imgRatio: number;
  glow?: string;
  className?: string;
  frameRatio?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // travel = fraction of the image height that must slide up so the bottom
  // reaches the frame bottom. translateY percentages are relative to the img.
  const maxShift = Math.max(0, (1 - frameRatio / imgRatio) * 100);
  const raw = useTransform(scrollYProgress, [0.1, 0.9], ["0%", `-${maxShift}%`]);
  const y = useSpring(raw, { stiffness: 80, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      ref={ref}
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
      <div className="mx-auto w-[230px] sm:w-[260px] rounded-[2.4rem] border border-white/12 bg-[#050505] p-2 shadow-2xl">
        <div
          className="relative overflow-hidden rounded-[1.9rem] border border-white/5"
          style={{ aspectRatio: `1 / ${frameRatio}` }}
        >
          <motion.img
            src={src}
            alt={alt}
            loading="lazy"
            className="absolute left-0 top-0 block w-full"
            style={reduce ? undefined : { y }}
          />
          {/* top/bottom fades so the internal scroll reads as a viewport */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#050505] to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}
