import { describe, expect, it } from 'vitest'
import { CLARITY_CARD, COMMON, DISCLAIMERS, JOURNEY, QUOTE, WHAT_YOU_GET } from './common'
import { HUB, QUIZ_RESULTS } from './hubCopy'
import { PROGRAMS, PROGRAM_SLUGS, bookingHref, getProgram, isProgramSlug } from './programs'

// The owner's content rules and approved copy (Nov 8, 2026). The required
// disclaimer sentences contain "treatment"; that is the only place it may appear.
const REQUIRED = [
  DISCLAIMERS.mind.en,
  HUB.faq.disclaimer.en,
  // In the owner's approved copy (Stress FAQ "Is this therapy?") — a denial, kept word for word; flagged to the owner.
  "It is coaching and mind training support, not medical treatment. If you are under a doctor's care, continue it; these sessions can run alongside.",
]
const strip = (text: string): string => REQUIRED.reduce((acc, sentence) => acc.split(sentence).join(''), text)
const ALL_EN = (): string => strip(JSON.stringify([PROGRAMS, HUB, COMMON, CLARITY_CARD, JOURNEY, QUOTE, WHAT_YOU_GET, DISCLAIMERS].map((x) => JSON.parse(JSON.stringify(x, (key, value: unknown) => (key === 'hi' ? undefined : value))))))

describe('program pages content', () => {
  it('has all 15 programs, each with a unique slug', () => {
    expect(PROGRAMS).toHaveLength(15)
    expect(new Set(PROGRAM_SLUGS).size).toBe(15)
  })

  it('follows the approved structure: 5 sound-like points, 5 changes, 4 FAQs, 3 related', () => {
    for (const p of PROGRAMS) {
      expect(p.soundLike, p.slug).toHaveLength(5)
      expect(p.changes, p.slug).toHaveLength(5)
      expect(p.faqs, p.slug).toHaveLength(4)
      expect(p.related, p.slug).toHaveLength(3)
      for (const r of p.related) {
        expect(isProgramSlug(r), `${p.slug} → ${r}`).toBe(true)
        expect(r).not.toBe(p.slug)
      }
    }
  })

  it('bolds the sentence that begins "What is missing" wherever the copy has one', () => {
    for (const p of PROGRAMS) {
      if (p.why.missing !== undefined) expect(p.why.missing.en.startsWith('What is missing'), p.slug).toBe(true)
      expect(p.why.before.en).not.toContain('What is missing')
    }
  })

  it('keeps the Personal Retreat place FAQ hidden until the owner sends the text', () => {
    const faq = getProgram('personal-retreat').faqs.find((f) => f.q.en === 'Where does it happen?')
    expect(faq?.hidden).toBe(true)
    for (const p of PROGRAMS) for (const f of p.faqs) if (f.a.en.includes('PLACEHOLDER')) expect(f.hidden, p.slug).toBe(true)
  })

  it('never says cure, treat, heal, guarantee or blindfold (outside the required disclaimers)', () => {
    const all = ALL_EN().toLowerCase()
    // Whole words only: "retreat" and "health" are fine.
    for (const pattern of [/\bcur(e|es|ed|ing)\b/, /\btreat/, /\bheal(?!th)/, /\bguarantee/, /\bblindfold/]) {
      expect(all, String(pattern)).not.toMatch(pattern)
    }
  })

  it('shows the required disclaimers on the right pages', () => {
    for (const slug of ['stress-anxiety-support', 'mindset-coaching', 'subconscious-reprogramming', 'business-loss-mindset', 'heart-brain-coherence'] as const) {
      expect(getProgram(slug).disclaimers, slug).toEqual(['mind'])
    }
    expect(getProgram('intuition-for-traders').disclaimers).toEqual(['traders'])
    for (const slug of ['samadhi-meditation', 'kundalini-meditation', 'astral-projection'] as const) {
      expect(getProgram(slug).disclaimers, slug).toEqual(['foundation'])
    }
    expect(DISCLAIMERS.mind.en).toBe(
      'This is coaching and mind training, not medical treatment. If you are in serious distress or have thoughts of harming yourself, please contact a doctor or a mental health professional immediately.',
    )
    expect(DISCLAIMERS.traders.en).toBe('Mind and intuition training only. This is not financial or investment advice.')
    expect(DISCLAIMERS.foundation.en).toBe('Taught only after the foundation level, with personal guidance at every step. Please tell Dr. Kapil about any health conditions before you start.')
  })

  it('uses the Clarity Session price and length from the owner: ₹1,100 · 60 minutes', () => {
    expect(COMMON.bookButton.en).toBe('Book a Clarity Session — ₹1,100')
    expect(CLARITY_CARD.price.en).toBe('₹1,100 · 60 minutes')
    expect(CLARITY_CARD.note.en).toBe('Fully adjusted in your fee if you join a program within 7 days.')
    const all = ALL_EN()
    expect(all).not.toContain('2,100')
    expect(all).not.toMatch(/\b75\b/)
  })

  it('uses the experience line from the owner', () => {
    expect(COMMON.experience.en).toBe('12+ years of mind coaching · 15 years as a professor')
  })
})

describe('hub quiz', () => {
  it('matches the owner’s mapping exactly', () => {
    expect(QUIZ_RESULTS).toEqual({
      'mind-change': ['stress-anxiety-support', 'subconscious-reprogramming'],
      'mind-learn': ['mindset-coaching', 'heart-brain-coherence'],
      'rel-change': ['heart-brain-coherence', 'telepathy'],
      'rel-learn': ['telepathy', 'manifestation'],
      'perf-change': ['intuition-for-traders', 'heart-brain-coherence'],
      'perf-learn': ['intuition-for-traders', 'heart-brain-coherence'],
      'spirit-change': ['cosmic-fusion', 'chakra-activation'],
      'spirit-learn': ['aura-reading', 'telepathy'],
    })
  })

  it('builds the booking link with the program pre-selected', () => {
    expect(bookingHref('telepathy', 'en')).toBe('/personal-sessions?program=telepathy#book')
    expect(bookingHref('telepathy', 'hi')).toBe('/personal-sessions?program=telepathy&lang=hi#book')
    expect(bookingHref(null, 'en')).toBe('/personal-sessions#book')
  })
})
