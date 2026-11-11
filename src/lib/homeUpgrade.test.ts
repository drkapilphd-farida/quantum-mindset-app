import { describe, expect, it } from 'vitest'
import { HOME_SESSION_REVIEW_IDS, homeV2 } from './homeV2Copy'
import { homeCopy } from './homeCopy'
import { REVIEW_VIDEOS } from '@/features/programs/reviewVideos'
import { SHARP_BRAIN_VIDEO_REVIEWS } from '@/config/sharpBrainVideoReviews'

// Owner's homepage upgrade (Nov 2026): wording exactly as given, Hindi for every line.
describe('homepage upgrade', () => {
  it('uses the owner’s trust strip, steps, Meet Dr. Kapil and CTA wording', () => {
    expect(homeV2.trust.map((t) => t.en)).toEqual(['PhD · 15 years professor', '12+ years mind coaching', '500+ workshops', "Featured on Solomon Daniel's Podcast"])
    expect(homeV2.howSessions.heading.en).toBe('How Personal Sessions work')
    expect(homeV2.howSessions.steps.map((s) => (s.rest === null ? s.lead.en : `${s.lead.en} — ${s.rest.en}`))).toEqual([
      'Clarity Session, 60 min, ₹1,100 — understand your pattern and feel the first shift.',
      'Your plan — from 2 days to 6 months; the ₹1,100 is adjusted if you choose a plan within 7 days.',
      '1-on-1 sessions + a meditation recording after every session.',
    ])
    expect(homeV2.howSessions.button.en).toBe('Book Clarity Session — ₹1,100')
    expect(homeV2.reviews.sessionsHeading.en).toBe("Personal Sessions — in clients' own words")
    expect(homeV2.meet.lines.map((l) => l.en)).toEqual([
      '15 years as a professor (PhD, English Literature).',
      '2016: a full year of sadhana in the Himalayas.',
      'Since 2015: Sharp Brain; 12+ years of 1-on-1 mind coaching.',
    ])
    expect(homeV2.meet.story.en).toBe('My story →')
    expect(homeV2.freeTools.overthinking.en).toBe('Free Overthinking Test — 3 minutes')
    expect(homeV2.freeTools.reading.en).toBe('Free Reading & Memory Test')
    expect(homeV2.finalCta.heading.hi).toBe('आपका पहला कदम आज।')
    expect(homeV2.finalCta.clarity.en).toBe('Book Clarity Session — ₹1,100')
    expect(homeV2.finalCta.sharpBrain.en).toBe('Explore Sharp Brain')
  })

  it('puts the Clarity Session question first in the FAQ, in both languages', () => {
    expect(homeCopy.en.faq.items[0]).toEqual({
      question: 'What happens in a Clarity Session?',
      answer:
        '60 minutes, 1-on-1 on Zoom: a short settling practice, I listen to your full story, explain your pattern in simple words, guide you through a technique for it, and show you a clear week-by-week path. You get the recording the same day.',
    })
    expect(homeCopy.hi.faq.items[0]?.question).toBe('क्लैरिटी सेशन में क्या होता है?')
  })

  it('shows only Personal Sessions review Shorts in the second reviews row (no Sharp Brain)', () => {
    const sharpBrain = new Set(SHARP_BRAIN_VIDEO_REVIEWS.map((v) => v.videoId))
    for (const id of HOME_SESSION_REVIEW_IDS) {
      const video = REVIEW_VIDEOS.find((v) => v.id === id)
      expect(video, id).toBeDefined()
      expect(video?.type, id).toBe('S')
      expect(sharpBrain.has(id), id).toBe(false)
    }
  })
})
