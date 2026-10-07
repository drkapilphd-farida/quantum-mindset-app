import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { FairLang, FormId, TestKind } from './forms'

// Signed, short-lived state for one fair reading test, so the server — not
// the device — measures the reading time and scores the answers. Bound to the
// learner's id, so a token can't be used by anyone else. Same HMAC scheme as
// the free Reading Speed Test, with its own key namespace.

export type FairTokenPayload =
  | { kind: 'reading'; uid: string; lang: FairLang; form: FormId; test: TestKind; day: number | null; t0: number; perm: number[][] }
  | { kind: 'questions'; uid: string; lang: FairLang; form: FormId; test: TestKind; day: number | null; readMs: number; perm: number[][] }

const MAX_AGE_MS = 60 * 60 * 1000

function secret(): Buffer {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceKey === undefined || serviceKey === '') throw new Error('Fair reading test signing secret is not configured')
  return createHash('sha256').update(`fair-reading-test:${serviceKey}`).digest()
}

function sign(body: string): string {
  return createHmac('sha256', secret()).update(body).digest('base64url')
}

export function signFairToken(payload: FairTokenPayload, now: number = Date.now()): string {
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now })).toString('base64url')
  return `${body}.${sign(body)}`
}

export function verifyFairToken<K extends FairTokenPayload['kind']>(token: string, kind: K, uid: string, now: number = Date.now()): Extract<FairTokenPayload, { kind: K }> {
  const [body, signature] = token.split('.')
  if (body === undefined || signature === undefined) throw new Error('invalid token')
  const expected = Buffer.from(sign(body))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) throw new Error('invalid token')
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as FairTokenPayload & { iat: number }
  if (payload.kind !== kind || payload.uid !== uid) throw new Error('invalid token')
  if (now - payload.iat > MAX_AGE_MS) throw new Error('expired token')
  return payload as unknown as Extract<FairTokenPayload, { kind: K }>
}
