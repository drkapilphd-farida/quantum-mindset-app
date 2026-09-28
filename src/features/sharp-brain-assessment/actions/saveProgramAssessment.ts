'use server'

import { z } from 'zod'
import { appFeatures } from '@/config/site.config'
import { createClient } from '@/lib/supabase/server'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { countWords, getAssessmentPassage, passageForStage } from '../assessmentPassages'
import {
  ATTENTION_NO_GO_TRIALS,
  ATTENTION_RESPONSE_WINDOW_MS,
  ATTENTION_TRIALS,
  computeEffectiveWpm,
  computeWpm,
  getDayThirtyWindow,
  isPlausibleWpm,
  scoreComprehension,
  summarizeAttention,
} from '../assessmentScoring'

// Saves a Day 1 or Day 30 assessment (Phase 8, Item 11). The client sends
// only raw inputs — reading time, chosen answers, attention trials — and
// every score is recomputed here. Rules enforced on the server:
// - Day 1 can be retaken (a new baseline) only while there is no Day 30.
// - Day 30 needs a Day 1, an open window, and can be taken once.
// - Each stage must use its assigned passage (Day 30 = the other form).

const SaveSchema = z.object({
  stage: z.enum(['day1', 'day30']),
  passageId: z.string(),
  readingMs: z.number().int().min(1000).max(60 * 60 * 1000),
  answers: z.array(z.number().int().min(0).max(2)),
  attentionTrials: z
    .array(
      z.object({
        go: z.boolean(),
        responded: z.boolean(),
        rtMs: z.number().int().min(0).max(ATTENTION_RESPONSE_WINDOW_MS).nullable(),
      }),
    )
    .length(ATTENTION_TRIALS),
})

export type SaveAssessmentResult =
  | { ok: true }
  | {
      ok: false
      reason:
        | 'disabled'
        | 'not_authenticated'
        | 'no_access'
        | 'invalid_input'
        | 'implausible_timing'
        | 'day30_done'
        | 'no_day1'
        | 'not_open'
        | 'wrong_passage'
        | 'save_failed'
    }

export async function saveProgramAssessment(input: unknown): Promise<SaveAssessmentResult> {
  if (!appFeatures.dayThirtyComparison) return { ok: false, reason: 'disabled' }

  const parsed = SaveSchema.safeParse(input)
  if (!parsed.success) return { ok: false, reason: 'invalid_input' }
  const { stage, passageId, readingMs, answers, attentionTrials } = parsed.data

  const noGoCount = attentionTrials.filter((trial) => !trial.go).length
  const inconsistent = attentionTrials.some((trial) => trial.responded !== (trial.rtMs !== null))
  if (noGoCount !== ATTENTION_NO_GO_TRIALS || inconsistent) return { ok: false, reason: 'invalid_input' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, reason: 'not_authenticated' }
  if (!(await hasQuantumSpeedReadingProAccess())) return { ok: false, reason: 'no_access' }

  const { data: existing } = await supabase.from('program_assessments').select('stage, passage_id, taken_at').eq('user_id', user.id)
  const day1 = existing?.find((row) => row.stage === 'day1') ?? null
  const day30 = existing?.find((row) => row.stage === 'day30') ?? null

  if (day30 !== null) return { ok: false, reason: 'day30_done' }

  if (stage === 'day30') {
    if (day1 === null) return { ok: false, reason: 'no_day1' }
    const { data: day29 } = await supabase
      .from('curriculum_day_completions')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('day', 29)
      .maybeSingle()
    const window = getDayThirtyWindow(new Date(day1.taken_at), day29 ? new Date(day29.completed_at) : null, new Date())
    if (window.status !== 'open' && window.status !== 'late') return { ok: false, reason: 'not_open' }
  }

  const assigned = passageForStage(stage, day1?.passage_id ?? null)
  const passage = getAssessmentPassage(passageId)
  if (passage === null || passage.id !== assigned.id) return { ok: false, reason: 'wrong_passage' }
  if (answers.length !== passage.questions.length) return { ok: false, reason: 'invalid_input' }

  const wordCount = countWords(passage)
  const wpm = computeWpm(wordCount, readingMs)
  if (!isPlausibleWpm(wpm)) return { ok: false, reason: 'implausible_timing' }

  const comprehension = scoreComprehension(
    answers,
    passage.questions.map((question) => question.correctIndex),
  )
  const attention = summarizeAttention(attentionTrials)

  const { error } = await supabase.from('program_assessments').upsert(
    {
      user_id: user.id,
      stage,
      passage_id: passage.id,
      word_count: wordCount,
      reading_ms: readingMs,
      wpm,
      correct_answers: comprehension.correct,
      total_questions: comprehension.total,
      comprehension_percent: comprehension.percent,
      effective_wpm: computeEffectiveWpm(wpm, comprehension.percent),
      attention_trials: attention.trials,
      attention_accuracy_percent: attention.accuracyPercent,
      attention_mean_rt_ms: attention.meanRtMs,
      taken_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,stage' },
  )

  return error ? { ok: false, reason: 'save_failed' } : { ok: true }
}
