import type { ExerciseSequenceItem } from '@/lib/exercises/sequence'

// The locked Eye Foundation Module sequence (see docs/QUANTUM_SPEED_READING_CURRICULUM.md).
// Single source of truth for order, copy, and routing — the landing page and
// the progress system both read from this instead of each hardcoding the list.
export const EYE_FOUNDATION_MODULE: readonly ExerciseSequenceItem[] = [
  {
    exerciseId: 'eye-warm-up',
    title: 'Eye Warm-up',
    summary: 'Loosen up your eyes with easy, continuous motion before anything else.',
    href: '/labs/sharp-brain/eye-warm-up',
  },
  {
    exerciseId: 'eye-stretch',
    title: 'Eye Stretch',
    summary: 'Gently extend how far your eyes can comfortably move.',
    href: '/labs/sharp-brain/eye-stretch',
  },
  {
    exerciseId: 'eye-span',
    title: 'Eye Span',
    summary: 'Notice more at once, without moving your eyes.',
    href: '/labs/sharp-brain/eye-span',
  },
  {
    exerciseId: 'regression-control',
    title: 'Regression Control',
    summary: 'Practice moving steadily forward, without looking back.',
    href: '/labs/sharp-brain/regression-control',
  },
  {
    exerciseId: 'reading-speed',
    title: 'Reading Speed',
    summary: 'Build a smooth, comfortable reading rhythm with real text.',
    href: '/labs/sharp-brain/reading-speed',
  },
  {
    exerciseId: 'rsvp',
    title: 'RSVP',
    summary: 'Recognize single words at a fixed point, without moving your eyes.',
    href: '/labs/sharp-brain/rsvp',
  },
] as const
