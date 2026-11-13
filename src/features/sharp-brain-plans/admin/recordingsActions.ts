'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { currentAdminEmail } from '@/features/live-classes/admin/data'
import { youtubeIdFromUrl, type ClassRecording } from '../rules'

// /admin/recordings: paste a YouTube (unlisted) link + class number + title +
// date → Save, and learners see it at once (no deploy). Edit, reorder, hide,
// delete. Admin-only (ADMIN_EMAILS), service role writes.

type Result = { ok: true; message: string } | { ok: false; error: string }

const PAGES = ['/admin/recordings', '/masterclasses'] as const
function refresh(): void {
  for (const page of PAGES) revalidatePath(page)
}

export async function listRecordingsForAdmin(): Promise<ClassRecording[]> {
  if ((await currentAdminEmail()) === null) return []
  const { data, error } = await createServiceClient()
    .from('class_recordings')
    .select('id, class_number, title, class_date, youtube_id, sort_order, hidden')
    .order('sort_order')
    .order('class_number')
    .order('class_date')
  if (error) logger.error('listRecordingsForAdmin: read failed', { code: error.code })
  return (data ?? []).map((r) => ({ id: r.id, classNumber: r.class_number, title: r.title, classDate: r.class_date, youtubeId: r.youtube_id, sortOrder: r.sort_order, hidden: r.hidden }))
}

const SaveSchema = z.object({
  id: z.string().uuid().optional(),
  link: z.string().trim().min(1).max(500),
  classNumber: z.number().int().min(1).max(7),
  title: z.string().trim().min(1).max(160),
  classDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export async function saveRecording(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail()
  if (admin === null) return { ok: false, error: 'Not authorized.' }
  const parsed = SaveSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Please fill in the link, class number (1–7), title and date.' }
  const d = parsed.data
  const youtubeId = youtubeIdFromUrl(d.link)
  if (youtubeId === null) return { ok: false, error: 'That is not a YouTube video link. Paste the link from YouTube (youtube.com/watch?v=… or youtu.be/…).' }
  const db = createServiceClient()

  if (d.id !== undefined) {
    const { data, error } = await db
      .from('class_recordings')
      .update({ youtube_id: youtubeId, class_number: d.classNumber, title: d.title, class_date: d.classDate, updated_at: new Date().toISOString() })
      .eq('id', d.id)
      .select('id')
    if (error || !data || data.length === 0) {
      logger.error('saveRecording: update failed', { code: error?.code })
      return { ok: false, error: 'Could not save the change.' }
    }
    refresh()
    return { ok: true, message: 'Saved. Learners see the change now.' }
  }

  const { data: last } = await db.from('class_recordings').select('sort_order').order('sort_order', { ascending: false }).limit(1)
  const sortOrder = (last?.[0]?.sort_order ?? 0) + 10
  const { error } = await db.from('class_recordings').insert({ youtube_id: youtubeId, class_number: d.classNumber, title: d.title, class_date: d.classDate, sort_order: sortOrder, created_by: admin })
  if (error) {
    logger.error('saveRecording: insert failed', { code: error.code })
    return { ok: false, error: 'Could not save. Please try again.' }
  }
  refresh()
  return { ok: true, message: 'Saved. Learners can watch it now.' }
}

const IdSchema = z.object({ id: z.string().uuid() })

export async function setRecordingHidden(input: unknown): Promise<Result> {
  if ((await currentAdminEmail()) === null) return { ok: false, error: 'Not authorized.' }
  const parsed = IdSchema.extend({ hidden: z.boolean() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid recording.' }
  const { error } = await createServiceClient().from('class_recordings').update({ hidden: parsed.data.hidden, updated_at: new Date().toISOString() }).eq('id', parsed.data.id)
  if (error) return { ok: false, error: 'Could not save.' }
  refresh()
  return { ok: true, message: parsed.data.hidden ? 'Hidden from learners.' : 'Visible to learners.' }
}

export async function deleteRecording(input: unknown): Promise<Result> {
  if ((await currentAdminEmail()) === null) return { ok: false, error: 'Not authorized.' }
  const parsed = IdSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid recording.' }
  const { error } = await createServiceClient().from('class_recordings').delete().eq('id', parsed.data.id)
  if (error) return { ok: false, error: 'Could not delete.' }
  refresh()
  return { ok: true, message: 'Deleted.' }
}

/** Moves a recording one place up or down in the list (swaps sort order with its neighbour). */
export async function moveRecording(input: unknown): Promise<Result> {
  if ((await currentAdminEmail()) === null) return { ok: false, error: 'Not authorized.' }
  const parsed = IdSchema.extend({ direction: z.enum(['up', 'down']) }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid recording.' }
  const list = await listRecordingsForAdmin()
  const index = list.findIndex((r) => r.id === parsed.data.id)
  const other = list[parsed.data.direction === 'up' ? index - 1 : index + 1]
  const current = list[index]
  if (current === undefined || other === undefined) return { ok: true, message: 'Already at the end.' }
  // Renumber the whole list in steps of 10 with the two swapped, so equal sort orders can never stick.
  const order = [...list]
  order[index] = other
  order[list.indexOf(other)] = current
  const db = createServiceClient()
  const results = await Promise.all(order.map((r, i) => db.from('class_recordings').update({ sort_order: (i + 1) * 10 }).eq('id', r.id)))
  if (results.some((r) => r.error)) return { ok: false, error: 'Could not reorder.' }
  refresh()
  return { ok: true, message: 'Moved.' }
}
