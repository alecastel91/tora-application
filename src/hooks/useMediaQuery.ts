"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe matchMedia hook. Returns a stable `false` on the server / first
 * client render, then corrects after mount. Consumers should treat `false`
 * as the "not yet known" / fallback state so hydration stays stable.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
