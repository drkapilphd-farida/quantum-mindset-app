import { describe, expect, it } from 'vitest'
import { LEGACY_REDIRECTS } from './legacyRedirects'

const find = (source: string): { destination: string; statusCode: number } | undefined => LEGACY_REDIRECTS.find((r) => r.source === source)

describe('legacy redirects', () => {
  it('sends each indexed old WordPress URL to the closest current page with a 301', () => {
    expect(find('/faq')).toMatchObject({ destination: '/#faq', statusCode: 301 })
    expect(find('/testimonials')).toMatchObject({ destination: '/#proof', statusCode: 301 })
    expect(find('/personalclass')).toMatchObject({ destination: '/mentoring/personal-class', statusCode: 301 })
    expect(find('/anxiety')).toMatchObject({ destination: '/mentoring/overthinking-course', statusCode: 301 })
    for (const old of ['/telepathy', '/telepathycourse', '/about-us-telepathy', '/free', '/elementor-landing-page-1483']) {
      expect(find(old)).toMatchObject({ destination: '/', statusCode: 301 })
    }
  })

  it('never redirects /courses, which is a real page on this site', () => {
    expect(find('/courses')).toBeUndefined()
  })

  it('uses only unique sources and permanent 301s', () => {
    const sources = LEGACY_REDIRECTS.map((r) => r.source)
    expect(new Set(sources).size).toBe(sources.length)
    expect(LEGACY_REDIRECTS.every((r) => r.statusCode === 301)).toBe(true)
  })
})

describe('Starter closed to new buyers', () => {
  it('sends the old Starter landing page and its sub-paths to the Sharp Brain program', () => {
    expect(find('/programs/habit-builder')?.destination).toBe('/programs/sharp-brain')
    expect(find('/programs/habit-builder/:path*')?.destination).toBe('/programs/sharp-brain')
  })

  it('sends the old Eye Foundation pages to their current replacements (Phase 2)', () => {
    const to = (source: string): string | undefined => LEGACY_REDIRECTS.find((r) => r.source === source)?.destination
    expect(to('/labs/sharp-brain/eye-warm-up')).toBe('/labs/sharp-brain/calm-breathing')
    expect(to('/labs/sharp-brain/eye-stretch')).toBe('/labs/sharp-brain/brain-gym')
    expect(to('/labs/sharp-brain/eye-span')).toBe('/labs/sharp-brain/visual-span')
    expect(to('/labs/sharp-brain/regression-control')).toBe('/labs/sharp-brain/guided-paragraph-reading-mode')
    for (const slug of ['reading-speed', 'rsvp', 'preparation']) expect(to(`/labs/sharp-brain/${slug}`)).toBe('/labs/sharp-brain/thirty-day-curriculum')
  })
})
