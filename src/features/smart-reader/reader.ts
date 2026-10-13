// Smart Reader (Group B, 17 Oct 2026): pure logic — sections, words, Word
// Flash timing and focus letter, adaptive speed. No React, no I/O.

export const SMART_READER_EXERCISE_ID = 'smart-reader'
export const DEFAULT_START_WPM = 180
export const MIN_WPM = 100
export const MAX_WPM = 800
export const WPM_STEP = 25
/** A gentle break reminder after this much reading. */
export const BREAK_REMINDER_MS = 13 * 60_000

export type ReaderMode = 'pacer' | 'flash' | 'normal'
export type SectionQuestion = { question: string; options: string[]; correctIndex: number }
export type ReaderSection = { heading: string | null; text: string; questions: SectionQuestion[] }

export function clampWpm(wpm: number): number {
  return Math.min(MAX_WPM, Math.max(MIN_WPM, Math.round(wpm / 5) * 5))
}

/** Start speed: the learner's latest measured speed + 10%, else a gentle default. */
export function startWpm(measuredWpm: number | null): number {
  return measuredWpm === null || measuredWpm <= 0 ? DEFAULT_START_WPM : clampWpm(measuredWpm * 1.1)
}

/** After a section's questions: ≥ 85% → a little faster; 60–84% → same; under 60% → slower (and suggest the Guided Pacer). */
export function nextWpm(wpm: number, correct: number, total: number): { wpm: number; suggestPacer: boolean } {
  if (total <= 0) return { wpm, suggestPacer: false }
  const pct = (correct / total) * 100
  if (pct >= 85) return { wpm: clampWpm(wpm * 1.07), suggestPacer: false }
  if (pct >= 60) return { wpm, suggestPacer: false }
  return { wpm: clampWpm(wpm * 0.9), suggestPacer: true }
}

/** Effective reading speed = speed × comprehension. */
export function effectiveWpm(wpm: number, comprehensionPercent: number): number {
  return Math.round((wpm * comprehensionPercent) / 100)
}

/** Words only split at spaces — never inside a word, in any script. */
export function words(text: string): string[] {
  return text.split(/\s+/).filter(Boolean)
}

/** Split own material into sections of about 300–500 words, at paragraph ends (a heading-like short line starts a new section). */
export function splitIntoSections(text: string, target = 380): { heading: string | null; text: string }[] {
  const paragraphs = text
    .replace(/\r/g, '')
    .split(/\n\s*\n|\n(?=[^\n]{1,70}\n)/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
  const out: { heading: string | null; text: string }[] = []
  let heading: string | null = null
  let buf: string[] = []
  let count = 0
  const flush = (): void => {
    if (buf.length > 0) out.push({ heading, text: buf.join('\n\n') })
    heading = null
    buf = []
    count = 0
  }
  for (const p of paragraphs) {
    const n = words(p).length
    const looksLikeHeading = n <= 8 && !/[.!?।]$/.test(p)
    if (looksLikeHeading) {
      if (count >= 120) flush()
      if (buf.length === 0) {
        heading = p
        continue
      }
    }
    if (count > 0 && count + n > target * 1.3) flush()
    buf.push(p)
    count += n
    if (count >= target) flush()
  }
  flush()
  // A very short last section joins the one before it.
  if (out.length > 1 && words(out[out.length - 1]!.text).length < 80) {
    const last = out.pop()!
    out[out.length - 1]!.text += `\n\n${last.text}`
  }
  return out
}

/** Grapheme clusters, so a conjunct (क्ष, स्त्र) is never cut. */
export function clusters(word: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return Array.from(seg.segment(word), (s) => s.segment)
  }
  return Array.from(word)
}

/** The focus cluster for Word Flash: about a third of the way in (letters only, punctuation ignored). */
export function focusIndex(word: string): number {
  const cs = clusters(word)
  const letters = cs.map((c, i) => ({ c, i })).filter(({ c }) => /[\p{L}\p{N}]/u.test(c))
  if (letters.length === 0) return 0
  const k = letters.length <= 1 ? 0 : letters.length <= 5 ? 1 : Math.floor(letters.length * 0.33)
  return letters[Math.min(k, letters.length - 1)]!.i
}

/** How long Word Flash shows a word: longer words and numbers get more time; small pauses at commas, longer at sentence and paragraph ends. */
export function wordDurationMs(word: string, wpm: number, paragraphEnd = false): number {
  const base = 60_000 / wpm
  let factor = 1
  const len = clusters(word.replace(/[^\p{L}\p{N}\p{M}]/gu, '')).length
  if (len >= 9) factor += 0.4
  else if (len >= 7) factor += 0.2
  if (/\d/.test(word)) factor += 0.5
  if (/[,;:]$/.test(word)) factor += 0.5
  if (/[.!?।]["”’)]?$/.test(word)) factor += 1
  if (paragraphEnd) factor += 1.5
  return Math.round(base * factor)
}

/** Sentence start indexes (word positions) — for "back one sentence". */
export function sentenceStarts(ws: readonly string[]): number[] {
  const starts = [0]
  ws.forEach((w, i) => {
    if (/[.!?।]["”’)]?$/.test(w) && i + 1 < ws.length) starts.push(i + 1)
  })
  return starts
}

/** The word index of the start of the sentence before the one at `at` (or this one's start, if we're past its first words). */
export function backOneSentence(ws: readonly string[], at: number): number {
  const starts = sentenceStarts(ws)
  let cur = 0
  for (const s of starts) if (s <= at) cur = s
  const idx = starts.indexOf(cur)
  return at - cur > 2 || idx === 0 ? cur : starts[idx - 1]!
}
