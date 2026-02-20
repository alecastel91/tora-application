"use client";

import { GlassCard } from "../ui/GlassCard";
import { AnimatedTitle } from "../ui/AnimatedTitle";

const groups = [
    {
        role: "Talent",
        items: ["Protocol matching", "Liquid funding", "Verified analytics"]
    },
    {
        role: "Spaces",
        items: ["Roster optimization", "Crowd data", "Instant settlement"]
    },
    {
        role: "Nodes",
        items: ["Network routing", "Pooled resources", "Automated PR"]
    }
];

export function BenefitsSection() {
    return (
        <section className="py-32 px-8 max-w-7xl mx-auto">
            <div className="mb-20 text-center">
                <AnimatedTitle>Optimizations</AnimatedTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {groups.map((group, idx) => (
                    <div key={idx} className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-infrared pl-4 border-l-2 border-infrared">
                            {group.role}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 p-4 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
