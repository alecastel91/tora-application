"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { GlowButton } from "@/components/ui/GlowButton";

export default function Mission() {
    return (
        <main className="min-h-screen bg-near-black">
            <Navbar />
            <div className="pt-48 pb-24 px-8 max-w-4xl mx-auto text-center space-y-12">
                <AnimatedTitle>The Mission</AnimatedTitle>
                <p className="text-2xl text-white/70 font-light italic leading-relaxed">
                    "To decentralize the music industry by empowering artists and venues to connect without gatekeepers."
                </p>
                <div className="pt-12">
                    <GlowButton onClick={() => window.location.href = '/'}>Back to Home</GlowButton>
                </div>
            </div>
            <Footer />
        </main>
    );
}
