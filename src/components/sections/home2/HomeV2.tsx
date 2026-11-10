"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { scrollToId } from "@/lib/scroll";
import { Scene } from "./Scene";
import { ARC, PhoneScreen, PROBLEM_MARKS, RoleFace, Symptom } from "../shared/pageParts";

const EASE_TORA = [0.16, 1, 0.3, 1] as const;
const display = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const body = { fontFamily: "var(--font-space-grotesk), sans-serif" };
const supreme = { fontFamily: "var(--font-supreme), var(--font-space-grotesk), sans-serif" };

const ROLES = [
  { id: "artist", label: "Artist", descKey: "home_role_artist_desc", color: "#6B5FFF", face: "/home/v2/face-artist.jpg" },
  { id: "agent", label: "Agent", descKey: "home_role_agent_desc", color: "#00C875", face: "/home/v2/face-agent.jpg" },
  { id: "promoter", label: "Promoter", descKey: "home_role_promoter_desc", color: "#FFB800", face: "/home/v2/face-promoter.jpg" },
  { id: "venue", label: "Venue", descKey: "home_role_venue_desc", color: "#FF5757", face: "/home/v2/face-venue.jpg" },
];

/** Five screens, in the order you would actually use them: find the people,
 *  see when they are near, build the tour, agree the deal, keep the record.
 *  Every title and line here is an existing translated string — nothing on
 *  this page says anything the eight catalogues cannot say too. */
const SHOTS = [
  { shot: "/home/discover.png", titleKey: "home_journey_discover_title", descKey: "home_journey_discover_desc" },
  { shot: "/home/calendar.png", titleKey: "feature_calendar_title", descKey: "feature_calendar_desc" },
  { shot: "/home/tour.png", titleKey: "feature_tour_title", descKey: "feature_tour_desc" },
  { shot: "/home/offer.png", titleKey: "home_journey_offer_title", descKey: "home_journey_offer_desc" },
  { shot: "/home/book.png", titleKey: "feature_contracts_title", descKey: "home_journey_confirmed_desc" },
];

/** The four symptoms, as a title you can open. The paragraphs read well but
 *  four of them at once is a wall; the headline carries the point and the
 *  sentence is there for whoever wants it. */
const PROBLEM_ITEMS = [1, 2, 3, 4].map((n) => ({
  titleKey: `home_problem_item${n}_title`,
  bodyKey: `home_problem_item${n}_body`,
}));

/** Rises into place once, from a visible resting state — never left at zero. */
function Rise({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE_TORA, delay }}
    >
      {children}
    </motion.div>
  );
}

