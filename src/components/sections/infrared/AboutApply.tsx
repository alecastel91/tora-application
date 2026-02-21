"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { InfraredButton } from "@/components/ui/InfraredButton";
import { motion } from "framer-motion";
import Image from "next/image";

const TORA_LOGO_B64 = "data:image/png;base64,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";

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
