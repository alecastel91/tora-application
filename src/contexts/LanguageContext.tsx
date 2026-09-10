'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'CN' | 'EN' | 'ES' | 'FR' | 'IT' | 'JP' | 'KR' | 'PT';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('EN');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Load translations when language changes
  useEffect(() => {
    async function loadTranslations() {
      try {
        const trans = await import(`@/translations/${language}.json`);
        setTranslations(trans.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fallback to English if translation fails
        if (language !== 'EN') {
          const fallback = await import(`@/translations/EN.json`);
          setTranslations(fallback.default);
        }
      }
    }

    loadTranslations();
  }, [language]);

  // Load saved language preference on mount. This effect must run BEFORE the
  // save effect below: effects fire in declaration order, and with the save
  // effect first the initial 'EN' overwrote the stored choice on every page
  // load, so the site forgot the visitor's language on refresh/navigation.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tora-language') as LanguageCode;
      if (saved && ['CN', 'EN', 'ES', 'FR', 'IT', 'JP', 'KR', 'PT'].includes(saved)) {
        setLanguageState(saved);
      }
    }
    setHydrated(true);
  }, []);

  // Save language preference to localStorage (only after the saved value has
  // been read, so the default never clobbers it).
  useEffect(() => {
    if (hydrated && typeof window !== 'undefined') {
      localStorage.setItem('tora-language', language);
    }
  }, [language, hydrated]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
