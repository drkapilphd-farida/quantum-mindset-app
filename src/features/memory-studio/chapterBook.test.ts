import { describe, expect, it } from 'vitest'
import { capChapterText, ChapterMapSchema, cleanChapterText, istDayStart, looksGarbled, weakIdeas, wordCount } from './chapterBook'

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
  it('the AI reply must have 5–9 ideas and questions with 4 options', () => {
    const idea = { title: 'Idea', detail: 'One line.', points: [] }
    const q = { question: 'Q?', options: ['a', 'b', 'c', 'd'], correctIndex: 1, idea: 0 }
    expect(ChapterMapSchema.safeParse({ ideas: Array(5).fill(idea), questions: Array(5).fill(q) }).success).toBe(true)
    expect(ChapterMapSchema.safeParse({ ideas: Array(4).fill(idea), questions: Array(5).fill(q) }).success).toBe(false)
    expect(ChapterMapSchema.safeParse({ ideas: Array(6).fill(idea), questions: [{ ...q, options: ['a', 'b'] }] }).success).toBe(false)
  })
  it('missed ideas come back once each, in order', () => {
    expect(weakIdeas([{ idea: 3, right: false }, { idea: 1, right: true }, { idea: 3, right: false }, { idea: 0, right: false }])).toEqual([0, 3])
  })
  it('counts words and starts the daily limit at midnight India time', () => {
    expect(wordCount('  one two\nthree ')).toBe(3)
    expect(istDayStart(Date.UTC(2026, 9, 13, 20, 0))).toBe('2026-10-13T18:30:00.000Z') // 01:30 IST on 14 Oct → day began 18:30 UTC
  })
})
