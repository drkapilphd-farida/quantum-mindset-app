import { LIBRARY_EN } from './libraryEn'
import { LIBRARY_HI } from './libraryHi'
import { words, type ReaderSection } from './reader'

// The Smart Reader's own passage library: longer passages in sections, each
// with questions. English and Hindi for now; the other languages read in
// English or Hindi until native passages are written.
export type LibraryPassage = { id: string; lang: 'en' | 'hi'; title: string; sections: ReaderSection[] }

export const LIBRARY: Readonly<Record<'en' | 'hi', readonly LibraryPassage[]>> = { en: LIBRARY_EN, hi: LIBRARY_HI }

export function findPassage(id: string): LibraryPassage | null {
  return [...LIBRARY.en, ...LIBRARY.hi].find((p) => p.id === id) ?? null
}

export function passageWords(p: LibraryPassage): number {
  return p.sections.reduce((n, s) => n + words(s.text).length, 0)
}

/** Reading time at 180 words a minute plus about 20 s of questions per section, rounded to whole minutes. */
export function passageMinutes(p: LibraryPassage): number {
  return Math.max(1, Math.round(passageWords(p) / 180 + p.sections.length / 3))
}
