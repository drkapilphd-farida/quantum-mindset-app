import { afterEach, describe, expect, it, vi } from 'vitest'

// The learner's language choice: saved to a cookie and (when signed in) to
// profiles.preferred_language; read back profile → cookie → browser → English.

type Fake = { user: { id: string } | null; profileLang?: string | null; cookie?: string; acceptLanguage?: string }

async function load(fake: Fake): Promise<{ server: typeof import('./server'); actions: typeof import('./actions'); writes: unknown[]; cookiesSet: unknown[] }> {
  const writes: unknown[] = []
  const cookiesSet: unknown[] = []
  vi.resetModules()
  vi.doMock('next/headers', () => ({
    cookies: async () => ({
      get: (name: string) => (fake.cookie !== undefined && name === 'mum_app_lang' ? { value: fake.cookie } : undefined),
      set: (...args: unknown[]) => cookiesSet.push(args),
    }),
    headers: async () => ({ get: (name: string) => (name === 'accept-language' ? (fake.acceptLanguage ?? null) : null) }),
  }))
  vi.doMock('@/lib/supabase/server', () => ({
    createClient: async () => ({
      auth: { getUser: async () => ({ data: { user: fake.user } }) },
      from: () => {
        const b: Record<string, unknown> = {
          select: () => b,
          eq: () => b,
          maybeSingle: async () => ({ data: fake.profileLang === undefined ? null : { preferred_language: fake.profileLang }, error: null }),
          update: (values: unknown) => {
            writes.push(values)
            return { eq: async () => ({ error: null }) }
          },
        }
        return b
      },
    }),
  }))
  vi.doMock('react', async (orig) => ({ ...(await orig<typeof import('react')>()), cache: <T,>(fn: T) => fn }))
  return { server: await import('./server'), actions: await import('./actions'), writes, cookiesSet }
}

describe('saving the language', () => {
  afterEach(() => vi.resetModules())

  it('saves to the cookie and to the signed-in learner’s profile', async () => {
    const { actions, writes, cookiesSet } = await load({ user: { id: 'u1' } })
    expect(await actions.setAppLanguage('ta')).toEqual({ ok: true })
    expect(writes).toEqual([{ preferred_language: 'ta' }])
    expect(cookiesSet[0]).toEqual(['mum_app_lang', 'ta', expect.objectContaining({ path: '/' })])
  })

  it('signed out: cookie only', async () => {
    const { actions, writes, cookiesSet } = await load({ user: null })
    expect(await actions.setAppLanguage('gu')).toEqual({ ok: true })
    expect(writes).toEqual([])
    expect(cookiesSet).toHaveLength(1)
  })

  it('rejects anything that is not one of the 7 languages', async () => {
    const { actions, writes, cookiesSet } = await load({ user: { id: 'u1' } })
    expect(await actions.setAppLanguage('fr')).toEqual({ ok: false })
    expect(writes).toEqual([])
    expect(cookiesSet).toEqual([])
  })
})

describe('which language a page uses', () => {
  it('the saved profile language wins (it follows the learner to other devices)', async () => {
    const { server } = await load({ user: { id: 'u1' }, profileLang: 'kn', cookie: 'ta', acceptLanguage: 'gu' })
    expect(await server.getAppLang()).toBe('kn')
  })

  it('then the cookie', async () => {
    const { server } = await load({ user: { id: 'u1' }, profileLang: null, cookie: 'te', acceptLanguage: 'gu' })
    expect(await server.getAppLang()).toBe('te')
  })

  it('then the browser language, else English', async () => {
    expect(await (await load({ user: null, acceptLanguage: 'mr-IN,en;q=0.5' })).server.getAppLang()).toBe('mr')
    expect(await (await load({ user: null, acceptLanguage: 'fr-FR' })).server.getAppLang()).toBe('en')
  })

  it('built-in practice text is English for every language today (stored as content_lang)', async () => {
    const { server } = await load({ user: { id: 'u1' }, profileLang: 'ta' })
    expect(await server.getPracticeContentLang('reading')).toBe('en')
  })
})
