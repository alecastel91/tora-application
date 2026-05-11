"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Features() {
    const { t } = useLanguage();

    const features = [
        {
            titleKey: "feature_search_title",
            descKey: "feature_search_desc",
            icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><circle cx="11" cy="11" r="3" opacity="0.4"/></svg>),
        },
        {
            titleKey: "feature_calendar_title",
            descKey: "feature_calendar_desc",
            icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="2" fill="#FF3366" opacity="0.3"/></svg>),
        },
        {
            titleKey: "feature_tour_title",
            descKey: "feature_tour_desc",
            icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><circle cx="12" cy="12" r="3" fill="#FF3366" opacity="0.2"/></svg>),
        },
        {
            titleKey: "feature_notifications_title",
            descKey: "feature_notifications_desc",
            icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><circle cx="18" cy="4" r="3" fill="#FF3366" opacity="0.4"/></svg>),
        },
        {
            titleKey: "feature_bookings_title",
            descKey: "feature_bookings_desc",
            icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4" opacity="0.6"/></svg>),
        },
        {
            titleKey: "feature_messaging_title",
            descKey: "feature_messaging_desc",
            icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="9" x2="16" y2="9" opacity="0.4"/><line x1="8" y1="13" x2="13" y2="13" opacity="0.4"/></svg>),
        },
        {
            titleKey: "feature_contracts_title",
            descKey: "feature_contracts_desc",
            icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="17" cy="15" r="2" fill="#FF3366" opacity="0.3"/></svg>),
        },
        {
            titleKey: "feature_profiles_title",
            descKey: "feature_profiles_desc",
            icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v4" opacity="0.3"/><path d="M10 13h4" opacity="0.3"/></svg>),
        },
        {
            titleKey: "feature_agent_title",
            descKey: "feature_agent_desc",
            icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><rect x="6" y="7" width="4" height="6" rx="1" fill="#FF3366" opacity="0.15"/><rect x="14" y="9" width="4" height="4" rx="1" fill="#FF3366" opacity="0.15"/></svg>),
        },
        {
            titleKey: "feature_multirole_title",
            descKey: "feature_multirole_desc",
            icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="19" cy="7" r="3" opacity="0.4"/><path d="M23 21v-2a3 3 0 0 0-3-3h-1" opacity="0.4"/></svg>),
        },
    ];

    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <AnimatedTitle>{t('features_title')}</AnimatedTitle>
                    <p className="text-white/40 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-supreme), var(--font-space-grotesk), sans-serif' }}>
                        {t('features_subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                    {features.map((item) => (
                        <GlassCard key={item.titleKey} className="border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                                    {item.icon}
                                </div>
                                <span className="text-infrared text-xs font-bold uppercase tracking-widest">{t(item.titleKey)}</span>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed mt-3">{t(item.descKey)}</p>
                        </GlassCard>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/apply"
                        className="inline-block px-10 py-3 rounded-full border border-white/60 text-white text-[11px] font-semibold uppercase tracking-[0.25em] hover:bg-infrared hover:border-infrared hover:text-white transition-all duration-300 mb-8"
                        style={{ fontFamily: "var(--font-supreme), var(--font-space-grotesk), sans-serif" }}
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
