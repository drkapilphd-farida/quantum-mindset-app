import { normaliseShortUrl, parsePaymentLinkPaid, type LinkPayment } from '@/lib/razorpay/paymentLinkEvent'
import type { OfferKind } from './batches'
import { planForPayment, type PlanType } from '@/features/sharp-brain-plans/rules'

// Which payment_link.paid events are Sharp Brain 30-Day Program payments.
// Razorpay webhooks are account-wide, so everything else is ignored:
// - links our server created: notes.program === "sharp_brain_30" (regular,
//   early-bird or test offer), with the batch and offer in the notes;
// - the fixed links in site.config (the ₹8,999 live batch link and the
//   ₹2,999 self-paced link), which carry no batch;
// - optional extra link ids from RAZORPAY_MASTERCLASS_EXTRA_LINK_IDS.

/** notes.program on every payment link our server creates for the 30-Day Program. */
export const SHARP_BRAIN_PROGRAM_NOTE = 'sharp_brain_30'

export type FixedProgramLink = { url: string; offer: OfferKind | null; plan: PlanType }

/** plan: live (₹8,999 batch) or self_paced (₹2,999) — notes.plan from our server, else the link, else the amount. */
export type ProgramPayment = LinkPayment & { offer: OfferKind | null; batchStart: string | null; offerId: string | null; plan: PlanType }

export type ProgramPaymentResult = { ok: true; payment: ProgramPayment } | { ok: false; reason: 'not_payment_link_paid' | 'invalid_payload' | 'other_link' }

const OFFERS: readonly OfferKind[] = ['earlybird', 'regular', 'test1000']
const DATE = /^\d{4}-\d{2}-\d{2}$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function noteString(notes: Record<string, unknown>, key: string): string | null {
  const value = notes[key]
  return typeof value === 'string' && value !== '' ? value : null
}

export function programPaymentFromEvent(
  json: unknown,
  options: { programNote: string; fixedLinks: readonly FixedProgramLink[]; extraLinkIds?: readonly string[] },
): ProgramPaymentResult {
  const parsed = parsePaymentLinkPaid(json)
  if (!parsed.ok) return parsed
  const { payment, shortUrl } = parsed

  if (noteString(payment.notes, 'program') === options.programNote) {
    const offer = noteString(payment.notes, 'offer')
    const batch = noteString(payment.notes, 'batch')
    const offerId = noteString(payment.notes, 'offer_id')
    const plan = planForPayment(payment.amount, payment.notes['plan'])
    return {
      ok: true,
      payment: {
        ...payment,
        offer: plan === 'live' && offer !== null && (OFFERS as readonly string[]).includes(offer) ? (offer as OfferKind) : null,
        batchStart: plan === 'live' && batch !== null && DATE.test(batch) ? batch : null,
        offerId: plan === 'live' && offerId !== null && UUID.test(offerId) ? offerId : null,
        plan,
      },
    }
  }

  const fixed = shortUrl === null ? undefined : options.fixedLinks.find((link) => normaliseShortUrl(link.url) === normaliseShortUrl(shortUrl))
  if (fixed !== undefined) return { ok: true, payment: { ...payment, offer: fixed.offer, batchStart: null, offerId: null, plan: fixed.plan } }

  if ((options.extraLinkIds ?? []).includes(payment.paymentLinkId)) {
    return { ok: true, payment: { ...payment, offer: null, batchStart: null, offerId: null, plan: planForPayment(payment.amount, undefined) } }
  }
  return { ok: false, reason: 'other_link' }
}
