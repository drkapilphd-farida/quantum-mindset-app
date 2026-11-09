import { describe, expect, it } from 'vitest'
import { CLARITY_CARD, COMMON, DISCLAIMERS, FULL_RECORDINGS_FAQ, JOURNEY, QUOTE, TRUST, WHAT_YOU_GET } from './common'
import { PLANS, PLAN_COPY, PROGRAM_PLANS } from './plans'
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
const ALL_EN = (): string => strip(JSON.stringify([PROGRAMS, HUB, COMMON, CLARITY_CARD, JOURNEY, QUOTE, WHAT_YOU_GET, DISCLAIMERS, PLANS, PLAN_COPY, TRUST].map((x) => JSON.parse(JSON.stringify(x, (key, value: unknown) => (key === 'hi' ? undefined : value))))))

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

  it('shows the Personal Retreat place FAQ with the owner’s answer, and no placeholder anywhere', () => {
    const faq = getProgram('personal-retreat').faqs.find((f) => f.q.en === 'Where does it happen?')
    expect(faq?.hidden).toBeUndefined()
    expect(faq?.a.en).toBe(
      'Right now, online: a fully guided intensive from your home. In-person retreats are held in Rishikesh and Lonavala when enough participants are ready. Tell us in the form if you would like to join one.',
    )
    for (const p of PROGRAMS) for (const f of p.faqs) expect(f.a.en + f.a.hi, p.slug).not.toContain('PLACEHOLDER')
  })

  it('uses the owner’s Stress and Retreat wording (plans brief)', () => {
    const stress = getProgram('stress-anxiety-support')
    expect(stress.name.en).toBe('Stress, Anxiety, Panic & Depression Support')
    expect(stress.seoTitle.en).toBe('Stress, Anxiety, Panic Attacks & Depression Support — 1-on-1 with Dr. Kapil')
    expect(stress.subline.en).toBe('1-on-1 support for stress, anxiety, panic attacks, low mood and depression — at your pace, in a safe and private space.')
    expect(stress.disclaimers).toEqual(['mind'])
    expect(getProgram('personal-retreat').subline.en).toBe(
      'A multi-day 1-on-1 intensive with Dr. Kapil — online now, from your home. In-person retreats in Rishikesh and Lonavala when a group is ready.',
    )
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

  it('builds the booking link with the program (and plan) pre-selected', () => {
    expect(bookingHref('telepathy', 'en')).toBe('/personal-sessions?program=telepathy#book')
    expect(bookingHref('telepathy', 'en', 'core')).toBe('/personal-sessions?program=telepathy&plan=core#book')
    expect(bookingHref('telepathy', 'hi')).toBe('/personal-sessions?program=telepathy&lang=hi#book')
    expect(bookingHref(null, 'en')).toBe('/personal-sessions#book')
  })
})

describe('plans (owner’s plans brief)', () => {
  it('has the six plans with the owner’s fees and per-session figures', () => {
    expect(PLANS.map((p) => [p.name.en, p.includes.map((i) => i.en).join(' + '), p.fee, p.perSession])).toEqual([
      ['Clarity Session', '1 session (60 min) + 1 personal recording', '₹1,100', '₹1,100'],
      ['Starter · 2 days', '2 sessions + 2 personal recordings + 7 days WhatsApp support', '₹3,999', '₹2,000'],
      ['Core · 7 days', '7 sessions + 5 personal recordings + 21 days support', '₹13,999', '₹2,000'],
      ['Transformation · 1 month', '12 sessions + Personal recording library + 30 days support', '₹21,999', '₹1,833'],
      ['Mastery · 3 months', '24 sessions (2 a week) + Advanced practices', '₹39,999', '₹1,666'],
      ['Mentorship · 6 months', '48 sessions + Monthly review + Priority support', '₹69,999', '₹1,458'],
    ])
    expect(PLANS.filter((p) => p.mostChosen).map((p) => p.id)).toEqual(['core'])
  })

  it('shows the three rules word for word', () => {
    expect(PLAN_COPY.rules.map((r) => r.en)).toEqual([
      'Your ₹1,100 Clarity Session fee is fully adjusted if you join any plan within 7 days.',
      'EMI available on the 1-month, 3-month and 6-month plans.',
      'All sessions are 1-on-1 with Dr. Kapil, online or in person in Vadodara.',
    ])
  })

  it('shows the right plans on each program page', () => {
    const calm = ['starter', 'core', 'transformation']
    const skill = ['core', 'transformation', 'mastery']
    const deep = ['mastery', 'mentorship']
    expect(PROGRAM_PLANS).toEqual({
      'stress-anxiety-support': calm,
      'mindset-coaching': calm,
      'subconscious-reprogramming': calm,
      'business-loss-mindset': calm,
      'heart-brain-coherence': calm,
      telepathy: skill,
      'intuition-for-traders': skill,
      'cosmic-fusion': skill,
      manifestation: skill,
      'aura-reading': skill,
      'chakra-activation': skill,
      'samadhi-meditation': deep,
      'kundalini-meditation': deep,
      'astral-projection': deep,
      'personal-retreat': ['core', 'transformation'],
    })
  })
})

describe('hub (owner’s plans brief)', () => {
  it('has three doors with the owner’s programs, the first selected by default', () => {
    expect(HUB.programs.doors.map((d) => [d.label.en, d.programs])).toEqual([
      ['Calm my mind', ['stress-anxiety-support', 'heart-brain-coherence', 'subconscious-reprogramming', 'business-loss-mindset', 'mindset-coaching']],
      ['Perform better', ['intuition-for-traders', 'mindset-coaching', 'business-loss-mindset']],
      ['Grow spiritually', ['telepathy', 'cosmic-fusion', 'manifestation', 'aura-reading', 'chakra-activation', 'samadhi-meditation', 'kundalini-meditation', 'astral-projection', 'personal-retreat']],
    ])
    expect(HUB.hero.sub.en).toBe('Stress, anxiety, panic attacks, low mood — or a deeper spiritual practice. Every session is built around you, your reason and your pace. Online or in person.')
  })

  it('adds the full-recordings FAQ right after the recordings FAQ', () => {
    const qs = HUB.faq.items.map((f) => f.q.en)
    expect(qs.indexOf('Do I get recordings of the full sessions?')).toBe(qs.indexOf('What are the personal meditation recordings?') + 1)
    expect(FULL_RECORDINGS_FAQ.a.en).toBe('No. You get personal guided meditation / therapy recordings made for you to practise with. Your conversations with Dr. Kapil stay private.')
  })
})
