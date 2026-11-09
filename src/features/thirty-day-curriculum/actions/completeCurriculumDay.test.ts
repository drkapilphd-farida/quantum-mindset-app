import { describe, expect, it, vi, beforeEach } from 'vitest'
import { dayStepIds } from '../paceControl'

// Real server-side gate test (see the "Pre-Launch Audit Fix Pass" task,
// Phase 4) — mirrors the mocking convention revokeMasterclassAccess.test.ts
// already established: a small `.from(table)` mock plus vi.doMock'd
// module dependencies, since this action calls both the regular
// (RLS-scoped) Supabase client and getIsPaidUser.

type Activity = { day: number; active_seconds: number; steps_done: string[]; paced: boolean; short_attempts: number }

type MockConfig = {
  user?: { id: string } | null
  existingDays?: readonly number[]
  /** When each existing day was completed (default: long ago). */
  completedAt?: string
  readError?: { message: string } | null
  writeError?: { message: string; code?: string } | null
  writes?: unknown[]
  /** Activity rows; by default every day has all its steps. */
  activity?: Activity[]
}

const fullDay = (day: number, over: Partial<Activity> = {}): Activity => ({ day, active_seconds: 600, steps_done: [...dayStepIds(day)], paced: false, short_attempts: 0, ...over })

function makeClient({ user = { id: 'user-1' }, existingDays = [], completedAt = '2026-01-01T10:00:00Z', readError = null, writeError = null, writes = [], activity }: MockConfig = {}): {
  auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }
  from: (table: string) => unknown
  completions: () => Promise<{ day: number; completedAt: string }[]>
} {
  return {
    completions: () => (readError ? Promise.reject(new Error(readError.message)) : Promise.resolve(existingDays.map((day) => ({ day, completedAt })))),
    auth: { getUser: () => Promise.resolve({ data: { user } }) },
    from: (table: string) => {
      if (table === 'curriculum_day_activity') {
        return {
          select: () => ({
            eq: () => ({
              eq: (_col: string, day: number) => ({
                maybeSingle: () => Promise.resolve({ data: activity ? (activity.find((a) => a.day === day) ?? null) : fullDay(day), error: null }),
              }),
            }),
          }),
        }
      }
      if (table !== 'curriculum_day_completions') throw new Error(`Unexpected table in test mock: ${table}`)
      return {
        select: () => ({
          eq: () => Promise.resolve({ data: existingDays.map((day) => ({ day, completed_at: completedAt })), error: readError }),
        }),
        insert: (row: unknown) => {
          writes.push({ insert: row })
          return Promise.resolve({ error: writeError })
        },
        upsert: (row: unknown) => {
          writes.push({ upsert: row })
          return Promise.resolve({ error: writeError })
        },
      }
    },
  }
}

async function importAction(
  client: ReturnType<typeof makeClient>,
  isPaidUser: boolean,
  activityWrites: unknown[] = [],
): Promise<typeof import('./completeCurriculumDay')> {
  vi.resetModules()
  vi.doMock('@/lib/supabase/server', () => ({ createClient: () => Promise.resolve(client) }))
  vi.doMock('@/lib/supabase/service', () => ({
    createServiceClient: () => ({ from: () => ({ upsert: (row: unknown) => (activityWrites.push(row), Promise.resolve({ error: null })) }) }),
  }))
  vi.doMock('@/lib/subscription/getIsPaidUser', () => ({ getIsPaidUser: () => Promise.resolve(isPaidUser) }))
  // The shared list every page reads (self-repair is tested in its own file).
  vi.doMock('./getCurriculumDayCompletions', () => ({ getCurriculumDayCompletions: client.completions }))
  return import('./completeCurriculumDay')
}

