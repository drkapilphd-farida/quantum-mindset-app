'use client'

import { useEffect, useState } from 'react'
import { dayFocus, dayTitle } from '@/lib/app-i18n/curriculumText'
import { useAppI18n } from '@/lib/app-i18n/client'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, FileText, RotateCcw, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BrandWatermark } from '@/components/brand/BrandWatermark'
import { buildCurriculumDayPlan, getCurriculumPhase, getPhaseJustCompleted, isCheckpointDay } from '../curriculumDatabase'
import { computeCheckpointDelta, markCurriculumDayUploadStarted, type CurriculumProgress } from '../curriculumProgress'
import { DayMasterPlayer } from './DayMasterPlayer'
import { getCurriculumDayPractice, type CurriculumDayPracticeAttempt } from '../actions/curriculumDayPractice'
import { PhaseCompleteCelebration } from './PhaseCompleteCelebration'

const CARD_CLASS_NAME = 'relative rounded-3xl border-2 border-border/60 bg-[#FBF9F4]/95 shadow-sm backdrop-blur-md dark:bg-[#16171A]/95'

type ThirtyDayCurriculumDayDetailProps = {
  day: number
  progress: CurriculumProgress
  justCompletedDay?: boolean
  /** Completed according to the server (the browser's own record may be missing on a new device). */
  completedOnServer?: boolean
  /** Reopen straight into a replay (returning from an exercise that has its own page). */
  initialReplay?: boolean
  /** A replay was just saved — show the practice notice. */
  justPractised?: boolean
  /** Practising again is for enrolled learners only (the server checks this too). */
  canPractise?: boolean
  onBack: () => void
  onLaunchAssessment: (day: number, practice: boolean) => void
}

