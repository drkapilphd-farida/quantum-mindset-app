import { describe, expect, it } from 'vitest'
import { leadWhatsappMessage, offerCode } from './leadMessage'

const base = { firstName: 'Asha', effectiveWpm: 182, wpm: 260, comprehensionPercent: 70, retention: null, memory: null, profileName: 'The Careful Re-reader', offer: { code: 'SB-1A2B3C', expiresAtMs: Date.parse('2026-10-16T07:44:00Z') } }

describe('lead WhatsApp message to Dr. Kapil', () => {
  it('carries the name, own results, profile and offer code with expiry (India time)', () => {
    const m = leadWhatsappMessage({ ...base, lang: 'en' })
    expect(m).toContain('Name: Asha')
    expect(m).toContain('Effective speed: 182 WPM (reading 260 WPM, understanding 70%)')
    expect(m).toContain('Profile: The Careful Re-reader')
    expect(m).toContain('code SB-1A2B3C, valid till 16 Oct')
    expect(m).toContain('1:14 pm')
  })
  it('adds retention and memory when the test measured them', () => {
    const m = leadWhatsappMessage({ ...base, lang: 'en', retention: { correct: 2, total: 4 }, memory: { correct: 5, total: 8 } })
    expect(m).toContain('Retention: 2 of 4')
    expect(m).toContain('Memory: 5 of 8')
  })
  it('leaves out what is missing (no name, no offer)', () => {
    const m = leadWhatsappMessage({ ...base, lang: 'hi', firstName: ' ', offer: null })
    expect(m).not.toContain('नाम:')
    expect(m).not.toContain('ऑफ़र')
    expect(m).toContain('Effective speed: 182 WPM')
  })
  it('offer code is short and stable', () => {
    expect(offerCode('1a2b3c4d-0000-4000-8000-000000000000')).toBe('SB-1A2B3C')
  })
})
