import { z } from 'zod'

// Chapter & Book (Group A): a chapter → 5–9 key ideas (editable) + a simple
// mind map → placed along one of the learner's palaces → "walk the chapter".
// Wording rule: "remember the key ideas and structure of a chapter or book" —
// never "memorise a whole book". Pure logic only.

export const CHAPTER_EXERCISE_ID = 'chapter-book'

export const IdeaSchema = z.object({
  title: z.string().trim().min(1).max(80),
  detail: z.string().trim().max(200).default(''),
  points: z.array(z.string().trim().min(1).max(80)).max(4).default([]),
})
export type ChapterIdea = z.infer<typeof IdeaSchema>

export const QuestionSchema = z.object({
  question: z.string().trim().min(1).max(240),
  options: z.array(z.string().trim().min(1).max(120)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  idea: z.number().int().min(0).max(11),
})
export type ChapterQuestion = z.infer<typeof QuestionSchema>

export const ChapterMapSchema = z.object({ ideas: z.array(IdeaSchema).min(5).max(9), questions: z.array(QuestionSchema).min(3).max(6) })

export const MIN_IDEAS = 2
export const MAX_IDEAS = 12

/** Clean pasted or extracted text: joined broken lines, no page numbers, collapsed spaces. */
export function cleanChapterText(raw: string): string {
  return raw
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .filter((line) => !/^\s*(page\s*)?\d{1,4}\s*$/i.test(line))
    .join('\n')
    .replace(/([^\n.!?।:])\n(?=\S)/g, '$1 ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Cut a long chapter at a paragraph break before `max` characters. */
export function capChapterText(text: string, max: number): { text: string; cut: boolean } {
  if (text.length <= max) return { text, cut: false }
  const slice = text.slice(0, max)
  const at = slice.lastIndexOf('\n\n')
  return { text: (at > max * 0.6 ? slice.slice(0, at) : slice).trim(), cut: true }
}

/**
 * Text that came out of a PDF as gibberish — typically old Hindi fonts (Kruti
 * Dev …) that store Latin letters instead of Devanagari. Then the learner is
 * asked to paste the text instead of getting nonsense ideas.
 */
export function looksGarbled(text: string): boolean {
  const letters = text.replace(/[\s\d.,;:!?'"()\-–—…।]/g, '')
  if (letters.length < 200) return false
  const odd = (letters.match(/[\u0080-ÿĀ-ɏ]/g) ?? []).length
  const replacement = (letters.match(/�/g) ?? []).length
  return (odd + replacement) / letters.length > 0.12
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

/** Today in India ("YYYY-MM-DD") — the daily limit resets at midnight IST. */
export function istDayStart(now: number = Date.now()): string {
  const ist = new Date(now + 5.5 * 3_600_000)
  return new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) - 5.5 * 3_600_000).toISOString()
}

/** Ideas the learner missed while walking the chapter (each comes back in the review queue). */
export function weakIdeas(answers: readonly { idea: number; right: boolean }[]): number[] {
  return [...new Set(answers.filter((a) => !a.right).map((a) => a.idea))].sort((a, b) => a - b)
}
