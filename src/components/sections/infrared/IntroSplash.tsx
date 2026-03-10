"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface IntroSplashProps {
    onComplete: () => void;
}

export function IntroSplash({ onComplete }: IntroSplashProps) {
    const [showLogo, setShowLogo] = useState(false);
    const [showTagline, setShowTagline] = useState(false);

    useEffect(() => {
        // Logo animates in first
        const logoTimer = setTimeout(() => setShowLogo(true), 300);
        // Tagline appears shortly after logo (almost together)
        const taglineTimer = setTimeout(() => setShowTagline(true), 800);
        // Auto-transition to main page after 2.5 seconds
        const transitionTimer = setTimeout(() => onComplete(), 2500);

        return () => {
            clearTimeout(logoTimer);
            clearTimeout(taglineTimer);
            clearTimeout(transitionTimer);
        };
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black px-4">
            {/* Logo with tagline positioned below */}
            <div className="relative flex flex-col items-center">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                    animate={showLogo ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Image
                        src="/tora_logo_v2.png"
                        alt="TORA Logo"
                        width={500}
                        height={166}
                        className="w-[320px] md:w-[480px] h-auto object-contain"
                        priority
                    />
                </motion.div>

                {/* Tagline - positioned right below the TORA text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={showTagline ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mt-2 md:mt-1"
                >
                    <span className="text-white text-[10px] md:text-[12px] font-medium tracking-[0.22em] uppercase whitespace-nowrap">
                        WHERE THE MUSIC INDUSTRY CONNECTS.
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
