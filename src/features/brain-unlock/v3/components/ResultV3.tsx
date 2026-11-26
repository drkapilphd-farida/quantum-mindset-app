'use client'

import { useEffect, useState } from 'react'
import { SITE_CONFIG_WHATSAPP_NUMBER, waLink } from '@/config/site.config'
import { readUtmParams } from '@/lib/analytics/utm'
import { finishWhatsAppHandoff, openPendingWhatsAppTab } from '@/lib/whatsapp/handoff'
import { usePrefersReducedMotion } from '@/hooks/exercises/usePrefersReducedMotion'
import { sessionId } from '../../tracking'
import { saveBrainTestV3Lead } from '../actionsV3'
import type { V3Copy } from '../copyV3'
import { fill, withName } from '../copyV3'
import type { V3Raw } from '../progressV3'
import { formatSeconds, PART_MAXES, RSVP_WPM, type SkillKey, type V3Score } from '../score'
import { trackV3 } from '../trackV3'
import type { BuRole } from '../../passages'
import { waBtn } from './v3ui'

export type AutoState = 'none' | 'sending' | 'sent' | 'failed'

type ResultV3Props = {
  c: V3Copy
  lang: 'en' | 'hi'
  role: BuRole
  raw: V3Raw
  score: V3Score
  round1Seconds: number
  round2Seconds: number
  memoryHits: number
  rsvpCorrect: boolean
  /** Opened from the bot (?c=…): the card goes to WhatsApp by itself. */
  auto: AutoState
  firstName: string | null
}

/** Brain Score, the 4 bars, one line, and exactly ONE button. */
export function ResultV3({ c, lang, role, raw, score, round1Seconds, round2Seconds, memoryHits, rsvpCorrect, auto, firstName }: ResultV3Props): React.JSX.Element {
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(reduced ? score.total : 0)
  const [state, setState] = useState<'idle' | 'saving' | 'chat'>('idle')
  const [waUrl, setWaUrl] = useState<string | null>(null)
  const [leadSaved, setLeadSaved] = useState(false)
  const track = { role, lang }

  // The score counts up once.
  useEffect(() => {
    if (reduced) {
      setShown(score.total)
      return undefined
    }
    const start = performance.now()
    let id = 0
    const step = (now: number): void => {
      const t = Math.min(1, (now - start) / 900)
      setShown(Math.round(score.total * (1 - (1 - t) ** 3)))
      if (t < 1) id = window.requestAnimationFrame(step)
    }
    id = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(id)
  }, [score.total, reduced])

  // Bot visitors: the lead is saved without a tap once the card is on WhatsApp.
  useEffect(() => {
    if (auto !== 'sent' || leadSaved) return
    setLeadSaved(true)
    trackV3('whatsapp_submitted', track, { via: 'auto', score: score.total })
    void saveBrainTestV3Lead({ sessionId: sessionId(), lang, raw, utm: readUtmParams(), via: 'auto', pageUrl: window.location.href }).catch(() => undefined)
    // once, when the card has been handed to WhatsApp
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto])

  async function handleSend(): Promise<void> {
    if (state === 'saving') return
    // Phones only allow a new tab during the tap: open it now, point it at wa.me once saved.
    const tab = openPendingWhatsAppTab()
    setState('saving')
    const res = await saveBrainTestV3Lead({ sessionId: sessionId(), lang, raw, utm: readUtmParams(), via: 'chat', pageUrl: window.location.href }).catch(() => ({ ok: false as const }))
    if (res.ok) trackV3('whatsapp_submitted', track, { via: 'chat', score: res.score })
    // WhatsApp opens either way: the visitor is never stuck.
    const text = fill(c.result.chatMessage, { score: score.total }) + (res.ok ? `\nRef: ${res.ref}` : '')
    const url = waLink(text)
    setWaUrl(url)
    setState('chat')
    finishWhatsAppHandoff(tab, url)
  }

  const label: Record<SkillKey, string> = { focus: c.result.focus, boost: c.result.boost, memory: c.result.memory, reading: c.result.reading }
  const bars: { key: SkillKey; value: string; points: number }[] = [
    { key: 'focus', value: `${formatSeconds(round2Seconds)}s`, points: score.focus },
    { key: 'boost', value: score.boostPct === null ? '—' : `${score.boostPct > 0 ? '+' : ''}${score.boostPct}%`, points: score.boost },
    { key: 'memory', value: `${memoryHits}/7`, points: score.memory },
    { key: 'reading', value: `${RSVP_WPM} WPM ${rsvpCorrect ? '✓' : '✗'}`, points: score.reading },
  ]
  const autoOn = auto === 'sending' || auto === 'sent'
  // Only Focus and Memory are compared; equal → "balanced".
  const strongLine =
    score.strongest === null || score.growth === null
      ? c.result.balanced
      : fill(c.result.strongestGrowth, { a: label[score.strongest], b: label[score.growth] })

  return (
    <section className="flex flex-col gap-5" data-v3-result data-v3-score={score.total} data-v3-r1={formatSeconds(round1Seconds)}>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-base font-semibold text-muted-foreground">{c.result.title}</p>
        <p className="font-heading text-7xl leading-none font-bold text-primary tabular-nums" aria-live="polite">
          {shown}
          <span className="text-2xl text-muted-foreground">/100</span>
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {bars.map((b) => (
          <li key={b.key} className="flex flex-col gap-1" data-v3-bar={b.key}>
            <div className="flex items-baseline justify-between text-base">
              <span className="font-semibold text-foreground">{label[b.key]}</span>
              <span className="font-bold text-foreground tabular-nums">{b.value}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out motion-reduce:transition-none" style={{ width: `${Math.round((b.points / PART_MAXES[b.key]) * 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="text-center text-base font-semibold text-foreground">{strongLine}</p>

      {autoOn ? (
        <div className="flex flex-col gap-3 text-center" data-v3-auto={auto}>
          <p className="text-lg font-bold text-foreground">{auto === 'sending' ? c.result.autoSending : withName(c.result.autoSent, firstName)}</p>
          {auto === 'sent' && <p className="text-base text-muted-foreground">{c.result.autoSentSub}</p>}
          <a href={`https://wa.me/${SITE_CONFIG_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className={waBtn} data-v3-wa-open>
            {c.result.openWhatsApp} →
          </a>
        </div>
      ) : state === 'chat' ? (
        <div className="flex flex-col gap-2 text-center" data-v3-chat>
          <p className="text-lg font-bold text-foreground">{c.result.chatSent}</p>
          {waUrl !== null && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className={waBtn} data-v3-wa-again>
              {c.result.chatAgain}
            </a>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => void handleSend()} className={waBtn} aria-busy={state === 'saving'} data-v3-send>
          {state === 'saving' ? c.result.saving : `${c.result.button} →`}
        </button>
      )}
    </section>
  )
}
