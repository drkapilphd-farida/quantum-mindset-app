'use client'

import { useEffect, useState } from 'react'
import { LanguageOverride } from '@/context/LanguageContext'
import { PlayScope } from '@/components/PlayScope'
import { captureUtmParams } from '@/lib/analytics/utm'
import { readBtToken } from '../../progress'
import { brainTestHello, saveBrainTestProgress } from '../../progressActions'
import { drawProgressCardV3 } from '../../progressCard'
import { sessionId } from '../../tracking'
import { gridOrder, MEMORY_SETS, pickOne, RSVP_PASSAGES, type MemorySet, type RsvpPassage } from '../content'
import { fill, v3Copy, withName } from '../copyV3'
import { checkedResults, gridSeconds, progressFactsV3, roleForPlayer, scoreFor, V3_PHASES, type GridRun, type Player, type V3Raw } from '../progressV3'
import { formatSeconds } from '../score'
import { trackV3 } from '../trackV3'
import { BreathStep } from './BreathStep'
import { FocusGridV3 } from './FocusGridV3'
import { MemoryRound } from './MemoryRound'
import { NameStep } from './NameStep'
import { ResultV3, type AutoState } from './ResultV3'
import { RsvpRound } from './RsvpRound'
import { ScoreFlash } from './ScoreFlash'
import { V3Header } from './V3Header'

// Brain Test v3 (founder spec, 26 Nov 2026), on /reading-memory-test?v=3 only.
// No teaching, no voice, no prices: round 1 focus grid → name → 3 breaths →
// round 2 focus grid → memory → RSVP reading → Brain Score with ONE WhatsApp
// button. Progress is saved after every round (bt_progress), so a bot visitor
// gets the card on WhatsApp whether they finish or stop half-way.

type Step = 'grid1' | 'flash1' | 'name' | 'breath' | 'grid2' | 'reveal2' | 'memory' | 'flashMem' | 'rsvp' | 'rsvpFeedback' | 'result'

const ROUND: Record<Step, number | null> = {
  grid1: 1, flash1: 1, name: 1, breath: 2, grid2: 2, reveal2: 2, memory: 3, flashMem: 3, rsvp: 4, rsvpFeedback: 4, result: null,
}
const PROGRESS: Record<Step, number> = {
  grid1: 0.04, flash1: 0.14, name: 0.2, breath: 0.3, grid2: 0.4, reveal2: 0.5, memory: 0.6, flashMem: 0.7, rsvp: 0.8, rsvpFeedback: 0.92, result: 1,
}

type Setup = { order1: number[]; order2: number[]; memorySet: MemorySet; passage: RsvpPassage }

type BrainTestV3Props = { initialLang: 'en' | 'hi' }

