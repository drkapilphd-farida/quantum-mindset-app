import { cache } from 'react'
import { cookies, headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { CATALOG, ENGLISH } from './catalog'
import { APP_LANG_COOKIE, isAppLang, langFromBrowser, type AppLang } from './languages'
import { createTranslator, mergeOverEnglish, type MessageDict, type Translator } from './translate'
import { practiceContentLang, type PracticeKind } from './practiceContent'

// Server side of the app's languages. Order of precedence for a request:
// 1. the signed-in learner's saved choice (profiles.preferred_language),
// 2. the language cookie (set whenever someone picks a language),
// 3. the browser's languages (Accept-Language), else English.
// cache() = at most one profile read per request.

export const getAppLang = cache(async (): Promise<AppLang> => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user !== null) {
      const { data } = await supabase.from('profiles').select('preferred_language').eq('id', user.id).maybeSingle()
      if (isAppLang(data?.preferred_language)) return data.preferred_language
    }
  } catch {
    // No session or no database — fall through to cookie / browser.
  }
  try {
    const cookie = (await cookies()).get(APP_LANG_COOKIE)?.value
    if (isAppLang(cookie)) return cookie
    return langFromBrowser((await headers()).get('accept-language'))
  } catch {
    // Outside a request (scripts, tests): English.
    return 'en'
  }
})

/** The language's messages merged over English — what AppI18nProvider sends to the browser. */
export function getAppMessages(lang: AppLang): MessageDict {
  return lang === 'en' ? ENGLISH : mergeOverEnglish(ENGLISH, CATALOG[lang])
}

export async function getAppT(): Promise<{ lang: AppLang; t: Translator }> {
  const lang = await getAppLang()
  return { lang, t: createTranslator(CATALOG[lang], ENGLISH) }
}

/** The language the learner's built-in practice text is in right now (stored with every reading result). */
export async function getPracticeContentLang(kind: PracticeKind): Promise<AppLang> {
  return practiceContentLang(await getAppLang(), kind)
}

/** An uploaded document's reading language (quantum_documents.target_language), else English. */
export async function getDocumentContentLang(documentId: string): Promise<AppLang> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('quantum_documents').select('target_language').eq('id', documentId).maybeSingle()
    return isAppLang(data?.target_language) ? data.target_language : 'en'
  } catch {
    return 'en'
  }
}
