import { describe, expect, it } from 'vitest'
import { HUB_REVIEWS, PROGRAM_REVIEWS, REVIEW_CHIPS, REVIEW_LINE, REVIEW_VIDEOS, reviewVideo, topicTag } from './reviewVideos'
import { PROGRAM_SLUGS } from './programs'

describe('Personal Sessions review videos (owner brief, Nov 2026)', () => {
  it('has the 77 videos of the brief plus the 3 the owner added back, each once', () => {
    expect(REVIEW_VIDEOS).toHaveLength(80)
    expect(new Set(REVIEW_VIDEOS.map((v) => v.id)).size).toBe(80)
    for (const id of ['uNWLFqACpDU', 'Tf1zH0uHW_k', 'nwyXXshYg3Y']) expect(reviewVideo(id).type).toBe('S')
  })

  it('places only known videos, on every program page and the hub', () => {
    expect(Object.keys(PROGRAM_REVIEWS).sort()).toEqual([...PROGRAM_SLUGS].sort())
    for (const ids of [HUB_REVIEWS, ...Object.values(PROGRAM_REVIEWS)]) {
      expect(ids.length).toBeGreaterThanOrEqual(3)
      for (const id of ids) expect(() => reviewVideo(id)).not.toThrow()
    }
    expect(HUB_REVIEWS.slice(0, 3)).toEqual(['eFskqwYdrw4', 'h6KiUZKXqKM', 'X66b3WfrsZw'])
    expect(PROGRAM_REVIEWS.telepathy.slice(0, 3)).toEqual(['h6KiUZKXqKM', 'uir34_yIUGo', 'KJXvSaGjHJk'])
    expect(PROGRAM_REVIEWS['cosmic-fusion'].slice(-2)).toEqual(['Tf1zH0uHW_k', 'nwyXXshYg3Y'])
    expect(PROGRAM_REVIEWS['samadhi-meditation'].at(-1)).toBe('uNWLFqACpDU')
  })

  it('keeps the site rule: no "heal" or "guarantee" in any caption', () => {
    for (const v of REVIEW_VIDEOS) {
      expect(v.caption.en.toLowerCase(), v.id).not.toMatch(/\bheal(?!th)|guarantee/)
      expect(v.caption.hi.length, v.id).toBeGreaterThan(0)
    }
  })

  it('has the owner’s chips and the line under every review section', () => {
    expect(REVIEW_CHIPS.map((c) => c.label.en)).toEqual(['All', 'Telepathy', 'Cosmic Fusion & Meditation', 'Kundalini, Samadhi & Astral', 'Mind & Confidence', 'Retreat', 'Intuition'])
    expect(REVIEW_LINE.en).toBe("Individual experiences of past participants. Every person's experience is different.")
    expect(topicTag(reviewVideo('h6KiUZKXqKM')).en).toBe('Telepathy')
  })
})
