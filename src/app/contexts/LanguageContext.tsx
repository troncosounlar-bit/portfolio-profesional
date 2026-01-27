"use client"
import { createContext, useContext, useState, ReactNode } from 'react'; // Se eliminó useEffect de aquí
import esTranslations from '../locales/es';
import enTranslations from '../locales/en';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

const allTranslations: Record<Language, Record<string, string>> = {
  es: esTranslations,
  en: enTranslations,
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Si estamos en el servidor (SSR), usamos 'es' por defecto
    if (typeof window === 'undefined') return 'es';
    
    // Recuperar idioma guardado en localStorage
    const saved = localStorage.getItem('portfolio-language');
    return (saved === 'es' || saved === 'en') ? saved : 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-language', lang);
    }
  };

  const t = (key: string): string => {
    return allTranslations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};