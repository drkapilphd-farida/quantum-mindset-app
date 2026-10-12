// The optional starting memory check for learners on Days 2–7 who began
// before it existed: offered at the start of their day; "Later" hides it for
// the rest of that day (remembered on this device).

const LATER_KEY = 'qsr-memory-baseline-later-on'

function today(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function laterToday(now: Date = new Date()): boolean {
  try {
    return window.localStorage.getItem(LATER_KEY) === today(now)
  } catch {
    return false
  }
}

export function saveLater(now: Date = new Date()): void {
  try {
    window.localStorage.setItem(LATER_KEY, today(now))
  } catch {
    // Storage blocked: the learner simply sees the offer again next time.
  }
}
