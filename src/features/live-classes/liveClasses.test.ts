import { describe, expect, it } from 'vitest'
import { canRegister, classesDone, copyCycle, csvCell, evaluateGuarantee, formatSessionDate, formatSessionTime, isoToIst, istToIso, lastCycle, nextSessionFor, toCsv, upcomingSessions, type GuaranteeReading, type Session } from './liveClasses'

const session = (over: Partial<Session>): Session => ({ id: 's', classNumber: 1, topicOverride: null, startsAt: istToIso('2026-10-18', '19:00'), endsAt: istToIso('2026-10-18', '21:00'), status: 'published', ...over })
const NOW = Date.parse('2026-10-14T06:00:00Z')

describe('progress across cycles', () => {
  it('counts class numbers attended live or by an approved recording, once each', () => {
    const done = classesDone([
      { classNumber: 1, kind: 'live', counts: true },
      { classNumber: 2, kind: 'live', counts: true },
      { classNumber: 4, kind: 'live', counts: true },
      { classNumber: 3, kind: 'live', counts: true }, // November cycle
      { classNumber: 1, kind: 'live', counts: true }, // a refresher
      { classNumber: 5, kind: 'recording', counts: false }, // not approved
    ])
    expect([...done].sort()).toEqual([1, 2, 3, 4])
  })
})

describe('schedule', () => {
  const sessions = [
    session({ id: 'a', classNumber: 1 }),
    session({ id: 'b', classNumber: 3, startsAt: istToIso('2026-10-29', '19:00'), endsAt: istToIso('2026-10-29', '21:00') }),
    session({ id: 'c', classNumber: 2, status: 'draft', startsAt: istToIso('2026-10-25', '19:00'), endsAt: istToIso('2026-10-25', '21:00') }),
    session({ id: 'd', classNumber: 2, status: 'cancelled', startsAt: istToIso('2026-10-21', '19:00'), endsAt: istToIso('2026-10-21', '21:00') }),
  ]
  it('registration is open until the class starts, for published sessions', () => {
    expect(canRegister(sessions[0]!, NOW)).toBe(true)
    expect(canRegister(sessions[0]!, Date.parse(sessions[0]!.startsAt) + 1)).toBe(false)
    expect(canRegister(sessions[2]!, NOW)).toBe(false)
    expect(canRegister(sessions[3]!, NOW)).toBe(false)
  })
  it('upcoming: no drafts, soonest first; next date per class number', () => {
    expect(upcomingSessions(sessions, NOW).map((s) => s.id)).toEqual(['a', 'd', 'b'])
    expect(nextSessionFor(3, sessions, NOW)?.id).toBe('b')
    expect(nextSessionFor(2, sessions, NOW)).toBeNull()
  })
  it('IST dates and times in the learner language, with 0–9 digits', () => {
    expect(formatSessionDate(istToIso('2026-10-29', '19:00'), 'en')).toBe('Thu, 29 Oct')
    expect(formatSessionTime(istToIso('2026-10-29', '19:00'), 'en')).toBe('7:00 pm')
    expect(formatSessionDate(istToIso('2026-10-29', '19:00'), 'mr')).toMatch(/29/)
    expect(isoToIst(istToIso('2026-11-15', '19:00'))).toEqual({ date: '2026-11-15', time: '19:00' })
  })
  it('copy last cycle: latest session per class number, 4 weeks later', () => {
    const cycle = lastCycle([...sessions, session({ id: 'e', classNumber: 1, startsAt: istToIso('2026-09-20', '19:00') })])
    expect(cycle.map((s) => s.id)).toEqual(['a', 'b'])
    const next = copyCycle(cycle)
    expect(isoToIst(next[0]!.startsAt)).toEqual({ date: '2026-11-15', time: '19:00' })
  })
})

describe('refund guarantee checks (admin only)', () => {
  const day30 = '2026-11-20T10:00:00Z'
  const base = { daysCompleted: 30, day30CompletedAt: day30, classesCounted: 7, now: Date.parse('2026-11-22T00:00:00Z') }
  const readings = (b: number, c: number, f: number, fc: number, cp?: number): GuaranteeReading[] => [
    { kind: 'baseline' as const, effectiveWpm: b, comprehensionPercent: c },
    ...(cp === undefined ? [] : [{ kind: 'checkpoint' as const, effectiveWpm: cp, comprehensionPercent: c }]),
    { kind: 'final' as const, effectiveWpm: f, comprehensionPercent: fc },
  ]
  it('qualifies only when every condition holds and BOTH measures show no improvement', () => {
    expect(evaluateGuarantee({ ...base, readings: readings(120, 80, 110, 80) }).qualifies).toBe(true)
    expect(evaluateGuarantee({ ...base, readings: readings(120, 80, 110, 90) }).noImprovement).toBe(false) // retention improved
    expect(evaluateGuarantee({ ...base, readings: readings(120, 80, 150, 60) }).noImprovement).toBe(false) // speed improved
  })
  it('each condition can fail on its own', () => {
    const r = readings(120, 80, 110, 80)
    expect(evaluateGuarantee({ ...base, daysCompleted: 29, readings: r }).qualifies).toBe(false)
    expect(evaluateGuarantee({ ...base, classesCounted: 6, readings: r }).qualifies).toBe(false)
    expect(evaluateGuarantee({ ...base, readings: r.slice(1) }).bothTests).toBe(false)
    const late = evaluateGuarantee({ ...base, readings: r, now: Date.parse('2026-11-27T10:00:01Z') })
    expect(late.claimWindow?.open).toBe(false)
    expect(late.qualifies).toBe(false)
  })
  it('flags "check before refund" when a checkpoint improved but Day 30 did not', () => {
    expect(evaluateGuarantee({ ...base, readings: readings(120, 80, 110, 80, 160) }).checkBeforeRefund).toBe(true)
    expect(evaluateGuarantee({ ...base, readings: readings(120, 80, 110, 80, 115) }).checkBeforeRefund).toBe(false)
  })
})

describe('CSV for Excel', () => {
  it('keeps every script, quotes commas, neutralises formulas', () => {
    const csv = toCsv([['Name', 'Note'], ['विकास यादव', 'a, b'], ['=HYPERLINK("x")', null]])
    expect(csv.startsWith('﻿')).toBe(true)
    expect(csv).toContain('विकास यादव,"a, b"')
    expect(csvCell('=1+1')).toBe("'=1+1")
  })
})
