"use client";

import { ParallaxBackdrop } from "@/components/sections/home/ParallaxBackdrop";
import { WaveMesh } from "@/components/sections/home/WaveMesh";

/**
 * Ambient backdrop for the founding deck — the homepage's exact pairing: the
 * scroll-parallaxed infrared glow + faint grid (ParallaxBackdrop) under the
 * signature wave-mesh at the homepage's opacity, so the two pages read as one
 * site. The home page's node choreography is deliberately left out.
 */
export function FoundingBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-black pointer-events-none">
      <ParallaxBackdrop />
      <WaveMesh />
    </div>
  );
}
