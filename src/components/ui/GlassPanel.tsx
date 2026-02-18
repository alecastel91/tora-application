"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function GlassPanel({ children, className, delay = 0, ...props }: GlassPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
            className={cn(
                "relative overflow-hidden rounded-2xl",
                "bg-[rgba(15,15,15,0.65)] backdrop-blur-xl",
                "border border-[rgba(255,120,60,0.18)]",
                "shadow-[0_10px_40px_rgba(0,0,0,0.9)]",
                className
            )}
            {...props}
        >
            {/* === INTERNAL REFLECTION BAND === */}
            <div
                className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(135deg,rgba(255,120,60,0.18)_0%,transparent_40%,transparent_60%,rgba(255,120,60,0.08)_100%)]
          opacity-40
        "
            />

            {/* === EDGE HIGHLIGHT === */}
            <div
                className="
          pointer-events-none absolute inset-0 rounded-2xl
          ring-1 ring-inset ring-[rgba(255,140,70,0.22)]
        "
            />

            {/* === INNER SHADOW (DEPTH) === */}
            <div
                className="
          pointer-events-none absolute inset-0 rounded-2xl
          shadow-[inset_0_0_40px_rgba(0,0,0,0.85)]
        "
            />

            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
