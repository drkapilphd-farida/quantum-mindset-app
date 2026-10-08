import { describe, expect, it } from 'vitest'
import { cleanReminderTime, isReminderTime, istDateKey, reminderKind, startsTomorrow, streakDays, todayStatus } from './reminders'

const ist = (local: string): number => Date.parse(`${local}+05:30`)
const at = (local: string): string => new Date(ist(local)).toISOString()

describe('today status (the banner)', () => {
  it('a new learner: Day 1 is ready', () => {
    expect(todayStatus([], null, ist('2026-10-15T09:00:00'))).toEqual({ kind: 'ready', day: 1 })
  })
  it('finished today under pace control: the next day opens at midnight', () => {
    const opens = at('2026-10-16T00:00:00')
    expect(todayStatus([{ day: 5, completedAt: at('2026-10-15T20:00:00') }], opens, ist('2026-10-15T21:00:00'))).toEqual({ kind: 'opens_later', day: 6, opensAt: opens })
  })
  it('the day after: ready; after 2 missed days: missed 2, nothing reset', () => {
    const c = [{ day: 5, completedAt: at('2026-10-15T20:00:00') }]
    expect(todayStatus(c, null, ist('2026-10-16T08:00:00'))).toEqual({ kind: 'ready', day: 6 })
    expect(todayStatus(c, null, ist('2026-10-18T08:00:00'))).toEqual({ kind: 'missed', day: 6, missedDays: 2 })
  })
  it('India dates, not UTC: 11:30 pm and 12:30 am are different days', () => {
    expect(istDateKey(ist('2026-10-15T23:30:00'))).toBe('2026-10-15')
    expect(istDateKey(ist('2026-10-16T00:30:00'))).toBe('2026-10-16')
  })
  it('all 30 days: complete', () => {
    expect(todayStatus([{ day: 30, completedAt: at('2026-10-15T20:00:00') }], null, ist('2026-10-16T08:00:00'))).toEqual({ kind: 'complete' })
  })
})

describe('streak', () => {
  const c = (dates: string[]): { day: number; completedAt: string }[] => dates.map((d, i) => ({ day: i + 1, completedAt: at(`${d}T19:00:00`) }))
  it('counts calendar days in a row ending today or yesterday', () => {
    const days = c(['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15'])
    expect(streakDays(days, ist('2026-10-15T21:00:00'))).toBe(4)
    expect(streakDays(days, ist('2026-10-16T08:00:00'))).toBe(4)
    expect(streakDays(days, ist('2026-10-17T08:00:00'))).toBe(0)
  })
})

describe('phone reminder timing and message', () => {
  it('due from the chosen time, for up to 3 hours', () => {
    expect(isReminderTime('19:00', ist('2026-10-15T18:59:00'))).toBe(false)
    expect(isReminderTime('19:00:00', ist('2026-10-15T19:05:00'))).toBe(true)
    expect(isReminderTime('19:00', ist('2026-10-15T22:01:00'))).toBe(false)
  })
  it('check-in day first, then a class tomorrow, then a long absence, else daily', () => {
    expect(reminderKind({ kind: 'ready', day: 7 }, true)).toBe('checkin')
    expect(reminderKind({ kind: 'ready', day: 1 }, false)).toBe('daily')
    expect(reminderKind({ kind: 'ready', day: 6 }, true)).toBe('live_class')
    expect(reminderKind({ kind: 'missed', day: 6, missedDays: 2 }, false)).toBe('missed')
    expect(reminderKind({ kind: 'missed', day: 6, missedDays: 1 }, false)).toBe('daily')
  })
  it('class tomorrow in India time', () => {
    expect(startsTomorrow(at('2026-10-18T19:00:00'), ist('2026-10-17T19:00:00'))).toBe(true)
    expect(startsTomorrow(at('2026-10-18T19:00:00'), ist('2026-10-18T08:00:00'))).toBe(false)
  })
  it('reminder time: 6 am to 10 pm, quarter hours', () => {
    expect(cleanReminderTime('19:00')).toBe('19:00')
    expect(cleanReminderTime('05:45')).toBeNull()
    expect(cleanReminderTime('22:15')).toBeNull()
    expect(cleanReminderTime('19:10')).toBeNull()
  })
})
