'use server'

import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { countWords, readingProfile, speedBand, type ReadingProfileType, type ReadingTestStatus, type SpeedBand } from '@/features/reading-speed-test/scoring'
import { signTestToken, verifyTestToken } from '@/features/reading-speed-test/testToken'
import { countCorrect, findPassage, pickPassage, showQuestions, shuffledOrder, type ShownQuestion } from '@/features/reading-speed-test/quiz'
import { MEMORY_TEST_PASSAGES } from './passages'
import { MEMORY_TOTAL, RETENTION_TOTAL, scoreMemoryTest } from './scoring'

// Free Reading & Memory Test — every number in a result is computed here.
// Reading time = the server's clock between "Start" and "Done"; the 4
// questions are answered after the memory challenge and checked against the
// key in ./passages.ts. The memory score (X of 8) is counted in the browser
// and only kept within 0–8: it never decides whether a result is valid.

type Fail = { ok: false; error: string }

const START_RATE_LIMIT = { max: 30, windowMs: 60_000 }
const GENERIC_ERROR = 'Something went wrong. Please try again.'
const TokenSchema = z.string().min(10).max(4000)

export async function startMemoryTest(
  input: unknown,
): Promise<{ ok: true; token: string; passage: { id: string; title: string; text: string; wordCount: number } } | Fail> {
  const parsed = z.object({ lang: z.enum(['en', 'hi']), exclude: z.array(z.string().max(60)).max(20) }).safeParse(input)
  if (!parsed.success) return { ok: false, error: GENERIC_ERROR }
  const ip = await getClientIp()
  if (!checkRateLimit(`memory-test-start:${ip}`, START_RATE_LIMIT).allowed) {
    return { ok: false, error: 'Too many attempts. Please wait a minute and try again.' }
  }
  const passage = pickPassage(MEMORY_TEST_PASSAGES, parsed.data.lang, parsed.data.exclude)
  const perm = passage.questions.map(() => shuffledOrder())
  const token = signTestToken({ kind: 'rm-reading', pid: passage.id, t0: Date.now(), perm })
  return { ok: true, token, passage: { id: passage.id, title: passage.title, text: passage.text, wordCount: countWords(passage.text) } }
}

/** "Done reading": stops the clock. The questions are sent now but shown only after the memory challenge. */
export async function finishMemoryReading(input: unknown): Promise<{ ok: true; token: string; questions: ShownQuestion[] } | Fail> {
  const parsed = z.object({ token: TokenSchema }).safeParse(input)
  if (!parsed.success) return { ok: false, error: GENERIC_ERROR }
  try {
    const reading = verifyTestToken(parsed.data.token, 'rm-reading')
    const passage = findPassage(MEMORY_TEST_PASSAGES, reading.pid)
    const token = signTestToken({ kind: 'rm-questions', pid: passage.id, readMs: Date.now() - reading.t0, perm: reading.perm })
    return { ok: true, token, questions: showQuestions(passage, reading.perm) }
  } catch {
    return { ok: false, error: GENERIC_ERROR }
  }
}

export type MemoryTestResult = {
  status: ReadingTestStatus
  wpm: number
  effectiveWpm: number
  comprehensionPercent: number
  retention: number
  retentionTotal: number
  memory: number
  memoryTotal: number
  /** Valid results only. */
  profile: ReadingProfileType | null
  band: SpeedBand | null
}

export async function submitMemoryTest(input: unknown): Promise<{ ok: true; result: MemoryTestResult; resultToken: string } | Fail> {
  const parsed = z
    .object({ token: TokenSchema, answers: z.array(z.number().int().min(-1).max(3)).max(RETENTION_TOTAL), memory: z.number().int().min(0).max(MEMORY_TOTAL) })
    .safeParse(input)
  if (!parsed.success) return { ok: false, error: GENERIC_ERROR }
  try {
    const quiz = verifyTestToken(parsed.data.token, 'rm-questions')
    const passage = findPassage(MEMORY_TEST_PASSAGES, quiz.pid)
    const retention = countCorrect(passage, quiz.perm, parsed.data.answers)
    const score = scoreMemoryTest({ wordCount: countWords(passage.text), elapsedMs: quiz.readMs, retention, memory: parsed.data.memory })
    const valid = score.status === 'valid'
    // Same result token as the reading test, so the WhatsApp lead, the ₹1,000
    // offer and the 60-second Brain Boost work unchanged.
    const resultToken = signTestToken({
      kind: 'result',
      pid: passage.id,
      lang: passage.lang,
      wpm: score.wpm,
      comp: score.comprehensionPercent,
      eff: score.effectiveWpm,
      status: score.status,
      rt: score.retention,
      mem: score.memory,
    })
    return {
      ok: true,
      resultToken,
      result: {
        status: score.status,
        wpm: score.wpm,
        effectiveWpm: score.effectiveWpm,
        comprehensionPercent: score.comprehensionPercent,
        retention: score.retention,
        retentionTotal: RETENTION_TOTAL,
        memory: score.memory,
        memoryTotal: MEMORY_TOTAL,
        profile: valid ? readingProfile(score.wpm, score.comprehensionPercent) : null,
        band: valid ? speedBand(score.effectiveWpm) : null,
      },
    }
  } catch {
    return { ok: false, error: GENERIC_ERROR }
  }
}
