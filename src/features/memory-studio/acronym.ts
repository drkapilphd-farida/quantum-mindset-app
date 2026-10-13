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

export const ACRONYM_TRY_EXERCISE_ID = 'acronym-try'

/** Ready lists for the 30-day plan's "try it" step (no memory-check words). The first one is the easiest. */
export const ACRONYM_READY_LISTS: Readonly<Record<'en' | 'hi', readonly { title: string; items: string[] }[]>> = {
  en: [
    { title: 'The five senses', items: ['Sight', 'Hearing', 'Smell', 'Taste', 'Touch'] },
    { title: 'Parts of a cell', items: ['Nucleus', 'Cytoplasm', 'Membrane', 'Mitochondria', 'Vacuole'] },
    { title: 'The continents, largest first', items: ['Asia', 'Africa', 'North America', 'South America', 'Antarctica', 'Europe', 'Australia'] },
  ],
  hi: [
    { title: 'पाँच इंद्रियाँ', items: ['देखना', 'सुनना', 'सूँघना', 'चखना', 'छूना'] },
    { title: 'कोशिका के भाग', items: ['केंद्रक', 'कोशिका द्रव्य', 'झिल्ली', 'माइटोकॉन्ड्रिया', 'रिक्तिका'] },
    { title: 'महाद्वीप, सबसे बड़े से', items: ['एशिया', 'अफ़्रीका', 'उत्तरी अमेरिका', 'दक्षिणी अमेरिका', 'अंटार्कटिका', 'यूरोप', 'ऑस्ट्रेलिया'] },
  ],
}
