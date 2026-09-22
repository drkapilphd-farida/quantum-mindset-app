import { describe, expect, it, vi, beforeEach } from 'vitest'

// Anti-Leak Watermark™ test — mirrors the small `.from(table)` mocking
// convention already established in this app's other Supabase-backed
// action tests. Covers the one real business rule this function
// enforces: every signed-in viewer except the site owner's own account
// gets watermarked with their own email/phone.

type MockConfig = {
  email?: string | null
  phone?: string | null
}

function makeClient({ email = 'student@example.com', phone = null }: MockConfig = {}): { auth: unknown; from: (table: string) => unknown } {
  return {
    auth: {
      getUser: () =>
        Promise.resolve({
          data: { user: email === null ? null : { id: 'user-1', email } },
        }),
    },
    from: (table: string) => {
      if (table !== 'profiles') throw new Error(`Unexpected table in test mock: ${table}`)
      return { select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: { phone } }) }) }) }
    },
  }
}

async function importGetWatermarkText(client: ReturnType<typeof makeClient>): Promise<typeof import('./getCurriculumWatermarkText')> {
  vi.resetModules()
  vi.doMock('@/lib/supabase/server', () => ({ createClient: () => Promise.resolve(client) }))
  return import('./getCurriculumWatermarkText')
}

describe('getCurriculumWatermarkText', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null for a signed-out visitor', async () => {
    const client = makeClient({ email: null })
    const { getCurriculumWatermarkText } = await importGetWatermarkText(client)

    expect(await getCurriculumWatermarkText()).toBeNull()
  })

  it('returns null for the excluded owner account, case-insensitively', async () => {
    const client = makeClient({ email: 'DrKapilPhd@Gmail.com' })
    const { getCurriculumWatermarkText } = await importGetWatermarkText(client)

    expect(await getCurriculumWatermarkText()).toBeNull()
  })

  it('returns the viewer\'s email for a real student with no phone on file', async () => {
    const client = makeClient({ email: 'student@example.com', phone: null })
    const { getCurriculumWatermarkText } = await importGetWatermarkText(client)

    expect(await getCurriculumWatermarkText()).toBe('student@example.com')
  })

  it('includes the phone alongside the email when one is on file', async () => {
    const client = makeClient({ email: 'student@example.com', phone: '+919999999999' })
    const { getCurriculumWatermarkText } = await importGetWatermarkText(client)

    expect(await getCurriculumWatermarkText()).toBe('student@example.com · +919999999999')
  })
})
