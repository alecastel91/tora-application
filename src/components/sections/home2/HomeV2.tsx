"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { scrollToId } from "@/lib/scroll";
import { Scene } from "./Scene";

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

/** Three screens carry the product. Every one of them is a moment, not a list:
 *  the network on a globe, the yes, and the deal tracked to paid. The other two
 *  journey steps are named in the strip underneath rather than given a screen
 *  each — five phones in a row is an inventory, not an argument. */
const SHOTS = [
  { shot: "/home/discover.png", titleKey: "home_journey_discover_title", descKey: "home_journey_discover_desc" },
  { shot: "/home/offer.png", titleKey: "home_journey_offer_title", descKey: "home_journey_offer_desc" },
  { shot: "/home/book.png", titleKey: "home_journey_confirmed_title", descKey: "home_journey_confirmed_desc" },
];

const STEP_KEYS = [
  "home_journey_discover_title",
  "home_journey_connect_title",
  "home_journey_offer_title",
  "home_journey_contract_title",
  "home_journey_confirmed_title",
];

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

/**
 * One app screen in a phone frame, drifting at its own speed as the section
 * passes. The drift is what keeps three static PNGs from reading as a product
 * sheet; `lift` raises the middle phone so the trio has a shape.
 */
function Phone({
  src,
  drift,
  lift = 0,
  priority,
}: {
  src: string;
  drift: number;
  lift?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The raise rides inside the same transform as the drift: as margin it pushed
  // the caption down with it and the three captions stopped sharing a line.
  const y = useTransform(scrollYProgress, [0, 1], [drift + lift, -drift + lift]);

  return (
    <div ref={ref} className="shrink-0">
      <motion.div
        style={{ y }}
        className="relative w-[64vw] max-w-[260px] rounded-[2rem] border border-white/10 bg-black p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] md:w-[clamp(180px,17vw,252px)]"
      >
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          width={860}
          height={1962}
          priority={priority}
          sizes="(min-width: 768px) 252px, 64vw"
          className="h-auto w-full rounded-[1.6rem]"
        />
      </motion.div>
    </div>
  );
}

export function HomeV2() {
  const { t } = useLanguage();

  return (
    <main className="relative z-10 font-sans selection:bg-infrared/30 selection:text-white">
      {/* ─────────────── the way in ─────────────── */}
      <Scene className="flex min-h-screen flex-col items-center justify-center px-6">
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
      <Scene photo="/home/v2/room-open.jpg" className="flex min-h-[92vh] items-center px-6 py-20 md:px-16">
        <div id="network" className="absolute -top-24" />
        <div className="mx-auto w-full max-w-6xl">
          <Rise>
            <h2
              className="max-w-4xl text-[clamp(32px,6.4vw,76px)] font-black uppercase leading-[0.96] tracking-tight text-white"
              style={display}
            >
              {t("home_problem")}
            </h2>
          </Rise>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:mt-14 md:grid-cols-3">
            {t("home_problem_sub")
              .split("\n")
              .map((line, i) => (
                <Rise key={line} delay={0.1 + i * 0.1}>
                  <p
                    className="h-full bg-black/55 px-5 py-5 text-[15px] leading-relaxed text-white/60 backdrop-blur-sm md:px-6 md:py-7 md:text-base"
                    style={body}
                  >
                    {line}
                  </p>
                </Rise>
              ))}
          </div>

          <Rise delay={0.2}>
            <h3
              className="mt-14 max-w-3xl text-[clamp(26px,4.6vw,56px)] font-black uppercase leading-[1] tracking-tight text-white md:mt-20"
              style={display}
            >
              {t("home_shift")}
            </h3>
            <p
              className="mt-5 whitespace-pre-line text-[11px] uppercase leading-relaxed tracking-[0.22em] text-infrared md:text-sm"
              style={body}
            >
              {t("home_shift_sub")}
            </p>
          </Rise>
        </div>
      </Scene>

      {/* ─────────────── the four, side by side ───────────────
          Four full screens became one wall. On a phone it is a swipe, so the
          roles cost a single screen there too. */}
      <section id="roles" className="scroll-mt-20 py-16 md:py-24">
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
                className="group relative block h-[62vh] w-[74vw] overflow-hidden rounded-2xl border border-white/10 md:h-[58vh] md:w-full"
              >
                <Image
                  src={role.face}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 768px) 24vw, 74vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                {/* The role's colour as light on the photograph, then enough
                    black at the foot for the words to sit on. */}
                <div
                  className="absolute inset-0 mix-blend-color"
                  style={{ background: role.color, opacity: 0.22 }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.45) 48%, rgba(10,10,10,0.95) 100%)`,
                  }}
                />
                <span className="absolute left-0 top-0 h-1 w-full" style={{ background: role.color }} />
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
      <Scene photo="/home/v2/room-close.jpg" dim={0.38} className="scroll-mt-20 px-6 pb-16 pt-20 md:px-16 md:pb-20 md:pt-28">
        <div id="solutions" className="absolute -top-24" />
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
          <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-16 md:justify-center md:gap-10 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
            {SHOTS.map((s, i) => (
              <div key={s.shot} className="flex shrink-0 snap-center flex-col items-start md:shrink">
                <Phone src={s.shot} drift={i === 1 ? 46 : 26} lift={i === 1 ? -28 : 0} priority={i === 0} />
                <div className="mt-5 w-[64vw] max-w-[260px] md:w-[clamp(180px,17vw,252px)]">
                  <h3
                    className="text-[17px] font-black uppercase leading-[1.05] tracking-tight text-white md:text-xl"
                    style={display}
                  >
                    {t(s.titleKey)}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/55" style={body}>
                    {t(s.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* The whole run, named — the two screens left out are still here. */}
          <Rise delay={0.12}>
            <ol
              className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-7 md:mt-20 md:gap-x-9"
              style={supreme}
            >
              {STEP_KEYS.map((key, i) => (
                <li key={key} className="flex items-baseline gap-2">
                  <span
                    className="text-[10px] text-infrared"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-white/70 md:text-xs">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ol>
          </Rise>
        </div>
      </Scene>

      {/* ─────────────── the door ───────────────
          Ethos and invitation in one frame: they were always the same thought. */}
      <section className="flex min-h-[82vh] flex-col items-center justify-center px-6 pb-24 pt-10 text-center">
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
