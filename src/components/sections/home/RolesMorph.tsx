"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROLES } from "./home.data";
import { roleBoxes, type Box } from "./morphLayout";

const headingFont = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const supremeFont = { fontFamily: "var(--font-supreme), var(--font-space-grotesk), sans-serif" };

/**
 * Beat 4 desktop — the globe's nodes gather into 4 clusters (NodeField) while
 * these 4 role cards resolve on top of them, positioned on the shared roleBoxes
 * layout. Falls back to RolesStack on mobile / reduced motion.
 */
export function RolesMorph() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);

  useLayoutEffect(() => {
    const measure = () => setBoxes(roleBoxes(window.innerWidth, window.innerHeight));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const opacity = useTransform(scrollYProgress, [0.06, 0.22, 0.8, 0.94], [0, 1, 1, 0]);
  const eyebrow = useTransform(scrollYProgress, [0.03, 0.15, 0.85, 0.95], [0, 1, 1, 0]);

  return (
    // -50vh overlap: swallows half of the viewport-high dead gap after the previous pin releases
    <section id="roles" ref={ref} className="relative" style={{ height: "220vh", marginTop: "-50vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ opacity: eyebrow }}
          className="absolute top-24 left-1/2 -translate-x-1/2 text-center px-6"
        >
          <span className="text-white/45 text-[11px] md:text-xs uppercase tracking-[0.3em]" style={supremeFont}>
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
              className="flex flex-col items-center justify-center text-center rounded-xl px-5"
            >
              <div
                className="absolute inset-0 rounded-xl"
                style={{ background: `${role.color}0a`, border: `1px solid ${role.color}33` }}
              />
              <div
                className="relative w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ background: `${role.color}12`, border: `1px solid ${role.color}30` }}
              >
                {role.icon}
              </div>
              <div className="relative text-[11px] font-bold uppercase tracking-[0.25em] mb-1.5" style={{ color: role.color }}>
                {t(role.labelKey)}
              </div>
              <div className="relative text-white text-lg md:text-2xl font-black uppercase tracking-tight leading-tight" style={headingFont}>
                {t(role.valueKey)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
