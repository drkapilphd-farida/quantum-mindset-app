"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { setAppLanguage } from "./actions";
import { LANGUAGES, type AppLang } from "./languages";
import { createTranslator, translateLabel, type MessageDict, type Translator } from "./translate";
import { ENGLISH_MESSAGES } from "./english";

// Client side of the app's languages. The server decides the language and
// sends that language's messages (already merged over English), so the
// first paint is in the right language and the browser never downloads the
// other six catalogs.

type AppI18nValue = {
  lang: AppLang;
  t: Translator;
  /** Save a new language (cookie + profile) and re-render the page in it. */
  changeLanguage: (next: AppLang) => void;
  changing: boolean;
};

const AppI18nContext = createContext<AppI18nValue | null>(null);

export function AppI18nProvider({
  lang,
  messages,
  children,
}: {
  lang: AppLang;
  messages: MessageDict;
  children: React.ReactNode;
}): React.JSX.Element {
  const router = useRouter();
  const { setAppLang } = useLanguage();
  const [changing, startTransition] = useTransition();
  const t = useMemo(() => createTranslator(messages, messages), [messages]);

  useEffect(() => {
    document.documentElement.lang = LANGUAGES[lang].htmlLang;
  }, [lang]);

  const changeLanguage = useCallback(
    (next: AppLang) => {
      setAppLang(next);
      startTransition(async () => {
        await setAppLanguage(next);
        router.refresh();
      });
    },
    [router, setAppLang],
  );

  const value = useMemo(() => ({ lang, t, changeLanguage, changing }), [lang, t, changeLanguage, changing]);
  return <AppI18nContext.Provider value={value}>{children}</AppI18nContext.Provider>;
}

// Outside AppI18nProvider (a shared exercise piece on a website page) the
// app strings render in English — exactly what those pages showed before.
const ENGLISH_T = createTranslator(ENGLISH_MESSAGES, ENGLISH_MESSAGES);
const ENGLISH_VALUE: AppI18nValue = { lang: "en", t: ENGLISH_T, changeLanguage: () => undefined, changing: false };

/** The app translator (English outside the app). */
export function useAppT(): Translator {
  return useContext(AppI18nContext)?.t ?? ENGLISH_T;
}

/** Translates a fixed English label from engine code by value; unknown labels stay English. */
export function useLabelT(): (english: string) => string {
  const t = useAppT();
  return useCallback((english: string) => translateLabel(t, english), [t]);
}

export function useAppI18n(): AppI18nValue {
  return useContext(AppI18nContext) ?? ENGLISH_VALUE;
}

/**
 * The language a component shared by the website and the app should use:
 * the app language inside the app, English/Hindi on the website.
 */
export function useUiLang(): AppLang {
  const app = useContext(AppI18nContext);
  const site = useLanguage();
  return app?.lang ?? site.lang;
}
