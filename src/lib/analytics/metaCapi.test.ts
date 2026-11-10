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
