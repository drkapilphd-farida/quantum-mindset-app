import { describe, expect, it, vi } from 'vitest'
import { dayStepIds } from '../paceControl'

// Never leave a learner stuck: a finished day the server never recorded
// (the old pace rules refused it) is recorded when their progress is read.

type World = { completions: { day: number }[]; tests: { curriculum_day: number }[]; activity: { day: number; steps_done: string[] }[] }

async function read(world: World): Promise<{ days: number[]; upserts: { day: number }[][] }> {
  const upserts: { day: number }[][] = []
  const chain = (data: unknown): Record<string, unknown> => {
    const b: Record<string, unknown> = { select: () => b, eq: () => b, not: () => b, order: () => b, then: (r: (v: unknown) => void) => r({ data }) }
    return b
  }
  const client = {
    auth: { getUser: () => Promise.resolve({ data: { user: { id: 'u1' } } }) },
    from: (table: string) =>
      table === 'curriculum_day_completions'
        ? chain(world.completions.map((c) => ({ day: c.day, raw_wpm: null, true_wpm: null, comprehension_accuracy_percent: null, completed_at: '2026-11-01T10:00:00Z', content_lang: 'en' })))
        : table === 'reading_tests'
          ? chain(world.tests.map((t) => ({ ...t, wpm: 118, effective_wpm: 94, comprehension_percent: 80, lang: 'en', created_at: '2026-11-07T12:18:00Z' })))
          : chain(world.activity.map((a) => ({ ...a, updated_at: '2026-11-07T12:20:00Z' }))),
  }
  vi.resetModules()
  vi.doMock('@/lib/supabase/server', () => ({ createClient: () => Promise.resolve(client) }))
  vi.doMock('@/lib/supabase/service', () => ({
    createServiceClient: () => ({ from: () => ({ upsert: (rows: { day: number }[]) => (upserts.push(rows), Promise.resolve({ error: null })) }) }),
  }))
  const { getCurriculumDayCompletions } = await import('./getCurriculumDayCompletions')
  return { days: (await getCurriculumDayCompletions()).map((r) => r.day).sort((a, b) => a - b), upserts }
}

describe('getCurriculumDayCompletions — records finished days', () => {
  it('Mahaboob: Day 1 test saved but the day refused (587 s) → Day 1 counts and is recorded', async () => {
    const { days, upserts } = await read({ completions: [], tests: [{ curriculum_day: 1 }], activity: [{ day: 1, steps_done: ['calm-breathing'] }] })
    expect(days).toEqual([1])
    expect(upserts).toEqual([[expect.objectContaining({ user_id: 'u1', day: 1, true_wpm: 94, comprehension_accuracy_percent: 80 })]])
  })

  it('a normal day with every required step done but no record → counts', async () => {
    const { days } = await read({ completions: [{ day: 1 }], tests: [], activity: [{ day: 2, steps_done: [...dayStepIds(2)] }] })
    expect(days).toEqual([1, 2])
  })

  it('never a day not earned: Day 5 steps done but Day 4 not finished → nothing recorded', async () => {
    const { days, upserts } = await read({ completions: [{ day: 1 }, { day: 2 }, { day: 3 }], tests: [], activity: [{ day: 5, steps_done: [...dayStepIds(5)] }] })
    expect(days).toEqual([1, 2, 3])
    expect(upserts).toEqual([])
  })

  it('never a day not earned: a Day 21 test saved while Day 20 is unfinished → nothing recorded', async () => {
    const twenty = Array.from({ length: 19 }, (_, i) => ({ day: i + 1 }))
    const { days, upserts } = await read({ completions: twenty, tests: [{ curriculum_day: 21 }], activity: [] })
    expect(days).toEqual(twenty.map((c) => c.day))
    expect(upserts).toEqual([])
  })

  it('a chain in order: Day 20 steps done and Day 21 test saved, Day 19 recorded → both counted', async () => {
    const nineteen = Array.from({ length: 19 }, (_, i) => ({ day: i + 1 }))
    const { days } = await read({ completions: nineteen, tests: [{ curriculum_day: 21 }], activity: [{ day: 20, steps_done: [...dayStepIds(20)] }] })
    expect(days).toEqual([...nineteen.map((c) => c.day), 20, 21])
  })

  it('nothing missing → no write at all', async () => {
    const { days, upserts } = await read({ completions: [{ day: 1 }, { day: 2 }], tests: [{ curriculum_day: 1 }], activity: [{ day: 3, steps_done: ['calm-breathing'] }] })
    expect(days).toEqual([1, 2])
    expect(upserts).toEqual([])
  })
})
