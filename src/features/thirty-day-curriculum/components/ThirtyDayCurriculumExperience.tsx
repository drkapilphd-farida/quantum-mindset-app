'use client'

import { useState } from 'react'
import type { AppLang } from '@/lib/app-i18n/languages'
import { practiceContentLang, sameContentLang } from '@/lib/app-i18n/practiceContent'
import { useUiLang } from '@/lib/app-i18n/client'
import { useSearchParams } from 'next/navigation'
import { CurriculumAssessmentCanvas } from './CurriculumAssessmentCanvas'
import { FairReadingTest } from '@/features/fair-reading-test/components/FairReadingTest'
import type { FairResult } from '@/features/fair-reading-test/fairTest'
import { CertificateReadyCard } from '@/features/certificate/components/CertificateReadyCard'
import { LiveClassesProgressLink } from '@/features/live-classes/components/LiveClassesExperience'
import { ReminderOptInPrompt } from '@/features/reminders/components/ReminderOptInPrompt'
import { CurriculumWatermarkOverlay } from './CurriculumWatermarkOverlay'
import { MasterclassPaywallModal } from './MasterclassPaywallModal'
import { FinishPreviousDayModal } from './FinishPreviousDayModal'
import { ThirtyDayCurriculumDayDetail } from './ThirtyDayCurriculumDayDetail'
import { ThirtyDayCurriculumOverview } from './ThirtyDayCurriculumOverview'
import { TOTAL_CURRICULUM_DAYS } from '../curriculumDatabase'
import { curriculumDayAccess, isCurriculumDayUnlocked, loadCurriculumProgress, recordCurriculumCheckpoint, type CurriculumCheckpointResult } from '../curriculumProgress'
import { completeCurriculumDay } from '../actions/completeCurriculumDay'
import { recordCurriculumDayPractice } from '../actions/curriculumDayPractice'
import { getCurriculumDayCompletions } from '../actions/getCurriculumDayCompletions'
import { getNextDayOpensAt } from '../actions/paceActions'

type CurriculumView = 'overview' | 'day-detail' | 'assessment'

function getMostRecentTrueWpm(day: number, contentLang: AppLang): number | null {
  const progress = loadCurriculumProgress()
  // Only an earlier checkpoint read in the same language is comparable.
  const priorCheckpoints = Object.values(progress.checkpoints)
    .filter((checkpoint) => checkpoint.day < day && sameContentLang(checkpoint, { contentLang }))
    .sort((a, b) => b.day - a.day)
  return priorCheckpoints[0]?.trueWpm ?? null
}

function parseValidDay(rawDay: string | null): number | null {
  if (rawDay === null) return null
  const day = Number(rawDay)
  return Number.isInteger(day) && day >= 1 && day <= TOTAL_CURRICULUM_DAYS ? day : null
}

// Root client orchestrator — a single route, client-state-driven view
// machine (Overview <-> Day Detail <-> Assessment) rather than per-day
// dynamic routes, mirroring QuantumJourneySession.tsx's own
// local-`level`-state approach. `refreshKey` forces the Overview to
// re-read localStorage after any mutation (mark-complete or a recorded
// checkpoint) without needing a shared store — the same "bump a key to
// force a re-read" trick this project already uses wherever a sibling
// component owns the write.
//
// In-Page Step-by-Step Master Player™ — this is also the landing point a
// real browser navigation returns to whenever DayMasterPlayer had to hand
// off to one of the 16 server-gated exercises (see
// curriculumGatedExercises.ts): curriculumReturnRouting.ts encodes
// `?view=day&day=N[&dayComplete=1]` into the URL it redirects back to,
// and the initial view state here is derived from those params (read
// once, on mount) so the day view — and, if that gated exercise was the
// playlist's final step, the completion celebration — survives that one
// real page round-trip. Every other, embeddable exercise never leaves
// this route at all; see DayMasterPlayer.tsx.
type ThirtyDayCurriculumExperienceProps = {
  /** Live classes done (x of 7), shown as a small link above the plan. */
  liveClassesDone?: number
  /** Pace control: when the learner's next day opens (null = open now). Resolved on the server. */
  initialNextDayOpensAt?: string | null
  // 30-Day Masterclass Paywall™ — resolved server-side (see this
  // route's page.tsx, hasQuantumSpeedReadingProAccess) and passed down
  // as the one real source of truth every gate in this component tree
  // reads from. Never re-derived client-side.
  isPro: boolean
  // Server-authoritative completion gate (see the "Pre-Launch Audit Fix
  // Pass" task, Phase 4) — a real, RLS-scoped read of
  // `curriculum_day_completions` done once in this route's own page.tsx
  // (getCurriculumDayCompletions), same posture as isPro above: resolved
  // server-side, threaded down, never re-derived from the browser's own
  // localStorage. This — not curriculumProgress.ts's `completedDays` —
  // is what isCurriculumDayUnlocked checks everywhere in this tree.
  initialServerCompletedDays: readonly number[]
  // Anti-Leak Watermark™ — resolved server-side in page.tsx
  // (getCurriculumWatermarkText), same posture as isPro/completedDays
  // above. null means don't render one at all (the excluded owner
  // account) — every other signed-in viewer gets their own email/phone
  // tiled across whichever of the three views below is on screen.
  watermarkText: string | null
}

