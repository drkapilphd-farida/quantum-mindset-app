"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations, type Lang, type Translations } from "@/lib/i18n";
import { APP_LANG_COOKIE, APP_LANG_STORAGE_KEY, isAppLang, siteLangFor, type AppLang } from "@/lib/app-i18n/languages";

// Website language (English / Hindi). The stored choice can be any of the
// app's 7 languages (see src/lib/app-i18n); website pages show Hindi for
// Hindi and English for every other language. Inside the app,
// AppI18nProvider takes over with the full language.

type LanguageContextValue = {
  /** Website language — always "en" or "hi". */
  lang: Lang;
  /** The learner's chosen language (any of the 7 app languages). */
  appLang: AppLang;
  setLang: (lang: Lang) => void;
  /** Remember any app language (used by the in-app language picker). */
  setAppLang: (lang: AppLang) => void;
  toggleLang: () => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = APP_LANG_STORAGE_KEY;

function writeLangCookie(next: AppLang): void {
  document.cookie = `${APP_LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [appLang, setAppLangState] = useState<AppLang>("en");
  const lang: Lang = siteLangFor(appLang);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isAppLang(stored)) {
        setAppLangState(stored);
        document.documentElement.lang = siteLangFor(stored);
      }
    } catch {
      // Storage unavailable — stay on English.
    }
  }, []);

  // Stable identity (useCallback) — the memoized `value` object below
  // depends on both of these staying referentially stable across
  // re-renders whenever `lang` itself hasn't changed, otherwise every
  // consumer re-renders on every provider render regardless of memoization.
  const setAppLang = useCallback((next: AppLang) => {
    setAppLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable — the cookie still carries the choice.
    }
    writeLangCookie(next);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setAppLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable — the choice still applies to this page.
    }
    writeLangCookie(next);
    document.documentElement.lang = next;
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "hi" : "en");
  }, [lang, setLang]);

  const value = useMemo(
    () => ({ lang, appLang, setLang, setAppLang, toggleLang, t: translations[lang] }),
    [lang, appLang, setLang, setAppLang, toggleLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
