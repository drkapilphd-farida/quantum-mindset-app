'use server'

import { cookies, headers } from 'next/headers'
import { z } from 'zod'
import { sendMetaCapiEvent } from '@/lib/analytics/metaCapi'

// The browser Pixel's server-side twin (Meta Conversions API). Called
// fire-and-forget by lib/analytics/metaPixel.ts with the same event_id.
// Owner (Nov 2026): server events are Lead, Contact, InitiateCheckout and
// Purchase only; ViewContent stays browser-only.
// Purchase is NOT accepted here: it is sent only by the server after a
// verified payment, or by the thank-you page's own action.
const InputSchema = z.object({
  eventName: z.enum(['Lead', 'Contact', 'InitiateCheckout']),
  eventId: z.string().min(8).max(64),
  url: z.string().url().max(2000),
  customData: z.record(z.string().max(40), z.union([z.string().max(200), z.number()])).optional(),
})

export async function trackServerEvent(input: unknown): Promise<void> {
  const parsed = InputSchema.safeParse(input)
  if (!parsed.success) return
  const { eventName, eventId, url, customData } = parsed.data
  const requestHeaders = await headers()
  const jar = await cookies()
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  const userAgent = requestHeaders.get('user-agent') ?? undefined
  const fbp = jar.get('_fbp')?.value
  const fbc = jar.get('_fbc')?.value
  await sendMetaCapiEvent({
    eventName,
    eventId,
    eventSourceUrl: url,
    ...(customData !== undefined ? { customData } : {}),
    ...(ip !== undefined && ip !== '' ? { clientIp: ip } : {}),
    ...(userAgent !== undefined ? { userAgent } : {}),
    ...(fbp !== undefined ? { fbp } : {}),
    ...(fbc !== undefined ? { fbc } : {}),
  })
}
