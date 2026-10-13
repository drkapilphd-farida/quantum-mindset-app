import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { ALL_MEMORY_WORDS } from '@/features/memory-check/content'
import { digitScore, HISTORY_DATES, NUMBER_PICTURES, numberLevel, numberListFor, pairsOf, pairSounds, pickDates, randomNumber, setPictures } from './numberCode'

const seeded = (seed: number) => {
  let s = seed
  return (n: number): number => {
    s = (s * 1103515245 + 12345) % 2 ** 31
    return s % n
  }
}

// Memory Palace objects (English and Hindi names) — number pictures must not repeat them.
const PALACE = ['mango', 'umbrella', 'kettle', 'clock', 'keys', 'roti', 'parrot', 'candle', 'eggs', 'phone', 'elephant', 'rickshaw', 'kite', 'ice', 'sunflower', 'whistle', 'boat', 'salt', 'camel', 'bicycle', 'book', 'pencil', 'globe', 'blackboard', 'calculator', 'bag', 'ruler', 'laptop', 'trophy', 'glasses', 'drum', 'flute', 'diya', 'garland', 'bell', 'rangoli', 'top', 'sweets', 'peacock', 'मोमबत्ती', 'घंटी', 'माला', 'लट्टू', 'मिठाई', 'चश्मा', 'बाँसुरी', 'दीया', 'पतंग']

describe('number picture lists', () => {
  for (const list of ['en', 'hi'] as const) {
    it(`${list}: 100 pictures, 00–99 in order, every word different, every icon bundled`, () => {
      const pics = NUMBER_PICTURES[list]
      expect(pics.map((p) => p.n)).toEqual(Array.from({ length: 100 }, (_, i) => String(i).padStart(2, '0')))
      expect(new Set(pics.map((p) => p.word)).size).toBe(100)
      expect(new Set(pics.map((p) => p.icon)).size).toBe(100)
      for (const p of pics) expect(fs.existsSync(path.join('public/memory-studio/numbers', `${p.icon}.svg`)), p.icon).toBe(true)
    })

    it(`${list}: no memory-check word or Memory Palace object`, () => {
      const banned = new Set([...ALL_MEMORY_WORDS.flatMap((w) => [w.en, w.hi]), ...PALACE])
      for (const p of NUMBER_PICTURES[list]) for (const word of p.word.toLowerCase().split(/[\s-]+/)) expect(banned.has(word), `${p.n} ${p.word}`).toBe(false)
    })
  }

  it('Hindi learners get the Hindi list; all other languages the English list', () => {
    expect(numberListFor('hi')).toBe('hi')
    for (const l of ['en', 'kn', 'ta', 'te', 'mr', 'gu', 'bn']) expect(numberListFor(l)).toBe('en')
  })

  it('shows the sounds of a pair and splits learning into sets of 10', () => {
    expect(pairSounds('en', '47')).toBe('r + k')
    expect(pairSounds('hi', '25')).toBe('न + ल')
    expect(setPictures('en', 4).map((p) => p.n)).toEqual(['40', '41', '42', '43', '44', '45', '46', '47', '48', '49'])
  })
})

describe('number rounds', () => {
  it('grows from 4 to 12 digits, never shrinking', () => {
    expect(numberLevel(1).digits).toBe(4)
    expect(numberLevel(10).digits).toBe(12)
    for (let l = 2; l <= 10; l++) expect(numberLevel(l).digits).toBeGreaterThanOrEqual(numberLevel(l - 1).digits)
  })

  it('makes numbers of the right length that never start with 0', () => {
    for (let s = 1; s < 200; s++) {
      const n = randomNumber(12, seeded(s))
      expect(n).toMatch(/^[1-9]\d{11}$/)
    }
  })

  it('splits into pairs and scores digits in the right place', () => {
    expect(pairsOf('471903')).toEqual(['47', '19', '03'])
    expect(pairsOf('47190')).toEqual(['47', '19', '0'])
    expect(digitScore('471903', '471993')).toBe(5)
    expect(digitScore('4719', '')).toBe(0)
  })

  it('dates: 20 events with 4-digit years, 3 different ones a round, avoiding the last round', () => {
    expect(HISTORY_DATES).toHaveLength(20)
    for (const d of HISTORY_DATES) expect(d.year).toMatch(/^\d{4}$/)
    const first = pickDates([], seeded(1))
    expect(new Set(first.map((d) => d.id)).size).toBe(3)
    const next = pickDates(first.map((d) => d.id), seeded(2))
    for (const d of next) expect(first.map((x) => x.id)).not.toContain(d.id)
  })
})
