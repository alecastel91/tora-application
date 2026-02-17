"use client";

import { GlassCard } from "../ui/GlassCard";
import { motion } from "framer-motion";
import { AnimatedTitle } from "../ui/AnimatedTitle";

export function TourSection() {
    return (
        <section className="py-32 px-8 max-w-7xl mx-auto space-y-20 bg-grid border-y border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <AnimatedTitle>Collective Ops</AnimatedTitle>
                    <p className="text-sm md:text-base text-white/40 uppercase tracking-widest leading-relaxed max-w-lg">
                        Pooled liquidity circuits for cross-border tours. High-risk, high-frequency touring protocols backed by the community.
                    </p>

                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-tora-orange">
                            <span>Funding Queue: ID-442</span>
                            <span>85% Committed</span>
                        </div>
                        <div className="h-1 bg-white/5 relative overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "85%" }}
                                viewport={{ once: true }}
                                className="absolute inset-y-0 bg-tora-orange"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: "NODES", value: "05" },
                        { label: "CAPACITY", value: "2.4K" },
                        { label: "YIELD", value: "+12%" },
                        { label: "STATUS", value: "DEPLOYED" }
                    ].map((item, idx) => (
                        <GlassCard key={idx} className="p-4 border-white/5">
                            <span className="block text-[8px] font-black text-white/20 mb-2">{item.label}</span>
                            <span className="text-xl font-black italic tracking-tighter">{item.value}</span>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