// Day Detail™ — now just a thin frame (theme header + celebration
// banner) around DayMasterPlayer, the in-page wizard that IS the day's
// content. The old plain multi-link exercise list and manual "Mark Day
// Complete" button are gone — bouncing across separate pages to click
// through a checklist was exactly the "critical UX bug" this
// restructuring set out to fix. Completion now only ever happens
// automatically, the instant the wizard's final step finishes (see
// DayMasterPlayer.tsx). On a checkpoint day, finishing the wizard's
// exercise queue hands off to the real assessment via
// `onReadyForCheckpoint` rather than completing the day itself — a
// checkpoint day's real completion condition is always the WPM +
// comprehension check-in, never bypassable by just clicking through
// exercises (see curriculumReturnRouting.ts's own doc comment on this).
//
// Permanent Replay™ — a completed day still lands on the celebratory
// summary below by default (the checkpoint stats/badge are worth
// keeping front and center), but `isReplaying` lets a learner re-open
// DayMasterPlayer on demand via "Practice Day Again," any number of
// times. DayMasterPlayer's own finishDay() already calls
// markCurriculumDayComplete/completeCurriculumDay idempotently, so
// re-finishing a replay is safe — it's a no-op against
// completedDays/checkpoints, not a second "completion."
export function ThirtyDayCurriculumDayDetail({
  day,
  progress,
  justCompletedDay = false,
  completedOnServer = false,
  initialReplay = false,
  justPractised = false,
  canPractise = false,
  onBack,
  onLaunchAssessment,
}: ThirtyDayCurriculumDayDetailProps): React.JSX.Element {
  const { lang, t } = useAppI18n()
  const [isReplaying, setIsReplaying] = useState(initialReplay && canPractise)
  const [practice, setPractice] = useState<CurriculumDayPracticeAttempt | null>(null)

  // Latest "Practised again" for this day — re-read whenever a replay ends.
  useEffect(() => {
    if (isReplaying) return
    let cancelled = false
    void getCurriculumDayPractice(day).then((attempt) => {
      if (!cancelled) setPractice(attempt)
    })
    return () => {
      cancelled = true
    }
  }, [day, isReplaying, justPractised])
  const plan = buildCurriculumDayPlan(day)
  const phase = getCurriculumPhase(plan.phase)
  const isCompleted = completedOnServer || progress.completedDays.includes(day)
  const checkpoint = progress.checkpoints[day]
  const requiresCheckpoint = isCheckpointDay(day)
  // Phase-Complete Celebration Screens™ — non-null only on Days 7/14/21,
  // each of which IS the last day of `phase` above by construction, so
  // `phase` doubles as "the phase that was just completed" here.
  const phaseJustCompleted = getPhaseJustCompleted(day)
  const nextPhase = phaseJustCompleted !== null ? getCurriculumPhase((phaseJustCompleted + 1) as 2 | 3 | 4) : null
  const checkpointDelta = computeCheckpointDelta(progress, day)

  // True Full-Screen Viewport Lock™ — while a day isn't complete yet (or
  // is being replayed), DayMasterPlayer renders as a real
  // fixed-inset-0 full-screen wizard (its own header/exit control
  // included) the instant it mounts. The back button + Day Theme card
  // below aren't just visually covered by that overlay — they're real
  // interactive elements a screen reader or keyboard user could
  // otherwise reach, so they're not rendered at all while the wizard
  // owns the screen, not just hidden behind it. This is also what "zero
  // parent titles/breadcrumbs during an active exercise" requires: a
  // second header stacked above the wizard's own was exactly what
  // forced the page taller than one screen and made it scroll.
  if (!isCompleted || isReplaying) {
    return (
      <DayMasterPlayer
        day={day}
        onExitToRoadmap={isReplaying ? () => setIsReplaying(false) : onBack}
        onDayComplete={isReplaying ? () => setIsReplaying(false) : onBack}
        onReadyForCheckpoint={() => onLaunchAssessment(day, isReplaying)}
        isReplay={isReplaying}
      />
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {t('curriculum.detail.backToAll')}
      </button>

      {justCompletedDay && (
        <div
          className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
          data-day-complete-celebration="true"
        >
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          {t('curriculum.detail.dayCompleteUnlocked', { day, next: day + 1 })}
        </div>
      )}

      {justPractised && (
        <div
          className="flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-700 dark:text-indigo-300"
          data-practice-saved="true"
        >
          <RotateCcw className="size-4 shrink-0" aria-hidden="true" />
          {t('curriculum.practice.saved', { day })}
        </div>
      )}

      {phaseJustCompleted !== null && nextPhase !== null && <PhaseCompleteCelebration completedPhase={phase} nextPhase={nextPhase} />}

      <div className={`${CARD_CLASS_NAME} p-6`}>
        <BrandWatermark className="absolute top-4 left-6" />
        <div className="mt-8 flex flex-col gap-2 sm:mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {t('curriculum.detail.phaseDay', { phase: phase.id, day })}
            </Badge>
            {requiresCheckpoint && (
              <Badge variant="outline" className="gap-1 border-amber-500/40 text-amber-600 dark:text-amber-400">
                <Sparkles className="size-3" aria-hidden="true" />
                {t('curriculum.detail.checkpointDay')}
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="outline" className="gap-1 border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" aria-hidden="true" />
                {t('curriculum.detail.completed')}
              </Badge>
            )}
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">{dayTitle(t, day)}</h1>
          <p className="text-sm text-muted-foreground">{dayFocus(t, day)}</p>
        </div>
      </div>

      <div className={`${CARD_CLASS_NAME} p-6`}>
        {requiresCheckpoint && checkpoint !== undefined ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('curriculum.detail.checkpointRecorded')}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-teal-500/10 p-4">
                <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">{t('curriculum.detail.trueWpm')}</p>
                <p className="font-heading text-xl font-bold tabular-nums text-foreground">
                  {checkpoint.trueWpm} WPM
                  {checkpointDelta !== null && (
                    <span className={`ml-1 text-xs font-semibold ${checkpointDelta.wpmGrowthPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {checkpointDelta.wpmGrowthPercent >= 0 ? '+' : ''}
                      {checkpointDelta.wpmGrowthPercent}%
                    </span>
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">{t('curriculum.detail.comprehension')}</p>
                <p className="font-heading text-xl font-bold tabular-nums text-foreground">
                  {checkpoint.comprehensionAccuracyPercent}%
                  {checkpointDelta !== null && (
                    <span
                      className={`ml-1 text-xs font-semibold ${checkpointDelta.comprehensionDeltaPercent >= 0 ? 'text-success' : 'text-destructive'}`}
                    >
                      {checkpointDelta.comprehensionDeltaPercent >= 0 ? '+' : ''}
                      {checkpointDelta.comprehensionDeltaPercent}pp
                    </span>
                  )}
                </p>
              </div>
            </div>
            {checkpointDelta !== null && <p className="text-center text-xs text-muted-foreground">{t('curriculum.detail.vsBaseline')}</p>}
          </div>
        ) : (
          <p className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">{t('curriculum.detail.dayDone', { day })}</p>
        )}
        {canPractise && (
        <button
          type="button"
          onClick={() => setIsReplaying(true)}
          className="mx-auto mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          {t('curriculum.detail.practiceAgain')}
        </button>
        )}
        {practice !== null && (
          <div className="mt-4 rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-center" data-practised-again="true">
            <p className="text-xs font-semibold text-foreground">
              {t('curriculum.practice.practisedOn', {
                date: new Date(practice.practisedAt).toLocaleDateString(LANGUAGES[lang].htmlLang, { day: 'numeric', month: 'short', year: 'numeric' }),
              })}
              {practice.count > 1 ? ` · ${t('curriculum.practice.times', { n: practice.count })}` : ''}
            </p>
            {practice.trueWpm !== null && practice.comprehensionAccuracyPercent !== null && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t('curriculum.practice.latestResult', { wpm: practice.trueWpm, percent: practice.comprehensionAccuracyPercent })}
              </p>
            )}
            <p className="mt-0.5 text-[11px] text-muted-foreground">{t('curriculum.practice.originalKept', { day })}</p>
          </div>
        )}
      </div>

      {/* Upload & Learn Masterclass Integration™ — weaves the AI Document
          Supercharger into the daily practice workflow itself rather than
          leaving it as a separate, disconnected dashboard utility. Shown
          only once a day's real exercise queue is done — a calmer, review-
          style moment to bring in real reading material, not competing
          with DayMasterPlayer's own focused full-screen flow. Reuses the
          exact same widget already embedded on QsrDashboard.tsx
          (#upload-document) rather than inventing a second upload
          pipeline — see curriculumProgress.ts's own doc comment on why
          this can only ever record real click-through intent, not a
          confirmed completed upload (the two engines have no real data
          link to each other by design, per this integration's own scope). */}
      <div className={`${CARD_CLASS_NAME} p-6`}>
        {progress.uploadStartedDays.includes(day) ? (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-foreground">{t('curriculum.detail.uploadStarted', { day })}</p>
              <p className="text-xs text-muted-foreground">{t('curriculum.detail.uploadStartedHint')}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="flex items-center gap-3">
              <FileText className="size-8 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-foreground">{t('curriculum.detail.uploadToday')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('curriculum.detail.uploadTodayHint', { title: dayTitle(t, day) })}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard#upload-document"
              onClick={() => markCurriculumDayUploadStarted(day)}
              className="brand-gradient-text shrink-0 text-sm font-semibold whitespace-nowrap"
            >
              {t('curriculum.detail.uploadLink')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