export function HomeV2() {
  const { t } = useLanguage();

  return (
    <main className="relative z-10 font-sans selection:bg-infrared/30 selection:text-white">
      {/* ─────────────── the way in ─────────────── */}
      <Scene innerClassName="flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: EASE_TORA }}
          className="flex flex-col items-center"
        >
          <Image
            src="/tora_logo_transparent.png"
            alt="TORA"
            width={500}
            height={166}
            priority
            className="h-auto w-[270px] object-contain md:w-[420px]"
          />
          <span className="mt-3 text-[12px] uppercase tracking-[0.3em] text-white md:text-[14px]" style={supreme}>
            {t("where_music_meets")}
          </span>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => scrollToId("network")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.9 }}
          className="absolute bottom-12 flex flex-col items-center gap-3 text-white/45 transition-colors hover:text-white"
          aria-label={t("scroll_explore")}
        >
          <span className="text-[10px] uppercase tracking-[0.34em]" style={supreme}>
            {t("scroll_explore")}
          </span>
          <motion.span
            className="block h-9 w-px bg-current"
            animate={{ scaleY: [0.25, 1, 0.25], transformOrigin: ["top", "top", "bottom"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.button>
      </Scene>

      {/* ─────────────── the problem, and the turn out of it ───────────────
          One room instead of two: the three symptoms sit under the headline as
          a single band, and the answer lands in the same frame rather than a
          screen further down. */}
      <Scene id="network" photo="/home/v2/room-open.jpg" className="px-6 py-20 md:px-16 md:py-24">
        <div className="mx-auto w-full max-w-6xl">
          <Rise>
            <h2
              className="max-w-4xl text-[clamp(32px,6.4vw,76px)] font-black uppercase leading-[0.96] tracking-tight text-white"
              style={display}
            >
              {t("home_problem")}
            </h2>
          </Rise>

          {/* The four symptoms as a thin stack: a headline each, the
              sentence on request. Four paragraphs at once was a wall. */}
          <div className="mt-8 max-w-3xl divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 md:mt-10">
            {PROBLEM_ITEMS.map((item, i) => (
              <Rise key={item.titleKey} delay={0.08 + i * 0.07}>
                <Symptom mark={PROBLEM_MARKS[i]} title={t(item.titleKey)} sentence={t(item.bodyKey)} defaultOpen={i === 0} />
              </Rise>
            ))}
          </div>

          {/* The turn. The founding deck said this better than the homepage
              did, so the homepage says it the founding deck's way. */}
          <Rise delay={0.2}>
            <div className="mt-14 md:mt-16">
              <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-infrared" style={supreme}>
                <span className="h-px w-8 bg-current" aria-hidden="true" />
                {t("home_solution_eyebrow")}
              </span>
              <h3
                className="mt-5 max-w-4xl text-[clamp(28px,5.2vw,64px)] font-black uppercase leading-[0.98] tracking-tight text-white"
                style={display}
              >
                {t("home_solution_lead")} <span className="text-infrared">{t("home_solution_accent")}</span>
              </h3>
              <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base" style={body}>
                {t("home_solution_body")}
              </p>
            </div>
          </Rise>
        </div>
      </Scene>

      {/* ─────────────── the four, side by side ───────────────
          Four full screens became one wall. On a phone it is a swipe, so the
          roles cost a single screen there too. */}
      <section id="roles" className="relative z-10 scroll-mt-20 py-20 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-16">
          <Rise>
            <h2
              className="max-w-3xl text-[clamp(26px,4.6vw,56px)] font-black uppercase leading-[1] tracking-tight text-white"
              style={display}
            >
              {t("home_roles_title")}
            </h2>
          </Rise>
        </div>

        <Rise className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-auto md:max-w-6xl md:grid md:grid-cols-4 md:overflow-visible md:px-16 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {ROLES.map((role) => (
            <div key={role.id} className="shrink-0 snap-center md:shrink">
              <Link
                href="/apply?start=role"
                className="group relative block h-[62vh] w-[74vw] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] md:h-[58vh] md:w-full"
              >
                <RoleFace src={role.face} color={role.color} sizes="(min-width: 768px) 24vw, 74vw" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <h3
                    className="text-[clamp(28px,4.4vw,40px)] font-black uppercase leading-[0.9] tracking-tight"
                    style={{ ...display, color: role.color }}
                  >
                    {role.label}
                  </h3>
                  <p
                    className="mt-3 min-h-[5em] text-[13px] leading-relaxed text-white/70 md:min-h-[6.6em] md:text-sm"
                    style={body}
                  >
                    {t(role.descKey)}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </Rise>
      </section>

      {/* ─────────────── what it takes, in three screens ─────────────── */}
      <Scene id="solutions" photo="/home/v2/room-close.jpg" dim={0.38} className="px-6 pb-16 pt-20 md:px-16 md:pb-20 md:pt-28">
        <div className="mx-auto w-full max-w-6xl">
          <Rise>
            <h2
              className="max-w-3xl text-[clamp(28px,5vw,64px)] font-black uppercase leading-[0.98] tracking-tight text-white"
              style={display}
            >
              {t("home_solutions_title")}
            </h2>
          </Rise>

          {/* Phones first on a phone — swiped; a trio on a desktop. */}
          <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-16 md:justify-center md:gap-6 md:overflow-visible md:pb-0 lg:gap-8 [&::-webkit-scrollbar]:hidden">
            {SHOTS.map((s, i) => (
              <div key={s.shot} className="flex shrink-0 snap-center flex-col items-start md:shrink">
                <PhoneScreen src={s.shot} drift={ARC[i].drift} lift={ARC[i].lift} priority={i === 0} />
                <div className="mt-5 w-[64vw] max-w-[260px] md:w-[clamp(126px,13.4vw,196px)]">
                  <h3
                    className="text-[17px] font-black uppercase leading-[1.05] tracking-tight text-white md:min-h-[2.2em] md:text-base lg:text-lg"
                    style={display}
                  >
                    {t(s.titleKey)}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/55 md:text-[12px] lg:text-[13px]" style={body}>
                    {t(s.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Scene>

      {/* ─────────────── the door ───────────────
          Ethos and invitation in one frame: they were always the same thought. */}
      <section className="relative z-10 flex min-h-[82vh] flex-col items-center justify-center px-6 pb-24 pt-10 text-center">
        <Rise>
          <span className="text-[10px] uppercase tracking-[0.3em] text-infrared" style={supreme}>
            {t("home_ethos_title")}
          </span>
        </Rise>
        <Rise delay={0.1}>
          <h2
            className="mt-7 max-w-4xl text-[clamp(32px,6.4vw,84px)] font-black uppercase leading-[0.94] tracking-tight text-white"
            style={display}
          >
            {t("home_final_cta_title")}
          </h2>
        </Rise>
        <Rise delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/55" style={body}>
            {t("home_ethos_sub")}
          </p>
        </Rise>
        <Rise delay={0.24}>
          <Link
            href="/apply?start=role"
            className="mt-10 inline-block rounded-full border border-white/60 px-11 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition-all duration-300 hover:border-infrared hover:bg-infrared"
            style={supreme}
          >
            {t("apply_for_membership")}
          </Link>
        </Rise>
        <Rise delay={0.3}>
          <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-white/40" style={body}>
            {t("home_final_cta_sub")}
          </p>
        </Rise>
      </section>
    </main>
  );
}
