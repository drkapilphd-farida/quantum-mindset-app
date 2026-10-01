'use server'

import { randomInt } from 'node:crypto'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { MEASURED_PASSAGES, PRACTICE_PASSAGES, type TestLang, type TestPassage } from './passages'
import { countWords, practiceStartingPace, scoreReadingTest, type ReadingTestStatus } from './scoring'
import { signTestToken, verifyTestToken } from './testToken'
import { activeOffer, discountsChargeable, getOrCreateTestOffer, pricingSnapshot, resolveNow } from '@/features/sharp-brain-enrol/server'
import type { PricingSnapshot } from '@/features/sharp-brain-enrol/server'

// Free Reading Speed Test — every number in a result is computed here.
// Reading time = the server's own clock between "Start" and "Done"; answers
// are checked against the key in passages.ts, which never reaches the
// browser; options are shuffled per attempt and the shuffle travels inside
// the signed token.

type Fail = { ok: false; error: string }
type ShownQuestion = { question: string; options: string[] }

const START_RATE_LIMIT = { max: 30, windowMs: 60_000 }
const SAVE_RATE_LIMIT = { max: 5, windowMs: 60_000 }
const GENERIC_ERROR = 'Something went wrong. Please try again.'

const LangSchema = z.enum(['en', 'hi'])
const TokenSchema = z.string().min(10).max(4000)

function shuffledOrder(): number[] {
  const order = [0, 1, 2, 3]
  for (let i = order.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[order[i], order[j]] = [order[j]!, order[i]!]
  }
  return order
}

function showQuestions(passage: TestPassage, perm: number[][]): ShownQuestion[] {
  return passage.questions.map((q, i) => ({ question: q.question, options: perm[i]!.map((original) => q.options[original]!) }))
}

function countCorrect(passage: TestPassage, perm: number[][], answers: readonly number[]): number {
  return passage.questions.reduce((sum, q, i) => (perm[i]?.[answers[i] ?? -1] === q.correctIndex ? sum + 1 : sum), 0)
}

function findPassage(pool: readonly TestPassage[], id: string): TestPassage {
  const passage = pool.find((p) => p.id === id)
  if (passage === undefined) throw new Error('unknown passage')
  return passage
}

function pickPassage(pool: readonly TestPassage[], lang: TestLang, exclude: readonly string[]): TestPassage {
  const inLang = pool.filter((p) => p.lang === lang)
  const fresh = inLang.filter((p) => !exclude.includes(p.id))
  // Every passage seen already: still never repeat the most recent one.
  const candidates = fresh.length > 0 ? fresh : inLang.filter((p) => p.id !== exclude.at(-1))
  return candidates[randomInt(candidates.length)]!
}

// ── Step 1: measured test ────────────────────────────────────────────────

const StartSchema = z.object({ lang: LangSchema, exclude: z.array(z.string().max(60)).max(20) })

export async function startReadingTest(
  input: unknown,
): Promise<{ ok: true; token: string; passage: { id: string; title: string; text: string; wordCount: number } } | Fail> {
  const parsed = StartSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: GENERIC_ERROR }
  const ip = await getClientIp()
  if (!checkRateLimit(`speed-test-start:${ip}`, START_RATE_LIMIT).allowed) {
    return { ok: false, error: 'Too many attempts. Please wait a minute and try again.' }
  }

  const passage = pickPassage(MEASURED_PASSAGES, parsed.data.lang, parsed.data.exclude)
  const perm = passage.questions.map(() => shuffledOrder())
  const token = signTestToken({ kind: 'reading', pid: passage.id, t0: Date.now(), perm })
  return { ok: true, token, passage: { id: passage.id, title: passage.title, text: passage.text, wordCount: countWords(passage.text) } }
}

export async function finishReading(input: unknown): Promise<{ ok: true; token: string; questions: ShownQuestion[] } | Fail> {
  const parsed = z.object({ token: TokenSchema }).safeParse(input)
  if (!parsed.success) return { ok: false, error: GENERIC_ERROR }
  try {
    const reading = verifyTestToken(parsed.data.token, 'reading')
    const passage = findPassage(MEASURED_PASSAGES, reading.pid)
    const readMs = Date.now() - reading.t0
    const token = signTestToken({ kind: 'questions', pid: passage.id, readMs, perm: reading.perm })
    return { ok: true, token, questions: showQuestions(passage, reading.perm) }
  } catch {
    return { ok: false, error: GENERIC_ERROR }
  }
}

const AnswersSchema = z.object({ token: TokenSchema, answers: z.array(z.number().int().min(0).max(3)).max(5) })

export type ReadingTestResult = {
  status: ReadingTestStatus
  wpm: number
  comprehensionPercent: number
  effectiveWpm: number
  correct: number
  total: number
}

