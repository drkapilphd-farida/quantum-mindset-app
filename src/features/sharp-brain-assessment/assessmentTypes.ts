import type { DayThirtyWindow } from './assessmentScoring'

export type AssessmentStage = 'day1' | 'day30'

export type AssessmentRecord = {
  stage: AssessmentStage
  passageId: string
  wpm: number
  comprehensionPercent: number
  correctAnswers: number
  totalQuestions: number
  effectiveWpm: number
  attentionAccuracyPercent: number
  attentionMeanRtMs: number | null
  takenAt: string
}

/** Serializable (dates as ISO strings) for passing to client components. */
export type SerializedWindow =
  | { status: 'no-baseline' }
  | { status: 'locked'; programDay: number; unlocksOn: string }
  | { status: 'open' | 'late'; programDay: number }

export function serializeWindow(window: DayThirtyWindow): SerializedWindow {
  return window.status === 'locked' ? { ...window, unlocksOn: window.unlocksOn.toISOString() } : window
}

export type AssessmentState = {
  firstName: string | null
  day1: AssessmentRecord | null
  day30: AssessmentRecord | null
  /** True when the only Day 1 on record is the app-paced curriculum checkpoint (not comparable). */
  hasPacedDay1Only: boolean
  window: SerializedWindow
}
