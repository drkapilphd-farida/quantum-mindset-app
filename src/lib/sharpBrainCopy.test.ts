import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { qsrGuarantee } from '@/config/site.config'
import { sharpBrainCopy } from './sharpBrainCopy'

const flat = (value: unknown): string[] =>
  typeof value === 'string' ? [value] : typeof value === 'function' ? [String((value as (...a: unknown[]) => unknown)('₹2,999', 100)), String((value as (...a: unknown[]) => unknown)('₹3,999', null))] : typeof value === 'object' && value !== null ? Object.values(value).flatMap(flat) : []

// The website's certificate section shows samples only: it must never
// promise a speed or a percentage, and must say results vary.
describe('Sharp Brain page — certificate section', () => {
  for (const lang of ['en', 'hi'] as const) {
    const c = sharpBrainCopy[lang].certificate
    const text = [c.eyebrow, c.title, c.intro, ...c.points.flatMap((p) => [p.title, p.desc]), c.vary, c.caption, c.certAlt, c.shareAlt, c.enlarge].join(' ')

    it(`${lang}: no percentage, WPM or speed-figure promises`, () => {
      expect(text).not.toMatch(/%|percent|प्रतिशत/i)
      expect(text).not.toMatch(/\bwpm\b|words per minute|शब्द प्रति मिनट/i)
      expect(text).not.toMatch(/\b\d+\s*x\b|\b(double|triple)\b|दोगुन|तिगुन/i)
      // The only numbers are the day numbers and "8 languages".
      expect(text.match(/\d+/g)?.every((n) => ['1', '30', '8'].includes(n))).toBe(true)
    })

    it(`${lang}: says results vary, and every sample image exists`, () => {
      expect(c.vary.length).toBeGreaterThan(10)
      expect(existsSync(join(process.cwd(), 'public/brand/samples', `sample-certificate-${lang}.webp`))).toBe(true)
    })
  }
})

describe('Sharp Brain for parents — the founder’s final copy (4 Nov 2026)', () => {
  it('hero, word for word', () => {
    expect(sharpBrainCopy.en.hero.h1).toBe('Your child studies for two hours — and still can’t recall it the next day?')
    expect(sharpBrainCopy.hi.hero.h1).toBe('आपका बच्चा दो घंटे पढ़ता है — और अगले दिन फिर भी याद नहीं रहता?')
    expect(sharpBrainCopy.en.hero.book('₹2,999', 100)).toBe('Book a seat for ₹2,999 — first 100 seats')
    expect(sharpBrainCopy.hi.hero.book('₹2,999', 100)).toBe('₹2,999 में सीट बुक करें — पहली 100 सीट')
    expect(sharpBrainCopy.en.hero.book('₹3,999', null)).toBe('Book a seat for ₹3,999')
    expect(sharpBrainCopy.en.hero.startToday('Mon, 9 Nov, 8 pm')).toBe('Join today — start today · Next live class: Mon, 9 Nov, 8 pm')
    expect(sharpBrainCopy.hi.hero.startToday('सोमवार, 9 नवंबर, रात 8 बजे')).toBe('आज join करें, आज से शुरू · अगली लाइव क्लास: सोमवार, 9 नवंबर, रात 8 बजे')
    expect(sharpBrainCopy.en.hero.strip.join(' · ')).toBe('26 years of experience · 10,000+ learners · 500+ workshops · Start any day · Classes in Hindi')
    expect(sharpBrainCopy.hi.hero.strip.join(' · ')).toBe('26 साल का अनुभव · 10,000+ लोग सीख चुके · 500+ वर्कशॉप · किसी भी दिन शुरू करें · क्लास हिंदी में')
  })

  it('five skill cards, six FAQs, both languages the same shape', () => {
    for (const lang of ['en', 'hi'] as const) {
      expect(sharpBrainCopy[lang].skills.cards).toHaveLength(5)
      expect(sharpBrainCopy[lang].faq.items).toHaveLength(6)
      expect(sharpBrainCopy[lang].pain.items).toHaveLength(5)
      expect(sharpBrainCopy[lang].how.steps).toHaveLength(4)
    }
  })

  it('no batches, no early-bird, no test offer, no jargon, never "100%"', () => {
    const all = flat(sharpBrainCopy).join('\n')
    expect(all).not.toMatch(/batch starts|next batch|अगला बैच|early-bird|अर्ली-बर्ड|₹1,000 off|brain-skills training|ब्रेन-स्किल्स/i)
    expect(all).not.toMatch(/100\s*%/)
    expect(all).not.toMatch(/Muse|EEG/)
  })
})

describe('Results Guarantee — founder’s final text (4 Nov 2026)', () => {
  it('word for word in both languages; the FAQ answer says the same terms', () => {
    expect(qsrGuarantee.en.statement).toBe(
      'Complete all 30 days, all 7 classes (live or recording) and both tests. If Day 30 shows no improvement in reading speed or recall, full refund. Claim within 7 days of your Day 30.',
    )
    expect(qsrGuarantee.hi.statement).toBe(
      '30 दिन, सातों क्लास (लाइव या रिकॉर्डिंग) और दोनों टेस्ट पूरे करें। Day 30 पर स्पीड या याद में सुधार न मिले तो पूरा पैसा वापस। अपने Day 30 के 7 दिन के अंदर दावा करें।',
    )
    expect(sharpBrainCopy.en.faq.items[4]?.answer).toMatch(/all 30 days, all 7 classes \(live or recording\) and both tests; claim within 7 days of your Day 30/)
    expect(JSON.stringify(qsrGuarantee)).not.toMatch(/100\s*%/)
  })
})
