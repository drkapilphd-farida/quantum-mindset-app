'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { isAppLang } from '@/lib/app-i18n/languages'
import { firstDue } from './reviewSchedule'
import { cleanStations, MAX_PALACES, MAX_STATIONS, MIN_STATIONS, PALACE_KINDS, type MyPalace, type PalaceKind } from './palaces'

// Personal memory palaces (Group A). Learners read their own rows; writes go
// through the server.

type Fail = { ok: false; error: 'unauthenticated' | 'invalid' | 'limit' | 'db' }

async function userId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function listMyPalaces(): Promise<MyPalace[]> {
  const uid = await userId()
  if (uid === null) return []
  const supabase = await createClient()
  const { data, error } = await supabase.from('memory_palaces').select('id, name, kind, stations').eq('user_id', uid).order('created_at', { ascending: true })
  if (error) {
    logger.error('listMyPalaces: read failed', { code: error.code })
    return []
  }
  return (data ?? []).map((p) => ({ id: p.id, name: p.name, kind: p.kind as PalaceKind, stations: p.stations }))
}

const PalaceSchema = z.object({
  id: z.string().uuid().nullable(),
  name: z.string().trim().min(1).max(60),
  kind: z.enum(PALACE_KINDS as unknown as [PalaceKind, ...PalaceKind[]]),
  stations: z.array(z.string()).max(40),
})

/** Create (at most 3) or update a palace: 10–20 stations in walking order. */
export async function savePalace(input: unknown): Promise<{ ok: true; id: string } | Fail> {
  const parsed = PalaceSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const stations = cleanStations(parsed.data.stations)
  if (stations.length < MIN_STATIONS || stations.length > MAX_STATIONS) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const db = createServiceClient()
  const row = { name: parsed.data.name, kind: parsed.data.kind, stations, updated_at: new Date().toISOString() }
  if (parsed.data.id !== null) {
    const { data, error } = await db.from('memory_palaces').update(row).eq('id', parsed.data.id).eq('user_id', uid).select('id').maybeSingle()
    if (error || !data) return { ok: false, error: 'db' }
    return { ok: true, id: data.id }
  }
  const { count } = await db.from('memory_palaces').select('id', { count: 'exact', head: true }).eq('user_id', uid)
  if ((count ?? 0) >= MAX_PALACES) return { ok: false, error: 'limit' }
  const { data, error } = await db.from('memory_palaces').insert({ user_id: uid, ...row }).select('id').single()
  if (error || !data) {
    logger.error('savePalace: insert failed', { code: error?.code })
    return { ok: false, error: 'db' }
  }
  return { ok: true, id: data.id }
}

export async function deletePalace(input: unknown): Promise<{ ok: true } | Fail> {
  const parsed = z.object({ id: z.string().uuid() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const { error } = await createServiceClient().from('memory_palaces').delete().eq('id', parsed.data.id).eq('user_id', uid)
  return error ? { ok: false, error: 'db' } : { ok: true }
}

/** The learner's own list placed along one of their palaces: saved and added to the review queue (due tomorrow). */
export async function savePalaceList(input: unknown): Promise<{ ok: true } | Fail> {
  const parsed = z
    .object({ palaceId: z.string().uuid(), title: z.string().trim().min(1).max(120), items: z.array(z.string().trim().min(1).max(60)).min(2).max(20), lang: z.string().refine(isAppLang) })
    .safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const db = createServiceClient()
  const { data: palace } = await db.from('memory_palaces').select('name, stations').eq('id', parsed.data.palaceId).eq('user_id', uid).maybeSingle()
  if (!palace || palace.stations.length < parsed.data.items.length) return { ok: false, error: 'invalid' }
  const { title, items, lang } = parsed.data
  const placed = items.map((item, i) => `${palace.stations[i]} → ${item}`)
  const { data, error } = await db.from('memory_creations').insert({ user_id: uid, method: 'palace', title, items, story: placed.join('\n'), lang }).select('id').single()
  if (error || !data) {
    logger.error('savePalaceList: insert failed', { code: error?.code })
    return { ok: false, error: 'db' }
  }
  const due = firstDue(Date.now())
  await db.from('review_items').insert({
    user_id: uid,
    source: 'palace',
    source_ref: data.id,
    front: { kind: 'list', method: 'palace', title, count: items.length, palace: palace.name },
    back: { items: placed },
    lang,
    step: due.step,
    due_at: due.dueAt,
  })
  return { ok: true }
}
