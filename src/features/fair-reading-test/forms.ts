import { EN_FORMS } from './formsEn'
import { HI_FORMS } from './formsHi'

// Fair reading test (Phase 3, item 1): matched test passages ("forms").
// A/B are the Day 1 baseline and Day 30 final (counterbalanced per learner),
// C/D/E the Day 7/14/21 check-ins, R the reserve for a retake. Practice-again
// runs never use these, so they stay fresh.

export type FairLang = 'en' | 'hi'
export type FormId = 'A' | 'B' | 'C' | 'D' | 'E' | 'R'
export type QuestionKind = 'fact' | 'order' | 'main-idea' | 'inference'

export type FairQuestion = {
  kind: QuestionKind
  question: string
  options: readonly [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
}

export type FairForm = {
  id: FormId
  lang: FairLang
  title: string
  text: string
  questions: readonly FairQuestion[]
}

export const FAIR_FORMS: Record<FairLang, readonly FairForm[]> = { en: EN_FORMS, hi: HI_FORMS }

export function getForm(lang: FairLang, id: FormId): FairForm {
  const form = FAIR_FORMS[lang].find((f) => f.id === id)
  if (!form) throw new Error(`No ${lang} form ${id}`)
  return form
}

export type TestKind = 'baseline' | 'checkpoint' | 'final' | 'retake'

/** The checkpoint days of the 30-day plan and which kind of test each one is. */
export const CHECKPOINT_TEST_KIND: Readonly<Record<number, TestKind>> = { 1: 'baseline', 7: 'checkpoint', 14: 'checkpoint', 21: 'checkpoint', 30: 'final' }

const CHECK_IN_FORM: Readonly<Record<number, FormId>> = { 7: 'C', 14: 'D', 21: 'E' }

/**
 * Which form a learner reads on a checkpoint day. The baseline form (A or B)
 * is chosen at random once; the final is always the other one, so any small
 * difference between A and B averages out across learners.
 */
export function formForDay(day: number, baselineForm: 'A' | 'B' | null, rng: () => number = Math.random): FormId {
  if (day in CHECK_IN_FORM) return CHECK_IN_FORM[day]!
  if (day === 30) return baselineForm === 'A' ? 'B' : 'A'
  return baselineForm ?? (rng() < 0.5 ? 'A' : 'B')
}

export function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed === '' ? 0 : trimmed.split(/\s+/u).length
}
