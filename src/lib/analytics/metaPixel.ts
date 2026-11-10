// Meta Pixel events for the site's conversion helpers (conversions.ts).
// The pixel itself is loaded by components/analytics/MetaPixel.tsx; the
// safe call lives in lib/fbq.ts. Each event also goes to the Conversions
// API (server action, no-op until META_CAPI_TOKEN is set) with the same
// event_id, so Meta counts it once.
import { track, type FbqParams } from '@/lib/fbq'
import { trackServerEvent } from '@/app/actions/trackServerEvent'

export type MetaPixelStandardEvent = 'ViewContent' | 'InitiateCheckout' | 'Lead' | 'Contact'

export function newEventId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
  }
}

export function trackMetaPixelEvent(event: MetaPixelStandardEvent, params?: FbqParams): void {
  if (typeof window === 'undefined') return
  const eventId = newEventId()
  track(event, params, eventId)
  // Fire and forget: a tracking call must never block or break a click.
  trackServerEvent({ eventName: event, eventId, url: window.location.href, ...(params !== undefined ? { customData: params } : {}) }).catch(() => undefined)
}
