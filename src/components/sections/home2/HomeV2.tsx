"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { scrollToId } from "@/lib/scroll";
import { Scene } from "./Scene";

const EASE_TORA = [0.16, 1, 0.3, 1] as const;
const display = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const body = { fontFamily: "var(--font-space-grotesk), sans-serif" };
const supreme = { fontFamily: "var(--font-supreme), var(--font-space-grotesk), sans-serif" };

/** A phone screenshot dissolves downward — it still needs its own top edge. */
const featherDown = {
  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%)",
  maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%)",
};

/** A person dissolves on every side, so no rectangle is ever drawn around them.
 *  The radii must stay at or under 50% of the box width, or the gradient's
 *  transparent stop falls outside the element and the sides cut hard. */
const featherAll = {
  WebkitMaskImage: "radial-gradient(50% 56% at 50% 42%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
  maskImage: "radial-gradient(50% 56% at 50% 42%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
};

const ROLES = [
  { id: "artist", label: "Artist", descKey: "home_role_artist_desc", color: "#6B5FFF",
    face: "/home/v2/face-artist.jpg", room: "/home/v2/room-artist.jpg" },
  { id: "agent", label: "Agent", descKey: "home_role_agent_desc", color: "#00C875",
    face: "/home/v2/face-agent.jpg", room: "/home/v2/room-agent.jpg" },
  { id: "promoter", label: "Promoter", descKey: "home_role_promoter_desc", color: "#FFB800",
    face: "/home/v2/face-promoter.jpg", room: "/home/v2/room-promoter.jpg" },
  { id: "venue", label: "Venue", descKey: "home_role_venue_desc", color: "#FF5757",
    face: "/home/v2/face-venue.jpg", room: "/home/v2/room-venue.jpg" },
];

const STEPS = [
  { titleKey: "home_journey_discover_title", descKey: "home_journey_discover_desc", shot: "/home/discover.png" },
  { titleKey: "home_journey_connect_title", descKey: "home_journey_connect_desc", shot: "/home/connect.png" },
  { titleKey: "home_journey_offer_title", descKey: "home_journey_offer_desc", shot: "/home/offer.png" },
  { titleKey: "home_journey_contract_title", descKey: "home_journey_contract_desc", shot: "/home/contract.png" },
  { titleKey: "home_journey_confirmed_title", descKey: "home_journey_confirmed_desc", shot: "/home/book.png" },
];

