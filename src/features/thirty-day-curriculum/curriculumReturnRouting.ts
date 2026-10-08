// Smart Exit & Auto-Advance™ — the single function every "back to the
// lab index" call site across the exercise catalog gets wrapped with, so
// an exercise opened as part of an active Daily Session Playlist returns
// the learner to the curriculum (and advances the playlist) instead of
// dumping them at the generic lab root. Every wrapped call site falls
// back to its ORIGINAL, unchanged destination whenever there is no
// active session, or the active session's current exercise isn't this
// one (e.g. the learner opened this exercise directly, outside the
// curriculum) — zero behavior change for non-curriculum usage.
//
// Two variants, because the shared engines this wraps distinguish two
// real cases:
//   - "smart exit" — an early abandon (Escape key, explicit mid-exercise
//     Exit button) — ends the whole playlist rather than silently
//     crediting a skipped exercise as done.
//   - "smart complete" — the natural "you're finished, back to lab"
//     action — advances the playlist to the next exercise, or, on the
//     final exercise, marks the day complete and returns to the day
//     view with a celebration flag.
// A number of simpler exercise engines collapse both cases into one
// button/call site; those are wrapped with the "complete" variant, since
// that call site is only reachable after the exercise's own completion
// screen renders (never a genuine mid-session cancel) — see each batch
// edit's own file for the specific reasoning.
import { advanceCurriculumSession, clearActiveCurriculumSession, isSessionOnFinalExercise, loadActiveCurriculumSession } from './curriculumSessionRunner'
import { isCheckpointDay } from './curriculumDatabase'
import { recordCurriculumDayPractice } from './actions/curriculumDayPractice'
import { recordStepDone } from './actions/paceActions'

const CURRICULUM_ROUTE = '/labs/sharp-brain/thirty-day-curriculum'

type DayReturnFlags = { dayComplete?: boolean; replay?: boolean; practised?: boolean; practiceCheckpoint?: boolean }

function buildDayReturnUrl(day: number, flags: DayReturnFlags = {}): string {
  const params = new URLSearchParams({ view: 'day', day: String(day) })
  if (flags.dayComplete === true) params.set('dayComplete', '1')
  if (flags.replay === true) params.set('replay', '1')
  if (flags.practised === true) params.set('practised', '1')
  if (flags.practiceCheckpoint === true) params.set('practiceCheckpoint', '1')
  return `${CURRICULUM_ROUTE}?${params.toString()}`
}

function isThisExerciseTheActiveSessionStep(exerciseId: string): boolean {
  const session = loadActiveCurriculumSession()
  if (session === null) return false
  return session.exerciseIds[session.currentIndex] === exerciseId
}

// In-Page Master Player™ — a lightweight, module-scoped (not
// sessionStorage) flag DayMasterPlayer sets while it's actively hosting a
// day in-page, so that even an EMBEDDED exercise's own internal Escape/
// Exit affordance (never itself made curriculum-aware — the wizard's own
// always-visible "Exit to Roadmap" control is the intended way out)
// still lands back on the right day view instead of the lab root, if a
// learner finds and uses it anyway. Deliberately NOT sessionStorage: it
// only needs to survive for the current mount, and — critically — must
// NOT be confused with the real, persisted ActiveCurriculumSession, which
// DayMasterPlayer deliberately avoids touching while playing embeddable
// steps (see that file's own doc comment for why: keeping a matching
// session alive would make every embeddable exercise's own internal
// "isActiveStep" check fire and hijack completion into a real page
// navigation instead of the wizard's in-page advance).
let activeWizardDay: number | null = null

export function setActiveWizardDay(day: number | null): void {
  activeWizardDay = day
}

// Pure, side-effect-free — safe to call at render time (e.g. to decide
// whether to show a "Continue Session" button at all). Both
// `getCurriculumSmart*Href` functions below MUTATE session storage as
// they compute their result, so neither is safe to bind directly into a
// passive prop (like a `<Link href={...}>`) that could be re-evaluated on
// every render — they must only ever be called imperatively, inside a
// real click/keydown handler, exactly once per actual navigation.
export function isCurriculumSessionCurrentExercise(exerciseId: string): boolean {
  return isThisExerciseTheActiveSessionStep(exerciseId)
}

