"use client";

import { DetailPageShell } from "@/components/ui/DetailPageShell";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const sgFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

export default function About() {
  const { t } = useLanguage();

  return (
    <DetailPageShell title={t("about_title")} subtitle={t("about_subtitle")} width="max-w-3xl">
      <div className="space-y-12" style={sgFont}>
        {/* The observation — treated as the opening statement */}
        <SectionReveal>
          <div className="laser-line w-16 h-px mx-auto mb-10 opacity-60" />
          <p className="text-white/85 text-lg md:text-xl leading-relaxed text-center">{t("about_p1")}</p>
        </SectionReveal>

        {/* The response */}
        <SectionReveal>
          <div className="space-y-6 text-white/60 leading-relaxed">
            <p>{t("about_p2")}</p>
            <p>{t("about_p3")}</p>
            <p>{t("about_p4")}</p>
          </div>
        </SectionReveal>

        {/* The manifesto line — pulled out with the infrared accent */}
        <SectionReveal>
          <blockquote className="border-l-2 border-infrared/70 pl-6 py-1 text-white/80 text-base md:text-lg leading-relaxed">
            {t("about_p5")}
          </blockquote>
        </SectionReveal>
      </div>
    </DetailPageShell>
  );
}
