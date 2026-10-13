'use server'

import { createHash } from 'node:crypto'
import { z } from 'zod'
import { memoryStudio } from '@/config/site.config'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { isAppLang } from '@/lib/app-i18n/languages'
import { capChapterText, cleanChapterText, IdeaSchema, istDayStart, looksGarbled, MAX_IDEAS, MIN_IDEAS, wordCount, type ChapterIdea, type ChapterQuestion } from './chapterBook'
import { generateChapterMap } from './generateChapterMap'
import { firstDue } from './reviewSchedule'

// Chapter & Book (Group A): server side. Learners read their own maps; the
// server writes them and calls the AI (at most 3 new chapters a day).

type Fail = { ok: false; error: 'unauthenticated' | 'invalid' | 'too-short' | 'garbled' | 'limit' | 'unavailable' | 'db' }
export type ChapterMap = { id: string; title: string; bookTitle: string | null; ideas: ChapterIdea[]; questions: ChapterQuestion[]; palaceId: string | null; createdAt: string }

async function userId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

type Row = { id: string; title: string; book_title: string | null; ideas: unknown; questions: unknown; palace_id: string | null; created_at: string }
const toMap = (r: Row): ChapterMap => ({ id: r.id, title: r.title, bookTitle: r.book_title, ideas: r.ideas as ChapterIdea[], questions: r.questions as ChapterQuestion[], palaceId: r.palace_id, createdAt: r.created_at })
const COLS = 'id, title, book_title, ideas, questions, palace_id, created_at'

export async function listChapterMaps(): Promise<ChapterMap[]> {
  const uid = await userId()
  if (uid === null) return []
  const { data, error } = await (await createClient()).from('chapter_maps').select(COLS).eq('user_id', uid).order('created_at', { ascending: false }).limit(100)
  if (error) logger.error('listChapterMaps: read failed', { code: error.code })
  return (data ?? []).map((r) => toMap(r as Row))
}

/** New chapter → key ideas + questions (AI). The same text again reuses the saved map (no AI, not counted). */
export async function createChapterMap(input: unknown): Promise<({ ok: true; cut: boolean } & { map: ChapterMap }) | Fail> {
  const parsed = z.object({ title: z.string().trim().min(1).max(120), bookTitle: z.string().trim().max(120).optional(), text: z.string().max(400_000), source: z.enum(['paste', 'upload']), lang: z.string().refine(isAppLang) }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const cleaned = cleanChapterText(parsed.data.text)
  if (looksGarbled(cleaned)) return { ok: false, error: 'garbled' }
  if (wordCount(cleaned) < 120) return { ok: false, error: 'too-short' }
  const { text, cut } = capChapterText(cleaned, memoryStudio.maxChapterChars)
  const hash = createHash('sha256').update(text).digest('hex')
  const db = createServiceClient()

  const { data: same } = await db.from('chapter_maps').select(COLS).eq('user_id', uid).eq('text_hash', hash).limit(1)
  if (same && same.length > 0) return { ok: true, cut, map: toMap(same[0] as Row) }

  const { count } = await db.from('chapter_maps').select('id', { count: 'exact', head: true }).eq('user_id', uid).gte('created_at', istDayStart())
  if ((count ?? 0) >= memoryStudio.chapterMapsPerDay) return { ok: false, error: 'limit' }

  const ai = await generateChapterMap(uid, parsed.data.title, text)
  if (!ai.ok) return { ok: false, error: 'unavailable' }
  const { data, error } = await db
    .from('chapter_maps')
    .insert({ user_id: uid, title: parsed.data.title, book_title: parsed.data.bookTitle || null, source: parsed.data.source, text_hash: hash, lang: parsed.data.lang, ideas: ai.ideas, questions: ai.questions })
    .select(COLS)
    .single()
  if (error || !data) {
    logger.error('createChapterMap: insert failed', { code: error?.code })
    return { ok: false, error: 'db' }
  }
  return { ok: true, cut, map: toMap(data as Row) }
}

/** The learner's edits (rename, change, reorder, add, delete ideas) and the palace chosen for the journey. */
export async function saveChapterMap(input: unknown): Promise<{ ok: true } | Fail> {
  const parsed = z.object({ id: z.string().uuid(), ideas: z.array(IdeaSchema).min(MIN_IDEAS).max(MAX_IDEAS), palaceId: z.string().uuid().nullable() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const db = createServiceClient()
  const { data: current } = await db.from('chapter_maps').select('questions').eq('id', parsed.data.id).eq('user_id', uid).maybeSingle()
  if (!current) return { ok: false, error: 'invalid' }
  // Questions about an idea that was deleted are dropped; the rest keep pointing at an idea that still exists.
  const questions = (current.questions as ChapterQuestion[]).filter((q) => q.idea < parsed.data.ideas.length)
  const { error } = await db
    .from('chapter_maps')
    .update({ ideas: parsed.data.ideas, questions, palace_id: parsed.data.palaceId, edited: true, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.id)
    .eq('user_id', uid)
  return error ? { ok: false, error: 'db' } : { ok: true }
}

export async function deleteChapterMap(input: unknown): Promise<{ ok: true } | Fail> {
  const parsed = z.object({ id: z.string().uuid() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const db = createServiceClient()
  await db.from('review_items').delete().eq('user_id', uid).eq('source', 'chapter').like('source_ref', `${parsed.data.id}%`)
  const { error } = await db.from('chapter_maps').delete().eq('id', parsed.data.id).eq('user_id', uid)
  return error ? { ok: false, error: 'db' } : { ok: true }
}

/** After walking the chapter: the whole chapter (ideas in order) and each missed idea go into the review queue. */
export async function addChapterReviews(input: unknown): Promise<{ ok: true } | Fail> {
  const parsed = z.object({ id: z.string().uuid(), weak: z.array(z.number().int().min(0).max(MAX_IDEAS)).max(MAX_IDEAS), lang: z.string().refine(isAppLang) }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const db = createServiceClient()
  const { data: map } = await db.from('chapter_maps').select('title, ideas').eq('id', parsed.data.id).eq('user_id', uid).maybeSingle()
  if (!map) return { ok: false, error: 'invalid' }
  const ideas = map.ideas as ChapterIdea[]
  const due = firstDue(Date.now())
  const rows = [
    { source_ref: parsed.data.id, front: { kind: 'list', method: 'chapter', title: map.title, count: ideas.length }, back: { items: ideas.map((i) => i.title) } },
    ...parsed.data.weak
      .filter((i) => i < ideas.length)
      .map((i) => ({ source_ref: `${parsed.data.id}:${i}`, front: { kind: 'list', method: 'chapter', title: `${map.title} — ${i + 1}`, count: 1 }, back: { items: [`${ideas[i]!.title}: ${ideas[i]!.detail}`] } })),
  ].map((r) => ({ user_id: uid, source: 'chapter', lang: parsed.data.lang, step: due.step, due_at: due.dueAt, ...r }))
  const { error } = await db.from('review_items').upsert(rows, { onConflict: 'user_id,source,source_ref', ignoreDuplicates: true })
  if (error) logger.error('addChapterReviews: upsert failed', { code: error.code })
  return error ? { ok: false, error: 'db' } : { ok: true }
}
