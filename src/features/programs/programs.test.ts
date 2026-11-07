import { describe, expect, it } from 'vitest'
import { COMMON } from './common'
import { HUB, QUIZ_RESULTS } from './hubCopy'
import { PROGRAMS, PROGRAM_SLUGS, bookingHref, getProgram, isProgramSlug } from './programs'

// The owner's content rules (Nov 2026). The required disclaimer sentences
// themselves contain "treatment"; they are the only place it may appear.
const REQUIRED = [COMMON.disclaimers.mind.en, COMMON.disclaimers.traders.en, HUB.faq.disclaimer.en]
const strip = (text: string): string => REQUIRED.reduce((acc, sentence) => acc.split(sentence).join(''), text)

describe('program pages content', () => {
  it('has all 15 programs, each with a unique slug', () => {
    expect(PROGRAMS).toHaveLength(15)
    expect(new Set(PROGRAM_SLUGS).size).toBe(15)
  })

  it('follows the Telepathy template: 4 used-for, 4 who, 4 how, 4 FAQs, 3 related', () => {
    for (const p of PROGRAMS) {
      expect(p.usedFor, p.slug).toHaveLength(4)
      expect(p.who, p.slug).toHaveLength(4)
      expect(p.how, p.slug).toHaveLength(4)
      expect(p.faqs, p.slug).toHaveLength(4)
      expect(p.related, p.slug).toHaveLength(3)
      for (const r of p.related) {
        expect(isProgramSlug(r), `${p.slug} → ${r}`).toBe(true)
        expect(r).not.toBe(p.slug)
      }
    }
  })

  it('never says cure, treat, heal, guarantee or blindfold (outside the required disclaimers)', () => {
    const all = strip(JSON.stringify([PROGRAMS, HUB])).toLowerCase()
    // Whole words only: "retreat" and "health" are fine.
    for (const pattern of [/\bcur(e|es|ed|ing)\b/, /\btreat/, /\bheal(?!th)/, /\bguarantee/, /\bblindfold/, /\bpredict/]) {
      expect(all, String(pattern)).not.toMatch(pattern)
    }
  })

  it('shows the distress line on every mind page and on Heart-Brain Coherence', () => {
    for (const slug of ['stress-anxiety-support', 'mindset-coaching', 'subconscious-reprogramming', 'business-loss-mindset', 'heart-brain-coherence'] as const) {
      expect(getProgram(slug).disclaimers).toContain('mind')
    }
    expect(COMMON.disclaimers.mind.en).toBe(
      'This is not medical treatment. If you are in serious distress or have thoughts of harming yourself, please contact a doctor or a mental health professional immediately.',
    )
  })

  it('shows the trading disclaimer on the traders page', () => {
    expect(getProgram('intuition-for-traders').disclaimers).toContain('traders')
    expect(COMMON.disclaimers.traders.en).toBe('Mind and intuition training only. This is not financial or investment advice.')
  })

  it('says kundalini, samadhi and astral projection are taught only after the foundation level', () => {
    for (const slug of ['kundalini-meditation', 'samadhi-meditation', 'astral-projection'] as const) {
      const p = getProgram(slug)
      expect(JSON.stringify([p.heroLine, p.who, p.how, p.faqs]).toLowerCase()).toContain('only after the foundation level')
    }
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
