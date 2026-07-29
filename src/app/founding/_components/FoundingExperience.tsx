"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FoundingBackdrop } from "./FoundingBackdrop";
import {
  Eyebrow,
  PhoneFrame,
  Reveal,
  ROLE,
  ScrollInsidePhone,
  ScrollProgress,
  Section,
  EASE,
  grotesk,
  rajdhani,
  supreme,
} from "./primitives";

/* ------------------------------------------------------------------ content */

const PROBLEMS = [
  {
    n: "01",
    title: "No central directory",
    body: "Artists, agents, promoters and venues have no shared platform. Most booking requests still start with cold DMs and unanswered emails.",
  },
  {
    n: "02",
    title: "International bookings are inaccessible",
    body: "Bringing artists across markets is expensive, risky and poorly coordinated. Building a sustainable tour without an established network is nearly impossible.",
  },
  {
    n: "03",
    title: "The market is gatekept",
    body: "Opportunities sit with a few players. Emerging artists, independent promoters and new venues have no structured way to get discovered and build credibility.",
  },
  {
    n: "04",
    title: "No path from search to signed deal",
    body: "No single tool handles the full booking process — discovery, proposal, negotiation, contract, documents and payment.",
  },
];

const ROLES = [
  {
    id: "artist",
    label: "Artist",
    color: ROLE.artist,
    body: "DJs, live acts and producers looking for global bookings and professional representation.",
    icon: (c: string) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="3" y="14" width="4" height="6" rx="1.5" />
        <rect x="17" y="14" width="4" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "agent",
    label: "Agent",
    color: ROLE.agent,
    body: "Talent agencies managing artist rosters, tours, deals and international opportunities.",
    icon: (c: string) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="3" />
        <circle cx="5" cy="17" r="2.4" />
        <circle cx="19" cy="17" r="2.4" />
        <path d="M12 10v3M12 13l-4.6 2.2M12 13l4.6 2.2" />
      </svg>
    ),
  },
  {
    id: "promoter",
    label: "Promoter",
    color: ROLE.promoter,
    body: "Event organisers who book talent, build lineups and manage venue partnerships globally.",
    icon: (c: string) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10v4l11 5V5L3 10Z" />
        <path d="M14 8a4 4 0 0 1 0 8" />
      </svg>
    ),
  },
  {
    id: "venue",
    label: "Venue",
    color: ROLE.venue,
    body: "Clubs and event spaces that want to attract the right artists and fill their calendar.",
    icon: (c: string) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V9l8-5 8 5v11" />
        <path d="M9 20v-5a3 3 0 0 1 6 0v5" />
      </svg>
    ),
  },
] as const;

const DEEPDIVES = [
  {
    role: "Artist",
    color: ROLE.artist,
    shot: "/founding/shots/artist-full.png",
    headline: ["Get discovered.", "Book globally."],
    body: "A verified profile that represents you professionally — genres, socials, availability, press kit. Visible to promoters and venues worldwide, not just in your city.",
    points: [
      "Global search & discovery",
      "Calendar & availability sharing",
      "Direct booking proposals",
      "Contract & payment workflow",
      "Agent connection & management",
    ],
  },
  {
    role: "Agent",
    color: ROLE.agent,
    shot: "/founding/shots/agent-full.png",
    headline: ["Manage your roster.", "Close deals."],
    body: "One dashboard for your entire artist roster. Track every deal, calendar, contract and payment across all your artists — without losing your mind.",
    points: [
      "Multi-artist roster management",
      "Deal & negotiation tracking",
      "Tier pricing: Solo to Unlimited",
      "Per-artist financial overview",
      "Book gigs directly on their behalf",
    ],
  },
  {
    role: "Promoter",
    color: ROLE.promoter,
    shot: "/founding/shots/promoter-full.png",
    headline: ["Find the right act.", "Build the right lineup."],
    body: "Search artists by genre, location and availability. Find venues to host your events. Send booking proposals directly — no intermediary required, unless you want one.",
    points: [
      "Genre + location + availability filters",
      "Direct proposals to artists or agents",
      "Tour Kickstart: share booking costs",
      "Calendar-based matching",
      "Contract & payment in-platform",
    ],
  },
  {
    role: "Venue",
    color: ROLE.venue,
    shot: "/founding/shots/venue-full.png",
    headline: ["Get seen.", "Fill your calendar."],
    body: "Your venue profile is visible to artists and agents planning tours. Set your dates, capacity and genres — TORA surfaces you to the right people at the right time.",
    points: [
      "Venue profile with capacity & specs",
      "Date availability calendar",
      "Advance notice for touring artists",
      "Inbound booking proposals",
      "Tour Kickstart: co-host touring acts",
    ],
  },
] as const;

