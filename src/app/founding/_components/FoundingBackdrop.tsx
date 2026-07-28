"use client";

import { WaveMesh } from "@/components/sections/home/WaveMesh";

/**
 * Ambient backdrop for the founding deck — pure black with a couple of infrared
 * glows and the site's signature wave-mesh, so the page feels native to TORA
 * without the home page's scroll-coupled node choreography.
 */
export function FoundingBackdrop() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden bg-black pointer-events-none"
    >
      <div
        className="absolute left-1/2 top-[-15%] h-[70vh] w-[70vh] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,51,102,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute right-[-10%] top-[45%] h-[50vh] w-[50vh] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(107,95,255,0.08) 0%, transparent 70%)",
        }}
      />
      <WaveMesh opacity={0.5} />
    </div>
  );
}
