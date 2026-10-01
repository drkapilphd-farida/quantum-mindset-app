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
        // Razorpay sends an empty array, not an object, when there are no notes.
        notes: z
          .union([z.record(z.string(), z.unknown()), z.array(z.unknown())])
          .nullable()
          .optional()
          .transform((v): Record<string, unknown> => (v !== null && v !== undefined && !Array.isArray(v) ? v : {})),
        customer: z.object({ name: z.string().nullable().optional(), email: z.string().nullable().optional() }).nullable().optional(),
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

/** Razorpay's stand-in when no email was collected — never a real buyer. */
const PLACEHOLDER_EMAILS = new Set(['void@razorpay.com'])

function realEmail(value: string | null | undefined): string | null {
  const email = value?.trim().toLowerCase() ?? ''
  return email === '' || PLACEHOLDER_EMAILS.has(email) ? null : email
}

export type LinkPayment = {
  id: string
  amount: number
  currency: string
  email: string | null
  contact: string | null
  paymentLinkId: string
  /** The payment link's notes (set by our server when it created the link). */
  notes: Record<string, unknown>
  customerName: string | null
}

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
  const parsed = parsePaymentLinkPaid(json)
  if (!parsed.ok) return parsed
  const { payment, shortUrl } = parsed
  const matchesUrl = shortUrl !== null && normaliseShortUrl(shortUrl) === normaliseShortUrl(expectedShortUrl)
  if (!matchesUrl && !extraLinkIds.includes(payment.paymentLinkId)) return { ok: false, reason: 'other_link' }
  return { ok: true, payment }
}

/** Any `payment_link.paid` event, whichever link it came from. */
export function parsePaymentLinkPaid(
  json: unknown,
): { ok: true; payment: LinkPayment; shortUrl: string | null } | { ok: false; reason: 'not_payment_link_paid' | 'invalid_payload' } {
  const envelope = z.object({ event: z.string() }).safeParse(json)
  if (!envelope.success) return { ok: false, reason: 'invalid_payload' }
  if (envelope.data.event !== 'payment_link.paid') return { ok: false, reason: 'not_payment_link_paid' }

  const parsed = PaymentLinkPaidSchema.safeParse(json)
  if (!parsed.success) return { ok: false, reason: 'invalid_payload' }

  const link = parsed.data.payload.payment_link.entity
  const p = parsed.data.payload.payment.entity
  return {
    ok: true,
    shortUrl: typeof link.short_url === 'string' ? link.short_url : null,
    payment: {
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      email: realEmail(p.email) ?? realEmail(link.customer?.email),
      contact: p.contact ?? null,
      paymentLinkId: link.id,
      notes: link.notes,
      customerName: link.customer?.name ?? null,
    },
  }
}

/** Optional comma-separated extra link ids from an env var (e.g. a test-mode link). */
export function linkIdsFromEnv(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part !== '')
}
