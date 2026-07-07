"use client";

import { motion } from "framer-motion";
import { DetailPageShell } from "@/components/ui/DetailPageShell";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { ROLES } from "@/components/sections/home/home.data";
import { useLanguage } from "@/contexts/LanguageContext";

const sgFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

// Same bespoke icons/colors as the home tiles, keyed by role id; this page
// keeps its own order and long-form descriptions.
const roleById = Object.fromEntries(ROLES.map((r) => [r.id, r]));
const PAGE_ROLES = [
  { ...roleById.artist, descKey: "role_artists_desc" },
  { ...roleById.promoter, descKey: "role_promoters_desc" },
  { ...roleById.venue, descKey: "role_venues_desc" },
  { ...roleById.agent, descKey: "role_agents_desc" },
];

export default function Roles() {
  const { t } = useLanguage();

  return (
    <DetailPageShell title={t("roles_title")} subtitle={t("roles_subtitle")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={sgFont}>
        {PAGE_ROLES.map((role, i) => (
          <SectionReveal key={role.id} delay={i * 0.06}>
            <motion.div
              className="relative h-full rounded-2xl p-6 overflow-hidden"
              whileHover={{ y: -3 }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div
                className="absolute inset-0 rounded-2xl backdrop-blur-md"
                style={{
                  background: "linear-gradient(165deg, rgba(13,13,18,0.85), rgba(13,13,18,0.55))",
                  border: `1px solid ${role.color}38`,
                  boxShadow: `0 0 50px -22px ${role.color}70, inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
              />
              <div className="relative flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 [&>svg]:w-8 [&>svg]:h-8"
                  style={{ background: `${role.color}12`, border: `1px solid ${role.color}30` }}
                >
                  {role.icon}
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                  style={{ color: role.color }}
                >
                  {t(role.labelKey)}
                </span>
              </div>
              <p className="relative text-white/65 text-sm leading-relaxed mt-4">{t(role.descKey)}</p>
            </motion.div>
          </SectionReveal>
        ))}
      </div>
    </DetailPageShell>
  );
}
