'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { CalendarPlus, CalendarDays, MapPin, Plus } from 'lucide-react'
import type { Lang } from '@/lib/i18n'
import { CTA_PORTRAIT_SIZE, FINAL_CTA_BACKGROUND, TELEPATHY_BATCHES, TELEPATHY_IMAGES, TELEPATHY_PRICE } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { googleCalendarUrl, pick, visibleBatches } from '../telepathyWorkshop'
import { Countdown } from './Countdown'
import { GOLD_BUTTON, WhatsAppGlyph, WhatsAppLink } from './WhatsAppLink'
import { CheckDot, Heading, PriceLine, Section } from './ui'

/**
 * Batches still to come. First render uses the time the page was generated
 * (`renderedAt`, so it matches the server HTML; the static page is rebuilt
 * every hour — see page.tsx); after load it re-checks the visitor's clock,
 * so a batch is hidden right after its last day.
 */
function useVisibleBatches(renderedAt: number): typeof TELEPATHY_BATCHES {
  const [batches, setBatches] = useState(() => visibleBatches(renderedAt))
  useEffect(() => setBatches(visibleBatches(Date.now())), [])
  return batches
}

// K — batches: one card per city, each with its own WhatsApp booking button
export function BatchesSection({ lang, renderedAt }: { lang: Lang; renderedAt: number }): React.JSX.Element {
  const c = telepathyCopy.batches
  const batches = useVisibleBatches(renderedAt)
  return (
    <Section id="dates" labelledBy="tw-batches">
      <div className="tw-reveal mx-auto max-w-2xl text-center">
        <Heading id="tw-batches">{pick(c.heading, lang)}</Heading>
        <p className="tw-body mt-3">{pick(c.sub, lang)}</p>
      </div>

      <div className="mt-8">
        <Countdown lang={lang} />
      </div>

      <ul className="mt-8 grid gap-5 lg:grid-cols-3">
        {batches.map((batch) => {
          const card = c.cities.find((x) => x.id === batch.id)
          if (card === undefined) return null
          const calendar = googleCalendarUrl(batch, pick(c.calendarTitle, 'en', { city: card.city.en }), pick(c.infoTime, 'en'))
          return (
            <li key={batch.id} className="tw-reveal tw-card flex flex-col border-t-4 !border-t-gold p-6">
              <h3 className="text-[24px] font-extrabold uppercase tracking-tight text-ink">{pick(card.city, lang)}</h3>
              <dl className="mt-4 grid gap-3 text-[16px]">
                <div className="flex gap-3">
                  <dt className="flex-none pt-0.5 text-gold">
                    <CalendarDays className="size-5" aria-hidden="true" />
                    <span className="sr-only">{pick(c.datesLabel, lang)}</span>
                  </dt>
                  <dd className="font-semibold text-ink">{pick(card.dates, lang)}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="flex-none pt-0.5 text-gold">
                    <MapPin className="size-5" aria-hidden="true" />
                    <span className="sr-only">{pick(c.venueLabel, lang)}</span>
                  </dt>
                  <dd className="leading-relaxed text-ink-dim">{pick(card.venue, lang)}</dd>
                </div>
              </dl>
              <PriceLine earlier={TELEPATHY_PRICE.earlier} offer={TELEPATHY_PRICE.offer} className="mt-5" />
              <div className="mt-auto pt-6">
                <WhatsAppLink topic={batch.id} location={`batch_${batch.id}`} className={`${GOLD_BUTTON} w-full`}>
                  <WhatsAppGlyph className="size-5 flex-none" />
                  {pick(c.button, lang)}
                </WhatsAppLink>
                {calendar !== null && (
                  <a href={calendar} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-[14.5px] font-medium text-ink-dim underline underline-offset-4 hover:text-ink">
                    <CalendarPlus className="size-4" aria-hidden="true" />
                    {pick(c.calendarLink, lang)}
                  </a>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <ul className="tw-reveal tw-card mt-6 grid gap-3 px-5 py-5 text-[16px] text-ink sm:grid-cols-3 sm:px-8">
        <li className="flex items-center gap-3">
          <span aria-hidden="true">⏰</span>
          {pick(c.infoTime, lang)}
        </li>
        <li className="flex items-center gap-3">
          <span aria-hidden="true">🍽️</span>
          {pick(c.infoMeals, lang)}
        </li>
        <li className="flex items-center gap-3">
          <span aria-hidden="true">💰</span>
          <span>
            <s className="text-ink-faint">{TELEPATHY_PRICE.earlier}</s> <span className="font-bold">{TELEPATHY_PRICE.offer}</span> · {pick(telepathyCopy.hero.seats, lang)}
          </span>
        </li>
      </ul>
    </Section>
  )
}

// L — what's included
export function IncludedSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.included
  return (
    <Section tint labelledBy="tw-included">
      <Heading id="tw-included" className="tw-reveal text-center">
        {pick(c.heading, lang)}
      </Heading>
      <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
        {c.items.map((item) => (
          <li key={item.en} className="tw-reveal tw-card flex gap-3 px-5 py-4 text-[16.5px] leading-snug text-ink">
            <CheckDot />
            <span>{pick(item, lang)}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// M — FAQ (native <details>: works without JavaScript)
export function FaqSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.faq
  return (
    <Section labelledBy="tw-faq">
      <div className="mx-auto max-w-3xl">
        <Heading id="tw-faq" className="tw-reveal text-center">
          {pick(c.heading, lang)}
        </Heading>
        <p className="mt-4 text-center text-[15.5px] font-semibold text-ink">{pick(c.notTreatment, lang)}</p>
        <div className="mt-8 grid gap-3">
          {c.items.map((item) => (
            <details key={item.q.en} className="tw-faq tw-card group">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[16.5px] font-semibold text-ink sm:px-6">
                <span>{pick(item.q, lang)}</span>
                <span className="tw-faq-icon flex size-8 flex-none items-center justify-center rounded-full border border-line-strong text-gold">
                  <Plus className="size-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="tw-body px-5 pb-5 sm:px-6">{pick(item.a, lang)}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

// N — final call to action. Desktop: Dr. Kapil's photo (pointing at the
// visitor) on the left, heading + button on the right. Mobile: photo on
// top, shown whole. Optional soft final-cta.jpg background (config).
export function FinalCtaSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.finalCta
  return (
    <section aria-labelledby="tw-final" className="relative isolate overflow-hidden border-b border-line bg-panel-2 px-5 py-16 sm:px-8 sm:py-24">
      {FINAL_CTA_BACKGROUND && (
        <>
          <Image src={TELEPATHY_IMAGES.finalCta} alt="" fill sizes="100vw" quality={55} className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-panel-2/90" />
        </>
      )}
      <div className="mx-auto grid max-w-content items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="tw-reveal mx-auto w-full max-w-[520px]">
          <div className="tw-frame-glow overflow-hidden rounded-sm bg-panel">
            <Image
              src={TELEPATHY_IMAGES.ctaPortrait}
              alt={pick(c.portraitAlt, lang)}
              width={CTA_PORTRAIT_SIZE.width}
              height={CTA_PORTRAIT_SIZE.height}
              sizes="(min-width: 560px) 520px, 92vw"
              className="block h-auto w-full"
            />
          </div>
        </div>
        <div className="tw-reveal text-center lg:text-left">
          <h2 id="tw-final" className="tw-h2 text-ink">
            {pick(c.heading, lang)}
          </h2>
          <PriceLine earlier={TELEPATHY_PRICE.earlier} offer={TELEPATHY_PRICE.offer} note={pick(telepathyCopy.hero.seats, lang)} className="mt-6 justify-center lg:justify-start" />
          <p className="tw-body mt-3">{pick(c.body, lang)}</p>
          <WhatsAppLink topic="general" location="final_cta" className={`${GOLD_BUTTON} mt-8 w-full max-w-md text-[17px] sm:w-auto`}>
            <WhatsAppGlyph className="size-6 flex-none" />
            {pick(telepathyCopy.bookButton, lang)}
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}

export function Disclaimer({ lang }: { lang: Lang }): React.JSX.Element {
  return (
    <div className="bg-void px-5 pt-10 sm:px-8">
      <p className="mx-auto max-w-content text-[13.5px] leading-relaxed text-ink-dim">{pick(telepathyCopy.disclaimer, lang)}</p>
    </div>
  )
}
