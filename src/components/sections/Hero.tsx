"use client";

import { GlowButton } from "../ui/GlowButton";
import { motion } from "framer-motion";

interface HeroProps {
    onJoinWaitlist: () => void;
}

export function Hero({ onJoinWaitlist }: HeroProps) {
    const scrollToFeatures = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative pt-48 pb-32 px-8 flex flex-col items-center text-center overflow-hidden bg-grid">
            {/* Cybernetic Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="laser-line top-1/4 opacity-10" />
                <div className="laser-line top-2/4 opacity-5" />
                <div className="laser-line top-3/4 opacity-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl relative z-10"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-infrared mb-6 block">
                    Establishing Connection
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30 uppercase font-[var(--font-geist-sans)]">
                    Match. <br className="md:hidden" /> Tour. Grow.
                </h1>
                <p className="text-sm md:text-base text-white/40 mb-12 max-w-xl mx-auto leading-relaxed tracking-wider uppercase font-light">
                    Redefining the music industry ecosystem through decentralized match-making and collective tour funding.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <GlowButton onClick={onJoinWaitlist}>Join Waitlist</GlowButton>
                    <GlowButton variant="outline" onClick={scrollToFeatures}>
                        Protocol Overview
                    </GlowButton>
                </div>
            </motion.div>
        </section>
    );
}
