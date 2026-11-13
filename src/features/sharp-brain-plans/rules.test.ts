import { describe, expect, it } from 'vitest'
import { planForPayment, recordingEmbedUrl, recordingStates, resolveLearnerPlan, upgradeOfferEndsAt, upgradeOfferOpen, youtubeIdFromUrl, type ClassRecording } from './rules'
import { unmatchedRowFromEvent } from './unmatched'

const DAY = 86_400_000

describe('planForPayment', () => {
  it('₹2,999 is self-paced, ₹8,999 (and every other amount) is live', () => {
    expect(planForPayment(299900, undefined)).toBe('self_paced')
    expect(planForPayment(899900, undefined)).toBe('live')
    expect(planForPayment(999900, undefined)).toBe('live')
    expect(planForPayment(0, undefined)).toBe('live')
  })
  it('the plan our server wrote in the notes wins', () => {
    expect(planForPayment(899900, 'self_paced')).toBe('self_paced')
    expect(planForPayment(299900, 'live')).toBe('live')
    expect(planForPayment(299900, 'premium')).toBe('self_paced')
  })
})

describe('resolveLearnerPlan — existing ₹8,999 buyers unchanged', () => {
  const row = (plan: string | null, extra: Partial<{ created_at: string; paid_on: string | null; refunded_at: string | null }> = {}): { plan_type: string | null; created_at: string; paid_on: string | null; refunded_at: string | null } => ({
    plan_type: plan,
    created_at: '2026-11-10T10:00:00Z',
    paid_on: null,
    refunded_at: null,
    ...extra,
  })

  it('existing payments (plan_type live, the migration default) stay live', () => {
    expect(resolveLearnerPlan([row('live')])).toEqual({ plan: 'live' })
  })
  it('no payment row (access granted another way) stays live — what they saw before', () => {
    expect(resolveLearnerPlan([])).toEqual({ plan: 'live' })
  })
  it('only self-paced payments → self-paced, joined at the first payment', () => {
    expect(resolveLearnerPlan([row('self_paced')])).toEqual({ plan: 'self_paced', joinedAtMs: Date.parse('2026-11-10T10:00:00Z') })
  })
  it('a manual self-paced payment joins on its payment date (IST)', () => {
    expect(resolveLearnerPlan([row('self_paced', { paid_on: '2026-11-08' })])).toEqual({ plan: 'self_paced', joinedAtMs: Date.parse('2026-11-08T00:00:00+05:30') })
  })
  it('an upgrade (any live payment next to self-paced) makes them live', () => {
    expect(resolveLearnerPlan([row('self_paced'), row('live')])).toEqual({ plan: 'live' })
  })
  it('refunded payments do not count', () => {
    expect(resolveLearnerPlan([row('self_paced'), row('live', { refunded_at: '2026-11-11T00:00:00Z' })]).plan).toBe('self_paced')
  })
})

describe('upgrade card — 7 days for ₹6,000, then hidden', () => {
  const joined = Date.parse('2026-11-10T10:00:00Z')
  const self = { plan: 'self_paced' as const, joinedAtMs: joined }
  it('shows for 7 days after joining, then hides', () => {
    expect(upgradeOfferOpen(self, joined + 1)).toBe(true)
    expect(upgradeOfferOpen(self, joined + 7 * DAY - 1)).toBe(true)
    expect(upgradeOfferOpen(self, joined + 7 * DAY)).toBe(false)
    expect(upgradeOfferEndsAt(self)).toBe(joined + 7 * DAY)
  })
  it('never for live learners', () => {
    expect(upgradeOfferOpen({ plan: 'live' }, joined)).toBe(false)
    expect(upgradeOfferEndsAt({ plan: 'live' })).toBeNull()
  })
})

describe('youtubeIdFromUrl — only YouTube links', () => {
  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ?si=abc', 'dQw4w9WgXcQ'],
    ['youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=30s', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/live/dQw4w9WgXcQ?feature=share', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ])('%s → %s', (url, id) => {
    expect(youtubeIdFromUrl(url)).toBe(id)
  })
  it.each(['https://vimeo.com/123456', 'https://evil.com/watch?v=dQw4w9WgXcQ', 'https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=short', 'javascript:alert(1)', 'not a link', ''])('rejects %s', (url) => {
    expect(youtubeIdFromUrl(url)).toBeNull()
  })
})

describe('recordingEmbedUrl', () => {
  it('uses youtube-nocookie.com with rel=0 and modestbranding=1', () => {
    expect(recordingEmbedUrl('dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1')
  })
  it('refuses anything that is not a video id', () => {
    expect(() => recordingEmbedUrl('../../x')).toThrow()
  })
})

describe('recordingStates', () => {
  const now = Date.parse('2026-11-13T12:00:00Z')
  const rec = (classNumber: number, extra: Partial<ClassRecording> = {}): ClassRecording => ({ id: `r${classNumber}`, classNumber, title: `Class ${classNumber}`, classDate: '2026-11-09', youtubeId: 'dQw4w9WgXcQ', sortOrder: classNumber * 10, hidden: false, ...extra })

  it('available when a recording exists; "coming soon" after the live class ended without one; else "after the class"', () => {
    const states = recordingStates([rec(1)], [{ classNumber: 1, endsAt: '2026-11-09T15:30:00Z' }, { classNumber: 2, endsAt: '2026-11-12T15:30:00Z' }, { classNumber: 3, endsAt: '2026-11-16T15:30:00Z' }], now)
    expect(states.map((s) => s.state)).toEqual(['available', 'coming_soon', 'after_class', 'after_class', 'after_class', 'after_class', 'after_class'])
  })
  it('hidden recordings are never shown', () => {
    const states = recordingStates([rec(1, { hidden: true })], [], now)
    expect(states[0]).toMatchObject({ state: 'after_class', recordings: [] })
  })
  it('several recordings of one class follow the admin order', () => {
    const states = recordingStates([rec(4, { id: 'b', sortOrder: 20 }), rec(4, { id: 'a', sortOrder: 10 })], [], now)
    expect(states[3]?.recordings.map((r) => r.id)).toEqual(['a', 'b'])
  })
})

describe('unmatchedRowFromEvent — unknown payments are saved, never dropped', () => {
  it('keeps the buyer, amount, link and notes', () => {
    const row = unmatchedRowFromEvent(
      {
        event: 'payment_link.paid',
        payload: {
          payment_link: { entity: { id: 'plink_9', short_url: 'https://rzp.io/rzp/zzz', notes: { program: 'retreat' }, customer: { name: 'A B', email: 'X@Y.com' } } },
          payment: { entity: { id: 'pay_9', amount: 500000, currency: 'INR', email: 'void@razorpay.com', contact: '+919999999999' } },
        },
      },
      'other_link',
      'fallback',
    )
    expect(row).toEqual({
      razorpay_payment_id: 'pay_9',
      event: 'payment_link.paid',
      reason: 'other_link',
      payment_link_id: 'plink_9',
      short_url: 'https://rzp.io/rzp/zzz',
      amount_cents: 500000,
      currency: 'INR',
      email: 'x@y.com',
      phone: '+919999999999',
      customer_name: 'A B',
      notes: { program: 'retreat' },
    })
  })
  it('an unreadable payload still gets a row', () => {
    expect(unmatchedRowFromEvent('garbage', 'invalid_payload', 'unknown-1')).toMatchObject({ razorpay_payment_id: 'unknown-1', event: 'unknown', reason: 'invalid_payload', notes: {} })
  })
})
