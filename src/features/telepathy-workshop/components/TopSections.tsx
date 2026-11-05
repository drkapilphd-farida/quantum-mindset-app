import type { Lang } from '@/lib/i18n'
import { FREE_SESSION_VIDEO, TELEPATHY_IMAGES } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { LiteYouTube } from './LiteYouTube'
import { CheckDot, Heading, Photo, Section } from './ui'

// B — trust strip
export function TrustStrip({ lang }: { lang: Lang }): React.JSX.Element {
  return (
    <section aria-label={telepathyCopy.trust.map((t) => `${pick(t.value, lang)} ${pick(t.label, lang)}`).join(', ')} className="border-b border-line bg-panel px-5 py-6 sm:px-8">
      <ul className="mx-auto grid max-w-content grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
        {telepathyCopy.trust.map((t) => (
          <li key={t.label.en} className="text-center">
            <span className="block text-[28px] font-extrabold leading-none text-ink sm:text-[32px]">{pick(t.value, lang)}</span>
            <span className="mt-1.5 block text-[14px] text-ink-dim">{pick(t.label, lang)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

// C — free session video
export function FreeSessionSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.freeSession
  return (
    <Section id="free-session" labelledBy="tw-free">
      <div className="tw-reveal mx-auto max-w-2xl text-center">
        <Heading id="tw-free">{pick(c.heading, lang)}</Heading>
        <p className="tw-body mt-4">{pick(c.sub, lang)}</p>
      </div>
      <div className="tw-reveal mx-auto mt-10 max-w-4xl">
        <LiteYouTube id={FREE_SESSION_VIDEO} kind="free-session" label={pick(c.playLabel, lang)} sizes="(min-width: 1024px) 900px, 100vw" />
      </div>
    </Section>
  )
}

// D — who it's for (5 cards: where you are → what can change)
export function WhoForSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.whoFor
  return (
    <Section tint labelledBy="tw-whofor">
      <Heading id="tw-whofor" className="tw-reveal text-center">
        {pick(c.heading, lang)}
      </Heading>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.cards.map((card) => (
          <li key={card.title.en} className="tw-reveal tw-card flex flex-col p-6">
            <h3 className="text-[18px] font-bold leading-snug text-ink">{pick(card.title, lang)}</h3>
            <p className="tw-body mt-2 !text-[15.5px]">{pick(card.pain, lang)}</p>
            <div className="mt-4 border-t border-line pt-4">
              <p className="tw-eyebrow text-gold">{pick(c.changeLabel, lang)}</p>
              <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink">{pick(card.change, lang)}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// Traders (#traders — the "traders" why-card links here). Phase 4.3: right after "What brings you here?".
export function TradersSection({ lang }: { lang: Lang }): React.JSX.Element {
  const t = telepathyCopy.traders
  return (
    <Section labelledBy="tw-traders">
      <div id="traders" className="tw-reveal grid scroll-mt-20 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="order-2 lg:order-1">
          <p className="tw-eyebrow text-gold">{pick(t.eyebrow, lang)}</p>
          <h2 id="tw-traders" className="tw-h2 mt-3 text-ink">{pick(t.heading, lang)}</h2>
          <p className="tw-body mt-4">{pick(t.body, lang)}</p>
          <p className="mt-5 text-[16.5px] font-semibold text-ink">{pick(t.listIntro, lang)}</p>
          <ul className="mt-3 grid gap-3">
            {t.items.map((item) => (
              <li key={item.en} className="flex gap-3 text-[16.5px] leading-snug text-ink">
                <CheckDot />
                <span>{pick(item, lang)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] italic leading-relaxed text-ink-dim">{pick(t.note, lang)}</p>
        </div>
        <Photo src={TELEPATHY_IMAGES.trader} alt={pick(t.imageAlt, lang)} sizes="(min-width: 1024px) 520px, 100vw" className="order-1 aspect-[4/3] lg:order-2" />
      </div>
    </Section>
  )
}
