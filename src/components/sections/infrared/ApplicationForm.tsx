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

    const roles = ["Artist", "PR / Promoter", "Venue", "Agent", "Other"];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 overflow-hidden">
            <GlassPanel className="p-8 md:p-12 max-w-xl w-full">
                <div className="mb-8 text-center">
                    <h2 className="text-xl font-orbitron tracking-[0.1em] text-white">ACCESS REQUEST</h2>
                </div>

                <div className="relative min-h-[350px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6 max-w-sm mx-auto"
                            >
                                <p className="text-sm uppercase tracking-[0.1em] text-white/60 text-center mb-6">Select Actor Role</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {roles.map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => { setRole(r); setStep(2); }}
                                            className={`w-full px-6 py-4 border text-center transition-all uppercase text-xs font-bold tracking-widest ${role === r
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
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <InfraredInput
                                            label="Full Name"
                                            placeholder="ENTER DESIGNATION"
                                            required
                                        />

                                        <InfraredInput
                                            label="Email Address"
                                            type="email"
                                            placeholder="ENTER CONTACT FREQUENCY"
                                            required
                                        />

                                        <InfraredInput
                                            label="Location"
                                            placeholder="PRIMARY SECTOR"
                                            required
                                        />

                                        <InfraredInput
                                            label="Portfolio / Social"
                                            placeholder="LINK TO CREDENTIALS"
                                        />
                                    </div>

                                    <div className="pt-4 flex space-x-4">
                                        <InfraredButton
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setStep(1)}
                                            className="px-6 py-4"
                                            disabled={loading}
                                        >
                                            BACK
                                        </InfraredButton>
                                        <InfraredButton type="submit" disabled={loading} className="flex-1">
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
