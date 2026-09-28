import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ASSESSMENT_PASSAGES, countWords } from '../assessmentPassages'
import { generateAttentionSequence, type AttentionTrial } from '../assessmentScoring'

type Existing = { stage: string; passage_id: string; taken_at: string }

function makeClient(existing: Existing[] = [], day29: { completed_at: string } | null = null): {
  upserts: Record<string, unknown>[]
  client: { auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }; from: (table: string) => unknown }
} {
  const upserts: Record<string, unknown>[] = []
  return {
    upserts,
    client: {
      auth: { getUser: () => Promise.resolve({ data: { user: { id: 'user-1' } } }) },
      from: (table: string) => {
        if (table === 'program_assessments') {
          return {
            select: () => ({ eq: () => Promise.resolve({ data: existing, error: null }) }),
            upsert: (values: Record<string, unknown>) => {
              upserts.push(values)
              return Promise.resolve({ error: null })
            },
          }
        }
        if (table === 'curriculum_day_completions') {
          return { select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: day29 }) }) }) }) }
        }
        throw new Error(`Unexpected table ${table}`)
      },
    },
  }
}

async function importAction(client: ReturnType<typeof makeClient>['client'], enabled = true): Promise<typeof import('./saveProgramAssessment')> {
  vi.resetModules()
  vi.doMock('@/lib/supabase/server', () => ({ createClient: () => Promise.resolve(client) }))
  vi.doMock('@/lib/subscription/hasQuantumSpeedReadingProAccess', () => ({ hasQuantumSpeedReadingProAccess: () => Promise.resolve(true) }))
  vi.doMock('@/config/site.config', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/config/site.config')>()
    return { ...original, appFeatures: { ...original.appFeatures, dayThirtyComparison: enabled } }
  })
  return import('./saveProgramAssessment')
}

function trials(): AttentionTrial[] {
  return generateAttentionSequence(1).map((t) => (t.go ? { go: true, responded: true, rtMs: 400 } : { go: false, responded: false, rtMs: null }))
}

const [formA, formB] = ASSESSMENT_PASSAGES
const allCorrect = (passage: typeof formA): number[] => passage.questions.map((q) => q.correctIndex)
const daysAgo = (n: number): string => new Date(Date.now() - n * 86_400_000).toISOString()

describe('saveProgramAssessment', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('does nothing while the feature is switched off', async () => {
    const { client, upserts } = makeClient()
    const { saveProgramAssessment } = await importAction(client, false)
    const result = await saveProgramAssessment({ stage: 'day1', passageId: 'form-a', readingMs: 60_000, answers: allCorrect(formA), attentionTrials: trials() })
    expect(result).toEqual({ ok: false, reason: 'disabled' })
    expect(upserts).toHaveLength(0)
  })

  it('rejects a tampered attention sequence', async () => {
    const { client } = makeClient()
    const { saveProgramAssessment } = await importAction(client)
    const allGo = trials().map(() => ({ go: true, responded: true, rtMs: 300 }))
    expect(await saveProgramAssessment({ stage: 'day1', passageId: 'form-a', readingMs: 60_000, answers: allCorrect(formA), attentionTrials: allGo })).toEqual({
      ok: false,
      reason: 'invalid_input',
    })
  })

  it('computes every score on the server for a Day 1', async () => {
    const { client, upserts } = makeClient()
    const { saveProgramAssessment } = await importAction(client)
    const words = countWords(formA)
    const answers = allCorrect(formA)
    answers[0] = (answers[0]! + 1) % 3 // one wrong → 80%
    const result = await saveProgramAssessment({ stage: 'day1', passageId: 'form-a', readingMs: 90_000, answers, attentionTrials: trials() })
    expect(result).toEqual({ ok: true })
    const wpm = Math.round(words / 1.5)
    expect(upserts[0]).toMatchObject({
      stage: 'day1',
      passage_id: 'form-a',
      word_count: words,
      wpm,
      correct_answers: 4,
      comprehension_percent: 80,
      effective_wpm: Math.round(wpm * 0.8),
      attention_accuracy_percent: 100,
      attention_mean_rt_ms: 400,
    })
  })

  it('rejects an implausible reading time', async () => {
    const { client, upserts } = makeClient()
    const { saveProgramAssessment } = await importAction(client)
    expect(await saveProgramAssessment({ stage: 'day1', passageId: 'form-a', readingMs: 5_000, answers: allCorrect(formA), attentionTrials: trials() })).toEqual({
      ok: false,
      reason: 'implausible_timing',
    })
    expect(upserts).toHaveLength(0)
  })

  it('needs a Day 1 before Day 30', async () => {
    const { client } = makeClient()
    const { saveProgramAssessment } = await importAction(client)
    expect((await saveProgramAssessment({ stage: 'day30', passageId: 'form-b', readingMs: 60_000, answers: allCorrect(formB), attentionTrials: trials() })).ok).toBe(false)
  })

  it('keeps Day 30 locked before day 28', async () => {
    const { client } = makeClient([{ stage: 'day1', passage_id: 'form-a', taken_at: daysAgo(10) }])
    const { saveProgramAssessment } = await importAction(client)
    expect(await saveProgramAssessment({ stage: 'day30', passageId: 'form-b', readingMs: 60_000, answers: allCorrect(formB), attentionTrials: trials() })).toEqual({
      ok: false,
      reason: 'not_open',
    })
  })

  it('opens Day 30 early once curriculum Day 29 is done after the baseline', async () => {
    const { client, upserts } = makeClient([{ stage: 'day1', passage_id: 'form-a', taken_at: daysAgo(10) }], { completed_at: daysAgo(1) })
    const { saveProgramAssessment } = await importAction(client)
    expect(await saveProgramAssessment({ stage: 'day30', passageId: 'form-b', readingMs: 60_000, answers: allCorrect(formB), attentionTrials: trials() })).toEqual({ ok: true })
    expect(upserts[0]).toMatchObject({ stage: 'day30', passage_id: 'form-b' })
  })

  it('makes Day 30 use the other passage', async () => {
    const { client } = makeClient([{ stage: 'day1', passage_id: 'form-a', taken_at: daysAgo(29) }])
    const { saveProgramAssessment } = await importAction(client)
    expect(await saveProgramAssessment({ stage: 'day30', passageId: 'form-a', readingMs: 60_000, answers: allCorrect(formA), attentionTrials: trials() })).toEqual({
      ok: false,
      reason: 'wrong_passage',
    })
  })

  it('allows no retakes once Day 30 is done (Day 1 can no longer be replaced)', async () => {
    const { client } = makeClient([
      { stage: 'day1', passage_id: 'form-a', taken_at: daysAgo(40) },
      { stage: 'day30', passage_id: 'form-b', taken_at: daysAgo(5) },
    ])
    const { saveProgramAssessment } = await importAction(client)
    expect(await saveProgramAssessment({ stage: 'day1', passageId: 'form-a', readingMs: 60_000, answers: allCorrect(formA), attentionTrials: trials() })).toEqual({
      ok: false,
      reason: 'day30_done',
    })
  })
})
