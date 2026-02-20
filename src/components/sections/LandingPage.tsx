"use client";

import { Navbar } from "../ui/Navbar";
import { Footer } from "../ui/Footer";
import { Hero } from "./Hero";
import { FeatureCarousel } from "./FeatureCarousel";
import { MatchingSection } from "./MatchingSection";
import { TourSection } from "./TourSection";
import { BenefitsSection } from "./BenefitsSection";
import { FinalCTA } from "./FinalCTA";
import { motion } from "framer-motion";
import { AnimatedTitle } from "../ui/AnimatedTitle";
import { GlassCard } from "../ui/GlassCard";

interface LandingPageProps {
    onJoinWaitlist: () => void;
}

export function LandingPage({ onJoinWaitlist }: LandingPageProps) {
    return (
        <div className="flex flex-col w-full min-h-screen">
            <Navbar />

            <Hero onJoinWaitlist={onJoinWaitlist} />

            <section id="features" className="py-24 px-8 max-w-7xl mx-auto w-full">
                <AnimatedTitle className="mb-12">Who is Tora for?</AnimatedTitle>
                <FeatureCarousel />
            </section>

            <section className="py-24 px-8 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <AnimatedTitle className="mb-6">What it's for</AnimatedTitle>
                    <p className="text-lg text-white/70 leading-relaxed mb-8">
                        Tora is the music industry's new playground. We bridge the gap between talent, spaces, and the people who make it happen. No more cold DMs or endless email chains.
                    </p>
                    <div className="space-y-4">
                        {['Direct connections', 'Transparent booking', 'Community driven'].map((item) => (
                            <div key={item} className="flex items-center space-x-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-infrared shadow-glow" />
                                <span className="text-white/80">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <GlassCard className="h-80 flex items-center justify-center border-infrared/20 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-infrared/10 to-transparent" />
                    <span className="text-white/20 italic z-10">Visual Representation of Ecosystem</span>
                </GlassCard>
            </section>

            <MatchingSection />

            <TourSection />

            <BenefitsSection />

            <FinalCTA onJoinWaitlist={onJoinWaitlist} />

            <Footer />
        </div>
    );
}
