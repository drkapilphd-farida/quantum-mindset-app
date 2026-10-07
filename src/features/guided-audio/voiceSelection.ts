import type { AppLang } from '@/lib/app-i18n/languages'

// Picks the device's best text-to-speech voice for a narration language —
// the fallback when a recorded line is missing or doesn't load. Pure, so it
// is testable with plain objects shaped like SpeechSynthesisVoice.

export const NARRATION_LANGUAGE_TAGS: Record<AppLang, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  bn: 'bn-IN',
}

export type VoiceLike = { name: string; lang: string; localService?: boolean }

const MALE_VOICE_NAME_HINT = /\b(male|hemant|ravi|madhur|prabhat|rishi|arjun|aarav|neel|daniel|david|george|guy|james|mark|aaron|fred|oliver|thomas)\b/i
// Edge "Online (Natural)", Chrome "Google …", Apple "Enhanced"/"Premium".
const NATURAL_VOICE_NAME_HINT = /\b(natural|neural|online|enhanced|premium|google)\b/i

/**
 * An Indian voice for the language first, then natural/neural voices, then
 * the browser's online voices over installed ones (usually far better on
 * Chrome/Android), and a male voice only as the last tie-breaker. Null when
 * no voice speaks the language.
 */
export function pickVoiceForLanguage<T extends VoiceLike>(voices: readonly T[], language: AppLang): T | null {
  const exactTag = NARRATION_LANGUAGE_TAGS[language].toLowerCase()
  const prefix = exactTag.slice(0, 2)
  let best: T | null = null
  let bestScore = -1
  for (const voice of voices) {
    const lang = voice.lang.toLowerCase().replace('_', '-')
    if (!lang.startsWith(prefix)) continue
    let points = 0
    if (lang === exactTag) points += 100
    if (NATURAL_VOICE_NAME_HINT.test(voice.name)) points += 40
    if (voice.localService === false) points += 20
    if (MALE_VOICE_NAME_HINT.test(voice.name)) points += 5
    if (points > bestScore) {
      best = voice
      bestScore = points
    }
  }
  return best
}
