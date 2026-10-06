import type { AppLang } from './languages'

// Which languages have NATIVE practice text, per kind of content. The
// interface can be in any of the 7 languages, but reading passages, RSVP
// text, word/phrase lists and test questions only exist in the languages
// listed here. Everywhere else the practice text falls back to English
// (or Hindi, when the learner picked Hindi and Hindi text exists), and the
// screen shows "Practice text in English — <language> practice text coming
// soon." When a language's content files are added (see
// src/content/practice/README.md), add the language here.
//
// Reading speed (WPM) depends on the language of the text, so every result
// is stored with the language of the text that was read (content_lang) and
// only compared with the learner's own results in that same language.

export type PracticeKind = 'reading' | 'rsvp' | 'wordList' | 'phraseList' | 'readingTest' | 'chunkPassages'

export const PRACTICE_CONTENT_LANGS: Record<PracticeKind, readonly AppLang[]> = {
  reading: ['en'],
  rsvp: ['en'],
  wordList: ['en'],
  phraseList: ['en'],
  readingTest: ['en', 'hi'],
  // Short passages of the chunk-reading exercises (src/features/exercise-core/readingPassages.ts).
  chunkPassages: ['en', 'hi'],
}

/** The language the practice text will actually be in for this learner. */
export function practiceContentLang(uiLang: AppLang, kind: PracticeKind): AppLang {
  const available = PRACTICE_CONTENT_LANGS[kind]
  if (available.includes(uiLang)) return uiLang
  return 'en'
}

/** True when the practice text is not in the learner's own language (show the "coming soon" note). */
export function practiceTextIsFallback(uiLang: AppLang, kind: PracticeKind): boolean {
  return practiceContentLang(uiLang, kind) !== uiLang
}

/** Two results may be compared only when their practice text was in the same language. */
export function sameContentLang(a: { contentLang?: AppLang | null }, b: { contentLang?: AppLang | null }): boolean {
  return (a.contentLang ?? 'en') === (b.contentLang ?? 'en')
}
