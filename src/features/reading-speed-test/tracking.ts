// Reading Speed Test funnel events. GA4 attributes each event to the visit's
// source (utm_* tags), so the funnel can be read per video or ad; the
// WhatsApp lead itself also stores those tags (saveSpeedTestResult).
import { trackGaEvent, type GaEventName } from '@/lib/analytics/ga4'
import { trackLead } from '@/lib/analytics/conversions'
import { readUtmParams } from '@/lib/analytics/utm'

export type SpeedTestEvent =
  | { name: 'started'; lang: 'en' | 'hi' }
  | { name: 'completed'; status: 'valid' | 'too_fast' | 'low_comprehension'; profile: string | null; band: string | null }
  | { name: 'shared'; method: 'image' | 'whatsapp' | 'link' }
  | { name: 'boost_played'; paceWpm: number }
  | { name: 'whatsapp_submitted'; status: string; profile: string | null }
  | { name: 'offer_used' }

const GA_NAME: Record<SpeedTestEvent['name'], GaEventName> = {
  started: 'speed_test_started',
  completed: 'speed_test_completed',
  shared: 'speed_test_shared',
  boost_played: 'speed_test_boost_played',
  whatsapp_submitted: 'speed_test_whatsapp_submitted',
  offer_used: 'speed_test_offer_used',
}

export function trackSpeedTest(event: SpeedTestEvent): void {
  const { name, ...rest } = event
  const params: Record<string, string> = { ...readUtmParams() }
  for (const [key, value] of Object.entries(rest)) if (value !== null && value !== undefined) params[key] = String(value)
  if (name === 'completed') params.valid = event.name === 'completed' && event.status === 'valid' ? 'yes' : 'no'
  trackGaEvent(GA_NAME[name], params)
  // Existing Meta/GA lead events, as before: a test started, a number left.
  if (name === 'started') trackLead('Free Reading Speed Test', 'free_test_started')
  if (name === 'whatsapp_submitted') trackLead('Free Reading Speed Test', 'speed_test_whatsapp')
}
