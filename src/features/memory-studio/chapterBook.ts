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

export const ChapterMapSchema = z.object({ ideas: z.array(IdeaSchema).min(3).max(9), questions: z.array(QuestionSchema).min(3).max(6) })

export const MIN_IDEAS = 2
export const MAX_IDEAS = 12

// Row markers used only inside cleanChapterText (removed before it returns).
const ROW_START = '\u0001'
const ROW_END = '\u0002'

const PAGE_NUMBER = /^\s*(page\s*)?\d{1,4}\s*$/i

/** Looks like a table cell: a few words, not the end of a sentence, not a page number. */
const isCellLike = (line: string | undefined): boolean =>
  line !== undefined && !PAGE_NUMBER.test(line) && line.trim().split(/\s+/).length <= 4 && !/[.!?।]\s*$/.test(line)

/**
 * A line that is only a number ("12", "Page 12") is a page number — unless
 * the lines on both sides look like table cells (Word tables arrive one
 * cell per line): then it is a number in the table and is kept.
 */
function notAPageNumber(line: string, index: number, lines: string[]): boolean {
  if (!PAGE_NUMBER.test(line)) return true
  const near = (step: number): string | undefined => {
    for (let i = index + step; i >= 0 && i < lines.length; i += step) if (lines[i]!.trim() !== '') return lines[i]
    return undefined
  }
  return isCellLike(near(-1)) && isCellLike(near(1))
}

/** A copied table row broken over two lines (the first ends in a tab, or the next starts with one) is joined back. */
function joinBrokenTableRows(lines: string[], line: string): string[] {
  const prev = lines[lines.length - 1]
  const prevIsRow = prev !== undefined && prev.split('\t').filter((c) => c.trim() !== '').length >= 2
  if (prev !== undefined && line.trim() !== '' && prev.includes('\t') && (/\t\s*$/.test(prev) || (/^\s*\t/.test(line) && prevIsRow))) {
    lines[lines.length - 1] = `${prev}\t${line}`
  } else {
    lines.push(line)
  }
  return lines
}

/**
 * Clean pasted or extracted text: joined broken lines, no page numbers,
 * collapsed spaces. Pasted tables (tab-separated cells) stay one row per
 * line with " | " between cells, and a row broken across two lines is
 * joined back. Invisible characters are removed; the joiners Indian
 * scripts need (ZWJ/ZWNJ) are kept.
 */
export function cleanChapterText(raw: string): string {
  return raw
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .replace(/[​⁠﻿­]/g, '')
    .replace(/[  -   　]/g, ' ')
    .replace(/[^\S\n\t]+/g, ' ')
    .replace(/([a-z])-\n([a-z])/g, '$1$2')
    .split('\n')
    .filter(notAPageNumber)
    .reduce<string[]>(joinBrokenTableRows, [])
    .map((line) => {
      const cells = line.split('\t').map((cell) => cell.trim()).filter(Boolean)
      // Two or more cells = a table row; a single tab is just an indent.
      return cells.length >= 2 ? `${ROW_START}${cells.join(' | ')}${ROW_END}` : cells.join(' ')
    })
    .join('\n')
    .replace(new RegExp(`([^\\n.!?।:${ROW_END}])\\n(?=[^\\s${ROW_START}])`, 'g'), '$1 ')
    .replace(new RegExp(`[${ROW_START}${ROW_END}]`, 'g'), '')
    .replace(/ +/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Shorten to at most `max` characters, at a word boundary, ending in "…". */
export function clampText(text: string, max: number): string {
  const t = text.trim().replace(/\s+/g, ' ')
  if (t.length <= max) return t
  const cut = t.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:–—-]+$/, '')}…`
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

/**
 * The AI's reply → a chapter map, forgiving small slips instead of failing
 * the whole chapter: over-long titles/sentences are shortened, extra ideas
 * or points are dropped, and a malformed question is left out. Returns
 * null only when too little is usable (fewer than 3 ideas or 3 questions).
 */
export function normaliseChapterMap(input: unknown): z.infer<typeof ChapterMapSchema> | null {
  const raw = (input ?? {}) as { ideas?: unknown; questions?: unknown }
  const ideas = (Array.isArray(raw.ideas) ? raw.ideas : [])
    .map((i: { title?: unknown; detail?: unknown; points?: unknown }) => ({
      title: clampText(str(i?.title), 80),
      detail: clampText(str(i?.detail), 200),
      points: (Array.isArray(i?.points) ? i.points : [])
        .map((p: unknown) => clampText(str(p), 80))
        .filter(Boolean)
        .slice(0, 3),
    }))
    .filter((i) => i.title !== '')
    .slice(0, 9)
  const questions = (Array.isArray(raw.questions) ? raw.questions : [])
    .map((q: { question?: unknown; options?: unknown; correctIndex?: unknown; idea?: unknown }) => ({
      question: clampText(str(q?.question), 240),
      options: (Array.isArray(q?.options) ? q.options : []).map((o: unknown) => clampText(str(o), 120)),
      correctIndex: q?.correctIndex,
      idea: typeof q?.idea === 'number' && Number.isInteger(q.idea) ? Math.max(0, Math.min(q.idea, ideas.length - 1)) : 0,
    }))
    .filter((q) => q.question !== '' && q.options.length === 4 && q.options.every((o) => o !== '') && typeof q.correctIndex === 'number' && Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex <= 3)
    .slice(0, 6)
  const parsed = ChapterMapSchema.safeParse({ ideas, questions })
  return parsed.success ? parsed.data : null
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
