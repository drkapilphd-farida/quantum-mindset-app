import { describe, expect, it, vi } from 'vitest'

// Practising a completed day again: enrolled learners only, completed days
// only, and saved ONLY to curriculum_day_practice_attempts — never to
// curriculum_day_completions (the original result, baseline, Day 30
// result, progress and unlocks stay as they were).

type Write = { table: string; row: unknown }

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- a test double; its shape is inferred
function makeClient(opts: { user?: { id: string } | null; completedDays?: readonly number[]; writes: Write[] }) {
  const { user = { id: 'user-1' }, completedDays = [], writes } = opts
  return {
    auth: { getUser: () => Promise.resolve({ data: { user } }) },
    from: (table: string) => {
      const filters: Record<string, unknown> = {}
      const builder = {
        select: () => builder,
        eq: (column: string, value: unknown) => {
          filters[column] = value
          return builder
        },
        order: () => builder,
        limit: () =>
          Promise.resolve({
            data: [{ day: filters.day, practised_at: '2026-10-05T10:00:00Z', true_wpm: 240, comprehension_accuracy_percent: 80 }],
            count: 2,
            error: null,
          }),
        maybeSingle: () =>
          Promise.resolve({ data: completedDays.includes(filters.day as number) ? { day: filters.day } : null, error: null }),
        insert: (row: unknown) => {
          writes.push({ table, row })
          return Promise.resolve({ error: null })
        },
        upsert: (row: unknown) => {
          writes.push({ table, row })
          return Promise.resolve({ error: null })
        },
        update: (row: unknown) => {
          writes.push({ table, row })
          return builder
        },
      }
      return builder
    },
  }
}

async function load(client: ReturnType<typeof makeClient>, isPaid: boolean): Promise<typeof import('./curriculumDayPractice')> {
  vi.resetModules()
  vi.doMock('@/lib/supabase/server', () => ({ createClient: () => Promise.resolve(client) }))
  vi.doMock('@/lib/subscription/getIsPaidUser', () => ({ getIsPaidUser: () => Promise.resolve(isPaid) }))
  vi.doMock('@/lib/app-i18n/server', () => ({ getPracticeContentLang: () => Promise.resolve('en') }))
  return import('./curriculumDayPractice')
}

describe('recordCurriculumDayPractice', () => {
  it('a replay of a normal day is saved as practice only', async () => {
    const writes: Write[] = []
    const { recordCurriculumDayPractice } = await load(makeClient({ completedDays: [1, 2, 3, 4], writes }), true)

    const result = await recordCurriculumDayPractice({ day: 4 })

    expect(result.ok).toBe(true)
    expect(writes.map((w) => w.table)).toEqual(['curriculum_day_practice_attempts'])
  })

  it('a replay of a checkpoint day stores its scores as practice — never in completions', async () => {
    const writes: Write[] = []
    const { recordCurriculumDayPractice } = await load(makeClient({ completedDays: [1, 7], writes }), true)

    const result = await recordCurriculumDayPractice({ day: 7, rawWpm: 260, trueWpm: 240, comprehensionAccuracyPercent: 80 })

    expect(result).toMatchObject({ ok: true, attempt: { day: 7, trueWpm: 240, comprehensionAccuracyPercent: 80, count: 2 } })
    expect(writes).toEqual([
      {
        table: 'curriculum_day_practice_attempts',
        row: expect.objectContaining({ day: 7, raw_wpm: 260, true_wpm: 240, comprehension_accuracy_percent: 80 }),
      },
    ])
    expect(writes.some((w) => w.table === 'curriculum_day_completions')).toBe(false)
  })

  it('cannot be used to open or unlock a day that is not completed', async () => {
    const writes: Write[] = []
    const { recordCurriculumDayPractice } = await load(makeClient({ completedDays: [1, 2], writes }), true)

    expect(await recordCurriculumDayPractice({ day: 3 })).toEqual({ ok: false, reason: 'day_not_completed' })
    expect(writes).toEqual([])
  })

  it('an unpaid learner cannot save practice', async () => {
    const writes: Write[] = []
    const { recordCurriculumDayPractice } = await load(makeClient({ completedDays: [1], writes }), false)

    expect(await recordCurriculumDayPractice({ day: 1 })).toEqual({ ok: false, reason: 'not_pro' })
    expect(writes).toEqual([])
  })

  it('rejects bad input and signed-out requests', async () => {
    const writes: Write[] = []
    const { recordCurriculumDayPractice } = await load(makeClient({ user: null, completedDays: [1], writes }), true)

    expect(await recordCurriculumDayPractice({ day: 31 })).toEqual({ ok: false, reason: 'invalid_input' })
    expect(await recordCurriculumDayPractice({ day: 1, comprehensionAccuracyPercent: 150 })).toEqual({ ok: false, reason: 'invalid_input' })
    expect(await recordCurriculumDayPractice({ day: 1 })).toEqual({ ok: false, reason: 'unauthenticated' })
    expect(writes).toEqual([])
  })
})
