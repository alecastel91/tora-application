"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { setLenis } from "@/lib/scroll";

/**
 * Home-only smooth-scroll boundary. Mounted inside the home page (not the root
 * layout) so it's scoped to `/`; navigating away unmounts it and native scroll
 * returns for the detail/legal pages.
 *
 * Lenis drives the *native* scroll position, so framer-motion's useScroll()
 * reads correct progress with no manual bridging. Disabled entirely under
 * prefers-reduced-motion (native scroll).
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const rafRef = useRef(0);

  useEffect(() => {
    if (reduced) return; // reduced motion → native scroll, no Lenis

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // no smoothTouch — leave native touch scrolling on phones
    });
    setLenis(lenis);

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <>{children}</>;
}
