"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const LINKS = [
  { key: "nav_about", href: "/about" },
  { key: "nav_roles", href: "/roles" },
  { key: "nav_features", href: "/features" },
];

const navFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Home nav — links to the standalone detail pages (About / Roles / Features),
 * which remain the "read more" destinations. Kept separate from TopNav so the
 * detail pages' own pathname-based nav is untouched.
 */
export function HomeNav() {
  const { t } = useLanguage();

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-5 bg-black/40 backdrop-blur-md"
    >
      <div className="flex items-center space-x-8 md:space-x-10">
        {LINKS.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            style={navFont}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors"
          >
            {t(link.key)}
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}
