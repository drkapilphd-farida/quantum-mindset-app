import type { Lang } from '@/lib/i18n'
import { SHORT_REVIEW_VIDEOS, SHORTS_IN_MIDDLE_STRIP, TELEPATHY_IMAGES } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { BrainWave } from './BrainWave'
import { LiteYouTube } from './LiteYouTube'
import { SkillIcon } from './SkillIcons'
import { CheckDot, Eyebrow, Heading, Photo, Section } from './ui'

// E — what you'll learn: 4 modules (what it is · what you practise · what participants say it helps with)
export function LearnSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.learn
  return (
    <Section labelledBy="tw-learn">
      <Heading id="tw-learn" className="tw-reveal text-center">
        {pick(c.heading, lang)}
      </Heading>
      <ol className="mt-10 grid gap-5 lg:grid-cols-2">
        {c.modules.map((m, i) => (
          <li key={m.icon} className="tw-reveal tw-card p-6 sm:p-7">
            <div className="flex items-center gap-4">
              {/* The line-art icons are drawn for a dark chip. */}
              <span className="flex size-14 flex-none items-center justify-center rounded-sm bg-[#16152e]">
                <SkillIcon name={m.icon} className="size-9" />
              </span>
              <h3>
                <span className="block font-mono text-[12px] text-ink-faint">0{i + 1}</span>
                <span className="block text-[20px] font-extrabold leading-tight text-ink">{pick(m.name, lang)}</span>
              </h3>
            </div>
            <dl className="mt-5 grid gap-3.5">
              {(
                [
                  [c.whatLabel, m.what],
                  [c.practiseLabel, m.practise],
                  [c.helpsLabel, m.helps],
                ] as const
              ).map(([label, text]) => (
                <div key={label.en}>
                  <dt className="tw-eyebrow text-gold">{pick(label, lang)}</dt>
                  <dd className="mt-1 text-[15.5px] leading-relaxed text-ink">{pick(text, lang)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
    </Section>
  )
}

// E (continued) — LIVE Muse 2 demo, the second dark section: the photo is
// shown clean, the brain-wave line sits below it on its own.
export function MuseSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.muse
  return (
    <section aria-labelledby="tw-muse" className="tw-dark relative border-b border-line px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-content items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="tw-reveal">
          <Eyebrow>{pick(c.eyebrow, lang)}</Eyebrow>
          <Heading id="tw-muse" className="mt-4">
            {pick(c.heading, lang)}
          </Heading>
          <p className="tw-body mt-4">{pick(c.body, lang)}</p>
          <p className="mt-6 text-[20px] font-bold text-gold">{pick(c.tagline, lang)}</p>
        </div>
        <div className="tw-reveal">
          <Photo src={TELEPATHY_IMAGES.muse} alt={pick(c.imageAlt, lang)} sizes="(min-width: 1024px) 600px, 100vw" className="aspect-[16/9]" />
          <div className="mt-3 rounded-sm border border-line bg-panel px-4 pb-3 pt-4">
            <BrainWave className="h-14 w-full sm:h-16" />
            <div className="mt-1 flex justify-between text-[12.5px] text-ink-faint">
              <span>{pick(c.waveRestless, lang)}</span>
              <span>→</span>
              <span>{pick(c.waveCalm, lang)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** A row of Shorts: swipeable on phones, a grid on wider screens. */
export function ShortsRow({ ids, lang, columns = 'lg:grid-cols-6' }: { ids: readonly string[]; lang: Lang; columns?: string }): React.JSX.Element {
  return (
    <ul className={`tw-snap -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 md:grid-cols-4 ${columns}`}>
      {ids.map((id, i) => (
        <li key={id} className="w-[44%] flex-none snap-start sm:w-auto">
          <LiteYouTube id={id} kind="review-short" label={`${pick(telepathyCopy.reviews.playLabel, lang)} ${i + 1}`} sizes="(min-width: 1024px) 190px, (min-width: 640px) 30vw, 44vw" />
        </li>
      ))}
    </ul>
  )
}

// F — a short review strip in the middle of the page
export function ShortStripSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.shortStrip
  return (
    <Section tint labelledBy="tw-shortstrip">
      <div className="tw-reveal flex flex-wrap items-end justify-between gap-3">
        <Heading id="tw-shortstrip">{pick(c.heading, lang)}</Heading>
        <a href="#reviews" className="text-[15px] font-semibold text-gold underline underline-offset-4">
          {pick(c.more, lang)}
        </a>
      </div>
      <div className="mt-8">
        <ShortsRow ids={SHORT_REVIEW_VIDEOS.slice(0, SHORTS_IN_MIDDLE_STRIP)} lang={lang} />
      </div>
    </Section>
  )
}

// G — the 2-day schedule
export function ScheduleSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.schedule
  return (
    <Section labelledBy="tw-schedule">
      <div className="tw-reveal text-center">
        <Heading id="tw-schedule">{pick(c.heading, lang)}</Heading>
        <p className="tw-body mt-3">{pick(c.time, lang)}</p>
      </div>
      <ol className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
        {c.days.map((day) => (
          <li key={day.label.en} className="tw-reveal tw-card relative p-6 sm:p-7">
            <p className="tw-eyebrow text-gold">{pick(day.label, lang)}</p>
            <h3 className="mt-2 text-[22px] font-extrabold text-ink">{pick(day.title, lang)}</h3>
            <ul className="mt-4 grid gap-3 border-l-2 border-gold/40 pl-4">
              {day.items.map((item) => (
                <li key={item.en} className="flex gap-3 text-[16px] leading-snug text-ink">
                  <CheckDot />
                  <span>{pick(item, lang)}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}
