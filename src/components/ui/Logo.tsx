"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <motion.div
            animate={{
                scale: [1, 1.02, 1],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={cn("relative", className)}
        >
            <svg
                viewBox="0 0 500 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-auto w-auto"
            >
                {/* T - Sharpened cut, matched proportions */}
                <path d="M15 35L55 35H125V52H85V105H55V52H15V35Z" fill="currentColor" />

                {/* O - Wide industrial profile */}
                <path d="M140 35H225V105H140V35ZM165 52V88H200V52H165Z" fill="currentColor" />

                {/* R - Disconnected diagonal leg */}
                <path d="M240 35H315V68H285L322 105H292L261 68V105H237V35ZM261 52V57L295 57V52H261Z" fill="currentColor" />

                {/* A - High bridge, sharp geometric apex */}
                <path d="M365 35L420 105H390L380 88H350L340 105H310L365 35ZM365 52L358 72H372L365 52Z" fill="currentColor" />
            </svg>
        </motion.div>
    );
}
