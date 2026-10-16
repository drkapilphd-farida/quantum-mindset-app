'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Brain, Check, RotateCcw, Share2, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { PlayScope } from '@/components/PlayScope'
import { Confetti } from '@/components/play/Confetti'
import { readUtmParams } from '@/lib/analytics/utm'
import { waLink } from '@/config/site.config'
import { leadMagnetCopy } from '@/features/reading-speed-test/leadMagnetCopy'
import { leadWhatsappMessage } from '@/features/reading-speed-test/leadMessage'
import { drawShareCard, shareOrDownload } from '@/features/reading-speed-test/shareCard'
import { saveSpeedTestResult, startPracticeDemo, submitPracticeAnswers, type SpeedTestOffer } from '@/features/reading-speed-test/actions'
import { finishMemoryReading, startMemoryTest, submitMemoryTest, type MemoryTestResult } from '../actions'
import { memoryTestCopy, type MemoryTestCopy } from '../copy'
import { memoryRound, pictureSrc, scoreRecall, SHOW_COUNT, SHOW_SECONDS, STORY_PICTURES, storyRecallGrid, type TestPicture } from '../pictures'
import { trackMemoryTest } from '../tracking'

// Free Reading & Memory Test (founder spec, 14 Oct 2026): read a passage
// (timed on the server) → 8 pictures for 20 s, pick them from 16 → 4
// questions about the passage, now after a short delay → a Brain Profile,
// two optional bonuses, and one WhatsApp CTA. Play design (Sunny Playground
// by day, Night Sky when the phone is in dark mode); passage on paper.

type Shown = { question: string; options: string[] }
type Stage =
  | { name: 'intro' }
  | { name: 'reading'; token: string; title: string; text: string; pid: string }
  | { name: 'memIntro'; qToken: string; questions: Shown[] }
  | { name: 'memShow'; qToken: string; questions: Shown[] }
  | { name: 'memPick'; qToken: string; questions: Shown[] }
  | { name: 'memDone'; qToken: string; questions: Shown[]; memory: number }
  | { name: 'questions'; qToken: string; questions: Shown[]; memory: number }
  | { name: 'result'; result: MemoryTestResult; resultToken: string; view: 'profile' | 'story' | 'boost' }
  | { name: 'invalid'; result: MemoryTestResult }

const SEEN_KEY = 'reading-memory-test-seen'
const PROGRAM_HREF = '/programs/sharp-brain'
const TEST_PATH = '/reading-memory-test'

