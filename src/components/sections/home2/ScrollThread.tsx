"use client";

import { motion, useScroll } from "framer-motion";

/**
 * The thread down the left edge — one unbroken line, filled by page progress.
 * It is the only chrome that spans the whole descent, and the only hint that
 * the page is made of parts at all.
 */
export function ScrollThread() {
  const { scrollYProgress } = useScroll();
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-4 top-0 z-30 hidden h-full w-px md:block"
      style={{ background: "rgba(255,255,255,0.07)" }}
    >
      <motion.div className="h-full w-full origin-top bg-infrared" style={{ scaleY: scrollYProgress }} />
    </div>
  );
}
