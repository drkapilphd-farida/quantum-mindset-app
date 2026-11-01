import type { Lang } from '@/lib/i18n'
import { LONG_REVIEW_VIDEOS, PORTRAIT_POSITION, SHORT_REVIEW_VIDEOS, SHORTS_IN_MIDDLE_STRIP, TELEPATHY_IMAGES, YOUTUBE_CHANNEL_URL } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { LiteYouTube } from './LiteYouTube'
import { ShortsRow } from './LearnSections'
import { Heading, Photo, Section } from './ui'

// H — full video reviews: two featured long reviews (large), the other
// long ones, then the Shorts not already shown mid-page, then the channel.
export function ReviewsSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.reviews
  const [first, second, ...moreLong] = LONG_REVIEW_VIDEOS
  const label = (n: number): string => `${pick(c.playLabel, lang)} ${n}`
  return (
    <Section id="reviews" tint labelledBy="tw-reviews">
      <div className="tw-reveal mx-auto max-w-2xl text-center">
        <Heading id="tw-reviews">{pick(c.heading, lang)}</Heading>
        <p className="tw-body mt-4">{pick(c.sub, lang)}</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {[first, second].filter((id): id is string => id !== undefined).map((id, i) => (
          <LiteYouTube key={id} id={id} kind="review-long" label={label(i + 1)} sizes="(min-width: 768px) 560px, 100vw" className="tw-reveal" />
        ))}
      </div>
      {moreLong.length > 0 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {moreLong.map((id, i) => (
            <LiteYouTube key={id} id={id} kind="review-long" label={label(i + 3)} sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw" className="tw-reveal" />
          ))}
        </div>
      )}

      <h3 className="tw-eyebrow mt-12 text-gold">{pick(c.shortsLabel, lang)}</h3>
      <div className="mt-4">
        <ShortsRow ids={SHORT_REVIEW_VIDEOS.slice(SHORTS_IN_MIDDLE_STRIP)} lang={lang} columns="lg:grid-cols-5" />
      </div>

      <div className="mt-10 text-center">
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-sm border border-line-strong bg-panel px-6 py-3 text-[16px] font-semibold text-ink transition-colors hover:border-ink-dim"
        >
          {pick(c.channel, lang)}
        </a>
      </div>
    </Section>
  )
}

// J — about Dr. Kapil Dev Sharma
export function AboutSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.about
  return (
    <Section tint labelledBy="tw-about">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="tw-reveal mx-auto w-full max-w-[380px]">
          <Photo src={TELEPATHY_IMAGES.portrait} alt={pick(c.imageAlt, lang)} sizes="(min-width: 1024px) 380px, 80vw" frame="tw-frame-glow" position={PORTRAIT_POSITION} className="aspect-[4/5]" />
        </div>
        <div className="tw-reveal">
          <Heading id="tw-about">{pick(c.heading, lang)}</Heading>
          {c.body.map((p) => (
            <p key={p.en} className="tw-body mt-5">
              {pick(p, lang)}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}
