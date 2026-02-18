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
                    className="mb-6 text-infrared"
                >
                    <CheckCircle2 size={64} strokeWidth={1} style={{ filter: "drop-shadow(0 0 10px rgba(255, 51, 0, 0.4))" }} />
                </motion.div>

                <h2 className="text-2xl font-orbitron text-white mb-4 tracking-wider">
                    TRANSMISSION RECEIVED
                </h2>

                <p className="text-white/60 text-lg mb-8 font-light">
                    We will review your application and establish contact shortly.
                </p>

                <div className="text-xs font-orbitron text-infrared/60 uppercase tracking-[0.2em] animate-pulse">
                    System Standby
                </div>
            </GlassPanel>
        </div>
    );
}
