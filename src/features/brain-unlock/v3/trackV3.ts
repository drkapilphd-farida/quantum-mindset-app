import { trackGaEvent } from '@/lib/analytics/ga4'
import { trackLead } from '@/lib/analytics/conversions'
import { readUtmParams } from '@/lib/analytics/utm'
import { logBrainUnlockEvent } from '../actions'
import { currentDevice } from '../device'
import type { BuRole } from '../passages'
import { sessionId } from '../tracking'
import type { FunnelEvent } from '../types'

// Brain Test v3 funnel. GA4 gets the v3 step names as they are. The
// brain_unlock_events table only accepts its existing event names (a CHECK
// constraint), so there each v3 step is stored under the closest existing
// event with { v: 3, step: "<v3 name>" } in `data` — no schema change needed.

export const V3_EVENTS = [
  'v3_open',
  'v3_round1_done',
  'v3_name_done',
  'v3_breath_done',
  'v3_round2_done',
  'v3_memory_done',
  'v3_rsvp_done',
  'report_view',
  'whatsapp_submitted',
] as const
export type V3Event = (typeof V3_EVENTS)[number]

const STORED_AS: Record<V3Event, Exclude<FunnelEvent, 'payment_success'>> = {
  v3_open: 'landing',
  v3_round1_done: 'check_done',
  v3_name_done: 'role_picked',
  v3_breath_done: 'check_done',
  v3_round2_done: 'check_done',
  v3_memory_done: 'check_done',
  v3_rsvp_done: 'check_done',
  report_view: 'report_view',
  whatsapp_submitted: 'whatsapp_submitted',
}

/** The database event a v3 step is stored as (exported for tests). */
export function storedEventFor(event: V3Event): FunnelEvent {
  return STORED_AS[event]
}

export function trackV3(event: V3Event, ctx: { role: BuRole | null; lang: 'en' | 'hi' }, data: Record<string, number | string | boolean> = {}): void {
  if (typeof window === 'undefined') return
  const utm = readUtmParams()
  logBrainUnlockEvent({
    sessionId: sessionId(),
    event: STORED_AS[event],
    role: ctx.role,
    lang: ctx.lang,
    duo: false,
    data: { ...data, v: 3, step: event, device: currentDevice() },
    utm,
  }).catch(() => undefined)
  const params: Record<string, string | number> = { step: event, lang: ctx.lang, v: 3, ...utm }
  if (ctx.role !== null) params.role = ctx.role
  for (const [k, v] of Object.entries(data)) params[k] = typeof v === 'boolean' ? (v ? 1 : 0) : v
  trackGaEvent('brain_unlock_step', params)
  if (event === 'whatsapp_submitted') trackLead('Brain Unlock', 'whatsapp_report')
}
