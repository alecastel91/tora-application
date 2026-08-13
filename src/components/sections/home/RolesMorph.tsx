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
              {/* Dark glass: gathered dots behind read as soft bokeh, dots around
                  the edges stay sharp — and the copy stays legible. */}
              <div
                className="absolute inset-0 rounded-2xl backdrop-blur-md"
                style={{
                  background: "rgba(255,255,255,0.02)", // founding-page glass — let the backdrop show through
                  border: `1px solid ${role.color}3d`,
                  boxShadow: `0 0 60px -24px ${role.color}80, inset 0 1px 0 rgba(255,255,255,0.06)`,
                }}
              />
              {/* [&>svg] sizing scales the shared icon up on desktop only — the
                  mobile stack renders the same SVGs at their intrinsic size */}
              <div className="relative flex items-center justify-center mb-5 [&>svg]:w-24 [&>svg]:h-24">
                <div
                  aria-hidden="true"
                  className="absolute w-36 h-36 rounded-full"
                  style={{ background: `radial-gradient(circle, ${role.color}22, transparent 70%)` }}
                />
                {role.icon}
              </div>
              <div className="relative text-[11px] font-bold uppercase tracking-[0.3em] mb-2.5" style={{ color: role.color }}>
                {t(role.labelKey)}
              </div>
              <div className="relative text-white text-lg md:text-xl font-black uppercase tracking-tight leading-tight whitespace-pre-line" style={headingFont}>
                {t(role.valueKey)}
              </div>
              <span className="relative mt-4 flex items-center gap-1 text-[9px] uppercase tracking-[0.22em] text-white/30 transition-colors group-hover:text-white/70">
                Tap to explore
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
