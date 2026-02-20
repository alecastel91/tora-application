"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
}

export function GlassCard({ children, className, glow = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            className={cn(
                "glass-card p-6 transition-all duration-300 relative border-l-2 border-l-transparent hover:border-l-infrared",
                glow && "hover:shadow-glow",
                className
            )}
            whileHover={{ x: 4 }}
            {...props}
        >
            {/* Subtle corner highlight */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-infrared/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />

            {children}
        </motion.div>
    );
}
