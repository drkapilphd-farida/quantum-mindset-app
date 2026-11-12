// Server only. Clarity Session payments (₹1,100), saved once — from the
// browser after Checkout and from the Razorpay webhook (payment.captured).
// No migration: a franchise_leads row tagged "[clarity-paid]" whose id is
// derived from the payment ID (the database refuses a second one). The owner
// gets one email per new payment.
import { Resend } from 'resend'
import { CLARITY_SESSION } from '@/config/site.config'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { idFromKey, UNIQUE_VIOLATION } from '@/lib/idFromKey'

export type ClarityPayment = { paymentId: string; orderId: string; email: string; phone: string; program: string | null; utm: string | null }
export type ClaritySaveResult = 'created' | 'exists' | 'failed'

export const CLARITY_PAID_TAG = '[clarity-paid]'

export function clarityBackground(p: ClarityPayment): string {
  return [`${CLARITY_PAID_TAG} Clarity Session ₹${CLARITY_SESSION.priceInr.toLocaleString('en-IN')}`, `Payment: ${p.paymentId}`, `Order: ${p.orderId}`, `Email: ${p.email}`, ...(p.program !== null ? [`Program: ${p.program}`] : []), ...(p.utm !== null ? [`UTM: ${p.utm}`] : [])].join('\n')
}

async function saveClarityPayment(p: ClarityPayment): Promise<ClaritySaveResult> {
  let client: ReturnType<typeof createServiceClient>
  try {
    client = createServiceClient()
  } catch {
    return 'failed'
  }
  const { error } = await client.from('franchise_leads').insert({ id: idFromKey(`clarity:${p.paymentId}`), name: p.email || 'Clarity Session buyer', phone: p.phone || '-', city: 'Online — Clarity Session', background: clarityBackground(p) })
  if (error === null) return 'created'
  if (error.code === UNIQUE_VIOLATION) return 'exists'
  logger.warn('[clarity-session] could not save payment', { error: error.message })
  return 'failed'
}

async function notifyOwner(p: ClarityPayment, source: 'checkout' | 'webhook'): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
    to: process.env.FRANCHISE_LEAD_NOTIFY_EMAIL ?? 'drkapilphd@gmail.com',
    subject: `[Clarity Session] ₹${CLARITY_SESSION.priceInr.toLocaleString('en-IN')} paid — ${p.email || p.phone}`,
    text: [
      `A Clarity Session payment came in${source === 'webhook' ? ' (through the Razorpay webhook — the buyer did not return to the website, so they may not have picked a time on Cal.com yet)' : ''}.`,
      ``,
      `Email: ${p.email}`,
      `Phone: ${p.phone}`,
      ...(p.program !== null ? [`Program: ${p.program}`] : []),
      `Payment ID: ${p.paymentId}`,
    ].join('\n'),
  })
  if (error) logger.warn('[clarity-session] owner email failed', { error: error.message })
}

/** Saves the payment once and tells the owner — only the call that created the record emails. */
export async function finalizeClarityPayment(p: ClarityPayment, source: 'checkout' | 'webhook'): Promise<ClaritySaveResult> {
  const result = await saveClarityPayment(p)
  if (result !== 'exists') await notifyOwner(p, source)
  return result
}
