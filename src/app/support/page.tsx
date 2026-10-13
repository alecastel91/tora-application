"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Public support page — the Support URL App Store Connect requires. Reachable
 * without login: how to contact us, the questions people actually ask, and
 * links to the legal pages.
 */
export default function Support() {
    const { t } = useLanguage();
    const faq = [1, 2, 3, 4, 5] as const;

    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <AnimatedTitle>{t('support_title')}</AnimatedTitle>
                    <p className="text-white/40 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-supreme), var(--font-space-grotesk), sans-serif' }}>
                        {t('support_subtitle')}
                    </p>
                </div>

                <div className="prose prose-invert max-w-none text-white/70 space-y-8 leading-relaxed" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                    <p className="text-lg">
                        {t('support_intro')}
                    </p>

                    <GlassCard className="space-y-4">
                        <h3 className="text-white font-semibold text-lg font-tech">{t('support_contact_title')}</h3>
                        <p>{t('support_contact_text')}</p>
                        <p>
                            <a href="mailto:support@torahub.io" className="text-infrared hover:underline">support@torahub.io</a>
                        </p>
                    </GlassCard>

                    <GlassCard className="space-y-6">
                        <h3 className="text-white font-semibold text-lg font-tech">{t('support_faq_title')}</h3>
                        {faq.map((n) => (
                            <div key={n} className="space-y-2">
                                <p className="text-white font-semibold">{t(`support_q${n}`)}</p>
                                <p>{t(`support_a${n}`)}</p>
                            </div>
                        ))}
                    </GlassCard>

                    <GlassCard className="space-y-4">
                        <h3 className="text-white font-semibold text-lg font-tech">{t('support_links_title')}</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><Link href="/privacy" className="text-infrared hover:underline">{t('support_link_privacy')}</Link></li>
                            <li><Link href="/terms" className="text-infrared hover:underline">{t('support_link_terms')}</Link></li>
                            <li><Link href="/data-deletion" className="text-infrared hover:underline">{t('support_link_deletion')}</Link></li>
                        </ul>
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
