import { describe, expect, it, vi } from 'vitest'

async function post(body: unknown): Promise<{ status: number; serviceClientCreated: boolean; warned: unknown[] }> {
  let serviceClientCreated = false
  const warned: unknown[] = []
  vi.resetModules()
  vi.stubEnv('RAZORPAY_HABIT_BUILDER_WEBHOOK_SECRET', 'secret')
  vi.doMock('@/lib/supabase/service', () => ({
    createServiceClient: () => {
      serviceClientCreated = true
      return {}
    },
  }))
  vi.doMock('@/lib/razorpay/verifyWebhookSignature', () => ({ verifyRazorpayWebhookSignature: () => true }))
  vi.doMock('@/lib/rateLimit', () => ({ checkRateLimit: () => ({ allowed: true, retryAfterMs: 0 }), getClientIp: () => Promise.resolve('1.1.1.1') }))
  vi.doMock('@/lib/logger', () => ({ logger: { warn: (...args: unknown[]) => warned.push(args), error: () => undefined, info: () => undefined } }))
  const { POST } = await import('./route')
  const request = new Request('https://example.com/api/razorpay/habit-builder-webhook', {
    method: 'POST',
    headers: { 'x-razorpay-signature': 'sig' },
    body: JSON.stringify(body),
  })
  const response = await POST(request as never)
  return { status: response.status, serviceClientCreated, warned }
}

const starterPaid = {
  event: 'payment_link.paid',
  payload: {
    payment_link: { entity: { id: 'plink_1', short_url: 'https://rzp.io/rzp/vecVC7sx' } },
    payment: { entity: { id: 'pay_1', amount: 9900, currency: 'INR', email: 'buyer@example.com', contact: null } },
  },
}

describe('habit-builder webhook (Starter closed)', () => {
  it('acknowledges a Starter payment without granting or recording anything', async () => {
    const { status, serviceClientCreated, warned } = await post(starterPaid)
    expect(status).toBe(200)
    expect(serviceClientCreated).toBe(false)
    expect(JSON.stringify(warned)).toContain('pay_1')
    expect(JSON.stringify(warned)).not.toContain('buyer@example.com')
  })

  it('acknowledges other events', async () => {
    const { status, warned } = await post({ event: 'payment.captured', payload: {} })
    expect(status).toBe(200)
    expect(warned).toHaveLength(0)
  })
})
