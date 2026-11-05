import { Plus } from 'lucide-react'
import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import { LanguageOverride } from '@/context/LanguageContext'
import { TELEPATHY_WORKSHOP_FEE } from '@/config/site.config'
import { FALLBACK_EN, FALLBACK_HI, labelHiNoYear, upcomingBatch, weekdaysEn, weekdaysHi, type Batch } from '@/data/batches'
import { LINKS, waLink } from '@/data/links'
import { PageHero } from '@/features/telepathy-workshop/components/PageHero'
import { BookSeatLink } from '@/features/telepathy-workshop/components/WhatsAppLink'
import { CheckDot, GOLD_BUTTON, Heading, Section } from '@/features/telepathy-workshop/components/ui'
import type { Lang } from '@/lib/i18n'
import { say, vadodaraCopy as c } from './vadodaraCopy'

// /vadodara — local landing page for the Vadodara Telepathy Workshop batch.
// Phase 4.3: English by default, Hindi at ?lang=hi (language from the URL
// only; the stored language is neither read nor changed), built from the /telepathy-workshop page's own
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

function Fallback({ lang }: { lang: Lang }): React.JSX.Element {
  const text = lang === 'hi' ? FALLBACK_HI : FALLBACK_EN
  return (
    <a href={waLink(text)} target="_blank" rel="noopener noreferrer" className="text-[17px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
      {text}
    </a>
  )
}

function BookButton({ location, lang, className = '' }: { location: string; lang: Lang; className?: string }): React.JSX.Element {
  return (
    <BookSeatLink batch="vadodara" location={location} className={`${GOLD_BUTTON} ${className}`}>
      {say(c.batch.button, lang)}
    </BookSeatLink>
  )
}

function BatchBlock({ batch, lang }: { batch: Batch | null; lang: Lang }): React.JSX.Element {
  if (batch === null) return <Fallback lang={lang} />
  const m = money(batch)
  const hi = lang === 'hi'
  const time = hi ? batch.timeHi : c.batch.timeEn
  return (
    <div className="tw-card mx-auto max-w-lg px-6 py-6 text-left">
      <dl className="grid gap-2 text-[16.5px] text-ink">
        <div>
          <dt className="inline font-bold">{say(c.batch.dateLabel, lang)}</dt>{' '}
          <dd className="inline">{`${hi ? batch.labelHi : batch.labelEn} ${hi ? weekdaysHi(batch) : weekdaysEn(batch)}`.trim()}</dd>
        </div>
        {time !== undefined && (
          <div>
            <dt className="inline font-bold">{say(c.batch.timeLabel, lang)}</dt> <dd className="inline">{`${time}, ${say(c.batch.bothDays, lang)}`}</dd>
          </div>
        )}
      </dl>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-dim">
        {fill(say(c.batch.priceLine, lang), m)} <strong className="text-ink">{fill(say(c.batch.depositLine, lang), m)}</strong> {say(c.batch.meals, lang)}
      </p>
      <BookButton location="vadodara_batch" lang={lang} className="mt-5 w-full" />
    </div>
  )
}

export function VadodaraPage({ lang }: { lang: Lang }): React.JSX.Element {
  const batch = upcomingBatch('vadodara')
  const dates = batch === null ? null : lang === 'hi' ? labelHiNoYear(batch) : batch.labelEn.replace(/\s\d{4}$/, '')
  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light tw-page min-h-screen font-sans antialiased" data-lang={lang} lang={lang}>
        <SiteNav
          cta={{ label: say(c.batch.button, lang), href: LINKS.rzpTelepathyDeposit1000 }}
          languageLink={lang === 'hi' ? { label: 'English', href: '/vadodara' } : { label: 'हिंदी', href: '/vadodara?lang=hi' }}
        />
        <main>
          <PageHero id="vd-heading" title={say(c.h1, lang)} sub={say(c.sub, lang)} />

          <div className="border-b border-line bg-gold-soft px-5 py-4 sm:px-8">
            <p className="mx-auto max-w-content text-center text-[16px] font-semibold text-ink">{say(c.strip, lang)}</p>
          </div>

          <Section id="dates" labelledBy="vd-batch">
            <h2 id="vd-batch" className="sr-only">
              {say(c.batch.dateLabel, lang)}
            </h2>
            <BatchBlock batch={batch} lang={lang} />
          </Section>

          <Section labelledBy="vd-forwho">
            <div className="mx-auto max-w-3xl">
              <Heading id="vd-forwho" className="text-center">
                {say(c.forWho.heading, lang)}
              </Heading>
              <ul className="mt-8 grid gap-3">
                {c.forWho.items.map((item) => (
                  <li key={item.en} className="tw-card flex gap-3 px-5 py-4 text-[16.5px] leading-snug text-ink">
                    <CheckDot />
                    <span>{say(item, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section tint labelledBy="vd-faq">
            <div className="mx-auto max-w-3xl">
              <Heading id="vd-faq" className="text-center">
                {say(c.faq.heading, lang)}
              </Heading>
              <div className="mt-8 grid gap-3">
                {c.faq.items.map((item) => (
                  <details key={item.q.en} className="tw-faq tw-card group">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[16.5px] font-semibold text-ink sm:px-6">
                      <span>{say(item.q, lang)}</span>
                      <span className="tw-faq-icon flex size-8 flex-none items-center justify-center rounded-full border border-line-strong text-gold">
                        <Plus className="size-4" aria-hidden="true" />
                      </span>
                    </summary>
                    <p className="tw-body px-5 pb-5 sm:px-6">
                      {dates === null && say(item.a, lang).includes('{dates}') ? (lang === 'hi' ? FALLBACK_HI : FALLBACK_EN) : fill(say(item.a, lang), { dates: dates ?? '' })}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Section>

          <Section tint labelledBy="vd-final">
            <div className="mx-auto max-w-2xl text-center">
              {batch === null || dates === null ? (
                <Fallback lang={lang} />
              ) : (
                <>
                  <Heading id="vd-final">{fill(say(c.finalCta.heading, lang), { dates })}</Heading>
                  <p className="tw-body mt-4">{fill(say(c.finalCta.body, lang), money(batch))}</p>
                  <BookButton location="vadodara_final_cta" lang={lang} className="mt-6 w-full max-w-sm" />
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
