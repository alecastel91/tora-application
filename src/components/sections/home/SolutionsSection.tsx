"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SolutionsRail } from "./SolutionsRail";
import { SolutionsGrid } from "./SolutionsGrid";

/**
 * Beat 5 — picks the pinned horizontal rail on desktop, the responsive grid on
 * mobile / reduced motion. Grid is the initial/SSR output; upgrades to the rail
 * after mount (stable hydration, no conditional hooks).
 */
export function SolutionsSection() {
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduced = usePrefersReducedMotion();

  useEffect(() => setMounted(true), []);

  const rail = mounted && isDesktop && !reduced;
  return rail ? <SolutionsRail /> : <SolutionsGrid />;
}
