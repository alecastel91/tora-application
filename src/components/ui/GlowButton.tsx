"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
}

export function GlowButton({
    children,
    className,
    variant = 'primary',
    ...props
}: GlowButtonProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    const colors = {
        primary: "text-infrared border-infrared",
        secondary: "text-white border-white",
        outline: "text-white/60 border-white/20"
    };

    return (
        <motion.button
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative px-14 py-4 font-black tracking-[0.4em] uppercase text-xs md:text-sm transition-all duration-300 overflow-visible bg-white/[0.02] border-none group",
                colors[variant],
                className
            )}
            {...(props as any)}
        >
            {/* Solid Horizontal Bars - Thicker and more "legit" */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-current opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-current opacity-60 group-hover:opacity-100 transition-opacity" />

            {/* Lateral Open Light (Ambient Glow) - Non-italic, straight pulse */}
            <div className="absolute inset-y-0 -left-8 w-16 bg-gradient-to-r from-infrared/0 via-infrared/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl pointer-events-none" />
            <div className="absolute inset-y-0 -right-8 w-16 bg-gradient-to-l from-infrared/0 via-infrared/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl pointer-events-none" />

            {/* Content Glow Reflection */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/5 pointer-events-none backdrop-blur-[2px]"
                    />
                )}
            </AnimatePresence>

            {/* Red Light Relief reflection inside the open sides - Solidified vertical accents */}
            <div className="absolute left-0 inset-y-1 w-[2px] bg-tora-crimson opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-y-0 group-hover:scale-y-100 shadow-[0_0_15px_#8b0000]" />
            <div className="absolute right-0 inset-y-1 w-[2px] bg-tora-crimson opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-y-0 group-hover:scale-y-100 shadow-[0_0_15px_#8b0000]" />

            {/* Button Content - Bolder and Larger */}
            <span className="relative z-10 block font-black">
                {children}
            </span>

            {/* Proximity Core Intensity (Bottom line) */}
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-infrared group-hover:w-32 group-hover:shadow-[0_0_20px_#bd2c0f] transition-all duration-500 opacity-40 group-hover:opacity-100" />
        </motion.button>
    );
}
