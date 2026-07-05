"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { scrollToId } from "@/lib/scroll";

const EASE_TORA = [0.16, 1, 0.3, 1] as const;
const supremeFont = {
  fontFamily: "var(--font-supreme), var(--font-space-grotesk), var(--font-rajdhani), sans-serif",
};

/**
 * Beat 1 — the existing hero, kept visually identical, plus a scroll-exit fade:
 * the logo group dissolves and drifts up as you scroll past, handing off to the
 * network-formation beat below.
 */
export function HeroSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section id="top" ref={ref} className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div style={{ opacity, y }} className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: EASE_TORA }}
        >
          <Image
            src="/tora_logo_transparent.png"
            alt="TORA"
            width={500}
            height={166}
            className="w-[280px] md:w-[400px] h-auto object-contain"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-2 md:mt-1"
        >
          <span
            className="text-white text-[12px] md:text-[14px] tracking-[0.22em] uppercase whitespace-nowrap"
            style={{ ...supremeFont, fontWeight: 400, letterSpacing: "0.22em" }}
          >
            {t("where_music_meets")}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-16"
        >
          <Link
            href="/apply"
            className="px-10 py-3 rounded-full border border-white/60 text-white text-[11px] font-semibold uppercase tracking-[0.25em] hover:bg-infrared hover:border-infrared hover:text-white transition-all duration-300"
            style={supremeFont}
          >
            {t("apply_for_membership")}
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        aria-label="Scroll"
        onClick={() => scrollToId("network")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{ opacity }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/30 hover:text-white transition-colors"
      >
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 5v14" />
          <path d="M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.button>
    </section>
  );
}
