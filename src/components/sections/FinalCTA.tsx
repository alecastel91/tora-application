"use client";

import { GlowButton } from "../ui/GlowButton";
import { motion } from "framer-motion";

interface FinalCTAProps {
    onJoinWaitlist: () => void;
}

export function FinalCTA({ onJoinWaitlist }: FinalCTAProps) {
    return (
        <section className="py-48 px-8 text-center flex flex-col items-center bg-grid relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-near-black" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-3xl relative z-10"
            >
                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase italic italic">
                    Join the Future <br /> of Nightlife
                </h2>
                <p className="text-xs md:text-sm text-white/30 mb-12 uppercase tracking-[0.3em] font-light max-w-lg mx-auto">
                    Secure your ID in the first phase of the Tora Protocol rollout.
                </p>
                <GlowButton onClick={onJoinWaitlist}>
                    Initialize Waitlist ID
                </GlowButton>
            </motion.div>
        </section>
    );
}
