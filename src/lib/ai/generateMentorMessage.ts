// Server-only. Never import this from client components.
import Anthropic from '@anthropic-ai/sdk'
import { brand } from '@/config/site.config'
import { LANGUAGES, type AppLang } from '@/lib/app-i18n/languages'
import type { Translator } from '@/lib/app-i18n/translate'

export type MentorMessageInput = {
  studentName: string
  currentStreak: number
  bestStreak: number
  completedCount: number
  totalCount: number
  todaySessionCount: number
  totalCompletedSessions: number
}

// When the Anthropic API is unavailable (stub key, network error, rate limit),
// produce a deterministic message from the real progress data so the card
// never shows a blank or error state to the student.
// Written-out fallback when the AI call is unavailable, in the learner's language.
function fallbackMessage(input: MentorMessageInput, t: Translator): string {
  const { studentName, currentStreak, completedCount, totalCount, todaySessionCount } = input
  const name = studentName.split(' ')[0] ?? studentName

  if (completedCount === 0) return t('mentor.fallback.firstSession', { name })
  if (todaySessionCount > 0) {
    if (currentStreak >= 7) return t('mentor.fallback.streakToday', { name, streak: currentStreak })
    return t('mentor.fallback.doneToday', { name })
  }
  if (currentStreak >= 3) return t('mentor.fallback.streakReady', { name, streak: currentStreak })
  if (totalCount - completedCount === 1) return t('mentor.fallback.oneLeft', { name })
  return t('mentor.fallback.progress', { name, done: completedCount, total: totalCount })
}

// The main script of each app language (Hindi and Marathi share Devanagari).
const SCRIPT: Record<Exclude<AppLang, 'en'>, RegExp> = {
  hi: /[\u0900-\u097F]/g,
  mr: /[\u0900-\u097F]/g,
  kn: /[\u0C80-\u0CFF]/g,
  ta: /[\u0B80-\u0BFF]/g,
  te: /[\u0C00-\u0C7F]/g,
  gu: /[\u0A80-\u0AFF]/g,
}

// The respectful "you" for each language, so the note never sounds curt.
const RESPECTFUL_YOU: Record<Exclude<AppLang, 'en'>, string> = {
  hi: 'आप',
  mr: 'तुम्ही',
  kn: 'ನೀವು',
  ta: 'நீங்கள்',
  te: 'మీరు',
  gu: 'તમે',
}

/**
 * Whether the model's reply can be shown as the note: one short line, no
 * markdown, and — for Indian languages — mostly in that language's script.
 * Anything else (a refusal, a question back, English instead of Telugu)
 * falls back to the translated deterministic note.
 */
export function isUsableMentorNote(note: string, lang: AppLang): boolean {
  if (note === '' || note.length > 280 || /[\n*#]/.test(note)) return false
  if (lang === 'en') return true
  const letters = note.match(/\p{L}/gu)?.length ?? 0
  const inScript = note.match(SCRIPT[lang])?.length ?? 0
  return letters > 0 && inScript / letters >= 0.6
}

// Value Shift™ (Phase 2) — this note is displayed to the student as
// "Dr. Kapil's Note™" (see AIMentorSection.tsx), so the model is
// instructed to write it in Dr. Kapil's voice, not as a generic "AI
// Mentor" persona. The mechanism itself is unchanged: real Claude call,
// real progress data, same deterministic fallback below.
//
// Calls the Anthropic API to generate a personalized, transformation-focused
// mentor message. Falls back to a smart deterministic message on any failure —
// the UI should never show an error state for a missing AI response.
export async function generateMentorMessage(input: MentorMessageInput, lang: AppLang, t: Translator): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey || apiKey.includes('stub') || apiKey.includes('placeholder')) {
    return fallbackMessage(input, t)
  }

  try {
    const client = new Anthropic({ apiKey })

    const { studentName, currentStreak, bestStreak, completedCount, totalCount, todaySessionCount, totalCompletedSessions } = input
    const first = studentName.split(' ')[0]

    const languageName = LANGUAGES[lang].englishName
    const system = `You write short notes for ${brand.name}'s learning app, in the voice of its founder and lead mentor, Dr. Kapil Dev Sharma. He has asked for these notes and they are shown to his students as "Dr. Kapil's Note".
Voice: a calm, wise, personally invested mind coach — a transformation partner, not a tutor or teacher.
Write exactly ONE sentence of no more than 20 words, in ${languageName}${lang === 'en' ? '' : ` using ${LANGUAGES[lang].nativeName} script`}, in simple everyday words a student understands.
Be specific about the student's actual numbers. Focus on transformation, growth, momentum and consistency — never content or lessons. Never use: course, lesson, chapter, curriculum, content, module completion, video.
No emojis. No exclamation marks. No corporate language. Calm and direct.
Write the student's first name exactly as given, in the same letters — never transliterate it. Keep "Sharp Brain" and "Mind Session" in English.
Address the student respectfully${lang === 'en' ? '' : ` (${RESPECTFUL_YOU[lang]})`}. Never assume the student's gender — use wording that fits any student.
Reply with the sentence only — no preamble, no quotation marks, no translation notes, no questions.`

    const prompt = `Student: ${first}
Current streak: ${currentStreak} day${currentStreak !== 1 ? 's' : ''}
Best streak: ${bestStreak} day${bestStreak !== 1 ? 's' : ''}
Reading exercises completed: ${completedCount} of ${totalCount}
Sessions today: ${todaySessionCount}
Total sessions ever: ${totalCompletedSessions}`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      // One sentence; Indian scripts take several times more tokens than English.
      max_tokens: 300,
      system,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content.at(0)
    if (!text || text.type !== 'text') return fallbackMessage(input, t)
    // Indian scripts: compose characters (NFC) and drop invisible zero-width
    // characters, which can otherwise render as a dotted circle.
    const note = text.text.normalize('NFC').replace(/[\u200B\uFEFF]/g, '').trim()
    return isUsableMentorNote(note, lang) ? note : fallbackMessage(input, t)
  } catch {
    return fallbackMessage(input, t)
  }
}
