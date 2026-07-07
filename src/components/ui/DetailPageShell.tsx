"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { WaveMesh } from "@/components/sections/home/WaveMesh";
import { ParallaxBackdrop } from "@/components/sections/home/ParallaxBackdrop";
import { useLanguage } from "@/contexts/LanguageContext";

const supremeFont = { fontFamily: "var(--font-supreme), var(--font-space-grotesk), sans-serif" };
const sgFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Shared frame for the "read more" pages (/about, /roles, /features): the
 * home page's ambient world (wave-mesh horizon + parallax glow, dimmed so the
 * content stays the star), title block, Apply CTA + back link, brand footer.
 */
export function DetailPageShell({
  title,
  subtitle,
  children,
  width = "max-w-4xl",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      <TopNav />
      <ParallaxBackdrop />
      <WaveMesh opacity={0.4} />

      <div className={`relative z-10 pt-32 pb-20 px-8 ${width} mx-auto space-y-16`}>
        <div className="text-center space-y-4">
          <AnimatedTitle>{title}</AnimatedTitle>
          {subtitle && (
            <p className="text-white/40 text-sm uppercase tracking-widest" style={supremeFont}>
              {subtitle}
            </p>
          )}
        </div>

        {children}

        <div className="text-center">
          <Link
            href="/apply"
            className="inline-block px-10 py-3 rounded-full border border-white/60 text-white text-[11px] font-semibold uppercase tracking-[0.25em] hover:bg-infrared hover:border-infrared hover:text-white transition-all duration-300 mb-8"
            style={supremeFont}
          >
            {t("apply_for_membership")}
          </Link>
          <br />
          <Link
            href="/"
            className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
            style={sgFont}
          >
            &lsaquo; {t("back_link")}
          </Link>
        </div>
        <PageBrand />
      </div>
      <BottomNav />
    </main>
  );
}
