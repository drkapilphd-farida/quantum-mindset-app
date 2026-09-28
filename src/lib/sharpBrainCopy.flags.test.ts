import { describe, expect, it, vi } from 'vitest'

async function load(dayThirtyComparison: boolean, mobileDiscipline = false): Promise<typeof import('./sharpBrainCopy')> {
  vi.resetModules()
  vi.doMock('@/config/site.config', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/config/site.config')>()
    return { ...original, appFeatures: { ...original.appFeatures, dayThirtyComparison, mobileDiscipline } }
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

describe('Sharp Brain page wording follows the Mobile Discipline switch', () => {
  it('promises no screen-time goal, focus sessions or streak while off', async () => {
    const { sharpBrainCopy } = await load(false, false)
    for (const lang of ['en', 'hi'] as const) {
      const text = JSON.stringify([sharpBrainCopy[lang].skills, sharpBrainCopy[lang].audiences, sharpBrainCopy[lang].parents])
      expect(text).not.toMatch(/focus sessions|streak|screen-time goal|स्ट्रीक|फोकस सेशन|स्क्रीन-टाइम लक्ष्य/)
    }
  })

  it('describes the built module once on', async () => {
    const { sharpBrainCopy } = await load(false, true)
    const skill = sharpBrainCopy.en.skills.items.find((item) => item.title === 'Mobile Discipline')
    expect(skill?.desc).toContain('focus timer (10, 15 or 25 minutes)')
    expect(sharpBrainCopy.en.parents.points[0]).toContain('screen-time goal')
  })
})