export function ThirtyDayCurriculumExperience({ isPro, initialServerCompletedDays, watermarkText, liveClassesDone = 0, initialNextDayOpensAt = null }: ThirtyDayCurriculumExperienceProps): React.JSX.Element {
  const searchParams = useSearchParams()
  // Practice text is English until a language gets its own passages; WPM is compared only within one language.
  const contentLang = practiceContentLang(useUiLang(), 'reading')
  const initialDay = searchParams.get('view') === 'day' ? parseValidDay(searchParams.get('day')) : null

  const [progress, setProgress] = useState(() => loadCurriculumProgress())
  const [serverCompletedDays, setServerCompletedDays] = useState<readonly number[]>(initialServerCompletedDays)
  const [nextDayOpensAt, setNextDayOpensAt] = useState<string | null>(initialNextDayOpensAt)
  // Daily reminders: offered once, right after Day 1 is complete.
  const [offerReminders, setOfferReminders] = useState(false)
  // Defense in depth — `?view=day&day=N` is a real, legitimate URL this
  // app itself generates (curriculumReturnRouting.ts, returning from a
  // gated exercise mid-day), but it's also just a URL anyone could type
  // or bookmark. Validating it against the exact same
  // isCurriculumDayUnlocked gate every click already goes through means
  // landing here with an actually-locked day can never skip straight to
  // real content — it resolves to the overview with the paywall already
  // open instead.
  const initialDayIsUnlocked = initialDay !== null && isCurriculumDayUnlocked(initialDay, serverCompletedDays, isPro, initialNextDayOpensAt)

  // Practising a completed day again (see curriculumReturnRouting.ts): only
  // ever for a day the server already counts as completed.
  const initialDayCompleted = initialDay !== null && initialServerCompletedDays.includes(initialDay)
  const initialPracticeCheckpoint = isPro && initialDayIsUnlocked && initialDayCompleted && searchParams.get('practiceCheckpoint') === '1'
  const initialReplay = initialDayIsUnlocked && initialDayCompleted && searchParams.get('replay') === '1'
  const [practiceAssessment, setPracticeAssessment] = useState(initialPracticeCheckpoint)
  const [justPractised, setJustPractised] = useState(initialDayIsUnlocked && initialDayCompleted && searchParams.get('practised') === '1')

  const [view, setView] = useState<CurriculumView>(initialPracticeCheckpoint ? 'assessment' : initialDayIsUnlocked ? 'day-detail' : 'overview')
  const [selectedDay, setSelectedDay] = useState<number | null>(initialDayIsUnlocked ? initialDay : null)
  const [justCompletedDay, setJustCompletedDay] = useState(initialDayIsUnlocked && searchParams.get('dayComplete') === '1')
  // A day that is closed opens the right message: the enroll popup only for
  // a learner without the program; "finish the previous day" for one who has it.
  // `locked` comes from the server redirect when a closed day is opened by URL.
  const lockedParam = Number(searchParams.get('locked'))
  const closedDay = initialDay !== null && !initialDayIsUnlocked ? initialDay : Number.isInteger(lockedParam) && lockedParam >= 1 && lockedParam <= 30 ? lockedParam : null
  const closedAccess = closedDay === null ? 'open' : curriculumDayAccess(closedDay, initialServerCompletedDays, isPro, initialNextDayOpensAt)
  const [paywallDay, setPaywallDay] = useState<number | null>(closedAccess === 'needs_enrolment' ? closedDay : null)
  const [finishPreviousDay, setFinishPreviousDay] = useState<number | null>(closedAccess === 'finish_previous' || closedAccess === 'opens_later' ? closedDay : null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Re-reads both the local optimistic cache (streaks/checkpoints/brain
  // score) AND the server-authoritative completion list — called after
  // returning from a day (DayMasterPlayer's own completeCurriculumDay
  // call has had the full round-trip of that view transition to land by
  // now) so the Overview's day grid reflects reality, not a stale prop
  // from this component's very first mount.
  async function refreshProgress(): Promise<void> {
    setProgress(loadCurriculumProgress())
    setRefreshKey((key) => key + 1)
    const [records, opensAt] = await Promise.all([getCurriculumDayCompletions(), getNextDayOpensAt()])
    setServerCompletedDays(records.map((record) => record.day))
    setNextDayOpensAt(opensAt)
  }

  function handleClosedDay(day: number): void {
    const access = curriculumDayAccess(day, serverCompletedDays, isPro, nextDayOpensAt)
    if (access === 'finish_previous' || access === 'opens_later') setFinishPreviousDay(day)
    else setPaywallDay(day)
  }

  function openProgramOffer(): void {
    setPaywallDay(0)
  }

  // The one real gate every entry into a day's content passes through —
  // DayCell only ever calls this for a day it already knows is
  // unlocked, but this re-checks anyway rather than trusting the caller,
  // the same "never trust the client-side hint alone" discipline this
  // gate itself was built to enforce.
  function handleSelectDay(day: number): void {
    if (!isCurriculumDayUnlocked(day, serverCompletedDays, isPro, nextDayOpensAt)) {
      handleClosedDay(day)
      return
    }
    setSelectedDay(day)
    setJustCompletedDay(false)
    setJustPractised(false)
    setView('day-detail')
  }

  function handleBackToOverview(): void {
    void refreshProgress()
    setView('overview')
    setSelectedDay(null)
    setJustCompletedDay(false)
  }

  function handleLaunchAssessment(day: number, practice: boolean): void {
    setSelectedDay(day)
    setPracticeAssessment(practice)
    setView('assessment')
  }

  // Checkpoint completion is the one write this component tree can
  // await directly (unlike DayMasterPlayer's fire-and-forget
  // completeCurriculumDay call, which a real page navigation follows
  // shortly after) — so the server's own freshly-validated
  // `completedDays` becomes this component's gate state immediately,
  // with no round-trip gap before the learner can move on.
  async function handleAssessmentComplete(measured: CurriculumCheckpointResult): Promise<void> {
    const result: CurriculumCheckpointResult = { contentLang, ...measured }
    if (practiceAssessment) {
      // Practice only: the original checkpoint (Day 1 baseline, official
      // Day 30 result) is never replaced — locally or on the server.
      await recordCurriculumDayPractice({
        day: result.day,
        rawWpm: Math.round(result.rawWpm),
        trueWpm: Math.round(result.trueWpm),
        comprehensionAccuracyPercent: Math.round(result.comprehensionAccuracyPercent),
      })
      setPracticeAssessment(false)
      setJustPractised(true)
      setView('day-detail')
      return
    }
    recordCurriculumCheckpoint(result)
    const outcome = await completeCurriculumDay({
      day: result.day,
      rawWpm: result.rawWpm,
      trueWpm: result.trueWpm,
      comprehensionAccuracyPercent: result.comprehensionAccuracyPercent,
      ...(result.contentLang === 'en' || result.contentLang === 'hi' ? { contentLang: result.contentLang } : {}),
    })
    if (outcome.ok) {
      setServerCompletedDays(outcome.completedDays)
      void getNextDayOpensAt().then(setNextDayOpensAt)
      if (result.day === 1) setOfferReminders(true)
    }
    setProgress(loadCurriculumProgress())
    setRefreshKey((key) => key + 1)
    setView('day-detail')
  }

  // Phase 3: the official check-in (Days 1, 7, 14, 21, 30) is the fair
  // reading test — a matched passage read at the learner's own pace.
  // Practice replays keep the earlier flashed-word check-in.
  function handleFairTestComplete(fair: FairResult): void {
    void handleAssessmentComplete({
      day: selectedDay ?? fair.day ?? 1,
      rawWpm: fair.wpm,
      trueWpm: fair.effectiveWpm,
      comprehensionAccuracyPercent: fair.comprehensionPercent,
      completedAt: fair.createdAt,
      contentLang: fair.lang,
    })
  }

  const fairDay = selectedDay === 1 || selectedDay === 7 || selectedDay === 14 || selectedDay === 21 || selectedDay === 30 ? selectedDay : null
  if (view === 'assessment' && fairDay !== null && !practiceAssessment) {
    return (
      <>
        <FairReadingTest day={fairDay} onComplete={handleFairTestComplete} />
        {watermarkText !== null && <CurriculumWatermarkOverlay text={watermarkText} />}
      </>
    )
  }

  if (view === 'assessment' && selectedDay !== null) {
    return (
      <>
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
          <CurriculumAssessmentCanvas
            day={selectedDay}
            mostRecentTrueWpm={getMostRecentTrueWpm(selectedDay, contentLang)}
            onComplete={handleAssessmentComplete}
            practice={practiceAssessment}
          />
        </div>
        {watermarkText !== null && <CurriculumWatermarkOverlay text={watermarkText} />}
      </>
    )
  }

  if (view === 'day-detail' && selectedDay !== null) {
    return (
      <>
        {selectedDay === TOTAL_CURRICULUM_DAYS && serverCompletedDays.includes(TOTAL_CURRICULUM_DAYS) && <CertificateReadyCard />}
        {offerReminders && selectedDay === 1 && <ReminderOptInPrompt onDone={() => setOfferReminders(false)} />}
        <ThirtyDayCurriculumDayDetail
          day={selectedDay}
          progress={progress}
          justCompletedDay={justCompletedDay}
          completedOnServer={serverCompletedDays.includes(selectedDay)}
          initialReplay={initialReplay && selectedDay === initialDay}
          justPractised={justPractised}
          canPractise={isPro}
          onBack={handleBackToOverview}
          onLaunchAssessment={handleLaunchAssessment}
        />
        {watermarkText !== null && <CurriculumWatermarkOverlay text={watermarkText} />}
      </>
    )
  }

  // 3-Pillar Command Center™ (Phase 6) — this route now lives under the
  // (dashboard) route group, so the Overview (day-list) screen gets the
  // global AppSidebar/Topbar automatically instead of its own LabNavHeader.
  // Day Detail and Assessment stay chrome-free on purpose — both are fully
  // immersive (DayMasterPlayer renders `fixed inset-0`, own back arrow
  // built in; see ThirtyDayCurriculumDayDetail.tsx), the same
  // no-persistent-chrome-during-play convention every other exercise in
  // this app already follows; the fixed overlay covers the sidebar
  // regardless, so there's no conflict during play either.
  return (
    <>
      {serverCompletedDays.includes(TOTAL_CURRICULUM_DAYS) && <CertificateReadyCard />}
      {isPro && <LiveClassesProgressLink classesDone={liveClassesDone} />}
      <ThirtyDayCurriculumOverview
        onSelectDay={handleSelectDay}
        onLockedDayClick={handleClosedDay}
        onStartProgram={openProgramOffer}
        isPro={isPro}
        serverCompletedDays={serverCompletedDays}
        nextDayOpensAt={nextDayOpensAt}
        refreshKey={refreshKey}
      />
      <MasterclassPaywallModal open={paywallDay !== null} onOpenChange={(open) => { if (!open) setPaywallDay(null) }} day={paywallDay === 0 ? null : paywallDay} />
      <FinishPreviousDayModal
        day={finishPreviousDay}
        opensAt={finishPreviousDay !== null && serverCompletedDays.includes(finishPreviousDay - 1) ? nextDayOpensAt : null}
        onOpenChange={(open) => { if (!open) setFinishPreviousDay(null) }}
        onGoToDay={(day) => {
          setFinishPreviousDay(null)
          handleSelectDay(day)
        }}
      />
      {watermarkText !== null && <CurriculumWatermarkOverlay text={watermarkText} />}
    </>
  )
}
