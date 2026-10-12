import { describe, expect, it } from 'vitest'
import { ALL_MEMORY_WORDS } from '@/features/memory-check/content'
import { PALACE_OBJECTS } from '@/features/memory-palace/memoryPalace'
import { pegFor, pegSetFor, RHYME_PEGS, SHAPE_PEGS, STORY_ITEMS } from './content'
import { afterReview, cardSeconds, firstDue, INTERVAL_DAYS, LEARNED_STEP, pickSession } from './reviewSchedule'
import { orderScore, pickStoryRound, storyLevel } from './storyMethod'
import { pegLevel, pickPegRound } from './pegMethod'

const rng = (n: number): number => Math.floor(Math.random() * n)
const DAY = 86_400_000

describe('material', () => {
  it('50 distinct story items, each with a picture-safe id and Hindi name', () => {
    expect(STORY_ITEMS).toHaveLength(50)
    expect(new Set(STORY_ITEMS.map((i) => i.id)).size).toBe(50)
    expect(new Set(STORY_ITEMS.map((i) => i.hi)).size).toBe(50)
    for (const i of STORY_ITEMS) expect(i.hi).toMatch(/[ऀ-ॿ]/)
  })
  it('never uses a memory-check word, so practice cannot make the Day 1 / Day 30 check easier', () => {
    const checkWords = new Set(ALL_MEMORY_WORDS.flatMap((w) => [w.en, w.hi]))
    const names = [...STORY_ITEMS, ...RHYME_PEGS, ...SHAPE_PEGS].flatMap((i) => [i.en, i.hi])
    expect(names.filter((n) => checkWords.has(n))).toEqual([])
  })
  it('story items are not Memory Palace objects', () => {
    const palaceIds = new Set(PALACE_OBJECTS.map((o) => o.id))
    expect(STORY_ITEMS.filter((i) => palaceIds.has(i.id))).toEqual([])
  })
  it('pegs: rhyme pegs in English, shape pegs elsewhere; 11–20 are pegs 1–10 made of ice', () => {
    expect(pegSetFor('en')).toBe('rhyme')
    expect(pegSetFor('hi')).toBe('shape')
    expect(pegSetFor('ta')).toBe('shape')
    expect(pegFor('rhyme', 7)).toEqual({ base: RHYME_PEGS[6], ice: false })
    expect(pegFor('shape', 17)).toEqual({ base: SHAPE_PEGS[6], ice: true })
    expect(pegFor('shape', 20).base.n).toBe(10)
  })
})

describe('review schedule', () => {
  const now = Date.UTC(2026, 9, 15)
  it('new card: due tomorrow', () => {
    expect(firstDue(now)).toEqual({ step: 0, dueAt: new Date(now + DAY).toISOString() })
  })
  it('remembered: 1 → 3 → 7 → 14 → 30 days, then learned (no longer due)', () => {
    let step = 0
    const gaps: number[] = []
    for (let i = 0; i < 4; i++) {
      const next = afterReview(step, 'remembered', now)
      gaps.push((Date.parse(next.dueAt!) - now) / DAY)
      step = next.step
    }
    expect(gaps).toEqual([...INTERVAL_DAYS.slice(1)])
    expect(afterReview(step, 'remembered', now)).toEqual({ step: LEARNED_STEP, dueAt: null })
  })
  it('forgot: one step back, due tomorrow; never below 0', () => {
    expect(afterReview(3, 'forgot', now)).toEqual({ step: 2, dueAt: new Date(now + DAY).toISOString() })
    expect(afterReview(0, 'forgot', now).step).toBe(0)
  })
  it('a session stays within about 5 minutes, oldest first, always at least one card', () => {
    const cards = Array.from({ length: 40 }, (_, i) => ({ id: i, dueAt: new Date(now - i * 60_000).toISOString(), seconds: cardSeconds({ kind: 'peg' }) }))
    const session = pickSession(cards)
    expect(session.reduce((a, c) => a + c.seconds, 0)).toBeLessThanOrEqual(300)
    expect(session[0]!.id).toBe(39)
    expect(pickSession([{ dueAt: 'x', seconds: 900 }])).toHaveLength(1)
  })
})

describe('Story method', () => {
  it('levels grow from 5 pictures to 20 words', () => {
    expect(storyLevel(1)).toEqual({ count: 5, pictures: true, unseen: 0 })
    expect(storyLevel(10)).toEqual({ count: 20, pictures: false, unseen: 4 })
    for (let l = 2; l <= 10; l++) expect(storyLevel(l).count).toBeGreaterThanOrEqual(storyLevel(l - 1).count)
  })
  it('a round has distinct items, and avoids the last round when it can', () => {
    for (let l = 1; l <= 10; l++) {
      const r = pickStoryRound(l, [], rng)
      const ids = [...r.list, ...r.unseen].map((i) => i.id)
      expect(new Set(ids).size).toBe(ids.length)
      expect(r.list).toHaveLength(storyLevel(l).count)
    }
    const first = pickStoryRound(4, [], rng)
    const second = pickStoryRound(4, first.list.map((i) => i.id), rng)
    expect(second.list.filter((i) => first.list.some((f) => f.id === i.id))).toEqual([])
  })
  it('order score counts items in the right place', () => {
    expect(orderScore(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(3)
    expect(orderScore(['a', 'b', 'c'], ['b', 'a', 'c'])).toBe(1)
    expect(orderScore(['a', 'b', 'c'], [])).toBe(0)
  })
})

describe('Peg method', () => {
  it('levels: in order first, then mixed; pegs hidden from level 6', () => {
    expect(pegLevel(1)).toMatchObject({ count: 5, mixedOrder: false, showPeg: true })
    expect(pegLevel(6)).toMatchObject({ showPeg: false })
    expect(pegLevel(10).count).toBe(20)
  })
  it('every question has its answer among distinct options from the same list', () => {
    for (let l = 1; l <= 10; l++) {
      const r = pickPegRound(l, [], rng)
      expect(r.questions).toHaveLength(pegLevel(l).count)
      expect(new Set(r.questions.map((q) => q.n)).size).toBe(r.questions.length)
      for (const q of r.questions) {
        expect(q.options).toContain(q.answer)
        expect(new Set(q.options).size).toBe(q.options.length)
        expect(q.options.length).toBe(Math.min(pegLevel(l).choices, pegLevel(l).count))
        expect(r.list[q.n - 1]!.id).toBe(q.answer)
      }
    }
  })
})
