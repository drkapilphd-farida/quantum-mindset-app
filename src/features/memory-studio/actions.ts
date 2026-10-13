'use server'

import { randomUUID } from 'node:crypto'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { DEFAULT_MODEL_PRICING } from '@/core/ai-foundation/types/ModelPricing'
import { isAppLang, LANGUAGES } from '@/lib/app-i18n/languages'
import { afterReview, cardSeconds, firstDue, pickSession, sessionMinutes, type ReviewResult } from './reviewSchedule'
import type { PegSet } from './content'
import { NUMBER_SETS, type NumberList } from './numberCode'

// Memory Studio (Release 2): the learner's own lists, the shared review queue
// and the optional "Suggest an idea" helper. Writes go through the server.

const LangSchema = z.string().refine(isAppLang)
type Fail = { ok: false; error: 'unauthenticated' | 'invalid' | 'db' | 'limit' | 'unavailable' }

async function userId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

// ── Own lists ────────────────────────────────────────────────────────────

const ItemText = z.string().trim().min(1).max(60)
/** Own-list methods. Name–Face items are "name — who they are", so they may be longer. */
const OWN_METHODS = ['story', 'peg', 'name-face', 'number', 'keyword', 'acronym'] as const
export type OwnMethod = (typeof OWN_METHODS)[number]
const OwnListSchema = z.object({
  method: z.enum(OWN_METHODS),
  title: z.string().trim().min(1).max(120),
  items: z.array(z.string().trim().min(1).max(120)).min(2).max(20),
  /** Story: the learner's story. Other methods: one line per item ("the picture I made"), joined by new lines. */
  story: z.string().trim().max(2000).nullable(),
  lang: LangSchema,
})

/** Saves a list the learner made with a method, and adds it to the review queue (due tomorrow). */
export async function saveOwnList(input: unknown): Promise<{ ok: true; id: string } | Fail> {
  const parsed = OwnListSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const { method, title, items, story, lang } = parsed.data
  const db = createServiceClient()
  const { data, error } = await db.from('memory_creations').insert({ user_id: uid, method, title, items, story, lang }).select('id').single()
  if (error || !data) {
    logger.error('saveOwnList: insert failed', { code: error?.code })
    return { ok: false, error: 'db' }
  }
  const due = firstDue(Date.now())
  const { error: reviewError } = await db.from('review_items').insert({
    user_id: uid,
    source: method === 'peg' ? 'peg-list' : method,
    source_ref: data.id,
    front: { kind: 'list', method, title, count: items.length },
    back: { items },
    lang,
    step: due.step,
    due_at: due.dueAt,
  })
  if (reviewError) logger.error('saveOwnList: review insert failed', { code: reviewError.code })
  return { ok: true, id: data.id }
}

