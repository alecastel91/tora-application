"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface InfraredButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
}

export function InfraredButton({ children, className, variant = "primary", ...props }: InfraredButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, textShadow: "0 0 8px rgb(255 255 255 / 0.5)" }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative px-8 py-4 rounded-sm font-orbitron uppercase tracking-widest text-sm font-bold transition-all duration-300",
                "border border-white/10 overflow-hidden group",
                variant === "primary"
                    ? "text-white bg-charcoal shadow-lg hover:shadow-[0_0_30px_-5px_var(--color-infrared-glow)] hover:border-infrared/50"
                    : "text-white/60 hover:text-white bg-transparent border-transparent hover:bg-white/5",
                className
            )}
            {...props}
        >
            {/* Internal Glow Gradient */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                "bg-gradient-to-t from-infrared/10 via-transparent to-transparent"
            )} />

            {/* Scanline Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 translate-y-full group-hover:animate-[scan_2s_linear_infinite] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
