import type { FairResult } from '@/features/fair-reading-test/fairTest'
import { percentChange } from '@/features/fair-reading-test/fairTest'
import type { FairLang } from '@/features/fair-reading-test/forms'

// Pure rules of the Sharp Brain 30-day certificate (Phase 3, item 2).

export const CERT_PROGRAM = 'sharp-brain-30'
/** Printed in every language: a brand name. */
export const PROGRAM_NAME = 'Sharp Brain™ — Focus · Memory · Smart Reading'
export const CERT_DAY = 30

// Crockford base32: no I, L, O or U, so an ID read aloud or typed can't be confused.
const CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const CODE_RE = /^SB-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/

/** A new random certificate ID like SB-7K4M-Q2XP (40 random bits). */
export function generateCode(randomIndex: (size: number) => number): string {
  const chars = Array.from({ length: 8 }, () => CODE_ALPHABET[randomIndex(CODE_ALPHABET.length)]!)
  return `SB-${chars.slice(0, 4).join('')}-${chars.slice(4).join('')}`
}

/** A typed or pasted ID in canonical form, or null if it can't be one. */
export function normalizeCode(input: string): string | null {
  const compact = input.toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1')
  const body = compact.startsWith('SB') ? compact.slice(2) : compact
  if (body.length !== 8) return null
  const code = `SB-${body.slice(0, 4)}-${body.slice(4)}`
  return CODE_RE.test(code) ? code : null
}

/** The name as it will be printed, or null if it isn't a plausible name. Any script. */
export function cleanLearnerName(input: string): string | null {
  const name = input.normalize('NFC').trim().replace(/\s+/g, ' ')
  if (name.length < 2 || name.length > 60) return null
  return /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u.test(name) ? name : null
}

function firstGrapheme(word: string): string {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  for (const { segment } of segmenter.segment(word)) return segment
  return ''
}

/** For the public verification page: first name + last initial ("Rahul S."), since many learners are children. */
export function publicName(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 1) return words[0] ?? ''
  // An Indic initial is the consonant alone: "यादव" → "य", not "या".
  const initial = firstGrapheme(words[words.length - 1]!).replace(/\p{M}+$/u, '')
  return `${words[0]} ${initial}.`
}

export type ReadingNumbers = { wpm: number; comprehension: number; effective: number }

export type CertificateSnapshot = {
  /** Fair reading test; null when there is no Day 30 result. */
  reading: {
    lang: FairLang
    /** The first fair test; null when the learner never took one (Day 30 numbers only). */
    before: (ReadingNumbers & { day: number }) | null
    after: ReadingNumbers
  } | null
  /** Memory Palace averages, 0–100; null when never attempted (the box is left off). */
  memory: { memory: number | null; retention: number | null } | null
}

const numbers = (r: FairResult): ReadingNumbers => ({ wpm: r.wpm, comprehension: r.comprehensionPercent, effective: r.effectiveWpm })

/**
 * The curriculum day a fair baseline was taken on. A Day 1 baseline knows its
 * day; the one-time baseline of an existing learner was taken at the start of
 * their next day, so it is the number of days completed before it, plus one.
 */
export function baselineDay(baseline: Pick<FairResult, 'day' | 'createdAt'>, completedAt: readonly string[]): number {
  if (baseline.day !== null) return baseline.day
  const taken = Date.parse(baseline.createdAt)
  return Math.min(CERT_DAY, completedAt.filter((at) => Date.parse(at) < taken).length + 1)
}

export function buildSnapshot(
  results: readonly FairResult[],
  completedAt: readonly string[],
  memory: { memory: number | null; retention: number | null },
): CertificateSnapshot {
  const baseline = results.find((r) => r.kind === 'baseline') ?? null
  const final = [...results].reverse().find((r) => r.kind === 'final' && (baseline === null || r.lang === baseline.lang)) ?? null
  return {
    reading:
      final === null
        ? null
        : {
            lang: final.lang,
            before: baseline === null ? null : { ...numbers(baseline), day: baselineDay(baseline, completedAt) },
            after: numbers(final),
          },
    memory: memory.memory === null && memory.retention === null ? null : memory,
  }
}

/** "+45%" when the number went up; null otherwise (only gains show a change). */
export function gainPercent(before: number, after: number): string | null {
  if (!(after > before)) return null
  const change = percentChange(before, after)
  return change === null || change <= 0 ? null : `+${change}%`
}

/** Comprehension gain in percentage points; null unless it went up. */
export function gainPoints(before: number, after: number): number | null {
  return after > before ? Math.round(after - before) : null
}

/** Completion date as a calendar date in India. */
export function completedOnIst(completedAtIso: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(completedAtIso))
}

/** "14 October 2026" in the certificate's language. */
export function formatCertDate(isoDate: string, htmlLang: string): string {
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number]
  return new Intl.DateTimeFormat(`${htmlLang}-IN-u-nu-latn`, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)))
}

export function verifyPath(code: string): string {
  return `/verify/${code}`
}
