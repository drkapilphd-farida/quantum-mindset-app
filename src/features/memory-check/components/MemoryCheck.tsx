'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import { finishMemoryCheck, getMemoryCheckStatus, startMemoryCheck, type MemoryCheckMaterial } from '../actions'
import type { MemoryLang } from '../content'
import { memoryBeforeAfter, type MemoryCheckResult, type MemoryPhase } from '../memoryCheck'
import { IllustratedFace } from './IllustratedFace'
import { MemoryResultParts } from './MemoryResultParts'

const WORD_MS = 2000
const DIGIT_MS = 1000
const FACE_MS = 5000

type Stage =
  | { name: 'loading' }
  | { name: 'intro' }
  | { name: 'words-ready' }
  | { name: 'words'; index: number }
  | { name: 'number-ready' }
  | { name: 'number'; index: number }
  | { name: 'number-recall' }
  | { name: 'word-recall' }
  | { name: 'faces-ready' }
  | { name: 'faces'; index: number }
  | { name: 'face-recall'; index: number }
  | { name: 'saving' }
  | { name: 'result'; result: MemoryCheckResult; baseline: MemoryCheckResult | null }
  | { name: 'error' }

type MemoryCheckProps = {
  phase: MemoryPhase
  /** Called when the check is finished — or right away when it isn't open (already taken, or outside its days). */
  onComplete: () => void
  /** The optional starting check for learners on Days 2–7: "Later" closes it for today. */
  onLater?: () => void
}

