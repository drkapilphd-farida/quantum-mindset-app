import { describe, expect, it, vi } from 'vitest'

async function load(dayThirtyComparison: boolean): Promise<typeof import('./sharpBrainCopy')> {
  vi.resetModules()
  vi.doMock('@/config/site.config', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/config/site.config')>()
    return { ...original, appFeatures: { ...original.appFeatures, dayThirtyComparison } }
  })
  return import('./sharpBrainCopy')
}

describe('Sharp Brain page wording follows the Day 30 feature switch', () => {
  it('promises no Day 30 comparison or attention task while the switch is off', async () => {
    const { sharpBrainCopy } = await load(false)
    for (const lang of ['en', 'hi'] as const) {
      const how = JSON.stringify(sharpBrainCopy[lang].how)
      expect(how).not.toMatch(/attention|ध्यान टास्क|Day 30 re-assessment|दिन 30 दोबारा/)
      expect(JSON.stringify(sharpBrainCopy[lang].parents)).not.toMatch(/Day 30|दिन 30/)
    }
    expect(sharpBrainCopy.en.hero.sub).toContain('tracked from Day 1')
  })

  it('describes exactly what was built once switched on', async () => {
    const { sharpBrainCopy } = await load(true)
    expect(sharpBrainCopy.en.how.steps[0]?.desc).toContain('2-minute attention task')
    expect(sharpBrainCopy.en.how.steps[3]?.title).toBe('Day 30 re-assessment')
    expect(sharpBrainCopy.hi.how.steps[3]?.title).toBe('दिन 30 दोबारा असेसमेंट')
    expect(sharpBrainCopy.en.hero.sub).toContain('measured from Day 1 to Day 30')
  })
})
