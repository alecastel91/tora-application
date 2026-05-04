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
    { code: 'JP' as const, label: 'JP' },
    { code: 'CN' as const, label: 'CN' },
    { code: 'KR' as const, label: 'KR' },
];

export function TopNav() {
    const pathname = usePathname();

    const links = [
        { name: "Apply", href: "/apply" },
        { name: "About", href: "/about" },
        { name: "Roles", href: "/roles" },
        { name: "Features", href: "/features" },
    ];

    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center py-5 bg-black/80 backdrop-blur-xl"
        >
            <div className="flex items-center space-x-8 md:space-x-10">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        style={sgFont}
                        className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors ${
                            pathname === link.href
                                ? "text-white"
                                : "text-white/30 hover:text-white"
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}
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

function LanguagePicker() {
    const { language, setLanguage } = useLanguage();
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
                className="flex items-center gap-1.5 text-white/20 hover:text-white/50 transition-colors"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={sgFont}>{language}</span>
            </button>

            {isOpen && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-black/95 border border-white/10 rounded-lg p-2 backdrop-blur-xl min-w-[80px]">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
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
                        { name: "Privacy", href: "/privacy", external: false },
                        { name: "Terms", href: "/terms", external: false },
                        { name: "Social", href: "https://instagram.com/tora.hub", external: true },
                    ].map((link) => (
                        link.external ? (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={sgFont}
                                className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white/50 transition-colors"
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                key={link.name}
                                href={link.href}
                                style={sgFont}
                                className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white/50 transition-colors"
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                    <LanguagePicker />
                </div>
            </motion.nav>
        </>
    );
}