function readSeen(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]') as unknown
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(-20) : []
  } catch {
    return []
  }
}
function rememberSeen(id: string): void {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...readSeen().filter((x) => x !== id), id].slice(-20)))
  } catch {
    // not remembered — a passage may repeat, nothing more
  }
}
function usePrefersDark(): boolean {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setDark(mq.matches)
    const on = (e: MediaQueryListEvent): void => setDark(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return dark
}

const primary = 'btn-finish inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-lg font-bold disabled:opacity-50'
const secondary = 'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-5 text-base font-semibold text-foreground'

export default function ReadingMemoryTest(): React.JSX.Element {
  const { lang: siteLang } = useLanguage()
  const c = memoryTestCopy[siteLang]
  const dark = usePrefersDark()
  const [passageLang, setPassageLang] = useState<'en' | 'hi'>(siteLang)
  const [stage, setStage] = useState<Stage>({ name: 'intro' })
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // A fresh set of 8 pictures (and 8 others) for every attempt.
  const [round, setRound] = useState(() => memoryRound())
  const top = useRef<HTMLDivElement>(null)

  useEffect(() => setPassageLang(siteLang), [siteLang])
  // Each new step (and each bonus) starts at its top, just below the site's sticky header; not on first load.
  const view = stage.name === 'result' ? `result-${stage.view}` : stage.name
  const firstView = useRef(true)
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false
      return
    }
    const el = top.current
    if (el !== null) window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 80) })
  }, [view])

  async function start(): Promise<void> {
    setPending(true)
    setError(null)
    const res = await startMemoryTest({ lang: passageLang, exclude: readSeen() })
    setPending(false)
    if (!res.ok) return setError(res.error)
    rememberSeen(res.passage.id)
    setRound(memoryRound())
    trackMemoryTest({ name: 'started', lang: passageLang })
    setStage({ name: 'reading', token: res.token, title: res.passage.title, text: res.passage.text, pid: res.passage.id })
  }

  async function doneReading(token: string): Promise<void> {
    setPending(true)
    const res = await finishMemoryReading({ token })
    setPending(false)
    if (!res.ok) return setError(res.error)
    trackMemoryTest({ name: 'step_completed', step: 1 })
    setStage({ name: 'memIntro', qToken: res.token, questions: res.questions })
  }

  async function submit(qToken: string, answers: number[], memory: number): Promise<void> {
    setPending(true)
    const res = await submitMemoryTest({ token: qToken, answers, memory })
    setPending(false)
    if (!res.ok) return setError(res.error)
    trackMemoryTest({ name: 'step_completed', step: 3 })
    trackMemoryTest({ name: 'result_shown', status: res.result.status, profile: res.result.profile, retention: res.result.retention, memory: res.result.memory })
    setStage(res.result.status === 'valid' ? { name: 'result', result: res.result, resultToken: res.resultToken, view: 'profile' } : { name: 'invalid', result: res.result })
  }

  const step = stage.name === 'intro' || stage.name === 'reading' ? 1 : stage.name.startsWith('mem') ? 2 : 3

  return (
    <div className={dark ? 'dark' : ''}>
      <PlayScope className="min-h-[80vh] bg-background px-4 py-8 text-foreground">
        <div ref={top} className="mx-auto flex w-full max-w-xl flex-col gap-5" data-memory-test-stage={stage.name}>
          {stage.name !== 'intro' && stage.name !== 'result' && stage.name !== 'invalid' && <Steps c={c} current={step} />}

          {stage.name === 'intro' && (
            <section className="flex flex-col gap-5" data-memory-test-intro>
              <p className="text-xs font-bold tracking-wider text-primary uppercase">{c.name}</p>
              <h1 className="text-[2rem] leading-tight text-foreground">{c.headline}</h1>
              <p className="text-base text-muted-foreground">{c.sub}</p>
              <ul className="flex flex-wrap gap-2">
                {[{ t: c.facts[0], col: '#4338ca' }, { t: c.facts[1], col: '#0f766e' }, { t: c.facts[2], col: '#c2410c' }].map((f) => (
                  <li key={f.t} className="rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: f.col }}>
                    {f.t}
                  </li>
                ))}
              </ul>
              <div className="play-card flex flex-col gap-3 p-4">
                <p className="text-sm font-semibold text-foreground">{c.passageLang}</p>
                <div className="grid grid-cols-2 gap-2" role="radiogroup">
                  {(['en', 'hi'] as const).map((l) => (
                    <button key={l} type="button" role="radio" aria-checked={passageLang === l} onClick={() => setPassageLang(l)} className={`min-h-12 rounded-xl border-2 text-base font-semibold ${passageLang === l ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-foreground'}`} data-passage-lang={l}>
                      {l === 'en' ? 'English' : 'हिंदी'}
                    </button>
                  ))}
                </div>
                <button type="button" className={primary} onClick={() => void start()} disabled={pending} data-memory-test-start>
                  {c.start}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{c.privacy}</p>
            </section>
          )}

          {stage.name === 'reading' && <ReadingStage c={c} title={stage.title} text={stage.text} pending={pending} onDone={() => void doneReading(stage.token)} />}

          {stage.name === 'memIntro' && (
            <section className="play-card flex flex-col items-center gap-4 p-6 text-center" data-mem-intro>
              <span className="flex size-14 items-center justify-center rounded-2xl text-white" style={{ background: '#6d28d9' }} aria-hidden="true">
                <Brain className="size-7" />
              </span>
              <h2 className="text-2xl text-foreground">{c.memIntroTitle}</h2>
              <p className="text-base text-muted-foreground">{c.memIntro}</p>
              <button type="button" className={primary} onClick={() => setStage({ name: 'memShow', qToken: stage.qToken, questions: stage.questions })} data-mem-show>
                {c.memShow}
              </button>
            </section>
          )}

          {stage.name === 'memShow' && <MemoryShow c={c} pictures={round.shown} lang={siteLang} onEnd={() => setStage({ name: 'memPick', qToken: stage.qToken, questions: stage.questions })} />}

          {stage.name === 'memPick' && (
            <PickGrid
              c={c}
              title={c.memPickTitle}
              grid={round.grid}
              lang={siteLang}
              onCheck={(chosen) => {
                const memory = scoreRecall(chosen, round.shown)
                trackMemoryTest({ name: 'step_completed', step: 2, memory })
                setStage({ name: 'memDone', qToken: stage.qToken, questions: stage.questions, memory })
              }}
            />
          )}

          {stage.name === 'memDone' && (
            <section className="flex flex-col gap-4" data-mem-done={stage.memory}>
              <Feedback good={stage.memory >= 6} title={stage.memory >= 6 ? c.brilliant : c.almost} line={c.memScore(stage.memory)} />
              <button type="button" className={primary} onClick={() => setStage({ name: 'questions', qToken: stage.qToken, questions: stage.questions, memory: stage.memory })} data-to-questions>
                {c.toQuestions}
              </button>
            </section>
          )}

          {stage.name === 'questions' && <Questions c={c} intro={c.qIntro} questions={stage.questions} finalLabel={c.seeProfile} pending={pending} onSubmit={(answers) => void submit(stage.qToken, answers, stage.memory)} />}

          {stage.name === 'result' && stage.view === 'profile' && (
            <ResultView c={c} lang={siteLang} result={stage.result} resultToken={stage.resultToken} onBonus={(view) => setStage({ ...stage, view })} />
          )}
          {stage.name === 'result' && stage.view === 'story' && <StoryBonus c={c} lang={siteLang} before={stage.result.memory} onBack={() => setStage({ ...stage, view: 'profile' })} />}
          {stage.name === 'result' && stage.view === 'boost' && <BoostBonus c={c} resultToken={stage.resultToken} onBack={() => setStage({ ...stage, view: 'profile' })} />}

          {stage.name === 'invalid' && (
            <section className="play-card flex flex-col gap-4 p-6" data-memory-test-invalid={stage.result.status}>
              <h2 className="text-2xl text-foreground">{c.invalidTitle}</h2>
              <p className="text-base text-muted-foreground">{stage.result.status === 'too_fast' ? c.invalidTooFast : c.invalidLow(stage.result.retention)}</p>
              <button type="button" className={primary} onClick={() => setStage({ name: 'intro' })} data-memory-test-retry>
                <RotateCcw className="size-5" aria-hidden="true" />
                {c.tryAgain}
              </button>
            </section>
          )}

          {error !== null && (
            <p role="alert" className="rounded-xl px-4 py-3 text-base text-foreground" style={{ background: 'var(--play-warn-bg)' }}>
              {error}
            </p>
          )}
        </div>
      </PlayScope>
    </div>
  )
}

