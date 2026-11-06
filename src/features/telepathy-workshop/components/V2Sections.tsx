import Image from 'next/image'
import Link from 'next/link'
import { LEARN_CARD_PHOTOS } from '../highlights'
import type { Lang } from '@/lib/i18n'
import { LONG_REVIEW_VIDEOS, PORTRAIT_POSITION, TELEPATHY_IMAGES, YOUTUBE_CHANNEL_URL } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { v2 } from '../telepathyV2Copy'
import { pick } from '../telepathyWorkshop'
import { LiteYouTube } from './LiteYouTube'
import { Heading, Photo, Section } from './ui'

// Phase 4.2 sections of /telepathy-workshop (copy/telepathy-v2.md), built
// from the page's existing pieces (Section, Heading, cards, Photo,
// LiteYouTube). ProofSection is also used on the homepage.

// 3 — "आप किस वजह से आए हैं?": pain (bold) → what you do in the workshop → practice tag.
export function WhySection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = v2.why
  return (
    <Section tint labelledBy="tw-why">
      <div className="mx-auto max-w-2xl text-center">
        <Heading id="tw-why">{pick(c.heading, lang)}</Heading>
        <p className="tw-body mt-3">{pick(c.sub, lang)}</p>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.cards.map((card) => (
          <li key={card.title.en} className="tw-card flex flex-col p-6">
            <h3 className="text-[15px] font-semibold text-gold">{pick(card.title, lang)}</h3>
            <p className="mt-2 text-[17px] font-bold leading-snug text-ink">{pick(card.pain, lang)}</p>
            <div className="mt-4 border-t border-line pt-4">
              <p className="tw-eyebrow text-ink-faint">{pick(c.inWorkshop, lang)}</p>
              <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink">{pick(card.practice, lang)}</p>
              {'link' in card && (
                <a href="#traders" className="mt-2 inline-flex min-h-[44px] items-center text-[14.5px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
                  {pick(card.link, lang)}
                </a>
              )}
            </div>
            <p className="mt-auto pt-4">
              <span className="inline-flex rounded-full border border-gold/50 bg-gold-soft px-3 py-1 text-[12.5px] font-semibold text-ink">{pick(card.tag, lang)}</span>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// 4 — "2 दिन में आप ये 4 चीज़ें सीखते हैं" (4 large cards). Phase 4.3: a real
// workshop photo on top of each card that has a matching one (LEARN_CARD_PHOTOS).
export function LearnFourSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = v2.learn
  return (
    <Section tint labelledBy="tw-learn4">
      <Heading id="tw-learn4" className="text-center">
        {pick(c.heading, lang)}
      </Heading>
      <ul className="mt-10 grid items-start gap-5 md:grid-cols-2">
        {c.cards.map((card, i) => {
          const photo = LEARN_CARD_PHOTOS[i] ?? null
          return (
          <li key={card.title.en} className="tw-card flex flex-col overflow-hidden">
            {photo !== null && (
              <div className="relative aspect-[16/9] bg-panel-2">
                <Image src={photo.src} alt={pick(photo.caption, lang)} fill sizes="(min-width: 768px) 560px, 100vw" loading="lazy" className="object-cover" style={{ objectPosition: photo.position }} />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6 sm:p-8">
            <h3 className="text-[21px] font-extrabold leading-snug text-ink">{pick(card.title, lang)}</h3>
            <p className="tw-body mt-3">{pick(card.body, lang)}</p>
            </div>
          </li>
          )
        })}
      </ul>
    </Section>
  )
}

// 5 — proof: 3 video reviews (no labels: src/data/reviews.csv is not in the
// repo yet) and the link to all 300+ on YouTube.
export function ProofSection({ lang, tint = true, heading }: { lang: Lang; tint?: boolean; heading?: string }): React.JSX.Element {
  const c = v2.proof
  const label = (n: number): string => `${pick(telepathyCopy.reviews.playLabel, lang)} ${n}`
  return (
    <Section id="reviews" tint={tint} labelledBy="tw-proof">
      <div className="mx-auto max-w-2xl text-center">
        <Heading id="tw-proof">{heading ?? pick(c.heading, lang)}</Heading>
        <p className="tw-body mt-3">{pick(c.sub, lang)}</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {LONG_REVIEW_VIDEOS.slice(0, 3).map((id, i) => (
          <LiteYouTube key={id} id={id} kind="review-long" label={label(i + 1)} sizes="(min-width: 768px) 370px, 100vw" />
        ))}
      </div>
      <p className="mt-8 text-center">
        <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="text-[16px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
          {pick(c.link, lang)}
        </a>
      </p>
    </Section>
  )
}

// 9 — offline or online (table).
export function CompareSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = v2.compare
  const [offline, online] = c.columns[lang]
  return (
    <Section tint labelledBy="tw-compare">
      <Heading id="tw-compare" className="text-center">
        {pick(c.heading, lang)}
      </Heading>
      <div className="tw-card mx-auto mt-8 max-w-3xl overflow-hidden">
        <table className="w-full table-fixed border-collapse text-left text-[15px]">
          <thead>
            <tr className="bg-gold-soft text-ink">
              <th scope="col" className="w-[34%] px-3 py-3 sm:px-5">
                <span className="sr-only">{pick(c.heading, lang)}</span>
              </th>
              <th scope="col" className="px-3 py-3 font-bold sm:px-5">
                {offline}
              </th>
              <th scope="col" className="px-3 py-3 font-bold sm:px-5">
                {online}
              </th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((row) => (
              <tr key={row.label.en} className="border-t border-line align-top">
                <th scope="row" className="px-3 py-3 font-semibold text-ink sm:px-5">
                  {pick(row.label, lang)}
                </th>
                <td className="px-3 py-3 text-ink-dim sm:px-5">{pick(row.offline, lang)}</td>
                <td className="px-3 py-3 text-ink-dim sm:px-5">{pick(row.online, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="tw-body mx-auto mt-6 max-w-3xl text-center">{pick(c.note, lang)}</p>
    </Section>
  )
}

// 10 — Dr. Kapil (the old H1 lives here now as one line).
export function DrKapilSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = v2.drKapil
  return (
    <Section labelledBy="tw-drkapil">
      <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Photo src={TELEPATHY_IMAGES.portrait} alt={pick(telepathyCopy.about.imageAlt, lang)} sizes="(min-width: 1024px) 420px, 100vw" position={PORTRAIT_POSITION} className="mx-auto aspect-[4/5] w-full max-w-[420px]" />
        <div>
          <p className="tw-eyebrow text-gold">{pick(c.line, lang)}</p>
          <h2 id="tw-drkapil" className="tw-h2 mt-3 text-ink">
            {pick(c.name, lang)}
          </h2>
          <p className="tw-body mt-4">{pick(c.body, lang)}</p>
          <Link href="/about" className="mt-5 inline-flex min-h-[44px] items-center text-[16px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
            {pick(c.story, lang)}
          </Link>
        </div>
      </div>
    </Section>
  )
}
