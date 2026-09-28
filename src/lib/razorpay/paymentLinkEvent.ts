import { z } from 'zod'

// Razorpay webhooks are account-wide: every endpoint receives every payment
// on the account (the program, the ₹99 Starter, retreats, workshops via
// razorpay.me …). Each access-granting webhook must therefore act only on
// its OWN payment link. Razorpay's `payment_link.paid` event carries the
// link (id + short_url) alongside the payment; `payment.captured` does not,
// so it is never used to grant access.

const PaymentLinkPaidSchema = z.object({
  event: z.literal('payment_link.paid'),
  payload: z.object({
    payment_link: z.object({
      entity: z.object({
        id: z.string(),
        short_url: z.string().nullable().optional(),
      }),
    }),
    payment: z.object({
      entity: z.object({
        id: z.string(),
        amount: z.number(),
        currency: z.string(),
        email: z.string().nullable().optional(),
        contact: z.string().nullable().optional(),
      }),
    }),
  }),
})

export type LinkPayment = { id: string; amount: number; currency: string; email: string | null; contact: string | null; paymentLinkId: string }

export type LinkPaymentResult = { ok: true; payment: LinkPayment } | { ok: false; reason: 'not_payment_link_paid' | 'invalid_payload' | 'other_link' }

/** "https://rzp.io/rzp/ydVYaANF/" and "rzp.io/rzp/ydVYaANF" compare equal; the code part stays case-sensitive. */
export function normaliseShortUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, '')
  const withoutScheme = trimmed.replace(/^https?:\/\//i, '')
  const slash = withoutScheme.indexOf('/')
  if (slash === -1) return withoutScheme.toLowerCase()
  return withoutScheme.slice(0, slash).toLowerCase() + withoutScheme.slice(slash)
}

/**
 * The payment in a `payment_link.paid` event — only if it was made through
 * `expectedShortUrl` (or a link whose id is in `extraLinkIds`).
 */
export function paymentForLink(json: unknown, expectedShortUrl: string, extraLinkIds: readonly string[] = []): LinkPaymentResult {
  const envelope = z.object({ event: z.string() }).safeParse(json)
  if (!envelope.success) return { ok: false, reason: 'invalid_payload' }
  if (envelope.data.event !== 'payment_link.paid') return { ok: false, reason: 'not_payment_link_paid' }

  const parsed = PaymentLinkPaidSchema.safeParse(json)
  if (!parsed.success) return { ok: false, reason: 'invalid_payload' }

  const link = parsed.data.payload.payment_link.entity
  const matchesUrl = typeof link.short_url === 'string' && normaliseShortUrl(link.short_url) === normaliseShortUrl(expectedShortUrl)
  if (!matchesUrl && !extraLinkIds.includes(link.id)) return { ok: false, reason: 'other_link' }

  const p = parsed.data.payload.payment.entity
  return { ok: true, payment: { id: p.id, amount: p.amount, currency: p.currency, email: p.email ?? null, contact: p.contact ?? null, paymentLinkId: link.id } }
}

/** Optional comma-separated extra link ids from an env var (e.g. a test-mode link). */
export function linkIdsFromEnv(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part !== '')
}
