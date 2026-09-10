"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const sgFont = { fontFamily: 'var(--font-space-grotesk), sans-serif' } as React.CSSProperties;

const LANGUAGES = [
    { code: 'EN' as const, label: 'EN' },
    { code: 'ES' as const, label: 'ES' },
    { code: 'FR' as const, label: 'FR' },
    { code: 'IT' as const, label: 'IT' },
    { code: 'PT' as const, label: 'PT' },
    { code: 'JP' as const, label: '日本語' },
    { code: 'CN' as const, label: '中文' },
    { code: 'KR' as const, label: '한국어' },
];

export function TopNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const links = [
        { key: "nav_about", href: "/about" },
        { key: "nav_roles", href: "/roles" },
        { key: "nav_features", href: "/features" },
    ];

    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between px-6 md:px-10 py-4 md:py-5 bg-black/80 backdrop-blur-xl"
        >
            {/* On phones the header is two rows: logo + language picker, then the
                centred links (FR/PT labels are too long to share a row). */}
            <Link href="/" className="hover:opacity-80 transition-opacity order-1">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <svg width="24" height="24" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="120" cy="120" r="100" stroke="#FF3366" strokeWidth="8" fill="none" opacity="0.9"/>
                        <line x1="120" y1="20" x2="120" y2="220" stroke="#FF3366" strokeWidth="6" opacity="0.7"/>
                        <line x1="20" y1="120" x2="220" y2="120" stroke="#FF3366" strokeWidth="6" opacity="0.7"/>
                        <ellipse cx="120" cy="120" rx="100" ry="50" stroke="#FF3366" strokeWidth="5" fill="none" opacity="0.5"/>
                        <path d="M 120 20 Q 80 120 120 220" stroke="#FF3366" strokeWidth="5" fill="none" opacity="0.5"/>
                        <path d="M 120 20 Q 160 120 120 220" stroke="#FF3366" strokeWidth="5" fill="none" opacity="0.5"/>
                    </svg>
                </motion.div>
            </Link>
            <div className="order-3 md:order-2 w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center md:justify-end space-x-7 md:space-x-10 md:mr-8">
                {links.map((link) => (
                    <Link
                        key={link.key}
                        href={link.href}
                        style={sgFont}
                        className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors ${
                            pathname === link.href
                                ? "text-white"
                                : "text-white/30 hover:text-white"
                        }`}
                    >
                        {t(link.key)}
                    </Link>
                ))}
            </div>
            <div className="order-2 md:order-3">
                <LanguagePicker placement="top" />
            </div>
        </motion.nav>
    );
}

export function PageBrand() {
    return (
        <div className="flex flex-col items-center pt-2 pb-4 space-y-2">
            <Image
                src="/tora_logo_v2.png"
                alt="TORA"
                width={255}
                height={78}
                className="w-[120px] h-auto object-contain"
            />
            <span
                className="text-white/40 text-[9px] tracking-[0.22em] uppercase whitespace-nowrap"
                style={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    fontWeight: 400,
                }}
            >
                WHERE MUSIC MEETS
            </span>
        </div>
    );
}

/**
 * Language picker. Lives in the top-right of every page header (HomeNav on
 * the homepage, TopNav on the detail pages). `placement` only decides which
 * way the menu opens.
 */
export function LanguagePicker({ placement = "top" }: { placement?: "top" | "bottom" }) {
    const { language, setLanguage } = useLanguage();
    const current = LANGUAGES.find((l) => l.code === language)?.label ?? language;
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Language"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
                    isOpen
                        ? "border-white/30 text-white bg-white/10"
                        : "border-white/15 text-white/70 hover:text-white hover:border-white/40 bg-black/40"
                }`}
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={sgFont}>{current}</span>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    className={`absolute right-0 bg-black/95 border border-white/10 rounded-lg p-2 backdrop-blur-xl min-w-[96px] ${
                        placement === "top" ? "top-full mt-3" : "bottom-full mb-3"
                    }`}
                >
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            role="option"
                            aria-selected={language === lang.code}
                            onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                            className={`block w-full text-center text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-2 rounded transition-colors ${
                                language === lang.code
                                    ? "text-infrared bg-white/5"
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                            }`}
                            style={sgFont}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function BottomNav() {
    const { t } = useLanguage();

    return (
        <>
            <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/10 z-50" />
            <motion.nav
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="fixed bottom-0 left-0 right-0 z-50 flex justify-center py-6 bg-black/80 backdrop-blur-xl"
            >
                <div className="flex items-center space-x-10">
                    {[
                        { key: "nav_privacy", href: "/privacy", external: false },
                        { key: "nav_terms", href: "/terms", external: false },
                        { key: "nav_social", href: "https://instagram.com/tora.hub", external: true },
                    ].map((link) => (
                        link.external ? (
                            <a
                                key={link.key}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={sgFont}
                                className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white/50 transition-colors"
                            >
                                {t(link.key)}
                            </a>
                        ) : (
                            <Link
                                key={link.key}
                                href={link.href}
                                style={sgFont}
                                className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white/50 transition-colors"
                            >
                                {t(link.key)}
                            </Link>
                        )
                    ))}
                </div>
            </motion.nav>
        </>
    );
}
