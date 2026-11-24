import { afterEach, describe, expect, it, vi } from 'vitest'
import { LINK_PRODUCTS, linkProductForAmount } from './linkProducts'
import { buyerEmailText, greetingName, notifyCommandCenter, type LinkPayment } from './linkPaymentFollowup'

const offline = LINK_PRODUCTS.find((p) => p.id === 'sb-offline-registration')
if (offline === undefined) throw new Error('missing product')
const pay: LinkPayment = { product: offline, paymentId: 'pay_9', amountInr: 3000, name: '', email: 'ravi.k12@gmail.com', phone: '+919811111111' }

describe('payment-link follow-up (owner, 24 Nov 2026)', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('matches the four link products by exact INR amount only', () => {
    expect(linkProductForAmount(300000, 'INR')?.id).toBe('sb-offline-registration')
    expect(linkProductForAmount(300000, 'USD')).toBeNull()
    expect(linkProductForAmount(299900, 'INR')).toBeNull()
  })

  it('greets by name, else by the email name', () => {
    expect(greetingName('Asha Patel', 'x@y.in')).toBe('Asha')
    expect(greetingName('', 'ravi.k12@gmail.com')).toBe('Ravi')
    expect(greetingName('', '1234@x.in')).toBe('')
  })

  it('tells the buyer the ₹3,000 registration rule in Hindi and English', () => {
    const text = buyerEmailText(pay)
    expect(text).toContain('नमस्ते Ravi')
    expect(text).toContain('10 सीटें')
    expect(text).toContain('₹5,999')
    expect(text).toContain('Payment ID: pay_9')
  })

  it('skips the Command Center when it is not connected, and posts the lead when it is', async () => {
    expect(await notifyCommandCenter(pay)).toMatch(/not connected/)
    vi.stubEnv('CC_PAYMENT_HOOK_URL', 'https://cc.example/functions/v1/cc-payment')
    vi.stubEnv('CC_PAYMENT_HOOK_SECRET', 's3cret')
    const calls: { url: string; init: RequestInit | undefined }[] = []
    const fake = (async (url: string, init?: RequestInit) => {
      calls.push({ url, init })
      return new Response(JSON.stringify({ lead: true, whatsapp: 'sent' }), { status: 200 })
    }) as unknown as typeof fetch
    expect(await notifyCommandCenter(pay, fake)).toBe('lead saved · WhatsApp: sent')
    expect(calls[0]?.url).toBe('https://cc.example/functions/v1/cc-payment')
    expect((calls[0]?.init?.headers as Record<string, string>)['x-cc-secret']).toBe('s3cret')
    expect(JSON.parse(String(calls[0]?.init?.body))).toMatchObject({ paymentId: 'pay_9', amount: 3000, phone: '+919811111111', greeting: 'Ravi' })
  })
})
