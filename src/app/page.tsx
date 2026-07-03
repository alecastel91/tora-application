"use client";

import { LenisProvider } from "@/components/providers/LenisProvider";
import { BottomNav } from "@/components/ui/PageNav";
import { HomeNav } from "@/components/ui/HomeNav";
import { ParallaxBackdrop } from "@/components/sections/home/ParallaxBackdrop";
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
      <NodeField />

      <main className="relative z-10 overflow-x-hidden font-sans selection:bg-infrared/30 selection:text-white">
        <HeroSection />
        <NetworkFormation />
        <RolesSection />
        <SolutionsSection />
        <EthosSection />
        <FinalCtaSection />
      </main>

      <BottomNav />
    </LenisProvider>
  );
}
