import type { Lang } from '@/lib/i18n'
import { TELEPATHY_PRICE } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { HeroCrossfade } from './HeroCrossfade'
import { Starfield } from './Starfield'
import { BookSeatCta } from './BookSeat'

const c = telepathyCopy.hero

// A — dark, starry hero: crossfading workshop photos under a dark overlay,
// a drifting starfield and a soft aura. `id="tw-hero"` is what the sticky
// booking bar watches to know when the hero has scrolled away.
export function HeroSection({ lang }: { lang: Lang }): React.JSX.Element {
  return (
    <section id="tw-hero" aria-labelledby="tw-hero-heading" className="tw-dark relative isolate flex min-h-[calc(100svh-61px)] items-center overflow-hidden px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
      <HeroCrossfade alt={pick(c.imageAlt, lang)} />
      <div className="tw-hero-overlay absolute inset-0 -z-20" />
      <Starfield className="absolute inset-0 -z-10 h-full w-full" />
      <div className="tw-aura pointer-events-none absolute left-1/2 top-[44svh] -z-10 aspect-square w-[min(150vw,980px)] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden="true" />

      <div className="mx-auto w-full max-w-4xl text-center">
        <p className="tw-eyebrow mx-auto max-w-[36ch] text-gold sm:max-w-none">{pick(c.eyebrow, lang)}</p>
        <p lang="en" className="mt-5 text-[15px] font-bold uppercase tracking-[0.06em] text-ink">
          {pick(c.workshopName, lang)}
        </p>
        <h1 id="tw-hero-heading" className="tw-h1 mx-auto mt-3 max-w-[24ch] text-ink">
          {pick(c.headline, lang)}
        </h1>
        <p className="tw-h2 mx-auto mt-5 max-w-[30ch] text-ink">{pick(c.subtitle, lang)}</p>
        <p className="tw-body mx-auto mt-6 max-w-2xl">{pick(c.subheadline, lang)}</p>

        <p className="mt-8 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
          <s className="text-[18px] text-ink-faint decoration-2">{TELEPATHY_PRICE.earlier}</s>
          <span className="text-[38px] font-extrabold leading-none text-ink sm:text-[44px]">{TELEPATHY_PRICE.offer}</span>
          <span className="text-[15px] font-semibold text-gold">· {pick(c.seats, lang)}</span>
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-start">
          <BookSeatCta lang={lang} batch="general" location="hero" className="w-full max-w-sm sm:w-auto sm:max-w-[22rem]" buttonClassName="w-full" />
          <a
            href="#free-session"
            className="inline-flex min-h-[52px] w-full max-w-sm items-center justify-center rounded-sm border border-line-strong px-6 py-3.5 text-[16px] font-semibold text-ink transition-colors hover:bg-white/5 sm:w-auto"
          >
            {pick(c.watchCta, lang)}
          </a>
        </div>
      </div>
    </section>
  )
}
