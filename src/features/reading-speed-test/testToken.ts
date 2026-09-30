import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

// Stateless, HMAC-signed tokens for the Reading Speed Test. Server-only.
// The server stamps the start time and the option shuffle into a token, so
// timing and scoring never rely on numbers sent by the browser.

export type TestTokenPayload =
  | { kind: 'reading'; pid: string; t0: number; perm: number[][] }
  | { kind: 'questions'; pid: string; readMs: number; perm: number[][] }
  | { kind: 'result'; pid: string; lang: 'en' | 'hi'; wpm: number; comp: number; eff: number; status: string }
  | { kind: 'practice'; pid: string; pace: number; perm: number[][] }

const MAX_AGE_MS = 60 * 60 * 1000

function secret(): Buffer {
  const explicit = process.env.SPEED_TEST_SIGNING_SECRET
  if (explicit !== undefined && explicit !== '') return Buffer.from(explicit)
  // Fallback: a key derived from the service-role key (never the key itself).
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceKey === undefined || serviceKey === '') throw new Error('Reading Speed Test signing secret is not configured')
  return createHash('sha256').update(`reading-speed-test:${serviceKey}`).digest()
}

function sign(body: string): string {
  return createHmac('sha256', secret()).update(body).digest('base64url')
}

export function signTestToken(payload: TestTokenPayload, now: number = Date.now()): string {
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now })).toString('base64url')
  return `${body}.${sign(body)}`
}

export function verifyTestToken<K extends TestTokenPayload['kind']>(
  token: string,
  kind: K,
  now: number = Date.now(),
): Extract<TestTokenPayload, { kind: K }> & { iat: number } {
  const [body, signature] = token.split('.')
  if (body === undefined || signature === undefined) throw new Error('invalid token')
  const expected = Buffer.from(sign(body))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) throw new Error('invalid token')
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TestTokenPayload & { iat: number }
  if (payload.kind !== kind) throw new Error('invalid token')
  if (now - payload.iat > MAX_AGE_MS) throw new Error('expired token')
  return payload as Extract<TestTokenPayload, { kind: K }> & { iat: number }
}
