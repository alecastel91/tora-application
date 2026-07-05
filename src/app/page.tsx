"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { BottomNav } from "@/components/ui/PageNav";
import { HomeNav } from "@/components/ui/HomeNav";
import { ParallaxBackdrop } from "@/components/sections/home/ParallaxBackdrop";
import { WaveMesh } from "@/components/sections/home/WaveMesh";
import { NodeField } from "@/components/sections/home/NodeField";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { NetworkFormation } from "@/components/sections/home/NetworkFormation";
import { RolesSection } from "@/components/sections/home/RolesSection";
import { SolutionsSection } from "@/components/sections/home/SolutionsSection";
import { EthosSection } from "@/components/sections/home/EthosSection";
import { FinalCtaSection } from "@/components/sections/home/FinalCtaSection";

export default function Home() {
  return (
    <LenisProvider>
      <HomeNav />
      <ParallaxBackdrop />
      <WaveMesh />
      <NodeField />

      {/* overflow-x-clip (not -hidden): hidden makes <main> a scroll container, which breaks position:sticky in every pinned section */}
      <main className="relative z-10 overflow-x-clip font-sans selection:bg-infrared/30 selection:text-white">
        <HeroSection />
        <NetworkFormation />
        <RolesSection />
        <SolutionsSection />
        <EthosSection />
        <FinalCtaSection />
      </main>

      <HomeBottomNav />
    </LenisProvider>
  );
}

/**
 * Bottom nav visible on the hero (language picker stays discoverable on landing)
 * and at the final CTA / footer, but faded out during the scroll journey so the
 * cinematic beats get the full viewport.
 */
function HomeBottomNav() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.04, 0.1, 0.85, 0.93], [1, 1, 0, 0, 1]);
  const pointerEvents = useTransform(opacity, (v) => (v < 0.4 ? "none" : "auto"));
  return (
    <motion.div style={{ opacity, pointerEvents }}>
      <BottomNav />
    </motion.div>
  );
}
