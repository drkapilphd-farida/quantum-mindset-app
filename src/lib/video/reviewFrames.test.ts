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

describe('owner’s frame picks (Nov 2026)', () => {
  it('uses hq3 for the 4 chosen videos and hq2 for every other review video', async () => {
    const { REVIEW_VIDEOS } = await import('@/features/programs/reviewVideos')
    const { SHARP_BRAIN_VIDEO_REVIEWS } = await import('@/config/sharpBrainVideoReviews')
    const picks: Record<string, number> = { LxZC82BlYiM: 3, R6f1_LEWOMs: 3, BOqf3ioo1N4: 3, '2wSuE6hQrEg': 3 }
    const all = [...REVIEW_VIDEOS.map((v) => [v.id, v.thumbFrame] as const), ...SHARP_BRAIN_VIDEO_REVIEWS.map((v) => [v.videoId, v.thumbFrame] as const)]
    for (const [id, frame] of all) expect(frame ?? 2, id).toBe(picks[id] ?? 2)
    expect(all.filter(([, frame]) => frame !== undefined)).toHaveLength(4)
  })
})
