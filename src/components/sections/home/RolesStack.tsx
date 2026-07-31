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
              <motion.div
                className="glass-card p-6 md:p-7 relative border-l-2 border-l-transparent transition-colors cursor-pointer group"
                whileHover={{ x: 4 }}
                onClick={() => open(role.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(role.id); } }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderLeftColor = role.color;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                }}
              >
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${role.color}08`, border: `1px solid ${role.color}20` }}
                  >
                    {role.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: role.color }}>
                      {t(role.labelKey)}
                    </div>
                    {/* min-h of two lines so all four tiles match regardless of text length */}
                    <div className="text-white text-lg md:text-xl font-medium leading-snug min-h-[2.75em] whitespace-pre-line">{t(role.valueKey)}</div>
                  </div>
                </div>
                <svg aria-hidden className="absolute right-5 top-1/2 -translate-y-1/2 text-white/25 transition-colors group-hover:text-white/60" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
