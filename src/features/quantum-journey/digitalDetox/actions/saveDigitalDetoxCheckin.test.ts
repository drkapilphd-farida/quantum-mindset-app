import { describe, expect, it, vi } from 'vitest'

// Phase 8 regression guard: Mobile Discipline screen-goal check-ins share
// the digital_detox_checkins table, but must never feed the 21-day
// journey's own "phone away" streak.
describe('saveDigitalDetoxCheckin', () => {
  it('reads only the journey’s own phone_away check-ins for its streak', async () => {
    const filters: [string, unknown][] = []
    const query = {
      eq: (column: string, value: unknown) => {
        filters.push([column, value])
        return query
      },
      order: () => query,
      limit: () => Promise.resolve({ data: [{ kept_phone_away: true, occurred_at: new Date().toISOString() }] }),
    }
    const client = {
      auth: { getUser: () => Promise.resolve({ data: { user: { id: 'user-1' } } }) },
      from: () => ({ insert: () => Promise.resolve({ error: null }), select: () => query }),
    }
    vi.resetModules()
    vi.doMock('@/lib/supabase/server', () => ({ createClient: () => Promise.resolve(client) }))
    const { saveDigitalDetoxCheckin } = await import('./saveDigitalDetoxCheckin')
    const result = await saveDigitalDetoxCheckin(true)
    expect(result.success).toBe(true)
    expect(filters).toContainEqual(['kind', 'phone_away'])
  })
})