/** After learning the pegs: one review card per peg (1–10). Already-added pegs are left as they are. */
export async function addPegCards(input: unknown): Promise<{ ok: true } | Fail> {
  const parsed = z.object({ set: z.enum(['rhyme', 'shape']), lang: LangSchema }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const due = firstDue(Date.now())
  const rows = Array.from({ length: 10 }, (_, i) => ({
    user_id: uid,
    source: 'peg',
    source_ref: `${parsed.data.set}-${i + 1}`,
    front: { kind: 'peg', set: parsed.data.set satisfies PegSet, n: i + 1 },
    back: { set: parsed.data.set, n: i + 1 },
    lang: parsed.data.lang,
    step: due.step,
    due_at: due.dueAt,
  }))
  const { error } = await createServiceClient().from('review_items').upsert(rows, { onConflict: 'user_id,source,source_ref', ignoreDuplicates: true })
  if (error) {
    logger.error('addPegCards: upsert failed', { code: error.code })
    return { ok: false, error: 'db' }
  }
  return { ok: true }
}

/** After learning a set of 10 number pictures (00–09 … 90–99): one review card per picture. Already-added cards are left as they are. */
export async function addNumberCards(input: unknown): Promise<{ ok: true } | Fail> {
  const parsed = z.object({ list: z.enum(['en', 'hi']), set: z.number().int().min(0).max(NUMBER_SETS - 1), lang: LangSchema }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const { list, set, lang } = parsed.data
  const due = firstDue(Date.now())
  const rows = Array.from({ length: 10 }, (_, i) => {
    const n = String(set * 10 + i).padStart(2, '0')
    return { user_id: uid, source: 'number', source_ref: `${list}-${n}`, front: { kind: 'number', list: list satisfies NumberList, n }, back: { list, n }, lang, step: due.step, due_at: due.dueAt }
  })
  const { error } = await createServiceClient().from('review_items').upsert(rows, { onConflict: 'user_id,source,source_ref', ignoreDuplicates: true })
  if (error) {
    logger.error('addNumberCards: upsert failed', { code: error.code })
    return { ok: false, error: 'db' }
  }
  return { ok: true }
}

/** Which sets of number pictures the learner has learned (their cards are in the review queue). */
export async function getLearnedNumberSets(input: unknown): Promise<number[]> {
  const parsed = z.object({ list: z.enum(['en', 'hi']) }).safeParse(input)
  const uid = await userId()
  if (!parsed.success || uid === null) return []
  const supabase = await createClient()
  const { data, error } = await supabase.from('review_items').select('source_ref').eq('user_id', uid).eq('source', 'number').like('source_ref', `${parsed.data.list}-%`).limit(200)
  if (error) {
    logger.error('getLearnedNumberSets: read failed', { code: error.code })
    return []
  }
  const sets = new Set((data ?? []).map((r) => Math.floor(Number(String(r.source_ref).slice(3)) / 10)).filter((x) => Number.isInteger(x) && x >= 0 && x < NUMBER_SETS))
  return [...sets].sort((a, b) => a - b)
}

// ── Review queue ─────────────────────────────────────────────────────────

export type ListMethod = 'story' | 'peg' | 'palace' | 'chapter' | 'name-face' | 'number' | 'keyword' | 'acronym'
const LIST_METHODS: readonly ListMethod[] = ['story', 'peg', 'palace', 'chapter', 'name-face', 'number', 'keyword', 'acronym']

export type ReviewCard =
  | { id: string; kind: 'list'; method: ListMethod; title: string; items: string[]; dueAt: string; seconds: number }
  | { id: string; kind: 'peg'; set: PegSet; n: number; dueAt: string; seconds: number }
  | { id: string; kind: 'number'; list: NumberList; n: string; dueAt: string; seconds: number }

type Row = { id: string; front: unknown; back: unknown; due_at: string }

function toCard(row: Row): ReviewCard | null {
  const front = (row.front ?? {}) as Record<string, unknown>
  const back = (row.back ?? {}) as Record<string, unknown>
  if (front.kind === 'list' && Array.isArray(back.items) && typeof front.title === 'string') {
    const items = back.items.filter((x): x is string => typeof x === 'string')
    return { id: row.id, kind: 'list', method: LIST_METHODS.includes(front.method as ListMethod) ? (front.method as ListMethod) : 'story', title: front.title, items, dueAt: row.due_at, seconds: cardSeconds({ kind: 'list', count: items.length }) }
  }
  if (front.kind === 'peg' && (front.set === 'rhyme' || front.set === 'shape') && typeof front.n === 'number') {
    return { id: row.id, kind: 'peg', set: front.set, n: front.n, dueAt: row.due_at, seconds: cardSeconds({ kind: 'peg' }) }
  }
  if (front.kind === 'number' && (front.list === 'en' || front.list === 'hi') && typeof front.n === 'string' && /^\d\d$/.test(front.n)) {
    return { id: row.id, kind: 'number', list: front.list, n: front.n, dueAt: row.due_at, seconds: cardSeconds({ kind: 'peg' }) }
  }
  return null
}

async function dueCards(): Promise<ReviewCard[]> {
  const uid = await userId()
  if (uid === null) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('review_items')
    .select('id, front, back, due_at')
    .eq('user_id', uid)
    .not('due_at', 'is', null)
    .lte('due_at', new Date().toISOString())
    .order('due_at', { ascending: true })
    .limit(200)
  if (error) {
    logger.error('dueCards: read failed', { code: error.code })
    return []
  }
  return (data ?? []).map((r) => toCard(r as Row)).filter((c): c is ReviewCard => c !== null)
}

/** For the dashboard card: how many cards are due and about how long today's review takes. */
export async function getReviewSummary(): Promise<{ due: number; minutes: number } | null> {
  const due = await dueCards()
  if (due.length === 0) return null
  return { due: due.length, minutes: sessionMinutes(pickSession(due)) }
}

/** Today's review: the due cards that fit in about 5 minutes, oldest first. */
export async function getReviewSession(): Promise<ReviewCard[]> {
  return pickSession(await dueCards())
}

export async function recordReview(input: unknown): Promise<{ ok: true } | Fail> {
  const parsed = z.object({ id: z.string().uuid(), result: z.enum(['remembered', 'forgot']) }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const db = createServiceClient()
  const { data: row } = await db.from('review_items').select('step, reviews').eq('id', parsed.data.id).eq('user_id', uid).maybeSingle()
  if (!row) return { ok: false, error: 'invalid' }
  const next = afterReview(row.step, parsed.data.result as ReviewResult, Date.now())
  const { error } = await db
    .from('review_items')
    .update({ step: next.step, due_at: next.dueAt, last_result: parsed.data.result, reviews: row.reviews + 1, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.id)
    .eq('user_id', uid)
  if (error) {
    logger.error('recordReview: update failed', { code: error.code })
    return { ok: false, error: 'db' }
  }
  return { ok: true }
}

// ── "Suggest an idea" (AI only suggests; the learner writes or edits) ────

const MODEL = 'claude-haiku-4-5-20251001'
const FEATURE = 'memory-studio-suggest'
const SUGGESTIONS_PER_DAY = 20

const SYSTEM = [
  'You help children and adults use memory techniques. Reply with the idea only — no greeting, no list markup, no explanations.',
  'Make it vivid, funny and kind: big sizes, movement, sounds, colours. Never violent, scary, rude or about real people.',
  'Keep every item exactly as given, in the given order, and do not add other objects or characters beyond what links them. Use simple words a 10-year-old understands. Normal sentence case — never ALL CAPS, no sound effects in capitals, no emoji.',
].join(' ')

const SuggestSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('story'), items: z.array(ItemText).min(2).max(20), lang: LangSchema }),
  z.object({ kind: z.literal('peg'), peg: z.string().trim().min(1).max(60), n: z.number().int().min(1).max(20), item: ItemText, lang: LangSchema }),
  z.object({ kind: z.literal('face'), name: ItemText, feature: z.string().trim().min(1).max(60), lang: LangSchema }),
])

