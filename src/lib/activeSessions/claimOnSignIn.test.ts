import { describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', () => ({ cookies: async () => ({ set: () => {} }), headers: async () => ({ get: () => null }) }))
const { shouldClaimAtSignIn } = await import('./claimOnSignIn')
const { ACTIVE_SESSION_WINDOW_MS } = await import('./activeSessionGate')

describe('shouldClaimAtSignIn', () => {
  const now = Date.parse('2026-10-05T12:00:00Z')
  const ago = (ms: number): { session_id: string; last_active_at: string } => ({ session_id: 'other', last_active_at: new Date(now - ms).toISOString() })

  it('claims for a fresh account or after signing out (no session row)', () => {
    expect(shouldClaimAtSignIn(null, now)).toBe(true)
  })

  it('claims when the previous session went quiet', () => {
    expect(shouldClaimAtSignIn(ago(ACTIVE_SESSION_WINDOW_MS + 1000), now)).toBe(true)
  })

  it('does not claim while another device is active — the prompt still shows there', () => {
    expect(shouldClaimAtSignIn(ago(30_000), now)).toBe(false)
    expect(shouldClaimAtSignIn(ago(ACTIVE_SESSION_WINDOW_MS - 1000), now)).toBe(false)
  })
})
