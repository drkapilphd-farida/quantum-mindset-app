// Shared logic for the two chunk-reading exercises.
//
// Dynamic Chunk Sliding (horizontal) and Vertical Chunk Sliding (a column)
// both show a short passage a few words at a time, then check understanding.
// Chunk size grows with level: 1 word (L1–3) → 2 words (L4–6) → 3 words
// (L7–10), and the pace rises slowly from a very easy start. Chunks never run
// across the end of a sentence, and long words always appear on their own.

import type { PassageLang } from './readingPassages'

export type ChunkLevel = { chunkWords: 1 | 2 | 3; wpm: number; questions: 2 | 3 }

export const DYNAMIC_CHUNK_LEVELS: Readonly<Record<number, ChunkLevel>> = {
  1: { chunkWords: 1, wpm: 110, questions: 2 },
  2: { chunkWords: 1, wpm: 130, questions: 2 },
  3: { chunkWords: 1, wpm: 150, questions: 2 },
  4: { chunkWords: 2, wpm: 160, questions: 2 },
  5: { chunkWords: 2, wpm: 180, questions: 3 },
  6: { chunkWords: 2, wpm: 200, questions: 3 },
  7: { chunkWords: 3, wpm: 220, questions: 3 },
  8: { chunkWords: 3, wpm: 240, questions: 3 },
  9: { chunkWords: 3, wpm: 270, questions: 3 },
  10: { chunkWords: 3, wpm: 300, questions: 3 },
}

export const VERTICAL_CHUNK_LEVELS: Readonly<Record<number, ChunkLevel>> = {
  1: { chunkWords: 1, wpm: 100, questions: 2 },
  2: { chunkWords: 1, wpm: 120, questions: 2 },
  3: { chunkWords: 1, wpm: 140, questions: 2 },
  4: { chunkWords: 2, wpm: 150, questions: 3 },
  5: { chunkWords: 2, wpm: 170, questions: 3 },
  6: { chunkWords: 2, wpm: 190, questions: 3 },
  7: { chunkWords: 3, wpm: 200, questions: 3 },
  8: { chunkWords: 3, wpm: 220, questions: 3 },
  9: { chunkWords: 3, wpm: 250, questions: 3 },
  10: { chunkWords: 3, wpm: 280, questions: 3 },
}

export function chunkLevel(table: Readonly<Record<number, ChunkLevel>>, level: number): ChunkLevel {
  return table[Math.min(10, Math.max(1, Math.round(level)))] ?? table[1]!
}

export const ROUNDS_PER_SESSION = 3

const SENTENCE_END = /[.!?।]["'”’)]*$/

function graphemes(word: string): number {
  const bare = word.replace(/[^\p{L}\p{M}\p{N}]/gu, '')
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(bare)].length
  }
  return bare.length
}

/** Long words are shown alone: 10+ letters in English, 7+ characters in Hindi. */
export function isLongWord(word: string, lang: PassageLang): boolean {
  return graphemes(word) >= (lang === 'hi' ? 7 : 10)
}

export function chunkText(text: string, size: number, lang: PassageLang): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const chunks: string[] = []
  let current: string[] = []
  const flush = (): void => {
    if (current.length > 0) chunks.push(current.join(' '))
    current = []
  }
  for (const word of words) {
    if (isLongWord(word, lang)) {
      flush()
      chunks.push(word)
      continue
    }
    current.push(word)
    if (current.length >= size || SENTENCE_END.test(word)) flush()
  }
  flush()
  return chunks
}

/** How long a chunk stays highlighted: its words at the level's pace, plus a short pause at a sentence end. */
export function chunkDurationMs(chunk: string, wpm: number): number {
  const words = chunk.split(/\s+/).filter(Boolean).length
  const base = (words * 60_000) / Math.max(40, wpm)
  return Math.round(Math.max(280, base) + (SENTENCE_END.test(chunk) ? 200 : 0))
}

/** "Effective" reading speed: pace × share of questions answered correctly. */
export function effectiveWpm(wpm: number, correct: number, total: number): number {
  if (total <= 0) return 0
  return Math.round(wpm * (correct / total))
}
