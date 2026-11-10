// Server only (reads META_CAPI_TOKEN); imported only by server actions.
import { createHash } from 'node:crypto'
import { analytics } from '@/config/site.config'
import { logger } from '@/lib/logger'

// Meta Conversions API (owner's conversion brief, Nov 2026): the same events
// as the browser Pixel, sent from the server so ad blockers and iOS don't
// lose them. Off until META_CAPI_TOKEN is set (and the Pixel ID exists).
// Each event carries the same event_id as its browser twin, so Meta counts
// it once. Never throws: tracking must never break a real visit or payment.

const GRAPH_VERSION = 'v23.0'

export type CapiEventName = 'ViewContent' | 'Lead' | 'Contact' | 'InitiateCheckout' | 'Purchase'

export type CapiEvent = {
  eventName: CapiEventName
  eventId: string
  eventSourceUrl: string
  customData?: Record<string, string | number>
  /** Request details for Meta's matching — never logged. */
  clientIp?: string
  userAgent?: string
  fbp?: string
  fbc?: string
  /** Indian mobile in E.164 ("+91…"); sent only as a SHA-256 hash. */
  phone?: string
}

export function hasMetaCapi(): boolean {
  return (process.env.META_CAPI_TOKEN ?? '') !== '' && analytics.metaPixelId !== ''
}

const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex')

export function buildCapiPayload(event: CapiEvent, nowMs: number): Record<string, unknown> {
  const userData: Record<string, unknown> = {}
  if (event.clientIp !== undefined) userData.client_ip_address = event.clientIp
  if (event.userAgent !== undefined) userData.client_user_agent = event.userAgent
  if (event.fbp !== undefined) userData.fbp = event.fbp
  if (event.fbc !== undefined) userData.fbc = event.fbc
  if (event.phone !== undefined) userData.ph = [sha256(event.phone.replace(/\D/g, ''))]
  return {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(nowMs / 1000),
        event_id: event.eventId,
        action_source: 'website',
        event_source_url: event.eventSourceUrl,
        user_data: userData,
        ...(event.customData !== undefined ? { custom_data: event.customData } : {}),
      },
    ],
  }
}

export async function sendMetaCapiEvent(event: CapiEvent): Promise<void> {
  if (!hasMetaCapi()) return
  const token = process.env.META_CAPI_TOKEN ?? ''
  try {
    const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${analytics.metaPixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildCapiPayload(event, Date.now())),
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    })
    if (!response.ok) logger.warn('[meta-capi] event rejected', { event: event.eventName, status: response.status })
  } catch {
    logger.warn('[meta-capi] event not sent', { event: event.eventName })
  }
}
