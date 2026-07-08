"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { InfraredButton } from "@/components/ui/InfraredButton";
import { useLanguage } from "@/contexts/LanguageContext";

interface IntroSplashProps {
    onComplete: () => void;
    onApply: () => void;
    onShowContent?: (show: boolean) => void;
    skipSplash?: boolean;
}

export function IntroSplash({ onComplete, onApply, onShowContent, skipSplash = false }: IntroSplashProps) {
    const { t } = useLanguage();
    const [showLogo, setShowLogo] = useState(skipSplash);
    const [showTagline, setShowTagline] = useState(false);
    const [hideTagline, setHideTagline] = useState(skipSplash);
    const [slideUp, setSlideUp] = useState(skipSplash);
    const [showContent, setShowContent] = useState(skipSplash);

    useEffect(() => {
        if (skipSplash) {
            onComplete();
            return;
        }

        // Logo animates in first
        const logoTimer = setTimeout(() => setShowLogo(true), 300);
        // Tagline appears shortly after logo
        const taglineTimer = setTimeout(() => setShowTagline(true), 800);
        // Tagline starts to disappear at 2.3 seconds
        const hideTaglineTimer = setTimeout(() => setHideTagline(true), 2300);
        // Logo slides up after 2.6 seconds (after tagline fades)
        const slideTimer = setTimeout(() => {
            setSlideUp(true);
            onComplete(); // Notify parent that intro is done
        }, 2600);
        // Content appears at 2.601 seconds (1ms after slide starts)
        const contentTimer = setTimeout(() => setShowContent(true), 2601);

        return () => {
            clearTimeout(logoTimer);
            clearTimeout(taglineTimer);
            clearTimeout(hideTaglineTimer);
            clearTimeout(slideTimer);
            clearTimeout(contentTimer);
        };
    }, [onComplete, skipSplash]);

    // Notify parent when content becomes visible
    useEffect(() => {
        if (onShowContent) {
            onShowContent(showContent);
        }
    }, [showContent, onShowContent]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
            <div className="max-w-md w-full flex flex-col items-center text-center">
                {/* Logo - slides up and shrinks, stays visible */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                    animate={
                        showLogo
                            ? {
                                  opacity: 1,
                                  scale: slideUp ? 0.7 : 1, // 320px -> 224px (0.7x)
                                  filter: "blur(0px)",
                                  y: slideUp ? -40 : 0 // Slide up 40px
                              }
                            : {}
                    }
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-2"
                >
                    <Image
                        src="/tora_logo_transparent.png"
                        alt="TORA Logo"
                        width={500}
                        height={166}
                        className="w-[320px] md:w-[480px] h-auto object-contain"
                        priority
                    />
                </motion.div>

                {/* Tagline - fades out before logo slides */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                        showTagline
                            ? { opacity: hideTagline ? 0 : 1, y: 0 }
                            : {}
                    }
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-center mt-2 md:mt-1"
                >
                    <span
                        className="text-white text-[12px] md:text-[14px] tracking-[0.22em] uppercase whitespace-nowrap"
                        style={{
                            fontFamily: 'var(--font-space-grotesk), var(--font-rajdhani), sans-serif',
                            fontWeight: 400,
                            letterSpacing: '0.22em'
                        }}
                    >
                        {t('tagline')}
                    </span>
                </motion.div>

                {/* Content appears after slide */}
                {slideUp && (
                    <div className="w-full flex flex-col items-center -mt-12 md:-mt-16">
                        {/* Rotating Globe Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={showContent ? { opacity: 1, scale: 1, rotate: 360 } : {}}
                            transition={{
                                opacity: { duration: 0.5 },
                                scale: { duration: 0.5 },
                                rotate: { duration: 30, repeat: Infinity, ease: "linear" }
                            }}
                            className="-mt-4 mb-6"
                        >
                            {/* The exact orbital-sphere mark, extracted from the
                                designer's Intro.svg export (embedded 1093px PNG,
                                black background made transparent). */}
                            <Image
                                src="/intro_orb.png"
                                alt=""
                                aria-hidden="true"
                                width={1093}
                                height={1092}
                                className="w-[240px] h-[240px] object-contain opacity-40"
                            />
                        </motion.div>

                        {/* Main tagline - all white text, bigger font */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={showContent ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="flex flex-col items-center text-center w-full mb-6"
                        >
                            <p
                                className="text-base md:text-lg uppercase tracking-[0.15em] text-white leading-relaxed"
                                style={{
                                    fontFamily: 'var(--font-space-grotesk), var(--font-rajdhani), sans-serif',
                                    fontWeight: 400,
                                    letterSpacing: '0.15em'
                                }}
                                dangerouslySetInnerHTML={{ __html: t('main_heading') }}
                            />
                        </motion.div>

                        {/* Description text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={showContent ? { opacity: 1 } : {}}
                            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                            className="flex flex-col items-center text-center w-full mb-8"
                        >
                            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-sm">
                                {t('description')}
                            </p>
                        </motion.div>

                        {/* Apply Now button */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={showContent ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                            className="flex justify-center w-full"
                        >
                            <InfraredButton onClick={onApply} className="w-full md:w-auto min-w-[200px] text-sm md:text-base py-3 md:py-4 uppercase tracking-wider">
                                {t('apply_now')}
                            </InfraredButton>
                        </motion.div>

                        {/* Back link */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={showContent ? { opacity: 1 } : {}}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="mt-8"
                        >
                            <Link
                                href="/"
                                className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                                style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                            >
                                &lsaquo; Back
                            </Link>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
