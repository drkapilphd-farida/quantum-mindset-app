import Image from 'next/image'
import type { Lang } from '@/lib/i18n'
import { HERO_PHOTO, HERO_VIDEO_PUBLIC_PATH, telepathyWhatsAppMessage } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { v2 } from '../telepathyV2Copy'
import { pick } from '../telepathyWorkshop'
import { Starfield } from './Starfield'
import { GOLD_BUTTON } from './ui'
import { WhatsAppGlyph, WhatsAppLink } from './WhatsAppLink'

const c = v2.hero

// A — hero (Phase 4.2, copy/telepathy-v2.md): small proof strip, H1,
// subtitle, "अपनी तारीख चुनिए" (→ the date cards, #dates), "talk first" on
// WhatsApp, and the small booking line. Media: one real workshop photo
// (HERO_PHOTO) under the dark overlay — or public/telepathy-hero.mp4 when
// it exists (`heroVideo`), muted and looping, with the photo as poster.
// `id="tw-hero"` is what the sticky booking bar watches.
export function HeroSection({ lang, heroVideo }: { lang: Lang; heroVideo: boolean }): React.JSX.Element {
  return (
    <section id="tw-hero" aria-labelledby="tw-hero-heading" className="tw-dark relative isolate flex min-h-[calc(100svh-61px)] items-center overflow-hidden px-5 pb-12 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
      {heroVideo ? (
        <video
          className="absolute inset-0 -z-30 h-full w-full object-cover"
          style={{ objectPosition: HERO_PHOTO.position }}
          src={`/${HERO_VIDEO_PUBLIC_PATH}`}
          poster={HERO_PHOTO.src}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : (
        <Image src={HERO_PHOTO.src} alt={pick(telepathyCopy.hero.imageAlt, lang)} fill priority sizes="100vw" className="-z-30 object-cover" style={{ objectPosition: HERO_PHOTO.position }} />
      )}
      <div className="tw-hero-overlay absolute inset-0 -z-20" />
      <Starfield className="absolute inset-0 -z-10 h-full w-full" />

      <div className="mx-auto w-full max-w-4xl text-center">
        <p className="tw-eyebrow mx-auto max-w-[40ch] text-gold sm:max-w-none">{pick(c.strip, lang)}</p>
        <h1 id="tw-hero-heading" className="tw-h1 mx-auto mt-5 max-w-[24ch] text-ink">
          {pick(c.h1, lang)}
        </h1>
        <p className="tw-body mx-auto mt-5 max-w-2xl">{pick(c.sub, lang)}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#dates" className={`${GOLD_BUTTON} w-full max-w-sm sm:w-auto`}>
            {pick(c.ctaPrimary, lang)}
          </a>
          <WhatsAppLink
            message={telepathyWhatsAppMessage('question', null)}
            kind="question"
            batch="general"
            location="hero"
            className="inline-flex min-h-[52px] w-full max-w-sm items-center justify-center gap-2 rounded-sm border border-line-strong px-6 py-3.5 text-[15.5px] font-semibold text-ink transition-colors hover:bg-white/5 sm:w-auto"
          >
            <WhatsAppGlyph className="size-5 flex-none text-[#25D366]" />
            {pick(c.ctaSecondary, lang)}
          </WhatsAppLink>
        </div>
        <p className="mt-4 text-[14px] text-ink-dim">{pick(c.smallLine, lang)}</p>
      </div>
    </section>
  )
}
