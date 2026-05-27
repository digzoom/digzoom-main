import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import ar from '@/i18n/ar.json';
import en from '@/i18n/en.json';

type Lang = 'ar' | 'en';
type Translations = typeof ar;

interface LangContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  setLang: (l: Lang) => void;
}

const translationsMap: Record<Lang, Translations> = { ar, en };

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('digzoom-lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });

  const t = translationsMap[lang];

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('digzoom-lang', l);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  }, [lang, setLang]);

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
    document.body.style.direction = t.dir as 'rtl' | 'ltr';
  }, [lang, t.dir]);

  return (
    <LangContext.Provider value={{ lang, t, toggleLang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
