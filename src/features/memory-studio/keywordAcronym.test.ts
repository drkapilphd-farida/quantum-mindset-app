import { describe, expect, it } from 'vitest'
import { ALL_MEMORY_WORDS } from '@/features/memory-check/content'
import { firstLetters, sentenceMatches } from './acronym'
import { KEYWORD_CARDS, keywordLevel, keywordListFor, pickKeywordRound } from './keyword'

const seeded = (seed: number) => {
  let s = seed
  return (n: number): number => {
    s = (s * 1103515245 + 12345) % 2 ** 31
    return s % n
  }
}

describe('Keyword method', () => {
  it('English and Hindi practise the same 30 words, each with a meaning, keyword and picture', () => {
    expect(KEYWORD_CARDS.en.map((c) => c.id)).toEqual(KEYWORD_CARDS.hi.map((c) => c.id))
    expect(new Set(KEYWORD_CARDS.en.map((c) => c.id)).size).toBe(30)
    for (const list of ['en', 'hi'] as const) {
      expect(new Set(KEYWORD_CARDS[list].map((c) => c.meaning)).size).toBe(30)
      for (const c of KEYWORD_CARDS[list]) for (const f of [c.meaning, c.keyword, c.picture]) expect(f.length).toBeGreaterThan(0)
    }
  })

  it('pictures and meanings never use a memory-check word', () => {
    const banned = ALL_MEMORY_WORDS.flatMap((w) => [w.en, w.hi])
    for (const list of ['en', 'hi'] as const)
      for (const c of KEYWORD_CARDS[list]) {
        const words = `${c.meaning} ${c.keyword} ${c.picture}`.toLowerCase().split(/[\s,.!?;:—'"“”‘’()-]+/)
        for (const b of banned) expect(words.includes(b.toLowerCase()), `${list} ${c.id}: ${b}`).toBe(false)
      }
  })

  it('grows from 3 to 10 words; help fades from keyword + picture to the learner’s own', () => {
    expect(keywordLevel(1)).toMatchObject({ count: 3, help: 'full' })
    expect(keywordLevel(4).help).toBe('keyword')
    expect(keywordLevel(10)).toMatchObject({ count: 10, help: 'none' })
    expect(keywordListFor('hi')).toBe('hi')
    expect(keywordListFor('ta')).toBe('en')
  })

  it('a round has distinct words, asked in a new order, with unseen meanings in the choices', () => {
    for (let level = 1; level <= 10; level++) {
      const r = pickKeywordRound('en', level, [], seeded(level))
      const c = keywordLevel(level)
      expect(r.cards).toHaveLength(c.count)
      expect(r.choices).toHaveLength(c.count + c.unseen)
      for (const card of r.cards) expect(r.choices).toContain(card)
      expect([...r.askOrder].sort((a, b) => a - b)).toEqual(r.cards.map((_, i) => i))
    }
    const first = pickKeywordRound('hi', 5, [], seeded(3))
    const next = pickKeywordRound('hi', 5, first.choices.map((c) => c.id), seeded(4))
    for (const c of next.cards) expect(first.choices.map((x) => x.id)).not.toContain(c.id)
  })
})

describe('Acronyms', () => {
  it('takes the first letter of each item, in order', () => {
    expect(firstLetters(['violet', 'Indigo', 'blue', 'green', 'yellow', 'orange', 'red'])).toBe('VIBGYOR')
    expect(firstLetters(['  Mercury', 'Venus'])).toBe('MV')
    expect(firstLetters(['नीला', 'लाल'])).toBe('नल')
  })

  it('checks that a sentence’s words start with the letters, in order', () => {
    expect(sentenceMatches('MVEMJSUN', 'My Very Educated Mother Just Served Us Nachos')).toBe(true)
    expect(sentenceMatches('MVEMJSUN', 'my very educated mother just served us nachos!')).toBe(true)
    expect(sentenceMatches('MVE', 'My Very')).toBe(false)
    expect(sentenceMatches('MVE', 'Very My Educated')).toBe(false)
  })
})

describe('Material used inside the 30-day plan', () => {
  it('the sample chapter and the ready acronym lists use no memory-check word', async () => {
    const { SAMPLE_CHAPTER } = await import('./sampleChapter')
    const { ACRONYM_READY_LISTS } = await import('./acronym')
    const banned = new Set(ALL_MEMORY_WORDS.flatMap((w) => [w.en.toLowerCase(), w.hi]))
    const texts = [SAMPLE_CHAPTER.en.text, SAMPLE_CHAPTER.hi.text, ...Object.values(ACRONYM_READY_LISTS).flat().flatMap((l) => [l.title, ...l.items])]
    for (const text of texts) for (const word of text.toLowerCase().split(/[\s,.!?;:—'"“”‘’()।-]+/)) expect(banned.has(word), word).toBe(false)
  })
})
