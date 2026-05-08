"use client";

import { motion } from "framer-motion";

interface TORALoaderProps {
  size?: number;
  inline?: boolean;
  label?: string;
}

export function TORALoader({ size = 18, inline = false, label }: TORALoaderProps) {
  // Stroke widths are in viewBox units (240). The browser scales them by
  // (size / 240) when rendering. Target display strokes: ~1.5px primary,
  // ~1px secondary. Computed as display_target * 240 / size.
  const primaryStroke = Math.max(1.5, 360 / size);
  const secondaryStroke = Math.max(1, 240 / size);

  const globe = (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={{ flexShrink: 0 }}
      aria-hidden
    >
      <circle cx="120" cy="120" r="100" stroke="#FF3366" strokeWidth={primaryStroke} fill="none" opacity="0.9" />
      <line x1="120" y1="20" x2="120" y2="220" stroke="#FF3366" strokeWidth={primaryStroke} opacity="0.9" />
      <line x1="20" y1="120" x2="220" y2="120" stroke="#FF3366" strokeWidth={primaryStroke} opacity="0.9" />
      <ellipse cx="120" cy="120" rx="100" ry="50" stroke="#FF3366" strokeWidth={secondaryStroke} fill="none" opacity="0.7" />
      <ellipse cx="120" cy="120" rx="100" ry="25" stroke="#FF3366" strokeWidth={secondaryStroke} fill="none" opacity="0.7" />
    </motion.svg>
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
      {label && <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{label}</span>}
    </div>
  );
}
