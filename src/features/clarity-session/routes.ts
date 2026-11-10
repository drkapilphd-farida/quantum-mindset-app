import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import { say } from '@/features/programs/common'
import type { ProgramLang } from '@/features/programs/types'
import { BOOKED_PAGE, CLARITY_PAGE } from './copy'

export function clarityMetadata(lang: ProgramLang): Metadata {
  return withLanguageAlternates(buildPageMetadata({ path: '/clarity-session', title: say(CLARITY_PAGE.meta.title, lang), description: say(CLARITY_PAGE.meta.description, lang) }), '/clarity-session')
}

/** Not for search engines: only visitors who have just paid reach it. */
export function bookedMetadata(lang: ProgramLang): Metadata {
  return buildPageMetadata({ path: '/clarity-session/booked', title: `${say(BOOKED_PAGE.title, lang)} | Mind Ur Mind`, description: say(BOOKED_PAGE.note, lang), index: false })
}
