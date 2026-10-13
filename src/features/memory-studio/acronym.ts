// Acronyms & first-letter sentences (Group A): a quick tool for short lists
// (3–8 items) — take the first letter of each item, in order, and make a word
// (VIBGYOR) or a funny sentence whose words start with those letters. No
// levels: learners use it on their own lists. Pure logic only.

export const ACRONYM_EXERCISE_ID = 'acronym-own'
export const ACRONYM_MIN = 3
export const ACRONYM_MAX = 8

/** The first letter of each item, in order (Devanagari and other scripts: the first character). Latin letters in capitals. */
export function firstLetters(items: readonly string[]): string {
  return items
    .map((it) => Array.from(it.trim())[0] ?? '')
    .join('')
    .toUpperCase()
}

/** Does every word of the sentence start, in order, with the given letters? (Case is ignored; extra words are not allowed.) */
export function sentenceMatches(letters: string, sentence: string): boolean {
  const words = sentence
    .trim()
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w))
    .map((w) => Array.from(w.replace(/^[^\p{L}\p{N}]+/u, ''))[0] ?? '')
  const want = Array.from(letters)
  return words.length === want.length && words.every((c, i) => c.toUpperCase() === want[i]!.toUpperCase())
}

export type AcronymExample = { title: string; items: string[]; code: string; sentence?: string }

export const ACRONYM_EXAMPLES: Readonly<Record<'en' | 'hi', readonly AcronymExample[]>> = {
  en: [
    { title: 'Colours of the rainbow', items: ['Violet', 'Indigo', 'Blue', 'Green', 'Yellow', 'Orange', 'Red'], code: 'VIBGYOR' },
    { title: 'The planets, nearest first', items: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'], code: 'MVEMJSUN', sentence: 'My Very Educated Mother Just Served Us Nachos' },
  ],
  hi: [
    { title: 'इंद्रधनुष के रंग', items: ['बैंगनी', 'नीला', 'आसमानी', 'हरा', 'पीला', 'नारंगी', 'लाल'], code: 'बैनीआहपीनाला' },
    { title: 'सौरमंडल के ग्रह, पास से दूर', items: ['बुध', 'शुक्र', 'पृथ्वी', 'मंगल', 'बृहस्पति', 'शनि', 'अरुण', 'वरुण'], code: 'बु शु पृ मं बृ श अ व' },
  ],
}
