'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { dayTitle, categoryLabel, exerciseTitle } from '@/lib/app-i18n/curriculumText'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import { useRouter } from 'next/navigation'
import { ArrowRight, Clock, PartyPopper, Sparkles, Undo2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurriculumExerciseById, type CurriculumCatalogExercise } from '../curriculumExerciseCatalog'
import { buildCurriculumDayPlan, isCheckpointDay } from '../curriculumDatabase'
import { buildSessionQueue, clearActiveCurriculumSession, loadActiveCurriculumSession, startCurriculumSessionAtStep } from '../curriculumSessionRunner'
import { setActiveWizardDay, takePendingStepsDone } from '../curriculumReturnRouting'
import { isCurriculumExerciseGated } from '../curriculumGatedExercises'
import { getEmbeddableComponent } from '../curriculumExerciseComponentRegistry'
import { markCurriculumDayComplete } from '../curriculumProgress'
import { completeCurriculumDay, type CompleteCurriculumDayResult } from '../actions/completeCurriculumDay'
import { getDayPace, recordStepDone, type DayPace } from '../actions/paceActions'
import { AUDIO_GUIDED_STEPS, doLater, formatPracticeTime, nextIstMidnight, PACE_REQUIRED_SECONDS } from '../paceControl'
import { usePracticeHeartbeat } from '../usePracticeHeartbeat'
import { recordCurriculumDayPractice } from '../actions/curriculumDayPractice'
import { CurriculumDayProvider, EmbeddedExerciseProvider } from '../embeddedExerciseContext'
import { EyeRelaxationBreak } from './EyeRelaxationBreak'
import { useImmersiveExerciseLock } from '@/hooks/exercises/useImmersiveExerciseLock'
import { PalaceRecallStep } from '@/features/memory-palace/components/PalaceRecallStep'
import { getPendingPalace, type PendingPalace } from '@/features/memory-palace/actions/palaceActions'
import { clearTodayPalace, loadTodayPalace, type TodayPalace } from '@/features/memory-palace/todayPalace'
import { FairReadingTest } from '@/features/fair-reading-test/components/FairReadingTest'
import { getFairResults } from '@/features/fair-reading-test/actions'
import { needsOneTimeBaseline } from '@/features/fair-reading-test/fairTest'
import { baselinePrompt, loadPostponedOn, postponeBaseline, type BaselinePrompt } from '@/features/fair-reading-test/oneTimeBaseline'

const CARD_CLASS_NAME = 'relative overflow-hidden rounded-3xl border-2 border-border/60 bg-[#FBF9F4]/95 shadow-sm backdrop-blur-md dark:bg-[#16171A]/95'

type WizardMode = 'playing' | 'celebrating' | 'ready-for-checkpoint' | 'finishing' | 'more-practice' | 'extra-practice' | 'finish-error'

type DayMasterPlayerProps = {
  day: number
  onExitToRoadmap: () => void
  onDayComplete: () => void
  onReadyForCheckpoint: () => void
  /** Practising a completed day again: saved as practice, never as the day's completion. */
  isReplay?: boolean
}