function Steps({ c, current }: { c: MemoryTestCopy; current: 1 | 2 | 3 }): React.JSX.Element {
  return (
    <div data-steps={current}>
      <p className="text-sm font-semibold text-muted-foreground">{c.stepOf(current)}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {c.steps.map((label, i) => (
          <div key={label}>
            <div className={`h-2 rounded-full ${i < current ? 'bg-primary' : 'bg-muted'}`} />
            <p className={`mt-1 text-xs ${i + 1 === current ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReadingStage({ c, title, text, pending, onDone }: { c: MemoryTestCopy; title: string; text: string; pending: boolean; onDone: () => void }): React.JSX.Element {
  const endRef = useRef<HTMLDivElement>(null)
  const [reachedEnd, setReachedEnd] = useState(false)
  useEffect(() => {
    const el = endRef.current
    if (el === null) return undefined
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setReachedEnd(true))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section className="flex flex-col gap-4" data-reading>
      <div>
        <h2 className="text-2xl text-foreground">{c.readTitle}</h2>
        <p className="text-base text-muted-foreground">{c.readHint}</p>
      </div>
      <article className="play-paper rounded-2xl border border-border px-5 py-6 shadow-sm" data-passage>
        <h3 className="mb-3 text-xl font-bold">{title}</h3>
        <div className="flex flex-col gap-4 text-[1.0625rem] leading-[1.8]">
          {text.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <div ref={endRef} data-passage-end aria-hidden="true" />
      </article>
      {!reachedEnd && <p className="text-sm text-muted-foreground">{c.readScroll}</p>}
      <button type="button" className={primary} onClick={onDone} disabled={!reachedEnd || pending} data-reading-done>
        {c.readDone}
      </button>
    </section>
  )
}

function PictureTile({ p, lang, size = 'lg' }: { p: TestPicture; lang: 'en' | 'hi'; size?: 'lg' | 'sm' }): React.JSX.Element {
  return (
    <span className="flex flex-col items-center gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element -- small local SVGs, no optimisation needed */}
      <img src={pictureSrc(p.id)} alt={p[lang]} width={size === 'lg' ? 64 : 48} height={size === 'lg' ? 64 : 48} className={size === 'lg' ? 'size-16' : 'size-12'} draggable={false} />
      <span className="text-sm font-semibold text-foreground">{p[lang]}</span>
    </span>
  )
}

function MemoryShow({ c, pictures, lang, onEnd }: { c: MemoryTestCopy; pictures: readonly TestPicture[]; lang: 'en' | 'hi'; onEnd: () => void }): React.JSX.Element {
  const [left, setLeft] = useState(SHOW_SECONDS)
  const onEndRef = useRef(onEnd)
  onEndRef.current = onEnd
  useEffect(() => {
    const started = Date.now()
    const id = window.setInterval(() => {
      const l = SHOW_SECONDS - Math.floor((Date.now() - started) / 1000)
      setLeft(Math.max(0, l))
      if (l <= 0) {
        window.clearInterval(id)
        onEndRef.current()
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [])
  return (
    <section className="flex flex-col gap-3" data-mem-showing={left}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-foreground">{c.memIntroTitle}</h2>
        <span className="rounded-full px-3 py-1 font-heading text-lg text-white tabular-nums" style={{ background: '#6d28d9' }}>
          {c.memSeconds(left)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div className="h-full rounded-full bg-primary transition-[width] duration-300 ease-linear" style={{ width: `${(left / SHOW_SECONDS) * 100}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {pictures.map((p) => (
          <div key={p.id} className="play-card flex items-center justify-center p-3">
            <PictureTile p={p} lang={lang} />
          </div>
        ))}
      </div>
    </section>
  )
}

function PickGrid({ c, title, grid, lang, onCheck }: { c: MemoryTestCopy; title: string; grid: readonly TestPicture[]; lang: 'en' | 'hi'; onCheck: (chosen: string[]) => void }): React.JSX.Element {
  const [chosen, setChosen] = useState<string[]>([])
  const toggle = (id: string): void => setChosen((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= SHOW_COUNT ? cur : [...cur, id]))
  return (
    <section className="flex flex-col gap-3" data-pick-grid>
      <div className="flex items-end justify-between gap-2">
        <h2 className="text-xl text-foreground">{title}</h2>
        <span className="shrink-0 text-sm font-semibold text-muted-foreground tabular-nums">{c.memPicked(chosen.length)}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {grid.map((p) => {
          const on = chosen.includes(p.id)
          return (
            <button key={p.id} type="button" aria-pressed={on} onClick={() => toggle(p.id)} className={`relative flex min-h-24 items-center justify-center rounded-2xl border-2 p-1 ${on ? 'border-primary bg-primary/15' : 'border-border bg-card'}`} data-pick={p.id}>
              {on && (
                <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
                  <Check className="size-3.5" />
                </span>
              )}
              <PictureTile p={p} lang={lang} size="sm" />
            </button>
          )
        })}
      </div>
      <button type="button" className={primary} disabled={chosen.length === 0} onClick={() => onCheck(chosen)} data-pick-check>
        {c.memCheck}
      </button>
    </section>
  )
}

function Feedback({ good, title, line }: { good: boolean; title: string; line: string }): React.JSX.Element {
  return (
    <div className="rounded-2xl border-2 px-5 py-4" style={{ background: good ? 'var(--play-good-bg)' : 'var(--play-warn-bg)', borderColor: good ? 'var(--play-good)' : 'var(--play-warn)' }} data-feedback={good ? 'good' : 'warn'}>
      <p className="font-heading text-2xl text-foreground">{title}</p>
      <p className="text-base text-foreground">{line}</p>
    </div>
  )
}

function Questions({ c, intro, questions, finalLabel, pending, onSubmit }: { c: MemoryTestCopy; intro: string; questions: readonly Shown[]; finalLabel: string; pending: boolean; onSubmit: (answers: number[]) => void }): React.JSX.Element {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null))
  const [index, setIndex] = useState(0)
  const q = questions[index]!
  const last = index === questions.length - 1
  const answered = answers[index] !== null
  return (
    <section className="flex flex-col gap-4" data-question-index={index + 1}>
      <p className="text-base text-muted-foreground">{intro}</p>
      <p className="text-sm font-semibold text-muted-foreground">{c.qOf(index + 1, questions.length)}</p>
      <h2 className="text-xl break-words text-foreground" data-question-text>
        {q.question}
      </h2>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label={q.question}>
        {q.options.map((option, oi) => (
          <button key={`${index}-${oi}`} type="button" role="radio" aria-checked={answers[index] === oi} onClick={() => setAnswers((prev) => prev.map((a, i) => (i === index ? oi : a)))} className={`min-h-14 rounded-2xl border-2 px-4 py-2 text-left text-base font-semibold break-words ${answers[index] === oi ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-foreground'}`} data-option={oi}>
            {option}
          </button>
        ))}
      </div>
      <button type="button" className={primary} disabled={!answered || pending} onClick={() => (last ? onSubmit(answers.map((a) => a ?? -1)) : setIndex(index + 1))} data-question-next>
        {last ? finalLabel : c.next}
      </button>
    </section>
  )
}

function shareUrl(): string {
  return `${window.location.origin}${TEST_PATH}`
}

function ResultView({ c, lang, result, resultToken, onBonus }: { c: MemoryTestCopy; lang: 'en' | 'hi'; result: MemoryTestResult; resultToken: string; onBonus: (view: 'story' | 'boost') => void }): React.JSX.Element {
  const lm = leadMagnetCopy[lang]
  const profile = result.profile === null ? null : lm.profiles[result.profile]
  const pace = Math.min(450, Math.max(150, Math.round(result.wpm * 1.2)))
  return (
    <section className="flex flex-col gap-5" data-result data-effective-wpm={result.effectiveWpm} data-retention={result.retention} data-memory={result.memory} data-profile={result.profile ?? ''}>
      <div className="play-card flex flex-col gap-4 p-5" data-brain-profile>
        <p className="text-xs font-bold tracking-wider text-primary uppercase">{c.resultTitle}</p>
        <div className="grid grid-cols-1 gap-3">
          <Tile colour="#c2410c" label={c.effective} value={`${result.effectiveWpm} ${c.wpm}`} sub={c.effectiveSub(result.wpm)} />
          <div className="grid grid-cols-2 gap-3">
            <Tile colour="#0f766e" label={c.retention} value={c.retentionValue(result.retention)} sub={c.retentionSub} />
            <Tile colour="#6d28d9" label={c.memory} value={c.memoryValue(result.memory)} sub={c.memorySub} />
          </div>
        </div>
        {profile !== null && (
          <div className="rounded-2xl bg-muted/60 p-4">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{c.yourType}</p>
            <p className="font-heading text-xl text-foreground">{profile.name}</p>
            <p className="mt-2 text-sm font-bold text-foreground">{c.tip}</p>
            <p className="text-base text-foreground">{profile.tips[0]}</p>
          </div>
        )}
        <p className="text-base font-semibold text-foreground" data-pain-line>
          {c.painLine(result.retention, result.wpm >= 200)}
        </p>
      </div>

      <button type="button" onClick={() => (trackMemoryTest({ name: 'bonus_story', phase: 'opened' }), onBonus('story'))} className="flex flex-col items-start gap-1 rounded-3xl p-5 text-left text-white shadow-md" style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }} data-bonus="story">
        <span className="font-heading text-xl leading-snug">{c.bonusStory}</span>
        <span className="text-sm opacity-90">{c.bonusStorySub}</span>
      </button>
      <button type="button" onClick={() => (trackMemoryTest({ name: 'bonus_boost', phase: 'opened' }), onBonus('boost'))} className="flex flex-col items-start gap-1 rounded-3xl p-5 text-left text-white shadow-md" style={{ background: 'linear-gradient(135deg, #c2410c, #ea580c)' }} data-bonus="boost">
        <span className="font-heading text-xl leading-snug">{c.bonusBoost}</span>
        <span className="text-sm opacity-90">{c.bonusBoostSub(pace)}</span>
      </button>

      <LeadCapture c={c} lang={lang} result={result} resultToken={resultToken} profileName={profile?.name ?? null} />
      <ShareBlock c={c} result={result} profileName={profile?.name ?? ''} />
      <section className="flex flex-col gap-2 border-t border-border pt-5" data-program>
        <h2 className="text-xl text-foreground">{c.programTitle}</h2>
        <ul className="flex flex-col gap-1.5">
          {c.programLines.map((line) => (
            <li key={line} className="flex gap-2 text-base text-foreground">
              <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
        <Link href={PROGRAM_HREF} className={`${secondary} mt-2`}>
          {c.seeProgram}
        </Link>
      </section>
    </section>
  )
}

function Tile({ colour, label, value, sub }: { colour: string; label: string; value: string; sub: string }): React.JSX.Element {
  return (
    <div className="rounded-2xl p-4 text-white" style={{ background: colour }}>
      <p className="text-sm font-semibold opacity-90">{label}</p>
      <p className="font-heading text-[1.75rem] leading-tight tabular-nums">{value}</p>
      <p className="text-xs opacity-90">{sub}</p>
    </div>
  )
}

function LeadCapture({ c, lang, result, resultToken, profileName }: { c: MemoryTestCopy; lang: 'en' | 'hi'; result: MemoryTestResult; resultToken: string; profileName: string | null }): React.JSX.Element {
  const [phone, setPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [waUrl, setWaUrl] = useState<string | null>(null)
  const [offer, setOffer] = useState<SpeedTestOffer | null>(null)
  const lm = leadMagnetCopy[lang]

  async function save(): Promise<void> {
    setState('saving')
    setError(null)
    // Opened during the tap so the phone allows it; filled in once the lead is saved.
    const waWindow = window.open('', '_blank')
    const simulateNow = new URLSearchParams(window.location.search).get('now') ?? undefined
    const res = await saveSpeedTestResult({ resultToken, phone, firstName, simulateNow, utm: readUtmParams() })
    if (!res.ok) {
      waWindow?.close()
      setState('idle')
      return setError(res.error)
    }
    setOffer(res.offer)
    trackMemoryTest({ name: 'lead_submitted', status: result.status, offer: res.offer !== null })
    const url = waLink(
      leadWhatsappMessage({
        lang,
        firstName,
        effectiveWpm: result.effectiveWpm,
        wpm: result.wpm,
        comprehensionPercent: null,
        retention: { correct: result.retention, total: result.retentionTotal },
        memory: { correct: result.memory, total: result.memoryTotal },
        profileName,
        offer: res.offer === null ? null : { code: res.offer.code, expiresAtMs: res.offer.expiresAtMs },
      }),
    )
    setWaUrl(url)
    setState('saved')
    if (waWindow !== null) {
      waWindow.location.href = url
      trackMemoryTest({ name: 'whatsapp_opened', how: 'auto' })
    }
  }

  return (
    <section className="play-card flex flex-col gap-3 p-5" data-lead-capture>
      <h2 className="text-xl leading-snug text-foreground">{c.leadTitle}</h2>
      {state === 'saved' ? (
        <div className="flex flex-col gap-3" data-lead-saved>
          <p className="text-lg font-bold text-foreground">{lm.leadSendTitle}</p>
          <a href={waUrl ?? '#'} onClick={() => trackMemoryTest({ name: 'whatsapp_opened', how: 'button' })} className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#0b7a3e] px-5 text-lg font-bold text-white" data-lead-send-whatsapp data-contact-tracked>
            {lm.leadSendButton}
          </a>
          <p className="text-sm text-muted-foreground">{lm.leadSendNote}</p>
          {offer !== null && (
            <Link href={`/programs/sharp-brain/offer/${offer.id}`} className="text-base font-bold text-primary underline underline-offset-4" data-use-offer>
              {lm.useOffer}
            </Link>
          )}
        </div>
      ) : (
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            void save()
          }}
        >
          <p className="text-sm text-muted-foreground">{c.leadSub}</p>
          <label className="sr-only" htmlFor="rm-phone">
            {c.phone}
          </label>
          <input id="rm-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={c.phone} className="min-h-12 rounded-xl border-2 border-border bg-background px-4 text-base text-foreground" />
          <label className="sr-only" htmlFor="rm-name">
            {c.firstName}
          </label>
          <input id="rm-name" type="text" autoComplete="given-name" maxLength={60} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={c.firstName} className="min-h-12 rounded-xl border-2 border-border bg-background px-4 text-base text-foreground" />
          <button type="submit" className={primary} disabled={phone.trim() === '' || state === 'saving'} data-lead-submit>
            {state === 'saving' ? c.saving : c.leadSubmit}
          </button>
          <p className="text-xs text-muted-foreground">{c.phoneNote}</p>
          {error !== null && (
            <p role="alert" className="text-sm font-semibold text-foreground">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  )
}

function ShareBlock({ c, result, profileName }: { c: MemoryTestCopy; result: MemoryTestResult; profileName: string }): React.JSX.Element {
  const share = useCallback(async () => {
    const blob = await drawShareCard({ heading: c.name, line: c.shareCardLine(result.memory), ask: c.headline, effectiveWpm: result.effectiveWpm, wpmLabel: c.wpm, comprehension: c.retentionValue(result.retention), profileName, url: shareUrl().replace(/^https?:\/\//, '') })
    await shareOrDownload(blob, c.shareText(result.effectiveWpm, result.memory, shareUrl()))
    trackMemoryTest({ name: 'shared', method: 'image' })
  }, [c, result, profileName])
  return (
    <section className="flex flex-col gap-2" data-share>
      <h2 className="text-lg text-foreground">{c.shareTitle}</h2>
      <button type="button" className={secondary} onClick={() => void share()}>
        <Share2 className="size-4" aria-hidden="true" />
        {c.shareImage}
      </button>
      <a href={`https://wa.me/?text=${encodeURIComponent(c.shareText(result.effectiveWpm, result.memory, typeof window === 'undefined' ? TEST_PATH : shareUrl()))}`} target="_blank" rel="noopener noreferrer" onClick={() => trackMemoryTest({ name: 'shared', method: 'whatsapp' })} className={secondary}>
        {c.shareWhatsapp}
      </a>
    </section>
  )
}

function useScrollToTopOn(key: string): React.RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const el = ref.current
    if (el !== null) window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 80) })
  }, [key])
  return ref
}

function StoryBonus({ c, lang, before, onBack }: { c: MemoryTestCopy; lang: 'en' | 'hi'; before: number; onBack: () => void }): React.JSX.Element {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'told' | 'recall' | 'done'>('intro')
  const sectionRef = useScrollToTopOn(phase === 'recall' || phase === 'done' ? phase : 'story')
  const [shown, setShown] = useState(0)
  const [after, setAfter] = useState(0)
  const grid = useMemo(() => storyRecallGrid(), [])
  const audio = useRef<HTMLAudioElement | null>(null)
  const cancelled = useRef(false)
  useEffect(
    () => () => {
      cancelled.current = true
      audio.current?.pause()
    },
    [],
  )

  // One recorded line per picture: the picture appears as its line is spoken.
  async function play(): Promise<void> {
    setPhase('playing')
    setShown(0)
    audio.current ??= new Audio()
    const a = audio.current
    const lines = ['intro', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 'outro']
    for (let i = 0; i < lines.length && !cancelled.current; i++) {
      if (i >= 1 && i <= 8) setShown(i)
      a.src = `/audio/story-demo/${lang}/${lines[i]}.mp3`
      await new Promise<void>((resolve) => {
        const done = (): void => resolve()
        a.onended = done
        a.onerror = () => window.setTimeout(done, 2500)
        a.play().catch(() => window.setTimeout(done, 2500))
      })
    }
    if (!cancelled.current) setPhase('told')
  }

  return (
    <section ref={sectionRef} className="flex flex-col gap-4" data-story-bonus={phase}>
      <h2 className="text-2xl text-foreground">{c.storyTitle}</h2>
      {(phase === 'intro' || phase === 'playing' || phase === 'told') && (
        <>
          <p className="text-base text-muted-foreground">{c.storyIntro}</p>
          {phase === 'intro' && <p className="text-sm font-semibold text-foreground">{c.storySound}</p>}
          <div className="grid grid-cols-4 gap-2">
            {STORY_PICTURES.map((p, i) => (
              <div key={p.id} className={`play-card flex min-h-24 items-center justify-center p-1 transition-opacity duration-500 ${i < shown || phase === 'told' ? 'opacity-100' : 'opacity-0'}`}>
                <PictureTile p={p} lang={lang} size="sm" />
              </div>
            ))}
          </div>
          {phase === 'intro' && (
            <button type="button" className={primary} onClick={() => void play()} data-story-play>
              <BookOpen className="size-5" aria-hidden="true" />
              {c.storyPlay}
            </button>
          )}
          {phase === 'told' && (
            <button type="button" className={primary} onClick={() => setPhase('recall')} data-story-recall>
              {c.storyReplay}
            </button>
          )}
        </>
      )}
      {phase === 'recall' && (
        <PickGrid
          c={c}
          title={c.storyRecallTitle}
          grid={grid}
          lang={lang}
          onCheck={(chosen) => {
            const score = scoreRecall(chosen, STORY_PICTURES)
            setAfter(score)
            setPhase('done')
            trackMemoryTest({ name: 'bonus_story', phase: 'finished', before, after: score })
          }}
        />
      )}
      {phase === 'done' && (
        <>
          {after > before && <Confetti />}
          <div className="rounded-3xl p-5 text-center text-white" style={{ background: 'linear-gradient(135deg, #6d28d9, #2563eb)' }} data-before-after={`${before}-${after}`}>
            <p className="font-heading text-2xl leading-snug">{after > before ? c.beforeAfter(before, after) : c.beforeAfterFlat(before, after)}</p>
          </div>
          <button type="button" className={secondary} onClick={onBack}>
            <Sparkles className="size-4" aria-hidden="true" />
            {c.backToProfile}
          </button>
        </>
      )}
    </section>
  )
}

function BoostBonus({ c, resultToken, onBack }: { c: MemoryTestCopy; resultToken: string; onBack: () => void }): React.JSX.Element {
  const [phase, setPhase] = useState<'loading' | 'intro' | 'run' | 'questions' | 'done' | 'error'>('loading')
  const sectionRef = useScrollToTopOn(phase === 'questions' || phase === 'done' ? phase : 'boost')
  const [demo, setDemo] = useState<{ token: string; pace: number; words: string[]; questions: Shown[] } | null>(null)
  const [outcome, setOutcome] = useState<{ pace: number; percent: number } | null>(null)
  const [index, setIndex] = useState(0)
  useEffect(() => {
    void startPracticeDemo({ resultToken }).then((res) => {
      if (!res.ok) return setPhase('error')
      setDemo({ token: res.token, pace: res.paceWpm, words: res.words, questions: res.questions })
      setPhase('intro')
    })
  }, [resultToken])
  useEffect(() => {
    if (phase !== 'run' || demo === null) return undefined
    if (index >= demo.words.length) {
      setPhase('questions')
      return undefined
    }
    const t = window.setTimeout(() => setIndex((i) => i + 1), 60_000 / demo.pace)
    return () => window.clearTimeout(t)
  }, [phase, index, demo])

  return (
    <section ref={sectionRef} className="flex flex-col gap-4" data-boost-bonus={phase}>
      <h2 className="text-2xl text-foreground">{c.boostTitle}</h2>
      {phase === 'loading' && <div className="h-40 rounded-2xl bg-muted motion-safe:animate-pulse" />}
      {phase === 'error' && <p className="text-base text-foreground">{c.error}</p>}
      {phase === 'intro' && demo !== null && (
        <>
          <p className="text-base text-muted-foreground">{c.boostIntro(demo.pace)}</p>
          <button type="button" className={primary} onClick={() => (setIndex(0), setPhase('run'))} data-boost-start>
            {c.boostStart}
          </button>
        </>
      )}
      {phase === 'run' && demo !== null && (
        <div className="play-paper flex min-h-56 flex-col items-center justify-center rounded-2xl border border-border p-6" data-boost-run>
          <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase tabular-nums">{demo.pace} WPM</p>
          <p className="mt-4 text-center text-[2.25rem] font-semibold" aria-live="off">
            {demo.words[Math.min(index, demo.words.length - 1)]}
          </p>
        </div>
      )}
      {phase === 'questions' && demo !== null && (
        <Questions
          c={c}
          intro={c.boostQuestions}
          questions={demo.questions}
          finalLabel={c.next}
          pending={false}
          onSubmit={(answers) =>
            void submitPracticeAnswers({ token: demo.token, answers: answers.map((a) => Math.max(0, a)) }).then((res) => {
              if (!res.ok) return setPhase('error')
              setOutcome({ pace: res.paceWpm, percent: res.comprehensionPercent })
              trackMemoryTest({ name: 'bonus_boost', phase: 'finished', pace: res.paceWpm, percent: res.comprehensionPercent })
              setPhase('done')
            })
          }
        />
      )}
      {phase === 'done' && outcome !== null && (
        <div className="play-card flex flex-col gap-2 p-5" data-boost-result>
          <p className="font-heading text-xl text-foreground">{c.boostResult(outcome.pace, outcome.percent)}</p>
          <p className="text-base text-muted-foreground">{c.boostResultSub}</p>
        </div>
      )}
      {(phase === 'done' || phase === 'error') && (
        <button type="button" className={secondary} onClick={onBack}>
          {c.backToProfile}
        </button>
      )}
    </section>
  )
}
