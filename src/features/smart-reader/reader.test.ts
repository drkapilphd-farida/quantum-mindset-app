import { describe, expect, it } from 'vitest'
import { backOneSentence, clusters, effectiveWpm, focusIndex, nextWpm, splitIntoSections, startWpm, wordDurationMs, words } from './reader'

describe('Smart Reader logic', () => {
  it('starts at the measured speed + 10%, else 180', () => {
    expect(startWpm(200)).toBe(220)
    expect(startWpm(null)).toBe(180)
  })
  it('adapts speed after each section', () => {
    expect(nextWpm(200, 3, 3)).toEqual({ wpm: 215, suggestPacer: false })
    expect(nextWpm(200, 2, 3)).toEqual({ wpm: 200, suggestPacer: false })
    expect(nextWpm(200, 1, 3)).toEqual({ wpm: 180, suggestPacer: true })
    expect(effectiveWpm(240, 75)).toBe(180)
  })
  it('never cuts a Devanagari conjunct', () => {
    expect(clusters('क्षमता')).toEqual(['क्ष', 'म', 'ता'])
    const w = 'विद्यार्थी'
    const i = focusIndex(w)
    expect(clusters(w)[i]).toBeTruthy()
  })
  it('gives long words, numbers and sentence ends more time', () => {
    const base = wordDurationMs('cat', 300)
    expect(wordDurationMs('extraordinary', 300)).toBeGreaterThan(base)
    expect(wordDurationMs('1947', 300)).toBeGreaterThan(base)
    expect(wordDurationMs('end.', 300)).toBeGreaterThan(wordDurationMs('end,', 300))
    expect(wordDurationMs('end.', 300, true)).toBeGreaterThan(wordDurationMs('end.', 300))
  })
  it('back one sentence', () => {
    const ws = words('One two three. Four five six seven eight nine. Ten eleven.')
    expect(backOneSentence(ws, 7)).toBe(3) // well into a sentence → its start
    expect(backOneSentence(ws, 9)).toBe(3) // just started a sentence → the one before
    expect(backOneSentence(ws, 1)).toBe(0)
  })
  it('splits own material into sections of about 300–500 words at paragraph ends, keeping headings', () => {
    const para = (n: number): string => Array.from({ length: n }, (_, i) => `word${i}`).join(' ') + '.'
    const text = ['The Cell', para(150), para(150), para(150), 'Cell Parts', para(200), para(200), para(60)].join('\n\n')
    const s = splitIntoSections(text)
    expect(s.length).toBeGreaterThanOrEqual(2)
    expect(s[0]!.heading).toBe('The Cell')
    for (const sec of s) expect(words(sec.text).length).toBeLessThanOrEqual(650)
    expect(words(s.map((x) => x.text).join(' ')).length).toBe(910)
  })
})
