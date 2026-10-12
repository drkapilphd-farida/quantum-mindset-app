import type { MemoryForm, MemoryLang } from './content'
import { MEMORY_FACES, MEMORY_WORDS, NUMBER_LENGTH } from './content'

// Pure rules of the memory check (Day 1 and Day 30).

export const MEMORY_CHECK_EXERCISE_ID = 'memory-check'

export type MemoryPhase = 'baseline' | 'final'

export type MemoryParts = {
  /** Words found minus wrong taps (never below 0), out of 20. */
  words: number
  wordsFound: number
  wrongTaps: number
  /** Digits in the right place, out of 10. */
  digits: number
  /** Faces matched to the right name, out of 5. */
  faces: number
}

export type MemoryCheckResult = MemoryParts & {
  phase: MemoryPhase
  form: MemoryForm
  lang: MemoryLang
  /** The plan day it was taken on. */
  day: number | null
  /** 0–100: the average of the three parts. */
  score: number
  takenAt: string
}

export const WORDS_TOTAL = 20
export const DIGITS_TOTAL = NUMBER_LENGTH
export const FACES_TOTAL = 5

export function scoreWords(form: MemoryForm, picked: readonly string[]): Pick<MemoryParts, 'words' | 'wordsFound' | 'wrongTaps'> {
  const targets = new Set(MEMORY_WORDS[form].targets.map((x) => x.id))
  const unseen = new Set(MEMORY_WORDS[form].unseen.map((x) => x.id))
  const unique = [...new Set(picked)]
  const wordsFound = unique.filter((id) => targets.has(id)).length
  const wrongTaps = unique.filter((id) => unseen.has(id)).length
  return { words: Math.max(0, wordsFound - wrongTaps), wordsFound, wrongTaps }
}

export function scoreDigits(number: string, typed: string): number {
  let right = 0
  for (let i = 0; i < number.length; i++) if (typed[i] === number[i]) right++
  return right
}

/** `picks` maps face id → the name (face id) the learner chose for it. */
export function scoreFaces(form: MemoryForm, picks: Readonly<Record<string, string>>): number {
  return MEMORY_FACES[form].filter((f) => picks[f.id] === f.id).length
}

export function memoryScore(parts: Pick<MemoryParts, 'words' | 'digits' | 'faces'>): number {
  return Math.round(((parts.words / WORDS_TOTAL + parts.digits / DIGITS_TOTAL + parts.faces / FACES_TOTAL) / 3) * 100)
}

/** Form A starts, form B ends, so the two checks use different material. */
export function formFor(phase: MemoryPhase): MemoryForm {
  return phase === 'baseline' ? 'A' : 'B'
}

/** The plan day a learner is on, from their completed days. */
export function currentDay(completedDays: readonly number[]): number {
  return Math.min(30, (completedDays.length === 0 ? 0 : Math.max(...completedDays)) + 1)
}

/** A starting check is open on Days 1–7 (until Day 7 is complete), once. */
export const BASELINE_LAST_DAY = 7

export type MemoryCheckStatus = { baselineOpen: boolean; finalOpen: boolean; baseline: MemoryCheckResult | null; final: MemoryCheckResult | null }

export function memoryCheckStatus(completedDays: readonly number[], results: readonly MemoryCheckResult[]): MemoryCheckStatus {
  const baseline = results.find((r) => r.phase === 'baseline') ?? null
  const final = results.find((r) => r.phase === 'final') ?? null
  const day = currentDay(completedDays)
  return {
    baselineOpen: baseline === null && day <= BASELINE_LAST_DAY,
    finalOpen: final === null && completedDays.includes(29),
    baseline,
    final,
  }
}

/** Day 30 compared with the start, only when both exist in the same language. */
export function memoryBeforeAfter(status: Pick<MemoryCheckStatus, 'baseline' | 'final'>): { before: MemoryCheckResult; after: MemoryCheckResult } | null {
  const { baseline, final } = status
  if (baseline === null || final === null || baseline.lang !== final.lang) return null
  return { before: baseline, after: final }
}

/** A new random number: 10 digits, the first never 0. */
export function newNumber(randomDigit: (maxExclusive: number) => number): string {
  let s = String(1 + randomDigit(9))
  while (s.length < NUMBER_LENGTH) s += String(randomDigit(10))
  return s
}

export function shuffle<T>(items: readonly T[], randomIndex: (maxExclusive: number) => number): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1)
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}
