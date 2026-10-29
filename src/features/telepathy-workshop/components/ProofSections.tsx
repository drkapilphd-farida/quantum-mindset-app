import type { Lang } from '@/lib/i18n'
import { TELEPATHY_IMAGES, YOUTUBE_CHANNEL_URL } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { CountUp } from './CountUp'
import { ReviewVideos } from './ReviewVideos'
import { CheckDot, Heading, Ornament, Photo, Section } from './ui'

// S8 — about Dr. Kapil Dev Sharma + count-up stats
export function AboutSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.about
  return (
    <Section tone="warm" labelledBy="tw-about">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="tw-reveal relative mx-auto w-full max-w-[400px]">
          <div className="tw-aura absolute -inset-[14%] rounded-full" aria-hidden="true" />
          <Photo src={TELEPATHY_IMAGES.portrait} alt={pick(c.imageAlt, lang)} sizes="(min-width: 1024px) 400px, 80vw" frame="tw-frame-glow" className="aspect-[4/5]" />
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
      <dl className="tw-reveal mt-16 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {c.stats.map((stat) => (
          <div key={stat.label.en} className="tw-glass flex flex-col-reverse rounded-2xl px-3 py-6 text-center">
            <dt className="mt-2 text-[14px] text-ink-dim sm:text-[15px]">{pick(stat.label, lang)}</dt>
            <dd className="tw-display tw-gold-text text-[40px] sm:text-[52px]" style={{ lineHeight: 1.05 }}>
              <CountUp value={stat.value} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

// S9 — video reviews (IDs in telepathyWorkshopConfig.ts)
export function ReviewsSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.reviews
  const channelReady = YOUTUBE_CHANNEL_URL.startsWith('https://')
  return (
    <Section tone="dark" labelledBy="tw-reviews">
      <div className="tw-reveal mx-auto max-w-3xl text-center">
        <Ornament className="mb-5 justify-center" />
        <Heading id="tw-reviews">{pick(c.heading, lang)}</Heading>
        <p className="tw-body mt-4">{pick(c.sub, lang)}</p>
      </div>
      <div className="mt-12">
        <ReviewVideos lang={lang} />
      </div>
      {channelReady && (
        <div className="mt-10 text-center">
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-gold/60 px-6 py-3 text-[16px] font-semibold text-gold transition-colors hover:bg-gold/10"
          >
            {pick(c.button, lang)}
          </a>
        </div>
      )}
    </Section>
  )
}

// S10 — who it's for
export function WhoForSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.whoFor
  return (
    <Section tone="warm" labelledBy="tw-whofor">
      <div className="mx-auto max-w-3xl">
        <Heading id="tw-whofor" className="tw-reveal text-center">
          {pick(c.heading, lang)}
        </Heading>
        <ul className="mt-10 space-y-3.5">
          {c.items.map((item) => (
            <li key={item.en} className="tw-reveal tw-glass tw-glass-hover flex gap-4 rounded-2xl px-5 py-4 text-[17px] leading-snug text-ink sm:text-[18px]">
              <CheckDot />
              <span className="tw-hi-loose">{pick(item, lang)}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
