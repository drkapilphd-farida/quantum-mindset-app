// Supabase Edge Function "cc-payment" — deploy to the WhatsApp dashboard /
// Command Center project (isdohdsscwumvmzgtgua), NOT to the website project.
// Called by the website's Razorpay webhook after a payment-link payment
// (src/features/payments/linkPaymentFollowup.ts). It:
//   1. saves the buyer as a "Paid" lead in cc_leads (once per payment ID);
//   2. adds a follow-up task for today in cc_tasks;
//   3. sends the buyer an approved WhatsApp template confirming the payment.
// Deploy: supabase functions deploy cc-payment --no-verify-jwt
//   (the shared secret header replaces the JWT check).
// Secrets (supabase secrets set …): CC_PAYMENT_HOOK_SECRET, and — if not
// already set for wa-send — the WhatsApp token and phone number ID.
import { createClient } from 'npm:@supabase/supabase-js@2'

type Body = {
  paymentId: string
  program: string
  programHi: string
  next: string
  task: string
  amount: number
  name: string
  greeting: string
  phone: string
  email: string
}

const json = (data: unknown, status = 200): Response => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })

/** First non-empty env var among `names` (wa-send may use any of these names). */
function env(...names: string[]): string {
  for (const n of names) {
    const v = Deno.env.get(n)
    if (v) return v
  }
  return ''
}

function isBody(x: unknown): x is Body {
  if (typeof x !== 'object' || x === null) return false
  const b = x as Record<string, unknown>
  return typeof b.paymentId === 'string' && b.paymentId !== '' && typeof b.program === 'string' && typeof b.amount === 'number'
}

/** "+91 98111 11111" → "919811111111" (WhatsApp Cloud API format). */
function waId(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  return digits
}

async function sendTemplate(b: Body): Promise<string> {
  const token = env('WHATSAPP_TOKEN', 'WHATSAPP_ACCESS_TOKEN', 'WA_TOKEN', 'WA_ACCESS_TOKEN', 'META_WA_TOKEN', 'META_ACCESS_TOKEN')
  const phoneId = env('WHATSAPP_PHONE_NUMBER_ID', 'WA_PHONE_NUMBER_ID', 'WA_PHONE_ID', 'PHONE_NUMBER_ID', 'META_PHONE_NUMBER_ID')
  const template = env('CC_PAYMENT_TEMPLATE') || 'payment_received'
  const language = env('CC_PAYMENT_TEMPLATE_LANG') || 'hi'
  if (!token || !phoneId) return 'skipped (WhatsApp token / phone number ID not found)'
  const to = waId(b.phone)
  if (to.length < 11) return 'skipped (no phone number)'
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: template,
        language: { code: language },
        components: [{ type: 'body', parameters: [{ type: 'text', text: b.greeting || 'जी' }, { type: 'text', text: b.programHi || b.program }] }],
      },
    }),
  })
  if (res.ok) return 'sent'
  const err = await res.json().catch(() => ({}))
  const msg = (err as { error?: { message?: string } }).error?.message ?? String(res.status)
  return `failed (${msg})`
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)
  const secret = env('CC_PAYMENT_HOOK_SECRET')
  if (!secret || req.headers.get('x-cc-secret') !== secret) return json({ error: 'unauthorised' }, 401)

  const body: unknown = await req.json().catch(() => null)
  if (!isBody(body)) return json({ error: 'bad body' }, 400)

  const sb = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } })
  const marker = `Razorpay ${body.paymentId}`

  // Once per payment: Razorpay can deliver the same webhook more than once.
  const { data: existing } = await sb.from('cc_leads').select('id').ilike('notes', `%${marker}%`).limit(1)
  if (existing && existing.length > 0) return json({ lead: true, duplicate: true, whatsapp: 'skipped (duplicate)' })

  const who = body.name || body.phone || body.email || 'Website buyer'
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
  const { error: leadError } = await sb.from('cc_leads').insert({
    name: who,
    phone: body.phone || null,
    email: body.email || null,
    source: 'Website payment',
    program: body.program,
    status: 'Paid',
    amount: body.amount,
    paid_at: new Date().toISOString(),
    next_followup: today,
    notes: `${marker} · Next: ${body.task}`,
  })
  await sb.from('cc_tasks').insert({ title: `${body.task} — ${who} (${body.program})`, due_date: today })

  const whatsapp = await sendTemplate(body)
  return json({ lead: !leadError, whatsapp, ...(leadError ? { leadError: leadError.message } : {}) })
})
