"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { InfraredButton } from "@/components/ui/InfraredButton";

interface LogoEmergenceProps {
    onApply: () => void;
}

export function LogoEmergence({ onApply }: LogoEmergenceProps) {
    const [showLogo, setShowLogo] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Logo animates in first
        const logoTimer = setTimeout(() => setShowLogo(true), 200);
        // Content reveals after logo is settled
        const contentTimer = setTimeout(() => setShowContent(true), 1600);

        return () => {
            clearTimeout(logoTimer);
            clearTimeout(contentTimer);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4">
            <div className="max-w-md w-full flex flex-col items-center text-center">

                {/* PNG Logo - smaller and more compact */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
                    animate={showLogo ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-8"
                >
                    <Image
                        src="/tora_logo_v2.png"
                        alt="TORA Logo"
                        width={500}
                        height={166}
                        className="w-[200px] md:w-[240px] h-auto object-contain mx-auto"
                        priority
                    />
                </motion.div>

                {/* Main tagline - all white text */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={showContent ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex flex-col items-center text-center w-full mb-8"
                >
                    <p className="text-sm md:text-base font-light uppercase tracking-wide text-white leading-relaxed">
                        IS THE PROFESSIONAL<br />
                        NETWORK FOR THE<br />
                        ELECTRONIC MUSIC<br />
                        INDUSTRY.
                    </p>
                </motion.div>

                {/* Description text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={showContent ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                    className="flex flex-col items-center text-center w-full mb-12"
                >
                    <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-sm">
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
        </div>
    );
}
