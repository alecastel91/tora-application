"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { RolesMorph } from "./RolesMorph";
import { RolesStack } from "./RolesStack";

/**
 * Beat 4 — picks the pinned cycler on desktop, the vertical stack on mobile /
 * reduced motion. Renders the stack as the initial/SSR output and upgrades to
 * the pin after mount (stable hydration, no conditional hooks).
 */
export function RolesSection() {
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduced = usePrefersReducedMotion();

  useEffect(() => setMounted(true), []);

  const morph = mounted && isDesktop && !reduced;
  return morph ? <RolesMorph /> : <RolesStack />;
}
