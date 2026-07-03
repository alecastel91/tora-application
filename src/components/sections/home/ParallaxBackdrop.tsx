"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Ambient depth behind the node field: a slow-drifting grid + a radial infrared
 * glow, parallaxed off page scroll. Sits furthest back (-z-10). Under reduced
 * motion the layers are rendered static (no scroll-linked drift).
 */
export function ParallaxBackdrop() {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -320]);

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <motion.div
        className="bg-grid absolute inset-0 opacity-[0.5]"
        style={reduced ? undefined : { y: gridY }}
      />
      <motion.div
        className="absolute left-1/2 top-1/3 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,51,102,0.10) 0%, transparent 70%)",
          ...(reduced ? {} : { y: glowY }),
        }}
      />
    </div>
  );
}
