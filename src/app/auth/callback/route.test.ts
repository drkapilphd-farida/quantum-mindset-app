import { describe, expect, it, vi } from 'vitest'

// Google sign-in and email links (sign-up confirmation) land here. The
// one-device session must be claimed before the redirect, so the first
// page doesn't show "Continue here?" against the learner's own device.

const claim = vi.fn((_supabase: unknown, _userId: string) => Promise.resolve())

async function load(exchangeResult: { data: { user: { id: string } | null }; error: unknown }): Promise<typeof import('./route')> {
  vi.resetModules()
  claim.mockClear()
  vi.doMock('@/lib/supabase/server', () => ({
    createClient: () => Promise.resolve({ auth: { exchangeCodeForSession: () => Promise.resolve(exchangeResult) } }),
  }))
  vi.doMock('@/features/school-dashboard/queries/resolvePostSignInPath', () => ({ resolvePostSignInPath: () => Promise.resolve('/dashboard') }))
  vi.doMock('@/lib/activeSessions/claimOnSignIn', () => ({ claimActiveSessionOnSignIn: claim }))
  return import('./route')
}

describe('/auth/callback', () => {
  it('claims the session for the signed-in learner before redirecting', async () => {
    const { GET } = await load({ data: { user: { id: 'user-1' } }, error: null })
    const res = await GET(new Request('https://app.example.org/auth/callback?code=abc&next=/welcome/choose-method') as never)

    expect(claim).toHaveBeenCalledWith(expect.anything(), 'user-1')
    expect(res.headers.get('location')).toBe('https://app.example.org/welcome/choose-method')
  })

  it('does not claim anything when the code is invalid', async () => {
    const { GET } = await load({ data: { user: null }, error: { message: 'bad code' } })
    const res = await GET(new Request('https://app.example.org/auth/callback?code=bad') as never)

    expect(claim).not.toHaveBeenCalled()
    expect(res.headers.get('location')).toBe('https://app.example.org/login?error=invalid-link')
  })
})
