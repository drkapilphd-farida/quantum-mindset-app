import { z } from 'zod'
import type { BuRole } from '../passages'
import { memorySetById, rsvpPassageById } from './content'
import { brainScore, memoryHitsFrom, roundSeconds, RSVP_WPM, type V3Score } from './score'

// Brain Test v3 → bt_progress (same table, trigger and edge function as v2).
// phases_done: 1 round 1 · 2 name · 3 breaths · 4 round 2 · 5 memory ·
// 6 reading done = the result screen. 6 is a FULL test (card sent at once),
// 1–5 a PARTIAL one (card after 10 quiet minutes) — the database rule.

export const V3_PHASES = 6

export const PLAYERS = ['child', 'student', 'adult'] as const
export type Player = (typeof PLAYERS)[number]

/** The existing role values (database, cards, follow-ups): a child is a student; an adult a professional. */
export function roleForPlayer(p: Player): BuRole {
  return p === 'adult' ? 'professional' : 'student'
}

const GridRunSchema = z.object({
  ms: z.number().int().min(0).max(30 * 60_000),
  errors: z.number().int().min(0).max(500),
})
export type GridRun = z.infer<typeof GridRunSchema>

/** What the page measured. Each field is present once its step is done. */
export const V3RawSchema = z.object({
  player: z.enum(PLAYERS).nullable(),
  firstName: z.string().trim().max(30).nullable(),
  round1: GridRunSchema,
  breathsSkipped: z.boolean().optional(),
  round2: GridRunSchema.optional(),
  memorySetId: z.string().max(8).optional(),
  memoryPicked: z.array(z.string().max(20)).max(12).optional(),
  rsvpPassageId: z.string().max(8).optional(),
  rsvpAnswer: z.number().int().min(0).max(2).optional(),
})
export type V3Raw = z.infer<typeof V3RawSchema>

/** Seconds with the +1 s penalty per wrong tap. */
export function gridSeconds(run: GridRun): number {
  return roundSeconds(run.ms / 1000 + run.errors)
}

export type V3Facts = {
  v: 3
  role: Player | null
  round1_s: number
  round2_s?: number
  boost_pct?: number | null
  breaths_skipped?: boolean
  memory_hits?: number
  memory_false?: number
  rsvp_wpm?: number
  rsvp_correct?: boolean
  score_total?: number
  /** Same shape as v2's focus, so the WhatsApp message's {summary} line works unchanged. */
  focus: { before: number; after?: number }
}

/** Memory and reading results checked against the content (never trusted from the page). */
export function checkedResults(raw: V3Raw): { memoryHits: number; memoryFalse: number; rsvpCorrect: boolean | null } {
  const set = raw.memorySetId === undefined ? undefined : memorySetById(raw.memorySetId)
  const m = set === undefined || raw.memoryPicked === undefined ? { hits: 0, falsePicks: 0 } : memoryHitsFrom(set.shown.map((i) => i.id), raw.memoryPicked)
  const passage = raw.rsvpPassageId === undefined ? undefined : rsvpPassageById(raw.rsvpPassageId)
  const rsvpCorrect = passage === undefined || raw.rsvpAnswer === undefined ? null : raw.rsvpAnswer === passage.question.en.answer
  return { memoryHits: m.hits, memoryFalse: m.falsePicks, rsvpCorrect }
}

/** The full score (only meaningful once every round is done). */
export function scoreFor(raw: V3Raw): V3Score {
  const c = checkedResults(raw)
  return brainScore({
    round1Seconds: gridSeconds(raw.round1),
    round2Seconds: raw.round2 === undefined ? 0 : gridSeconds(raw.round2),
    breathsSkipped: raw.breathsSkipped ?? false,
    memoryHits: c.memoryHits,
    memoryFalse: c.memoryFalse,
    rsvpCorrect: c.rsvpCorrect === true,
  })
}

/** The numbers that may be sent after `phasesDone` steps. */
export function progressFactsV3(raw: V3Raw, phasesDone: number): V3Facts {
  const r1 = gridSeconds(raw.round1)
  const f: V3Facts = { v: 3, role: raw.player, round1_s: r1, focus: { before: r1 } }
  if (phasesDone >= 3) f.breaths_skipped = raw.breathsSkipped ?? false
  if (phasesDone >= 4 && raw.round2 !== undefined) {
    const r2 = gridSeconds(raw.round2)
    f.round2_s = r2
    f.focus = { before: r1, after: r2 }
    f.boost_pct = scoreFor(raw).boostPct
  }
  const c = checkedResults(raw)
  if (phasesDone >= 5) {
    f.memory_hits = c.memoryHits
    f.memory_false = c.memoryFalse
  }
  if (phasesDone >= 6 && c.rsvpCorrect !== null) {
    f.rsvp_wpm = RSVP_WPM
    f.rsvp_correct = c.rsvpCorrect
    f.score_total = scoreFor(raw).total
  }
  return f
}
