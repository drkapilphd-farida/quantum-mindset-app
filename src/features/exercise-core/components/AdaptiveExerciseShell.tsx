'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowRight, ArrowUp, Check, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExercisePracticeLayout } from '@/components/exercises/ExercisePracticeLayout'
import { useAppT } from '@/lib/app-i18n/client'
import type { AppLang } from '@/lib/app-i18n/languages'
import type { LabId } from '@/lib/exercises/types'
import { useExerciseSession } from '@/hooks/exercises/useExerciseSession'
import { getCurriculumSmartExitHref, getWizardAwareBackHref } from '@/features/thirty-day-curriculum/curriculumReturnRouting'
import { useCurriculumSessionCompletion } from '@/features/thirty-day-curriculum/useCurriculumSessionCompletion'
import { useIsEmbeddedExercise } from '@/features/thirty-day-curriculum/embeddedExerciseContext'
import {
  applyRound,
  DEFAULT_THRESHOLDS,
  GOOD_ROUNDS_TO_LEVEL_UP,
  gradeRound,
  MAX_LEVEL,
  type LevelChange,
  type LevelState,
  type LevelThresholds,
  type RoundGrade,
} from '../levelEngine'
import { useExerciseProgress } from '../useExerciseProgress'
import { DemoPlayer, type DemoStep } from './DemoPlayer'

const LAB_HREF = '/labs/sharp-brain'

/** What one round reports back to the shell. */
export type RoundOutcome = {
  correct: number
  total: number
  /** Points for this round (higher is better). */
  score: number
  /** Optional numbers kept with the session result (e.g. wpm). Averaged over rounds. */
  metrics?: Record<string, number>
}

export type RenderRoundArgs = {
  level: number
  isPractice: boolean
  roundIndex: number
  onDone: (outcome: RoundOutcome) => void
}

export type SessionSummary = { score: number; metrics: Record<string, number> }

type Phase = 'intro' | 'practice' | 'practice-done' | 'round' | 'feedback' | 'end'

type RoundRecord = { outcome: RoundOutcome; grade: RoundGrade; change: LevelChange; levelAfter: number }

export type AdaptiveExerciseShellProps = {
  exerciseId: string
  labId?: LabId
  title: string
  skill: string
  /** ~1 line: what this trains. */
  purpose: string
  minutes: number
  demo: readonly DemoStep[]
  roundsPerSession: number
  thresholds?: LevelThresholds
  /** Shown under the score on the end screen, e.g. "points" or "effective WPM". */
  scoreLabel: string
  /** How a session's score is built from its rounds (default: sum). */
  combineScore?: (rounds: readonly RoundOutcome[]) => number
  contentLang?: AppLang | null
  /** e.g. the "practice text in English" note. */
  introNote?: React.ReactNode
  /** One short line under the level chip describing what this level asks for. */
  describeLevel?: (level: number) => string
  renderRound: (args: RenderRoundArgs) => React.ReactNode
  /** Wizard / journey hand-off: the session accuracy (0–100), plus its score and averaged metrics. */
  onComplete?: (accuracyPercent: number, session: SessionSummary) => void
  onExit?: () => void
}

function sum(values: readonly number[]): number {
  return values.reduce((a, b) => a + b, 0)
}

