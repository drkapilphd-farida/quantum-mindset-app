import { scoreReadingTest, type ReadingTestScore } from '@/features/reading-speed-test/scoring'
import { countWords, type FairForm, type FairLang, type FormId, type TestKind } from './forms'

// Pure rules of the fair reading test (Phase 3, item 1).

/** One saved fair test result, as the app uses it. */
export type FairResult = {
  kind: TestKind
  day: number | null
  form: FormId
  lang: FairLang
  wpm: number
  comprehensionPercent: number
  effectiveWpm: number
  status: 'valid' | 'low_comprehension'
  createdAt: string
}

export function scoreFairTest(form: FairForm, readMs: number, correct: number): ReadingTestScore {
  return scoreReadingTest({ wordCount: countWords(form.text), elapsedMs: readMs, correct, total: form.questions.length })
}

/** Correct answers, given the per-question option order shown to the learner. */
export function countCorrect(form: FairForm, perm: readonly (readonly number[])[], answers: readonly number[]): number {
  return form.questions.reduce((sum, q, i) => (perm[i]?.[answers[i] ?? -1] === q.correctIndex ? sum + 1 : sum), 0)
}

/** % change from before to after, rounded; null when there is no "before". */
export function percentChange(before: number, after: number): number | null {
  if (!Number.isFinite(before) || before <= 0) return null
  return Math.round(((after - before) / before) * 100)
}

/**
 * Whether a learner still needs the one-time fair baseline: they have
 * started the 30-day plan (Day 1 done, on the old flashed-word check-in) but
 * have no fair baseline yet. New learners take it on Day 1 instead.
 */
export function needsOneTimeBaseline(completedDays: readonly number[], results: readonly Pick<FairResult, 'kind'>[]): boolean {
  return completedDays.includes(1) && !results.some((r) => r.kind === 'baseline')
}

/** The before/after pair for the report and the certificate. */
export function beforeAfter(results: readonly FairResult[]): { before: FairResult; after: FairResult | null } | null {
  const baseline = results.find((r) => r.kind === 'baseline')
  if (!baseline) return null
  const final = [...results].reverse().find((r) => r.kind === 'final' && r.lang === baseline.lang) ?? null
  return { before: baseline, after: final }
}
