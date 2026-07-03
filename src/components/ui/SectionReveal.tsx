"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE_TORA = [0.16, 1, 0.3, 1] as const; // mirrors CSS --ease-tora

/**
 * Standard scroll-into-view reveal (fade + slight rise). Intersection-based via
 * framer-motion's whileInView — no scroll math, no Lenis dependency, so it works
 * identically under reduced motion (it just plays once on entry).
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE_TORA, delay }}
    >
      {children}
    </motion.div>
  );
}
