import type { AudioManifest } from './manifest'

// Which source plays a line: the recorded MP3 when the manifest lists it,
// else the device's own voice, else a timed caption. A recorded line that
// fails or doesn't start within MP3_START_TIMEOUT_MS falls back at play time.

export type NarrationSource = 'mp3' | 'voice' | 'caption'

export const MP3_START_TIMEOUT_MS = 4000
const WORDS_PER_MINUTE = 120
const MIN_LINE_MS = 1800

export function chooseSource(manifest: AudioManifest | null, lineId: string, deviceHasVoice: boolean): NarrationSource {
  if (manifest?.lines[lineId]) return 'mp3'
  return deviceHasVoice ? 'voice' : 'caption'
}

/** How long a line takes: the recording's real length when known, else an estimate at a calm pace (pauses at "..."). */
export function lineDurationMs(text: string, manifest: AudioManifest | null, lineId: string): number {
  const recorded = manifest?.lines[lineId]?.durationMs
  if (typeof recorded === 'number' && recorded > 0) return recorded
  const words = text.replace(/\.\.\./g, ' ').trim().split(/\s+/).filter(Boolean).length
  const pauses = (text.match(/\.\.\./g) ?? []).length
  return Math.max(MIN_LINE_MS, Math.round((words / WORDS_PER_MINUTE) * 60_000) + pauses * 900)
}

/** The text spoken by the device voice: "..." pauses become commas the engine respects. */
export function speakableText(text: string): string {
  return text.replace(/\s*\.\.\.\s*/g, ', ').replace(/,\s*,/g, ',').trim()
}
