'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CERTIFICATE_ROUTE } from '@/features/certificate/components/CertificateReadyCard'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import { hasReachedEnd } from '@/features/reading-speed-test/scoring'
import { shareOrDownload } from '@/features/reading-speed-test/shareCard'
import { finishFairReading, getFairTestContext, startFairTest, submitFairAnswers, type ShownQuestion } from '../actions'
import { beforeAfter, percentChange, type FairResult } from '../fairTest'
import { drawBeforeAfterCard } from '../beforeAfterCard'
import type { FairLang } from '../forms'

type CheckpointDay = 1 | 7 | 14 | 21 | 30

type FairReadingTestProps = {
  /** The checkpoint day, or null for an existing learner's one-time fair baseline. */
  day: CheckpointDay | null
  onComplete: (result: FairResult) => void
  /** One-time baseline only: postpone to the next session. */
  onPostpone?: () => void
}

type Stage =
  | { name: 'loading' }
  | { name: 'intro' }
  | { name: 'reading'; token: string; title: string; text: string }
  | { name: 'questions'; token: string; questions: ShownQuestion[]; answers: (number | null)[]; index: number }
  | { name: 'too-fast' }
  | { name: 'result'; result: FairResult }
  | { name: 'error'; message: string }

// The fair reading test (Phase 3, item 1): a matched passage read at the
// learner's own pace, timed by the server; then 5 questions with the passage
// hidden. Effective speed = WPM × comprehension.
export function FairReadingTest({ day, onComplete, onPostpone }: FairReadingTestProps): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [stage, setStage] = useState<Stage>({ name: 'loading' })
  const [results, setResults] = useState<FairResult[]>([])
  const [firstName, setFirstName] = useState('')
  const [lang, setLang] = useState<FairLang>(uiLang === 'hi' ? 'hi' : 'en')
  const [busy, setBusy] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Each new screen starts at its top (window or full-screen panel).
  useEffect(() => {
    rootRef.current?.scrollIntoView({ block: 'start' })
  }, [stage.name])

  const baseline = results.find((r) => r.kind === 'baseline') ?? null
  const lockedLang = baseline?.lang ?? null
  const title = day === 30 ? t('training.fairTest.finalTitle') : day === null || day === 1 ? t('training.fairTest.baselineTitle') : t('training.fairTest.checkpointTitle', { day })

  useEffect(() => {
    void getFairTestContext().then((ctx) => {
      setResults(ctx.results)
      setFirstName(ctx.firstName)
      setStage({ name: 'intro' })
    })
  }, [])

  const begin = useCallback(
    async (retake: boolean): Promise<void> => {
      setBusy(true)
      const res = await startFairTest({ day, lang: lockedLang ?? lang, retake })
      setBusy(false)
      if (!res.ok) return setStage({ name: 'error', message: res.error === 'retake-used' ? t('training.fairTest.retakeUsed') : t('training.fairTest.error') })
      setStage({ name: 'reading', token: res.token, title: res.passage.title, text: res.passage.text })
    },
    [day, lang, lockedLang, t],
  )

  async function done(token: string): Promise<void> {
    setBusy(true)
    const res = await finishFairReading({ token })
    setBusy(false)
    if (!res.ok) return setStage({ name: 'error', message: t('training.fairTest.error') })
    setStage({ name: 'questions', token: res.token, questions: res.questions, answers: res.questions.map(() => null), index: 0 })
  }

  async function submit(token: string, answers: number[]): Promise<void> {
    setBusy(true)
    const res = await submitFairAnswers({ token, answers })
    setBusy(false)
    if (!res.ok) return setStage({ name: 'error', message: t('training.fairTest.error') })
    if (res.tooFast) return setStage({ name: 'too-fast' })
    setResults((prev) => [...prev, res.result])
    setStage({ name: 'result', result: res.result })
  }

  const shell = (children: React.ReactNode): React.JSX.Element => (
    <div ref={rootRef} className="mx-auto flex w-full max-w-xl scroll-mt-4 flex-col gap-5 px-4 py-6" data-fair-test={stage.name}>
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.skills.smartReading')}</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-foreground">{day === null ? t('training.fairTest.oneTimeTitle') : title}</h1>
      </div>
      {children}
    </div>
  )

  if (stage.name === 'loading') return shell(<p className="text-sm text-muted-foreground">{t('training.shell.loading')}</p>)

  if (stage.name === 'error')
    return shell(
      <>
        <p className="text-sm text-foreground" role="alert">{stage.message}</p>
        <Button size="lg" className="min-h-12 rounded-full" onClick={() => setStage({ name: 'intro' })}>
          {t('common.actions.retry')}
        </Button>
      </>,
    )

  if (stage.name === 'intro') {
    return shell(
      <>
        {day === null && <p className="text-sm text-foreground">{t('training.fairTest.oneTimeBody')}</p>}
        <p className="text-sm text-muted-foreground">{t('training.fairTest.intro')}</p>
        {lockedLang === null ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-foreground">{t('training.fairTest.chooseLang')}</p>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {(['en', 'hi'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  role="radio"
                  aria-checked={lang === l}
                  onClick={() => setLang(l)}
                  className={`min-h-12 rounded-2xl border-2 text-base font-semibold ${lang === l ? 'border-primary bg-primary/10 text-foreground' : 'border-border/60 text-muted-foreground'}`}
                  data-test-lang={l}
                >
                  {LANGUAGES[l].nativeName}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{t('training.fairTest.langNote')}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('training.fairTest.langLocked', { language: LANGUAGES[lockedLang].nativeName })}</p>
        )}
        <Button size="lg" className="min-h-12 rounded-full" disabled={busy} onClick={() => void begin(false)} data-fair-start="true">
          {day === null ? t('training.fairTest.oneTimeStart') : t('training.fairTest.start')}
        </Button>
        {day === null && onPostpone && (
          <Button variant="ghost" size="lg" className="min-h-12" onClick={onPostpone} data-fair-postpone="true">
            {t('training.fairTest.tomorrow')}
          </Button>
        )}
      </>,
    )
  }

  if (stage.name === 'reading') return shell(<ReadingStage title={stage.title} text={stage.text} busy={busy} onDone={() => void done(stage.token)} />)

  if (stage.name === 'questions') {
    const q = stage.questions[stage.index]!
    const chosen = stage.answers[stage.index]
    const last = stage.index === stage.questions.length - 1
    return shell(
      <div className="flex flex-col gap-4" data-fair-question={stage.index + 1}>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.fairTest.questionOf', { n: stage.index + 1, total: stage.questions.length })}</p>
        <p className="text-lg font-semibold text-foreground">{q.question}</p>
        <div className="flex flex-col gap-2" role="radiogroup">
          {q.options.map((o, i) => (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={chosen === i}
              onClick={() => setStage({ ...stage, answers: stage.answers.map((a, j) => (j === stage.index ? i : a)) })}
              className={`min-h-12 rounded-2xl border-2 px-4 py-3 text-left text-base ${chosen === i ? 'border-primary bg-primary/10 text-foreground' : 'border-border/60 text-foreground'}`}
              data-fair-option={i}
            >
              {o}
            </button>
          ))}
        </div>
        <Button
          size="lg"
          className="min-h-12 rounded-full"
          disabled={chosen === null || busy}
          onClick={() => (last ? void submit(stage.token, stage.answers.map((a) => a ?? 0)) : setStage({ ...stage, index: stage.index + 1 }))}
          data-fair-next="true"
        >
          {last ? t('training.fairTest.submit') : t('common.actions.next')}
        </Button>
      </div>,
    )
  }

  if (stage.name === 'too-fast')
    return shell(
      <>
        <p className="font-semibold text-foreground">{t('training.fairTest.tooFastTitle')}</p>
        <p className="text-sm text-muted-foreground">{t('training.fairTest.tooFastBody')}</p>
        <Button size="lg" className="min-h-12 rounded-full" disabled={busy} onClick={() => void begin(true)} data-fair-reserve="true">
          {t('training.fairTest.readReserve')}
        </Button>
      </>,
    )

  return shell(<ResultView result={stage.result} results={results} firstName={firstName} onContinue={() => onComplete(stage.result)} />)
}

