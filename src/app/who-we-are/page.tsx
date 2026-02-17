"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { GlassCard } from "@/components/ui/GlassCard";

export default function WhoWeAre() {
    return (
        <main className="min-h-screen bg-near-black">
            <Navbar />
            <div className="pt-48 pb-24 px-8 max-w-4xl mx-auto space-y-12">
                <AnimatedTitle>Who We Are</AnimatedTitle>
                <GlassCard className="space-y-6">
                    <p className="text-xl text-white/70 leading-relaxed">
                        Tora was founded by a collective of DJs and event organizers who were tired of the friction in the music industry. We believe in direct connections and transparent deals.
                    </p>
                    <p className="text-white/50">
                        Our team is remote, global, and obsessed with the intersection of music and technology.
                    </p>
                </GlassCard>
            </div>
            <Footer />
        </main>
    );
}
