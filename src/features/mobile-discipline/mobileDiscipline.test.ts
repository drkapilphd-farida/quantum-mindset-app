import { describe, expect, it } from 'vitest'
import { computeGoalStreak, istDate, isCompletedFocusSession, weeklySummary } from './mobileDiscipline'

describe('istDate', () => {
  it('rolls over at midnight India time, not UTC', () => {
    expect(istDate(new Date('2026-10-05T18:29:00Z'))).toBe('2026-10-05') // 23:59 IST
    expect(istDate(new Date('2026-10-05T18:31:00Z'))).toBe('2026-10-06') // 00:01 IST
  })
})

describe('computeGoalStreak', () => {
  const yes = (date: string): { date: string; withinGoal: boolean } => ({ date, withinGoal: true })
  const no = (date: string): { date: string; withinGoal: boolean } => ({ date, withinGoal: false })

  it('counts days in a row within the goal, ending today', () => {
    expect(computeGoalStreak([yes('2026-10-03'), yes('2026-10-04'), yes('2026-10-05')], '2026-10-05')).toBe(3)
  })

  it('keeps yesterday’s streak visible before today’s check-in', () => {
    expect(computeGoalStreak([yes('2026-10-03'), yes('2026-10-04')], '2026-10-05')).toBe(2)
  })

  it('restarts after a missed day or a “no” day', () => {
    expect(computeGoalStreak([yes('2026-10-01'), yes('2026-10-03'), yes('2026-10-04')], '2026-10-04')).toBe(2)
    expect(computeGoalStreak([yes('2026-10-03'), no('2026-10-04'), yes('2026-10-05')], '2026-10-05')).toBe(1)
    expect(computeGoalStreak([yes('2026-10-04'), no('2026-10-05')], '2026-10-05')).toBe(0)
  })

  it('crosses month boundaries', () => {
    expect(computeGoalStreak([yes('2026-09-30'), yes('2026-10-01')], '2026-10-01')).toBe(2)
  })
})

describe('weeklySummary', () => {
  it('totals the last 7 India-time days', () => {
    const summary = weeklySummary(
      [
        { plannedMinutes: 15, completedAt: '2026-10-05T04:00:00Z' },
        { plannedMinutes: 25, completedAt: '2026-10-05T12:00:00Z' },
        { plannedMinutes: 10, completedAt: '2026-10-01T04:00:00Z' },
        { plannedMinutes: 25, completedAt: '2026-09-20T04:00:00Z' }, // older than a week
      ],
      [
        { date: '2026-10-05', withinGoal: true },
        { date: '2026-10-04', withinGoal: false },
        { date: '2026-09-29', withinGoal: true }, // just outside the 7 days
      ],
      '2026-10-05',
    )
    expect(summary.days).toHaveLength(7)
    expect(summary.days[0]?.date).toBe('2026-09-29')
    expect(summary.focusMinutes).toBe(50)
    expect(summary.sessions).toBe(3)
    expect(summary.daysWithinGoal).toBe(2)
    expect(summary.daysCheckedIn).toBe(3)
  })
})

describe('isCompletedFocusSession', () => {
  const start = new Date('2026-10-05T10:00:00Z')
  it('accepts a session that ran its full length', () => {
    expect(isCompletedFocusSession(15, start, new Date('2026-10-05T10:15:00Z'))).toBe(true)
    expect(isCompletedFocusSession(15, start, new Date('2026-10-05T10:14:40Z'))).toBe(true) // within 30 s grace
  })
  it('rejects a session ended early or left open for hours', () => {
    expect(isCompletedFocusSession(15, start, new Date('2026-10-05T10:10:00Z'))).toBe(false)
    expect(isCompletedFocusSession(25, start, new Date('2026-10-05T14:00:00Z'))).toBe(false)
  })
})
