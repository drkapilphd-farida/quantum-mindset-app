import { z } from 'zod'

// Onboarding answers (Phase 8, Item 10). Stored on profiles.learner_role
// and profiles.learning_focus; ids must match the migration's CHECKs.

export const LEARNER_ROLES = ['parent', 'student', 'professional'] as const
export const LEARNING_FOCUSES = ['focus', 'memory', 'exam', 'reading'] as const

export type LearnerRole = (typeof LEARNER_ROLES)[number]
export type LearningFocus = (typeof LEARNING_FOCUSES)[number]

export const LearnerRoleSchema = z.enum(LEARNER_ROLES)
export const LearningFocusSchema = z.enum(LEARNING_FOCUSES)

type Bilingual = { en: string; hi: string }

export const ROLE_LABELS: Record<LearnerRole, Bilingual> = {
  parent: { en: 'Parent setting up for a child', hi: 'बच्चे के लिए सेट-अप कर रहे अभिभावक' },
  student: { en: 'Student', hi: 'विद्यार्थी' },
  professional: { en: 'Working professional', hi: 'कामकाजी पेशेवर' },
}

export const FOCUS_LABELS: Record<LearningFocus, Bilingual> = {
  focus: { en: 'Focus', hi: 'फोकस' },
  memory: { en: 'Memory', hi: 'मेमोरी' },
  exam: { en: 'Exam preparation', hi: 'परीक्षा की तैयारी' },
  reading: { en: 'Reading', hi: 'रीडिंग' },
}

export function parseLearnerRole(value: string | null | undefined): LearnerRole | null {
  const parsed = LearnerRoleSchema.safeParse(value)
  return parsed.success ? parsed.data : null
}

export function parseLearningFocus(value: string | null | undefined): LearningFocus | null {
  const parsed = LearningFocusSchema.safeParse(value)
  return parsed.success ? parsed.data : null
}
