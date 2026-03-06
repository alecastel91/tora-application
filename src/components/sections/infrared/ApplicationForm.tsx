"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { InfraredInput } from "@/components/ui/InfraredInput";
import { InfraredButton } from "@/components/ui/InfraredButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ApplicationFormProps {
    onSubmit: () => void;
}

export function ApplicationForm({ onSubmit }: ApplicationFormProps) {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [direction, setDirection] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onSubmit();
        }, 2000);
    };

    const nextStep = () => {
        setDirection(1);
        setStep((s) => s + 1);
    };
    
    const prevStep = () => {
        setDirection(-1);
        setStep((s) => s - 1);
    };

    const roles = ["Artist", "PR / Promoter", "Venue", "Agent"];

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)",
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)",
        }),
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 overflow-hidden">
            <GlassPanel className="p-8 md:p-16 max-w-2xl w-full flex flex-col items-center">
                {/* Header with progress */}
                <div className="mb-12 text-center w-full">
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl md:text-3xl font-futuristic tracking-[0.2em] text-white mb-6"
                    >
                        ACCESS REQUEST
                    </motion.h2>
                    
                    {/* Progress bar */}
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <motion.div
                                key={s}
                                className="h-1 rounded-full overflow-hidden"
                                style={{ width: "40px" }}
                                initial={{ opacity: 0.3, backgroundColor: "rgba(255,255,255,0.2)" }}
                                animate={{
                                    opacity: s <= step ? 1 : 0.3,
                                    backgroundColor: s <= step ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)",
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative min-h-[400px] w-full flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait" custom={direction}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-8 w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-base md:text-lg uppercase tracking-[0.25em] text-white/60 text-center mb-4 font-tech"
                                >
                                    Select Actor Role
                                </motion.p>
                                <motion.div 
                                    className="grid grid-cols-1 gap-4 w-full"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {roles.map((r, i) => (
                                        <motion.button
                                            key={r}
                                            variants={itemVariants}
                                            whileHover={{ 
                                                scale: 1.02, 
                                                backgroundColor: "rgba(255,255,255,0.1)",
                                                borderColor: "rgba(255,255,255,0.4)",
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => { setRole(r); nextStep(); }}
                                            className={`w-full px-8 py-5 border text-center transition-all uppercase text-sm md:text-base font-bold tracking-widest font-tech ${role === r
                                                ? "bg-white text-black border-white"
                                                : "bg-white/5 border-white/10 hover:border-white/30 text-white/50 hover:text-white"
                                                }`}
                                        >
                                            <motion.span
                                                initial={{ opacity: 0.5 }}
                                                animate={{ opacity: role === r ? 1 : 0.5 }}
                                                className="flex items-center justify-center gap-3"
                                            >
                                                <span className="text-xs opacity-50">0{i + 1}</span>
                                                {r}
                                            </motion.span>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <motion.p 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            Identification
                                        </motion.p>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <InfraredInput
                                                label=""
                                                placeholder="FULL NAME"
                                                required
                                                className="text-center text-lg md:text-xl py-6 font-tech"
                                            />
                                        </motion.div>
                                    </div>
                                    <motion.div 
                                        className="flex space-x-4 w-full justify-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </motion.div>
                                </form>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <motion.p 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            Contact Vector
                                        </motion.p>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <InfraredInput
                                                label=""
                                                type="email"
                                                placeholder="EMAIL ADDRESS"
                                                required
                                                className="text-center text-lg md:text-xl py-6 font-tech"
                                            />
                                        </motion.div>
                                    </div>
                                    <motion.div 
                                        className="flex space-x-4 w-full justify-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </motion.div>
                                </form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <motion.p 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            Operations Hub
                                        </motion.p>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <InfraredInput
                                                label=""
                                                placeholder="LOCATION / CITY"
                                                required
                                                className="text-center text-lg md:text-xl py-6 font-tech"
                                            />
                                        </motion.div>
                                    </div>
                                    <motion.div 
                                        className="flex space-x-4 w-full justify-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </motion.div>
                                </form>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={handleSubmit} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <motion.p 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            Credentials
                                        </motion.p>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <InfraredInput
                                                label=""
                                                placeholder="PORTFOLIO / SOCIAL LINK"
                                                className="text-center text-lg md:text-xl py-6 font-tech"
                                            />
                                        </motion.div>
                                    </div>
                                    <motion.div 
                                        className="flex space-x-4 w-full justify-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4" disabled={loading}>BACK</InfraredButton>
                                        <InfraredButton type="submit" disabled={loading} className="flex-1 py-4 text-base relative overflow-hidden">
                                            {loading ? (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center justify-center gap-2"
                                                >
                                                    <motion.span
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                                    />
                                                    TRANSMITTING...
                                                </motion.span>
                                            ) : (
                                                "SUBMIT APPLICATION"
                                            )}
                                        </InfraredButton>
                                    </motion.div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </GlassPanel>
        </div>
    );
}
