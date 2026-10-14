import { trackGaEvent, type GaEventName } from '@/lib/analytics/ga4'
import { trackLead } from '@/lib/analytics/conversions'
import { readUtmParams } from '@/lib/analytics/utm'

// Funnel for the Free Reading & Memory Test: where people drop off (each step
// completed), what they scored, which bonus they tried (with memory before →
// after), and every lead and WhatsApp open. Every event carries the visit's
// utm_* tags. No personal details are ever sent.
export type MemoryTestEvent =
  | { name: 'started'; lang: 'en' | 'hi' }
  | { name: 'step_completed'; step: 1 | 2 | 3; memory?: number }
  | { name: 'result_shown'; status: string; profile: string | null; retention: number; memory: number }
  | { name: 'bonus_story'; phase: 'opened' | 'finished'; before?: number; after?: number }
  | { name: 'bonus_boost'; phase: 'opened' | 'finished'; pace?: number; percent?: number }
  | { name: 'lead_submitted'; status: string; offer: boolean }
  | { name: 'whatsapp_opened'; how: 'auto' | 'button' }
  | { name: 'shared'; method: 'image' | 'whatsapp' }

const GA_NAME: Record<MemoryTestEvent['name'], GaEventName> = {
  started: 'memory_test_started',
  step_completed: 'memory_test_step_completed',
  result_shown: 'memory_test_result_shown',
  bonus_story: 'memory_test_bonus_story',
  bonus_boost: 'memory_test_bonus_boost',
  lead_submitted: 'memory_test_lead_submitted',
  whatsapp_opened: 'memory_test_whatsapp_opened',
  shared: 'memory_test_shared',
}

export function trackMemoryTest(event: MemoryTestEvent): void {
  const { name, ...rest } = event
  const params: Record<string, string> = { ...readUtmParams() }
  for (const [key, value] of Object.entries(rest)) if (value !== null && value !== undefined) params[key] = String(value)
  trackGaEvent(GA_NAME[name], params)
  if (name === 'started') trackLead('Free Reading & Memory Test', 'free_test_started')
  if (name === 'lead_submitted') trackLead('Free Reading & Memory Test', 'memory_test_whatsapp')
}
