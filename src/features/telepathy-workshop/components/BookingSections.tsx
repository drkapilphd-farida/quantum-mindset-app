'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import type { Lang } from '@/lib/i18n'
import { TELEPATHY_BATCHES } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick, visibleBatches } from '../telepathyWorkshop'
import { CheckDot, Heading, Section } from './ui'

/**
 * Batches still to come. First render uses the time the page was generated
 * (`renderedAt`, so it matches the server HTML; the static page is rebuilt
 * every hour — see page.tsx); after load it re-checks the visitor's clock,
 * so a batch is hidden right after its last day.
 */
export function useVisibleBatches(renderedAt: number): typeof TELEPATHY_BATCHES {
  const [batches, setBatches] = useState(() => visibleBatches(renderedAt))
  useEffect(() => setBatches(visibleBatches(Date.now())), [])
  return batches
}

// L — what's included
export function IncludedSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.included
  return (
    <Section tint labelledBy="tw-included">
      <Heading id="tw-included" className="tw-reveal text-center">
        {pick(c.heading, lang)}
      </Heading>
      <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
        {c.items.map((item) => (
          <li key={item.en} className="tw-reveal tw-card flex gap-3 px-5 py-4 text-[16.5px] leading-snug text-ink">
            <CheckDot />
            <span>{pick(item, lang)}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// M — FAQ (native <details>: works without JavaScript)
export function FaqSection({ lang }: { lang: Lang }): React.JSX.Element {
  const c = telepathyCopy.faq
  return (
    <Section labelledBy="tw-faq">
      <div className="mx-auto max-w-3xl">
        <Heading id="tw-faq" className="tw-reveal text-center">
          {pick(c.heading, lang)}
        </Heading>
        <p className="mt-4 text-center text-[15.5px] font-semibold text-ink">{pick(c.notTreatment, lang)}</p>
        <div className="mt-8 grid gap-3">
          {c.items.map((item) => (
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
  )
}

export function Disclaimer({ lang }: { lang: Lang }): React.JSX.Element {
  return (
    <div className="bg-void px-5 pt-10 sm:px-8">
      <p className="mx-auto max-w-content text-[13.5px] leading-relaxed text-ink-dim">{pick(telepathyCopy.disclaimer, lang)}</p>
    </div>
  )
}
