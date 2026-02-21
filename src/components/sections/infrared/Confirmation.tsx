"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function Confirmation() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
            <GlassPanel className="p-12 max-w-lg w-full text-center flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-8 text-white"
                >
                    <CheckCircle2 size={72} strokeWidth={1} />
                </motion.div>

                <h2 className="text-3xl font-orbitron text-white mb-6 tracking-wider text-center">
                    TRANSMISSION RECEIVED
                </h2>

                <p className="text-white/70 text-xl md:text-2xl mb-12 font-light text-center">
                    We will review your application and establish contact shortly.
                </p>

                <div className="text-xs font-orbitron text-infrared/60 uppercase tracking-[0.2em] animate-pulse">
                    System Standby
                </div>
            </GlassPanel>
        </div>
    );
}
