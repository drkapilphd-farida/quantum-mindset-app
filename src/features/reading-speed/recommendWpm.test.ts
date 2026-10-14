import { describe, expect, it } from 'vitest'
import { recommendWpm } from './recommendWpm'

const OPTIONS = [100, 150, 200, 250, 300, 350, 400, 450, 500]

describe('recommended target speed', () => {
  it('is a little above the measured speed, on the nearest option', () => {
    expect(recommendWpm(180, OPTIONS)).toBe(200) // 198
    expect(recommendWpm(250, OPTIONS)).toBe(250) // 275 → tie → slower
    expect(recommendWpm(320, OPTIONS)).toBe(350) // 352
  })
  it('stays inside the options', () => {
    expect(recommendWpm(60, OPTIONS)).toBe(100)
    expect(recommendWpm(900, OPTIONS)).toBe(500)
  })
  it('is empty without a measurement', () => {
    expect(recommendWpm(null, OPTIONS)).toBeNull()
    expect(recommendWpm(0, OPTIONS)).toBeNull()
  })
})
