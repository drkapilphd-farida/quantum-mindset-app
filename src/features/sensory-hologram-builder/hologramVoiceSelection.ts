// Sensory Hologram Builder™ — pure voice-selection logic for
// `window.speechSynthesis`. Kept free of the Web Speech API itself (which
// can't be constructed outside a browser) so the actual matching logic is
// unit-testable with plain object literals shaped like SpeechSynthesisVoice,
// per this app's established "extract the pure decision logic" discipline.
//
// There is no existing speechSynthesis precedent anywhere else in this
// codebase — this is the first voice-narration exercise built, so this
// selection heuristic (and the fallback-when-nothing-matches behavior) is
// established here for the first time, not reused from a sibling.
export type NarrationLanguage = 'en' | 'hi'

// English targets en-IN specifically (Indian English), not en-US — a
// warmer, more resonant accent for this app's own audience, per this
// exercise's explicit spec. pickVoiceForLanguage still falls back to any
// other English variant (see the prefix-match tier below) when a browser
// genuinely has no en-IN voice installed, so this preference never leaves
// narration silently broken on a machine without one.
export const NARRATION_LANGUAGE_TAGS: Record<NarrationLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
}

// The minimal shape this module actually needs from a real
// SpeechSynthesisVoice — narrower on purpose so tests can pass plain
// object literals instead of constructing (unconstructable) real
// SpeechSynthesisVoice instances. `localService` mirrors the real API's
// own field: true for an on-device voice (no network round-trip, and
// typically the more natural-sounding, "studio-grade" option on a given
// platform), false/undefined for a remote one.
export type VoiceLike = { name: string; lang: string; localService?: boolean }

// Browsers vary wildly in which voices they expose and how they name
// them — there's no standardized "gender" field on SpeechSynthesisVoice,
// so this is a name-heuristic best effort, not a guarantee. Covers common
// male voice names across Chrome/Edge/Safari's built-in English and Hindi
// voice sets, with extra weight on the specific en-IN/hi-IN male voice
// names real platforms actually ship (Hemant, Ravi, Madhur, Prabhat,
// Rishi). Falls back gracefully (see pickVoiceForLanguage) when no
// heuristic match exists in the current browser/OS — never throws, never
// leaves narration silently broken.
const MALE_VOICE_NAME_HINTS: readonly string[] = [
  'male',
  'hemant',
  'ravi',
  'madhur',
  'prabhat',
  'rishi',
  'arjun',
  'aarav',
  'neel',
  'daniel',
  'david',
  'george',
  'guy',
  'james',
  'mark',
  'aaron',
  'fred',
  'oliver',
  'thomas',
]

// Word-boundary matching, not a plain substring check — "Samantha
// (Female)" contains the literal substring "male" (fe-MALE-), so a naive
// `.includes('male')` would misclassify a female voice as male. `\b`
// requires an actual word boundary on both sides of the hint, which
// "Female" doesn't have before its embedded "male".
function isLikelyMaleVoice(voice: VoiceLike): boolean {
  return MALE_VOICE_NAME_HINTS.some((hint) => new RegExp(`\\b${hint}\\b`, 'i').test(voice.name))
}

// Picks the best available voice for a language, ranked in four tiers:
// 1. A name-heuristic male voice that's also on-device (localService) —
//    the "deep, natural, studio-grade" combination this exercise's own
//    spec asks for.
// 2. Any name-heuristic male voice.
// 3. Any on-device voice (still a real quality signal even without a
//    confident gender read — local voices are consistently more natural
//    and lower-latency than network ones across every platform this app
//    targets).
// 4. Whatever's left.
// Within all four tiers, an exact BCP-47 match (e.g. "en-IN") is always
// preferred over a same-language-different-region match (e.g. "en-US") —
// language and region matching happens first, before any quality
// ranking. Returns null (never throws) when the browser has no voice at
// all for the requested language — the caller is expected to fall back
// to a silent, timer-paced session rather than crash.
// Names that mark the higher-quality neural / natural voices browsers ship
// (Edge "Online (Natural)", Chrome "Google …", Apple "Enhanced"/"Premium").
const NATURAL_VOICE_NAME_HINT = /\b(natural|neural|online|enhanced|premium|google)\b/i

// Ranks the device's voices for the narration language: an Indian voice for
// that language first, then natural/neural voices, then the browser's online
// voices over installed ones (usually far better on Chrome/Android), and a
// male voice only as the last tie-breaker. Returns null when no voice speaks
// the language at all.
export function pickVoiceForLanguage<T extends VoiceLike>(voices: readonly T[], language: NarrationLanguage): T | null {
  const langPrefix = language === 'hi' ? 'hi' : 'en'
  const exactTag = NARRATION_LANGUAGE_TAGS[language].toLowerCase()

  const score = (voice: T): number => {
    const lang = voice.lang.toLowerCase().replace('_', '-')
    let points = 0
    if (lang === exactTag) points += 100
    if (NATURAL_VOICE_NAME_HINT.test(voice.name)) points += 40
    if (voice.localService === false) points += 20
    if (isLikelyMaleVoice(voice)) points += 5
    return points
  }

  let best: T | null = null
  let bestScore = -1
  for (const voice of voices) {
    if (!voice.lang.toLowerCase().startsWith(langPrefix)) continue
    const points = score(voice)
    if (points > bestScore) {
      best = voice
      bestScore = points
    }
  }
  return best
}
