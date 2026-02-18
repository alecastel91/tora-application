"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

interface LogoEmergenceProps {
    onComplete: () => void;
}

export function LogoEmergence({ onComplete }: LogoEmergenceProps) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3500); // 3.5s total time
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="mb-8 relative"
            >
                <div className="w-32 md:w-48 text-white relative z-10">
                    <Logo />
                </div>

                {/* Infrared Glow Behind Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-infrared/20 blur-[50px] rounded-full" />
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                className="text-sm md:text-base font-orbitron tracking-[0.2em] text-white/60 uppercase text-center"
            >
                Where the music industry connects.
            </motion.p>
        </div>
    );
}
