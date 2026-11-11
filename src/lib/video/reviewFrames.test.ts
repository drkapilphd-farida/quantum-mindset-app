import { describe, expect, it } from 'vitest'
import { reviewFrameScale, reviewFrameSrc } from './reviewFrames'

describe('review video frames', () => {
  it('uses YouTube’s in-video frames, hq2 by default', () => {
    expect(reviewFrameSrc('abc')).toBe('https://i.ytimg.com/vi/abc/hq2.jpg')
    expect(reviewFrameSrc('abc', 1)).toBe('https://i.ytimg.com/vi/abc/hq1.jpg')
    expect(reviewFrameSrc('abc', 3)).toBe('https://i.ytimg.com/vi/abc/hq3.jpg')
  })

  it('zooms just enough that no black bar shows in each card shape', () => {
    // A Short in a 9:16 card: the bars are only at the sides — a tiny zoom.
    expect(reviewFrameScale(9 / 16, 'S')).toBeLessThan(1.05)
    // A landscape video in a 16:9 card, cropped at 35%: about 1.2.
    const landscape = reviewFrameScale(16 / 9, 'L')
    expect(landscape).toBeGreaterThan(1.1)
    expect(landscape).toBeLessThan(1.3)
    // Never zoom out.
    expect(reviewFrameScale(16 / 10, 'L')).toBeGreaterThanOrEqual(1)
  })
})
