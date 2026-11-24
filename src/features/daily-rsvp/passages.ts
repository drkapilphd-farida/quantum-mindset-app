import { DAILY_RSVP_PASSAGES_EN } from './passagesEn'
import { DAILY_RSVP_PASSAGES_HI } from './passagesHi'

export type DailyRsvpLang = 'en' | 'hi'

export type DailyRsvpQuestion = { q: string; options: readonly string[]; answer: number }

export type DailyRsvpPassage = {
  /** The plan day this passage belongs to (1–30). */
  day: number
  title: string
  text: string
  questions: readonly DailyRsvpQuestion[]
}

const BY_LANG: Record<DailyRsvpLang, readonly DailyRsvpPassage[]> = {
  en: DAILY_RSVP_PASSAGES_EN,
  hi: DAILY_RSVP_PASSAGES_HI,
}

/**
 * The passage for a plan day. Outside the plan (the exercise opened on its
 * own page) the learner gets the passage after their latest day, so it is
 * still new to them.
 */
export function dailyRsvpPassage(day: number, lang: DailyRsvpLang): DailyRsvpPassage {
  const list = BY_LANG[lang]
  const safeDay = Number.isInteger(day) && day >= 1 && day <= list.length ? day : 1
  return list.find((p) => p.day === safeDay) ?? list[0]!
}

export const dailyRsvpPassages = (lang: DailyRsvpLang): readonly DailyRsvpPassage[] => BY_LANG[lang]
