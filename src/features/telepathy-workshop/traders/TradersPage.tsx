import { Plus } from 'lucide-react'
import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import { LanguageOverride } from '@/context/LanguageContext'
import type { Lang } from '@/lib/i18n'
import { v2 } from '../telepathyV2Copy'
import { pick } from '../telepathyWorkshop'
import { HeroSection } from '../components/HeroSection'
import { DateCards } from '../components/DateCards'
import { MuseSection } from '../components/LearnSections'
import { ProofSection } from '../components/V2Sections'
import { StickyBooking } from '../components/StickyBooking'
import { CheckDot, Heading, Section } from '../components/ui'
import { tradersCopy as c } from './tradersCopy'

// /telepathy-workshop/traders — the page for the trader ads (Phase 6).
// English by default, Hindi at ?lang=hi. Not in the main nav; linked from
// the telepathy page's traders section. Built from the telepathy page's own
// components: hero (real workshop photo), date cards, EEG section, videos,
// FAQ cards and the sticky bar.
// Order: hero → date cards → sound familiar? → what changes → how the
// workshop does it → EEG → videos → straight talk → FAQ → date cards again.
export function TradersPage({ lang, renderedAt, heroVideo }: { lang: Lang; renderedAt: number; heroVideo: boolean }): React.JSX.Element {
  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light tw-page min-h-screen font-sans antialiased" data-lang={lang} lang={lang}>
        <SiteNav
          cta={{ label: pick(v2.hero.ctaPrimary, lang), href: '#dates' }}
          languageLink={lang === 'hi' ? { label: 'English', href: '/telepathy-workshop/traders' } : { label: 'हिंदी', href: '/telepathy-workshop/traders?lang=hi' }}
        />
        <main>
          <HeroSection lang={lang} heroVideo={heroVideo} copy={c.hero} />
          <DateCards lang={lang} renderedAt={renderedAt} id="dates" />

          <Section tint labelledBy="tr-familiar">
            <div className="mx-auto max-w-3xl">
              <Heading id="tr-familiar" className="text-center">
                {pick(c.familiar.heading, lang)}
              </Heading>
              <ul className="mt-8 grid gap-3">
                {c.familiar.items.map((item) => (
                  <li key={item.en} className="tw-card flex gap-3 px-5 py-4 text-[18px] font-semibold leading-snug text-ink sm:text-[19px]">
                    <CheckDot />
                    <span>{pick(item, lang)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-center text-[19px] font-bold leading-snug text-ink">{pick(c.familiar.close, lang)}</p>
            </div>
          </Section>

          <Section labelledBy="tr-changes">
            <Heading id="tr-changes" className="text-center">
              {pick(c.changes.heading, lang)}
            </Heading>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {c.changes.items.map((item) => (
                <li key={item.en} className="tw-card flex gap-3 p-5 text-[16.5px] font-semibold leading-snug text-ink">
                  <CheckDot />
                  <span>{pick(item, lang)}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section tint labelledBy="tr-how">
            <Heading id="tr-how" className="text-center">
              {pick(c.how.heading, lang)}
            </Heading>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {c.how.items.map((item) => (
                <li key={item.title.en} className="tw-card p-6 sm:p-7">
                  <h3 className="text-[20px] font-extrabold leading-snug text-ink">{pick(item.title, lang)}</h3>
                  <p className="tw-body mt-3">{pick(item.body, lang)}</p>
                </li>
              ))}
            </ul>
          </Section>

          <MuseSection lang={lang} />
          <ProofSection lang={lang} heading={pick(c.videosHeading, lang)} />

          <Section labelledBy="tr-straight">
            <div className="mx-auto max-w-3xl text-center">
              <Heading id="tr-straight">{pick(c.straight.heading, lang)}</Heading>
              <p className="mt-5 text-[18px] leading-relaxed text-ink">{pick(c.straight.body, lang)}</p>
            </div>
          </Section>

          <Section tint labelledBy="tr-faq">
            <div className="mx-auto max-w-3xl">
              <Heading id="tr-faq" className="text-center">
                {pick(c.faq.heading, lang)}
              </Heading>
              <div className="mt-8 grid gap-3">
                {c.faq.items.map((item) => (
                  <details key={item.q.en} className="tw-faq tw-card group">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[16.5px] font-semibold text-ink sm:px-6">
                      <span>{pick(item.q, lang)}</span>
                      <span className="tw-faq-icon flex size-8 flex-none items-center justify-center rounded-full border border-line-strong text-gold">
                        <Plus className="size-4" aria-hidden="true" />
                      </span>
                    </summary>
                    <p className="tw-body px-5 pb-5 sm:px-6">{pick(item.a, lang)}</p>
                  </details>
                ))}
              </div>
            </div>
          </Section>

          <DateCards lang={lang} renderedAt={renderedAt} id="dates-again" heading={pick(c.finalHeading, lang)} compact />
        </main>
        <div className="bg-void px-5 pt-10 sm:px-8">
          <p className="mx-auto max-w-content text-[13.5px] leading-relaxed text-ink-dim">{pick(c.disclaimer, lang)}</p>
        </div>
        <Footer />
        <StickyBooking lang={lang} />
      </div>
    </LanguageOverride>
  )
}
