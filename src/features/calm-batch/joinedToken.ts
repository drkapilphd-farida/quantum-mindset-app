// Server only — NOT a server action (it must never be callable from the
// browser). Signs the joined-page link so the WhatsApp / Zoom links show
// only to a buyer whose payment was verified.
import { createHmac, timingSafeEqual } from 'node:crypto'

function secret(): string {
  return process.env.RAZORPAY_KEY_SECRET ?? ''
}

export function joinedToken(paymentId: string): string {
  return createHmac('sha256', secret()).update(`calm-mind-batch:${paymentId}`).digest('hex')
}

export function isValidJoinedToken(paymentId: string, token: string): boolean {
  if (secret() === '' || paymentId === '' || token === '') return false
  const expected = Buffer.from(joinedToken(paymentId))
  const given = Buffer.from(token)
  return expected.length === given.length && timingSafeEqual(expected, given)
}
