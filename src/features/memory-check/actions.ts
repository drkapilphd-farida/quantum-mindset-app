'use server'

import { randomInt } from 'node:crypto'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { getCurriculumDayCompletions } from '@/features/thirty-day-curriculum/actions/getCurriculumDayCompletions'
import { faceName, MEMORY_FACES, MEMORY_WORDS, wordText, type FaceSpec, type MemoryForm, type MemoryLang } from './content'
import {
  currentDay,
  formFor,
  MEMORY_CHECK_EXERCISE_ID,
  memoryCheckStatus,
  memoryScore,
  newNumber,
  scoreDigits,
  scoreFaces,
  scoreWords,
  shuffle,
  type MemoryCheckResult,
  type MemoryCheckStatus,
  type MemoryPhase,
} from './memoryCheck'
import { signMemoryToken, verifyMemoryToken } from './memoryToken'

// The memory check (Day 1 and Day 30): 20 words, a 10-digit number and 5
// name–face pairs. The server picks the material, keeps the answer key in a
// signed token and scores the answers, so a result can't be made up.

type Fail = { ok: false; error: 'unauthenticated' | 'invalid' | 'closed' | 'db' }

async function currentUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

type Row = { curriculum_day: number | null; score: number; details: unknown; played_at: string }

function toResult(row: Row): MemoryCheckResult | null {
  const d = (row.details ?? {}) as Record<string, unknown>
  const num = (k: string): number => (typeof d[k] === 'number' ? (d[k] as number) : 0)
  if ((d.phase !== 'baseline' && d.phase !== 'final') || (d.form !== 'A' && d.form !== 'B') || (d.lang !== 'en' && d.lang !== 'hi')) return null
  return {
    phase: d.phase,
    form: d.form,
    lang: d.lang,
    day: row.curriculum_day,
    score: row.score,
    words: num('words'),
    wordsFound: num('wordsFound'),
    wrongTaps: num('wrongTaps'),
    digits: num('digits'),
    faces: num('faces'),
    takenAt: row.played_at,
  }
}

/** The signed-in learner's memory checks, oldest first. */
export async function getMemoryCheckResults(): Promise<MemoryCheckResult[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('exercise_results')
    .select('curriculum_day, score, details, played_at')
    .eq('user_id', user.id)
    .eq('exercise_id', MEMORY_CHECK_EXERCISE_ID)
    .order('played_at', { ascending: true })
  if (error) {
    logger.error('getMemoryCheckResults: read failed', { code: error.code })
    return []
  }
  return (data ?? []).map(toResult).filter((r): r is MemoryCheckResult => r !== null)
}

/** Which checks are open now (start: Days 1–7; Day 30: after Day 29), and the results so far. */
export async function getMemoryCheckStatus(): Promise<MemoryCheckStatus> {
  const [completions, results] = await Promise.all([getCurriculumDayCompletions(), getMemoryCheckResults()])
  return memoryCheckStatus(
    completions.map((c) => c.day),
    results,
  )
}

export type ShownWord = { id: string; text: string }
export type ShownFace = { id: string; name: string; face: FaceSpec }
export type MemoryCheckMaterial = {
  token: string
  phase: MemoryPhase
  lang: MemoryLang
  /** Study order. */
  words: ShownWord[]
  number: string
  /** The 20 words + 20 unseen ones, mixed. */
  grid: ShownWord[]
  faces: ShownFace[]
  /** Faces in recall order (different from the study order). */
  recallOrder: string[]
  /** Name choices, in one mixed order. */
  names: { id: string; name: string }[]
}

/** Starts a check: picks the form for the phase, a new number and new orders. */
export async function startMemoryCheck(input: unknown): Promise<({ ok: true } & MemoryCheckMaterial) | Fail> {
  const parsed = z.object({ phase: z.enum(['baseline', 'final']), lang: z.enum(['en', 'hi']) }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await currentUserId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }

  const [completions, results] = await Promise.all([getCurriculumDayCompletions(), getMemoryCheckResults()])
  const completedDays = completions.map((c) => c.day)
  const status = memoryCheckStatus(completedDays, results)
  const { phase } = parsed.data
  if (phase === 'baseline' ? !status.baselineOpen : !status.finalOpen) return { ok: false, error: 'closed' }

  // Day 30 uses the starting check's language, so the two compare fairly.
  const lang: MemoryLang = phase === 'final' && status.baseline !== null ? status.baseline.lang : parsed.data.lang
  const form: MemoryForm = formFor(phase)
  const number = newNumber(randomInt)
  const words = MEMORY_WORDS[form]
  const faces = MEMORY_FACES[form]
  const shownFaces = shuffle(faces, randomInt)
  const token = signMemoryToken({ uid, phase, form, lang, day: currentDay(completedDays), number, t0: Date.now() })

  return {
    ok: true,
    token,
    phase,
    lang,
    words: shuffle(words.targets, randomInt).map((x) => ({ id: x.id, text: wordText(x, lang) })),
    number,
    grid: shuffle([...words.targets, ...words.unseen], randomInt).map((x) => ({ id: x.id, text: wordText(x, lang) })),
    faces: shownFaces.map((f) => ({ id: f.id, name: faceName(f, lang), face: f.face })),
    recallOrder: shuffle(
      shownFaces.map((f) => f.id),
      randomInt,
    ),
    names: shuffle(faces, randomInt).map((f) => ({ id: f.id, name: faceName(f, lang) })),
  }
}

const FinishSchema = z.object({
  token: z.string().min(10).max(2000),
  pickedWords: z.array(z.string().max(40)).max(40),
  typedNumber: z.string().regex(/^\d{0,10}$/),
  facePicks: z.record(z.string().max(40), z.string().max(40)),
})

/** Scores the answers on the server and saves the result (once per phase). */
export async function finishMemoryCheck(input: unknown): Promise<{ ok: true; result: MemoryCheckResult; baseline: MemoryCheckResult | null } | Fail> {
  const parsed = FinishSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await currentUserId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }

  let check
  try {
    check = verifyMemoryToken(parsed.data.token, uid)
  } catch {
    return { ok: false, error: 'invalid' }
  }

  const existing = await getMemoryCheckResults()
  if (existing.some((r) => r.phase === check.phase)) return { ok: false, error: 'closed' }

  const words = scoreWords(check.form, parsed.data.pickedWords)
  const digits = scoreDigits(check.number, parsed.data.typedNumber)
  const faces = scoreFaces(check.form, parsed.data.facePicks)
  const score = memoryScore({ words: words.words, digits, faces })

  const { data, error } = await createServiceClient()
    .from('exercise_results')
    .insert({
      user_id: uid,
      exercise_id: MEMORY_CHECK_EXERCISE_ID,
      curriculum_day: check.day,
      score,
      accuracy_percent: score,
      duration_ms: Math.min(86_400_000, Math.max(0, Date.now() - check.t0)),
      content_lang: check.lang,
      details: { phase: check.phase, form: check.form, lang: check.lang, ...words, digits, faces },
    })
    .select('curriculum_day, score, details, played_at')
    .single()
  const result = data ? toResult(data) : null
  if (error || result === null) {
    logger.error('finishMemoryCheck: insert failed', { code: error?.code })
    return { ok: false, error: 'db' }
  }
  return { ok: true, result, baseline: existing.find((r) => r.phase === 'baseline') ?? null }
}
