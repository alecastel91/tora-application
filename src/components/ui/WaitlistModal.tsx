"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { GlowButton } from "./GlowButton";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const roleMap: Record<string, string> = {
    "Artist": "artist",
    "PR / Promoter": "pr",
    "Venue": "venue"
};

const roles = Object.keys(roleMap);

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create the profile record
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: authData.user.id,
                        email: email,
                        category: role ? roleMap[role] : null,
                        full_name: email.split('@')[0], // Default name from email
                    });

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                    // We don't necessarily want to fail the whole thing if the profile fails 
                    // (e.g. if the user already exists) but let's be safe.
                }

                setDone(true);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-near-black/90 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 cursor-crosshair"
                    />

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="relative w-full max-w-md z-10"
                    >
                        <GlassCard className="p-10 border-white/5 bg-near-black">
                            {/* Corner decor */}
                            <div className="absolute top-0 right-0 w-8 h-px bg-tora-orange/40" />
                            <div className="absolute top-0 right-0 w-px h-8 bg-tora-orange/40" />

                            {!done ? (
                                <div className="space-y-10">
                                    <div className="text-left border-b border-white/5 pb-8">
                                        <h3 className="text-2xl font-black uppercase tracking-widest italic mb-2">Waitlist Entry</h3>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Protocol Registration Phase 1</p>
                                    </div>

                                    {step === 1 ? (
                                        <div className="space-y-6">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Select Actor Role:</p>
                                            <div className="grid grid-cols-1 gap-2">
                                                {roles.map((r) => (
                                                    <button
                                                        key={r}
                                                        onClick={() => { setRole(r); setStep(2); }}
                                                        className={cn(
                                                            "w-full px-6 py-4 border text-left transition-all uppercase text-[10px] font-black tracking-widest skew-btn",
                                                            role === r
                                                                ? "bg-tora-orange text-white"
                                                                : "bg-white/5 border-white/5 hover:border-white/20 text-white/40"
                                                        )}
                                                    >
                                                        <span className="block unskew-text">{r}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 ml-1">Email Terminal</label>
                                                    <input
                                                        autoFocus
                                                        type="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="YOU@DOMAIN.EXT"
                                                        className="w-full px-6 py-4 bg-white/5 border border-white/5 focus:outline-none focus:border-tora-orange text-xs uppercase tracking-widest font-bold placeholder:text-white/10"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 ml-1">Access Key</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        className="w-full px-6 py-4 bg-white/5 border border-white/5 focus:outline-none focus:border-tora-orange text-xs uppercase tracking-widest font-bold placeholder:text-white/10"
                                                    />
                                                </div>
                                                
                                                {error && (
                                                    <p className="text-[10px] text-tora-crimson uppercase tracking-widest font-bold">{error}</p>
                                                )}
                                            </div>

                                            <div className="flex space-x-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="px-6 py-4 border border-white/10 text-[10px] uppercase font-black tracking-widest hover:bg-white/5"
                                                >
                                                    Reset
                                                </button>
                                                <GlowButton type="submit" className="flex-1" disabled={loading}>
                                                    {loading ? "Transmitting..." : "Initialize"}
                                                </GlowButton>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            ) : (
                                <div className="text-left py-8 space-y-8">
                                    <div className="w-12 h-12 border border-tora-orange flex items-center justify-center">
                                        <div className="w-4 h-4 bg-tora-orange animate-pulse" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Registration Successful</h3>
                                        <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">
                                            Your ID has been added to the queue at <span className="text-white">{email}</span>. Please verify your email to activate your profile.
                                        </p>
                                    </div>
                                    <GlowButton onClick={onClose} variant="secondary" className="w-full">
                                        Acknowledge
                                    </GlowButton>
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
