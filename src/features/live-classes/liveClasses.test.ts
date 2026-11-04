import { describe, expect, it } from 'vitest'
import { canRegister, classesDone, csvCell, evaluateGuarantee, formatSessionDate, formatSessionTime, isoToIst, istToIso, nextClassToJoin, nextCycleSessions, nextCycleSlot, cycleSlots, nextSessionFor, toCsv, upcomingSessions, type GuaranteeReading, type Session } from './liveClasses'

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
  it('cycle: Mon & Thu 8–9 pm from Mon 9 Nov, Classes 1–7 in order, then again', () => {
    const slots = cycleSlots(0, 9)
    expect(slots.map((s) => [s.classNumber, s.date])).toEqual([
      [1, '2026-11-09'], [2, '2026-11-12'], [3, '2026-11-16'], [4, '2026-11-19'], [5, '2026-11-23'], [6, '2026-11-26'], [7, '2026-11-30'], [1, '2026-12-03'], [2, '2026-12-07'],
    ])
    expect(isoToIst(slots[0]!.startsAt)).toEqual({ date: '2026-11-09', time: '20:00' })
    expect(isoToIst(slots[0]!.endsAt)).toEqual({ date: '2026-11-09', time: '21:00' })
  })
  it('next class: before the first cycle → 9 Nov; during a class day → the next one', () => {
    expect(nextCycleSlot(Date.parse('2026-11-04T12:00:00+05:30'))?.date).toBe('2026-11-09')
    expect(nextCycleSlot(Date.parse('2026-11-09T19:59:00+05:30'))?.date).toBe('2026-11-09')
    expect(nextCycleSlot(Date.parse('2026-11-09T20:01:00+05:30'))).toMatchObject({ date: '2026-11-12', classNumber: 2 })
  })
  it('a skipped date moves the cycle on without skipping a class number', () => {
    const pattern = { weekdays: [1, 4], startIst: '20:00', endIst: '21:00', firstCycleStart: '2026-11-09', skipDates: ['2026-11-12'] }
    expect(cycleSlots(0, 3, pattern).map((s) => [s.classNumber, s.date])).toEqual([[1, '2026-11-09'], [2, '2026-11-16'], [3, '2026-11-19']])
  })
  it('create next cycle: 7 sessions right after the latest one', () => {
    const now = Date.parse('2026-11-04T12:00:00+05:30')
    expect(nextCycleSessions(istToIso('2026-11-05', '19:00'), now).map((s) => s.date)).toEqual(['2026-11-09', '2026-11-12', '2026-11-16', '2026-11-19', '2026-11-23', '2026-11-26', '2026-11-30'])
    const next = nextCycleSessions(istToIso('2026-11-30', '20:00'), now)
    expect(next.map((s) => [s.classNumber, s.date])[0]).toEqual([1, '2026-12-03'])
    expect(next).toHaveLength(7)
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

describe('next class to join (dashboard card)', () => {
  const now = Date.parse('2026-10-15T10:00:00Z')
  const s = (classNumber: number, startsAt: string, status: Session['status'] = 'published'): Pick<Session, 'classNumber' | 'startsAt' | 'status'> => ({ classNumber, startsAt, status })
  it('is the soonest open class the learner has not done', () => {
    const sessions = [s(2, '2026-10-25T13:30:00Z'), s(1, '2026-10-18T13:30:00Z'), s(3, '2026-10-20T13:30:00Z')]
    expect(nextClassToJoin(sessions, new Set(), now)?.classNumber).toBe(1)
    expect(nextClassToJoin(sessions, new Set([1]), now)?.classNumber).toBe(3)
  })
  it('skips cancelled, draft and already-started sessions', () => {
    const sessions = [s(1, '2026-10-18T13:30:00Z', 'cancelled'), s(2, '2026-10-14T13:30:00Z'), s(3, '2026-10-19T13:30:00Z', 'draft')]
    expect(nextClassToJoin(sessions, new Set(), now)).toBeNull()
  })
})
