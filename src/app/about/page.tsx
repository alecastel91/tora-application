"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <AnimatedTitle>{t('about_title')}</AnimatedTitle>
                    <p className="text-white/40 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                        {t('about_subtitle')}
                    </p>
                </div>

                <div className="space-y-6" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                    <p className="text-white/70 leading-relaxed">
                        {t('about_p1')}
                    </p>
                    <p className="text-white/70 leading-relaxed">
                        {t('about_p2')}
                    </p>
                    <p className="text-white/70 leading-relaxed">
                        {t('about_p3')}
                    </p>
                    <p className="text-white/70 leading-relaxed">
                        {t('about_p4')}
                    </p>
                    <p className="text-white/70 leading-relaxed">
                        {t('about_p5')}
                    </p>
                </div>

                <div className="text-center">
                    <Link
                        href="/apply"
                        className="inline-block px-10 py-3 rounded-full border border-white/60 text-white text-[11px] font-semibold uppercase tracking-[0.25em] hover:bg-infrared hover:border-infrared hover:text-white transition-all duration-300 mb-8"
                        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                        {t('apply_for_membership')}
                    </Link><br />
                    <Link href="/" className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>&lsaquo; {t('back_link')}</Link>
                </div>
                <PageBrand />
            </div>
            <BottomNav />
        </main>
    );
}
