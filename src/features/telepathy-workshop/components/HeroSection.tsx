import Image from 'next/image'
import type { Lang } from '@/lib/i18n'
import { TELEPATHY_IMAGES, TELEPATHY_PRICE } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { Starfield } from './Starfield'
import { WhatsAppGlyph, WhatsAppLink } from './WhatsAppLink'

const c = telepathyCopy.hero

// S1 — full-height hero: photo + dark overlay, drifting starfield, a
// breathing gold aura behind the headline. `id="tw-hero"` is what the
// sticky WhatsApp bar watches to know when the hero has scrolled away.
export function HeroSection({ lang }: { lang: Lang }): React.JSX.Element {
  return (
    <section id="tw-hero" aria-labelledby="tw-hero-heading" className="relative isolate flex min-h-[calc(100svh-61px)] items-center overflow-hidden px-4 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
      <Image src={TELEPATHY_IMAGES.hero} alt={pick(c.imageAlt, lang)} fill priority fetchPriority="high" sizes="100vw" className="-z-30 object-cover" />
      <div className="tw-hero-overlay absolute inset-0 -z-20" />
      <Starfield className="absolute inset-0 -z-10 h-full w-full" />
      <div className="tw-aura pointer-events-none absolute left-1/2 top-[44svh] -z-10 aspect-square w-[min(150vw,980px)] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden="true" />

      <div className="mx-auto w-full max-w-4xl text-center">
        {/* The workshop name is English in both languages: always Cormorant (preloaded), so it never re-wraps when a Hindi font arrives. */}
        <p lang="en" className="mx-auto text-[17px] font-semibold italic leading-snug text-gold [font-family:var(--font-tw-serif),Georgia,serif] sm:text-xl">
          {pick(telepathyCopy.workshopName, lang)}
        </p>
        <p className="mx-auto mt-4 max-w-[34ch] text-[12.5px] font-semibold uppercase tracking-[0.18em] text-ink-dim sm:max-w-none sm:text-[13px]">
          {pick(c.label, lang)}
        </p>

        <h1 id="tw-hero-heading" className="tw-display tw-h1 mx-auto mt-6 max-w-[18ch] text-ink">
          <span className="tw-gold-text">{pick(c.headline, lang)}</span>
        </h1>

        <p className="tw-body mx-auto mt-6 max-w-2xl text-ink/85">{pick(c.subheadline, lang)}</p>

        <ul className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-2.5">
          {c.badges.map((badge) => (
            <li key={badge.en} className="tw-glass flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[14px] text-ink sm:text-[15px]">
              <span className="text-gold" aria-hidden="true">
                ✓
              </span>
              {pick(badge, lang)}
            </li>
          ))}
        </ul>

        <p className="mt-8 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
          <s className="text-lg text-ink-faint decoration-[#e46f6f]/80 decoration-2">{TELEPATHY_PRICE.mrp}</s>
          <span className="tw-display text-[34px] leading-none text-gold sm:text-[42px]" style={{ lineHeight: 1.1 }}>
            {pick(c.priceOffer, lang)}
          </span>
          <span className="text-[15px] text-ink-dim">
            <span aria-hidden="true">| </span>
            {pick(c.seats, lang)}
          </span>
        </p>

        <div className="mt-8 flex flex-col items-center gap-5">
          <WhatsAppLink topic="general" location="hero" className="tw-btn-gold inline-flex min-h-14 w-full max-w-sm items-center justify-center gap-2.5 rounded-full px-7 py-4 text-[17px] font-bold sm:w-auto sm:max-w-none sm:text-lg">
            <WhatsAppGlyph className="size-6 flex-none" />
            {pick(c.primaryCta, lang)}
          </WhatsAppLink>
          <a href="#dates" className="rounded-full px-3 py-1.5 text-[16px] font-medium text-ink-dim underline decoration-gold/50 underline-offset-[6px] transition-colors hover:text-gold">
            {pick(c.secondaryCta, lang)}
          </a>
        </div>
      </div>
    </section>
  )
}
