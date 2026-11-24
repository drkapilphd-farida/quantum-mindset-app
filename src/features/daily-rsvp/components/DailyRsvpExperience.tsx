'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Minus, Plus, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppI18n } from '@/lib/app-i18n/client'
import { practiceContentLang } from '@/lib/app-i18n/practiceContent'
import { PracticeTextNote } from '@/lib/app-i18n/PracticeTextNote'
import { ActiveClock, rsvpFontPx, rsvpWordMs, rsvpWords, showsFocusLetter, splitAtFocus } from '@/features/brain-unlock/rsvp'
import { saveExerciseResult } from '@/features/exercise-core/actions/exerciseResults'
import { useCurriculumDayInfo } from '@/features/thirty-day-curriculum/embeddedExerciseContext'
import { getDailyRsvpState, type DailyRsvpState } from '../actions'
import { DAILY_RSVP_EXERCISE_ID, dailyRsvpGrowth, measuredWpm, nextWpmAfter, retentionPercent, stepRsvpWpm, type DailyRsvpDayResult } from '../dailyRsvp'
import { dailyRsvpPassage, type DailyRsvpLang } from '../passages'
import { DailyRsvpChart } from './DailyRsvpChart'

// Daily Speed Read (see ../dailyRsvp.ts): start screen with today's speed and
// − / +, a 3-2-1 countdown, the passage one word at a time in a fixed box
// (tap to pause; paused time is left out of the speed), 3 recall questions,
// then the day's speed and retention with the day-by-day chart.

type Phase = 'loading' | 'intro' | 'countdown' | 'run' | 'questions' | 'result'
type Props = { onComplete?: () => void; onExit?: () => void }

const RED = '#dc2626'

function FlashWord({ word, fontPx, lang }: { word: string; fontPx: number; lang: DailyRsvpLang }): React.JSX.Element {
  const marker = <span className="mx-auto block h-3 w-0.5 rounded bg-foreground/50" aria-hidden="true" />
  if (!showsFocusLetter(lang)) {
    return (
      <div className="flex flex-col items-center gap-2">
        {marker}
        <p lang={lang} className="font-heading leading-none whitespace-nowrap text-foreground" style={{ fontSize: fontPx }}>
          {word}
        </p>
        {marker}
      </div>
    )
  }
  const { before, focus, after } = splitAtFocus(word)
  return (
    <div className="flex w-full flex-col gap-2">
      {marker}
      <p lang={lang} className="grid grid-cols-[1fr_auto_1fr] font-heading leading-none whitespace-nowrap text-foreground" style={{ fontSize: fontPx }}>
        <span className="text-right">{before}</span>
        <span style={{ color: RED }}>{focus}</span>
        <span className="text-left">{after}</span>
      </p>
      {marker}
    </div>
  )
}

