import { describe, expect, it } from 'vitest'
import { answer, current, finished, isRetry, startQueue, willComeBack } from './retryQueue'

describe('retry queue', () => {
  it('asks a missed item once more at the end; only first tries count', () => {
    let q = startQueue([2, 0, 1])
    expect(willComeBack(q)).toBe(true)
    q = answer(q, false) // 2 missed → comes back
    q = answer(q, true) // 0
    q = answer(q, true) // 1
    expect(current(q)).toBe(2)
    expect(isRetry(q)).toBe(true)
    expect(willComeBack(q)).toBe(false)
    q = answer(q, true) // retry right — does not count
    expect(finished(q)).toBe(true)
    expect(q.correctFirst).toBe(2)
  })
  it('a missed retry does not come back again', () => {
    let q = startQueue([0])
    q = answer(q, false)
    q = answer(q, false)
    expect(finished(q)).toBe(true)
    expect(q.correctFirst).toBe(0)
  })
})
