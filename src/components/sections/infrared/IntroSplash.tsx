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
        // Content appears at 2.61 seconds (10ms after slide)
        const contentTimer = setTimeout(() => setShowContent(true), 2610);

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
                                  scale: slideUp ? 0.625 : 1, // 320px -> 200px (0.625x)
                                  filter: "blur(0px)",
                                  y: slideUp ? -120 : 0 // Slide up 120px
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
                    <span className="text-white text-[10px] md:text-[12px] font-medium tracking-[0.22em] uppercase whitespace-nowrap">
                        WHERE THE MUSIC INDUSTRY CONNECTS.
                    </span>
                </motion.div>

                {/* Content appears after slide */}
                {slideUp && (
                    <div className="w-full flex flex-col items-center -mt-32 md:-mt-36">
                        {/* Main tagline - all white text, bigger font */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={showContent ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="flex flex-col items-center text-center w-full mb-10"
                        >
                            <p className="text-base md:text-lg font-light uppercase tracking-wide text-white leading-relaxed">
                                IS THE PROFESSIONAL NETWORK FOR THE<br />
                                ELECTRONIC MUSIC INDUSTRY.
                            </p>
                        </motion.div>

                        {/* Description text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={showContent ? { opacity: 1 } : {}}
                            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                            className="flex flex-col items-center text-center w-full mb-12"
                        >
                            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-sm">
                                Connect with artists, agents, venues, and promoters worldwide. Discover opportunities, manage bookings, and grow your network in one seamless platform.
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
