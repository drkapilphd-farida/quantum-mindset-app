import { describe, expect, it } from 'vitest'
import { capChapterText, ChapterMapSchema, clampText, cleanChapterText, istDayStart, looksGarbled, normaliseChapterMap, weakIdeas, wordCount } from './chapterBook'

describe('Chapter & Book', () => {
  it('cleans pasted text: page numbers out, broken lines joined, paragraphs kept', () => {
    const raw = 'The French Revolution began\nin 1789.\n\n12\n\nPage 13\nIt changed Europe.'
    expect(cleanChapterText(raw)).toBe('The French Revolution began in 1789.\n\nIt changed Europe.')
  })
  it('a long chapter is cut at a paragraph break, never mid-sentence when it can be avoided', () => {
    const text = `${'a '.repeat(400)}\n\n${'b '.repeat(400)}`
    const r = capChapterText(text, 1000)
    expect(r.cut).toBe(true)
    expect(r.text.endsWith('a')).toBe(true)
    expect(capChapterText('short', 1000)).toEqual({ text: 'short', cut: false })
  })
  it('spots text from old Hindi PDF fonts (Latin-1 gibberish), not real English or Hindi', () => {
    const krutiDev = 'Hkkjr ,d fo”kky ns”k gS ftlesa vusd Hkk\"kk,¡ cksyh tkrh gSa ¼fgUnh½ ÞvkÞ ßnsß ªrj Œ'.repeat(10)
    expect(looksGarbled(krutiDev.replace(/[a-zA-Z]/g, 'Ã'))).toBe(true)
    expect(looksGarbled('The cell is the basic unit of life. '.repeat(20))).toBe(false)
    expect(looksGarbled('कोशिका जीवन की मूल इकाई है। '.repeat(30))).toBe(false)
  })
  it('a chapter map needs 3–9 ideas and questions with 4 options', () => {
    const idea = { title: 'Idea', detail: 'One line.', points: [] }
    const q = { question: 'Q?', options: ['a', 'b', 'c', 'd'], correctIndex: 1, idea: 0 }
    expect(ChapterMapSchema.safeParse({ ideas: Array(5).fill(idea), questions: Array(5).fill(q) }).success).toBe(true)
    expect(ChapterMapSchema.safeParse({ ideas: Array(2).fill(idea), questions: Array(5).fill(q) }).success).toBe(false)
    expect(ChapterMapSchema.safeParse({ ideas: Array(6).fill(idea), questions: [{ ...q, options: ['a', 'b'] }] }).success).toBe(false)
  })
  it('missed ideas come back once each, in order', () => {
    expect(weakIdeas([{ idea: 3, right: false }, { idea: 1, right: true }, { idea: 3, right: false }, { idea: 0, right: false }])).toEqual([0, 3])
  })
  it('counts words and starts the daily limit at midnight India time', () => {
    expect(wordCount('  one two\nthree ')).toBe(3)
    expect(istDayStart(Date.UTC(2026, 9, 13, 20, 0))).toBe('2026-10-13T18:30:00.000Z') // 01:30 IST on 14 Oct → day began 18:30 UTC
  })
  it('an over-long AI sentence is shortened, not a reason to fail the chapter (production bug, 28 Oct 2026)', () => {
    const long = 'The monsoon brings nearly three quarters of the yearly rain between June and September, and farming, reservoirs and food prices all depend on how good the season is, which is why its arrival is watched so closely.'
    expect(long.length).toBeGreaterThan(200)
    const idea = { title: 'Monsoon season', detail: long, points: ['A point that is far too long to fit on one card line because it keeps going and going'] }
    const q = { question: 'Q?', options: ['a', 'b', 'c', 'd'], correctIndex: 1, idea: 7 }
    const map = normaliseChapterMap({ ideas: Array(6).fill(idea), questions: Array(5).fill(q) })
    expect(map).not.toBeNull()
    expect(map!.ideas[0]!.detail.length).toBeLessThanOrEqual(200)
    expect(map!.ideas[0]!.detail.endsWith('…')).toBe(true)
    expect(map!.ideas[0]!.points[0]!.length).toBeLessThanOrEqual(80)
    expect(map!.questions[0]!.idea).toBe(5) // pointed past the last idea → last idea
  })
  it('broken questions are dropped; too little left is still a failure', () => {
    const idea = { title: 'Idea', detail: 'One line.', points: [] }
    const good = { question: 'Q?', options: ['a', 'b', 'c', 'd'], correctIndex: 2, idea: 0 }
    const bad = [{ ...good, options: ['a', 'b'] }, { ...good, correctIndex: 4 }, { ...good, question: '' }]
    expect(normaliseChapterMap({ ideas: Array(5).fill(idea), questions: [good, good, good, ...bad] })?.questions).toHaveLength(3)
    expect(normaliseChapterMap({ ideas: Array(5).fill(idea), questions: [good, ...bad] })).toBeNull()
    expect(normaliseChapterMap(null)).toBeNull()
    expect(normaliseChapterMap({ ideas: Array(12).fill(idea), questions: Array(5).fill(good) })?.ideas).toHaveLength(9)
  })
  it('clampText cuts at a word boundary', () => {
    expect(clampText('short', 80)).toBe('short')
    expect(clampText('alpha beta gamma delta', 15)).toBe('alpha beta…')
  })
  it('a pasted table keeps one row per line, broken rows are joined, a tab indent is not a table', () => {
    const raw = 'Rain in India\nCity\tState\tRain (mm)\nMumbai\tMaharashtra\t\n2,200\nKolkata\tWest Bengal\n\t1,150\n\n\tThe monsoon starts in\nJune.\u00A0It\u200B ends in September.'
    expect(cleanChapterText(raw)).toBe('Rain in India\nCity | State | Rain (mm)\nMumbai | Maharashtra | 2,200\nKolkata | West Bengal | 1,150\n\nThe monsoon starts in June. It ends in September.')
  })
  it('a number in a Word table (one cell per line) is kept; a page number between paragraphs is dropped', () => {
    expect(cleanChapterText('Jaisalmer\n\nRajasthan\n\n160\n\n85%')).toBe('Jaisalmer\n\nRajasthan\n\n160\n\n85%')
    expect(cleanChapterText('The rains end in September, and the dry season begins.\n\n47\n\nIn October the winds turn around and blow from the north-east.')).toBe('The rains end in September, and the dry season begins.\n\nIn October the winds turn around and blow from the north-east.')
  })
  it('keeps the joiners Hindi needs', () => {
    expect(cleanChapterText('क्\u200Dष')).toBe('क्\u200Dष')
  })
  it('a 3,000-word chapter is not cut', () => {
    const text = Array.from({ length: 3000 }, (_, i) => `word${i % 50}`).join(' ')
    expect(capChapterText(cleanChapterText(text), 24_000).cut).toBe(false)
  })
})
