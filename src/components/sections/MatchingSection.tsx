"use client";

import { GlassCard } from "../ui/GlassCard";
import { motion } from "framer-motion";
import { AnimatedTitle } from "../ui/AnimatedTitle";

const steps = [
    {
        number: "01",
        title: "Link Account",
        desc: "Sync your Spotify/Soundcloud or Venue analytics for verified protocol entry."
    },
    {
        number: "02",
        title: "Node Analysis",
        desc: "Our engine identifies matching nodes based on frequency, capacity, and vibe."
    },
    {
        number: "03",
        title: "Execute Deal",
        desc: "Instant contract generation and automated payment scheduling."
    }
];

export function MatchingSection() {
    return (
        <section id="features" className="py-32 px-8 max-w-7xl mx-auto">
            <div className="mb-20">
                <AnimatedTitle>The Protocol</AnimatedTitle>
                <div className="w-12 h-px bg-tora-orange mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <GlassCard
                        key={index}
                        className="group hover:bg-tora-orange/[0.02]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <span className="text-4xl font-black text-white/5 mb-6 block group-hover:text-tora-orange/20 transition-colors">
                            {step.number}
                        </span>
                        <h3 className="text-lg font-black uppercase tracking-widest mb-4 italic italic">{step.title}</h3>
                        <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed">
                            {step.desc}
                        </p>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
}
