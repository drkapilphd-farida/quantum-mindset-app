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
})