// The memory check (Day 1 and Day 30): 20 words → a 10-digit number (which is
// also the pause before word recall) → pick the words → 5 name–face pairs.
export function MemoryCheck({ phase, onComplete, onLater }: MemoryCheckProps): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [stage, setStage] = useState<Stage>({ name: 'loading' })
  const [lang, setLang] = useState<MemoryLang>(uiLang === 'hi' ? 'hi' : 'en')
  const [lockedLang, setLockedLang] = useState<MemoryLang | null>(null)
  const [material, setMaterial] = useState<MemoryCheckMaterial | null>(null)
  const [typed, setTyped] = useState('')
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set())
  const [facePicks, setFacePicks] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    rootRef.current?.scrollIntoView({ block: 'start' })
  }, [stage.name])

  useEffect(() => {
    let cancelled = false
    void getMemoryCheckStatus()
      .then((status) => {
        if (cancelled) return
        const open = phase === 'baseline' ? status.baselineOpen : status.finalOpen
        if (!open) return onCompleteRef.current()
        if (phase === 'final' && status.baseline !== null) setLockedLang(status.baseline.lang)
        setStage({ name: 'intro' })
      })
      .catch(() => !cancelled && setStage({ name: 'error' }))
    return () => {
      cancelled = true
    }
  }, [phase])

  // Timed study screens move on by themselves.
  useEffect(() => {
    if (material === null) return undefined
    const after = (ms: number, next: Stage): (() => void) => {
      const timer = window.setTimeout(() => setStage(next), ms)
      return () => window.clearTimeout(timer)
    }
    if (stage.name === 'words') return after(WORD_MS, stage.index + 1 < material.words.length ? { name: 'words', index: stage.index + 1 } : { name: 'number-ready' })
    if (stage.name === 'number') return after(DIGIT_MS, stage.index + 1 < material.number.length ? { name: 'number', index: stage.index + 1 } : { name: 'number-recall' })
    if (stage.name === 'faces') return after(FACE_MS, stage.index + 1 < material.faces.length ? { name: 'faces', index: stage.index + 1 } : { name: 'face-recall', index: 0 })
    return undefined
  }, [stage, material])

  async function begin(): Promise<void> {
    setBusy(true)
    const res = await startMemoryCheck({ phase, lang: lockedLang ?? lang })
    setBusy(false)
    if (!res.ok) return res.error === 'closed' ? onComplete() : setStage({ name: 'error' })
    setMaterial(res)
    setTyped('')
    setPicked(new Set())
    setFacePicks({})
    setStage({ name: 'words-ready' })
  }

  async function save(picks: Record<string, string>): Promise<void> {
    if (material === null) return
    setStage({ name: 'saving' })
    const res = await finishMemoryCheck({ token: material.token, pickedWords: [...picked], typedNumber: typed, facePicks: picks })
    if (!res.ok) return res.error === 'closed' ? onComplete() : setStage({ name: 'error' })
    setStage({ name: 'result', result: res.result, baseline: res.baseline })
  }

  const title = onLater ? t('training.memoryCheck.offerTitle') : phase === 'final' ? t('training.memoryCheck.finalTitle') : t('training.memoryCheck.baselineTitle')
  const shell = (children: React.ReactNode): React.JSX.Element => (
    <div ref={rootRef} className="mx-auto flex w-full max-w-xl scroll-mt-4 flex-col gap-5 px-4 py-6" data-memory-check={stage.name}>
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.skills.memory')}</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-foreground">{title}</h1>
      </div>
      {children}
    </div>
  )
  const primary = (label: string, onClick: () => void, extra: Record<string, string> = {}, disabled = false): React.JSX.Element => (
    <Button size="lg" className="min-h-12 rounded-full" onClick={onClick} disabled={busy || disabled} {...extra}>
      {label}
    </Button>
  )

  if (stage.name === 'loading' || stage.name === 'saving') return shell(<p className="text-sm text-muted-foreground">{t('common.actions.loading')}</p>)

  if (stage.name === 'error')
    return shell(
      <>
        <p className="text-sm text-foreground" role="alert">
          {t('training.memoryCheck.error')}
        </p>
        {primary(t('common.actions.retry'), () => setStage({ name: 'intro' }))}
      </>,
    )

  if (stage.name === 'intro') {
    return shell(
      <>
        {onLater && <p className="text-sm text-foreground">{t('training.memoryCheck.offerBody')}</p>}
        <p className="text-sm text-muted-foreground">{t('training.memoryCheck.intro')}</p>
        {lockedLang === null ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-foreground">{t('training.memoryCheck.chooseLang')}</p>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {(['en', 'hi'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  role="radio"
                  aria-checked={lang === l}
                  onClick={() => setLang(l)}
                  className={`min-h-12 rounded-2xl border-2 text-base font-semibold ${lang === l ? 'border-primary bg-primary/10 text-foreground' : 'border-border/60 text-muted-foreground'}`}
                  data-memory-lang={l}
                >
                  {LANGUAGES[l].nativeName}
                </button>
              ))}
            </div>
            {/* KN/TA/TE/MR/GU/BN: no reviewed words yet — the learner picks English or Hindi, and Day 30 uses the same. */}
            <p className="text-xs text-muted-foreground" data-memory-lang-note={uiLang === 'en' || uiLang === 'hi' ? 'same' : 'choose'}>
              {uiLang === 'en' || uiLang === 'hi' ? t('training.memoryCheck.langNote') : t('training.memoryCheck.otherLangNote')}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('training.memoryCheck.langLocked', { language: LANGUAGES[lockedLang].nativeName })}</p>
        )}
        {primary(t('training.memoryCheck.start'), () => void begin(), { 'data-memory-start': 'true' })}
        {onLater && (
          <Button variant="ghost" size="lg" className="min-h-12 rounded-full" onClick={onLater} data-memory-later="true">
            {t('training.memoryCheck.later')}
          </Button>
        )}
      </>,
    )
  }

  if (material === null) return shell(null)

  if (stage.name === 'words-ready' || stage.name === 'number-ready' || stage.name === 'faces-ready') {
    const part = stage.name === 'words-ready' ? 'words' : stage.name === 'number-ready' ? 'number' : 'faces'
    const step = part === 'words' ? 1 : part === 'number' ? 2 : 3
    const next: Stage = part === 'words' ? { name: 'words', index: 0 } : part === 'number' ? { name: 'number', index: 0 } : { name: 'faces', index: 0 }
    return shell(
      <>
        <p className="text-xs font-semibold text-muted-foreground">{t('training.memoryCheck.partOf', { n: step, total: 3 })}</p>
        <h2 className="text-xl font-bold text-foreground">{t(`training.memoryCheck.${part}Title`)}</h2>
        <p className="text-sm text-muted-foreground">{t(`training.memoryCheck.${part}Hint`)}</p>
        {primary(t('training.memoryCheck.ready'), () => setStage(next), { 'data-memory-ready': part })}
      </>,
    )
  }

  if (stage.name === 'words' || stage.name === 'number' || stage.name === 'faces') {
    const total = stage.name === 'words' ? material.words.length : stage.name === 'number' ? material.number.length : material.faces.length
    const face = stage.name === 'faces' ? material.faces[stage.index] : undefined
    return shell(
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-6" data-memory-study={stage.name}>
        {stage.name === 'words' && (
          <p lang={material.lang} className="text-center text-4xl font-bold text-foreground" aria-live="off">
            {material.words[stage.index]?.text}
          </p>
        )}
        {stage.name === 'number' && (
          <p className="font-mono text-7xl font-bold text-foreground tabular-nums" aria-live="off">
            {material.number[stage.index]}
          </p>
        )}
        {face && (
          <div className="flex flex-col items-center gap-3">
            <IllustratedFace face={face.face} colorIndex={stage.index} size={168} label={face.name} />
            <p lang={material.lang} className="text-3xl font-bold text-foreground">
              {face.name}
            </p>
          </div>
        )}
        <div className="flex w-full max-w-xs flex-col items-center gap-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${Math.round(((stage.index + 1) / total) * 100)}%` }} />
          </div>
          <p className="text-xs text-muted-foreground tabular-nums">{t('training.memoryCheck.nOfTotal', { n: stage.index + 1, total })}</p>
        </div>
      </div>,
    )
  }

  if (stage.name === 'number-recall') {
    return shell(
      <>
        <h2 className="text-xl font-bold text-foreground">{t('training.memoryCheck.numberRecall')}</h2>
        <p className="text-sm text-muted-foreground">{t('training.memoryCheck.numberRecallHint')}</p>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          maxLength={10}
          value={typed}
          onChange={(e) => setTyped(e.target.value.replace(/\D/g, '').slice(0, 10))}
          aria-label={t('training.memoryCheck.numberRecall')}
          className="min-h-14 w-full rounded-2xl border-2 border-border bg-background px-4 text-center font-mono text-3xl tracking-[0.3em] text-foreground tabular-nums focus:border-primary focus:outline-none"
          data-memory-number-input="true"
        />
        {primary(t('training.memoryCheck.next'), () => setStage({ name: 'word-recall' }), { 'data-memory-number-next': 'true' })}
      </>,
    )
  }

  if (stage.name === 'word-recall') {
    return shell(
      <>
        <h2 className="text-xl font-bold text-foreground">{t('training.memoryCheck.recallTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('training.memoryCheck.recallHint')}</p>
        <div className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-3" lang={material.lang}>
          {material.grid.map((word) => {
            const on = picked.has(word.id)
            return (
              <button
                key={word.id}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setPicked((prev) => {
                    const next = new Set(prev)
                    if (on) next.delete(word.id)
                    else next.add(word.id)
                    return next
                  })
                }
                className={`min-h-11 rounded-xl border-2 px-2 text-base font-semibold break-words ${on ? 'border-primary bg-primary text-primary-foreground' : 'border-border/60 bg-background text-foreground'}`}
                data-memory-word={word.id}
              >
                {word.text}
              </button>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">{t('training.memoryCheck.selected', { count: picked.size })}</p>
        {primary(t('training.memoryCheck.next'), () => setStage({ name: 'faces-ready' }), { 'data-memory-words-next': 'true' })}
      </>,
    )
  }

  if (stage.name === 'face-recall') {
    const faceId = material.recallOrder[stage.index]
    const face = material.faces.find((f) => f.id === faceId)
    if (!face) return shell(null)
    const studyIndex = material.faces.indexOf(face)
    return shell(
      <>
        <p className="text-xs font-semibold text-muted-foreground tabular-nums">{t('training.memoryCheck.nOfTotal', { n: stage.index + 1, total: material.recallOrder.length })}</p>
        <h2 className="text-xl font-bold text-foreground">{t('training.memoryCheck.facesRecall')}</h2>
        <div className="flex justify-center">
          <IllustratedFace face={face.face} colorIndex={studyIndex} size={150} label={t('training.memoryCheck.facesRecall')} />
        </div>
        <div className="grid grid-cols-2 gap-2" lang={material.lang}>
          {material.names.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                const picks = { ...facePicks, [face.id]: n.id }
                setFacePicks(picks)
                if (stage.index + 1 < material.recallOrder.length) setStage({ name: 'face-recall', index: stage.index + 1 })
                else void save(picks)
              }}
              className="min-h-12 rounded-xl border-2 border-border/60 bg-background px-2 text-base font-semibold text-foreground active:border-primary"
              data-memory-name={n.id}
            >
              {n.name}
            </button>
          ))}
        </div>
      </>,
    )
  }

  // result
  const pair = memoryBeforeAfter({ baseline: stage.baseline, final: stage.result.phase === 'final' ? stage.result : null })
  return shell(
    <>
      <MemoryResultParts result={stage.result} before={pair?.before ?? null} t={t} dateLocale={LANGUAGES[uiLang].htmlLang} />
      {stage.result.phase === 'final' && pair === null && <p className="text-sm text-muted-foreground">{t('training.memoryCheck.noBaseline')}</p>}
      {primary(t('training.memoryCheck.continue'), onComplete, { 'data-memory-continue': 'true' })}
    </>,
  )
}