// Pure, side-effect-free (unlike getCurriculumSmartExitHref/CompleteHref,
// which both mutate) — this is specifically for the OTHER, previously
// unfixed source of "dumped to the lab root": nearly every shared
// completion screen in this app (ReadingSessionCompleteScreen,
// RuntimeResultScreen, the per-exercise `*CompleteScreen` family,
// ExerciseCompletionScreen) renders an unconditional, always-visible
// "Back to Lab" link from a static `backHref`/`labHref` prop, entirely
// separate from the onComplete/onNext seam used for auto-advance. That
// static link was never wired to curriculum context at all, so clicking
// it — a completely reasonable thing for a learner to do once they see
// their result — bypassed the wizard/gated hand-off return path and went
// straight to the real lab root regardless of how the exercise was
// reached. Safe to bind directly to any passive href prop, in both the
// in-page wizard (`activeWizardDay`) and the real-navigation hand-off to
// a gated exercise (the persisted session) cases — falls back to
// `fallbackHref` unchanged outside both.
export function getWizardAwareBackHref(exerciseId: string, fallbackHref: string): string {
  if (activeWizardDay !== null) return buildDayReturnUrl(activeWizardDay)
  const session = loadActiveCurriculumSession()
  if (session !== null && session.exerciseIds[session.currentIndex] === exerciseId) {
    return buildDayReturnUrl(session.day)
  }
  return fallbackHref
}

// Early abandon — ends the playlist (no credit, no advance) and returns
// to the day view. Falls back to `fallbackHref` unchanged outside an
// active matching session.
export function getCurriculumSmartExitHref(exerciseId: string, fallbackHref: string): string {
  if (activeWizardDay !== null) return buildDayReturnUrl(activeWizardDay)

  const session = loadActiveCurriculumSession()
  if (session === null || session.exerciseIds[session.currentIndex] !== exerciseId) return fallbackHref
  const { day } = session
  clearActiveCurriculumSession()
  return buildDayReturnUrl(day)
}

// Natural completion — this is only ever reached by one of the 16
// server-gated exercises (Pro/sequential-unlock — see
// curriculumGatedExercises.ts) that DayMasterPlayer.tsx had to hand off
// to via a real navigation; every embeddable exercise gets its
// `onComplete` wired directly by the wizard instead (in-page, no href
// involved at all — see that file's own doc comment). On a non-final
// step this ALWAYS returns to the day view (never chains straight to the
// next exercise's own page, even if that exercise also happens to be
// gated) — DayMasterPlayer reads the already-advanced session on its next
// mount and decides in-page whether to render the following step inline
// or hand off again, so the learner is never bounced silently from one
// standalone page straight into another. Falls back to `fallbackHref`
// unchanged outside an active matching session.
export function getCurriculumSmartCompleteHref(exerciseId: string, fallbackHref: string): string {
  if (!isThisExerciseTheActiveSessionStep(exerciseId)) return fallbackHref

  const session = loadActiveCurriculumSession()
  if (session === null) return fallbackHref
  const { day } = session

  const replay = session.replay === true

  // Pace control (Phase 3, item 4): a real (non-replay) step is recorded as
  // finished on the server, and the learner always returns to the day view.
  // DayMasterPlayer then works out what is left from the server — the next
  // step, or finishing the day with its pace checks. The day is never
  // completed from here.
  if (!replay) {
    rememberStepDone(day, exerciseId)
    void recordStepDone({ day, exerciseId })
    clearActiveCurriculumSession()
    return buildDayReturnUrl(day)
  }

  if (!isSessionOnFinalExercise(session)) {
    advanceCurriculumSession()
    return buildDayReturnUrl(day, { replay })
  }

  // Final exercise of a replay: saved as practice only; never marks the day
  // complete again or changes its original result.
  clearActiveCurriculumSession()
  if (isCheckpointDay(day)) return buildDayReturnUrl(day, { practiceCheckpoint: true })
  void recordCurriculumDayPractice({ day })
  return buildDayReturnUrl(day, { practised: true })
}

const PENDING_STEPS_KEY = 'qsr-curriculum-steps-done'

/** Steps finished on an exercise's own page, kept until the day view has re-sent them (the first save may still be in flight). */
function rememberStepDone(day: number, exerciseId: string): void {
  try {
    const all = JSON.parse(sessionStorage.getItem(PENDING_STEPS_KEY) ?? '{}') as Record<string, string[]>
    const list = new Set(all[day] ?? [])
    list.add(exerciseId)
    all[day] = [...list]
    sessionStorage.setItem(PENDING_STEPS_KEY, JSON.stringify(all))
  } catch {
    // Storage unavailable: the server save above still records the step.
  }
}

/** Takes (and clears) the steps finished on their own pages for a day. */
export function takePendingStepsDone(day: number): string[] {
  try {
    const all = JSON.parse(sessionStorage.getItem(PENDING_STEPS_KEY) ?? '{}') as Record<string, string[]>
    const list = all[day] ?? []
    delete all[day]
    sessionStorage.setItem(PENDING_STEPS_KEY, JSON.stringify(all))
    return list
  } catch {
    return []
  }
}
