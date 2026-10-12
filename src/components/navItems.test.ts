import { describe, expect, it } from 'vitest'
import { navItemsFor } from './navItems'

describe('sidebar items', () => {
  it('app domain: Sharp Brain opens the 30-day plan, then Memory Studio and Live Classes', () => {
    const items = navItemsFor('app', false)
    expect(items.map((item) => item.href)).toEqual(['/dashboard', '/labs/sharp-brain/thirty-day-curriculum', '/memory-studio', '/masterclasses', '/document-studio'])
    expect(items.find((item) => item.href === '/masterclasses')?.labelKey).toBe('nav.liveClasses')
    expect(items.find((item) => item.href === '/labs/sharp-brain/thirty-day-curriculum')?.label).toBe('Sharp Brain')
    expect(items.find((item) => item.href === '/memory-studio')?.labelKey).toBe('nav.memoryStudio')
  })

  it('habit domain is unchanged', () => {
    expect(navItemsFor('habit', true).map((item) => item.href)).toEqual(['/dashboard', '/labs/sharp-brain/journey/analytics', '/settings'])
    expect(navItemsFor('habit', false).map((item) => item.href)).toEqual(['/dashboard', '/settings'])
  })
})
