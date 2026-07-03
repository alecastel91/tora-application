"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * True when the user has requested reduced motion at the OS level.
 * Drives the fallbacks: no Lenis smooth scroll, no scroll-jacked pins,
 * static node network.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
