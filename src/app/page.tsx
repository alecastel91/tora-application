"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { LandingPage } from "@/components/sections/LandingPage";
import { WaitlistModal } from "@/components/ui/WaitlistModal";
import { Logo } from "@/components/ui/Logo";

import { Background3D } from "@/components/ui/Background3D";
import { InteractionWaves } from "@/components/ui/InteractionWaves";

type ViewState = "gate" | "interstitial" | "landing";

export default function Home() {
  const [view, setView] = useState<ViewState>("gate");
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleEnter = () => {
    setView("interstitial");
  };

  useEffect(() => {
    if (view === "interstitial") {
      const timer = setTimeout(() => {
        setView("landing");
      }, 2500); // 2.5s for interstitial
      return () => clearTimeout(timer);
    }
  }, [view]);

  return (
    <main className="relative min-h-screen bg-near-black overflow-hidden font-sans">
      <Background3D />
      <InteractionWaves />

      {/* Futuristic Background System */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tora-orange/30 to-transparent top-[10%]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tora-crimson/20 to-transparent top-[90%]" />
        <div className="absolute inset-0 bg-noise opacity-5" />
      </div>

      <AnimatePresence mode="wait">
        {view === "gate" && (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen relative z-10 px-8"
          >
            <div className="relative mb-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-48 md:w-64"
              >
                <Logo className="text-white" />
              </motion.div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-px bg-tora-orange/40" />
            </div>
            <GlowButton onClick={handleEnter}>
              Establish Connection
            </GlowButton>
          </motion.div>
        )}

        {view === "interstitial" && (
          <motion.div
            key="interstitial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen relative z-10 px-4"
          >
            <motion.p
              variants={{
                initial: { opacity: 0, y: 10 },
                animate: {
                  opacity: [0, 1, 1, 0],
                  y: [10, 0, 0, -10],
                  transition: {
                    duration: 2.5,
                    times: [0, 0.2, 0.8, 1],
                    ease: "easeInOut"
                  }
                }
              }}
              initial="initial"
              animate="animate"
              className="text-xl md:text-2xl font-black tracking-[0.3em] text-center uppercase font-[var(--font-orbitron)]"
            >
              Where the music industry connects.
            </motion.p>
          </motion.div>
        )}

        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 w-full"
          >
            <LandingPage onJoinWaitlist={() => setIsWaitlistOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </main>
  );
}
