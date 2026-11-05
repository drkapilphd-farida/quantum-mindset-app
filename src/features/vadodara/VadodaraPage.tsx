import { Plus } from 'lucide-react'
import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import { LanguageOverride } from '@/context/LanguageContext'
import { TELEPATHY_WORKSHOP_FEE } from '@/config/site.config'
import { FALLBACK_HI, labelHiNoYear, upcomingBatch, weekdaysHi, type Batch } from '@/data/batches'
import { LINKS, waLink } from '@/data/links'
import { PageHero } from '@/features/telepathy-workshop/components/PageHero'
import { BookSeatLink } from '@/features/telepathy-workshop/components/WhatsAppLink'
import { CheckDot, GOLD_BUTTON, Heading, Section } from '@/features/telepathy-workshop/components/ui'
import { vadodaraCopy as c } from './vadodaraCopy'

// /vadodara — local landing page for the Vadodara Telepathy Workshop batch
// (Hindi, copy/vadodara.md), built from the /telepathy-workshop page's own
// pieces. The batch (date, time, price, ₹1,000 deposit) comes from
// src/data/batches.ts; once it is over, the "next date soon" line shows.
// Booking → LINKS.rzpTelepathyDeposit1000 (same tab, so Razorpay brings the
// visitor back to /telepathy-workshop/booked).
//
// Phase 4.2: no hotel, station or map anywhere — venue, timing and
// directions are sent on WhatsApp after booking.
//
// "वडोदरा में पहले कौन आया" (3 local video reviews) reads only from
// src/data/reviews.csv, which is not in the repo yet — so that section is
// not rendered (never shown empty).

const inr = (n: number): string => `₹${n.toLocaleString('en-IN')}`

function fill(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match)
}

function money(batch: Batch): Record<string, string> {
  const price = batch.priceInr ?? TELEPATHY_WORKSHOP_FEE.currentInr
  const deposit = batch.depositInr ?? TELEPATHY_WORKSHOP_FEE.depositInr
  return { price: inr(price), earlier: inr(TELEPATHY_WORKSHOP_FEE.earlierInr), deposit: inr(deposit), balance: inr(price - deposit) }
}

function Fallback(): React.JSX.Element {
  return (
    <a href={waLink(FALLBACK_HI)} target="_blank" rel="noopener noreferrer" className="text-[17px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
      {FALLBACK_HI}
    </a>
  )
}

function BookButton({ location, className = '' }: { location: string; className?: string }): React.JSX.Element {
  return (
    <BookSeatLink batch="vadodara" location={location} className={`${GOLD_BUTTON} ${className}`}>
      {c.batch.button}
    </BookSeatLink>
  )
}

function BatchBlock({ batch }: { batch: Batch | null }): React.JSX.Element {
  if (batch === null) return <Fallback />
  const m = money(batch)
  return (
    <div className="tw-card mx-auto max-w-lg px-6 py-6 text-left">
      <dl className="grid gap-2 text-[16.5px] text-ink">
        <div>
          <dt className="inline font-bold">{c.batch.dateLabel}</dt> <dd className="inline">{`${batch.labelHi} ${weekdaysHi(batch)}`.trim()}</dd>
        </div>
        {batch.timeHi !== undefined && (
          <div>
            <dt className="inline font-bold">{c.batch.timeLabel}</dt> <dd className="inline">{`${batch.timeHi}, ${c.batch.bothDays}`}</dd>
          </div>
        )}
      </dl>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-dim">
        {fill(c.batch.priceLine, m)} <strong className="text-ink">{fill(c.batch.depositLine, m)}</strong> {c.batch.meals}
      </p>
      <BookButton location="vadodara_batch" className="mt-5 w-full" />
    </div>
  )
}

export function VadodaraPage(): React.JSX.Element {
  const batch = upcomingBatch('vadodara')
  const dates = batch === null ? null : labelHiNoYear(batch)
  return (
    <LanguageOverride lang="hi">
      <div className="warm-light tw-page min-h-screen font-sans antialiased" data-lang="hi" lang="hi">
        <SiteNav cta={{ label: c.batch.button, href: LINKS.rzpTelepathyDeposit1000 }} />
        <main>
          <PageHero id="vd-heading" title={c.h1} sub={c.sub} />

          <div className="border-b border-line bg-gold-soft px-5 py-4 sm:px-8">
            <p className="mx-auto max-w-content text-center text-[16px] font-semibold text-ink">{c.strip}</p>
          </div>

          <Section id="dates" labelledBy="vd-batch">
            <h2 id="vd-batch" className="sr-only">
              {c.batch.dateLabel}
            </h2>
            <BatchBlock batch={batch} />
          </Section>

          <Section labelledBy="vd-forwho">
            <div className="mx-auto max-w-3xl">
              <Heading id="vd-forwho" className="text-center">
                {c.forWho.heading}
              </Heading>
              <ul className="mt-8 grid gap-3">
                {c.forWho.items.map((item) => (
                  <li key={item} className="tw-card flex gap-3 px-5 py-4 text-[16.5px] leading-snug text-ink">
                    <CheckDot />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section tint labelledBy="vd-faq">
            <div className="mx-auto max-w-3xl">
              <Heading id="vd-faq" className="text-center">
                {c.faq.heading}
              </Heading>
              <div className="mt-8 grid gap-3">
                {c.faq.items.map((item) => (
                  <details key={item.q} className="tw-faq tw-card group">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[16.5px] font-semibold text-ink sm:px-6">
                      <span>{item.q}</span>
                      <span className="tw-faq-icon flex size-8 flex-none items-center justify-center rounded-full border border-line-strong text-gold">
                        <Plus className="size-4" aria-hidden="true" />
                      </span>
                    </summary>
                    <p className="tw-body px-5 pb-5 sm:px-6">{dates === null && item.a.includes('{dates}') ? FALLBACK_HI : fill(item.a, { dates: dates ?? '' })}</p>
                  </details>
                ))}
              </div>
            </div>
          </Section>

          <Section tint labelledBy="vd-final">
            <div className="mx-auto max-w-2xl text-center">
              {batch === null || dates === null ? (
                <Fallback />
              ) : (
                <>
                  <Heading id="vd-final">{fill(c.finalCta.heading, { dates })}</Heading>
                  <p className="tw-body mt-4">{fill(c.finalCta.body, money(batch))}</p>
                  <BookButton location="vadodara_final_cta" className="mt-6 w-full max-w-sm" />
                </>
              )}
            </div>
          </Section>
        </main>
        <Footer />
      </div>
    </LanguageOverride>
  )
}
