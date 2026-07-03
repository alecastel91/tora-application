import type Lenis from "lenis";

/**
 * Home-only Lenis singleton. LenisProvider sets/clears this on mount/unmount so
 * nav anchors can drive smooth scroll without prop-drilling the instance.
 * Null when Lenis isn't active (reduced motion, or off the home route).
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null): void {
  lenis = instance;
}

/** Height of the fixed home nav — anchor targets offset up by this. */
export const NAV_OFFSET = 72;

/**
 * Smooth-scroll to an element by id. Uses Lenis when active; otherwise falls
 * back to native scrolling (reduced motion / instance not mounted yet).
 */
export function scrollToId(id: string): void {
  const selector = id.startsWith("#") ? id : `#${id}`;
  if (lenis) {
    lenis.scrollTo(selector, { offset: -NAV_OFFSET });
    return;
  }
  if (typeof document === "undefined") return;
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
