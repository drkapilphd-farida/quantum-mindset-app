import { describe, it, expect } from 'vitest'
import { findGatingSequence } from './exerciseGatingRegistry'
import { READING_EXPANSION_MODULE } from '@/features/quantum-speed-reading/readingExpansionModule'
import { FLASH_INTELLIGENCE_MODULE } from '@/features/flash-intelligence/flashIntelligenceModule'

describe('findGatingSequence', () => {
  it('resolves every READING_EXPANSION_MODULE member to that same sequence, including the entry point (Progressive Chunk Reading, Sprint-12)', () => {
    for (const item of READING_EXPANSION_MODULE) {
      expect(findGatingSequence('quantum-speed-reading', item.exerciseId)).toBe(READING_EXPANSION_MODULE)
    }
  })

  it('the removed Eye Foundation drills gate nothing any more (Oct 2026)', () => {
    for (const id of ['eye-warm-up', 'eye-stretch', 'eye-span', 'regression-control', 'reading-speed', 'rsvp']) {
      expect(findGatingSequence('quantum-speed-reading', id)).toBeNull()
    }
  })

  it('resolves every FLASH_INTELLIGENCE_MODULE member to that same sequence (Sprint-12)', () => {
    for (const item of FLASH_INTELLIGENCE_MODULE) {
      expect(findGatingSequence('quantum-speed-reading', item.exerciseId)).toBe(FLASH_INTELLIGENCE_MODULE)
    }
  })

  it('returns null for an exercise with no gated sequence of its own', () => {
    expect(findGatingSequence('quantum-speed-reading', 'chunk-reading')).toBeNull()
  })

  it('returns null for a lab with no registered gated sequences', () => {
    expect(findGatingSequence('memory-intelligence', 'anything')).toBeNull()
    expect(findGatingSequence('focus-intelligence', 'anything')).toBeNull()
  })

  it('returns null for an exerciseId that does not exist anywhere', () => {
    expect(findGatingSequence('quantum-speed-reading', 'does-not-exist')).toBeNull()
  })
})
