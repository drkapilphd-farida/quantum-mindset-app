import { beforeEach, describe, expect, it, vi } from 'vitest'

// "Dr. Kapil's Note" once per learner per day: one AI call, then reused.
const store = new Map<string, unknown>()
vi.mock('next/cache', () => ({
  unstable_cache: (fn: () => Promise<unknown>, keyParts: string[]) => async () => {
    const key = keyParts.join('|')
    if (store.has(key)) return store.get(key)
    const value = await fn() // a throw is not stored, like the real cache
    store.set(key, value)
    return value
  },
}))
let aiCalls = 0
let aiFails = false
vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = {
      create: async () => {
        aiCalls += 1
        if (aiFails) throw new Error('AI unavailable')
        return { content: [{ type: 'text', text: 'Asha, five days in a row shows real momentum; keep this rhythm going today.' }] }
      },
    }
  },
}))

const input = { studentName: 'Asha Rao', currentStreak: 5, bestStreak: 5, completedCount: 6, totalCount: 30, todaySessionCount: 0, totalCompletedSessions: 20 }
const t = ((key: string) => `fallback:${key}`) as unknown as import('@/lib/app-i18n/translate').Translator

describe('daily mentor note', () => {
  beforeEach(() => {
    store.clear()
    aiCalls = 0
    aiFails = false
    process.env.ANTHROPIC_API_KEY = 'sk-test-key'
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-12T05:00:00Z'))
  })

  it('one AI call per learner per day, reused for every visit (and background pre-load)', async () => {
    const { getDailyMentorNote } = await import('./generateMentorMessage')
    const first = await getDailyMentorNote('u1', input, 'en', t)
    const again = await getDailyMentorNote('u1', { ...input, todaySessionCount: 3 }, 'en', t)
    expect(again).toBe(first)
    expect(aiCalls).toBe(1)
    await getDailyMentorNote('u2', input, 'en', t)
    expect(aiCalls).toBe(2)
  })

  it('a new India calendar day makes a new note', async () => {
    const { getDailyMentorNote } = await import('./generateMentorMessage')
    await getDailyMentorNote('u1', input, 'en', t)
    vi.setSystemTime(new Date('2026-10-12T19:00:00Z')) // 00:30 IST on 13 Oct
    await getDailyMentorNote('u1', input, 'en', t)
    expect(aiCalls).toBe(2)
  })

  it('if the AI fails, the built-in note shows and the next visit tries again', async () => {
    const { getDailyMentorNote } = await import('./generateMentorMessage')
    aiFails = true
    const note = await getDailyMentorNote('u1', input, 'en', t)
    expect(note.startsWith('fallback:')).toBe(true)
    aiFails = false
    const next = await getDailyMentorNote('u1', input, 'en', t)
    expect(next).toContain('Asha')
    expect(aiCalls).toBe(2)
  })
})
