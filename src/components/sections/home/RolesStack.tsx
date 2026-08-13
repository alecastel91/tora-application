"use client";

import { motion } from "framer-motion";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROLES } from "./home.data";
import { useHomeDrawer } from "./HomeDrawer";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const bodyFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Beat 4 fallback — a vertical stack of the 4 roles as value props. Used on
 * mobile and under reduced motion (RolesPinned handles the desktop cycler).
 */
export function RolesStack() {
  const { t } = useLanguage();
  const { open } = useHomeDrawer();

  return (
    <section id="roles" className="relative scroll-mt-20 py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionReveal className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white" style={headingFont}>
            {t("home_roles_title")}
          </h2>
        </SectionReveal>

        <div className="space-y-5" style={bodyFont}>
          {ROLES.map((role, i) => (
            <SectionReveal key={role.id} delay={i * 0.06}>
              {/* Founding-page mobile row: colored icon badge left, copy right. */}
              <motion.div
                className="group relative flex cursor-pointer flex-row items-center gap-4 rounded-2xl border border-white/10 bg-[#0d0d12]/50 backdrop-blur-md p-5 transition-colors hover:border-white/25"
                whileHover={{ x: 4 }}
                onClick={() => open(role.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(role.id); } }}
              >
                <span
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl [&_svg]:h-8 [&_svg]:w-8"
                  style={{ background: `${role.color}18`, border: `1px solid ${role.color}55` }}
                >
                  {role.icon}
                </span>
                <div className="flex min-w-0 flex-1 flex-col items-start">
                  <span className="text-lg font-bold uppercase tracking-wide" style={{ ...headingFont, color: role.color }}>
                    {role.label}
                  </span>
                  <span className="mt-1 text-[13px] leading-relaxed text-white/45">{t(role.descKey)}</span>
                  <span className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/35 transition-colors group-hover:text-white/70">
                    {t("home_tap_explore")}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