export function BrainTestV3({ initialLang }: BrainTestV3Props): React.JSX.Element {
  const [lang, setLang] = useState<'en' | 'hi'>(initialLang)
  const c = v3Copy[lang]
  const [step, setStep] = useState<Step>('grid1')
  // Random grids and sets are chosen in the browser only (no server/browser mismatch).
  const [setup, setSetup] = useState<Setup | null>(null)
  const [round1, setRound1] = useState<GridRun | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [firstName, setFirstName] = useState<string | null>(null)
  const [breathsSkipped, setBreathsSkipped] = useState(false)
  const [round2, setRound2] = useState<GridRun | null>(null)
  const [memoryPicked, setMemoryPicked] = useState<string[] | null>(null)
  const [rsvpAnswer, setRsvpAnswer] = useState<number | null>(null)
  const [btToken, setBtToken] = useState<string | null>(null)
  const [btName, setBtName] = useState<string | null>(null)
  const [auto, setAuto] = useState<AutoState>('none')

  const role = player === null ? null : roleForPlayer(player)
  const track = { role, lang }

  useEffect(() => {
    captureUtmParams()
    setSetup({ order1: gridOrder(), order2: gridOrder(), memorySet: pickOne(MEMORY_SETS), passage: pickOne(RSVP_PASSAGES) })
    const token = readBtToken(window.location.search)
    if (token !== null) {
      setBtToken(token)
      void brainTestHello(token)
        .then((r) => {
          if (r.ok) setBtName(r.firstName)
        })
        .catch(() => undefined)
    }
    trackV3('v3_open', { role: null, lang: initialLang })
    // once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Each new screen starts at the top.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  /** Everything measured so far (each field once its step is done). */
  function rawWith(patch: Partial<V3Raw>): V3Raw | null {
    const r1 = patch.round1 ?? round1
    if (r1 === null || setup === null) return null
    const r2 = patch.round2 ?? round2
    const picked = patch.memoryPicked ?? memoryPicked
    const answer = patch.rsvpAnswer ?? rsvpAnswer
    return {
      player: patch.player !== undefined ? patch.player : player,
      firstName: patch.firstName !== undefined ? patch.firstName : firstName,
      round1: r1,
      breathsSkipped: patch.breathsSkipped ?? breathsSkipped,
      ...(r2 !== null ? { round2: r2 } : {}),
      memorySetId: setup.memorySet.id,
      ...(picked !== null ? { memoryPicked: picked } : {}),
      rsvpPassageId: setup.passage.id,
      ...(answer !== null ? { rsvpAnswer: answer } : {}),
    }
  }

  /**
   * After every round: numbers + card to the server. Bot visitors get the card
   * on WhatsApp (full, or half-way after 10 quiet minutes); others only at the
   * end, so their "Ref: BU-…" chat can bring the card.
   */
  async function saveProgress(raw: V3Raw | null, phasesDone: number): Promise<void> {
    if (raw === null) return
    if (btToken === null && phasesDone < V3_PHASES) return
    const last = phasesDone === V3_PHASES
    if (last && btToken !== null) setAuto('sending')
    try {
      const facts = progressFactsV3(raw, phasesDone)
      const card = await drawProgressCardV3({ facts, phasesDone, lang, firstName: raw.firstName ?? btName })
      const res = await saveBrainTestProgress({ v: 3, sessionId: sessionId(), token: btToken, lang, phasesDone, raw, card })
      if (last && btToken !== null) setAuto(res.ok && res.linked ? 'sent' : 'failed')
    } catch {
      if (last && btToken !== null) setAuto('failed')
    }
  }

  function handleRound1(run: GridRun): void {
    setRound1(run)
    trackV3('v3_round1_done', track, { s: gridSeconds(run), errors: run.errors })
    void saveProgress(rawWith({ round1: run }), 1)
    setStep('flash1')
  }

  function handleName(v: { firstName: string | null; player: Player }): void {
    setPlayer(v.player)
    setFirstName(v.firstName)
    trackV3('v3_name_done', { role: roleForPlayer(v.player), lang }, { player: v.player, named: v.firstName !== null })
    void saveProgress(rawWith({ player: v.player, firstName: v.firstName }), 2)
    setStep('breath')
  }

  function handleBreath(skipped: boolean): void {
    setBreathsSkipped(skipped)
    trackV3('v3_breath_done', track, { skipped })
    void saveProgress(rawWith({ breathsSkipped: skipped }), 3)
    setStep('grid2')
  }

  function handleRound2(run: GridRun): void {
    setRound2(run)
    const raw = rawWith({ round2: run })
    const boost = raw === null ? null : scoreFor(raw).boostPct
    trackV3('v3_round2_done', track, { s: gridSeconds(run), errors: run.errors, ...(boost !== null ? { boost } : {}) })
    void saveProgress(raw, 4)
    setStep('reveal2')
  }

  function handleMemory(picked: string[]): void {
    setMemoryPicked(picked)
    const raw = rawWith({ memoryPicked: picked })
    const m = raw === null ? null : checkedResults(raw)
    if (m !== null) trackV3('v3_memory_done', track, { hits: m.memoryHits, false: m.memoryFalse })
    void saveProgress(raw, 5)
    setStep('flashMem')
  }

  function handleRsvp(answer: number): void {
    setRsvpAnswer(answer)
    const raw = rawWith({ rsvpAnswer: answer })
    const correct = raw === null ? false : checkedResults(raw).rsvpCorrect === true
    trackV3('v3_rsvp_done', track, { correct })
    setStep('rsvpFeedback')
  }

  function handleShowResult(): void {
    const raw = rawWith({})
    if (raw !== null) {
      trackV3('report_view', track, { score: scoreFor(raw).total, v: 3 })
      void saveProgress(raw, V3_PHASES)
    }
    setStep('result')
  }

  const raw = rawWith({})
  const r1s = round1 === null ? 0 : gridSeconds(round1)
  const r2s = round2 === null ? 0 : gridSeconds(round2)
  const greetName = firstName ?? btName
  let body: React.JSX.Element
  if (setup === null) body = <div className="mx-auto mt-8 aspect-square w-full max-w-sm animate-pulse rounded-2xl bg-muted" aria-hidden="true" />
  else if (step === 'grid1')
    body = <FocusGridV3 key="g1" order={setup.order1} instruction={c.r1Instruction} nextLabel={c.next} greeting={btName !== null ? withName(c.hello, btName) : null} onDone={handleRound1} />
  else if (step === 'flash1') body = <ScoreFlash line={fill(c.focusScore, { s: formatSeconds(r1s) })} onNext={() => setStep('name')} continueLabel={c.continue} />
  else if (step === 'name') body = <NameStep c={c} defaultName={btName} onDone={handleName} />
  else if (step === 'breath') body = <BreathStep c={c} onDone={handleBreath} />
  else if (step === 'grid2') body = <FocusGridV3 key="g2" order={setup.order2} instruction={c.r1Instruction} nextLabel={c.next} greeting={null} onDone={handleRound2} />
  else if (step === 'reveal2') {
    const boost = raw === null ? null : scoreFor(raw).boostPct
    const line = breathsSkipped ? fill(c.focusScore, { s: formatSeconds(r2s) }) : boost !== null && boost > 0 ? fill(c.r2.faster, { pct: boost }) : c.r2.settling
    body = <ScoreFlash line={line} sub={fill(c.r2.compare, { a: formatSeconds(r1s), b: formatSeconds(r2s) })} ms={3500} onNext={() => setStep('memory')} continueLabel={c.continue} />
  } else if (step === 'memory') body = <MemoryRound c={c} lang={lang} set={setup.memorySet} onDone={handleMemory} />
  else if (step === 'flashMem') {
    const m = raw === null ? { memoryHits: 0, memoryFalse: 0 } : checkedResults(raw)
    body = (
      <ScoreFlash
        line={fill(c.memory.score, { n: m.memoryHits })}
        sub={m.memoryFalse > 0 ? fill(c.memory.falsePicks, { n: m.memoryFalse }) : null}
        onNext={() => setStep('rsvp')}
        continueLabel={c.continue}
      />
    )
  } else if (step === 'rsvp') body = <RsvpRound c={c} lang={lang} passage={setup.passage} onDone={handleRsvp} />
  else if (step === 'rsvpFeedback') {
    const correct = raw !== null && checkedResults(raw).rsvpCorrect === true
    body = <ScoreFlash line={correct ? c.rsvp.correct : c.rsvp.wrong} sub={correct ? c.rsvp.correctSub : null} ms={4000} onNext={handleShowResult} continueLabel={c.continue} />
  } else if (raw === null) body = <div />
  else {
    const checked = checkedResults(raw)
    body = (
      <ResultV3
        c={c}
        lang={lang}
        role={role ?? 'student'}
        raw={raw}
        score={scoreFor(raw)}
        round1Seconds={r1s}
        round2Seconds={r2s}
        memoryHits={checked.memoryHits}
        rsvpCorrect={checked.rsvpCorrect === true}
        auto={auto}
        firstName={greetName}
      />
    )
  }

  return (
    <LanguageOverride lang={lang}>
      <PlayScope className="min-h-dvh bg-background px-4 pb-10 text-foreground">
        <div className="mx-auto flex w-full max-w-md flex-col gap-5" data-bu-v="3" data-v3-step={step} data-bu-lang={lang}>
          <V3Header c={c} lang={lang} round={ROUND[step]} progress={PROGRESS[step]} onLang={setLang} />
          {body}
        </div>
      </PlayScope>
    </LanguageOverride>
  )
}
