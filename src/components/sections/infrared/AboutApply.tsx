"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { InfraredButton } from "@/components/ui/InfraredButton";
import { motion } from "framer-motion";
import Image from "next/image";

const TORA_LOGO_B64 = "/tora_logo.png";

interface AboutApplyProps {
    onApply: () => void;
}

export function AboutApply({ onApply }: AboutApplyProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
            <GlassPanel className="p-8 md:p-12 max-w-2xl w-full flex flex-col items-center text-center">

                {/* Embedded Logo String Base64 Header */}
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <Image
                        src={TORA_LOGO_B64}
                        alt="TORA Logo"
                        width={280}
                        height={96}
                        className="w-[200px] md:w-[280px] h-auto object-contain"
                        priority
                    />
                </motion.div>

                {/* Symmetrical Text Lockup Array */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center text-center w-full mt-4 mb-4"
                >
                    <span className="text-sm md:text-base font-black uppercase tracking-[0.2em] font-[var(--font-geist-sans)] text-white w-full text-justify text-justify-last-center">
                        IS THE PROFESSIONAL NETWORK
                    </span>
                    <span className="text-xs md:text-sm font-black uppercase tracking-[0.3em] font-[var(--font-geist-sans)] text-infrared mt-1 w-full text-justify text-justify-last-center">
                        FOR THE ELECTRONIC MUSIC INDUSTRY
                    </span>
                </motion.div>

                {/* Sub Description */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col items-center text-center w-full max-w-[90%] mb-12 mt-6"
                >
                    <span className="text-white/70 text-[10px] md:text-xs tracking-[0.1em] leading-relaxed uppercase font-light w-full text-justify text-justify-last-center">
                        Connect with artists, agents, venues, and promoters.
                    </span>
                    <span className="text-white/50 text-[10px] md:text-xs tracking-[0.1em] leading-relaxed uppercase font-light mt-1 w-full text-justify text-justify-last-center">
                        Discover opportunities, manage bookings, and grow.
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center w-full mt-4"
                >
                    <InfraredButton onClick={onApply} className="w-full md:w-auto min-w-[240px] text-lg py-4">
                        Apply Now
                    </InfraredButton>
                </motion.div>
            </GlassPanel>
        </div>
    );
}
