"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { BottomNav } from "@/components/ui/PageNav";
import { NodeField } from "@/components/sections/home/NodeField";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { NetworkFormation } from "@/components/sections/home/NetworkFormation";
import { RolesSection } from "@/components/sections/home/RolesSection";
import { SolutionsSection } from "@/components/sections/home/SolutionsSection";
import { EthosSection } from "@/components/sections/home/EthosSection";
import { FinalCtaSection } from "@/components/sections/home/FinalCtaSection";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <LenisProvider>
      {/* Top nav — kept from the previous home for now; replaced by HomeNav in a later pass. */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center py-5 bg-black/40 backdrop-blur-md"
      >
        <div className="flex items-center space-x-8 md:space-x-10">
          {[
            { key: "nav_about", href: "/about" },
            { key: "nav_roles", href: "/roles" },
            { key: "nav_features", href: "/features" },
          ].map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors"
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
      </motion.nav>

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
