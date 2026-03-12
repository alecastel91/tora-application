"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThreeDBackground } from "@/components/ui/ThreeDBackground";
import { IntroSplash } from "@/components/sections/infrared/IntroSplash";
import { ApplicationForm } from "@/components/sections/infrared/ApplicationForm";
import { Confirmation } from "@/components/sections/infrared/Confirmation";

type FlowState = "intro" | "form" | "confirmation";

export default function Home() {
  const [view, setView] = useState<FlowState>("intro");
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden overflow-y-auto font-sans selection:bg-infrared/30 selection:text-white">
      {view !== "intro" && <ThreeDBackground />}

      <AnimatePresence mode="wait">
        {view === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <IntroSplash
              onComplete={() => setIntroComplete(true)}
              onApply={() => setView("form")}
            />
          </motion.div>
        )}

        {view === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 50, filter: "blur(5px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full min-h-screen"
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
