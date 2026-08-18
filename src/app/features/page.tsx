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
    titleKey: "feature_lifecycle_title",
    descKey: "feature_lifecycle_desc",
    icon: (
      // Finish flag — every booking reaches an end
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <path d="M5.5 21V3.8" stroke={GHOST} />
        <path d="M5.5 4.4h11.6l-2.6 3.6 2.6 3.6H5.5" stroke={GHOST} />
        <circle cx="17.9" cy="4.4" r="1.1" fill={INFRARED} stroke="none" />
      </svg>
    ),
  },
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
  {
    titleKey: "feature_record_title",
    descKey: "feature_record_desc",
    icon: (
      // Sealed document — the record you keep
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke}>
        <path d="M14 3.3H7a2 2 0 0 0-2 2v13.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.3z" stroke={GHOST} />
        <path d="M14 3.3v5h5" stroke={GHOST} opacity="0.6" />
        <path d="M8.4 11.4h5M8.4 14h3.4" stroke={GHOST} opacity="0.6" />
        <circle cx="15.2" cy="16.2" r="2.1" />
        <path d="M14.4 18l-.7 2.4 1.5-.8 1.5.8-.7-2.4" />
      </svg>
    ),
  },
];

export default function Features() {
  const { t } = useLanguage();

  return (
    <DetailPageShell title={t("features_title")} subtitle={t("features_subtitle")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={sgFont}>
        {FEATURES.map((item, i) => (
          <SectionReveal key={item.titleKey} delay={(i % 2) * 0.06}>
            <motion.div
              className="relative h-full rounded-2xl p-6 overflow-hidden"
              whileHover={{ y: -3 }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div
                className="absolute inset-0 rounded-2xl backdrop-blur-md"
                style={{
                  background: "rgba(255,255,255,0.02)", // founding-page glass — let the backdrop show through
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 0 50px -24px rgba(255,51,102,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-infrared/50" />
              <div className="relative flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 [&>svg]:w-8 [&>svg]:h-8"
                  style={{ background: "rgba(255,51,102,0.07)", border: "1px solid rgba(255,51,102,0.24)" }}
                >
                  {item.icon}
                </div>
                <span className="text-infrared text-xs font-bold uppercase tracking-[0.25em]">{t(item.titleKey)}</span>
              </div>
              <p className="relative text-white/65 text-sm leading-relaxed mt-4">{t(item.descKey)}</p>
            </motion.div>
          </SectionReveal>
        ))}
      </div>
    </DetailPageShell>
  );
}
