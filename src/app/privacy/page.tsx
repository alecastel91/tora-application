"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Privacy() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <AnimatedTitle>{t('privacy_title')}</AnimatedTitle>
                    <p className="text-white/40 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-supreme), var(--font-space-grotesk), sans-serif' }}>
                        {t('privacy_subtitle')}
                    </p>
                </div>

                <div className="prose prose-invert max-w-none text-white/70 space-y-4 leading-relaxed" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>

                    <h3 className="text-white font-semibold text-lg mt-6 font-tech">{t('privacy_intro_title')}</h3>
                    <p>
                        {t('privacy_intro_p1')}
                    </p>
                    <p>
                        {t('privacy_intro_p2')}
                    </p>
                    <p>
                        {t('privacy_intro_p3')}
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('privacy_collecting_title')}</h3>

                    <p><strong className="text-white">{t('privacy_collecting_membership')}</strong> {t('privacy_collecting_membership_text')}</p>

                    <p><strong className="text-white">{t('privacy_collecting_service')}</strong> {t('privacy_collecting_service_text')}</p>

                    <p><strong className="text-white">{t('privacy_collecting_others')}</strong> {t('privacy_collecting_others_text')}</p>

                    <p><strong className="text-white">{t('privacy_collecting_financial')}</strong> {t('privacy_collecting_financial_text')}</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('privacy_sharing_title')}</h3>

                    <p>{t('privacy_sharing_intro')}</p>

                    <p><strong className="text-white">{t('privacy_sharing_users')}</strong> {t('privacy_sharing_users_text')}</p>

                    <p><strong className="text-white">{t('privacy_sharing_applicants')}</strong> {t('privacy_sharing_applicants_text')}</p>

                    <p><strong className="text-white">{t('privacy_sharing_tora')}</strong> {t('privacy_sharing_tora_text')}</p>

                    <p><strong className="text-white">{t('privacy_sharing_providers')}</strong> {t('privacy_sharing_providers_text')}</p>

                    <p><strong className="text-white">{t('privacy_sharing_other')}</strong> {t('privacy_sharing_other_text')}</p>

                    <p><strong className="text-white">{t('privacy_sharing_legal')}</strong> {t('privacy_sharing_legal_text')}</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('privacy_security_title')}</h3>

                    <p><strong className="text-white">{t('privacy_security_transfers')}</strong> {t('privacy_security_transfers_text')}</p>

                    <p><strong className="text-white">{t('privacy_security_measures')}</strong> {t('privacy_security_measures_text')}</p>

                    <p><strong className="text-white">{t('privacy_security_retention')}</strong> {t('privacy_security_retention_text')}</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('privacy_communications_title')}</h3>

                    <p>{t('privacy_communications_text')}</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('privacy_rights_title')}</h3>

                    <p><strong className="text-white">{t('privacy_rights_tools')}</strong> {t('privacy_rights_tools_text')}</p>

                    <p><strong className="text-white">{t('privacy_rights_privacy')}</strong> {t('privacy_rights_privacy_text')}</p>

                    <p>{t('privacy_rights_identity')}</p>

                    <p><strong className="text-white">{t('privacy_rights_deletion')}</strong> {t('privacy_rights_deletion_text')}</p>

                    <p><strong className="text-white">{t('privacy_rights_eu')}</strong> {t('privacy_rights_eu_text')}</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('privacy_age_title')}</h3>

                    <p>{t('privacy_age_text')}</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">{t('privacy_contact_title')}</h3>

                    <p>
                        {t('privacy_contact_text')}{" "}
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