export function AdaptiveExerciseShell(props: AdaptiveExerciseShellProps): React.JSX.Element {
  const {
    exerciseId,
    labId = 'quantum-speed-reading',
    title,
    skill,
    purpose,
    minutes,
    demo,
    roundsPerSession,
    thresholds = DEFAULT_THRESHOLDS,
    scoreLabel,
    combineScore = (rounds) => sum(rounds.map((r) => r.score)),
    contentLang = null,
    introNote,
    describeLevel,
    renderRound,
    onComplete,
    onExit,
  } = props
  const t = useAppT()
  const router = useRouter()
  const isEmbedded = useIsEmbeddedExercise()
  const curriculumSession = useCurriculumSessionCompletion(exerciseId, LAB_HREF)
  const session = useExerciseSession({ labId, exerciseId })
  const { progress, save } = useExerciseProgress(exerciseId)

  const [phase, setPhase] = useState<Phase>('intro')
  const [levelState, setLevelState] = useState<LevelState>(progress.levelState)
  const [levelStart, setLevelStart] = useState(progress.levelState.level)
  const [rounds, setRounds] = useState<RoundRecord[]>([])
  const [practiceOutcome, setPracticeOutcome] = useState<RoundOutcome | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [saved, setSaved] = useState<{ bestBefore: number; best: number } | null>(null)
  const startedAtRef = useRef(0)
  const savingRef = useRef(false)
  const metricsRef = useRef<Record<string, number>>({})

  // Adopt the saved level once it has loaded (only before the first round).
  useEffect(() => {
    if (progress.ready && phase === 'intro' && rounds.length === 0) {
      setLevelState(progress.levelState)
      setLevelStart(progress.levelState.level)
    }
  }, [progress.ready, progress.levelState, phase, rounds.length])

  function begin(withPractice: boolean): void {
    session.start()
    startedAtRef.current = performance.now()
    setRounds([])
    setSaved(null)
    savingRef.current = false
    setLevelStart(levelState.level)
    setAttempt((a) => a + 1)
    setPhase(withPractice ? 'practice' : 'round')
  }

  function handlePracticeDone(outcome: RoundOutcome): void {
    setPracticeOutcome(outcome)
    setPhase('practice-done')
  }

  function handleRoundDone(outcome: RoundOutcome): void {
    const accuracy = outcome.total > 0 ? outcome.correct / outcome.total : 0
    const grade = gradeRound(accuracy, thresholds)
    const { state, change } = applyRound(levelState, grade)
    setLevelState(state)
    setRounds((prev) => [...prev, { outcome, grade, change, levelAfter: state.level }])
    setPhase('feedback')
  }

  const totalCorrect = sum(rounds.map((r) => r.outcome.correct))
  const totalItems = sum(rounds.map((r) => r.outcome.total))
  const accuracyPercent = totalItems > 0 ? Math.round((totalCorrect / totalItems) * 100) : 0
  const sessionScore = Math.round(combineScore(rounds.map((r) => r.outcome)))

  async function finishSession(): Promise<void> {
    setPhase('end')
    if (savingRef.current) return
    savingRef.current = true
    const durationMs = Math.max(1, performance.now() - startedAtRef.current)
    void session.recordCompletion(durationMs)
    const metricNames = [...new Set(rounds.flatMap((r) => Object.keys(r.outcome.metrics ?? {})))]
    const extra: Record<string, number> = {}
    for (const name of metricNames.slice(0, 8)) {
      const values = rounds.map((r) => r.outcome.metrics?.[name]).filter((v): v is number => typeof v === 'number' && Number.isFinite(v))
      if (values.length > 0) extra[name] = Math.round((sum(values) / values.length) * 10) / 10
    }
    metricsRef.current = extra
    const bestBefore = progress.bestScore
    const next = await save({
      score: sessionScore,
      accuracyPercent,
      levelStart,
      levelState,
      rounds: rounds.length,
      durationMs,
      contentLang,
      extra,
    })
    setSaved({ bestBefore, best: next.bestScore })
  }

  function handleNext(): void {
    if (rounds.length >= roundsPerSession) {
      void finishSession()
      return
    }
    setPhase('round')
  }

  function handleExit(): void {
    if (phase === 'round' || phase === 'feedback' || phase === 'practice') void session.recordExit(Math.max(1, performance.now() - startedAtRef.current))
    if (onExit) {
      onExit()
      return
    }
    router.push(getCurriculumSmartExitHref(exerciseId, LAB_HREF))
  }

  function handleContinue(): void {
    if (curriculumSession.isActiveStep) curriculumSession.advance()
    else onComplete?.(accuracyPercent, { score: sessionScore, metrics: metricsRef.current })
  }

  const progressValue = phase === 'end' ? 1 : rounds.length / roundsPerSession

  let body: React.ReactNode
  if (!progress.ready) {
    body = <p className="py-24 text-center text-sm text-muted-foreground">{t('training.shell.loading')}</p>
  } else if (phase === 'intro') {
    body = (
      <IntroScreen
        title={title}
        skill={skill}
        purpose={purpose}
        minutes={minutes}
        level={levelState.level}
        levelHint={describeLevel?.(levelState.level)}
        bestScore={progress.bestScore}
        scoreLabel={scoreLabel}
        isFirstTime={progress.isFirstTime}
        demo={demo}
        note={introNote}
        onStart={begin}
      />
    )
  } else if (phase === 'practice') {
    body = (
      <RoundFrame label={t('training.shell.practiceRound')} sub={t('training.shell.practiceDoesntCount')}>
        {renderRound({ level: levelState.level, isPractice: true, roundIndex: -1, onDone: handlePracticeDone })}
      </RoundFrame>
    )
  } else if (phase === 'practice-done') {
    body = (
      <CenterCard>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.shell.practiceRound')}</p>
        <h2 className="mt-1 font-heading text-2xl font-bold text-foreground">{t('training.shell.practiceDone')}</h2>
        {practiceOutcome !== null && (
          <p className="mt-2 text-sm text-muted-foreground">{t('training.shell.correctOf', { correct: practiceOutcome.correct, total: practiceOutcome.total })}</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">{t('training.shell.practiceDoneHint', { rounds: roundsPerSession })}</p>
        <Button size="lg" className="mt-6 w-full rounded-full" onClick={() => setPhase('round')} data-start-rounds="true">
          {t('training.shell.startRounds')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </CenterCard>
    )
  } else if (phase === 'round') {
    body = (
      <RoundFrame
        label={t('training.shell.roundOf', { round: rounds.length + 1, total: roundsPerSession })}
        sub={t('training.shell.levelN', { level: levelState.level })}
      >
        <div key={`${attempt}-${rounds.length}`} className="w-full">
          {renderRound({ level: levelState.level, isPractice: false, roundIndex: rounds.length, onDone: handleRoundDone })}
        </div>
      </RoundFrame>
    )
  } else if (phase === 'feedback') {
    const last = rounds[rounds.length - 1]
    body =
      last === undefined ? null : (
        <RoundFeedback record={last} roundNumber={rounds.length} totalRounds={roundsPerSession} goodRun={levelState.goodRun} onNext={handleNext} />
      )
  } else {
    body = (
      <EndScreen
        score={sessionScore}
        scoreLabel={scoreLabel}
        accuracyPercent={accuracyPercent}
        levelStart={levelStart}
        levelEnd={levelState.level}
        saved={saved}
        onPlayAgain={() => begin(false)}
        canContinue={curriculumSession.isActiveStep || onComplete !== undefined}
        onContinue={handleContinue}
        backHref={isEmbedded ? null : getWizardAwareBackHref(exerciseId, LAB_HREF)}
      />
    )
  }

  return (
    <ExercisePracticeLayout progress={progressValue} onExit={handleExit}>
      <div className="mx-auto w-full max-w-md" data-exercise={exerciseId} data-phase={phase} data-level={levelState.level}>
        {body}
      </div>
    </ExercisePracticeLayout>
  )
}

function CenterCard({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <div className="flex w-full flex-col items-center px-2 py-6 text-center">{children}</div>
}

function RoundFrame({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex w-full flex-col items-center gap-3 py-2">
      <div className="flex w-full items-center justify-between text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        <span>{label}</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary normal-case">{sub}</span>
      </div>
      {children}
    </div>
  )
}

function IntroScreen({
  title,
  skill,
  purpose,
  minutes,
  level,
  levelHint,
  bestScore,
  scoreLabel,
  isFirstTime,
  demo,
  note,
  onStart,
}: {
  title: string
  skill: string
  purpose: string
  minutes: number
  level: number
  levelHint: string | undefined
  bestScore: number
  scoreLabel: string
  isFirstTime: boolean
  demo: readonly DemoStep[]
  note: React.ReactNode
  onStart: (withPractice: boolean) => void
}): React.JSX.Element {
  const t = useAppT()
  return (
    <div className="flex w-full flex-col items-center gap-4 py-2 text-center">
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">{skill}</p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{purpose}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary" data-intro-level={level}>
          {t('training.shell.levelOfMax', { level, max: MAX_LEVEL })}
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">{t('training.shell.aboutMinutes', { minutes })}</span>
        {bestScore > 0 && (
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            {t('training.shell.bestShort', { score: bestScore })} {scoreLabel}
          </span>
        )}
      </div>
      {levelHint !== undefined && <p className="-mt-2 text-xs text-muted-foreground">{levelHint}</p>}
      <div className="w-full text-left">
        <p className="mb-1.5 text-xs font-semibold text-foreground">{t('training.shell.howToPlay')}</p>
        <DemoPlayer steps={demo} />
      </div>
      {note}
      {isFirstTime ? (
        <div className="flex w-full flex-col items-center gap-2">
          <Button size="lg" className="w-full rounded-full" onClick={() => onStart(true)} data-start-practice="true">
            {t('training.shell.tryPractice')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <p className="text-xs text-muted-foreground">{t('training.shell.practiceExplain')}</p>
          <button type="button" onClick={() => onStart(false)} className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline">
            {t('training.shell.skipPractice')}
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-2">
          <Button size="lg" className="w-full rounded-full" onClick={() => onStart(false)} data-start="true">
            {t('training.shell.start')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <button type="button" onClick={() => onStart(true)} className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline">
            {t('training.shell.warmUpFirst')}
          </button>
        </div>
      )}
    </div>
  )
}

function RoundFeedback({
  record,
  roundNumber,
  totalRounds,
  goodRun,
  onNext,
}: {
  record: RoundRecord
  roundNumber: number
  totalRounds: number
  goodRun: number
  onNext: () => void
}): React.JSX.Element {
  const t = useAppT()
  const { outcome, grade, change, levelAfter } = record
  const message = grade === 'good' ? t('training.shell.gradeGood') : grade === 'okay' ? t('training.shell.gradeOkay') : t('training.shell.gradePoor')
  const isLast = roundNumber >= totalRounds
  return (
    <CenterCard>
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{t('training.shell.roundOf', { round: roundNumber, total: totalRounds })}</p>
      <div
        className={`mt-3 flex size-16 items-center justify-center rounded-full ${grade === 'good' ? 'bg-emerald-500/15 text-emerald-600' : grade === 'okay' ? 'bg-primary/10 text-primary' : 'bg-amber-500/15 text-amber-600'}`}
        aria-hidden="true"
      >
        <Check className="size-8" />
      </div>
      <p className="mt-3 font-heading text-3xl font-bold tabular-nums text-foreground" data-round-correct={outcome.correct}>
        {t('training.shell.correctOf', { correct: outcome.correct, total: outcome.total })}
      </p>
      <p className="mt-1 text-sm text-muted-foreground" data-round-grade={grade}>
        {message}
      </p>
      {change === 'up' && (
        <p className="mt-4 flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-semibold text-emerald-700 motion-safe:animate-in motion-safe:zoom-in-95 dark:text-emerald-300" data-level-change="up">
          <ArrowUp className="size-4" aria-hidden="true" />
          {t('training.shell.levelUp', { level: levelAfter })}
        </p>
      )}
      {change === 'down' && (
        <p className="mt-4 flex items-center gap-1.5 rounded-full bg-muted px-4 py-1.5 text-sm font-semibold text-foreground" data-level-change="down">
          <ArrowDown className="size-4" aria-hidden="true" />
          {t('training.shell.levelDown', { level: levelAfter })}
        </p>
      )}
      {change === null && levelAfter < MAX_LEVEL && (
        <div className="mt-4 flex flex-col items-center gap-1.5">
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: GOOD_ROUNDS_TO_LEVEL_UP }, (_, i) => (
              <span key={i} className={`size-2.5 rounded-full ${i < goodRun ? 'bg-emerald-500' : 'bg-border'}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{t('training.shell.goodRunHint', { n: GOOD_ROUNDS_TO_LEVEL_UP - goodRun })}</p>
        </div>
      )}
      <Button size="lg" className="mt-6 w-full rounded-full" onClick={onNext} data-next-round="true">
        {isLast ? t('training.shell.seeResults') : t('training.shell.nextRound')}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </CenterCard>
  )
}

function EndScreen({
  score,
  scoreLabel,
  accuracyPercent,
  levelStart,
  levelEnd,
  saved,
  onPlayAgain,
  canContinue,
  onContinue,
  backHref,
}: {
  score: number
  scoreLabel: string
  accuracyPercent: number
  levelStart: number
  levelEnd: number
  saved: { bestBefore: number; best: number } | null
  onPlayAgain: () => void
  canContinue: boolean
  onContinue: () => void
  backHref: string | null
}): React.JSX.Element {
  const t = useAppT()
  const isNewBest = saved !== null && score > 0 && score > saved.bestBefore
  return (
    <CenterCard>
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.shell.sessionDone')}</p>
      <p className="mt-2 font-heading text-5xl font-bold tabular-nums text-foreground" data-session-score={score}>
        {score}
      </p>
      <p className="text-sm text-muted-foreground">{scoreLabel}</p>
      {isNewBest && (
        <p className="mt-3 flex items-center gap-1.5 rounded-full bg-amber-500/15 px-4 py-1.5 text-sm font-semibold text-amber-700 dark:text-amber-300" data-new-best="true">
          <Trophy className="size-4" aria-hidden="true" />
          {t('training.shell.newBest')}
        </p>
      )}
      <div className="mt-5 grid w-full grid-cols-3 gap-2">
        <Stat label={t('training.shell.accuracy')} value={`${accuracyPercent}%`} />
        <Stat label={t('training.shell.level')} value={levelStart === levelEnd ? String(levelEnd) : `${levelStart} → ${levelEnd}`} />
        <Stat label={t('training.shell.best')} value={saved === null ? '…' : String(saved.best)} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground" data-saved={saved === null ? 'pending' : 'done'}>
        {saved === null ? t('training.shell.saving') : t('training.shell.saved')}
      </p>
      <div className="mt-6 flex w-full flex-col gap-2">
        {canContinue && (
          <Button size="lg" className="w-full rounded-full" onClick={onContinue} data-continue="true">
            {t('exercises.complete.continueSession')}
          </Button>
        )}
        <Button size="lg" variant={canContinue ? 'outline' : 'default'} className="w-full rounded-full" onClick={onPlayAgain} data-play-again="true">
          <RotateCcw className="size-4" aria-hidden="true" />
          {t('exercises.complete.playAgain')}
        </Button>
        {backHref !== null && !canContinue && (
          <Link href={backHref} className="mt-1 text-xs text-muted-foreground hover:text-foreground">
            {t('exercises.complete.backToLab')}
          </Link>
        )}
      </div>
    </CenterCard>
  )
}

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 px-2 py-3">
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-0.5 font-heading text-lg font-bold tabular-nums text-foreground">{value}</p>
    </div>
  )
}