describe('completeCurriculumDay', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects an out-of-range day before touching the database', async () => {
    const client = makeClient()
    const { completeCurriculumDay } = await importAction(client, true)

    expect(await completeCurriculumDay({ day: 31 })).toEqual({ ok: false, reason: 'invalid_day' })
    expect(await completeCurriculumDay({ day: 0 })).toEqual({ ok: false, reason: 'invalid_day' })
  })

  it('rejects an unauthenticated request', async () => {
    const client = makeClient({ user: null })
    const { completeCurriculumDay } = await importAction(client, true)

    const result = await completeCurriculumDay({ day: 1 })

    expect(result).toEqual({ ok: false, reason: 'unauthenticated' })
  })

  it('day 1 succeeds for a real Pro user with no prior completions', async () => {
    const client = makeClient({ existingDays: [] })
    const { completeCurriculumDay } = await importAction(client, true)

    const result = await completeCurriculumDay({ day: 1 })

    expect(result).toEqual({ ok: true, completedDays: [1], paced: false })
  })

  // The exact bypass this action exists to close: a client-forged call
  // asking to complete day 30 having only ever completed (or claimed to
  // have completed, e.g. via tampered localStorage) day 1.
  it('paywall bypass: rejects completing day 30 when only day 1 is recorded server-side, even for a Pro user', async () => {
    const client = makeClient({ existingDays: [1] })
    const { completeCurriculumDay } = await importAction(client, true)

    const result = await completeCurriculumDay({ day: 30 })

    expect(result).toEqual({ ok: false, reason: 'previous_day_incomplete' })
  })

  it('rejects completing any new day, Day 1 included, for a non-Pro user', async () => {
    const client = makeClient({ existingDays: [] })
    const { completeCurriculumDay } = await importAction(client, false)

    expect(await completeCurriculumDay({ day: 1 })).toEqual({ ok: false, reason: 'not_pro' })
    expect(await completeCurriculumDay({ day: 2 })).toEqual({ ok: false, reason: 'not_pro' })
  })

  it('allows day N once day N-1 is already recorded, for a Pro user', async () => {
    const client = makeClient({ existingDays: [1, 2, 3] })
    const { completeCurriculumDay } = await importAction(client, true)

    const result = await completeCurriculumDay({ day: 4, rawWpm: 300, trueWpm: 280, comprehensionAccuracyPercent: 90 })

    expect(result).toEqual({ ok: true, completedDays: [1, 2, 3, 4], paced: false })
  })

  // Permanent, re-practiceable access (must match curriculumProgress.ts's
  // own rule) — re-completing an already-earned day never re-checks Pro
  // status or sequence, so a lapsed subscription or a missing prior day
  // (impossible in practice, but defensively) can never re-lock it.
  it('re-completing an already-completed day skips Pro/sequence validation entirely', async () => {
    const client = makeClient({ existingDays: [1] })
    const { completeCurriculumDay } = await importAction(client, false)

    const result = await completeCurriculumDay({ day: 1 })

    expect(result).toEqual({ ok: true, completedDays: [1], paced: false })
  })

  it('surfaces a db_error (not a false success) if reading existing completions fails', async () => {
    const client = makeClient({ readError: { message: 'connection reset' } })
    const { completeCurriculumDay } = await importAction(client, true)

    const result = await completeCurriculumDay({ day: 1 })

    expect(result).toEqual({ ok: false, reason: 'db_error' })
  })

  it('surfaces a db_error (not a false success) if the write itself fails', async () => {
    const client = makeClient({ writeError: { message: 'connection reset' } })
    const { completeCurriculumDay } = await importAction(client, true)

    const result = await completeCurriculumDay({ day: 1 })

    expect(result).toEqual({ ok: false, reason: 'db_error' })
  })

  describe('a completion is written once and never changed', () => {
    it('replaying an already-completed day returns ok without any write (original date and scores stay)', async () => {
      const writes: unknown[] = []
      const client = makeClient({ existingDays: [1, 2, 3, 4], writes })
      const { completeCurriculumDay } = await importAction(client, true)

      const result = await completeCurriculumDay({ day: 4, trueWpm: 999, comprehensionAccuracyPercent: 10 })

      expect(result).toEqual({ ok: true, completedDays: [1, 2, 3, 4], paced: false })
      expect(writes).toEqual([])
    })

    it('a checkpoint day (Day 1 baseline, Day 30 result) is never overwritten', async () => {
      const writes: unknown[] = []
      const all = Array.from({ length: 30 }, (_, i) => i + 1)
      const client = makeClient({ existingDays: all, writes })
      const { completeCurriculumDay } = await importAction(client, true)

      await completeCurriculumDay({ day: 1, trueWpm: 50 })
      await completeCurriculumDay({ day: 30, trueWpm: 50 })

      expect(writes).toEqual([])
    })

    it('a first completion is inserted, never upserted', async () => {
      const writes: unknown[] = []
      const client = makeClient({ existingDays: [], writes })
      const { completeCurriculumDay } = await importAction(client, true)

      await completeCurriculumDay({ day: 1 })

      expect(writes).toHaveLength(1)
      expect(writes[0]).toHaveProperty('insert')
    })

    it('the same day completed a moment ago in another tab (unique conflict) still succeeds', async () => {
      const client = makeClient({ existingDays: [], writeError: { message: 'duplicate', code: '23505' } })
      const { completeCurriculumDay } = await importAction(client, true)

      expect(await completeCurriculumDay({ day: 1 })).toEqual({ ok: true, completedDays: [1], paced: false })
    })
  })

  describe('the one rule (founder, 9 Nov 2026): progress only', () => {
    it('Mahaboob: a test day (Day 1) with 587 s of practice and its reading test done completes', async () => {
      const client = makeClient({ existingDays: [], activity: [fullDay(1, { active_seconds: 587 })] })
      const { completeCurriculumDay } = await importAction(client, true)
      expect(await completeCurriculumDay({ day: 1, rawWpm: 118, trueWpm: 94, comprehensionAccuracyPercent: 80 })).toEqual({ ok: true, completedDays: [1], paced: false })
    })

    it('a test day needs no steps or time at all — the test is the completion', async () => {
      const client = makeClient({ existingDays: Array.from({ length: 20 }, (_, i) => i + 1), activity: [] })
      const { completeCurriculumDay } = await importAction(client, true)
      expect(await completeCurriculumDay({ day: 21, trueWpm: 200 })).toMatchObject({ ok: true })
    })

    it('a normal day completes on its steps, whatever the practice time (no 10-minute minimum)', async () => {
      const client = makeClient({ existingDays: [1, 2, 3, 4], activity: [fullDay(5, { active_seconds: 120 })] })
      const { completeCurriculumDay } = await importAction(client, true)
      expect(await completeCurriculumDay({ day: 5 })).toEqual({ ok: true, completedDays: [1, 2, 3, 4, 5], paced: false })
    })

    it('no midnight wait: the previous day completed a moment ago, this day still completes', async () => {
      const client = makeClient({ existingDays: [1, 2, 3, 4], completedAt: new Date().toISOString(), activity: [fullDay(4, { paced: true }), fullDay(5)] })
      const { completeCurriculumDay } = await importAction(client, true)
      expect(await completeCurriculumDay({ day: 5 })).toMatchObject({ ok: true })
    })

    it('a required step not done yet is still asked for', async () => {
      const steps = [...dayStepIds(5)]
      const client = makeClient({ existingDays: [1, 2, 3, 4], activity: [fullDay(5, { steps_done: steps.slice(0, -1) })] })
      const { completeCurriculumDay } = await importAction(client, true)
      expect(await completeCurriculumDay({ day: 5 })).toEqual({ ok: false, reason: 'steps_incomplete', missing: [steps[steps.length - 1]] })
    })

    it('the optional chapter upload never blocks a day', async () => {
      const day = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29].find((d) => dayStepIds(d).includes('chapter-book'))!
      const client = makeClient({ existingDays: Array.from({ length: day - 1 }, (_, i) => i + 1), activity: [fullDay(day, { steps_done: dayStepIds(day).filter((id) => id !== 'chapter-book') })] })
      const { completeCurriculumDay } = await importAction(client, true)
      expect(await completeCurriculumDay({ day })).toMatchObject({ ok: true })
    })
  })
})
