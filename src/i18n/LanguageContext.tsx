import React, { createContext, useContext, useState, ReactNode } from 'react';
import { languages } from './texts';

export type Language = keyof typeof languages;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  function detectDefaultLanguage(): Language {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz.startsWith('Asia/Tehran')) return 'fa';
    return 'en';
  }

  const [language, setLanguage] = useState<Language>(detectDefaultLanguage());

  React.useEffect(() => {
    const dir = languages[language].direction || 'ltr';
    document.documentElement.setAttribute('dir', dir);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
