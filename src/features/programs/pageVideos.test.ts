import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PAGE_VIDEOS } from '@/config/site.config'
import { PROGRAM_PAGE_VIDEOS } from './pageVideos'

describe('page videos (owner, Nov 2026)', () => {
  it('uses the owner’s 9 YouTube Shorts IDs', () => {
    expect(Object.fromEntries(Object.entries(PAGE_VIDEOS).map(([key, v]) => [key, v.id]))).toEqual({
      intro: '9Uu37T9ceK8',
      stress: 'TjDyV2y_f10',
      mindset: 'NkMF-GgHBWo',
      trader: '6BviF0upE94',
      kriyaYoga: 'N4GN2wZ-h1k',
      clarity: 'rBob7TyUt0Q',
      welcome: 'mgChcjYr7bo',
      sharpBrain: 'LPrime0Nl-s',
      partner: 'HV2ytS0oyds',
    })
    for (const v of Object.values(PAGE_VIDEOS)) {
      expect(v.caption.en.length, v.name).toBeGreaterThan(0)
      expect(v.caption.hi.length, v.name).toBeGreaterThan(0)
    }
  })

  it('shows the right video on each program page', () => {
    expect(PROGRAM_PAGE_VIDEOS).toEqual({
      'stress-anxiety-support': 'stress',
      'mindset-coaching': 'mindset',
      'subconscious-reprogramming': 'mindset',
      'heart-brain-coherence': 'mindset',
      manifestation: 'mindset',
      'business-loss-mindset': 'mindset',
      'intuition-for-traders': 'trader',
      telepathy: 'kriyaYoga',
      'aura-reading': 'kriyaYoga',
      'chakra-activation': 'kriyaYoga',
      'cosmic-fusion': 'kriyaYoga',
      'kundalini-meditation': 'kriyaYoga',
      'samadhi-meditation': 'kriyaYoga',
      'astral-projection': 'kriyaYoga',
      'personal-retreat': 'kriyaYoga',
    })
  })
  it('uses the owner’s own thumbnails (720×1280 WebP), never a YouTube image', () => {
    const thumbs = Object.values(PAGE_VIDEOS).map((v) => v.thumb)
    expect(thumbs.slice(0, 3)).toEqual(['/images/video-thumbs/v1.webp', '/images/video-thumbs/v2.webp', '/images/video-thumbs/v3.webp'])
    for (const thumb of thumbs) {
      if (thumb === null) continue
      const file = join(process.cwd(), 'public', thumb)
      expect(existsSync(file), thumb).toBe(true)
      const bytes = readFileSync(file)
      expect(bytes.subarray(0, 4).toString('ascii'), thumb).toBe('RIFF')
      expect(bytes.subarray(8, 12).toString('ascii'), thumb).toBe('WEBP')
    }
    const player = readFileSync(join(process.cwd(), 'src/components/video/PageVideo.tsx'), 'utf8')
    expect(player).not.toMatch(/https:\/\/i\.ytimg\.com/)
  })
})
