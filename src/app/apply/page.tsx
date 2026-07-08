"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IntroSplash } from "@/components/sections/infrared/IntroSplash";
import { ApplicationForm } from "@/components/sections/infrared/ApplicationForm";
import { Confirmation } from "@/components/sections/infrared/Confirmation";
import { WaveMesh } from "@/components/sections/home/WaveMesh";
import { ParallaxBackdrop } from "@/components/sections/home/ParallaxBackdrop";

type FlowState = "globe" | "form" | "confirmation";

export default function Apply() {
  const [view, setView] = useState<FlowState>("globe");
  const [formStep, setFormStep] = useState(0);
  const [showIntroContent, setShowIntroContent] = useState(false);

  return (
    // no bg-black on main: the body is already black, and the fixed ambient
    // layers (negative z) must stay visible through every flow state
    <main className="relative min-h-screen overflow-x-hidden overflow-y-auto font-sans selection:bg-infrared/30 selection:text-white">
      <ParallaxBackdrop />
      <WaveMesh opacity={0.35} />

      <AnimatePresence mode="wait">
        {view === "globe" && (
          <motion.div
            key="globe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <IntroSplash
              onComplete={() => {}}
              onApply={() => setView("form")}
              onShowContent={setShowIntroContent}
              skipSplash
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
            <ApplicationForm
              onSubmit={() => setView("confirmation")}
              onStepChange={setFormStep}
            />
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
