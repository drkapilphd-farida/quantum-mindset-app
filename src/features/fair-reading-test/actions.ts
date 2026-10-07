'use server'

import { randomInt } from 'node:crypto'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { CHECKPOINT_TEST_KIND, countWords, formForDay, getForm, type FairLang, type FormId, type TestKind } from './forms'
import { signFairToken, verifyFairToken } from './fairToken'
import { countCorrect, scoreFairTest, type FairResult } from './fairTest'

type Fail = { ok: false; error: 'unauthenticated' | 'invalid' | 'retake-used' | 'db' }
export type ShownQuestion = { question: string; options: string[] }

const TokenSchema = z.string().min(10).max(4000)

async function currentUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

function shuffledOrder(): number[] {
  const order = [0, 1, 2, 3]
  for (let i = order.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[order[i], order[j]] = [order[j]!, order[i]!]
  }
  return order
}

type Row = { kind: string; curriculum_day: number | null; form_id: string; lang: string; wpm: number; comprehension_percent: number; effective_wpm: number; status: string; created_at: string }

function toResult(r: Row): FairResult {
  return {
    kind: r.kind as TestKind,
    day: r.curriculum_day,
    form: r.form_id as FormId,
    lang: r.lang as FairLang,
    wpm: r.wpm,
    comprehensionPercent: r.comprehension_percent,
    effectiveWpm: r.effective_wpm,
    status: r.status as FairResult['status'],
    createdAt: r.created_at,
  }
}

/** The signed-in learner's fair test results, oldest first. */
export async function getFairResults(): Promise<FairResult[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('reading_tests')
    .select('kind, curriculum_day, form_id, lang, wpm, comprehension_percent, effective_wpm, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
  if (error) {
    logger.error('getFairResults: read failed', { code: error.code })
    return []
  }
  return (data ?? []).map(toResult)
}

const StartSchema = z.object({
  /** The checkpoint day (1, 7, 14, 21, 30), or null for the one-time baseline of an existing learner. */
  day: z.union([z.literal(1), z.literal(7), z.literal(14), z.literal(21), z.literal(30)]).nullable(),
  /** Used only for the first (baseline) test; later tests stay in the baseline's language. */
  lang: z.enum(['en', 'hi']),
  /** After a too-fast reading: read the reserve passage instead. */
  retake: z.boolean(),
})

/** Starts a fair test: picks the matched passage and starts the server's clock. */
export async function startFairTest(
  input: unknown,
): Promise<{ ok: true; token: string; passage: { title: string; text: string; wordCount: number; lang: FairLang; form: FormId } } | Fail> {
  const parsed = StartSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await currentUserId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }

  const results = await getFairResults()
  const baseline = results.find((r) => r.kind === 'baseline') ?? null
  const lang: FairLang = baseline?.lang ?? parsed.data.lang
  const test: TestKind = parsed.data.day === null ? 'baseline' : CHECKPOINT_TEST_KIND[parsed.data.day]!
  const baselineForm = baseline && (baseline.form === 'A' || baseline.form === 'B') ? baseline.form : null

  let form: FormId
  if (parsed.data.retake) {
    if (results.some((r) => r.form === 'R' && r.lang === lang)) return { ok: false, error: 'retake-used' }
    form = 'R'
  } else {
    form = formForDay(parsed.data.day ?? 1, baselineForm)
  }

  const passage = getForm(lang, form)
  const perm = passage.questions.map(() => shuffledOrder())
  const token = signFairToken({ kind: 'reading', uid, lang, form, test, day: parsed.data.day, t0: Date.now(), perm })
  return { ok: true, token, passage: { title: passage.title, text: passage.text, wordCount: countWords(passage.text), lang, form } }
}

/** The learner tapped Done: the server stops the clock and sends the questions (never the answers). */
export async function finishFairReading(input: unknown): Promise<{ ok: true; token: string; questions: ShownQuestion[] } | Fail> {
  const parsed = z.object({ token: TokenSchema }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await currentUserId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  try {
    const reading = verifyFairToken(parsed.data.token, 'reading', uid)
    const passage = getForm(reading.lang, reading.form)
    const readMs = Date.now() - reading.t0
    const token = signFairToken({ kind: 'questions', uid, lang: reading.lang, form: reading.form, test: reading.test, day: reading.day, readMs, perm: reading.perm })
    return { ok: true, token, questions: passage.questions.map((q, i) => ({ question: q.question, options: reading.perm[i]!.map((o) => q.options[o]!) })) }
  } catch {
    return { ok: false, error: 'invalid' }
  }
}

export type FairSubmitResult =
  | { ok: true; tooFast: true }
  | { ok: true; tooFast: false; result: FairResult; correct: number; total: number }
  | Fail

/** Scores the answers on the server and saves the result (a too-fast reading is not saved: retake with the reserve passage). */
export async function submitFairAnswers(input: unknown): Promise<FairSubmitResult> {
  const parsed = z.object({ token: TokenSchema, answers: z.array(z.number().int().min(0).max(3)).length(5) }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await currentUserId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  try {
    const quiz = verifyFairToken(parsed.data.token, 'questions', uid)
    const passage = getForm(quiz.lang, quiz.form)
    const correct = countCorrect(passage, quiz.perm, parsed.data.answers)
    const score = scoreFairTest(passage, quiz.readMs, correct)
    if (score.status === 'too_fast') return { ok: true, tooFast: true }

    const service = createServiceClient()
    const { data, error } = await service
      .from('reading_tests')
      .insert({
        user_id: uid,
        kind: quiz.test,
        curriculum_day: quiz.day,
        form_id: quiz.form,
        lang: quiz.lang,
        word_count: countWords(passage.text),
        elapsed_ms: quiz.readMs,
        wpm: score.wpm,
        comprehension_percent: score.comprehensionPercent,
        effective_wpm: score.effectiveWpm,
        status: score.status,
        answers: parsed.data.answers,
      })
      .select('kind, curriculum_day, form_id, lang, wpm, comprehension_percent, effective_wpm, status, created_at')
      .single()
    if (error || !data) {
      logger.error('submitFairAnswers: insert failed', { code: error?.code })
      return { ok: false, error: 'db' }
    }
    return { ok: true, tooFast: false, result: toResult(data), correct, total: passage.questions.length }
  } catch {
    return { ok: false, error: 'invalid' }
  }
}

/** Everything the test screens need: the learner's results and first name (for the share card, exactly as stored). */
export async function getFairTestContext(): Promise<{ results: FairResult[]; firstName: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { results: [], firstName: '' }
  const [results, profile] = await Promise.all([getFairResults(), supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle()])
  const fullName = profile.data?.full_name?.trim() ?? ''
  return { results, firstName: fullName.split(/\s+/)[0] ?? '' }
}
