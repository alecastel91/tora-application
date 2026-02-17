"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { GlassCard } from "@/components/ui/GlassCard";

export default function WhatsComing() {
    return (
        <main className="min-h-screen bg-near-black">
            <Navbar />
            <div className="pt-48 pb-24 px-8 max-w-5xl mx-auto space-y-16">
                <div className="text-center">
                    <AnimatedTitle>What's Coming</AnimatedTitle>
                    <p className="text-white/50 mt-4">Tora Roadmap 2024-2025</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { tag: 'Q3 2024', title: 'Beta Launch', desc: 'Closed beta for selected DJs and venues in Berlin and London.' },
                        { tag: 'Q4 2024', title: 'Touring Protocol', desc: 'Full release of the Tour Kickstarter crowdfunding system.' },
                        { tag: 'Q1 2025', title: 'Global Expansion', desc: 'Opening the platform to all major music hubs.' },
                        { tag: 'Q2 2025', title: 'Token Integration', desc: 'On-chain payments and governance for tour circuits.' },
                    ].map((item) => (
                        <GlassCard key={item.tag} className="border-white/5">
                            <span className="text-tora-orange text-xs font-bold uppercase tracking-widest">{item.tag}</span>
                            <h3 className="text-xl font-bold mt-2 mb-4">{item.title}</h3>
                            <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                        </GlassCard>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
