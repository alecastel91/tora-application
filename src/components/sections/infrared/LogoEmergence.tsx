"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { InfraredButton } from "@/components/ui/InfraredButton";

interface LogoEmergenceProps {
    onApply: () => void;
}

export function LogoEmergence({ onApply }: LogoEmergenceProps) {
    const [showLogo, setShowLogo] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Logo animates in first
        const logoTimer = setTimeout(() => setShowLogo(true), 200);
        // Content reveals after logo is settled
        const contentTimer = setTimeout(() => setShowContent(true), 1600);

        return () => {
            clearTimeout(logoTimer);
            clearTimeout(contentTimer);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
            <GlassPanel className="p-8 md:p-14 max-w-2xl w-full flex flex-col items-center text-center">

                {/* PNG Logo with glow + scale-in animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
                    animate={showLogo ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-2"
                >
                    {/* Glow behind the logo */}
                    <motion.div
                        className="absolute inset-0 blur-3xl -z-10"
                        initial={{ opacity: 0 }}
                        animate={showLogo ? { opacity: 0.25 } : {}}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <div className="w-full h-full bg-white/30 rounded-full" />
                    </motion.div>

                    <Image
                        src="/tora_logo.png"
                        alt="TORA Logo"
                        width={380}
                        height={130}
                        className="w-[260px] md:w-[380px] h-auto object-contain mx-auto"
                        priority
                    />
                </motion.div>

                {/* Decorative line */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={showLogo ? { scaleX: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent w-full mt-4 mb-8"
                />

                {/* Text + button, revealed after logo settles */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={showContent ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex flex-col items-center text-center w-full"
                >
                    <span className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-white w-full">
                        IS THE PROFESSIONAL NETWORK
                    </span>
                    <span className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-infrared mt-1 w-full">
                        FOR THE ELECTRONIC MUSIC INDUSTRY
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={showContent ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                    className="flex flex-col items-center text-center w-full max-w-[90%] mt-5 mb-10"
                >
                    <span className="text-white/70 text-[10px] md:text-xs tracking-[0.1em] leading-relaxed uppercase font-light w-full">
                        Connect with artists, agents, venues, and promoters.
                    </span>
                    <span className="text-white/50 text-[10px] md:text-xs tracking-[0.1em] leading-relaxed uppercase font-light mt-1 w-full">
                        Discover opportunities, manage bookings, and grow.
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={showContent ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                    className="flex justify-center w-full"
                >
                    <InfraredButton onClick={onApply} className="w-full md:w-auto min-w-[240px] text-lg py-4">
                        Apply Now
                    </InfraredButton>
                </motion.div>

            </GlassPanel>
        </div>
    );
}