// In-Page Step-by-Step Master Player™ — the guided wizard that replaced
// DaySessionRunner's old "navigate away to a real page for every
// exercise" flow. Every embeddable exercise (41 of the 57 catalog items —
// see curriculumGatedExercises.ts for the 16 that CAN'T be, because their
// own page.tsx runs a real Pro/sequential-unlock check this component
// must never bypass) is rendered directly, in-page, from
// curriculumExerciseComponentRegistry.tsx, advanced via plain React state
// (`stepIndex`) — no navigation, no sessionStorage, completely
// conflict-free with each component's own internal curriculum-session
// hook (which stays inert here since this wizard deliberately never
// populates that session while playing embeddable steps — see
// useCurriculumSessionCompletion.ts's own doc comment for why keeping
// both mechanisms active at once would fight each other).
//
// A gated step instead shows a clear hand-off card and does one real
// navigation to that exercise's own route — startCurriculumSessionAtStep
// seeds sessionStorage pointing at exactly that step first, so the
// exercise's own already-working smart exit/complete wiring (built for
// the previous, all-navigation version of this feature and left
// unchanged) correctly returns here afterward. On remount this component
// reads that resume point once, then immediately clears it and goes back
// to driving everything itself — sessionStorage is only ever a
// hand-off baton across a real navigation, never the source of truth
// while this component is playing.
//
// The header's "Skip Exercise" control reuses handleStepComplete
// directly — a skip and a real completion advance the wizard identically
// (including correctly triggering finishDay() if skipping happens to be
// the final step), the only difference is which UI element triggered it.
export function DayMasterPlayer({ day, onExitToRoadmap, onDayComplete, onReadyForCheckpoint, isReplay = false }: DayMasterPlayerProps): React.JSX.Element {
  const t = useAppT()
  const router = useRouter()
  const plan = useMemo(() => buildCurriculumDayPlan(day), [day])
  const queueIds = useMemo(() => buildSessionQueue(plan.exercises), [plan])
  const dayInfo = useMemo(() => ({ day, isReplay }), [day, isReplay])

  // Pace control (Phase 3, item 4): the steps still to do today, in play
  // order (indices into queueIds) — from the server's record of finished
  // steps, so a learner resumes where they stopped. "Do this later" moves
  // the current step to the end. null while loading.
  const [order, setOrder] = useState<number[] | null>(null)
  const stepIndex = order === null ? null : (order[0] ?? -1)
  const [doneIds, setDoneIds] = useState<ReadonlySet<string>>(new Set())
  const [pace, setPace] = useState<DayPace | null>(null)
  const [nextOpensAt, setNextOpensAt] = useState<string | null>(null)
  const [extraIndex, setExtraIndex] = useState<number | null>(null)
  const lastStepSave = useRef<Promise<unknown>>(Promise.resolve())
  const htmlLang = LANGUAGES[useUiLang()].htmlLang
  const [mode, setMode] = useState<WizardMode>('playing')
  // The optional eye break is offered once before each reading step.
  const [eyeBreakDoneFor, setEyeBreakDoneFor] = useState<number | null>(null)
  // Memory Palace: yesterday's palace is recalled before the day's first step
  // (whatever the day), and today's palace after the day's last step.
  const [pendingPalace, setPendingPalace] = useState<PendingPalace | null>(null)
  const [sameDayPalace, setSameDayPalace] = useState<TodayPalace | null>(null)
  // Phase 3: learners who began before the fair reading test take a one-time
  // fair baseline at the start of their next day (one "Tomorrow" allowed).
  const [fairBaseline, setFairBaseline] = useState<BaselinePrompt>('hidden')

  // True Full-Screen Viewport Lock™ — only while 'playing' (the fixed
  // inset-0 mode below); 'celebrating'/'ready-for-checkpoint' render as
  // normal in-flow cards, not full-screen, so locking body there would
  // be inconsistent with what's actually on screen. Each embedded
  // exercise's own ReadingLayout/ExercisePracticeLayout defers its own
  // lock to this one (see their `useImmersiveExerciseLock(!isEmbedded)`
  // calls) rather than re-locking on every step's mount.
  useImmersiveExerciseLock(mode === 'playing')

  // Resolve what's left of the day once. A replay plays every step (resuming
  // where a gated hand-off left off). A real day asks the server which steps
  // are already finished — including any finished on an exercise's own page.
  useEffect(() => {
    let cancelled = false
    const all = queueIds.map((_, index) => index)
    const session = loadActiveCurriculumSession()
    const resumingHandoff = session !== null && session.day === day
    if (resumingHandoff) clearActiveCurriculumSession()
    const startFresh = (): void => {
      void getPendingPalace()
        .catch(() => null)
        .then((p) => !cancelled && setPendingPalace(p))
      if (!isReplay && day > 1) {
        void getFairResults()
          .then((results) => (!cancelled && needsOneTimeBaseline([1], results) ? setFairBaseline(baselinePrompt(loadPostponedOn())) : undefined))
          .catch(() => undefined)
      }
    }
    setMode('playing')
    if (isReplay) {
      if (resumingHandoff) {
        const resumeAt = Math.min(session.currentIndex, queueIds.length - 1)
        setEyeBreakDoneFor(resumeAt)
        setOrder(all.slice(resumeAt))
      } else {
        setOrder(all)
        startFresh()
      }
      return () => {
        cancelled = true
      }
    }
    void (async () => {
      const pending = takePendingStepsDone(day)
      for (const exerciseId of pending) await recordStepDone({ day, exerciseId }).catch(() => undefined)
      const current = await getDayPace({ day }).catch((): DayPace => ({ activeSeconds: 0, stepsDone: [], paceOff: false }))
      if (cancelled) return
      const done = new Set([...current.stepsDone, ...pending])
      const remaining = all.filter((index) => !done.has(queueIds[index]!))
      setPace(current)
      setDoneIds(done)
      if (remaining.length === all.length) startFresh()
      else if (remaining[0] !== undefined) setEyeBreakDoneFor(remaining[0])
      setOrder(remaining)
      if (remaining.length === 0) void finishDay(current)
    })()
    return () => {
      cancelled = true
    }
    // finishDay reads only stable props here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, isReplay, queueIds])

  const currentId = stepIndex !== null && stepIndex >= 0 ? queueIds[stepIndex] : undefined
  const practiceSeconds = usePracticeHeartbeat(
    day,
    !isReplay && order !== null && mode !== 'celebrating' && mode !== 'finishing',
    (currentId !== undefined && AUDIO_GUIDED_STEPS.has(currentId)) || pendingPalace !== null || sameDayPalace !== null,
    pace?.activeSeconds ?? 0,
  )
  const enoughPractice = pace?.paceOff === true || practiceSeconds >= PACE_REQUIRED_SECONDS

  // See this component's own doc comment — makes even an embedded
  // exercise's own internal Exit/Escape affordance land back on this
  // day's view instead of the lab root, as a safety net behind the
  // wizard's own always-visible Exit control below.
  useEffect(() => {
    setActiveWizardDay(day)
    return () => setActiveWizardDay(null)
  }, [day])

  function handleCompletion(res: CompleteCurriculumDayResult): void {
    if (res.ok) {
      markCurriculumDayComplete(day)
      // Clears pre-loaded pages, so the dashboard and plan show today as done.
      router.refresh()
      setNextOpensAt(res.paced && day < 30 ? nextIstMidnight(new Date().toISOString()) : null)
      setMode('celebrating')
      return
    }
    if (res.reason === 'needs_more_practice') return setMode('more-practice')
    if (res.reason === 'steps_incomplete') {
      setOrder(res.missing.map((id) => queueIds.indexOf(id)).filter((index) => index >= 0))
      return setMode('playing')
    }
    setMode('finish-error')
  }

  async function finishDay(currentPace: DayPace | null = pace): Promise<void> {
    if (isCheckpointDay(day)) {
      setMode('ready-for-checkpoint')
      return
    }
    if (isReplay) {
      // A replay is practice only — the original completion stays as it was.
      void recordCurriculumDayPractice({ day })
      setMode('celebrating')
      return
    }
    void currentPace
    setMode('finishing')
    await lastStepSave.current.catch(() => undefined)
    handleCompletion(await completeCurriculumDay({ day }))
  }

  // A step really finished (an embedded exercise's own onComplete). The
  // server records it; the next step, or the end of the day, follows.
  function handleStepComplete(): void {
    if (mode === 'extra-practice') {
      setExtraIndex(null)
      setMode(isCheckpointDay(day) ? 'ready-for-checkpoint' : 'more-practice')
      return
    }
    if (order === null || order.length === 0) return
    const [index, ...rest] = order
    const id = queueIds[index!]
    if (!isReplay && id !== undefined) {
      lastStepSave.current = recordStepDone({ day, exerciseId: id })
      setDoneIds((prev) => new Set(prev).add(id))
    }
    setOrder(rest)
    if (rest.length === 0) {
      const todayPalace = queueIds.includes('memory-palace') ? loadTodayPalace(day) : null
      if (todayPalace !== null) setSameDayPalace(todayPalace)
      else void finishDay()
    }
  }

  /** "Do this later": the current step moves to the end of what's left. */
  function handleDoLater(): void {
    setOrder((current) => (current === null ? current : doLater(current)))
  }

  /** Practising one of today's exercises again to add practice time. */
  function handlePractiseAgain(index: number): void {
    setExtraIndex(index)
    setMode('extra-practice')
  }

  function handleExitWizard(): void {
    clearActiveCurriculumSession()
    onExitToRoadmap()
  }

  function handleGatedHandoff(exercise: CurriculumCatalogExercise, index: number): void {
    startCurriculumSessionAtStep(day, index, isReplay)
    router.push(exercise.href)
  }

  if (order === null || mode === 'finishing') {
    return <div className={`${CARD_CLASS_NAME} flex min-h-[40vh] items-center justify-center p-6 text-sm text-muted-foreground`}>{t('curriculum.player.loading')}</div>
  }

  if (fairBaseline !== 'hidden') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-background" data-day-master-player={day} data-fair-baseline="one-time">
        <FairReadingTest
          day={null}
          onComplete={() => setFairBaseline('hidden')}
          {...(fairBaseline === 'offer-with-tomorrow'
            ? {
                onPostpone: () => {
                  postponeBaseline()
                  setFairBaseline('hidden')
                },
              }
            : {})}
        />
      </div>
    )
  }

  if (pendingPalace !== null || sameDayPalace !== null) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-background" data-day-master-player={day} data-palace-step={pendingPalace !== null ? 'next-day' : 'same-day'}>
        <CurriculumDayProvider value={dayInfo}>
        {pendingPalace !== null ? (
          <PalaceRecallStep
            palace={pendingPalace}
            phase="next-day"
            delay={{ label: pendingPalace.label, days: pendingPalace.days, hoursSince: pendingPalace.hoursSince }}
            onDone={() => setPendingPalace(null)}
            onNotNow={() => setPendingPalace(null)}
          />
        ) : (
          <PalaceRecallStep
            palace={sameDayPalace!}
            phase="same-day"
            onDone={() => {
              clearTodayPalace()
              setSameDayPalace(null)
              finishDay()
            }}
          />
        )}
        </CurriculumDayProvider>
      </div>
    )
  }

  if (mode === 'celebrating') {
    return (
      <div className={`${CARD_CLASS_NAME} flex flex-col items-center gap-4 p-8 text-center sm:p-12`}>
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-emerald-500/15 blur-3xl" aria-hidden="true" />
        <div className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-500">
          <PartyPopper className="size-8" aria-hidden="true" />
        </div>
        <div className="relative">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            {isReplay ? t('curriculum.practice.complete') : t('curriculum.player.dayCompleteEyebrow', { day })}
          </p>
          {!isReplay && nextOpensAt !== null ? (
            <>
              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t('curriculum.pace.opensTomorrow', { day: day + 1 })}</h2>
              <p className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-sm text-foreground" data-next-day-opens={nextOpensAt}>
                <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
                {t('curriculum.pace.opensAt', { time: formatOpenTime(nextOpensAt, htmlLang), date: formatOpenDate(nextOpensAt, htmlLang) })}
              </p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t('curriculum.pace.nothingLost')}</p>
            </>
          ) : (
            <>
              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t('curriculum.player.dayDone', { title: dayTitle(t, day) })}</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {isReplay ? t('curriculum.practice.saved', { day }) : t('curriculum.player.allExercisesDone', { count: queueIds.length, next: day + 1 })}
              </p>
            </>
          )}
        </div>
        <Button onClick={onDayComplete} size="lg" className="relative rounded-full" data-continue-to-roadmap="true">
          {t('curriculum.player.backToRoadmap')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    )
  }

  if (mode === 'ready-for-checkpoint') {
    return (
      <div className={`${CARD_CLASS_NAME} flex flex-col items-center gap-4 p-8 text-center sm:p-12`}>
        <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-500">
          <Sparkles className="size-8" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('curriculum.player.oneMoreStep')}</p>
          <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t('curriculum.player.niceWork')}</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {isReplay ? t('curriculum.practice.checkpointIntro', { day }) : enoughPractice ? t('curriculum.player.checkpointIntro', { day }) : t('curriculum.pace.checkinWait')}
          </p>
        </div>
        {!isReplay && !enoughPractice && <PracticeMeter seconds={practiceSeconds} label={t('curriculum.pace.practiceTime')} />}
        <Button onClick={onReadyForCheckpoint} size="lg" className="rounded-full" disabled={!isReplay && !enoughPractice} data-start-checkpoint="true">
          {t('curriculum.player.startCheckIn')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        {!isReplay && !enoughPractice && <PractiseAgainList queueIds={queueIds} onPick={handlePractiseAgain} label={t('curriculum.pace.practiseAgain')} />}
      </div>
    )
  }

  if (mode === 'more-practice') {
    return (
      <div className={`${CARD_CLASS_NAME} flex flex-col items-center gap-4 p-6 text-center sm:p-10`} data-pace-more-practice={practiceSeconds}>
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">{enoughPractice ? t('curriculum.pace.readyEyebrow') : t('curriculum.pace.almostThere')}</p>
          <h2 className="mt-1 font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">{enoughPractice ? t('curriculum.pace.ready') : t('curriculum.pace.fewMore')}</h2>
        </div>
        <PracticeMeter seconds={practiceSeconds} label={t('curriculum.pace.practiceTime')} done={enoughPractice} />
        {!enoughPractice && <PractiseAgainList queueIds={queueIds} onPick={handlePractiseAgain} label={t('curriculum.pace.practiseAgain')} />}
        <Button onClick={() => void finishDay()} size="lg" className="w-full max-w-xs rounded-full" disabled={!enoughPractice} data-pace-complete="true">
          {t('curriculum.pace.complete', { day })}
        </Button>
      </div>
    )
  }

  if (mode === 'finish-error') {
    return (
      <div className={`${CARD_CLASS_NAME} flex flex-col items-center gap-4 p-8 text-center`}>
        <p className="text-sm text-foreground" role="alert">{t('curriculum.pace.error')}</p>
        <Button onClick={() => void finishDay()} size="lg" className="rounded-full">
          {t('common.actions.retry')}
        </Button>
      </div>
    )
  }

  const playIndex = mode === 'extra-practice' && extraIndex !== null ? extraIndex : stepIndex
  const currentExerciseId = playIndex !== null && playIndex >= 0 ? queueIds[playIndex] : undefined
  const exercise = currentExerciseId !== undefined ? getCurriculumExerciseById(currentExerciseId) : undefined

  if (currentExerciseId === undefined || exercise === undefined) {
    return <div className={`${CARD_CLASS_NAME} flex min-h-[40vh] items-center justify-center p-6 text-sm text-muted-foreground`}>{t('curriculum.player.loading')}</div>
  }

  const offerEyeBreak = mode !== 'extra-practice' && exercise.category === 'reading-intelligence' && stepIndex !== null && stepIndex > 0 && eyeBreakDoneFor !== stepIndex
  const isGated = isCurriculumExerciseGated(currentExerciseId)
  const EmbeddedComponent = isGated ? undefined : getEmbeddableComponent(currentExerciseId)

  return (
    // True Full-Screen Viewport Lock™ — fixed inset-0 so an active step
    // is always exactly one screen: this header + progress dots + the
    // embedded exercise's own content, never taller, never scrolling as
    // a page. This wizard is the ONLY chrome visible while playing — see
    // ThirtyDayCurriculumDayDetail.tsx, which hides its own back button
    // and Day Theme card while this is rendering, precisely so a second,
    // parent-level header can't stack underneath this one and force a
    // second screen's worth of height (that stacking was the mobile
    // scroll bug this fixes). overflow-hidden on the outer shell + a
    // flex-1 scrolling content region is the safety net if an embedded
    // exercise's own content ever runs taller than the remaining space —
    // the header/progress dots never scroll away regardless.
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background" data-day-master-player={day} data-wizard-step={playIndex ?? -1} data-steps-left={order.length}>
      {/* No wizard-level BrandWatermark here — every embedded exercise
          (built for full-page standalone use) renders its own too; a
          second one on this wrapper only collided with the step header
          text and duplicated the embedded exercise's own watermark. */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-6 sm:py-4">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold tracking-widest text-muted-foreground uppercase sm:text-[10px]">
            {t('curriculum.player.stepOf', { step: Math.min(queueIds.length, doneIds.size + 1), total: queueIds.length, category: categoryLabel(t, exercise.category) })}
          </p>
          <p className="truncate text-xs font-semibold text-foreground sm:text-sm">{exerciseTitle(t, exercise)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {mode !== 'extra-practice' && order.length > 1 && (
            <button
              type="button"
              onClick={handleDoLater}
              className="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium text-muted-foreground transition-[color,transform] active:scale-95 hover:text-foreground sm:px-3"
              data-do-later="true"
            >
              <span>{t('curriculum.pace.doLater')}</span>
              <Undo2 className="size-3.5" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={handleExitWizard}
            className="flex items-center gap-1 rounded-full border border-border/60 px-2 py-1.5 text-xs font-medium text-muted-foreground transition-[color,transform] active:scale-95 hover:text-foreground sm:px-3"
            data-exit-wizard="true"
            aria-label={t('curriculum.player.exitToRoadmap')}
          >
            <X className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{t('curriculum.player.exitToRoadmap')}</span>
          </button>
        </div>
      </div>

      <div className="flex shrink-0 gap-1 px-3 pt-2 sm:gap-1.5 sm:px-6 sm:pt-3" aria-hidden="true">
        {queueIds.map((id, index) => (
          <div
            key={`${id}-${index}`}
            className={`h-1 flex-1 rounded-full transition-colors ${index === playIndex ? 'bg-primary' : doneIds.has(id) || (isReplay && order !== null && !order.includes(index)) ? 'bg-emerald-500' : 'bg-border'}`}
          />
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <EmbeddedExerciseProvider>
          <CurriculumDayProvider value={dayInfo}>
          {offerEyeBreak ? (
            <EyeRelaxationBreak key={`eye-break-${stepIndex}`} onDone={() => setEyeBreakDoneFor(stepIndex)} />
          ) : isGated ? (
            <GatedStepHandoff exercise={exercise} onContinue={() => handleGatedHandoff(exercise, playIndex!)} />
          ) : EmbeddedComponent !== undefined ? (
            <EmbeddedComponent key={`${currentExerciseId}-${playIndex}-${mode}`} onComplete={handleStepComplete} onExit={handleExitWizard} />
          ) : (
            <GatedStepHandoff exercise={exercise} onContinue={handleStepComplete} skipLabel={t('curriculum.player.skipStep')} />
          )}
          </CurriculumDayProvider>
        </EmbeddedExerciseProvider>
      </div>
    </div>
  )
}

// Shown for the 16 server-gated exercises (real Pro/sequential-unlock
// checks live in their own page.tsx — see curriculumGatedExercises.ts)
// and, defensively, for the impossible case of a registry miss (labeled
// as a skip instead, so a learner is never stuck mid-wizard).
function GatedStepHandoff({
  exercise,
  onContinue,
  skipLabel,
}: {
  exercise: CurriculumCatalogExercise
  onContinue: () => void
  skipLabel?: string
}): React.JSX.Element {
  const t = useAppT()
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-6" aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">{exerciseTitle(t, exercise)}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {t('curriculum.player.gatedIntro')}
        </p>
      </div>
      <Button onClick={onContinue} size="lg" className="rounded-full" data-gated-continue="true">
        {skipLabel ?? t('curriculum.player.continueGuided')}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}

const IST = 'Asia/Kolkata'
/** "12:00 am" in the learner's language, India time. */
function formatOpenTime(iso: string, htmlLang: string): string {
  return new Intl.DateTimeFormat(`${htmlLang}-IN-u-nu-latn`, { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: IST }).format(new Date(iso))
}
/** "Fri, 16 Oct" in the learner's language, India time. */
function formatOpenDate(iso: string, htmlLang: string): string {
  return new Intl.DateTimeFormat(`${htmlLang}-IN-u-nu-latn`, { weekday: 'short', day: 'numeric', month: 'short', timeZone: IST }).format(new Date(iso))
}

/** Practice time so far, against about 10 minutes. */
function PracticeMeter({ seconds, label, done = false }: { seconds: number; label: string; done?: boolean }): React.JSX.Element {
  const percent = Math.min(100, Math.round((seconds / PACE_REQUIRED_SECONDS) * 100))
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-2" data-practice-seconds={Math.floor(seconds)}>
      <span className={`font-mono text-3xl tabular-nums ${done ? 'text-emerald-600' : 'text-foreground'}`} aria-live="off">
        {formatPracticeTime(seconds)}
      </span>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={label}>
        <div className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

/** Today's exercises, each to practise again for more time. */
function PractiseAgainList({ queueIds, onPick, label }: { queueIds: readonly string[]; onPick: (index: number) => void; label: string }): React.JSX.Element {
  const t = useAppT()
  return (
    <ul className="flex w-full max-w-sm flex-col gap-2 text-left">
      {queueIds.map((id, index) => {
        const exercise = getCurriculumExerciseById(id)
        if (exercise === undefined) return null
        return (
          <li key={`${id}-${index}`}>
            <button
              type="button"
              onClick={() => onPick(index)}
              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm hover:bg-muted/50"
              data-practise-again={id}
            >
              <span className="min-w-0 text-foreground">{exerciseTitle(t, exercise)}</span>
              <span className="shrink-0 text-xs font-semibold text-primary">{label}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
