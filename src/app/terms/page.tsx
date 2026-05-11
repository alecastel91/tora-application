"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Terms() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <AnimatedTitle>{t('terms_title')}</AnimatedTitle>
                    <p className="text-white/40 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-supreme), var(--font-space-grotesk), sans-serif' }}>
                        {t('terms_subtitle')}
                    </p>
                </div>

                <div className="prose prose-invert max-w-none text-white/70 space-y-4 leading-relaxed" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>

                    <h3 className="text-white font-semibold text-lg mt-6 font-tech">{t('terms_acceptance_title')}</h3>
                    <p>
                        {t('terms_acceptance_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_eligibility_title')}</h3>
                    <p>
                        {t('terms_eligibility_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_membership_title')}</h3>
                    <p>
                        {t('terms_membership_text')}
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{t('terms_membership_item1')}</li>
                        <li>{t('terms_membership_item2')}</li>
                        <li>{t('terms_membership_item3')}</li>
                        <li>{t('terms_membership_item4')}</li>
                        <li>{t('terms_membership_item5')}</li>
                    </ul>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_account_title')}</h3>
                    <p>
                        {t('terms_account_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_subscriptions_title')}</h3>
                    <p>
                        {t('terms_subscriptions_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_conduct_title')}</h3>
                    <p>
                        {t('terms_conduct_intro')}
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{t('terms_conduct_item1')}</li>
                        <li>{t('terms_conduct_item2')}</li>
                        <li>{t('terms_conduct_item3')}</li>
                        <li>{t('terms_conduct_item4')}</li>
                        <li>{t('terms_conduct_item5')}</li>
                        <li>{t('terms_conduct_item6')}</li>
                        <li>{t('terms_conduct_item7')}</li>
                        <li>{t('terms_conduct_item8')}</li>
                    </ul>
                    <p>
                        {t('terms_conduct_violation')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_bookings_title')}</h3>
                    <p>
                        {t('terms_bookings_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_ip_title')}</h3>
                    <p>
                        {t('terms_ip_text1')}
                    </p>
                    <p>
                        {t('terms_ip_text2')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_agent_title')}</h3>
                    <p>
                        {t('terms_agent_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_confidentiality_title')}</h3>
                    <p>
                        {t('terms_confidentiality_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_liability_title')}</h3>
                    <p>
                        {t('terms_liability_text1')}
                    </p>
                    <p>
                        {t('terms_liability_text2')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_indemnification_title')}</h3>
                    <p>
                        {t('terms_indemnification_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_termination_title')}</h3>
                    <p>
                        {t('terms_termination_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_dispute_title')}</h3>
                    <p>
                        {t('terms_dispute_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_governing_title')}</h3>
                    <p>
                        {t('terms_governing_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_severability_title')}</h3>
                    <p>
                        {t('terms_severability_text')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('terms_contact_title')}</h3>
                    <p>
                        {t('terms_contact_text')}{" "}
                        <a href="mailto:support@torahub.io" className="text-infrared hover:underline">support@torahub.io</a>
                    </p>
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
