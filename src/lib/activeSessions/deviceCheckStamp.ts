// Speed fix 2 (Oct 2026): "one device at a time" is checked against the
// database at most every few minutes per learner, not on every click. After a
// successful check, the middleware sets a short-lived cookie holding the check
// time, signed (HMAC-SHA-256) with a server-only secret and bound to the
// learner and their device session — so it can't be forged or reused to skip
// the rule. Web Crypto only, so it runs in the middleware (edge) runtime.

export const DEVICE_CHECK_COOKIE = 'qm_device_checked'
/** How long a successful device check is trusted. Well inside the 12-minute active-session window. */
export const DEVICE_CHECK_INTERVAL_MS = 3 * 60 * 1000

const encoder = new TextEncoder()

async function sign(message: string): Promise<string | null> {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) return null
  const key = await crypto.subtle.importKey('raw', encoder.encode(`device-check:${secret}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(message)))
  let binary = ''
  for (const byte of mac) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** "<checkedAtMs>.<signature>" for this learner and device session; null if the secret is missing. */
export async function makeDeviceCheckStamp(userId: string, sessionId: string, nowMs: number): Promise<string | null> {
  const signature = await sign(`${userId}.${sessionId}.${nowMs}`)
  return signature === null ? null : `${nowMs}.${signature}`
}

/** True only for a genuine, recent stamp for exactly this learner and device session. */
export async function deviceCheckIsFresh(stamp: string | undefined, userId: string, sessionId: string | null, nowMs: number): Promise<boolean> {
  if (!stamp || !sessionId) return false
  const dot = stamp.indexOf('.')
  if (dot <= 0) return false
  const checkedAt = Number(stamp.slice(0, dot))
  if (!Number.isFinite(checkedAt) || nowMs - checkedAt < 0 || nowMs - checkedAt > DEVICE_CHECK_INTERVAL_MS) return false
  const expected = await sign(`${userId}.${sessionId}.${checkedAt}`)
  return expected !== null && sameText(expected, stamp.slice(dot + 1))
}
