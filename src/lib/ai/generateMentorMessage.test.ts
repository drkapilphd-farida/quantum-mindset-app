import { describe, expect, it, vi } from 'vitest'

vi.mock('@anthropic-ai/sdk', () => ({ default: class {} }))
const { isUsableMentorNote, mentorNoteLang } = await import('./generateMentorMessage')

describe('mentorNoteLang', () => {
  it('Hindi gets the note in Hindi; the other new languages get English until native review', () => {
    expect(mentorNoteLang('hi')).toBe('hi')
    expect(mentorNoteLang('en')).toBe('en')
    for (const lang of ['kn', 'ta', 'te', 'mr', 'gu'] as const) expect(mentorNoteLang(lang)).toBe('en')
  })
})

describe('isUsableMentorNote', () => {
  it('accepts one sentence with the name exactly as stored', () => {
    expect(isUsableMentorNote('Asha, three days in a row — your mind is ready for today.', 'en', 'Asha')).toBe(true)
    expect(isUsableMentorNote('Asha, आप 3 दिन से लगातार अभ्यास कर रहे हैं, आज भी जारी रखें।', 'hi', 'Asha')).toBe(true)
  })

  it('rejects a transliterated or missing name', () => {
    expect(isUsableMentorNote('आशा, आप 3 दिन से लगातार अभ्यास कर रहे हैं।', 'hi', 'Asha')).toBe(false)
    expect(isUsableMentorNote('Three days in a row — keep going.', 'en', 'Asha')).toBe(false)
  })

  it('never guesses gender in English', () => {
    expect(isUsableMentorNote('Asha, she has kept her streak for three days.', 'en', 'Asha')).toBe(false)
    expect(isUsableMentorNote('Asha, his momentum is real.', 'en', 'Asha')).toBe(false)
  })

  it('rejects English, refusals and markdown when Hindi was asked for', () => {
    expect(isUsableMentorNote("Asha — I appreciate the request, but I need to clarify something important", 'hi', 'Asha')).toBe(false)
    expect(isUsableMentorNote('**Option A:** Asha मैं वाक्य लिखूँ', 'hi', 'Asha')).toBe(false)
    expect(isUsableMentorNote('Asha, पहली पंक्ति\nदूसरी पंक्ति', 'hi', 'Asha')).toBe(false)
    expect(isUsableMentorNote('', 'en', 'Asha')).toBe(false)
  })
})
