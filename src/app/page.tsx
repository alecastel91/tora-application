"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThreeDBackground } from "@/components/ui/ThreeDBackground";
import { LogoEmergence } from "@/components/sections/infrared/LogoEmergence";
import { AboutApply } from "@/components/sections/infrared/AboutApply";
import { ApplicationForm } from "@/components/sections/infrared/ApplicationForm";
import { Confirmation } from "@/components/sections/infrared/Confirmation";

type FlowState = "logo" | "about" | "form" | "confirmation";

export default function Home() {
  const [view, setView] = useState<FlowState>("logo");

  return (
    <main className="relative min-h-screen bg-charcoal overflow-hidden font-sans selection:bg-infrared/30 selection:text-white">
      <ThreeDBackground />

      <AnimatePresence mode="wait">
        {view === "logo" && (
          <motion.div
            key="logo"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <LogoEmergence onComplete={() => setView("about")} />
          </motion.div>
        )}

        {view === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50, filter: "blur(5px)" }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <AboutApply onApply={() => setView("form")} />
          </motion.div>
        )}

        {view === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 50, filter: "blur(5px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <ApplicationForm onSubmit={() => setView("confirmation")} />
          </motion.div>
        )}

        {view === "confirmation" && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Confirmation />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
