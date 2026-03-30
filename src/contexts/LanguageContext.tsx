'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageCode = 'CN' | 'EN' | 'ES' | 'FR' | 'IT' | 'JP' | 'KR' | 'PT';

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

  // Save language preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tora-language', language);
    }
  }, [language]);

  // Load saved language preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tora-language') as LanguageCode;
      if (saved && ['CN', 'EN', 'ES', 'FR', 'IT', 'JP', 'KR', 'PT'].includes(saved)) {
        setLanguageState(saved);
      }
    }
  }, []);

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