function ReadingStage({ title, text, busy, onDone }: { title: string; text: string; busy: boolean; onDone: () => void }): React.JSX.Element {
  const t = useAppT()
  const endRef = useRef<HTMLDivElement>(null)
  const [reachedEnd, setReachedEnd] = useState(false)
  useEffect(() => {
    const check = (): void => {
      const marker = endRef.current
      if (marker !== null && hasReachedEnd(marker.getBoundingClientRect().top, window.innerHeight)) setReachedEnd(true)
    }
    check()
    // Capture: also hears scrolling inside a full-screen panel (the one-time baseline).
    window.addEventListener('scroll', check, { passive: true, capture: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check, { capture: true })
      window.removeEventListener('resize', check)
    }
  }, [])
  return (
    <article className="flex flex-col gap-4" data-fair-reading="true">
      <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className="text-lg leading-relaxed text-foreground">
          {p}
        </p>
      ))}
      <div ref={endRef} aria-hidden="true" />
      {!reachedEnd && <p className="text-xs text-muted-foreground">{t('training.fairTest.doneHint')}</p>}
      <Button size="lg" className="min-h-12 rounded-full" disabled={!reachedEnd || busy} onClick={onDone} data-fair-done="true">
        {t('training.fairTest.done')}
      </Button>
    </article>
  )
}

