import type { ProgramSlug } from './types'

// Image slots (owner's images brief, Nov 2026). The owner drops the files into
// public/images/personal-sessions/:
//   hero-<program-slug>.jpg  (16:9) — program hero, reused as the 4:3 hub-card thumbnail
//   me-recording.jpg         — "What you get", next to the highlight box
// next.config.ts lists the files present at build time; a slot without its
// file is not rendered at all.

export const IMAGE_FOLDER = '/images/personal-sessions'

const PRESENT = new Set((process.env.NEXT_PUBLIC_PERSONAL_SESSION_IMAGES ?? '').split(',').filter((file) => file !== ''))

const ifPresent = (file: string): string | null => (PRESENT.has(file) ? `${IMAGE_FOLDER}/${file}` : null)

export function programHeroImage(slug: ProgramSlug): string | null {
  return ifPresent(`hero-${slug}.jpg`)
}

export function meRecordingImage(): string | null {
  return ifPresent('me-recording.jpg')
}
