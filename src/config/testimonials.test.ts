import { describe, expect, it } from 'vitest'
import { HOME_LEARNING_VIDEO_REVIEWS, isEarlierBatchTitle, videoTestimonialsForProgram } from './testimonials'

const BANNED = /quantum|क्वांटम|\bqsr\b|right[ -]brain|midbrain|photographic|telepathy|टेलीपैथी|guarantee|100%/i

describe('homepage Learning video reviews', () => {
  const visible = HOME_LEARNING_VIDEO_REVIEWS.filter((video) => !video.hidden)

  it('shows the six supplied videos in order', () => {
    expect(visible.map((video) => video.videoId)).toEqual([
      'uNWLFqACpDU',
      'WZMSSuRTr78',
      'pRG3sdsXiHM',
      'l_3qAC_pgPI',
      's87Pxs0EP58',
      'ZyD_iQTOR60',
    ])
    for (const video of visible) {
      expect(video.videoUrl).toBe(`https://youtu.be/${video.videoId}`)
      expect(video).toMatchObject({ source: 'YouTube', verified: true, program: 'workshops' })
    }
  })

  it('keeps the earlier videos as hidden data', () => {
    expect(HOME_LEARNING_VIDEO_REVIEWS.filter((video) => video.hidden)).toHaveLength(6)
  })

  it('has no banned words or claims in visible captions', () => {
    for (const video of visible) {
      expect(video.caption).not.toMatch(BANNED)
      expect(video.captionHi).not.toMatch(BANNED)
    }
  })

  it('never lists the workshop videos as Sharp Brain reviews', () => {
    expect(videoTestimonialsForProgram('sharpBrain')).toHaveLength(0)
    expect(videoTestimonialsForProgram('workshops')).toHaveLength(6)
  })

  it('flags only titles that name the old program', () => {
    expect(isEarlierBatchTitle('Quantum Speed Reading review')).toBe(true)
    expect(isEarlierBatchTitle('QSR batch')).toBe(true)
    expect(visible.some((video) => isEarlierBatchTitle(video.youtubeTitle))).toBe(false)
  })
})
