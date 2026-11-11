import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import sitemap from './sitemap'

// TEMPORARY review-thumbnail picker (delete with the page before merging).
describe('thumb picker page', () => {
  it('is hidden from search engines and not in the sitemap', () => {
    const page = readFileSync(join(process.cwd(), 'src/app/thumb-picker-7k3q9/page.tsx'), 'utf8')
    expect(page).toContain('robots: { index: false, follow: false }')
    expect(page).not.toContain('redirect(')
    expect(sitemap().map((entry) => entry.url).some((url) => url.includes('thumb-picker'))).toBe(false)
  })
})
