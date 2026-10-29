import Image from 'next/image'
import { CalendarPlus, CalendarDays, MapPin, Plus } from 'lucide-react'
import type { Lang } from '@/lib/i18n'
import { CTA_PORTRAIT_SIZE, FINAL_CTA_BACKGROUND, TELEPATHY_IMAGES, TELEPATHY_PRICE, TELEPATHY_WORKSHOP_DATES } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { googleCalendarUrl, pick } from '../telepathyWorkshop'
import { Countdown } from './Countdown'
import { WhatsAppGlyph, WhatsAppLink } from './WhatsAppLink'
import { Heading, Ornament, Section } from './ui'

// S11 — dates & cities: countdown, three ticket cards, shared info strip
export function DatesSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.dates
  return (
    <Section id="dates" tone="warm" labelledBy="tw-dates">
      <div className="tw-reveal mx-auto max-w-3xl text-center">
        <Ornament className="mb-5 justify-center" />
        <Heading id="tw-dates">{pick(c.heading, lang)}</Heading>
        <p className="tw-body mt-4">{pick(c.sub, lang)}</p>
      </div>

      <div className="mt-10">
        <Countdown lang={lang} />
      </div>

      <ul className="mt-10 grid gap-6 lg:grid-cols-3">
        {c.cities.map((city) => {
          const date = city.calendar === null ? undefined : TELEPATHY_WORKSHOP_DATES.find((d) => d.city === city.calendar)
          const cityName = pick(city.city, lang)
          return (
            <li key={city.id} className="tw-reveal tw-ticket flex flex-col">
              <div className="tw-ticket-top flex flex-1 flex-col px-6 pb-7 pt-7 sm:px-7">
                <h3 className="tw-display tw-gold-text text-[34px] tracking-[0.06em]" style={{ lineHeight: 1.15 }}>
                  {cityName}
                </h3>
                <dl className="mt-6 space-y-4 text-[16px]">
                  <div className="flex gap-3">
                    <dt className="flex-none pt-0.5 text-gold">
                      <CalendarDays className="size-5" aria-hidden="true" />
                      <span className="sr-only">{pick(c.datesLabel, lang)}</span>
                    </dt>
                    <dd className="tw-hi-loose font-semibold text-ink">{pick(city.dates, lang)}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="flex-none pt-0.5 text-gold">
                      <MapPin className="size-5" aria-hidden="true" />
                      <span className="sr-only">{pick(c.venueLabel, lang)}</span>
                    </dt>
                    <dd className="tw-hi-loose leading-relaxed text-ink-dim">{pick(city.venue, lang)}</dd>
                  </div>
                </dl>
                {date !== undefined && (
                  <a
                    href={googleCalendarUrl(date, pick(c.calendarTitle, 'en', { city: pick(city.city, 'en') }), pick(c.infoTime, 'en'))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 self-start pt-6 text-[14.5px] font-medium text-teal underline decoration-teal/40 underline-offset-4 hover:text-teal-light"
                  >
                    <CalendarPlus className="size-4" aria-hidden="true" />
                    {pick(c.calendarLink, lang)}
                  </a>
                )}
              </div>
              <div className="tw-ticket-stub px-5 pb-6 pt-6 sm:px-7">
                <WhatsAppLink topic={city.whatsapp} location={`city_${city.id}`} className="tw-btn-wa flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full px-4 py-3.5 text-center text-[16px] font-bold leading-snug [text-wrap:balance]">
                  <WhatsAppGlyph className="size-5 flex-none" />
                  {pick(city.button, lang)}
                </WhatsAppLink>
              </div>
            </li>
          )
        })}
      </ul>

      <ul className="tw-reveal tw-glass mt-8 grid gap-4 rounded-2xl px-5 py-5 text-[16px] text-ink sm:grid-cols-3 sm:px-8">
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
            <s className="text-ink-faint">{TELEPATHY_PRICE.mrp}</s> <span className="font-bold text-gold">{TELEPATHY_PRICE.offer}</span>
          </span>
        </li>
      </ul>
    </Section>
  )
}

// S12 — FAQ (native <details>: works without JavaScript)
export function FaqSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.faq
  return (
    <Section tone="dark" labelledBy="tw-faq">
      <div className="mx-auto max-w-3xl">
        <Heading id="tw-faq" className="tw-reveal text-center">
          {pick(c.heading, lang)}
        </Heading>
        <div className="mt-10 space-y-3">
          {c.items.map((item) => (
            <details key={item.q.en} className="tw-faq tw-reveal tw-glass group rounded-2xl">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[17px] font-semibold text-ink sm:px-6 sm:py-5">
                <span className="tw-hi-loose">{pick(item.q, lang)}</span>
                <span className="tw-faq-icon flex size-8 flex-none items-center justify-center rounded-full border border-gold/40 text-gold">
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

// S13 — final call to action, sunrise photo with a big glow
// S13 — final call to action. Desktop: Dr. Kapil's photo (pointing at the
// visitor) on the left, heading + button on the right. Mobile: photo on
// top, shown whole. Optional soft final-cta.jpg background (config).
export function FinalCtaSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.finalCta
  return (
    <section aria-labelledby="tw-final" className="tw-section-warm relative isolate overflow-hidden px-4 py-20 sm:px-8 sm:py-28">
      {FINAL_CTA_BACKGROUND && (
        <>
          <Image data-cta-bg src={TELEPATHY_IMAGES.finalCta} alt="" fill sizes="100vw" quality={60} className="-z-20 object-cover opacity-40" />
          <div data-cta-bg className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--color-void)_0%,rgba(7,8,24,0.78)_30%,rgba(7,8,24,0.82)_70%,var(--color-void)_100%)]" />
        </>
      )}
      <div className="mx-auto grid max-w-content items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="tw-reveal relative mx-auto w-full max-w-[520px]">
          <div className="tw-aura absolute -inset-[14%] rounded-full" aria-hidden="true" />
          <div className="tw-frame-glow relative overflow-hidden rounded-[28px] bg-panel">
            <Image
              src={TELEPATHY_IMAGES.ctaPortrait}
              alt={pick(c.portraitAlt, lang)}
              width={CTA_PORTRAIT_SIZE.width}
              height={CTA_PORTRAIT_SIZE.height}
              sizes="(min-width: 1024px) 520px, (min-width: 560px) 520px, 92vw"
              className="block h-auto w-full"
            />
          </div>
        </div>
        <div className="tw-reveal text-center lg:text-left">
          <Ornament className="mb-6 justify-center lg:justify-start" />
          <h2 id="tw-final" className="tw-display tw-h2 text-ink">
            <span className="tw-gold-text">{pick(c.heading, lang)}</span>
          </h2>
          <p className="tw-body mx-auto mt-5 max-w-xl text-ink/90 lg:mx-0">{pick(c.body, lang)}</p>
          <WhatsAppLink
            topic="general"
            location="final_cta"
            className="tw-btn-gold mt-9 inline-flex min-h-16 w-full max-w-md items-center justify-center gap-3 rounded-full px-7 py-4 text-[18px] font-bold sm:w-auto sm:max-w-none sm:px-10 sm:text-[20px]"
          >
            <WhatsAppGlyph className="size-7 flex-none" />
            {pick(c.button, lang)}
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}

export function Disclaimer({ lang }: { lang: Lang }): React.JSX.Element {
  return (
    <div className="border-t border-line px-4 pt-10 sm:px-8">
      <p className="tw-hi-loose mx-auto max-w-content text-[13.5px] leading-relaxed text-ink-faint">{pick(telepathyCopy.disclaimer, lang)}</p>
    </div>
  )
}
