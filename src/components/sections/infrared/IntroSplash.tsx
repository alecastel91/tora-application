"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { InfraredButton } from "@/components/ui/InfraredButton";

interface IntroSplashProps {
    onComplete: () => void;
    onApply: () => void;
}

export function IntroSplash({ onComplete, onApply }: IntroSplashProps) {
    const [showLogo, setShowLogo] = useState(false);
    const [showTagline, setShowTagline] = useState(false);
    const [hideTagline, setHideTagline] = useState(false);
    const [slideUp, setSlideUp] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
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
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black px-4">
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
                                  y: slideUp ? -80 : 0 // Slide up 80px (reduced from 120px)
                              }
                            : {}
                    }
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-2"
                >
                    <Image
                        src="/tora_logo_v2.png"
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
                        WHERE MUSIC MEETS
                    </span>
                </motion.div>

                {/* Content appears after slide */}
                {slideUp && (
                    <div className="w-full flex flex-col items-center -mt-24 md:-mt-28">
                        {/* Rotating Globe Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={showContent ? { opacity: 1, scale: 1, rotate: 360 } : {}}
                            transition={{
                                opacity: { duration: 0.5 },
                                scale: { duration: 0.5 },
                                rotate: { duration: 30, repeat: Infinity, ease: "linear" }
                            }}
                            className="mb-6"
                        >
                            <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Outer circle */}
                                <circle cx="120" cy="120" r="100" stroke="#FF3366" strokeWidth="3" fill="none" opacity="0.8"/>

                                {/* Vertical center line */}
                                <line x1="120" y1="20" x2="120" y2="220" stroke="#FF3366" strokeWidth="3" opacity="0.8"/>

                                {/* Horizontal center line (equator) */}
                                <line x1="20" y1="120" x2="220" y2="120" stroke="#FF3366" strokeWidth="3" opacity="0.8"/>

                                {/* Latitude lines (horizontal ellipses) */}
                                <ellipse cx="120" cy="120" rx="100" ry="50" stroke="#FF3366" strokeWidth="2.5" fill="none" opacity="0.6"/>
                                <ellipse cx="120" cy="120" rx="100" ry="25" stroke="#FF3366" strokeWidth="2.5" fill="none" opacity="0.6"/>

                                {/* Longitude lines (vertical curves) */}
                                <path d="M 120 20 Q 80 120 120 220" stroke="#FF3366" strokeWidth="2.5" fill="none" opacity="0.6"/>
                                <path d="M 120 20 Q 160 120 120 220" stroke="#FF3366" strokeWidth="2.5" fill="none" opacity="0.6"/>
                                <path d="M 120 20 Q 60 120 120 220" stroke="#FF3366" strokeWidth="2.5" fill="none" opacity="0.6"/>
                                <path d="M 120 20 Q 180 120 120 220" stroke="#FF3366" strokeWidth="2.5" fill="none" opacity="0.6"/>
                            </svg>
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
                            >
                                THE PROFESSIONAL NETWORK<br />
                                FOR CLUB MUSIC INDUSTRY
                            </p>
                        </motion.div>

                        {/* Description text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={showContent ? { opacity: 1 } : {}}
                            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                            className="flex flex-col items-center text-center w-full mb-8"
                        >
                            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-sm">
                                Connect with artists, agents, venues, and promoters worldwide. Discover opportunities, manage bookings, and grow your network in one seamless platform
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
                                Apply Now
                            </InfraredButton>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
