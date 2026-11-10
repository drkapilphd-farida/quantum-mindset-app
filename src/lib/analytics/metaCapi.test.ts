import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { buildCapiPayload } from './metaCapi'
import { utmToLine } from './utmLine'

describe('Meta Conversions API payload', () => {
  it('sends the event with its event_id, and the phone only as a SHA-256 hash', () => {
    const payload = buildCapiPayload(
      { eventName: 'Purchase', eventId: 'pay_123', eventSourceUrl: 'https://mindurmind.org.in/clarity-session/booked', customData: { value: 1100, currency: 'INR' }, phone: '+91 95401 23161', clientIp: '1.2.3.4' },
      1_700_000_000_000,
    ) as { data: Record<string, unknown>[] }
    const event = payload.data[0] ?? {}
    expect(event).toMatchObject({ event_name: 'Purchase', event_id: 'pay_123', event_time: 1_700_000_000, action_source: 'website', custom_data: { value: 1100, currency: 'INR' } })
    expect(event.user_data).toEqual({ client_ip_address: '1.2.3.4', ph: [createHash('sha256').update('919540123161').digest('hex')] })
    expect(JSON.stringify(payload)).not.toContain('9540123161"')
  })
})

describe('UTM line saved with each lead', () => {
  it('keeps only the utm_* params', () => {
    expect(utmToLine({ utm_source: 'meta', utm_campaign: 'stress', other: 'x' })).toBe('utm_source=meta, utm_campaign=stress')
    expect(utmToLine({})).toBeNull()
    expect(utmToLine(undefined)).toBeNull()
  })
})

describe('Meta Pixel + Conversions API switches', () => {
  it('uses the owner’s Pixel ID, set in site.config.ts only', async () => {
    const { analytics } = await import('@/config/site.config')
    expect(analytics.metaPixelId).toBe('2813779008994609')
  })

  it('sends nothing to Meta’s server until META_CAPI_TOKEN is set, then sends with the event_id', async () => {
    const { sendMetaCapiEvent, hasMetaCapi } = await import('./metaCapi')
    const calls: string[] = []
    const realFetch = globalThis.fetch
    globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
      calls.push(`${String(url)} ${String(init?.body)}`)
      return new Response('{}', { status: 200 })
    }) as typeof fetch
    const saved = process.env.META_CAPI_TOKEN
    try {
      delete process.env.META_CAPI_TOKEN
      expect(hasMetaCapi()).toBe(false)
      await sendMetaCapiEvent({ eventName: 'Lead', eventId: 'evt-12345678', eventSourceUrl: 'https://mindurmind.org.in/personal-sessions' })
      expect(calls).toHaveLength(0)
      process.env.META_CAPI_TOKEN = 'test-token'
      await sendMetaCapiEvent({ eventName: 'Lead', eventId: 'evt-12345678', eventSourceUrl: 'https://mindurmind.org.in/personal-sessions' })
      expect(calls).toHaveLength(1)
      expect(calls[0]).toContain('graph.facebook.com/')
      expect(calls[0]).toContain('/2813779008994609/events')
      expect(calls[0]).toContain('"event_id":"evt-12345678"')
    } finally {
      globalThis.fetch = realFetch
      if (saved === undefined) delete process.env.META_CAPI_TOKEN
      else process.env.META_CAPI_TOKEN = saved
    }
  })
})
