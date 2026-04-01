"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#0a0a0a]/95 backdrop-blur-md border border-white/10 rounded-lg p-4 md:p-6 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Cookie Message */}
                <div className="flex-1">
                  <p className="text-sm md:text-base text-white/90 leading-relaxed">
                    {t("cookie_banner_text")}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={handleDecline}
                    className="flex-1 md:flex-none px-6 py-2.5 text-sm font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all duration-200 border border-white/10"
                  >
                    {t("cookie_decline")}
                  </button>
                  <button
                    onClick={handleAccept}
                    className="flex-1 md:flex-none px-6 py-2.5 text-sm font-medium text-white bg-[#FF3366] hover:bg-[#FF3366]/90 rounded-md transition-all duration-200 shadow-lg shadow-[#FF3366]/20"
                  >
                    {t("cookie_accept")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
