"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DataDeletion() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <AnimatedTitle>{t('deletion_title')}</AnimatedTitle>
                    <p className="text-white/40 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                        {t('deletion_subtitle')}
                    </p>
                </div>

                <div className="prose prose-invert max-w-none text-white/70 space-y-8 leading-relaxed" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                    <p className="text-lg">
                        {t('deletion_intro')}
                    </p>

                    <GlassCard className="space-y-4">
                        <h3 className="text-white font-semibold text-lg font-tech">{t('deletion_how_title')}</h3>
                        <p>
                            {t('deletion_how_text')}
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>{t('deletion_how_item1')}</li>
                            <li>{t('deletion_how_item2')}</li>
                            <li>{t('deletion_how_item3')}</li>
                        </ul>
                    </GlassCard>

                    <GlassCard className="space-y-4">
                        <h3 className="text-white font-semibold text-lg font-tech">{t('deletion_next_title')}</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>{t('deletion_next_item1')}</li>
                            <li>{t('deletion_next_item2')}</li>
                            <li>{t('deletion_next_item3')}</li>
                            <li>{t('deletion_next_item4')}</li>
                        </ul>
                    </GlassCard>

                    <GlassCard className="space-y-4">
                        <h3 className="text-white font-semibold text-lg font-tech">{t('deletion_what_title')}</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>{t('deletion_what_item1')}</li>
                            <li>{t('deletion_what_item2')}</li>
                            <li>{t('deletion_what_item3')}</li>
                            <li>{t('deletion_what_item4')}</li>
                        </ul>
                        <p className="text-sm text-white/50 mt-4">
                            {t('deletion_what_note')}
                        </p>
                    </GlassCard>
                </div>
                <div className="text-center">
                    <Link href="/" className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>&lsaquo; {t('back_link')}</Link>
                </div>
                <PageBrand />
            </div>
            <BottomNav />
        </main>
    );
}
