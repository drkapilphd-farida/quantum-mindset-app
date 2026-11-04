import { describe, expect, it } from 'vitest'
import { leadWhatsappMessage } from './leadMessage'

const base = { firstName: 'Asha', effectiveWpm: 182, wpm: 260, comprehensionPercent: 70, retention: null, memory: null, profileName: 'The Careful Re-reader' }

describe('lead WhatsApp message to Dr. Kapil', () => {
  it('carries the name, own results, profile and the parents offer line', () => {
    const m = leadWhatsappMessage({ ...base, lang: 'en' })
    expect(m).toContain('Name: Asha')
    expect(m).toContain('Effective speed: 182 WPM (reading 260 WPM, understanding 70%)')
    expect(m).toContain('Profile: The Careful Re-reader')
    expect(m).toContain('Sharp Brain for parents — ₹2,999 for the first 100 seats')
    expect(m).not.toMatch(/₹1,000|SB-/)
  })
  it('adds retention and memory when the test measured them', () => {
    const m = leadWhatsappMessage({ ...base, lang: 'en', retention: { correct: 2, total: 4 }, memory: { correct: 5, total: 8 } })
    expect(m).toContain('Retention: 2 of 4')
    expect(m).toContain('Memory: 5 of 8')
  })
  it('Hindi: leaves out a missing name; same parents line', () => {
    const m = leadWhatsappMessage({ ...base, lang: 'hi', firstName: ' ' })
    expect(m).not.toContain('नाम:')
    expect(m).toContain('पैरेंट्स के लिए Sharp Brain — पहली 100 सीट ₹2,999 में')
    expect(m).not.toContain('₹1,000')
    expect(m).toContain('Effective speed: 182 WPM')
  })
})
