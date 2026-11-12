// Server only. Razorpay webhook "payment.captured" (owner, Nov 2026): closes
// the gap when a buyer pays but never returns to the website. For our own
// Checkout products — the 21-Day Calm Mind batch and the Clarity Session —
// the payment is saved exactly once (unique on the payment ID) and the same
// emails go out as after a normal checkout. Everything else is ignored.
import { z } from 'zod'
import { calmMindBatch, CLARITY_SESSION } from '@/config/site.config'
import { logger } from '@/lib/logger'
import { fetchOrderNotes } from '@/lib/razorpay/ordersApi'
import { normalizeIndianMobile } from '@/lib/phone/indianMobile'
import { utmToLine } from '@/lib/analytics/utmLine'
import { finalizeCalmRegistration } from '@/features/calm-batch/finalize'
import { finalizeClarityPayment } from '@/features/clarity-session/paidRecords'

export const CALM_PRODUCT = 'calm-mind-batch'
/** Clarity Session orders carry product "Clarity Session (60 min)" (order notes) or "clarity-session" (Checkout notes). */
export const CLARITY_PRODUCTS = ['Clarity Session (60 min)', 'clarity-session']

const Notes = z.union([z.record(z.string(), z.union([z.string(), z.number()]).transform(String)), z.array(z.unknown()).transform(() => ({}))]).catch({})
const Payload = z.object({
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string(),
        order_id: z.string().nullable().optional(),
        amount: z.number(),
        currency: z.string(),
        email: z.string().nullable().optional(),
        contact: z.string().nullable().optional(),
        notes: Notes.optional(),
      }),
    }),
  }),
})

export type CapturedOutcome = 'calm' | 'clarity' | 'ignored' | 'amount-mismatch'

const utmFrom = (notes: Record<string, string>): string | null => utmToLine(Object.fromEntries(Object.entries(notes).filter(([key]) => key.startsWith('utm_'))))

export async function handlePaymentCaptured(json: unknown, getOrderNotes: (orderId: string) => Promise<Record<string, string>> = fetchOrderNotes): Promise<CapturedOutcome> {
  const parsed = Payload.safeParse(json)
  if (!parsed.success) return 'ignored'
  const p = parsed.data.payload.payment.entity
  const orderId = p.order_id ?? ''
  // Payment notes first; our server-side order notes as the fallback (they always carry the product).
  let notes: Record<string, string> = (p.notes as Record<string, string> | undefined) ?? {}
  if (notes.product === undefined && orderId !== '') notes = { ...(await getOrderNotes(orderId)), ...notes }
  const product = notes.product ?? ''
  const email = notes.email ?? p.email ?? ''
  const phone = normalizeIndianMobile(notes.phone ?? p.contact ?? '') ?? (notes.phone ?? p.contact ?? '')

  if (product === CALM_PRODUCT) {
    if (p.amount !== calmMindBatch.price * 100 || p.currency !== 'INR') {
      logger.warn('[payment-captured] Calm Mind amount mismatch', { amount: p.amount })
      return 'amount-mismatch'
    }
    await finalizeCalmRegistration({ name: notes.name ?? (email || 'Calm Mind participant'), phone, email, paymentId: p.id, orderId, batch: notes.batch ?? calmMindBatch.nextBatch.startDate, utm: utmFrom(notes) }, 'webhook')
    return 'calm'
  }
  if (CLARITY_PRODUCTS.includes(product)) {
    if (p.amount !== CLARITY_SESSION.priceInr * 100 || p.currency !== 'INR') {
      logger.warn('[payment-captured] Clarity Session amount mismatch', { amount: p.amount })
      return 'amount-mismatch'
    }
    await finalizeClarityPayment({ paymentId: p.id, orderId, email, phone, program: notes.program ?? null, utm: utmFrom(notes) }, 'webhook')
    return 'clarity'
  }
  return 'ignored'
}
