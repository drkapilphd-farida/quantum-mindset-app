'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Lang } from '@/lib/i18n'
import { BATCHES, daysUntilStart, dayRange, startMonth, upcomingBatch, upcomingBatches, weekdaysEn, weekdaysHi, type Batch } from '@/data/batches'
import { LINKS, waLink } from '@/data/links'
import { v2 } from '../telepathyV2Copy'
import { pick } from '../telepathyWorkshop'
import { BookSeatLink } from './WhatsAppLink'
import { GOLD_BUTTON } from './ui'
import '@/app/telepathy-workshop/telepathy-workshop.css'

// Phase 4.2 — the date cards ("अगली बैच — अपनी तारीख चुनिए"), one component
// for /telepathy-workshop (top and bottom) and the homepage. Everything
// comes from src/data/batches.ts: upcoming batches in date order (a batch
// disappears after its last day), a "X दिन बाकी" chip counted in IST
// ("सबसे नज़दीक" on the first card), the date with its weekdays, the city,
// the ₹1,000 booking line and button. The online batch gets an equal card
// with its own Razorpay link. No venue anywhere — it is sent on WhatsApp
// after booking. Pune (no date) is a single line. Desktop: 4 columns;
// phones: one under the other.

const CARD_IDS = ['mumbai', 'online', 'ahmedabad', 'vadodara'] as const
const inr = (n: number): string => `₹${n.toLocaleString('en-IN')}`
const c = v2.dates

/** Upcoming card batches; re-checked against the visitor's clock after load. */
function useCardBatches(renderedAt: number): { batches: Batch[]; now: Date } {
  const [now, setNow] = useState(() => new Date(renderedAt))
  useEffect(() => setNow(new Date()), [])
  const batches = upcomingBatches(now).filter((b) => (CARD_IDS as readonly string[]).includes(b.id))
  return { batches, now }
}

function daysChip(batch: Batch, now: Date, lang: Lang): string {
  const n = daysUntilStart(batch, now)
  if (n === null) return ''
  if (n <= 0) return pick(c.today, lang)
  if (n === 1) return pick(c.tomorrow, lang)
  return pick(c.daysLeft, lang, { n: String(n) })
}

function Chip({ children, strong = false }: { children: React.ReactNode; strong?: boolean }): React.JSX.Element {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[12.5px] font-semibold ${strong ? 'bg-gold text-[#1B1508]' : 'border border-line-strong text-ink-dim'}`}>{children}</span>
  )
}

function Card({ batch, first, now, lang }: { batch: Batch; first: boolean; now: Date; lang: Lang }): React.JSX.Element {
  const online = batch.id === 'online'
  const city = batch.id === 'exec-mumbai' ? '' : pick(c.cities[batch.id], lang)
  const date = `${dayRange(batch)} ${startMonth(batch, lang)}`
  return (
    <li className="tw-card flex flex-col border-t-4 !border-t-gold p-5">
      <div className="flex flex-wrap gap-2">
        {first && <Chip strong>{pick(c.nearest, lang)}</Chip>}
        <Chip>{daysChip(batch, now, lang)}</Chip>
        {online && <Chip>{pick(c.online.chip, lang)}</Chip>}
      </div>
      <p className="mt-4 text-[30px] font-extrabold leading-none tracking-tight text-ink">{date}</p>
      <p className="mt-1.5 text-[15px] text-ink-dim">{online ? pick(c.online.evenings, lang) : lang === 'hi' ? weekdaysHi(batch) : weekdaysEn(batch)}</p>
      <p className="mt-3 text-[18px] font-bold text-ink">{online ? pick(c.online.where, lang) : city}</p>
      <div className="mt-3 text-[15px] leading-snug">
        {online ? (
          <p className="font-semibold text-ink">{pick(c.online.price, lang, { price: inr(batch.priceInr ?? 0), seats: String(batch.seatsTotal ?? '') })}</p>
        ) : (
          <>
            <p className="font-semibold text-ink">{pick(c.offline.book, lang)}</p>
            <p className="text-ink-dim">{pick(c.offline.rest, lang)}</p>
          </>
        )}
      </div>
      <div className="mt-auto pt-5">
        {online ? (
          <>
            <a href={LINKS.rzpOnline3999} className={`${GOLD_BUTTON} w-full !px-3 text-[15px]`}>
              {pick(c.online.button, lang)}
            </a>
            <Link href="/telepathy-workshop/online" className="mt-3 inline-flex min-h-[44px] items-center text-[14.5px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
              {pick(c.online.more, lang)}
            </Link>
          </>
        ) : (
          <BookSeatLink batch={batch.id === 'mumbai' || batch.id === 'ahmedabad' || batch.id === 'vadodara' ? batch.id : 'general'} location={`date_card_${batch.id}`} className={`${GOLD_BUTTON} w-full !px-3 text-[15px]`}>
            {pick(c.offline.button, lang)}
          </BookSeatLink>
        )}
      </div>
    </li>
  )
}

export function DateCards({
  lang,
  renderedAt,
  id,
  heading,
  compact = false,
}: {
  lang: Lang
  /** When the page was generated (so the first render matches the server HTML). */
  renderedAt: number
  id?: string
  /** Section heading (defaults to "अगली बैच — अपनी तारीख चुनिए"). */
  heading?: string
  /** The smaller repeat at the end of the page: no subtitle. */
  compact?: boolean
}): React.JSX.Element {
  const { batches, now } = useCardBatches(renderedAt)
  const pune = BATCHES.find((b) => b.id === 'pune')
  const puneUndated = pune !== undefined && upcomingBatch('pune', now) === null
  const headingId = `${id ?? 'date-cards'}-heading`
  return (
    <section id={id} aria-labelledby={headingId} className="tw-page warm-light scroll-mt-20 border-b border-line bg-panel-2 px-5 py-14 sm:px-8 sm:py-20" data-lang={lang}>
      <div className="mx-auto max-w-content">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id={headingId} className="tw-h2 text-ink">
            {heading ?? pick(c.heading, lang)}
          </h2>
          {!compact && <p className="tw-body mt-3">{pick(c.sub, lang)}</p>}
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {batches.map((batch, i) => (
            <Card key={batch.id} batch={batch} first={i === 0} now={now} lang={lang} />
          ))}
        </ul>
        {puneUndated && (
          <p className="mt-5 text-center text-[15.5px]">
            <a href={waLink(pick(c.pune, lang))} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline decoration-gold/60 underline-offset-4">
              {pick(c.pune, lang)}
            </a>
          </p>
        )}
        <p className="mt-4 text-center text-[15px] text-ink-dim">
          {pick(c.moveLine, lang)}{' '}
          <a href={waLink(pick(c.askLink, lang).replace(/ →$/, ''))} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap font-semibold text-ink underline decoration-gold/60 underline-offset-4">
            {pick(c.askLink, lang)}
          </a>
        </p>
      </div>
    </section>
  )
}

/** The nearest offline batch (with the ₹1,000 booking) — for the phones' sticky bar. */
export function nearestOfflineBatch(now: Date): Batch | null {
  return upcomingBatches(now).find((b) => b.id === 'mumbai' || b.id === 'ahmedabad' || b.id === 'vadodara') ?? null
}
