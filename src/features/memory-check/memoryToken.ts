import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { MemoryForm, MemoryLang } from './content'
import type { MemoryPhase } from './memoryCheck'

// Signed state for one memory check, so the server — not the device — knows
// the number shown and scores the answers. Bound to the learner's id. Same
// HMAC scheme as the fair reading test, with its own key namespace.

export type MemoryTokenPayload = { uid: string; phase: MemoryPhase; form: MemoryForm; lang: MemoryLang; day: number; number: string; t0: number }

const MAX_AGE_MS = 60 * 60 * 1000

function secret(): Buffer {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceKey === undefined || serviceKey === '') throw new Error('Memory check signing secret is not configured')
  return createHash('sha256').update(`memory-check:${serviceKey}`).digest()
}

function sign(body: string): string {
  return createHmac('sha256', secret()).update(body).digest('base64url')
}

export function signMemoryToken(payload: MemoryTokenPayload, now: number = Date.now()): string {
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now })).toString('base64url')
  return `${body}.${sign(body)}`
}

export function verifyMemoryToken(token: string, uid: string, now: number = Date.now()): MemoryTokenPayload {
  const [body, signature] = token.split('.')
  if (body === undefined || signature === undefined) throw new Error('invalid token')
  const expected = Buffer.from(sign(body))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) throw new Error('invalid token')
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as MemoryTokenPayload & { iat: number }
  if (payload.uid !== uid) throw new Error('invalid token')
  if (now - payload.iat > MAX_AGE_MS) throw new Error('expired token')
  return payload
}
