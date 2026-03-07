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
                "border border-white/10",
                "shadow-[0_10px_40px_rgba(0,0,0,0.9)]",
                className
            )}
            {...props}
        >
            {/* Faint fuchsia corner shimmer */}
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.08)_0%,transparent_70%)] blur-2xl z-0" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(217,70,239,0.12)] to-transparent z-0" />

            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
