// The app's interface languages. The website stays English/Hindi; inside the
// app a learner can pick any of these. Each language is shown in its own
// script in the picker. `review: 'pending'` = machine-assisted translation
// waiting for a native speaker (see docs/translations/README.md).

export const APP_LANGS = ['en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu', 'bn'] as const

export type AppLang = (typeof APP_LANGS)[number]

export type LanguageInfo = {
  nativeName: string
  englishName: string
  /** BCP-47 tag for <html lang> and Intl. */
  htmlLang: string
  review: 'reviewed' | 'pending'
}

export const LANGUAGES: Record<AppLang, LanguageInfo> = {
  en: { nativeName: 'English', englishName: 'English', htmlLang: 'en', review: 'reviewed' },
  hi: { nativeName: 'हिंदी', englishName: 'Hindi', htmlLang: 'hi', review: 'pending' },
  kn: { nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', htmlLang: 'kn', review: 'pending' },
  ta: { nativeName: 'தமிழ்', englishName: 'Tamil', htmlLang: 'ta', review: 'pending' },
  te: { nativeName: 'తెలుగు', englishName: 'Telugu', htmlLang: 'te', review: 'pending' },
  mr: { nativeName: 'मराठी', englishName: 'Marathi', htmlLang: 'mr', review: 'pending' },
  gu: { nativeName: 'ગુજરાતી', englishName: 'Gujarati', htmlLang: 'gu', review: 'pending' },
  bn: { nativeName: 'বাংলা', englishName: 'Bengali', htmlLang: 'bn', review: 'pending' },
}

/** Cookie the server reads to render app pages in the chosen language. */
export const APP_LANG_COOKIE = 'mum_app_lang'
/** Same key the website's EN/HI toggle already uses — values are now any AppLang. */
export const APP_LANG_STORAGE_KEY = 'mum_lang'

export function isAppLang(value: unknown): value is AppLang {
  return typeof value === 'string' && (APP_LANGS as readonly string[]).includes(value)
}

/** Website pages stay English/Hindi: Hindi stays Hindi, every other language shows English. */
export function siteLangFor(lang: AppLang): 'en' | 'hi' {
  return lang === 'hi' ? 'hi' : 'en'
}

/**
 * The first supported language in a browser's preference list
 * (Accept-Language header or navigator.languages), else English.
 */
export function langFromBrowser(preferences: readonly string[] | string | null | undefined): AppLang {
  const list =
    typeof preferences === 'string'
      ? preferences
          .split(',')
          .map((part) => part.trim().split(';')[0] ?? '')
          .filter((part) => part !== '')
      : [...(preferences ?? [])]
  for (const tag of list) {
    const base = tag.toLowerCase().split('-')[0]
    if (isAppLang(base)) return base
  }
  return 'en'
}
