import { createClient } from '@/lib/supabase/server'
import { getDayThirtyWindow } from '../assessmentScoring'
import { serializeWindow, type AssessmentRecord, type AssessmentStage, type AssessmentState } from '../assessmentTypes'

type Row = {
  stage: string
  passage_id: string
  wpm: number
  comprehension_percent: number
  correct_answers: number
  total_questions: number
  effective_wpm: number
  attention_accuracy_percent: number
  attention_mean_rt_ms: number | null
  taken_at: string
}

function toRecord(row: Row): AssessmentRecord {
  return {
    stage: row.stage as AssessmentStage,
    passageId: row.passage_id,
    wpm: row.wpm,
    comprehensionPercent: row.comprehension_percent,
    correctAnswers: row.correct_answers,
    totalQuestions: row.total_questions,
    effectiveWpm: row.effective_wpm,
    attentionAccuracyPercent: row.attention_accuracy_percent,
    attentionMeanRtMs: row.attention_mean_rt_ms,
    takenAt: row.taken_at,
  }
}

export async function getAssessmentState(userId: string, now: Date = new Date()): Promise<AssessmentState> {
  const supabase = await createClient()
  const [assessments, completions, profile] = await Promise.all([
    supabase
      .from('program_assessments')
      .select('stage, passage_id, wpm, comprehension_percent, correct_answers, total_questions, effective_wpm, attention_accuracy_percent, attention_mean_rt_ms, taken_at')
      .eq('user_id', userId),
    supabase.from('curriculum_day_completions').select('day, completed_at').eq('user_id', userId).in('day', [1, 29]),
    supabase.from('profiles').select('full_name').eq('id', userId).maybeSingle(),
  ])

  const rows = (assessments.data ?? []) as Row[]
  const day1Row = rows.find((row) => row.stage === 'day1')
  const day30Row = rows.find((row) => row.stage === 'day30')
  const day1 = day1Row ? toRecord(day1Row) : null
  const day30 = day30Row ? toRecord(day30Row) : null
  const curriculumDay1 = (completions.data ?? []).find((c) => c.day === 1)
  const day29 = (completions.data ?? []).find((c) => c.day === 29)

  const window = getDayThirtyWindow(day1 ? new Date(day1.takenAt) : null, day29 ? new Date(day29.completed_at) : null, now)
  const firstName = profile.data?.full_name?.trim().split(/\s+/)[0] ?? null

  return {
    firstName: firstName === '' ? null : firstName,
    day1,
    day30,
    hasPacedDay1Only: day1 === null && curriculumDay1 !== undefined,
    window: serializeWindow(window),
  }
}
