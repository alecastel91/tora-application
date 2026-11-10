"use client";

import { motion } from "framer-motion";
import { DetailPageShell } from "@/components/ui/DetailPageShell";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SOLUTIONS } from "@/components/sections/home/home.data";
import { useLanguage } from "@/contexts/LanguageContext";

const sgFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

const INFRARED = "#FF3366";
const GHOST = "rgba(255,255,255,0.45)";
const stroke = {
  fill: "none",
  stroke: INFRARED,
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const solutionIcon = (id: string) => SOLUTIONS.find((s) => s.id === id)!.icon;

// Five icons come straight from the home pipeline set; the other five are new
// marks in the same language (ghost-white base, one infrared accent).
const FEATURES = [
  { titleKey: "feature_search_title", descKey: "feature_search_desc", icon: solutionIcon("discover") },
  { titleKey: "feature_calendar_title", descKey: "feature_calendar_desc", icon: solutionIcon("book") },
  { titleKey: "feature_tour_title", descKey: "feature_tour_desc", icon: solutionIcon("tour") },
  {
    titleKey: "feature_notifications_title",
    descKey: "feature_notifications_desc",
    icon: (
      // Bell — something just happened
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <path d="M17.8 8.6a5.8 5.8 0 0 0-11.6 0c0 6.2-2.4 7.8-2.4 7.8h16.4s-2.4-1.6-2.4-7.8" stroke={GHOST} />
        <path d="M10.4 19.8a1.9 1.9 0 0 0 3.2 0" stroke={GHOST} />
        <circle cx="18.6" cy="4.6" r="1.7" fill={INFRARED} stroke="none" />
      </svg>
    ),
  },
  {
    titleKey: "feature_bookings_title",
    descKey: "feature_bookings_desc",
    icon: (
      // Exchange — offer out, confirmation back
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <path d="M19.8 10.5a8 8 0 0 0-14.4-3" stroke={GHOST} />
        <path d="M5.4 4.6v3h3" stroke={GHOST} />
        <path d="M4.2 13.5a8 8 0 0 0 14.4 3" />
        <path d="M18.6 19.4v-3h-3" />
      </svg>
    ),
  },
  { titleKey: "feature_messaging_title", descKey: "feature_messaging_desc", icon: solutionIcon("connect") },
  { titleKey: "feature_contracts_title", descKey: "feature_contracts_desc", icon: solutionIcon("contract") },
  {
    titleKey: "feature_profiles_title",
    descKey: "feature_profiles_desc",
    icon: (
      // ID card — the professional profile
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="4.8" width="18" height="14.4" rx="2.2" stroke={GHOST} />
        <circle cx="8.6" cy="10.6" r="1.9" stroke={GHOST} />
        <path d="M5.7 15.8c0-1.6 1.3-2.8 2.9-2.8s2.9 1.2 2.9 2.8" stroke={GHOST} />
        <path d="M14.3 9.6h4M14.3 12.4h4" stroke={GHOST} opacity="0.6" />
        <circle cx="17.5" cy="15.6" r="0.9" fill={INFRARED} stroke="none" />
      </svg>
    ),
  },
  {
    titleKey: "feature_agent_title",
    descKey: "feature_agent_desc",
    icon: (
      // Dashboard — the roster at a glance
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <rect x="3.2" y="4.2" width="17.6" height="12.4" rx="2" stroke={GHOST} />
        <path d="M9.4 20.2h5.2M12 16.6v3.6" stroke={GHOST} />
        <path d="M7.6 13.2v-2.6M11.4 13.2V7.8M15.2 13.2v-4" />
      </svg>
    ),
  },
  {
    titleKey: "feature_multirole_title",
    descKey: "feature_multirole_desc",
    icon: (
      // Overlap — one account, several roles
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <circle cx="9.4" cy="12" r="5.2" stroke={GHOST} />
        <circle cx="14.6" cy="12" r="5.2" />
        <circle cx="12" cy="12" r="1" fill={INFRARED} stroke="none" />
      </svg>
    ),
  },
];

const display = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };

/**
 * Ten features as one ruled list rather than ten glass cards.
 *
 * Every card carried its own border, blur, glow and corner tick, so the page
 * spent most of its ink drawing containers; at two columns the eye also had
 * to pick between two reading orders. Hairlines and a number give the same
 * separation, keep the order unambiguous, and leave the icons as the only
 * drawn thing on the page.
 */
export default function Features() {
  const { t } = useLanguage();

  return (
    <DetailPageShell title={t("features_title")} subtitle={t("features_subtitle")} width="max-w-4xl">
      <div className="border-t border-white/10" style={sgFont}>
        {FEATURES.map((item, i) => (
          <SectionReveal key={item.titleKey}>
            <motion.div
              className="group flex items-start gap-5 border-b border-white/10 py-6 md:gap-8 md:py-7"
              whileHover={{ x: 4 }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <span
                className="w-7 shrink-0 pt-1 text-[11px] text-infrared"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="shrink-0 pt-0.5 [&>svg]:h-6 [&>svg]:w-6 md:[&>svg]:h-7 md:[&>svg]:w-7">
                {item.icon}
              </span>
              <div className="min-w-0">
                <h2
                  className="text-lg font-black uppercase leading-[1.05] tracking-tight text-white md:text-xl"
                  style={display}
                >
                  {t(item.titleKey)}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">{t(item.descKey)}</p>
              </div>
            </motion.div>
          </SectionReveal>
        ))}
      </div>
    </DetailPageShell>
  );
}
