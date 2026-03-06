"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LogoEmergenceProps {
    onComplete: () => void;
}

export function LogoEmergence({ onComplete }: LogoEmergenceProps) {
    const [showLogo, setShowLogo] = useState(false);
    const [showTagline, setShowTagline] = useState(false);

    useEffect(() => {
        // Staggered animation timing
        const logoTimer = setTimeout(() => setShowLogo(true), 100);
        const taglineTimer = setTimeout(() => setShowTagline(true), 800);
        const completeTimer = setTimeout(onComplete, 3500);
        
        return () => {
            clearTimeout(logoTimer);
            clearTimeout(taglineTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    const letterVariants = {
        hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.12,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
            },
        }),
    };

    const logoLetters = ["T", "O", "R", "A"];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
            {/* Animated Logo */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 relative"
            >
                {/* Glow effect behind logo */}
                <motion.div
                    className="absolute inset-0 blur-3xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.3, scale: 1.2 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                >
                    <div className="w-full h-full bg-white/20 rounded-full" />
                </motion.div>

                {/* Logo letters with staggered animation */}
                <div className="flex items-center justify-center space-x-1 md:space-x-2 relative z-10">
                    {logoLetters.map((letter, i) => (
                        <motion.span
                            key={i}
                            custom={i}
                            initial="hidden"
                            animate={showLogo ? "visible" : "hidden"}
                            variants={letterVariants}
                            className="text-7xl md:text-9xl font-black font-futuristic text-white text-glow"
                            style={{
                                textShadow: "0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.3)",
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </div>

                {/* Decorative line under logo */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={showLogo ? { scaleX: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mt-4"
                />
            </motion.div>

            {/* Tagline */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={showTagline ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
            >
                <p className="text-sm md:text-lg font-tech tracking-[0.3em] text-white/60 uppercase">
                    Where the music industry connects
                </p>
                
                {/* Animated dots */}
                <motion.div 
                    className="flex justify-center space-x-2 mt-6"
                    initial={{ opacity: 0 }}
                    animate={showTagline ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white/60"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