async function usedToday(uid: string): Promise<number> {
  const since = new Date(Date.now() - 24 * 3_600_000).toISOString()
  const { count } = await createServiceClient().from('ai_cost_log').select('id', { count: 'exact', head: true }).eq('feature', FEATURE).like('request_id', `${uid}:%`).gte('created_at', since)
  return count ?? 0
}

export async function suggestIdea(input: unknown): Promise<{ ok: true; text: string } | Fail> {
  const parsed = SuggestSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return { ok: false, error: 'unavailable' }
  if ((await usedToday(uid)) >= SUGGESTIONS_PER_DAY) return { ok: false, error: 'limit' }

  const p = parsed.data
  const language = LANGUAGES[p.lang].englishName
  const prompt =
    p.kind === 'story'
      ? `Write one short linking story (3–5 sentences, in ${language}) that connects these items in this exact order, each one doing something to the next: ${p.items.join(', ')}.`
      : p.kind === 'peg'
        ? `Peg number ${p.n} is "${p.peg}". Write one vivid picture (one sentence, in ${language}) that joins "${p.peg}" with "${p.item}" so the item is easy to remember at number ${p.n}.`
        : `A made-up cartoon person called "${p.name}" has this feature: ${p.feature}. Write one vivid picture (one or two short sentences, in ${language}) that turns the name into a picture — its meaning, or an everyday word that sounds like it — and joins that picture to the feature, so the name comes back when you see the face. Do not mention any famous person.`
  const started = Date.now()
  try {
    const response = await new Anthropic({ apiKey }).messages.create({ model: MODEL, max_tokens: p.kind === 'story' ? 400 : p.kind === 'face' ? 160 : 120, system: SYSTEM, messages: [{ role: 'user', content: prompt }] })
    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join(' ')
      .trim()
    const rate = DEFAULT_MODEL_PRICING[MODEL]
    await createServiceClient()
      .from('ai_cost_log')
      .insert({
        document_id: null,
        chunk_id: null,
        feature: FEATURE,
        model_id: MODEL,
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        estimated_cost_cents: rate ? (response.usage.input_tokens / 1000) * rate.inputCentsPer1kTokens + (response.usage.output_tokens / 1000) * rate.outputCentsPer1kTokens : 0,
        processing_time_ms: Date.now() - started,
        request_id: `${uid}:${randomUUID()}`,
        success: text.length > 0,
        error_message: null,
      })
    if (text.length === 0) return { ok: false, error: 'unavailable' }
    return { ok: true, text: text.slice(0, 1500) }
  } catch (error) {
    logger.error('suggestIdea: AI call failed', { message: error instanceof Error ? error.message : 'unknown' })
    return { ok: false, error: 'unavailable' }
  }
}
