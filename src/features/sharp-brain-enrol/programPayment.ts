import { normaliseShortUrl, parsePaymentLinkPaid, type LinkPayment } from '@/lib/razorpay/paymentLinkEvent'
import { isOfferKind, type OfferKind } from './offer'

// Which payment_link.paid events are Sharp Brain 30-Day Program payments.
// Razorpay webhooks are account-wide, so everything else is ignored:
// - links our server created: notes.program === "sharp_brain_30", with the
//   offer in the notes (parent_2999 / parent_3999 since 4 Nov 2026; older
//   links also carry a batch and earlybird / regular / test1000);
// - the old fixed ₹9,999 link (RAZORPAY_MASTERCLASS_PAYMENT_LINK), no batch;
// - optional extra link ids from RAZORPAY_MASTERCLASS_EXTRA_LINK_IDS.

/** notes.program on every payment link our server creates for the 30-Day Program. */
export const SHARP_BRAIN_PROGRAM_NOTE = 'sharp_brain_30'

export type FixedProgramLink = { url: string; offer: OfferKind }

export type ProgramPayment = LinkPayment & { offer: OfferKind | null; batchStart: string | null; offerId: string | null }

export type ProgramPaymentResult = { ok: true; payment: ProgramPayment } | { ok: false; reason: 'not_payment_link_paid' | 'invalid_payload' | 'other_link' }

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
        offer: offer !== null && isOfferKind(offer) ? offer : null,
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