export async function submitReadingAnswers(input: unknown): Promise<{ ok: true; result: ReadingTestResult; resultToken: string } | Fail> {
  const parsed = AnswersSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: GENERIC_ERROR }
  try {
    const quiz = verifyTestToken(parsed.data.token, 'questions')
    const passage = findPassage(MEASURED_PASSAGES, quiz.pid)
    const total = passage.questions.length
    const correct = countCorrect(passage, quiz.perm, parsed.data.answers)
    const score = scoreReadingTest({ wordCount: countWords(passage.text), elapsedMs: quiz.readMs, correct, total })
    const resultToken = signTestToken({
      kind: 'result',
      pid: passage.id,
      lang: passage.lang,
      wpm: score.wpm,
      comp: score.comprehensionPercent,
      eff: score.effectiveWpm,
      status: score.status,
    })
    return { ok: true, result: { ...score, correct, total }, resultToken }
  } catch {
    return { ok: false, error: GENERIC_ERROR }
  }
}

// ── Step 2: app practice demo (RSVP) — only after a valid Step 1 ────────

export async function startPracticeDemo(
  input: unknown,
): Promise<{ ok: true; token: string; paceWpm: number; words: string[]; questions: ShownQuestion[] } | Fail> {
  const parsed = z.object({ resultToken: TokenSchema }).safeParse(input)
  if (!parsed.success) return { ok: false, error: GENERIC_ERROR }
  try {
    const result = verifyTestToken(parsed.data.resultToken, 'result')
    if (result.status !== 'valid') return { ok: false, error: GENERIC_ERROR }
    const passage = pickPassage(PRACTICE_PASSAGES, result.lang, [])
    const perm = passage.questions.map(() => shuffledOrder())
    const paceWpm = practiceStartingPace(result.wpm)
    const token = signTestToken({ kind: 'practice', pid: passage.id, pace: paceWpm, perm })
    return { ok: true, token, paceWpm, words: passage.text.trim().split(/\s+/u), questions: showQuestions(passage, perm) }
  } catch {
    return { ok: false, error: GENERIC_ERROR }
  }
}

export async function submitPracticeAnswers(input: unknown): Promise<{ ok: true; paceWpm: number; comprehensionPercent: number } | Fail> {
  const parsed = z.object({ token: TokenSchema, answers: z.array(z.number().int().min(0).max(3)).max(3) }).safeParse(input)
  if (!parsed.success) return { ok: false, error: GENERIC_ERROR }
  try {
    const practice = verifyTestToken(parsed.data.token, 'practice')
    const passage = findPassage(PRACTICE_PASSAGES, practice.pid)
    const correct = countCorrect(passage, practice.perm, parsed.data.answers)
    return { ok: true, paceWpm: practice.pace, comprehensionPercent: Math.round((correct / passage.questions.length) * 100) }
  } catch {
    return { ok: false, error: GENERIC_ERROR }
  }
}

// ── Optional: leave a WhatsApp number to receive the result ─────────────

const SaveSchema = z.object({
  resultToken: TokenSchema,
  // Digits only after stripping spaces, dashes and a leading +; 10–15 digits.
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, '').replace(/^\+/, ''))
    .pipe(z.string().regex(/^\d{10,15}$/)),
  // Optional; blank means "not given".
  firstName: z
    .string()
    .max(60)
    .optional()
    .transform((v) => (v === undefined || v.trim() === '' ? null : v.trim())),
  // Preview only: simulate the clock (ignored on production, see resolveNow).
  simulateNow: z.string().max(40).optional(),
})

/**
 * The Reading Speed Test offer, as the result screen shows it. `pricing`
 * carries the server clock and the prices with the offer applied, so the
 * countdown is the same on every device.
 */
export type SpeedTestOffer = { id: string; expiresAtMs: number; pricing: PricingSnapshot }

export async function saveSpeedTestResult(input: unknown): Promise<{ ok: true; offer: SpeedTestOffer | null } | Fail> {
  const parsed = SaveSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Enter a valid WhatsApp number.' }
  const ip = await getClientIp()
  if (!checkRateLimit(`speed-test-save:${ip}`, SAVE_RATE_LIMIT).allowed) {
    return { ok: false, error: 'Too many attempts. Please wait a minute and try again.' }
  }
  try {
    const result = verifyTestToken(parsed.data.resultToken, 'result')
    // A 10-digit number is an Indian mobile — store it with the country code.
    const phone = parsed.data.phone.length === 10 ? `91${parsed.data.phone}` : parsed.data.phone
    const { data: saved, error } = await createServiceClient()
      .from('speed_test_results')
      .insert({
        whatsapp_number: phone,
        first_name: parsed.data.firstName,
        passage_id: result.pid,
        lang: result.lang,
        wpm: result.wpm,
        comprehension_percent: result.comp,
        effective_wpm: result.eff,
        status: result.status,
      })
      .select('id')
      .single()
    if (error) {
      logger.error('saveSpeedTestResult: insert failed', { code: error.code })
      return { ok: false, error: GENERIC_ERROR }
    }
    // ₹1,000 off for 48 hours — only after a VALID test, one per number ever.
    if (result.status !== 'valid' || !discountsChargeable()) return { ok: true, offer: null }
    const now = resolveNow(parsed.data.simulateNow)
    const offer = activeOffer(await getOrCreateTestOffer(phone, saved.id), now)
    if (offer === null) return { ok: true, offer: null }
    return { ok: true, offer: { id: offer.id, expiresAtMs: offer.expiresAtMs, pricing: pricingSnapshot(now, offer.expiresAtMs) } }
  } catch {
    return { ok: false, error: GENERIC_ERROR }
  }
}
