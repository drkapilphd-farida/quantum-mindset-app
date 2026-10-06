import type { MessageKey, Translator } from './translate'

// Translated names for the 30-day curriculum's days and phases (the
// curriculum logic itself still lives in curriculumDatabase.ts; only the
// visible words come from here).

export function dayTitle(t: Translator, day: number): string {
  return t(`curriculumPlan.days.d${day}.title` as MessageKey)
}

export function dayFocus(t: Translator, day: number): string {
  return t(`curriculumPlan.days.d${day}.focus` as MessageKey)
}

export function phaseTitle(t: Translator, phaseId: number): string {
  return t(`curriculumPlan.phases.p${phaseId}.title` as MessageKey)
}

export function phaseDescription(t: Translator, phaseId: number): string {
  return t(`curriculumPlan.phases.p${phaseId}.description` as MessageKey)
}

const CATEGORY_KEYS: Record<string, MessageKey> = {
  'brain-gym': 'curriculum.categories.brainGym',
  'right-brain-intuition': 'curriculum.categories.visualFocusMemory',
  visualization: 'curriculum.categories.visualization',
  'reading-intelligence': 'curriculum.categories.readingIntelligence',
}

/** Translated name of a curriculum exercise category. */
export function categoryLabel(t: Translator, category: string): string {
  const key = CATEGORY_KEYS[category]
  return key === undefined ? category : t(key)
}

/** Translated name of a curriculum exercise (falls back to its English catalog title). */
export function exerciseTitle(t: Translator, exercise: { id: string; title: string }): string {
  return t(`curriculumPlan.exercises.${exercise.id}` as MessageKey) || exercise.title
}
