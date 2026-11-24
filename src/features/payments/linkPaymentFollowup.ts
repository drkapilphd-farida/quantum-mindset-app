// Server only. What happens after someone pays through a Razorpay payment
// link (owner, 24 Nov 2026), so nobody waits and nobody is forgotten:
//   1. the buyer gets a confirmation email (Hindi + English) with next steps;
//   2. the owner gets a "payment received" email;
//   3. the Command Center gets the paid lead + a follow-up task, and sends
//      the buyer a WhatsApp confirmation (Supabase Edge Function
//      "cc-payment" in the WhatsApp dashboard project — see
//      integrations/command-center/README.md).
// Each step is optional (skipped when its settings are missing) and never
// throws: a failed email must not make Razorpay retry the webhook.
import { Resend } from 'resend'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import type { LinkProduct } from './linkProducts'

const DEFAULT_NOTIFY_EMAIL = 'drkapilphd@gmail.com'
const OWNER_WHATSAPP = '+91 91739 43555'

export type LinkPayment = {
  product: LinkProduct
  paymentId: string
  amountInr: number
  name: string
  email: string
  /** Normalised Indian mobile (+91…) when possible. */
  phone: string
}

/** A friendly first name for greetings: the buyer's name, else the part of the email before "@", else "". */
export function greetingName(name: string, email: string): string {
  const fromName = name.trim().split(/\s+/)[0] ?? ''
  if (fromName !== '') return fromName
  const local = email.split('@')[0] ?? ''
  const cleaned = local.replace(/[^a-zA-Z]/g, ' ').trim().split(/\s+/)[0] ?? ''
  return cleaned === '' ? '' : cleaned[0]?.toUpperCase() + cleaned.slice(1).toLowerCase()
}

/** Plain-text confirmation for the buyer (exported for tests). */
export function buyerEmailText(p: LinkPayment): string {
  const first = greetingName(p.name, p.email)
  return [
    `नमस्ते ${first || 'जी'} 🙏`,
    ``,
    `${p.product.name.hi} के लिए आपका ₹${p.amountInr.toLocaleString('en-IN')} का पेमेंट मिल गया है।`,
    p.product.next.hi,
    `कोई सवाल हो तो WhatsApp कीजिए: ${OWNER_WHATSAPP}`,
    ``,
    `—`,
    ``,
    `Namaste ${first || 'there'},`,
    ``,
    `We have received your payment of ₹${p.amountInr.toLocaleString('en-IN')} for the ${p.product.name.en}.`,
    p.product.next.en,
    `Questions? WhatsApp us: ${OWNER_WHATSAPP}`,
    ``,
    `Payment ID: ${p.paymentId}`,
    ``,
    `Dr. Kapil Dev Sharma · Mind Ur Mind · mindurmind.org.in`,
  ].join('\n')
}

function resend(): { client: Resend; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return { client: new Resend(apiKey), from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev' }
}

async function sendEmails(p: LinkPayment, ccResult: string): Promise<void> {
  const r = resend()
  if (r === null) {
    logger.warn('[link-payment] RESEND_API_KEY not set — skipping emails')
    return
  }
  if (p.email !== '') {
    const { error } = await r.client.emails.send({
      from: r.from,
      to: p.email,
      subject: `पेमेंट मिल गया · Payment received — ${p.product.name.en}`,
      text: buyerEmailText(p),
    })
    if (error) logger.warn('[link-payment] buyer email failed', { error: error.message })
  }
  const { error } = await r.client.emails.send({
    from: r.from,
    to: process.env.FRANCHISE_LEAD_NOTIFY_EMAIL ?? DEFAULT_NOTIFY_EMAIL,
    subject: `[Payment] ₹${p.amountInr.toLocaleString('en-IN')} — ${p.product.name.en} — ${p.name || p.phone || p.email}`,
    text: [
      `A Razorpay payment-link payment came in.`,
      ``,
      `Program: ${p.product.name.en}`,
      `Amount: ₹${p.amountInr.toLocaleString('en-IN')}`,
      `Name: ${p.name || '(not given)'}`,
      `WhatsApp / phone: ${p.phone || '(not given)'}`,
      `Email: ${p.email || '(not given)'}`,
      `Payment ID: ${p.paymentId}`,
      ``,
      `Next: ${p.product.task}`,
      `Command Center: ${ccResult}`,
    ].join('\n'),
  })
  if (error) logger.warn('[link-payment] owner email failed', { error: error.message })
}

const CcResponse = z.object({ lead: z.boolean().optional(), whatsapp: z.string().optional() }).passthrough()

/** Sends the paid lead to the Command Center hook. Returns a short status line for the owner email. */
export async function notifyCommandCenter(p: LinkPayment, fetchImpl: typeof fetch = fetch): Promise<string> {
  const url = process.env.CC_PAYMENT_HOOK_URL
  const secret = process.env.CC_PAYMENT_HOOK_SECRET
  if (!url || !secret) return 'not connected (CC_PAYMENT_HOOK_URL / CC_PAYMENT_HOOK_SECRET not set) — add the lead by hand'
  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-cc-secret': secret },
      body: JSON.stringify({
        paymentId: p.paymentId,
        program: p.product.name.en,
        programHi: p.product.name.hi,
        next: p.product.next.hi,
        task: p.product.task,
        amount: p.amountInr,
        name: p.name,
        greeting: greetingName(p.name, p.email) || 'जी',
        phone: p.phone,
        email: p.email,
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      logger.warn('[link-payment] Command Center hook failed', { status: res.status })
      return `hook error ${res.status} — add the lead by hand`
    }
    const body = CcResponse.safeParse(await res.json().catch(() => ({})))
    const wa = body.success ? body.data.whatsapp : undefined
    return `lead saved${wa ? ` · WhatsApp: ${wa}` : ''}`
  } catch (error) {
    logger.warn('[link-payment] Command Center hook threw', { error: error instanceof Error ? error.message : String(error) })
    return 'hook unreachable — add the lead by hand'
  }
}

export async function followUpLinkPayment(p: LinkPayment): Promise<void> {
  const cc = await notifyCommandCenter(p)
  await sendEmails(p, cc)
}
