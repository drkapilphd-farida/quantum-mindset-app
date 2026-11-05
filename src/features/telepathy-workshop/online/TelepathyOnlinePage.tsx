import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import { Plus } from 'lucide-react'
import { FALLBACK_HI, labelHiNoYear, startDayHi, upcomingBatch, type Batch } from '@/data/batches'
import { linkOrWhatsApp, waLink } from '@/data/links'
import { PageHero } from '../components/PageHero'
import { CheckDot, GOLD_BUTTON, Heading, Section } from '../components/ui'
import { onlineCopy as c } from './onlineCopy'

// /telepathy-workshop/online — the 3-evening online version (Hindi page,
// copy/telepathy-online.md). Built from the /telepathy-workshop page's own
// pieces (dark hero, Section/Heading, gold button, FAQ cards) — no new
// layout. Not in the main nav: reached from the telepathy page's strip.
// Dates, price and seats come from src/data/batches.ts ('online'); once the
// batch is over the "next date soon" line (to WhatsApp) shows instead.

const inr = (n: number): string => `₹${n.toLocaleString('en-IN')}`

function BookButton({ text, className = '' }: { text: string; className?: string }): React.JSX.Element {
  // LINKS.rzpOnline3999 is still a placeholder → WhatsApp with the button's own text.
  return (
    <a href={linkOrWhatsApp('rzpOnline3999', text)} target="_blank" rel="noopener noreferrer" className={`${GOLD_BUTTON} ${className}`}>
      {text}
    </a>
  )
}

function Fallback(): React.JSX.Element {
  return (
    <a href={waLink(FALLBACK_HI)} target="_blank" rel="noopener noreferrer" className="text-[17px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
      {FALLBACK_HI}
    </a>
  )
}

function BatchBlock({ batch }: { batch: Batch | null }): React.JSX.Element {
  if (batch === null) return <Fallback />
  return (
    <div className="tw-card mx-auto max-w-md px-6 py-6 text-center">
      <p className="text-[17px] text-ink">
        <strong>{batch.labelHi}</strong> · {batch.timeHi} · {batch.venueHi}
      </p>
      <p className="mt-2 text-[16px] text-ink-dim">
        {batch.priceInr !== undefined && inr(batch.priceInr)}
        {batch.seatsTotal !== undefined && ` · ${batch.seatsTotal} ${c.seatsSuffix}`}
        {typeof batch.seatsLeft === 'number' && ` (${batch.seatsLeft})`} · {c.noRecording}
      </p>
      <BookButton text={c.bookButton} className="mt-5 w-full" />
    </div>
  )
}

export function TelepathyOnlinePage(): React.JSX.Element {
  const batch = upcomingBatch('online')
  const offline = upcomingBatch('vadodara')
  return (
    <div className="warm-light tw-page min-h-screen font-sans antialiased" data-lang="hi" lang="hi">
      <SiteNav cta={{ label: c.bookButton, href: linkOrWhatsApp('rzpOnline3999', c.bookButton), external: true }} />
      <main>
        <PageHero id="tw-online-heading" title={c.h1} sub={c.sub}>
          <div className="mt-8">
            <BatchBlock batch={batch} />
          </div>
        </PageHero>

        <Section labelledBy="tw-online-evenings">
          <Heading id="tw-online-evenings" className="text-center">
            {c.evenings.heading}
          </Heading>
          <ol className="mx-auto mt-8 grid max-w-3xl gap-3">
            {c.evenings.items.map((item) => (
              <li key={item.label} className="tw-card px-5 py-4 text-[16.5px] leading-relaxed text-ink">
                <strong>{item.label}</strong> {item.text}
              </li>
            ))}
          </ol>
        </Section>

        <Section tint labelledBy="tw-online-included">
          <Heading id="tw-online-included" className="text-center">
            {c.included.heading}
          </Heading>
          <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            {c.included.items.map((item) => (
              <li key={item} className="tw-card flex gap-3 px-5 py-4 text-[16.5px] leading-snug text-ink">
                <CheckDot />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section labelledBy="tw-online-difference">
          <div className="mx-auto max-w-3xl text-center">
            <Heading id="tw-online-difference">{c.difference.heading}</Heading>
            <p className="tw-body mt-4">{c.difference.body}</p>
            <p className="mt-4 text-[17px] font-bold text-ink">{c.difference.discount}</p>
          </div>
        </Section>

        <Section tint labelledBy="tw-online-forwho">
          <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
            <div>
              <Heading id="tw-online-forwho">{c.forWho.heading}</Heading>
              <ul className="mt-5 grid gap-3">
                {c.forWho.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[16.5px] leading-snug text-ink">
                    <CheckDot />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="tw-h2 text-ink">{c.notFor.heading}</h2>
              <p className="tw-body mt-5">{offline === null ? FALLBACK_HI : c.notFor.body.replace('{offline}', labelHiNoYear(offline))}</p>
            </div>
          </div>
        </Section>

        <Section labelledBy="tw-online-faq">
          <div className="mx-auto max-w-3xl">
            <Heading id="tw-online-faq" className="text-center">
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
                  <p className="tw-body px-5 pb-5 sm:px-6">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>

        <Section tint labelledBy="tw-online-final">
          <div className="mx-auto max-w-2xl text-center">
            {batch === null || batch.startDate === null ? (
              <Fallback />
            ) : (
              <>
                <Heading id="tw-online-final">{c.finalCta.heading.replace('{start}', startDayHi({ ...batch, startDate: batch.startDate }))}</Heading>
                <p className="tw-body mt-4">
                  {c.finalCta.body.replace('{seats}', String(batch.seatsTotal ?? '')).replace('{price}', batch.priceInr === undefined ? '' : inr(batch.priceInr))}
                </p>
                <BookButton text={c.finalCta.button} className="mt-6 w-full max-w-sm" />
              </>
            )}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
