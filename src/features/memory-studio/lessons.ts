import type { Translator } from '@/lib/app-i18n/translate'
import { itemName, pegName, RHYME_PEGS, SHAPE_PEGS, STORY_ITEMS, type PegSet, type StudioLang } from './content'
import type { LessonLine } from './components/MethodLesson'

// The "Learn" lessons of Release 2. Line ids are stable: they name the
// recorded MP3s (guided-audio/<narrationId>/<lang>/<lineId>.mp3).

export const STORY_LESSON_ID = 'story-lesson'
export const PEG_LESSON_ID: Record<PegSet, string> = { rhyme: 'peg-lesson-rhyme', shape: 'peg-lesson-shape' }

const pic = (id: string, lang: StudioLang, number?: number): { id: string; label: string; number?: number } => {
  const found = STORY_ITEMS.find((i) => i.id === id)
  return { id, label: found ? itemName(found, lang) : id, ...(number === undefined ? {} : { number }) }
}

const EXAMPLE = ['rocket', 'guitar', 'tomato', 'crown', 'penguin'] as const

export function storyLesson(t: Translator, lang: StudioLang): LessonLine[] {
  const all = EXAMPLE.map((id) => pic(id, lang))
  const pictures: Record<number, LessonLine['pictures']> = {
    2: all,
    3: [pic('rocket', lang), pic('guitar', lang)],
    4: [pic('guitar', lang), pic('tomato', lang)],
    5: [pic('tomato', lang), pic('crown', lang)],
    6: [pic('crown', lang), pic('penguin', lang)],
    7: EXAMPLE.map((id, i) => pic(id, lang, i + 1)),
  }
  return [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `line-${n}`, text: t(`training.studio.storyLesson.l${n}` as Parameters<Translator>[0]), ...(pictures[n] ? { pictures: pictures[n] } : {}) }))
}

// English rhyme pegs only work in English, so this lesson is English-only.
const RHYME_LESSON_TEXT = [
  'The Peg method helps you remember numbered lists — and find any number straight away.',
  'First you learn ten pegs: one picture for each number. Each picture rhymes with its number.',
  'One – bun. Two – kangaroo. Three – bee. Four – boar. Five – diving mask, for dive.',
  'Six – sticks. Seven – raven. Eight – skate. Nine – sign. Ten – hen.',
  'Now hang a list on the pegs. Number one is a rocket: picture a rocket bursting out of a big bun.',
  'Number two is a guitar: a kangaroo jumping up and down, playing the guitar.',
  'What was on number two? Think of the kangaroo … it’s the guitar!',
  'Learn the pegs once, and use them for any list. Let’s learn your pegs.',
]

export function pegLesson(set: PegSet, t: Translator, lang: StudioLang): LessonLine[] {
  const pegs = set === 'rhyme' ? RHYME_PEGS : SHAPE_PEGS
  const pegPic = (i: number): { id: string; label: string; number: number } => ({ id: pegs[i]!.id, label: pegName(pegs[i]!, lang), number: i + 1 })
  const pictures: Record<number, LessonLine['pictures']> = {
    3: [0, 1, 2, 3, 4].map(pegPic),
    4: [5, 6, 7, 8, 9].map(pegPic),
    5: [pegPic(0), pic('rocket', lang)],
    6: [pegPic(1), pic('guitar', lang)],
    7: [pegPic(1), pic('guitar', lang)],
  }
  return [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    id: `line-${n}`,
    text: set === 'rhyme' ? RHYME_LESSON_TEXT[n - 1]! : t(`training.studio.pegLesson.l${n}` as Parameters<Translator>[0]),
    ...(pictures[n] ? { pictures: pictures[n] } : {}),
  }))
}

export const PALACE_LESSON_ID = 'palace-lesson'

export function palaceLesson(t: Translator, lang: StudioLang): LessonLine[] {
  const pictures: Record<number, LessonLine['pictures']> = { 5: [pic('rocket', lang, 1), pic('guitar', lang, 2)] }
  return [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `line-${n}`, text: t(`training.studio.palaceLesson.l${n}` as Parameters<Translator>[0]), ...(pictures[n] ? { pictures: pictures[n] } : {}) }))
}

export const CHAPTER_LESSON_ID = 'chapter-lesson'

export function chapterLesson(t: Translator): LessonLine[] {
  return [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `line-${n}`, text: t(`training.studio.chapterLesson.l${n}` as Parameters<Translator>[0]) }))
}

export const NAME_FACE_LESSON_ID = 'name-face-lesson'

/** Text only; the experience adds the example face to lines 2 and 5. */
export function nameFaceLessonText(t: Translator): { id: string; text: string }[] {
  return [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `line-${n}`, text: t(`training.studio.nameFaceLesson.l${n}` as Parameters<Translator>[0]) }))
}

export const NUMBER_LESSON_ID: Record<'en' | 'hi', string> = { en: 'number-lesson-en', hi: 'number-lesson-hi' }

/** English learners and Hindi learners get lessons built on their own list's sounds. Pictures: the two example pairs. */
export function numberLesson(t: Translator, list: 'en' | 'hi'): { id: string; text: string; pairs?: string[] }[] {
  const pairs: Record<number, string[]> = list === 'en' ? { 4: ['47', '19'], 6: ['47', '19'], 7: ['47', '19'] } : { 4: ['47', '25'], 6: ['47', '25'], 7: ['47', '25'] }
  const key = list === 'en' ? 'numberLessonEn' : 'numberLessonHi'
  return [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `line-${n}`, text: t(`training.studio.${key}.l${n}` as Parameters<Translator>[0]), ...(pairs[n] ? { pairs: pairs[n] } : {}) }))
}

export const KEYWORD_LESSON_ID: Record<'en' | 'hi', string> = { en: 'keyword-lesson-en', hi: 'keyword-lesson-hi' }

export function keywordLesson(t: Translator, list: 'en' | 'hi'): LessonLine[] {
  const key = list === 'en' ? 'keywordLessonEn' : 'keywordLessonHi'
  return [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `line-${n}`, text: t(`training.studio.${key}.l${n}` as Parameters<Translator>[0]) }))
}

export const ACRONYM_LESSON_ID = 'acronym-lesson'

export function acronymLesson(t: Translator): LessonLine[] {
  return [1, 2, 3, 4, 5, 6].map((n) => ({ id: `line-${n}`, text: t(`training.studio.acronymLesson.l${n}` as Parameters<Translator>[0]) }))
}
