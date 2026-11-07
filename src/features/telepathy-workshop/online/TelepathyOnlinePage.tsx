import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import { LanguageOverride } from '@/context/LanguageContext'
import { Plus } from 'lucide-react'
import type { Lang } from '@/lib/i18n'
import { FALLBACK_EN, FALLBACK_HI, startMonth, upcomingBatch, type Batch } from '@/data/batches'
import { LINKS, waLink } from '@/data/links'
import { PageHero } from '../components/PageHero'
import { CheckDot, GOLD_BUTTON, Heading, Section } from '../components/ui'
import { onlineCopy as c, say } from './onlineCopy'

// /telepathy-workshop/online — the 3-evening online version. Phase 4.3:
// English by default, Hindi at ?lang=hi (the language comes only from the
// URL; the stored language is neither read nor changed). Built from the
// /telepathy-workshop page's own pieces (dark hero, Section/Heading, gold
// button, FAQ cards) — no new layout. Not in the main nav. Dates, price and
// seats come from src/data/batches.ts ('online'); once the batch is over the
// "next date soon" line (to WhatsApp) shows instead.

const inr = (n: number): string => `₹${n.toLocaleString('en-IN')}`

function BookButton({ text, className = '' }: { text: string; className?: string }): React.JSX.Element {
  return (
    <a href={LINKS.rzpOnline3999} className={`${GOLD_BUTTON} ${className}`}>
      {text}
    </a>
  )
}

function Fallback({ lang }: { lang: Lang }): React.JSX.Element {
  const text = lang === 'hi' ? FALLBACK_HI : FALLBACK_EN
  return (
    <a href={waLink(text)} target="_blank" rel="noopener noreferrer" className="text-[17px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
      {text}
    </a>
  )
}

function BatchBlock({ batch, lang }: { batch: Batch | null; lang: Lang }): React.JSX.Element {
  if (batch === null) return <Fallback lang={lang} />
  const hi = lang === 'hi'
  return (
    <div className="tw-card mx-auto max-w-md px-6 py-6 text-center">
      <p className="text-[17px] text-ink">
        <strong>{hi ? batch.labelHi : batch.labelEn}</strong> · {hi ? batch.timeHi : c.batchTimeEn} · {hi ? batch.venueHi : batch.venueEn}
      </p>
      <p className="mt-2 text-[16px] text-ink-dim">
        {batch.priceInr !== undefined && inr(batch.priceInr)}
        {batch.seatsTotal !== undefined && ` · ${batch.seatsTotal} ${say(c.seatsSuffix, lang)}`}
        {typeof batch.seatsLeft === 'number' && ` (${batch.seatsLeft})`} · {say(c.noRecording, lang)}
      </p>
      <BookButton text={say(c.bookButton, lang)} className="mt-5 w-full" />
    </div>
  )
}

export function TelepathyOnlinePage({ lang }: { lang: Lang }): React.JSX.Element {
  const batch = upcomingBatch('online')
  const start = batch?.startDate ? `${Number(batch.startDate.slice(8, 10))} ${startMonth(batch, lang)}` : null
  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light tw-page min-h-screen font-sans antialiased" data-lang={lang} lang={lang}>
        <SiteNav
          cta={{ label: say(c.bookButton, lang), href: LINKS.rzpOnline3999 }}
          languageLink={lang === 'hi' ? { label: 'English', href: '/telepathy-workshop/online' } : { label: 'हिंदी', href: '/telepathy-workshop/online?lang=hi' }}
        />
        <main>
          <PageHero id="tw-online-heading" title={say(c.h1, lang)} sub={say(c.sub, lang)}>
            <div className="mt-8">
              <BatchBlock batch={batch} lang={lang} />
            </div>
          </PageHero>

          <Section labelledBy="tw-online-evenings">
            <Heading id="tw-online-evenings" className="text-center">
              {say(c.evenings.heading, lang)}
            </Heading>
            <ol className="mx-auto mt-8 grid max-w-3xl gap-3">
              {c.evenings.items.map((item) => (
                <li key={item.label.en} className="tw-card px-5 py-4 text-[16.5px] leading-relaxed text-ink">
                  <strong>{say(item.label, lang)}</strong> {say(item.text, lang)}
                </li>
              ))}
            </ol>
          </Section>

          <Section tint labelledBy="tw-online-included">
            <Heading id="tw-online-included" className="text-center">
              {say(c.included.heading, lang)}
            </Heading>
            <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
              {c.included.items.map((item) => (
                <li key={item.en} className="tw-card flex gap-3 px-5 py-4 text-[16.5px] leading-snug text-ink">
                  <CheckDot />
                  <span>{say(item, lang)}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section labelledBy="tw-online-difference">
            <div className="mx-auto max-w-3xl text-center">
              <Heading id="tw-online-difference">{say(c.difference.heading, lang)}</Heading>
              <p className="tw-body mt-4">{say(c.difference.body, lang)}</p>
              <p className="mt-4 text-[17px] font-bold text-ink">{say(c.difference.discount, lang)}</p>
            </div>
          </Section>

          <Section tint labelledBy="tw-online-forwho">
            <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
              <div>
                <Heading id="tw-online-forwho">{say(c.forWho.heading, lang)}</Heading>
                <ul className="mt-5 grid gap-3">
                  {c.forWho.items.map((item) => (
                    <li key={item.en} className="flex gap-3 text-[16.5px] leading-snug text-ink">
                      <CheckDot />
                      <span>{say(item, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="tw-h2 text-ink">{say(c.notFor.heading, lang)}</h2>
                <p className="tw-body mt-5">{say(c.notFor.body, lang)}</p>
              </div>
            </div>
          </Section>

          <Section labelledBy="tw-online-faq">
            <div className="mx-auto max-w-3xl">
              <Heading id="tw-online-faq" className="text-center">
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
                    <p className="tw-body px-5 pb-5 sm:px-6">{say(item.a, lang)}</p>
                  </details>
                ))}
              </div>
            </div>
          </Section>

          <Section tint labelledBy="tw-online-final">
            <div className="mx-auto max-w-2xl text-center">
              {batch === null || start === null ? (
                <Fallback lang={lang} />
              ) : (
                <>
                  <Heading id="tw-online-final">{say(c.finalCta.heading, lang).replace('{start}', start)}</Heading>
                  <p className="tw-body mt-4">
                    {say(c.finalCta.body, lang)
                      .replace('{seats}', String(batch.seatsTotal ?? ''))
                      .replace('{price}', batch.priceInr === undefined ? '' : inr(batch.priceInr))}
                  </p>
                  <BookButton text={say(c.finalCta.button, lang)} className="mt-6 w-full max-w-sm" />
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