const CALENDAR_POINTS = [
  { k: "Set your dates", t: "Travel Schedule", b: "Mark the cities you'll be in and when. Artists set tour dates, agents plan routing, promoters see who's incoming to their market." },
  { k: "Find overlaps", t: "Calendar Matching", b: "TORA cross-references availability across all roles — artists matched with open venues, promoters matched with artists passing through their city." },
  { k: "Stay informed", t: "Smart Notifications", b: "Get notified when a relevant professional is available in your market. The platform surfaces the right match at the right time." },
];

const KICKSTART = [
  { t: "Lower cost", b: "Expenses split between multiple venues on the same tour route." },
  { t: "Less risk", b: "No single venue carries the full financial exposure of an international booking." },
  { t: "More artists", b: "Acts that were unaffordable for a single market become accessible." },
];

const STEPS = [
  { n: "1", t: "Discover", b: "Search by genre, location and availability. Find the right match." },
  { n: "2", t: "Connect", b: "Send a connection request with a message. Start the conversation." },
  { n: "3", t: "Offer", b: "Submit a booking offer with dates, fee and additional terms." },
  { n: "4", t: "Negotiate", b: "Counter-offer and refine until both parties agree on all terms." },
  { n: "5", t: "Contract", b: "Generate and sign a digital booking contract within the platform." },
  { n: "6", t: "Payment", b: "Share the invoice and confirm payment. Full transaction history on record." },
];

/* --------------------------------------------------------------- utilities */

const INFRARED = "#FF3366";

function Bullet({ text, color }: { text: string; color: string }) {
  return (
    <li className="flex items-start gap-3" style={grotesk}>
      <svg className="mt-1 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span className="text-white/70 text-[15px] leading-relaxed">{text}</span>
    </li>
  );
}

/* ---------------------------------------------------------------- sections */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const reduce = useReducedMotion();

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* cinematic layer behind the wordmark — radial pulse + faint rotating orb */}
      <motion.div aria-hidden style={{ opacity, y }} className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <motion.div
          className="absolute h-[62vh] max-h-[560px] w-[62vh] max-w-[560px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,51,102,0.16) 0%, transparent 62%)" }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={reduce ? { opacity: 0.7, scale: 1 } : { opacity: [0.45, 0.8, 0.45], scale: [0.94, 1.06, 0.94] }}
          transition={reduce ? { duration: 1.2, ease: EASE } : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-[46vh] max-h-[420px] w-[46vh] max-w-[420px] opacity-[0.06]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07, rotate: reduce ? 0 : 360 }}
          transition={{
            opacity: { duration: 1.4, ease: EASE },
            rotate: { duration: 90, repeat: Infinity, ease: "linear" },
          }}
        >
          <Image src="/loading-globe.png" alt="" width={420} height={420} className="h-full w-full object-contain" />
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity, y }} className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Image src="/tora_logo_transparent.png" alt="TORA" width={500} height={166} priority className="h-auto w-[210px] md:w-[300px]" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-8 text-[11px] md:text-xs uppercase tracking-[0.34em] text-infrared"
          style={{ ...supreme, fontWeight: 500 }}
        >
          Founding Members · Applications open
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
          className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white text-balance md:text-5xl"
          style={supreme}
        >
          The club music industry, finally in one place
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
          className="mt-5 max-w-xl text-white/55 text-sm leading-relaxed md:text-base"
          style={grotesk}
        >
          Artists, agents, promoters and venues — connected in a single professional
          network. From first contact to final payment, every booking in one platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/apply" className="rounded-full bg-infrared px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(255,51,102,0.5)] hover:brightness-110" style={supreme}>
            Become a Founding Member
          </Link>
          <a href="#problem" className="rounded-full border border-white/30 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10" style={supreme}>
            See how it works
          </a>
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity }} className="absolute bottom-10 flex flex-col items-center gap-2 text-white/50">
        <span className="text-[10px] uppercase tracking-[0.3em]" style={supreme}>Where music meets</span>
        <motion.svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M12 5v14" /><path d="M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.div>
    </section>
  );
}

