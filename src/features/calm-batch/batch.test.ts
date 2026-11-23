import { describe, expect, it } from 'vitest'
import { batchState, buildBatchIcs, classStartMs, formatBatchDate, istToday } from './batch'
import { calmBatchPriceInr, calmMindBatch } from '@/config/site.config'

describe('21-Day Online Retreat batch', () => {
  it('uses the owner’s config', () => {
    expect(calmMindBatch.earlyBirdPrice).toBe(3999)
    expect(calmMindBatch.regularPrice).toBe(4999)
    expect(calmMindBatch.seatsTotal).toBe(50)
    expect(calmMindBatch.nextBatch.classDates).toEqual(['2027-01-01', '2027-01-03', '2027-01-06', '2027-01-10', '2027-01-13', '2027-01-17', '2027-01-21'])
  })

  it('charges the early-bird price until 23:59 IST on 20 December, then the regular price', () => {
    expect(calmBatchPriceInr(Date.parse('2026-12-20T23:59:00+05:30'))).toBe(3999)
    expect(calmBatchPriceInr(Date.parse('2026-12-21T00:00:30+05:30'))).toBe(4999)
  })

  it('formats dates in both languages', () => {
    expect(formatBatchDate('2026-12-01', 'en')).toBe('1 December 2026')
    expect(formatBatchDate('2026-12-01', 'hi')).toContain('दिसंबर')
  })

  it('counts real seats, shows them only at 10 or fewer, and closes when full', () => {
    const before = Date.parse('2026-11-20T10:00:00+05:30')
    expect(batchState(before, 3)).toEqual({ status: 'open', seatsLeft: 47, showSeats: false })
    expect(batchState(before, 40)).toEqual({ status: 'open', seatsLeft: 10, showSeats: true })
    expect(batchState(before, 50)).toEqual({ status: 'full', seatsLeft: 0, showSeats: false })
    expect(batchState(before, 60)).toEqual({ status: 'full', seatsLeft: 0, showSeats: false })
    expect(batchState(before, null)).toEqual({ status: 'open', seatsLeft: null, showSeats: false })
  })

  it('switches to the waitlist once the start date has passed (IST)', () => {
    expect(batchState(Date.parse('2027-01-01T23:30:00+05:30'), 3).status).toBe('open')
    expect(batchState(Date.parse('2027-01-02T00:10:00+05:30'), 3).status).toBe('ended')
    expect(istToday(Date.parse('2026-12-01T19:00:00Z'))).toBe('2026-12-02')
  })

  it('builds a calendar with the 7 classes at 8:00–9:15 PM IST', () => {
    const ics = buildBatchIcs({ nowMs: 0 })
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(7)
    expect(ics).toContain('DTSTART:20270101T143000Z')
    expect(ics).toContain('DTEND:20270101T154500Z')
    expect(ics).not.toContain('zoom.us')
    expect(buildBatchIcs({ zoomLink: 'https://zoom.us/j/1', nowMs: 0 })).toContain('LOCATION:https://zoom.us/j/1')
    expect(classStartMs('2027-01-21')).toBe(Date.parse('2027-01-21T14:30:00Z'))
  })
})

describe('calm batch registrations (saved in franchise_leads)', () => {
  it('writes and reads back a registration', async () => {
    const { registrationBackground, parseRegistration } = await import('./registrations')
    const background = registrationBackground({ email: 'a@b.in', paymentId: 'pay_1', orderId: 'order_1', batch: '2026-12-01', utm: 'utm_source=meta' })
    expect(background.split('\n')[0]).toBe('[calm-batch] 2026-12-01')
    expect(parseRegistration({ name: 'Asha', phone: '+919999999999', background, submitted_at: '2026-11-20T10:00:00Z' })).toEqual({
      name: 'Asha', phone: '+919999999999', email: 'a@b.in', paymentId: 'pay_1', orderId: 'order_1', batch: '2026-12-01', paidAt: '2026-11-20T10:00:00Z', utm: 'utm_source=meta',
    })
    expect(parseRegistration({ name: 'X', phone: '1', background: '[1-on-1] Clarity Session request', submitted_at: '' })).toBeNull()
  })
})

