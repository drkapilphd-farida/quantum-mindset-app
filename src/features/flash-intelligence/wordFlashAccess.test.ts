import { beforeEach, describe, expect, it, vi } from 'vitest'

const getExerciseAccess = vi.fn()
const getModuleProgress = vi.fn()

vi.mock('@/lib/exercises/queries/getExerciseAccess', () => ({ getExerciseAccess: (...args: unknown[]) => getExerciseAccess(...args) }))
vi.mock('@/lib/exercises/queries/getModuleProgress', () => ({ getModuleProgress: (...args: unknown[]) => getModuleProgress(...args) }))

const { getWordFlashUnlock } = await import('./wordFlashAccess')
const { FLASH_INTELLIGENCE_MODULE } = await import('./flashIntelligenceModule')

describe('Word Flash unlock (Day 26)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('opens without the old Eye Foundation module — only the Flash order is checked', async () => {
    getExerciseAccess.mockResolvedValue({ allowed: true })
    expect(await getWordFlashUnlock()).toEqual({ open: true })
    expect(getModuleProgress).not.toHaveBeenCalled()
    expect(getExerciseAccess).toHaveBeenCalledWith('quantum-speed-reading', FLASH_INTELLIGENCE_MODULE, 'word-flash')
  })

  it('Word Flash is first in the Flash order, so nothing earlier can lock it', () => {
    expect(FLASH_INTELLIGENCE_MODULE[0]?.exerciseId).toBe('word-flash')
  })
})
