"use client";

import { motion } from "framer-motion";

interface TORALoaderProps {
  size?: number;
  inline?: boolean;
  label?: string;
}

export function TORALoader({ size = 18, inline = false, label }: TORALoaderProps) {
  const stroke = Math.max(1, Math.round(size / 12));

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
      <circle cx="120" cy="120" r="100" stroke="#FF3366" strokeWidth={stroke * 1.5} fill="none" opacity="0.85" />
      <line x1="120" y1="20" x2="120" y2="220" stroke="#FF3366" strokeWidth={stroke * 1.5} opacity="0.85" />
      <line x1="20" y1="120" x2="220" y2="120" stroke="#FF3366" strokeWidth={stroke * 1.5} opacity="0.85" />
      <ellipse cx="120" cy="120" rx="100" ry="50" stroke="#FF3366" strokeWidth={stroke} fill="none" opacity="0.6" />
      <ellipse cx="120" cy="120" rx="100" ry="25" stroke="#FF3366" strokeWidth={stroke} fill="none" opacity="0.6" />
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
