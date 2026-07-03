"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROLES, type Role } from "./home.data";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const TOTAL = ROLES.length;

/**
 * One role in the pinned cycler. Owns its own scroll window [i/TOTAL,(i+1)/TOTAL]
 * — hooks stay stable because it's a fixed component per role.
 */
function RolePanel({ role, i, progress }: { role: Role; i: number; progress: MotionValue<number> }) {
  const { t } = useLanguage();
  const seg = 1 / TOTAL;
  const start = i * seg;
  const end = start + seg;
  const inPt = i === 0 ? 0 : start - 0.02;
  const full1 = start + seg * 0.28;
  const full2 = end - seg * 0.28;
  const outPt = i === TOTAL - 1 ? 1 : end + 0.02;

  const opacity = useTransform(
    progress,
    [inPt, full1, full2, outPt],
    [i === 0 ? 1 : 0, 1, 1, i === TOTAL - 1 ? 1 : 0],
  );
  const y = useTransform(progress, [start, end], [50, -50]);
  const scale = useTransform(progress, [inPt, full1, full2, outPt], [0.96, 1, 1, 0.96]);

  return (
    <motion.div style={{ opacity, y, scale }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
        style={{ background: `${role.color}10`, border: `1px solid ${role.color}30` }}
      >
        <div className="scale-[1.6]">{role.icon}</div>
      </div>
      <div className="text-sm font-bold uppercase tracking-[0.3em] mb-4" style={{ color: role.color }}>
        {t(role.labelKey)}
      </div>
      <div
        className="max-w-3xl text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05]"
        style={headingFont}
      >
        {t(role.valueKey)}
      </div>
    </motion.div>
  );
}

/**
 * Beat 4 desktop — a pinned section that cycles the 4 roles as you scroll, each
 * with its color accent. Falls back to RolesStack on mobile / reduced motion.
 */
export function RolesPinned() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(TOTAL - 1, Math.max(0, Math.floor(v * TOTAL)));
    setActive(idx);
  });

  return (
    <section id="roles" ref={ref} className="relative" style={{ height: `${TOTAL * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Section eyebrow */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center px-6">
          <span
            className="text-white/40 text-[11px] md:text-xs uppercase tracking-[0.3em]"
            style={{ fontFamily: "var(--font-supreme), var(--font-space-grotesk), sans-serif" }}
          >
            {t("home_roles_title")}
          </span>
        </div>

        {/* Role panels */}
        {ROLES.map((role, i) => (
          <RolePanel key={role.id} role={role} i={i} progress={scrollYProgress} />
        ))}

        {/* Progress segments */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {ROLES.map((role, i) => (
            <span
              key={role.id}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === active ? 28 : 10,
                background: i === active ? role.color : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
