"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { InfraredInput } from "@/components/ui/InfraredInput";
import { InfraredButton } from "@/components/ui/InfraredButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ApplicationFormProps {
    onSubmit: () => void;
}

export function ApplicationForm({ onSubmit }: ApplicationFormProps) {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onSubmit();
        }, 1500);
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const roles = ["Artist", "PR / Promoter", "Venue", "Agent"];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 overflow-hidden">
            <GlassPanel className="p-8 md:p-16 max-w-2xl w-full flex flex-col items-center">
                <div className="mb-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-orbitron tracking-[0.2em] text-white">ACCESS REQUEST</h2>
                </div>

                <div className="relative min-h-[400px] w-full flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8 w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <p className="text-base md:text-lg uppercase tracking-[0.2em] text-white/60 text-center mb-4">Select Actor Role</p>
                                <div className="grid grid-cols-1 gap-4 w-full">
                                    {roles.map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => { setRole(r); nextStep(); }}
                                            className={`w-full px-8 py-5 border text-center transition-all uppercase text-sm md:text-base font-bold tracking-widest ${role === r
                                                ? "bg-white text-black border-white"
                                                : "bg-white/5 border-white/10 hover:border-white/30 text-white/50 hover:text-white"
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <p className="text-base md:text-lg uppercase tracking-[0.2em] text-white/60 mb-6">Identification</p>
                                        <InfraredInput
                                            label=""
                                            placeholder="FULL NAME"
                                            required
                                            className="text-center text-lg md:text-xl py-6"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <p className="text-base md:text-lg uppercase tracking-[0.2em] text-white/60 mb-6">Contact Vector</p>
                                        <InfraredInput
                                            label=""
                                            type="email"
                                            placeholder="EMAIL ADDRESS"
                                            required
                                            className="text-center text-lg md:text-xl py-6"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <p className="text-base md:text-lg uppercase tracking-[0.2em] text-white/60 mb-6">Operations Hub</p>
                                        <InfraredInput
                                            label=""
                                            placeholder="LOCATION / CITY"
                                            required
                                            className="text-center text-lg md:text-xl py-6"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={handleSubmit} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <p className="text-base md:text-lg uppercase tracking-[0.2em] text-white/60 mb-6">Credentials</p>
                                        <InfraredInput
                                            label=""
                                            placeholder="PORTFOLIO / SOCIAL LINK"
                                            className="text-center text-lg md:text-xl py-6"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4" disabled={loading}>BACK</InfraredButton>
                                        <InfraredButton type="submit" disabled={loading} className="flex-1 py-4 text-base">
                                            {loading ? "TRANSMITTING..." : "SUBMIT APPLICATION"}
                                        </InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </GlassPanel>
        </div>
    );
}
