"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/ui/PageNav";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen bg-black overflow-hidden font-sans selection:bg-infrared/30 selection:text-white">

      {/* Top nav links */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center py-5"
      >
        <div className="flex items-center space-x-8 md:space-x-10">
          {[
            { key: "nav_apply", href: "/apply" },
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

      {/* Center content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/tora_logo_v2.png"
            alt="TORA"
            width={500}
            height={166}
            className="w-[280px] md:w-[400px] h-auto object-contain"
            priority
          />
        </motion.div>

        {/* Tagline — exact match from IntroSplash */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-2 md:mt-1"
        >
          <span
            className="text-white text-[12px] md:text-[14px] tracking-[0.22em] uppercase whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-space-grotesk), var(--font-rajdhani), sans-serif',
              fontWeight: 400,
              letterSpacing: '0.22em'
            }}
          >
            {t('where_music_meets')}
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-16"
        >
          <Link
            href="/apply"
            className="px-10 py-3 rounded-full border border-white/60 text-white text-[11px] font-semibold uppercase tracking-[0.25em] hover:bg-infrared hover:border-infrared hover:text-white transition-all duration-300"
            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
          >
            {t('apply_for_membership')}
          </Link>
        </motion.div>
      </div>

      <BottomNav />

    </main>
  );
}