function ResultView({ result, results, firstName, onContinue }: { result: FairResult; results: FairResult[]; firstName: string; onContinue: () => void }): React.JSX.Element {
  const t = useAppT()
  const pair = result.kind === 'final' ? beforeAfter(results) : null
  const tiles = [
    { label: t('training.fairTest.wpm'), value: `${result.wpm}`, note: t('training.fairTest.wpmUnit') },
    { label: t('training.fairTest.comprehension'), value: `${result.comprehensionPercent}%`, note: '' },
    { label: t('training.fairTest.effective'), value: `${result.effectiveWpm}`, note: t('training.fairTest.effectiveExplain') },
  ]
  const change = (before: number, after: number): string => {
    const c = percentChange(before, after)
    return c === null ? '—' : `${c > 0 ? '+' : ''}${c}%`
  }

  async function share(): Promise<void> {
    if (!pair?.after) return
    const { before, after } = pair
    const blob = await drawBeforeAfterCard({
      brand: 'Sharp Brain',
      title: t('training.fairTest.cardTitle'),
      firstName,
      beforeLabel: before.day === 1 || before.day === null ? t('training.fairTest.day1') : t('training.fairTest.baselineOnDay', { day: before.day }),
      afterLabel: t('training.fairTest.day30'),
      rows: [
        { label: t('training.fairTest.wpm'), before: `${before.wpm}`, after: `${after.wpm}`, change: change(before.wpm, after.wpm) },
        { label: t('training.fairTest.comprehension'), before: `${before.comprehensionPercent}%`, after: `${after.comprehensionPercent}%`, change: change(before.comprehensionPercent, after.comprehensionPercent) },
        { label: t('training.fairTest.effective'), before: `${before.effectiveWpm}`, after: `${after.effectiveWpm}`, change: change(before.effectiveWpm, after.effectiveWpm) },
      ],
      footnote: LANGUAGES[after.lang].nativeName,
    })
    await shareOrDownload(blob, t('training.fairTest.shareText', { effective: after.effectiveWpm, change: change(before.effectiveWpm, after.effectiveWpm) })).catch(() => undefined)
  }

  return (
    <div className="flex flex-col gap-4" data-fair-result={`${result.wpm}/${result.comprehensionPercent}/${result.effectiveWpm}`}>
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.fairTest.resultTitle')}</p>
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((tile) => (
          <div key={tile.label} className="flex flex-col items-center rounded-2xl border border-border/60 bg-card p-3 text-center">
            <span className="text-xs text-muted-foreground">{tile.label}</span>
            <span className="font-heading text-2xl font-bold text-foreground">{tile.value}</span>
            {tile.note && <span className="text-[11px] leading-tight text-muted-foreground">{tile.note}</span>}
          </div>
        ))}
      </div>
      {result.status === 'low_comprehension' && <p className="text-sm text-muted-foreground">{t('training.fairTest.lowComp')}</p>}

      {pair?.after && (
        <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-4" data-fair-before-after="true">
          <p className="font-semibold text-foreground">{t('training.fairTest.beforeAfterTitle')}</p>
          {pair.before.day !== 1 && pair.before.day !== null && <p className="text-xs text-muted-foreground">{t('training.fairTest.baselineOnDay', { day: pair.before.day })}</p>}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left font-normal" />
                <th className="font-normal">{pair.before.day === 1 || pair.before.day === null ? t('training.fairTest.day1') : `${pair.before.day}`}</th>
                <th className="font-normal">{t('training.fairTest.day30')}</th>
                <th />
              </tr>
            </thead>
            <tbody className="text-foreground">
              {(
                [
                  [t('training.fairTest.wpm'), pair.before.wpm, pair.after.wpm, ''],
                  [t('training.fairTest.comprehension'), pair.before.comprehensionPercent, pair.after.comprehensionPercent, '%'],
                  [t('training.fairTest.effective'), pair.before.effectiveWpm, pair.after.effectiveWpm, ''],
                ] as const
              ).map(([label, b, a, unit]) => (
                <tr key={label}>
                  <td className="py-1">{label}</td>
                  <td className="text-center">{`${b}${unit}`}</td>
                  <td className="text-center font-semibold">{`${a}${unit}`}</td>
                  <td className={`text-right font-semibold ${a > b ? 'text-emerald-600' : 'text-muted-foreground'}`}>{change(b, a)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="outline" size="lg" className="min-h-12 rounded-full" onClick={() => void share()} data-fair-share="true">
            {t('training.fairTest.share')}
          </Button>
          <Button asChild size="lg" className="min-h-12 rounded-full" data-fair-certificate="true">
            <Link href={CERTIFICATE_ROUTE}>{t('training.certificate.cardCta')}</Link>
          </Button>
        </div>
      )}

      <Button size="lg" className="min-h-12 rounded-full" onClick={onContinue} data-fair-continue="true">
        {t('training.fairTest.continue')}
      </Button>
    </div>
  )
}
