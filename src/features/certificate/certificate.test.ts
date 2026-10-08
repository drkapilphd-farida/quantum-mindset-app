import { describe, expect, it } from 'vitest'
import type { FairResult } from '@/features/fair-reading-test/fairTest'
import { jpegToPdf } from './pdf'
import { baselineDay, buildSnapshot, cleanLearnerName, completedOnIst, formatCertDate, gainPercent, gainPoints, generateCode, normalizeCode, publicName } from './certificate'

const result = (over: Partial<FairResult>): FairResult => ({ kind: 'baseline', day: 1, form: 'A', lang: 'en', wpm: 182, comprehensionPercent: 70, effectiveWpm: 127, status: 'valid', createdAt: '2026-09-15T04:00:00Z', ...over })

describe('certificate ID', () => {
  it('looks like SB-XXXX-XXXX in Crockford base32', () => {
    let i = 0
    const code = generateCode((n) => (i++ * 7) % n)
    expect(code).toMatch(/^SB-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/)
  })
  it('accepts IDs typed loosely', () => {
    expect(normalizeCode('sb-7k4m-q2xp')).toBe('SB-7K4M-Q2XP')
    expect(normalizeCode(' 7K4M Q2XP ')).toBe('SB-7K4M-Q2XP')
    expect(normalizeCode('SB-7K4O-Q2XP')).toBe('SB-7K40-Q2XP')
    expect(normalizeCode('SB-123')).toBeNull()
    expect(normalizeCode('SB-UUUU-UUUU')).toBeNull()
  })
})

describe('names', () => {
  it('cleans the printed name in any script', () => {
    expect(cleanLearnerName('  Ananya   Sharma ')).toBe('Ananya Sharma')
    expect(cleanLearnerName('विकास यादव')).toBe('विकास यादव')
    expect(cleanLearnerName("D'Souza")).toBe("D'Souza")
    expect(cleanLearnerName('A')).toBeNull()
    expect(cleanLearnerName('<script>')).toBeNull()
    expect(cleanLearnerName('Rahul 123')).toBeNull()
  })
  it('public page shows first name + last initial only', () => {
    expect(publicName('Rahul Sharma')).toBe('Rahul S.')
    expect(publicName('Ananya Rao Sharma')).toBe('Ananya S.')
    expect(publicName('विकास यादव')).toBe('विकास य.')
    expect(publicName('Priya')).toBe('Priya')
  })
})

describe('snapshot', () => {
  const completed = Array.from({ length: 30 }, (_, i) => `2026-09-${String(i + 1).padStart(2, '0')}T10:00:00Z`)
  it('first fair test vs Day 30, in the same language', () => {
    const s = buildSnapshot([result({}), result({ kind: 'final', day: 30, form: 'B', wpm: 264, comprehensionPercent: 85, effectiveWpm: 224 })], completed, { memory: 82, retention: 74 })
    expect(s.reading?.before).toEqual({ wpm: 182, comprehension: 70, effective: 127, day: 1 })
    expect(s.reading?.after.effective).toBe(224)
    expect(s.memory).toEqual({ memory: 82, retention: 74 })
  })
  it('one-time baseline: day = days completed before it + 1', () => {
    expect(baselineDay({ day: null, createdAt: '2026-09-12T05:00:00Z' }, completed)).toBe(12)
    expect(baselineDay({ day: 1, createdAt: '2026-09-12T05:00:00Z' }, completed)).toBe(1)
  })
  it('no fair baseline: Day 30 only; no Memory Palace: box left off', () => {
    const s = buildSnapshot([result({ kind: 'final', day: 30 })], completed, { memory: null, retention: null })
    expect(s.reading?.before).toBeNull()
    expect(s.reading?.after.wpm).toBe(182)
    expect(s.memory).toBeNull()
  })
  it('no Day 30 fair result: no reading section', () => {
    expect(buildSnapshot([result({})], completed, { memory: 50, retention: null }).reading).toBeNull()
  })
})

describe('changes show only when a number went up', () => {
  it('percent and points', () => {
    expect(gainPercent(182, 264)).toBe('+45%')
    expect(gainPercent(264, 182)).toBeNull()
    expect(gainPercent(100, 100)).toBeNull()
    expect(gainPoints(70, 85)).toBe(15)
    expect(gainPoints(85, 70)).toBeNull()
  })
})

describe('dates', () => {
  it('completion date is the calendar date in India', () => {
    expect(completedOnIst('2026-10-13T20:00:00Z')).toBe('2026-10-14')
  })
  it('formats in the certificate language', () => {
    expect(formatCertDate('2026-10-14', 'en')).toBe('14 October 2026')
    expect(formatCertDate('2026-10-14', 'hi')).toBe('14 अक्टूबर 2026')
    // Same 0–9 digits as every other number on the certificate.
    expect(formatCertDate('2026-10-14', 'mr')).toMatch(/14/)
    expect(formatCertDate('2026-10-14', 'bn')).toMatch(/2026/)
  })
})

describe('PDF', () => {
  it('one A4 landscape page whose cross-reference offsets point at each object', () => {
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9])
    const pdf = jpegToPdf(jpeg, 2480, 1754, 'Sharp Brain certificate SB-7K4M-Q2XP')
    const text = new TextDecoder('latin1').decode(pdf)
    expect(text.startsWith('%PDF-1.4')).toBe(true)
    expect(text).toContain('/MediaBox [0 0 841.89 595.28]')
    const xrefAt = Number(text.slice(text.lastIndexOf('startxref') + 10).trim().split('\n')[0])
    expect(text.slice(xrefAt, xrefAt + 4)).toBe('xref')
    const rows = text.slice(xrefAt).split('\n').slice(3, 9)
    rows.forEach((row, i) => expect(text.slice(Number(row.slice(0, 10)), Number(row.slice(0, 10)) + 7)).toBe(`${i + 1} 0 obj`))
  })
})
