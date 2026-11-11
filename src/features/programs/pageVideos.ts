import type { PageVideoKey } from '@/config/site.config'
import type { ProgramSlug } from './types'

// Which page video each program page shows (owner, Nov 2026). The IDs are in
// site.config.ts (PAGE_VIDEOS). Pages not listed show no page video and keep
// their hero as before (Mindset After a Business Loss, Manifestation).
export const PROGRAM_PAGE_VIDEOS: Partial<Record<ProgramSlug, PageVideoKey>> = {
  'stress-anxiety-support': 'stress',
  'mindset-coaching': 'mindset',
  'subconscious-reprogramming': 'mindset',
  'heart-brain-coherence': 'mindset',
  'intuition-for-traders': 'trader',
  telepathy: 'kriyaYoga',
  'aura-reading': 'kriyaYoga',
  'chakra-activation': 'kriyaYoga',
  'cosmic-fusion': 'kriyaYoga',
  'kundalini-meditation': 'kriyaYoga',
  'samadhi-meditation': 'kriyaYoga',
  'astral-projection': 'kriyaYoga',
  'personal-retreat': 'kriyaYoga',
}
