"use client";

import { motion } from "framer-motion";

interface TORALoaderProps {
  size?: number;
  inline?: boolean;
  label?: string;
}

/**
 * Rotating brand globe — the designer intro-artwork globe (the same mark the app
 * uses in its LoadingGlobe, extracted from Intro.svg, transparent background),
 * spinning at a slow linear pace. Kept API-compatible with the old wireframe
 * loader: `size` is the glyph px, `inline` lays it beside its label.
 */
export function TORALoader({ size = 18, inline = false, label }: TORALoaderProps) {
  const globe = (
    <motion.img
      src="/loading-globe.png"
      alt=""
      aria-hidden
      draggable={false}
      width={size}
      height={size}
      style={{ width: size, height: size, flexShrink: 0, userSelect: "none" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
    />
  );

  if (inline) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {globe}
        {label && <span>{label}</span>}
      </span>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      {globe}
      {label && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{label}</span>}
    </div>
  );
}
