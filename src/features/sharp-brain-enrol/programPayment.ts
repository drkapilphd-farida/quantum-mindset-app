import { normaliseShortUrl, parsePaymentLinkPaid, type LinkPayment } from '@/lib/razorpay/paymentLinkEvent'
import type { OfferKind } from './batches'

// Which payment_link.paid events are Sharp Brain 30-Day Program payments.
// Razorpay webhooks are account-wide, so everything else is ignored:
// - links our server created: notes.program === "sharp_brain_30" (regular,
//   early-bird or test offer), with the batch and offer in the notes;
// - the fixed links in site.config (regular ₹9,999 and the ₹8,999 one),
//   which carry no batch;
// - optional extra link ids from RAZORPAY_MASTERCLASS_EXTRA_LINK_IDS.

/** notes.program on every payment link our server creates for the 30-Day Program. */
export const SHARP_BRAIN_PROGRAM_NOTE = 'sharp_brain_30'

export type FixedProgramLink = { url: string; offer: OfferKind }

export type ProgramPayment = LinkPayment & { offer: OfferKind | null; batchStart: string | null; offerId: string | null }

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
    return {
      ok: true,
      payment: {
        ...payment,
        offer: offer !== null && (OFFERS as readonly string[]).includes(offer) ? (offer as OfferKind) : null,
        batchStart: batch !== null && DATE.test(batch) ? batch : null,
        offerId: offerId !== null && UUID.test(offerId) ? offerId : null,
      },
    }
  }

  const fixed = shortUrl === null ? undefined : options.fixedLinks.find((link) => normaliseShortUrl(link.url) === normaliseShortUrl(shortUrl))
  if (fixed !== undefined) return { ok: true, payment: { ...payment, offer: fixed.offer, batchStart: null, offerId: null } }

  if ((options.extraLinkIds ?? []).includes(payment.paymentLinkId)) {
    return { ok: true, payment: { ...payment, offer: null, batchStart: null, offerId: null } }
  }
  return { ok: false, reason: 'other_link' }
}
