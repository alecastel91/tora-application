"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { scrollToId } from "@/lib/scroll";

const LINKS = [
  { key: "home_nav_network", id: "network" },
  { key: "nav_roles", id: "roles" },
  { key: "home_nav_solutions", id: "solutions" },
];

const navFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Home-only nav: links smooth-scroll to on-page sections (via Lenis when active),
 * and the active link tracks scroll position with an IntersectionObserver.
 * Kept separate from TopNav so the detail pages' pathname-based nav is untouched.
 */
export function HomeNav() {
  const { t } = useLanguage();
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Active when a section occupies the middle band of the viewport.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-5 bg-black/40 backdrop-blur-md"
    >
      <div className="flex items-center space-x-8 md:space-x-10">
        {LINKS.map((link) => (
          <button
            key={link.key}
            type="button"
            onClick={() => scrollToId(link.id)}
            style={navFont}
            className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors ${
              active === link.id ? "text-white" : "text-white/30 hover:text-white"
            }`}
          >
            {t(link.key)}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
