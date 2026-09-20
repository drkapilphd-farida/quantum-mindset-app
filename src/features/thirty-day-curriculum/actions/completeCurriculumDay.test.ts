import { describe, expect, it, vi, beforeEach } from 'vitest'

// Real server-side gate test (see the "Pre-Launch Audit Fix Pass" task,
// Phase 4) — mirrors the mocking convention revokeMasterclassAccess.test.ts
// already established: a small `.from(table)` mock plus vi.doMock'd
// module dependencies, since this action calls both the regular
// (RLS-scoped) Supabase client and getIsPaidUser.

type MockConfig = {
  user?: { id: string } | null
  existingDays?: readonly number[]
  readError?: { message: string } | null
  writeError?: { message: string } | null
}

function makeClient({ user = { id: 'user-1' }, existingDays = [], readError = null, writeError = null }: MockConfig = {}): {
  auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }
  from: (table: string) => unknown
} {
  return {
    auth: { getUser: () => Promise.resolve({ data: { user } }) },
    from: (table: string) => {
      if (table !== 'curriculum_day_completions') throw new Error(`Unexpected table in test mock: ${table}`)
      return {
        select: () => ({
          eq: () => Promise.resolve({ data: existingDays.map((day) => ({ day })), error: readError }),
        }),
        upsert: () => Promise.resolve({ error: writeError }),
      }
    },
  }
}

async function importAction(
  client: ReturnType<typeof makeClient>,
  isPaidUser: boolean,
): Promise<typeof import('./completeCurriculumDay')> {
  vi.resetModules()
  vi.doMock('@/lib/supabase/server', () => ({ createClient: () => Promise.resolve(client) }))
  vi.doMock('@/lib/subscription/getIsPaidUser', () => ({ getIsPaidUser: () => Promise.resolve(isPaidUser) }))
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

    expect(result).toEqual({ ok: true, completedDays: [1] })
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

  it('rejects completing a new day for a non-Pro user', async () => {
    const client = makeClient({ existingDays: [] })
    const { completeCurriculumDay } = await importAction(client, false)

    const result = await completeCurriculumDay({ day: 1 })

    expect(result).toEqual({ ok: false, reason: 'not_pro' })
  })

  it('allows day N once day N-1 is already recorded, for a Pro user', async () => {
    const client = makeClient({ existingDays: [1, 2, 3] })
    const { completeCurriculumDay } = await importAction(client, true)

    const result = await completeCurriculumDay({ day: 4, rawWpm: 300, trueWpm: 280, comprehensionAccuracyPercent: 90 })

    expect(result).toEqual({ ok: true, completedDays: [1, 2, 3, 4] })
  })

  // Permanent, re-practiceable access (must match curriculumProgress.ts's
  // own rule) — re-completing an already-earned day never re-checks Pro
  // status or sequence, so a lapsed subscription or a missing prior day
  // (impossible in practice, but defensively) can never re-lock it.
  it('re-completing an already-completed day skips Pro/sequence validation entirely', async () => {
    const client = makeClient({ existingDays: [1] })
    const { completeCurriculumDay } = await importAction(client, false)

    const result = await completeCurriculumDay({ day: 1 })

    expect(result).toEqual({ ok: true, completedDays: [1] })
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
})
