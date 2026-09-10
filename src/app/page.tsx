"use client";

import { LenisProvider } from "@/components/providers/LenisProvider";
import { HomeDrawerProvider } from "@/components/sections/home/HomeDrawer";
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
     <HomeDrawerProvider>
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

      {/* Rendered directly, not inside an opacity-animated wrapper: that wrapper
          created its own stacking context, so the bar's z-50 only applied
          inside it and <main className="z-10"> painted over the bar. It looked
          fine but swallowed every click (Privacy / Terms / language picker). */}
      <BottomNav />
     </HomeDrawerProvider>
    </LenisProvider>
  );
}