/* Chapter 2 — Problem flowing directly into Solution, one continuous argument. */
function ProblemSolution() {
  return (
    <Section id="problem">
      <Reveal><Eyebrow>The Problem</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-5 max-w-2xl text-3xl font-black uppercase leading-[1.05] tracking-tight text-white text-balance md:text-5xl" style={rajdhani}>
          The club music industry runs on outdated processes and tools
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2">
        {PROBLEMS.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.06}>
            <motion.div
              className="border-t border-white/10 pt-5 transition-colors"
              whileHover={{ borderColor: "rgba(255,51,102,0.5)" }}
            >
              <span className="text-2xl font-black text-infrared" style={rajdhani}>{p.n}</span>
              <h3 className="mt-2 text-lg font-semibold text-white" style={supreme}>{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/55" style={grotesk}>{p.body}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>

      {/* transition seam — the argument resolves */}
      <Reveal delay={0.1}>
        <div className="mx-auto mt-24 flex flex-col items-center">
          <span className="h-16 w-px bg-gradient-to-b from-transparent to-infrared/60" />
          <div className="mt-8 flex justify-center"><Eyebrow>The Solution</Eyebrow></div>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mx-auto mt-6 max-w-4xl text-center text-4xl font-black uppercase leading-[1.02] tracking-tight text-white md:text-7xl" style={rajdhani}>
          One platform,{" "}
          <span className="text-infrared">every booking</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-white/60 md:text-lg" style={grotesk}>
          TORA connects the four pillars of the club music industry — Artists, Agents,
          Promoters and Venues — in a single professional network. From first contact to
          final payment confirmation, everything happens in one seamless platform.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mx-auto mt-12 flex max-w-md items-center justify-center gap-3 md:gap-6">
          {ROLES.map((r) => (
            <div key={r.id} className="flex flex-col items-center gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border" style={{ borderColor: `${r.color}55`, background: `${r.color}12` }}>
                {r.icon(r.color)}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/50" style={supreme}>{r.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* Chapter 3 — The Network. Role deep-dives, each a scroll-linked phone + copy. */
function Network() {
  return (
    <div className="relative">
      <Section className="pb-8 text-center md:pb-10">
        <Reveal className="flex justify-center"><Eyebrow>The Network</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black uppercase leading-[1.04] tracking-tight text-white text-balance md:text-5xl" style={rajdhani}>
            Four roles, one ecosystem
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/55 md:text-base" style={grotesk}>
            Every side of the industry gets a purpose-built profile — and they all book each
            other in the same place.
          </p>
        </Reveal>
      </Section>

      {DEEPDIVES.map((d) => (
        <Section key={d.role} className="py-16 md:py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Reveal><Eyebrow color={d.color}>{d.role}</Eyebrow></Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 text-3xl font-black uppercase leading-[1.03] tracking-tight text-balance md:text-4xl" style={rajdhani}>
                  <span className="text-white">{d.headline[0]}</span>{" "}
                  <span style={{ color: d.color }}>{d.headline[1]}</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-[15px] leading-relaxed text-white/60" style={grotesk}>{d.body}</p>
              </Reveal>
              <Reveal delay={0.15}>
                <ul className="mt-6 space-y-3">
                  {d.points.map((p) => <Bullet key={p} text={p} color={d.color} />)}
                </ul>
              </Reveal>
            </div>
            <ScrollInsidePhone
              src={d.shot}
              alt={`${d.role} profile in the TORA app`}
              glow={d.color}
              className="md:order-2"
            />
          </div>
        </Section>
      ))}
    </div>
  );
}

/* Chapter 4 — Discovery / the global network globe. */
function Discovery() {
  return (
    <Section>
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <Reveal><Eyebrow>Search &amp; Discovery</Eyebrow></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-3xl font-black uppercase leading-[1.03] tracking-tight text-white text-balance md:text-5xl" style={rajdhani}>
              Your profile, seen{" "}
              <span className="text-infrared">worldwide</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-[15px] leading-relaxed text-white/60 md:text-base" style={grotesk}>
              TORA maps the industry across the globe. Filter by role, genre, location and
              availability, and find the right professional in seconds — wherever they are.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {ROLES.map((r) => (
                <span key={r.id} className="flex items-center gap-2 text-[13px] text-white/60" style={grotesk}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color, boxShadow: `0 0 10px ${r.color}88` }} />
                  {r.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal className="md:order-2">
          <div className="relative mx-auto w-[230px] sm:w-[260px] rounded-[2.4rem] bg-[#0a0a0f] p-2 shadow-2xl">
            <div aria-hidden className="absolute -inset-8 -z-10 rounded-[3rem] blur-3xl" style={{ background: "#FF3366", opacity: 0.16 }} />
            <div className="overflow-hidden rounded-[1.9rem]">
              <video src="/founding/globe.mp4" autoPlay muted loop playsInline className="block w-full" />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* Chapter 5 — Booking flow. Pinned phone (desktop) while the 6 steps advance. */
function StepRow({ step, reduce }: { step: (typeof STEPS)[number]; reduce: boolean | null }) {
  return (
    <motion.div
      className="rounded-2xl border p-6 md:p-7"
      style={{ background: "rgba(255,255,255,0.02)" }}
      initial={reduce ? { opacity: 1, borderColor: "rgba(255,51,102,0.4)" } : { opacity: 0.4, borderColor: "rgba(255,255,255,0.08)" }}
      whileInView={{
        opacity: 1,
        borderColor: "rgba(255,51,102,0.7)",
        boxShadow: "0 18px 50px -22px rgba(255,51,102,0.45)",
      }}
      viewport={{ once: false, margin: "-45% 0px -45% 0px" }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="flex items-start gap-5">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-infrared/60 bg-black text-base font-bold text-infrared"
          style={rajdhani}
        >
          {step.n}
        </span>
        <div className="pt-1">
          <h3 className="text-lg font-bold uppercase tracking-wide text-white" style={rajdhani}>{step.t}</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-white/55" style={grotesk}>{step.b}</p>
        </div>
      </div>
    </motion.div>
  );
}

function BookingFlow() {
  const reduce = useReducedMotion();
  return (
    <Section>
      <Reveal className="text-center"><div className="flex justify-center"><Eyebrow>How it works</Eyebrow></div></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-5 text-center text-3xl font-black uppercase leading-[1.05] tracking-tight text-white text-balance md:text-5xl" style={rajdhani}>
          From first contact to payment
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mx-auto mt-6 max-w-xl text-center text-[15px] leading-relaxed text-white/55 md:text-base" style={grotesk}>
          One continuous flow — discover, agree, sign and get paid. These are real accepted
          deals, fees and all.
        </p>
      </Reveal>

      {/* the 6 steps as a centered vertical timeline */}
      <div className="mx-auto mt-16 max-w-xl space-y-6 md:space-y-8">
        {STEPS.map((s) => (
          <StepRow key={s.n} step={s} reduce={reduce} />
        ))}
      </div>

      {/* the real Offer → Contract → Documents → Payment tracker */}
      <div className="mt-16 flex justify-center">
        <PhoneFrame src="/founding/shots/bookings.png" alt="A booking in TORA, step by step" glow={INFRARED} />
      </div>
    </Section>
  );
}

function CalendarSpotlight() {
  return (
    <Section>
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <Reveal><Eyebrow>Feature Spotlight</Eyebrow></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-3xl font-black uppercase leading-[1.03] tracking-tight text-white text-balance md:text-4xl" style={rajdhani}>
              Calendar matching &amp; travel schedule
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-relaxed text-white/60" style={grotesk}>
              Set where you&rsquo;ll be and when. TORA matches you automatically with the
              right professionals across roles, genres and time zones.
            </p>
          </Reveal>
          <div className="mt-8 space-y-6">
            {CALENDAR_POINTS.map((c, i) => (
              <Reveal key={c.k} delay={0.1 + i * 0.06}>
                <div className="border-l border-white/10 pl-5">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-infrared" style={supreme}>{c.k}</span>
                  <h3 className="mt-1 text-base font-semibold text-white" style={supreme}>{c.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/55" style={grotesk}>{c.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <PhoneFrame src="/founding/shots/calendar.png" alt="Availability calendar in TORA" glow={INFRARED} className="md:order-2" />
      </div>
    </Section>
  );
}

function TourKickstart() {
  return (
    <Section>
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-14">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Reveal><Eyebrow>Feature Spotlight</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-3xl font-black uppercase leading-[1.03] tracking-tight text-white md:text-5xl" style={rajdhani}>
                Tour Kickstart
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base" style={grotesk}>
                Bringing international artists on tour is expensive — flights, accommodation
                and fees make single-night bookings unviable for most venues. Tour Kickstart
                lets promoters and venues co-host the same touring artist: splitting travel
                costs, sharing risk, and making previously impossible bookings viable.
              </p>
            </Reveal>
          </div>
          <PhoneFrame src="/founding/shots/tour.png" alt="A tour in TORA — Tour Kickstart" glow={INFRARED} className="md:order-2" />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {KICKSTART.map((k, i) => (
            <Reveal key={k.t} delay={i * 0.08}>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                <h3 className="text-lg font-bold uppercase tracking-wide text-infrared" style={rajdhani}>{k.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60" style={grotesk}>{k.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FoundingCTA() {
  return (
    <Section className="text-center">
      <Reveal className="flex justify-center"><Eyebrow>Join TORA</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black uppercase leading-[1.0] tracking-tight text-white md:text-7xl" style={rajdhani}>
          Become a<br />Founding Member
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg" style={grotesk}>
          The first to join TORA — full access from launch, a direct line to the team,
          and founding-member status as the network grows.
        </p>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-3xl gap-5 md:grid-cols-2">
        {[
          { t: "Full access", b: "Every feature from day one — calendar, bookings, messaging, contracts." },
          { t: "Shape the product", b: "A direct line to the team. Your feedback influences what gets built next." },
        ].map((f, i) => (
          <Reveal key={f.t} delay={i * 0.08}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left" style={{ borderTop: `2px solid ${INFRARED}` }}>
              <h3 className="text-base font-semibold text-white" style={supreme}>{f.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55" style={grotesk}>{f.b}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <div className="mt-12 flex flex-col items-center gap-4">
          <Link href="/apply" className="rounded-full bg-infrared px-10 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(255,51,102,0.55)] hover:brightness-110" style={supreme}>
            Apply now
          </Link>
          <span className="text-sm text-white/45" style={grotesk}>
            torahub.io · expected launch October 2026
          </span>
        </div>
      </Reveal>
    </Section>
  );
}

function Closing() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 px-6 py-28 text-center">
      <Reveal>
        <Image src="/tora_logo_transparent.png" alt="TORA" width={400} height={133} className="h-auto w-[150px] opacity-90" />
      </Reveal>
      <Reveal delay={0.08}>
        <span className="text-[11px] uppercase tracking-[0.4em] text-white/45" style={supreme}>Where music meets</span>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------- shell */

export function FoundingExperience() {
  return (
    <main className="relative overflow-x-clip font-sans text-white selection:bg-infrared/30">
      <ScrollProgress />
      <FoundingBackdrop />
      <Hero />
      <ProblemSolution />
      <Network />
      <Discovery />
      <BookingFlow />
      <CalendarSpotlight />
      <TourKickstart />
      <FoundingCTA />
      <Closing />
    </main>
  );
}
