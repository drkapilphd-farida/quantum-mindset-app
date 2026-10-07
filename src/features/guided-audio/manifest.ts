import type { AppLang } from '@/lib/app-i18n/languages'

// Recorded guided-voice audio lives in the public Supabase Storage bucket
// "guided-audio" at <exercise>/<lang>/<lineId>.mp3, with one manifest.json
// per language (written by scripts/guided-audio/prepare.mjs).

export type AudioManifest = {
  exercise: string
  lang: string
  voice: string
  review: string
  lines: Record<string, { file: string; durationMs: number }>
}

export function guidedAudioBaseUrl(exercise: string, lang: AppLang): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')
  return `${base}/storage/v1/object/public/guided-audio/${exercise}/${lang}`
}

export function isAudioManifest(value: unknown): value is AudioManifest {
  if (typeof value !== 'object' || value === null) return false
  const lines = (value as { lines?: unknown }).lines
  if (typeof lines !== 'object' || lines === null) return false
  return Object.values(lines).every(
    (l) => typeof l === 'object' && l !== null && typeof (l as { file?: unknown }).file === 'string' && typeof (l as { durationMs?: unknown }).durationMs === 'number',
  )
}

const cache = new Map<string, Promise<AudioManifest | null>>()

/** The language's manifest, or null when it's missing or unreadable (the narration then uses the device voice). */
export function loadAudioManifest(exercise: string, lang: AppLang): Promise<AudioManifest | null> {
  const key = `${exercise}/${lang}`
  const hit = cache.get(key)
  if (hit) return hit
  const promise = fetch(`${guidedAudioBaseUrl(exercise, lang)}/manifest.json`, { cache: 'default' })
    .then((r) => (r.ok ? r.json() : null))
    .then((json: unknown) => (isAudioManifest(json) ? json : null))
    .catch(() => null)
  cache.set(key, promise)
  return promise
}