/** Rises into place once, from a visible resting state — never left at zero. */
function Rise({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.85, ease: EASE_TORA, delay }}
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
            className="h-auto w-[280px] object-contain md:w-[420px]"
          />
          <span
            className="mt-3 text-[12px] uppercase tracking-[0.3em] text-white md:text-[14px]"
            style={supreme}
          >
            {t("where_music_meets")}
          </span>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => scrollToId("network")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.9 }}
          className="absolute bottom-14 flex flex-col items-center gap-3 text-white/45 transition-colors hover:text-white"
          aria-label={t("scroll_explore")}
        >
          <span className="text-[10px] uppercase tracking-[0.34em]" style={supreme}>
            {t("scroll_explore")}
          </span>
          <motion.span
            className="block h-10 w-px bg-current"
            animate={{ scaleY: [0.25, 1, 0.25], transformOrigin: ["top", "top", "bottom"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.button>
      </Scene>

      {/* ─────────────── what is wrong ─────────────── */}
      <Scene photo="/home/v2/room-open.jpg" className="flex min-h-screen items-center px-6 md:px-16">
        <div id="network" className="absolute -top-24" />
        <div className="mx-auto w-full max-w-5xl">
          <Rise>
            <h2
              className="whitespace-pre-line text-[clamp(34px,7vw,86px)] font-black uppercase leading-[0.96] tracking-tight text-white"
              style={display}
            >
              {t("home_problem")}
            </h2>
          </Rise>
          <div className="mt-10 max-w-xl" style={body}>
            {t("home_problem_sub")
              .split("\n")
              .map((line, i) => (
                <Rise key={line} delay={0.12 + i * 0.12}>
                  <p className="border-l border-white/15 py-2 pl-5 text-base leading-relaxed text-white/55 md:text-lg">
                    {line}
                  </p>
                </Rise>
              ))}
          </div>
        </div>
      </Scene>

      {/* ─────────────── the turn ─────────────── */}
      <Scene className="flex min-h-[85vh] items-center px-6 md:px-16">
        <div className="mx-auto w-full max-w-5xl">
          <Rise>
            <h2
              className="text-[clamp(36px,8vw,104px)] font-black uppercase leading-[0.92] tracking-tight text-white"
              style={display}
            >
              {t("home_shift")}
            </h2>
          </Rise>
          <Rise delay={0.15}>
            <p
              className="mt-8 whitespace-pre-line text-sm uppercase leading-relaxed tracking-[0.2em] text-infrared/85 md:text-base"
              style={body}
            >
              {t("home_shift_sub")}
            </p>
          </Rise>
        </div>
      </Scene>

      {/* ─────────────── four rooms ─────────────── */}
      <div id="roles" className="scroll-mt-20">
        {ROLES.map((role, i) => (
          <Scene
            key={role.id}
            photo={role.room}
            tint={role.color}
            className={`flex min-h-screen items-end px-6 pb-16 md:items-center md:px-16 md:pb-0 ${i % 2 ? "justify-end" : ""}`}
          >
            <div
              className={`flex w-full max-w-6xl flex-col items-start gap-8 md:items-end md:gap-16 ${
                i % 2 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="min-w-0 flex-1 md:pb-[6vh]">
                <Rise>
                  <span
                    className="block h-px w-16"
                    style={{ background: role.color }}
                  />
                  <h3
                    className="mt-6 text-[clamp(54px,12vw,150px)] font-black uppercase leading-[0.84] tracking-tight"
                    style={{ ...display, color: role.color }}
                  >
                    {role.label}
                  </h3>
                </Rise>
                <Rise delay={0.12}>
                  <p
                    className="mt-7 max-w-md text-base leading-relaxed text-white/70 md:text-xl"
                    style={body}
                  >
                    {t(role.descKey)}
                  </p>
                </Rise>
              </div>

              {/* One person, large. Not a row of faces — a row reads as a
                  member directory, and these are generated people. */}
              <Rise delay={0.2} className="w-full md:w-auto">
                <div
                  className="relative h-[46vh] w-[76vw] max-w-[460px] md:h-[58vh] md:w-[30vw]"
                  style={featherAll}
                >
                  <Image
                    src={role.face}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(min-width: 768px) 340px, 62vw"
                    className="object-cover object-top"
                  />
                  {/* A touch of the room's light on the person, not a duotone */}
                  <div
                    className="absolute inset-0 mix-blend-color"
                    style={{ background: role.color, opacity: 0.16 }}
                  />
                </div>
              </Rise>
            </div>
          </Scene>
        ))}
      </div>

      {/* ─────────────── what it takes ─────────────── */}
      <Scene photo="/home/v2/room-close.jpg" dim={0.42} className="scroll-mt-20 px-6 pt-28 md:px-16">
        <div id="solutions" className="absolute -top-24" />
        <div className="mx-auto w-full max-w-5xl">
          <Rise>
            <h2
              className="text-[clamp(30px,6vw,72px)] font-black uppercase leading-[0.96] tracking-tight text-white"
              style={display}
            >
              {t("home_solutions_title")}
            </h2>
          </Rise>
        </div>

        <div className="mx-auto mt-20 w-full max-w-5xl">
          {STEPS.map((step, i) => (
            <div
              key={step.titleKey}
              className={`flex flex-col items-center gap-8 py-16 md:gap-20 md:py-24 ${
                i % 2 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <Rise className="min-w-0 flex-1">
                <span
                  className="text-[11px] tracking-[0.12em] text-infrared"
                  style={{ ...supreme, fontVariantNumeric: "tabular-nums" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="mt-3 text-[clamp(26px,4.4vw,48px)] font-black uppercase leading-[1] tracking-tight text-white"
                  style={display}
                >
                  {t(step.titleKey)}
                </h3>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-white/60" style={body}>
                  {t(step.descKey)}
                </p>
              </Rise>

              <Rise delay={0.12}>
                <div
                  className="relative h-[380px] w-[180px] overflow-hidden md:h-[520px] md:w-[248px]"
                  style={featherDown}
                >
                  <Image
                    src={step.shot}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(min-width: 768px) 248px, 180px"
                    className="object-cover object-top"
                  />
                </div>
              </Rise>
            </div>
          ))}
        </div>
      </Scene>

      {/* ─────────────── the door ─────────────── */}
      <section className="flex min-h-screen items-center px-6 md:px-16">
        <div className="mx-auto w-full max-w-4xl text-center">
          <Rise>
            <h2
              className="text-[clamp(30px,6vw,76px)] font-black uppercase leading-[0.96] tracking-tight text-white"
              style={display}
            >
              {t("home_ethos_title")}
            </h2>
          </Rise>
          <Rise delay={0.12}>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/55 md:text-lg" style={body}>
              {t("home_ethos_sub")}
            </p>
          </Rise>
        </div>
      </section>

      <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 pb-32 text-center">
        <Rise>
          <h2
            className="text-[clamp(34px,7vw,92px)] font-black uppercase leading-[0.94] tracking-tight text-white"
            style={display}
          >
            {t("home_final_cta_title")}
          </h2>
        </Rise>
        <Rise delay={0.12}>
          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-white/45" style={body}>
            {t("home_final_cta_sub")}
          </p>
        </Rise>
        <Rise delay={0.22}>
          <Link
            href="/apply?start=role"
            className="mt-12 inline-block rounded-full border border-white/60 px-12 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition-all duration-300 hover:border-infrared hover:bg-infrared"
            style={supreme}
          >
            {t("apply_for_membership")}
          </Link>
        </Rise>
      </section>
    </main>
  );
}
