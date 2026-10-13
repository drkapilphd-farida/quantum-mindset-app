'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronsLeft, Coffee, Minus, Pause, Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { saveExerciseResult } from '@/features/exercise-core/actions/exerciseResults'
import { FeedbackSheet, type Feedback } from '@/components/play/FeedbackSheet'
import { Stars, starsFor } from '@/components/play/Stars'
import { getReaderStart, saveReaderPosition } from '../actions'
import { backOneSentence, BREAK_REMINDER_MS, clampWpm, clusters, effectiveWpm, focusIndex, nextWpm, SMART_READER_EXERCISE_ID, WPM_STEP, wordDurationMs, words, type ReaderMode, type ReaderSection } from '../reader'

type Stage =
  | { name: 'loading' }
  | { name: 'intro' }
  | { name: 'reading' }
  | { name: 'questions'; q: number }
  | { name: 'break'; left: number }
  | { name: 'done' }

export type ReaderResult = { wpm: number; comprehension: number; effective: number }

const CHUNK = 3

// Smart Reader: read a passage (or the learner's own chapter) section by
// section in Guided Pacer, Word Flash or Normal mode → 2 questions after each
// section → the speed adapts → effective speed and a one-line summary. The
// reading place is saved, so it resumes on any phone. Text sits on a light
// "paper" card in both themes.
export function SmartReader({ title, sections, source, sourceRef, onFinished, onExit }: { title: string; sections: readonly ReaderSection[]; source: 'library' | 'chapter'; sourceRef: string; onFinished?: (r: ReaderResult) => void; onExit: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [stage, setStage] = useState<Stage>({ name: 'loading' })
  const [mode, setMode] = useState<ReaderMode>('pacer')
  const [wpm, setWpm] = useState(180)
  const [section, setSection] = useState(0)
  const [at, setAt] = useState(0)
  const [paused, setPaused] = useState(true)
  const [suggestPacer, setSuggestPacer] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [pending, setPending] = useState<{ chosen: number; right: boolean; feedback: Feedback } | null>(null)
  const [sectionCorrect, setSectionCorrect] = useState(0)
  const [summary, setSummary] = useState('')
  const [summarySaved, setSummarySaved] = useState(false)
  const [showBreakTip, setShowBreakTip] = useState(false)
  const readMs = useRef(0)
  const readWords = useRef(0)
  const wpmSum = useRef({ total: 0, n: 0 })
  const normalStart = useRef<number | null>(null)
  const started = useRef(performance.now())

  const ws = useMemo(() => words(sections[section]?.text ?? ''), [sections, section])
  const paraEnds = useMemo(() => {
    const ends = new Set<number>()
    let i = 0
    for (const p of (sections[section]?.text ?? '').split(/\n\s*\n/)) {
      i += words(p).length
      ends.add(i - 1)
    }
    return ends
  }, [sections, section])

  useEffect(() => {
    void getReaderStart({ source, ref: sourceRef }).then((s) => {
      setWpm(s.wpm)
      setMode(s.mode)
      if (!s.finished && s.section < sections.length) {
        setSection(s.section)
        setAt(s.wordIndex)
      }
      setStage({ name: 'intro' })
    })
  }, [source, sourceRef, sections.length])

  const savePlace = useCallback(
    (over: Partial<{ section: number; wordIndex: number; finished: boolean }> = {}) => {
      void saveReaderPosition({ source, ref: sourceRef, section: over.section ?? section, wordIndex: over.wordIndex ?? at, wpm: clampWpm(wpm), mode, finished: over.finished ?? false })
    },
    [source, sourceRef, section, at, wpm, mode],
  )

  const endSection = useCallback(() => {
    setPaused(true)
    savePlace({ wordIndex: 0 })
    const qs = sections[section]?.questions ?? []
    setSectionCorrect(0)
    if (qs.length > 0) setStage({ name: 'questions', q: 0 })
    else afterQuestions(0, 0)
  }, [sections, section, savePlace]) // eslint-disable-line react-hooks/exhaustive-deps

  // The pacer / word-flash clock.
  useEffect(() => {
    if (stage.name !== 'reading' || paused || mode === 'normal') return
    if (at >= ws.length) {
      endSection()
      return
    }
    const step = mode === 'pacer' ? CHUNK : 1
    let ms = 0
    for (let k = 0; k < step && at + k < ws.length; k++) ms += mode === 'flash' ? wordDurationMs(ws[at + k]!, wpm, paraEnds.has(at + k)) : (60_000 / wpm) * (/[.!?।]["”’)]?$/.test(ws[at + k]!) ? 1.4 : 1)
    const id = window.setTimeout(() => {
      readMs.current += ms
      readWords.current += Math.min(step, ws.length - at)
      if (readMs.current > BREAK_REMINDER_MS && !showBreakTip) setShowBreakTip(true)
      setAt((a) => a + step)
    }, ms)
    return () => window.clearTimeout(id)
  }, [stage.name, paused, mode, at, ws, wpm, paraEnds, endSection, showBreakTip])

  // Space toggles pause.
  useEffect(() => {
    if (stage.name !== 'reading') return
    const onKey = (e: KeyboardEvent): void => {
      if (e.code === 'Space' && mode !== 'normal') {
        e.preventDefault()
        setPaused((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stage.name, mode])

  // Save the place every 20 s of reading.
  useEffect(() => {
    if (stage.name !== 'reading' || paused) return
    const id = window.setInterval(() => savePlace(), 20_000)
    return () => window.clearInterval(id)
  }, [stage.name, paused, savePlace])

  function afterQuestions(correct: number, total: number): void {
    wpmSum.current = { total: wpmSum.current.total + wpm, n: wpmSum.current.n + 1 }
    const adapt = nextWpm(wpm, correct, total)
    setWpm(adapt.wpm)
    setSuggestPacer(adapt.suggestPacer && mode !== 'pacer')
    if (section + 1 < sections.length) {
      setSection(section + 1)
      setAt(0)
      savePlace({ section: section + 1, wordIndex: 0 })
      setStage({ name: 'intro' })
    } else {
      savePlace({ section: 0, wordIndex: 0, finished: true })
      setStage({ name: 'done' })
    }
  }

  const avgWpm = wpmSum.current.n > 0 ? Math.round(wpmSum.current.total / wpmSum.current.n) : wpm
  const comprehension = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 100

  useEffect(() => {
    if (stage.name !== 'done') return
    const eff = effectiveWpm(avgWpm, comprehension)
    void saveExerciseResult({
      exerciseId: SMART_READER_EXERCISE_ID,
      score: eff,
      accuracyPercent: score.total > 0 ? comprehension : null,
      levelStart: null,
      levelEnd: null,
      goodRun: 0,
      poorRun: 0,
      rounds: sections.length,
      durationMs: Math.min(86_400_000, Math.round(performance.now() - started.current)),
      curriculumDay: null,
      isReplay: false,
      contentLang: uiLang === 'bn' ? null : uiLang,
      extra: { source, ref: sourceRef.slice(0, 80), wpm: avgWpm, mode },
    }).catch(() => undefined)
  }, [stage.name]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Screens ────────────────────────────────────────────────────────────
  const header = (
    <div className="flex items-center justify-between gap-2">
      <button type="button" onClick={() => (savePlace(), onExit())} className="text-sm font-semibold text-muted-foreground" data-reader-exit="true">
        ✕ {t('training.reader.close')}
      </button>
      <span className="rounded-full px-3 py-0.5 text-xs font-bold text-white uppercase" style={{ background: '#c2410c' }}>
        {t('training.reader.skill')}
      </span>
    </div>
  )

  if (stage.name === 'loading') return <div className="py-24 text-center text-sm text-muted-foreground">{t('training.shell.loading')}</div>

  if (stage.name === 'break')
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-10 text-center" data-reader-break={stage.left}>
        <h2 className="text-[1.75rem] text-foreground">{t('training.reader.breakTitle')}</h2>
        <div className="flex size-44 items-center justify-center rounded-full motion-safe:animate-pulse" style={{ background: 'color-mix(in srgb, var(--skill-calm, #0d9488) 25%, transparent)' }}>
          <span className="font-heading text-5xl text-foreground tabular-nums">{stage.left}</span>
        </div>
        <p className="max-w-xs text-base text-muted-foreground">{t('training.reader.breakHint')}</p>
        <BreakTimer stage={stage} onTick={(left) => setStage(left <= 0 ? { name: 'reading' } : { name: 'break', left })} />
        <Button size="lg" className="min-h-12 w-full max-w-xs rounded-2xl" onClick={() => setStage({ name: 'reading' })} data-reader-resume="true">
          {t('training.reader.resume')}
        </Button>
      </div>
    )

  if (stage.name === 'questions') {
    const qs = sections[section]!.questions
    const q = qs[stage.q]!
    const choose = (i: number): void => {
      if (pending !== null) return
      const right = i === q.correctIndex
      setPending({ chosen: i, right, feedback: right ? { kind: 'good', points: 3 } : { kind: 'warn', answer: t('training.play.answerIs', { answer: q.options[q.correctIndex] ?? '' }), tip: t('training.reader.questionTip'), comesBack: false } })
    }
    const next = (): void => {
      if (pending === null) return
      const c = sectionCorrect + (pending.right ? 1 : 0)
      setScore((s) => ({ correct: s.correct + (pending.right ? 1 : 0), total: s.total + 1 }))
      setPending(null)
      setSectionCorrect(c)
      if (stage.q + 1 < qs.length) setStage({ name: 'questions', q: stage.q + 1 })
      else afterQuestions(c, qs.length)
    }
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6 pb-56" data-reader-question={stage.q}>
        {header}
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.reader.questionOf', { n: stage.q + 1, total: qs.length, section: section + 1 })}</p>
        <h2 className="text-2xl break-words text-foreground">{q.question}</h2>
        <div className="flex flex-col gap-3">
          {q.options.map((o, i) => (
            <button key={i} type="button" disabled={pending !== null} onClick={() => choose(i)} className="play-option min-h-14 px-4 py-2 text-left text-lg font-semibold break-words text-foreground" data-state={pending === null ? 'idle' : i === q.correctIndex ? 'right' : i === pending.chosen ? 'chosen' : 'idle'} data-reader-option={i}>
              {o}
            </button>
          ))}
        </div>
        {pending !== null && <FeedbackSheet feedback={pending.feedback} onContinue={next} />}
      </div>
    )
  }

  if (stage.name === 'done') {
    const eff = effectiveWpm(avgWpm, comprehension)
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-8 text-center" data-reader-done={eff}>
        <Stars count={starsFor(score.correct, Math.max(1, score.total))} size={44} />
        <h2 className="text-[2rem] text-foreground">{t('training.reader.doneTitle')}</h2>
        <div className="grid w-full grid-cols-3 gap-2">
          {[
            [String(avgWpm), t('training.reader.wpm')],
            [score.total > 0 ? `${comprehension}%` : '—', t('training.reader.comprehension')],
            [String(eff), t('training.reader.effective')],
          ].map(([v, l]) => (
            <div key={l} className="play-card px-2 py-3">
              <p className="font-heading text-2xl text-foreground tabular-nums">{v}</p>
              <p className="text-xs font-semibold text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{t('training.reader.effectiveHint')}</p>
        <label className="flex w-full flex-col gap-1 text-left">
          <span className="text-base font-bold text-foreground">{t('training.reader.summaryLabel')}</span>
          <input value={summary} maxLength={160} onChange={(e) => (setSummary(e.target.value), setSummarySaved(false))} placeholder={t('training.reader.summaryPlaceholder')} className="min-h-12 rounded-xl border-2 border-border bg-card px-3 text-base text-foreground" data-reader-summary="true" />
        </label>
        <Button
          variant="outline"
          className="min-h-11 self-start rounded-xl"
          disabled={summary.trim() === '' || summarySaved}
          onClick={() => {
            const s = summary.trim()
            void saveExerciseResult({ exerciseId: 'smart-reader-summary', score: 0, accuracyPercent: null, levelStart: null, levelEnd: null, goodRun: 0, poorRun: 0, rounds: 1, durationMs: 0, curriculumDay: null, isReplay: false, contentLang: uiLang === 'bn' ? null : uiLang, extra: { ref: sourceRef.slice(0, 80), summary: s.slice(0, 80), summary2: s.slice(80, 160) } }).then(() => setSummarySaved(true))
          }}
          data-reader-save-summary="true"
        >
          {summarySaved ? t('training.reader.summarySaved') : t('training.reader.saveSummary')}
        </Button>
        <Button size="lg" className="btn-finish min-h-12 w-full rounded-2xl" onClick={() => (onFinished ? onFinished({ wpm: avgWpm, comprehension, effective: eff }) : onExit())} data-reader-finish="true">
          {onFinished ? t('training.reader.toKeyIdeas') : t('training.reader.finish')}
        </Button>
      </div>
    )
  }

  if (stage.name === 'intro') {
    const modes: { key: ReaderMode; label: string; sub: string }[] = [
      { key: 'pacer', label: t('training.reader.modePacer'), sub: t('training.reader.modePacerSub') },
      { key: 'flash', label: t('training.reader.modeFlash'), sub: t('training.reader.modeFlashSub') },
      { key: 'normal', label: t('training.reader.modeNormal'), sub: t('training.reader.modeNormalSub') },
    ]
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6" data-reader-intro={section}>
        {header}
        <div>
          <h1 className="text-[1.75rem] break-words text-foreground">{title}</h1>
          <p className="text-sm font-semibold text-muted-foreground">{t('training.reader.sectionOf', { n: section + 1, total: sections.length })}{sections[section]?.heading ? ` · ${sections[section]!.heading}` : ''}</p>
        </div>
        {suggestPacer && (
          <div className="rounded-2xl px-4 py-3 text-sm text-foreground" style={{ background: 'var(--play-warn-bg)' }} data-reader-suggest-pacer="true">
            {t('training.reader.suggestPacer')}
          </div>
        )}
        <div className="flex flex-col gap-2" role="radiogroup" aria-label={t('training.reader.mode')}>
          {modes.map((m) => (
            <button key={m.key} type="button" role="radio" aria-checked={mode === m.key} onClick={() => setMode(m.key)} className={`play-card flex flex-col items-start px-4 py-3 text-left ${mode === m.key ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`} data-reader-mode={m.key}>
              <span className="text-lg font-bold text-foreground">{m.label}</span>
              <span className="text-sm text-muted-foreground">{m.sub}</span>
            </button>
          ))}
        </div>
        {mode !== 'normal' && <SpeedControl wpm={wpm} onChange={setWpm} />}
        <Button size="lg" className="min-h-12 rounded-2xl" onClick={() => (setStage({ name: 'reading' }), setPaused(false), (normalStart.current = performance.now()))} data-reader-start="true">
          {at > 0 ? t('training.reader.resumeHere') : t('training.reader.start')}
        </Button>
      </div>
    )
  }

  // Reading
  const pause = (): void => setPaused((p) => !p)
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col gap-3 px-4 py-4" data-reader-reading={section} data-reader-at={at}>
      {header}
      <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, (at / Math.max(1, ws.length)) * 100)}%`, background: '#ea580c' }} />
      </div>
      {showBreakTip && (
        <div className="flex items-center justify-between gap-2 rounded-2xl px-4 py-2 text-sm text-foreground" style={{ background: 'var(--play-warn-bg)' }} data-reader-break-tip="true">
          {t('training.reader.breakTip')}
          <button type="button" className="font-bold underline" onClick={() => (setShowBreakTip(false), setStage({ name: 'break', left: 60 }))}>
            {t('training.reader.takeBreak')}
          </button>
        </div>
      )}
      <div className="paper flex-1 p-4 shadow-sm" onClick={mode === 'normal' ? undefined : pause} role={mode === 'normal' ? undefined : 'button'} aria-label={mode === 'normal' ? undefined : paused ? t('training.reader.resume') : t('training.reader.pause')} data-reader-paper={mode}>
        {mode === 'flash' ? (
          <FlashWord word={ws[Math.min(at, ws.length - 1)] ?? ''} />
        ) : (
          <div className="text-[1.1875rem] leading-[1.75] text-[#1b1b2f]">
            {(sections[section]?.text ?? '').split(/\n\s*\n/).map((para, pi, all) => {
              const offset = all.slice(0, pi).reduce((n, p) => n + words(p).length, 0)
              return (
                <p key={pi} className="mb-4">
                  {words(para).map((w, wi) => {
                    const i = offset + wi
                    const lit = mode === 'pacer' && i >= at && i < at + CHUNK
                    return (
                      <span key={i} ref={lit && wi === 0 ? (el) => el?.scrollIntoView({ block: 'center', behavior: 'smooth' }) : undefined} className={lit ? 'rounded bg-[#fde68a] px-0.5' : mode === 'pacer' && i < at ? 'text-[#1b1b2f]/55' : ''}>
                        {w}{' '}
                      </span>
                    )
                  })}
                </p>
              )
            })}
          </div>
        )}
      </div>
      <div className="sticky bottom-0 flex items-center justify-between gap-2 bg-background/95 py-2" data-reader-controls="true">
        {mode === 'normal' ? (
          <Button
            size="lg"
            className="min-h-12 flex-1 rounded-2xl"
            onClick={() => {
              const ms = performance.now() - (normalStart.current ?? performance.now())
              const measured = ms > 3000 ? clampWpm((ws.length / ms) * 60_000) : wpm
              readMs.current += ms
              setWpm(measured)
              endSection()
            }}
            data-reader-normal-done="true"
          >
            {t('training.reader.doneReading')}
          </Button>
        ) : (
          <>
            <button type="button" onClick={() => setAt(backOneSentence(ws, at))} aria-label={t('training.reader.back')} className="play-option flex size-12 items-center justify-center" data-reader-back="true">
              <ChevronsLeft className="size-5" aria-hidden="true" />
            </button>
            <SpeedControl wpm={wpm} onChange={setWpm} compact />
            <button type="button" onClick={pause} aria-label={paused ? t('training.reader.resume') : t('training.reader.pause')} className="flex size-14 items-center justify-center rounded-full text-white" style={{ background: '#7c3aed' }} data-reader-pause={paused ? 'paused' : 'playing'}>
              {paused ? <Play className="size-6" aria-hidden="true" /> : <Pause className="size-6" aria-hidden="true" />}
            </button>
          </>
        )}
        <button type="button" onClick={() => (setPaused(true), savePlace(), setStage({ name: 'break', left: 60 }))} aria-label={t('training.reader.tired')} className="play-option flex h-12 items-center gap-1 px-3 text-sm font-bold text-foreground" data-reader-tired="true">
          <Coffee className="size-4" aria-hidden="true" />
          {t('training.reader.tired')}
        </button>
      </div>
    </div>
  )
}

function BreakTimer({ stage, onTick }: { stage: Stage; onTick: (left: number) => void }): null {
  useEffect(() => {
    if (stage.name !== 'break') return
    const id = window.setTimeout(() => onTick(stage.left - 1), 1000)
    return () => window.clearTimeout(id)
  })
  return null
}

function SpeedControl({ wpm, onChange, compact = false }: { wpm: number; onChange: (w: number) => void; compact?: boolean }): React.JSX.Element {
  const t = useAppT()
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'self-start'}`} data-reader-speed={wpm}>
      <button type="button" onClick={() => onChange(clampWpm(wpm - WPM_STEP))} aria-label={t('training.reader.slower')} className="play-option flex size-11 items-center justify-center">
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span className="min-w-20 text-center font-heading text-lg text-foreground tabular-nums">{t('training.reader.wpmValue', { n: wpm })}</span>
      <button type="button" onClick={() => onChange(clampWpm(wpm + WPM_STEP))} aria-label={t('training.reader.faster')} className="play-option flex size-11 items-center justify-center">
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

/** Word Flash: one word, its focus letter (a whole cluster in Indian scripts) in orange; Indian scripts get a soft underline instead of a colour change only. */
function FlashWord({ word }: { word: string }): React.JSX.Element {
  const cs = clusters(word)
  const f = focusIndex(word)
  const indic = /[ऀ-෿]/.test(word)
  return (
    <div className="flex min-h-56 items-center justify-center" data-reader-flash={word}>
      <span className="font-heading text-[2.75rem] text-[#1b1b2f]">
        {cs.map((c, i) => (
          <span key={i} className={i === f ? (indic ? 'text-[#c2410c] underline decoration-[#ea580c] decoration-4 underline-offset-8' : 'text-[#c2410c]') : ''}>
            {c}
          </span>
        ))}
      </span>
    </div>
  )
}
