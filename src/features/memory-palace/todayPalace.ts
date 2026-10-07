// The palace built in today's 30-day-plan session, kept in this browser tab
// so the day's player can ask the end-of-session recall after the day's
// other exercises. Next-day recall uses the server copy instead.

export type TodayPalace = { palaceId: string; objects: string[]; level: number; day: number; createdAt: number }

const KEY = 'mum-palace-today'
const MAX_AGE_MS = 6 * 3_600_000

export function saveTodayPalace(palace: TodayPalace): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(palace))
  } catch {
    // Storage blocked: the end-of-session recall is simply skipped.
  }
}

/** Today's palace for this day, if it was built in this tab within the last few hours. */
export function loadTodayPalace(day: number, now: number = Date.now()): TodayPalace | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as TodayPalace
    if (p.day !== day || typeof p.createdAt !== 'number' || now - p.createdAt > MAX_AGE_MS || !Array.isArray(p.objects)) return null
    return p
  } catch {
    return null
  }
}

export function clearTodayPalace(): void {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // Nothing to clear.
  }
}

const LAST_KEY = 'mum-palace-last-objects'

/** The previous palace's objects, so the next palace avoids them. */
export function loadLastObjects(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(LAST_KEY) ?? '[]') as unknown
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function saveLastObjects(objects: readonly string[]): void {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(objects))
  } catch {
    // Not remembered: the next palace may repeat an object.
  }
}
