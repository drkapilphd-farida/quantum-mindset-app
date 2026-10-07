import { describe, expect, it } from 'vitest'
import { chooseSource, lineDurationMs, speakableText } from './narrationSource'
import { pickVoiceForLanguage } from './voiceSelection'
import { isAudioManifest, type AudioManifest } from './manifest'

const manifest: AudioManifest = { exercise: 'memory-palace', lang: 'kn', voice: 'shubh', review: 'pending', lines: { 'common-01': { file: 'common-01.mp3', durationMs: 4300 } } }

describe('narration source (recorded → device voice → caption)', () => {
  it('uses the recording when the manifest lists the line', () => {
    expect(chooseSource(manifest, 'common-01', true)).toBe('mp3')
  })
  it('falls back to the device voice when the line is missing or there is no manifest', () => {
    expect(chooseSource(manifest, 'common-02', true)).toBe('voice')
    expect(chooseSource(null, 'common-01', true)).toBe('voice')
  })
  it('falls back to a timed caption when the device has no voice either', () => {
    expect(chooseSource(null, 'common-01', false)).toBe('caption')
  })
  it('times captions by the recording, else by a calm-pace estimate with pauses', () => {
    expect(lineDurationMs('anything', manifest, 'common-01')).toBe(4300)
    const est = lineDurationMs('Find a comfortable position, ... and gently close your eyes.', null, 'x')
    expect(est).toBeGreaterThan(4000)
    expect(lineDurationMs('Go.', null, 'x')).toBe(1800)
  })
  it('turns "..." pauses into commas for the device voice', () => {
    expect(speakableText('Take a slow, ... deep breath in... and let it go.')).toBe('Take a slow, deep breath in, and let it go.')
  })
  it('accepts only well-formed manifests', () => {
    expect(isAudioManifest(manifest)).toBe(true)
    expect(isAudioManifest({ lines: { a: { file: 1 } } })).toBe(false)
    expect(isAudioManifest(null)).toBe(false)
  })
})

describe('device voice for all 8 languages', () => {
  it('prefers an Indian, natural/online voice for the language', () => {
    const voices = [
      { name: 'Local Kannada', lang: 'kn-IN', localService: true },
      { name: 'Google ಕನ್ನಡ', lang: 'kn-IN', localService: false },
      { name: 'Google US English', lang: 'en-US', localService: false },
    ]
    expect(pickVoiceForLanguage(voices, 'kn')?.name).toBe('Google ಕನ್ನಡ')
  })
  it('finds Bengali voices tagged bn_IN (Android style) and returns null when none exist', () => {
    expect(pickVoiceForLanguage([{ name: 'Bengali India', lang: 'bn_IN' }], 'bn')?.name).toBe('Bengali India')
    expect(pickVoiceForLanguage([{ name: 'Google US English', lang: 'en-US' }], 'ta')).toBeNull()
  })
})
