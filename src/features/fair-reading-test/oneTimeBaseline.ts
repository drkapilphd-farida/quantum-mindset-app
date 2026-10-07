// The one-time fair baseline for learners who started the 30-day plan before
// the fair reading test existed: offered at the start of their next day, with
// one "Tomorrow" postponement (remembered on this device).

const POSTPONED_KEY = 'qsr-fair-baseline-postponed-on'

function today(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export type BaselinePrompt = 'hidden' | 'offer-with-tomorrow' | 'offer'

/** What to show, given the date the learner postponed on (null = never). */
export function baselinePrompt(postponedOn: string | null, now: Date = new Date()): BaselinePrompt {
  if (postponedOn === null) return 'offer-with-tomorrow'
  return postponedOn === today(now) ? 'hidden' : 'offer'
}

export function loadPostponedOn(): string | null {
  try {
    return window.localStorage.getItem(POSTPONED_KEY)
  } catch {
    return null
  }
}

export function postponeBaseline(now: Date = new Date()): void {
  try {
    window.localStorage.setItem(POSTPONED_KEY, today(now))
  } catch {
    // Storage blocked: the learner simply sees the offer again next time.
  }
}
