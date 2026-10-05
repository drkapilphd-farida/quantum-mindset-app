import { describe, expect, it, vi } from 'vitest'

vi.mock('@anthropic-ai/sdk', () => ({ default: class {} }))
const { isUsableMentorNote } = await import('./generateMentorMessage')

describe('isUsableMentorNote', () => {
  it('accepts a single sentence in the learner’s script', () => {
    expect(isUsableMentorNote('Test, మీ 3 రోజుల వరుస నిజమైన పట్టుదల — ఇలాగే కొనసాగండి.', 'te')).toBe(true)
    expect(isUsableMentorNote('உங்கள் முதல் நாளை இன்று தொடங்குங்கள், Test — ஒரு Mind Session கூட போதும்.', 'ta')).toBe(true)
    expect(isUsableMentorNote('Test, three days in a row — your mind is ready for today.', 'en')).toBe(true)
  })

  it('rejects English, refusals and markdown when another language was asked for', () => {
    expect(isUsableMentorNote("I appreciate the thoughtful request, but I need to clarify something important: you've asked me to write in Telugu", 'te')).toBe(false)
    expect(isUsableMentorNote('**Option A:** मैं वाक्य लिखूँ', 'hi')).toBe(false)
    expect(isUsableMentorNote('ಒಂದು ವಾಕ್ಯ\nಎರಡನೇ ಸಾಲು', 'kn')).toBe(false)
    expect(isUsableMentorNote('', 'gu')).toBe(false)
  })
})
