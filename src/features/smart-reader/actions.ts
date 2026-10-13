'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { getFairResults } from '@/features/fair-reading-test/actions'
import { memoryStudio } from '@/config/site.config'
import { generateSectionQuestions, SECTION_QUESTIONS_FEATURE } from './generateSectionQuestions'
import { clampWpm, splitIntoSections, startWpm, type ReaderMode, type ReaderSection } from './reader'

// Smart Reader server actions: where to start (speed + saved place), saving
// the place, and the section questions for a learner's own chapter.

const Source = z.object({ source: z.enum(['library', 'chapter']), ref: z.string().trim().min(1).max(120) })
export type ReaderStart = { wpm: number; section: number; wordIndex: number; mode: ReaderMode; finished: boolean; measured: boolean }

async function userId(): Promise<string | null> {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser()
  return user?.id ?? null
}

/** The saved place (if any) and the start speed: the saved speed, else the latest fair reading test + 10%. */
export async function getReaderStart(input: unknown): Promise<ReaderStart> {
  const parsed = Source.safeParse(input)
  const uid = await userId()
  const fallback = async (): Promise<ReaderStart> => {
    const results = await getFairResults().catch(() => [])
    const latest = [...results].reverse().find((r) => r.status === 'valid') ?? results.at(-1) ?? null
    return { wpm: startWpm(latest?.wpm ?? null), section: 0, wordIndex: 0, mode: 'pacer', finished: false, measured: latest !== null }
  }
  if (!parsed.success || uid === null) return fallback()
  const { data, error } = await (await createClient()).from('reading_positions').select('section, word_index, wpm, mode, finished').eq('user_id', uid).eq('source', parsed.data.source).eq('source_ref', parsed.data.ref).maybeSingle()
  if (error) logger.warn('getReaderStart: read failed', { code: error.code })
  if (!data) return fallback()
  return { wpm: clampWpm(data.wpm), section: data.section, wordIndex: data.word_index, mode: data.mode as ReaderMode, finished: data.finished, measured: true }
}

const Position = Source.extend({ section: z.number().int().min(0).max(60), wordIndex: z.number().int().min(0).max(20000), wpm: z.number().int().min(50).max(1000), mode: z.enum(['pacer', 'flash', 'normal']), finished: z.boolean() })

export async function saveReaderPosition(input: unknown): Promise<{ ok: boolean }> {
  const parsed = Position.safeParse(input)
  const uid = await userId()
  if (!parsed.success || uid === null) return { ok: false }
  const p = parsed.data
  const { error } = await createServiceClient()
    .from('reading_positions')
    .upsert({ user_id: uid, source: p.source, source_ref: p.ref, section: p.section, word_index: p.wordIndex, wpm: p.wpm, mode: p.mode, finished: p.finished, updated_at: new Date().toISOString() }, { onConflict: 'user_id,source,source_ref' })
  if (error) logger.error('saveReaderPosition: upsert failed', { code: error.code })
  return { ok: !error }
}

/** A learner's own chapter text → sections, with 2 questions each from one AI call (limited per day). Questions are left empty if the AI isn't available — the reader still works. */
export async function prepareOwnChapter(input: unknown): Promise<{ ok: true; sections: ReaderSection[] } | { ok: false; error: 'invalid' | 'unauthenticated' }> {
  const parsed = z.object({ text: z.string().min(200).max(memoryStudio.maxChapterChars) }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const sections = splitIntoSections(parsed.data.text).slice(0, 12)
  const since = new Date(Date.now() - 24 * 3_600_000).toISOString()
  const { count } = await createServiceClient().from('ai_cost_log').select('id', { count: 'exact', head: true }).eq('feature', SECTION_QUESTIONS_FEATURE).like('request_id', `${uid}:%`).gte('created_at', since)
  const questions = (count ?? 0) < memoryStudio.chapterMapsPerDay * 2 ? await generateSectionQuestions(uid, sections.map((s) => s.text)) : null
  return { ok: true, sections: sections.map((s, i) => ({ heading: s.heading, text: s.text, questions: questions?.[i] ?? [] })) }
}
