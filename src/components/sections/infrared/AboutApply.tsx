"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { InfraredButton } from "@/components/ui/InfraredButton";
import { motion } from "framer-motion";

interface AboutApplyProps {
    onApply: () => void;
}

export function AboutApply({ onApply }: AboutApplyProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
            <GlassPanel className="p-8 md:p-12 max-w-2xl w-full flex flex-col items-center text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-5xl font-michroma font-bold text-white mb-8 tracking-wide text-center"
                >
                    <span className="text-infrared">TORA</span> is the professional network for the electronic music industry.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/70 text-lg md:text-2xl leading-relaxed mb-12 font-light text-center max-w-xl mx-auto"
                >
                    Connect with artists, agents, venues, and promoters worldwide.
                    <br className="hidden md:block" />
                    Discover opportunities, manage bookings, and grow your network in one seamless platform.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
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
