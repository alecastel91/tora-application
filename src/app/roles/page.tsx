"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const roles = [
    {
        titleKey: "role_artists_title",
        descKey: "role_artists_desc",
        color: "#667EEA",
        icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#667EEA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2-3h2l2 3" opacity="0.5"/><path d="M8 16c0-2.2 1.8-4 4-4s4 1.8 4 4"/><circle cx="12" cy="8" r="2"/></svg>),
    },
    {
        titleKey: "role_promoters_title",
        descKey: "role_promoters_desc",
        color: "#FFC107",
        icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFC107" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3v12"/><path d="M18 3L6 8H2v4h4l12 5V3z"/><path d="M6 15v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3" opacity="0.5"/></svg>),
    },
    {
        titleKey: "role_venues_title",
        descKey: "role_venues_desc",
        color: "#F5576C",
        icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5576C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><rect x="9" y="13" width="6" height="8" rx="1" opacity="0.4"/><line x1="12" y1="9" x2="12" y2="11" opacity="0.5"/></svg>),
    },
    {
        titleKey: "role_agents_title",
        descKey: "role_agents_desc",
        color: "#43E97B",
        icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#43E97B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" opacity="0.5"/><path d="M16 3.13a4 4 0 0 1 0 7.75" opacity="0.5"/></svg>),
    }
];

export default function Roles() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <AnimatedTitle>{t('roles_title')}</AnimatedTitle>
                    <p className="text-white/40 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                        {t('roles_subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                    {roles.map((item) => (
                        <motion.div
                            key={item.titleKey}
                            className="glass-card p-6 relative border-l-2 border-l-transparent"
                            style={{ transition: 'border-color 0.3s' }}
                            whileHover={{ x: 4 }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderLeftColor = item.color;
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
                            }}
                        >
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}08`, border: `1px solid ${item.color}15` }}>
                                    {item.icon}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: item.color, fontFamily: 'var(--font-space-grotesk), sans-serif' }}>{t(item.titleKey)}</span>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed mt-3">{t(item.descKey)}</p>
                        </motion.div>
                    ))}
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
