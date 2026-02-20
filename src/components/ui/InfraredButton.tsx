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
                "border border-white/15 overflow-hidden group",
                variant === "primary"
                    ? "text-white bg-charcoal shadow-lg hover:border-white/30"
                    : "text-white/60 hover:text-white bg-transparent border-transparent hover:bg-white/5",
                className
            )}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