export function DailyRsvpExperience({ onComplete, onExit }: Props = {}): React.JSX.Element {
  const { t, lang: uiLang } = useAppI18n()
  const router = useRouter()
  const lang = practiceContentLang(uiLang, 'dailyRsvp') as DailyRsvpLang
  const dayInfo = useCurriculumDayInfo()
  const planDay = dayInfo?.day ?? null
  const isReplay = dayInfo?.isReplay ?? false

  const [phase, setPhase] = useState<Phase>('loading')
  const [state, setState] = useState<DailyRsvpState | null>(null)
  const [wpm, setWpm] = useState(200)
  const [count, setCount] = useState(3)
  const [at, setAt] = useState(0)
  const [paused, setPaused] = useState(false)
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<DailyRsvpDayResult | null>(null)
  const [saveFailed, setSaveFailed] = useState(false)
  const [boxPx, setBoxPx] = useState(320)
  const clock = useRef(new ActiveClock())
  const runMs = useRef(0)
  const box = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let live = true
    void getDailyRsvpState(lang, planDay).then((s) => {
      if (!live) return
      setState(s)
      setWpm(s.suggestedWpm)
      setPhase('intro')
    })
    return () => {
      live = false
    }
  }, [lang, planDay])

  // In the plan: that day's passage. On its own page: the day after the latest one done.
  const passageDay = planDay ?? Math.min(30, (state?.history[state.history.length - 1]?.day ?? 0) + 1)
  const passage = useMemo(() => dailyRsvpPassage(passageDay, lang), [passageDay, lang])
  const words = useMemo(() => rsvpWords(passage.text), [passage.text])
  const fontPx = useMemo(() => rsvpFontPx(words, boxPx, lang), [words, boxPx, lang])
  const previous = state?.history.filter((r) => planDay === null || r.day < planDay).at(-1) ?? null

  useEffect(() => {
    if (phase !== 'countdown' && phase !== 'run') return undefined
    const el = box.current
    if (el === null) return undefined
    const measure = (): void => setBoxPx(el.clientWidth)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [phase])

  useEffect(() => {
    if (phase !== 'countdown') return undefined
    if (count === 0) {
      clock.current.start(performance.now())
      setAt(0)
      setPhase('run')
      return undefined
    }
    const id = window.setTimeout(() => setCount((n) => n - 1), 800)
    return () => window.clearTimeout(id)
  }, [phase, count])

  useEffect(() => {
    if (phase !== 'run' || paused) return undefined
    if (at >= words.length) {
      runMs.current = Math.round(clock.current.elapsed(performance.now()))
      setPhase('questions')
      return undefined
    }
    const id = window.setTimeout(() => setAt((i) => i + 1), rsvpWordMs(words[at]!, wpm))
    return () => window.clearTimeout(id)
  }, [phase, at, paused, wpm, words])

  function togglePause(): void {
    const now = performance.now()
    if (paused) clock.current.resume(now)
    else clock.current.pause(now)
    setPaused(!paused)
  }

  async function finish(finalAnswers: readonly number[]): Promise<void> {
    const correct = passage.questions.filter((q, i) => finalAnswers[i] === q.answer).length
    const dayResult: DailyRsvpDayResult = {
      day: passageDay,
      wpm: measuredWpm(words.length, runMs.current, wpm),
      retentionPercent: retentionPercent(correct, passage.questions.length),
      targetWpm: wpm,
    }
    setResult(dayResult)
    setPhase('result')
    const saved = await saveExerciseResult({
      exerciseId: DAILY_RSVP_EXERCISE_ID,
      score: dayResult.wpm,
      accuracyPercent: dayResult.retentionPercent,
      levelStart: null,
      levelEnd: null,
      goodRun: 0,
      poorRun: 0,
      rounds: 1,
      durationMs: runMs.current,
      curriculumDay: planDay,
      isReplay,
      contentLang: lang,
      extra: { targetWpm: wpm, words: words.length, correct, passageDay },
    })
    setSaveFailed(!saved.ok)
  }

  if (phase === 'loading') {
    return <div className="mx-auto h-64 w-full max-w-xl animate-pulse rounded-3xl bg-muted/40" data-daily-rsvp="loading" />
  }

  if (phase === 'intro') {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-6 text-center" data-daily-rsvp="intro">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Zap className="size-6" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-2xl font-bold text-foreground">{t('training.dailyRsvp.title')}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{t('training.dailyRsvp.purpose')}</p>
        <PracticeTextNote kind="dailyRsvp" />

        <div className="w-full rounded-3xl border border-border bg-card p-5">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{t('training.dailyRsvp.todaySpeed')}</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" className="size-11 rounded-full" aria-label={t('training.dailyRsvp.slower')} onClick={() => setWpm((w) => stepRsvpWpm(w, -1))} data-rsvp-slower="true">
              <Minus className="size-5" aria-hidden="true" />
            </Button>
            <p className="min-w-32 font-heading text-4xl font-bold tabular-nums text-foreground" data-rsvp-wpm={wpm}>
              {wpm}
              <span className="ml-1 text-base font-semibold text-muted-foreground">{t('training.dailyRsvp.wpm')}</span>
            </p>
            <Button variant="outline" size="icon" className="size-11 rounded-full" aria-label={t('training.dailyRsvp.faster')} onClick={() => setWpm((w) => stepRsvpWpm(w, 1))} data-rsvp-faster="true">
              <Plus className="size-5" aria-hidden="true" />
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {previous !== null ? t('training.dailyRsvp.yesterday', { wpm: previous.wpm, retention: previous.retentionPercent }) : t('training.dailyRsvp.firstTime')}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t('training.dailyRsvp.rule')}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          <span lang={lang} className="font-semibold text-foreground">{passage.title}</span> · {t('training.dailyRsvp.words', { words: words.length })}
        </p>
        {isReplay && <p className="text-xs text-muted-foreground">{t('training.dailyRsvp.replayNote')}</p>}
        <Button size="lg" className="w-full rounded-full" onClick={() => { setCount(3); setPhase('countdown') }} data-rsvp-start="true">
          {t('training.dailyRsvp.start')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        {onExit && (
          <Button variant="ghost" className="rounded-full" onClick={onExit}>
            {t('exercises.exit')}
          </Button>
        )}
      </div>
    )
  }

  if (phase === 'countdown' || phase === 'run') {
    const word = phase === 'run' ? words[Math.min(at, words.length - 1)] ?? '' : ''
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 px-4 py-6" data-daily-rsvp={phase}>
        <div className="w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
            <div className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out" style={{ width: `${phase === 'run' ? (at / words.length) * 100 : 0}%` }} />
          </div>
          <p className="mt-1 text-right text-[10px] tabular-nums text-muted-foreground">{wpm} {t('training.dailyRsvp.wpm')}</p>
        </div>
        <button
          ref={box}
          type="button"
          onClick={phase === 'run' ? togglePause : undefined}
          className="flex h-44 w-full items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-card px-3"
          aria-label={paused ? t('training.dailyRsvp.paused') : t('training.dailyRsvp.tapToPause')}
          data-rsvp-box="true"
        >
          {phase === 'countdown' ? (
            <span className="font-heading text-6xl font-bold tabular-nums text-primary" aria-live="assertive">{count}</span>
          ) : (
            <FlashWord word={word} fontPx={fontPx} lang={lang} />
          )}
        </button>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {paused ? t('training.dailyRsvp.paused') : t('training.dailyRsvp.tapToPause')}
        </p>
      </div>
    )
  }

  if (phase === 'questions') {
    const question = passage.questions[qIndex]!
    const chosen = answers[qIndex]
    const answered = chosen !== undefined
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3 px-4 py-6" data-daily-rsvp="questions" data-question={qIndex}>
        <p className="text-center text-xs text-muted-foreground">{t('training.dailyRsvp.questionOf', { n: qIndex + 1, total: passage.questions.length })}</p>
        <p lang={lang} className="text-center text-base font-semibold text-foreground">{question.q}</p>
        <div className="flex flex-col gap-2" role="group">
          {question.options.map((option, i) => {
            const look = !answered ? '' : i === question.answer ? 'border-emerald-500 bg-emerald-500/10' : i === chosen ? 'border-amber-500 bg-amber-500/10' : 'opacity-50'
            return (
              <button
                key={option}
                type="button"
                lang={lang}
                disabled={answered}
                onClick={() => setAnswers((prev) => (prev.length === qIndex ? [...prev, i] : prev))}
                className={`rounded-2xl border-2 border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-all active:scale-[0.98] ${look}`}
                data-option={i}
              >
                {option}
              </button>
            )
          })}
        </div>
        {answered && (
          <>
            <p className={`text-center text-sm font-semibold ${chosen === question.answer ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-300'}`} aria-live="polite">
              {chosen === question.answer ? t('training.dailyRsvp.correct') : t('training.dailyRsvp.notQuite')}
            </p>
            <Button
              size="lg"
              className="w-full rounded-full"
              onClick={() => (qIndex + 1 < passage.questions.length ? setQIndex(qIndex + 1) : void finish(answers))}
              data-rsvp-next="true"
            >
              {t('training.dailyRsvp.next')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </>
        )}
      </div>
    )
  }

  // Result: today's numbers, change since yesterday and since the first day, the chart.
  const today = result!
  const others = (state?.history ?? []).filter((r) => r.day !== today.day)
  const history = isReplay || planDay === null ? state?.history ?? [] : [...others, today].sort((a, b) => a.day - b.day)
  const growth = dailyRsvpGrowth(history)
  const diff = previous === null ? null : today.wpm - previous.wpm
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-6 text-center" data-daily-rsvp="result" data-rsvp-result-wpm={today.wpm} data-rsvp-result-retention={today.retentionPercent}>
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.dailyRsvp.resultTitle', { day: today.day })}</p>
      <div className="grid w-full grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{t('training.dailyRsvp.speed')}</p>
          <p className="font-heading text-3xl font-bold tabular-nums text-foreground">
            {today.wpm}
            <span className="ml-1 text-sm font-semibold text-muted-foreground">{t('training.dailyRsvp.wpm')}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{t('training.dailyRsvp.retention')}</p>
          <p className="font-heading text-3xl font-bold tabular-nums text-foreground">{today.retentionPercent}%</p>
        </div>
      </div>
      {diff !== null && (
        <p className="text-sm font-semibold text-foreground">
          {diff > 0 ? t('training.dailyRsvp.changeUp', { diff }) : diff < 0 ? t('training.dailyRsvp.changeDown', { diff: -diff }) : t('training.dailyRsvp.changeSame')}
        </p>
      )}
      {growth !== null && growth.firstDay !== growth.latestDay && (
        <p className="text-sm text-muted-foreground">
          {growth.wpmGain > 0
            ? t('training.dailyRsvp.growthUp', { diff: growth.wpmGain, pct: growth.wpmGainPercent, day: growth.firstDay })
            : growth.wpmGain < 0
              ? t('training.dailyRsvp.growthDown', { diff: -growth.wpmGain, day: growth.firstDay })
              : t('training.dailyRsvp.growthSame', { day: growth.firstDay })}
        </p>
      )}
      {!isReplay && <p className="text-xs text-muted-foreground">{t('training.dailyRsvp.tomorrow', { wpm: nextWpmAfter(today) })}</p>}
      {isReplay && <p className="text-xs text-muted-foreground">{t('training.dailyRsvp.replayNote')}</p>}
      {saveFailed && <p className="text-xs text-amber-700 dark:text-amber-300" role="status">{t('training.dailyRsvp.saveFailed')}</p>}

      <div className="w-full rounded-3xl border border-border bg-card p-4 text-left">
        <p className="mb-2 text-sm font-semibold text-foreground">{t('training.dailyRsvp.chartTitle')}</p>
        <DailyRsvpChart history={history} highlightDay={isReplay ? null : today.day} />
      </div>

      <Button size="lg" className="w-full rounded-full" onClick={() => (onComplete ? onComplete() : router.push('/labs/sharp-brain/thirty-day-curriculum'))} data-rsvp-continue="true">
        {t('training.dailyRsvp.continue')}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
