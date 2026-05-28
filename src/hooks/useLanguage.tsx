import { createContext, useContext, useCallback, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type ar from '@/i18n/ar.json';

type Lang = 'ar' | 'en';
type Translations = typeof ar;

interface LangContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language === 'en' ? 'en' : 'ar') as Lang;

  const setLang = useCallback((l: Lang) => {
    i18n.changeLanguage(l);
    localStorage.setItem('digzoom-lang', l);
  }, [i18n]);

  const toggleLang = useCallback(() => {
    const next = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
  }, [lang, setLang]);

  // Sync document direction
  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.style.direction = dir;
  }, [lang]);

  // Ensure i18n matches localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('digzoom-lang');
    if (saved === 'ar' || saved === 'en') {
      if (i18n.language !== saved) {
        i18n.changeLanguage(saved);
      }
    }
  }, [i18n]);

  return (
    <LangContext.Provider value={{ lang, t: t as unknown as Translations, toggleLang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
