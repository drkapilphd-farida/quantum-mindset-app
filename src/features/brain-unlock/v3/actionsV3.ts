'use server'

import { randomUUID } from 'node:crypto'
import { headers } from 'next/headers'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { createServiceClient } from '@/lib/supabase/service'
import type { Json } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { leadRef } from '../messages'
import { linkBrainTestRef } from '../progressServer'
import { SessionIdSchema, UtmSchema } from '../types'
import { checkedResults, progressFactsV3, roleForPlayer, scoreFor, V3_PHASES, V3RawSchema } from './progressV3'
import { RSVP_WPM } from './score'

// Brain Test v3 — "Send my report on WhatsApp". Saves the lead (admin lead
// list, same table as v2) and links its "Ref: BU-…" to this session's
// bt_progress row, so the bot sends the card when that chat arrives. The
// score is computed here from the raw measurements, never taken from the page.

const LeadV3Schema = z.object({
  sessionId: SessionIdSchema,
  lang: z.enum(['en', 'hi']),
  raw: V3RawSchema,
  utm: UtmSchema.optional(),
  /** "auto" = sent by itself (bot link with ?c=), "chat" = the visitor opened WhatsApp. */
  via: z.enum(['auto', 'chat']),
  pageUrl: z.string().url().max(2000),
})

export type SavedLeadV3 = { ok: true; ref: string; score: number } | { ok: false }

export async function saveBrainTestV3Lead(input: unknown): Promise<SavedLeadV3> {
  const parsed = LeadV3Schema.safeParse(input)
  if (!parsed.success) return { ok: false }
  const d = parsed.data
  // Only a finished test makes a lead.
  if (d.raw.round2 === undefined || d.raw.rsvpPassageId === undefined || d.raw.rsvpAnswer === undefined) return { ok: false }

  const ip = await getClientIp()
  if (!checkRateLimit(`brain-unlock-lead:${ip}`, { max: 5, windowMs: 60_000 }).allowed) return { ok: false }

  // The page must be this site.
  const host = (await headers()).get('host') ?? ''
  if (host !== '' && new URL(d.pageUrl).host !== host) return { ok: false }

  try {
    const score = scoreFor(d.raw)
    const checked = checkedResults(d.raw)
    const comprehension = checked.rsvpCorrect === true ? 100 : 0
    const utm = d.utm ?? {}
    const leadId = randomUUID()
    const ref = leadRef(leadId)
    const { error } = await createServiceClient()
      .from('speed_test_results')
      .insert({
        id: leadId,
        whatsapp_number: null,
        first_name: d.raw.firstName === null || d.raw.firstName === '' ? null : d.raw.firstName,
        email: null,
        passage_id: `v3-${d.raw.rsvpPassageId}`,
        lang: d.lang,
        wpm: RSVP_WPM,
        comprehension_percent: comprehension,
        effective_wpm: Math.round((RSVP_WPM * comprehension) / 100),
        status: 'valid',
        test_kind: 'brain_unlock',
        memory_correct: checked.memoryHits,
        role: d.raw.player === null ? 'student' : roleForPlayer(d.raw.player),
        class_band: null,
        brain_type: null,
        unlock_score: score.total,
        duo: false,
        session_id: d.sessionId,
        details: JSON.parse(
          JSON.stringify({ v: 3, facts: progressFactsV3(d.raw, V3_PHASES), score, player: d.raw.player, via: d.via }),
        ) as Json,
        utm_source: utm.utm_source ?? null,
        utm_medium: utm.utm_medium ?? null,
        utm_campaign: utm.utm_campaign ?? null,
        utm_term: utm.utm_term ?? null,
        utm_content: utm.utm_content ?? null,
      })
    if (error !== null) {
      logger.error('saveBrainTestV3Lead: insert failed', { code: error.code })
      return { ok: false }
    }
    await linkBrainTestRef(d.sessionId, ref)
    return { ok: true, ref, score: score.total }
  } catch (e) {
    logger.error('saveBrainTestV3Lead failed', { error: e instanceof Error ? e.message : 'unknown' })
    return { ok: false }
  }
}
