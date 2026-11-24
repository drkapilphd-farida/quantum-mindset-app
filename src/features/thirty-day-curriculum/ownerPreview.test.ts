import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))

import { isOwnerPreviewEmail } from './ownerPreview'

describe('isOwnerPreviewEmail', () => {
  it('is true only for the founder account, ignoring case and spaces', () => {
    expect(isOwnerPreviewEmail('drkapilphd@gmail.com')).toBe(true)
    expect(isOwnerPreviewEmail('  DrKapilPhD@Gmail.com ')).toBe(true)
  })

  it('is false for every other learner and for no email', () => {
    expect(isOwnerPreviewEmail('student@gmail.com')).toBe(false)
    expect(isOwnerPreviewEmail('drkapilphd@gmail.com.evil.com')).toBe(false)
    expect(isOwnerPreviewEmail('')).toBe(false)
    expect(isOwnerPreviewEmail(null)).toBe(false)
    expect(isOwnerPreviewEmail(undefined)).toBe(false)
  })
})
