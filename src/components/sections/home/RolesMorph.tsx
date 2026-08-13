"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROLES } from "./home.data";
import { useHomeDrawer } from "./HomeDrawer";
import { roleBoxes, type Box } from "./morphLayout";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };

/**
 * Beat 4 desktop — the globe's nodes gather into 4 clusters (NodeField) while
 * these 4 role cards resolve on top of them, positioned on the shared roleBoxes
 * layout. Falls back to RolesStack on mobile / reduced motion.
 */
export function RolesMorph() {
  const { t } = useLanguage();
  const { open } = useHomeDrawer();
  const ref = useRef<HTMLElement>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);

  useLayoutEffect(() => {
    const measure = () => setBoxes(roleBoxes(window.innerWidth, window.innerHeight));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const opacity = useTransform(scrollYProgress, [0.04, 0.18, 0.8, 0.94], [0, 1, 1, 0]);
  const eyebrow = useTransform(scrollYProgress, [0.02, 0.12, 0.85, 0.95], [0, 1, 1, 0]);

  return (
    // -32vh: the shift headline is still exiting the top of the viewport as the
    // pin engages and the dots start gathering — attached, not overlapping
    <section id="roles" ref={ref} className="relative" style={{ height: "220vh", marginTop: "-32vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden pointer-events-none">
        <motion.div
          style={{ opacity: eyebrow }}
          className="absolute top-24 left-1/2 -translate-x-1/2 text-center px-6"
        >
          <span className="text-white/90 text-2xl md:text-3xl font-black uppercase tracking-tight" style={headingFont}>
            {t("home_roles_title")}
          </span>
        </motion.div>

        {boxes.map((b, i) => {
          const role = ROLES[i];
          if (!role) return null;
          return (
            <motion.div
              key={role.id}
              style={{ opacity, position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h }}
              className="group pointer-events-auto flex cursor-pointer flex-col items-center justify-center rounded-2xl px-5 text-center"
              onClick={() => open(role.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(role.id); } }}
            >
              {/* Founding-page card: neutral glass surface, colored icon badge. */}
              <div
                className="absolute inset-0 rounded-2xl backdrop-blur-md transition-colors duration-300 group-hover:border-white/25"
                style={{
                  background: "rgba(13,13,18,0.5)", // half-glass: blurred dots read as bokeh, copy stays legible
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <span
                className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 [&_svg]:h-10 [&_svg]:w-10"
                style={{ background: `${role.color}18`, border: `1px solid ${role.color}55` }}
              >
                {role.icon}
              </span>
              <div className="relative text-xl font-bold uppercase tracking-wide" style={{ ...headingFont, color: role.color }}>
                {role.label}
              </div>
              <p className="relative mt-2 max-w-[15rem] text-[13px] leading-relaxed text-white/45">
                {t(role.descKey)}
              </p>
              <span className="relative mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/35 transition-colors group-hover:text-white/70">
                {t("home_tap_explore")}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