describe('calm batch reminder windows', () => {
  it('opens the day-before window at 8 PM the evening before and the class window 60–30 minutes before', async () => {
    const { dueReminders } = await import('./batch')
    expect(dueReminders(Date.parse('2026-12-31T20:05:00+05:30'))).toEqual([{ kind: 'day-before', classNumber: 1 }])
    expect(dueReminders(Date.parse('2027-01-01T07:59:00+05:30'))).toEqual([{ kind: 'day-before', classNumber: 1 }])
    expect(dueReminders(Date.parse('2027-01-01T08:00:00+05:30'))).toEqual([])
    expect(dueReminders(Date.parse('2027-01-01T19:00:00+05:30'))).toEqual([{ kind: 'hour-before', classNumber: 1 }])
    expect(dueReminders(Date.parse('2027-01-21T19:29:00+05:30'))).toEqual([{ kind: 'hour-before', classNumber: 7 }])
    expect(dueReminders(Date.parse('2027-01-21T19:30:00+05:30'))).toEqual([])
    expect(dueReminders(Date.parse('2027-01-02T19:00:00+05:30'))).toEqual([])
  })
})

describe('calm batch reminder sent-log', () => {
  it('never sends the same reminder twice to the same registration, and retries a failed email', async () => {
    const { sendCalmBatchReminders } = await import('./sendCalmBatchReminders')
    const log = new Set<string>()
    const sent: string[] = []
    let failNext = true
    const reg = (paymentId: string): { name: string; phone: string; email: string; paymentId: string; orderId: string; batch: string; paidAt: string; utm: null } => ({ name: 'A', phone: '1', email: `${paymentId}@x.in`, paymentId, orderId: 'o', batch: '2026-12-01', paidAt: '', utm: null })
    const deps = {
      list: async () => [reg('pay_1'), reg('pay_2')],
      claim: async (pid: string, type: string) => (log.has(`${pid}:${type}`) ? ('already-sent' as const) : (log.add(`${pid}:${type}`), 'claimed' as const)),
      release: async (pid: string, type: string) => {
        log.delete(`${pid}:${type}`)
      },
      send: async (_r: unknown, r: { paymentId: string }) => {
        if (r.paymentId === 'pay_2' && failNext) {
          failNext = false
          return false
        }
        sent.push(r.paymentId)
        return true
      },
    }
    const t1 = Date.parse('2027-01-01T19:00:00+05:30')
    expect(await sendCalmBatchReminders(t1, deps)).toEqual({ due: 1, sent: 1, skipped: 0, failed: 1 })
    // Next cron run inside the same window: pay_1 is skipped (already sent), pay_2 is retried.
    expect(await sendCalmBatchReminders(t1 + 15 * 60_000, deps)).toEqual({ due: 1, sent: 1, skipped: 1, failed: 0 })
    expect(await sendCalmBatchReminders(t1 + 20 * 60_000, deps)).toEqual({ due: 1, sent: 0, skipped: 2, failed: 0 })
    expect(sent).toEqual(['pay_1', 'pay_2'])
  })
})

describe('calm batch admin CSV and joined link', () => {
  it('exports quoted CSV cells and defuses spreadsheet formulas', async () => {
    const { calmRegistrationsCsv } = await import('./csv')
    const csv = calmRegistrationsCsv([{ name: '=HACK()', phone: '+919999999999', email: 'a@b.in', paymentId: 'pay_1', orderId: 'order_1', batch: '2026-12-01', paidAt: '2026-11-20T10:00:00Z', utm: null }])
    expect(csv.split('\n')[0]).toBe('"Name","Phone","Email","Payment ID","Date (IST)","Batch","UTM"')
    expect(csv).toContain(`"'=HACK()"`)
    expect(csv).toContain('"pay_1"')
  })

  it('shows the joining links only with a valid signed link', async () => {
    process.env.RAZORPAY_KEY_SECRET = 'test-secret'
    const { joinedToken, isValidJoinedToken } = await import('./joinedToken')
    expect(isValidJoinedToken('pay_1', joinedToken('pay_1'))).toBe(true)
    expect(isValidJoinedToken('pay_2', joinedToken('pay_1'))).toBe(false)
    expect(isValidJoinedToken('pay_1', '')).toBe(false)
    delete process.env.RAZORPAY_KEY_SECRET
    expect(isValidJoinedToken('pay_1', joinedToken('pay_1'))).toBe(false)
  })
})
