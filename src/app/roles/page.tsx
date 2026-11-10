"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { DetailPageShell } from "@/components/ui/DetailPageShell";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const display = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const sgFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * One row per role, each carrying that role's photograph.
 *
 * The page used to be four glass tiles with an icon in a ring — the same
 * anatomy as every other card on the site, which made four different trades
 * look like four instances of one thing. A person in a room says more about
 * who the role is for than a line drawing of a turntable, and the colour band
 * does the work the ring was doing.
 *
 * Photo and colour are the homepage's; the long descriptions are this page's.
 */
const PAGE_ROLES = [
  { id: "artist", color: "#6B5FFF", photo: "/home/v2/face-artist.jpg",
    labelKey: "role_artists_title", descKey: "role_artists_desc" },
  { id: "promoter", color: "#FFB800", photo: "/home/v2/face-promoter.jpg",
    labelKey: "role_promoters_title", descKey: "role_promoters_desc" },
  { id: "venue", color: "#FF5757", photo: "/home/v2/face-venue.jpg",
    labelKey: "role_venues_title", descKey: "role_venues_desc" },
  { id: "agent", color: "#00C875", photo: "/home/v2/face-agent.jpg",
    labelKey: "role_agents_title", descKey: "role_agents_desc" },
];

export default function Roles() {
  const { t } = useLanguage();

  return (
    <DetailPageShell title={t("roles_title")} subtitle={t("roles_subtitle")} width="max-w-5xl">
      <div className="space-y-6 md:space-y-10" style={sgFont}>
        {PAGE_ROLES.map((role, i) => (
          <SectionReveal key={role.id} delay={0.04}>
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: "tween", duration: 0.25 }}
              className={`flex flex-col gap-6 md:items-center md:gap-10 ${
                i % 2 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 md:h-[300px] md:w-[300px]">
                <Image
                  src={role.photo}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 768px) 300px, 100vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 mix-blend-color" style={{ background: role.color, opacity: 0.22 }} />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg,rgba(10,10,10,0.05) 0%,rgba(10,10,10,0.55) 100%)" }}
                />
                <span className="absolute left-0 top-0 h-1 w-full" style={{ background: role.color }} />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  className="text-[clamp(34px,6vw,56px)] font-black uppercase leading-[0.9] tracking-tight"
                  style={{ ...display, color: role.color }}
                >
                  {t(role.labelKey)}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
                  {t(role.descKey)}
                </p>
                <Link
                  href="/apply?start=role"
                  className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
                  style={{ color: role.color }}
                >
                  {t("apply_for_membership")}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </SectionReveal>
        ))}
      </div>
    </DetailPageShell>
  );
}
