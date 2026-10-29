import type { Lang } from '@/lib/i18n'
import { TELEPATHY_IMAGES } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { BrainWave } from './BrainWave'
import { SkillIcon } from './SkillIcons'
import { CheckDot, Heading, Ornament, Photo, Section } from './ui'

const HALF = '(min-width: 1024px) 540px, (min-width: 640px) 80vw, 100vw'

// S2 — the problem
export function ProblemSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.problem
  return (
    <Section tone="warm" labelledBy="tw-problem">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Photo src={TELEPATHY_IMAGES.problem} alt={pick(c.imageAlt, lang)} sizes={HALF} className="tw-reveal aspect-[4/3] lg:aspect-[4/5]" />
        <div className="tw-reveal">
          <Heading id="tw-problem">{pick(c.heading, lang)}</Heading>
          <p className="tw-body mt-5 text-ink">{pick(c.intro, lang)}</p>
          <ul className="mt-6 space-y-3">
            {c.items.map((item) => (
              <li key={item.en} className="tw-glass flex gap-3.5 rounded-2xl px-4 py-3.5 text-[17px] leading-snug text-ink">
                <CheckDot />
                <span className="tw-hi-loose">{pick(item, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <blockquote className="tw-reveal relative mx-auto mt-14 max-w-3xl rounded-3xl border border-gold/30 bg-gold/[0.06] px-6 py-8 text-center sm:px-12 sm:py-10">
        <Ornament className="mb-5 justify-center" />
        <p className="tw-display text-[22px] text-ink sm:text-[28px]">
          {pick(c.closing, lang)}
        </p>
      </blockquote>
    </Section>
  )
}

// S3 — the guru within
export function GuruSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.guru
  return (
    <Section tone="dark" labelledBy="tw-guru">
      <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="tw-reveal order-2 lg:order-1">
          <Heading id="tw-guru">{pick(c.heading, lang)}</Heading>
          {c.body.map((p) => (
            <p key={p.en} className="tw-body mt-5">
              {pick(p, lang)}
            </p>
          ))}
          <p className="tw-display mt-8 border-l-2 border-gold pl-5 text-[23px] text-gold sm:text-[27px]">
            {pick(c.highlight, lang)}
          </p>
        </div>
        <div className="tw-reveal relative order-1 mx-auto w-full max-w-[420px] lg:order-2">
          <div className="tw-aura absolute -inset-[18%] rounded-full" aria-hidden="true" />
          <div className="tw-float relative">
            <Photo src={TELEPATHY_IMAGES.guruWithin} alt={pick(c.imageAlt, lang)} sizes="(min-width: 1024px) 420px, 80vw" frame="tw-frame-glow" className="aspect-[4/5] !rounded-full" />
          </div>
        </div>
      </div>
    </Section>
  )
}

// S4 — the four skills
export function SkillsSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.skills
  return (
    <Section tone="warm" labelledBy="tw-skills">
      <div className="tw-reveal text-center">
        <Ornament className="mb-5 justify-center" />
        <Heading id="tw-skills">{pick(c.heading, lang)}</Heading>
      </div>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:gap-7">
        {c.cards.map((card, i) => (
          <li key={card.icon} className="tw-reveal tw-glass tw-glass-hover relative overflow-hidden rounded-3xl p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[radial-gradient(circle,rgba(139,108,240,0.22),transparent_70%)]" aria-hidden="true" />
            <div className="flex items-center gap-4">
              <span className="tw-icon-glow flex size-[72px] flex-none items-center justify-center rounded-2xl border border-gold/25 bg-void/40">
                <SkillIcon name={card.icon} className="size-12" />
              </span>
              <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ink-faint">0{i + 1}</span>
            </div>
            <h3 className="mt-6">
              <span className="block text-[14px] font-semibold uppercase tracking-[0.14em] text-teal">{pick(card.name, lang)}</span>
              <span className="tw-display mt-2 block text-[28px] text-ink sm:text-[32px]">{pick(card.title, lang)}</span>
            </h3>
            <p className="tw-body mt-4">{pick(card.body, lang)}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// S5 — relationships
export function RelationshipsSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.relationships
  return (
    <Section tone="dark" labelledBy="tw-relationships">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Photo src={TELEPATHY_IMAGES.relationships} alt={pick(c.imageAlt, lang)} sizes={HALF} className="tw-reveal aspect-[4/3]" />
        <div className="tw-reveal">
          <Heading id="tw-relationships">{pick(c.heading, lang)}</Heading>
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

// S6 — for traders
export function TradersSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.traders
  return (
    <Section tone="warm" labelledBy="tw-traders">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="tw-reveal order-2 lg:order-1">
          <Heading id="tw-traders">{pick(c.heading, lang)}</Heading>
          <p className="tw-body mt-5">{pick(c.body, lang)}</p>
          <p className="mt-6 text-[17px] font-semibold text-ink">{pick(c.listIntro, lang)}</p>
          <ul className="mt-4 grid gap-3">
            {c.items.map((item) => (
              <li key={item.en} className="flex gap-3.5 text-[17px] leading-snug text-ink">
                <CheckDot />
                <span className="tw-hi-loose">{pick(item, lang)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-7 text-[15px] italic leading-relaxed text-ink-faint">{pick(c.note, lang)}</p>
        </div>
        <Photo src={TELEPATHY_IMAGES.trader} alt={pick(c.imageAlt, lang)} sizes={HALF} className="tw-reveal order-1 aspect-[4/3] lg:order-2" />
      </div>
    </Section>
  )
}

// S7 — Muse 2: brain waves go from jagged to smooth on scroll
export function MuseSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.muse
  return (
    <Section tone="dark" labelledBy="tw-muse">
      <div className="tw-reveal mx-auto max-w-3xl text-center">
        <Heading id="tw-muse">{pick(c.heading, lang)}</Heading>
        <p className="tw-body mx-auto mt-5">{pick(c.body, lang)}</p>
      </div>
      <div className="tw-reveal relative mx-auto mt-12 max-w-5xl">
        <Photo src={TELEPATHY_IMAGES.muse} alt={pick(c.imageAlt, lang)} sizes="(min-width: 1024px) 1000px, 100vw" className="aspect-[4/3] sm:aspect-[16/9]" />
        <div className="tw-glass absolute inset-x-3 bottom-3 rounded-2xl px-3 py-3 sm:inset-x-8 sm:bottom-8 sm:px-6 sm:py-5">
          <BrainWave className="h-16 w-full sm:h-24" />
        </div>
      </div>
      <p className="tw-display tw-gold-text tw-reveal mt-10 text-center text-[28px] italic sm:text-[36px]">
        {pick(c.tagline, lang)}
      </p>
    </Section>
  )
}
