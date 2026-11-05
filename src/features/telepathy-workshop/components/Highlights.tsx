'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Lang } from '@/lib/i18n'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import type { Highlight } from '../highlights'
import { Heading, Section } from './ui'
import '@/app/telepathy-workshop/telepathy-workshop.css'

// Phase 4.3 — "Inside the workshop": a horizontal photo strip (CSS
// scroll-snap; swipe on phones, arrows on desktop; lazy images). Used on
// /telepathy-workshop (12 photos) and the homepage (6). No new library.

const c = {
  heading: { en: 'Inside the workshop', hi: 'वर्कशॉप के अंदर' },
  sub: { en: 'Real batches, real people — across India since 2017.', hi: 'असली बैच, असली लोग — 2017 से देश भर में।' },
  more: { en: 'See the full gallery →', hi: 'पूरी गैलरी देखिए →' },
  prev: { en: 'Previous photos', hi: 'पिछली फ़ोटो' },
  next: { en: 'Next photos', hi: 'अगली फ़ोटो' },
}

function caption(h: Highlight, lang: Lang): string {
  const city = h.city === null ? null : pick(telepathyCopy.gallery.cities[h.city], lang)
  return [pick(h.caption, lang), city, h.year === null ? null : String(h.year)].filter((x): x is string => x !== null).join(' · ')
}

export function Highlights({ lang, photos, tint = false }: { lang: Lang; photos: readonly Highlight[]; tint?: boolean }): React.JSX.Element {
  const row = useRef<HTMLUListElement>(null)
  const scroll = (dir: 1 | -1): void => {
    const el = row.current
    if (el !== null) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }
  const arrow = 'hidden size-11 items-center justify-center rounded-full border border-line-strong bg-void text-ink transition-colors hover:border-gold md:flex'
  return (
    <div className="tw-page" data-lang={lang}>
      <Section tint={tint} labelledBy={`tw-highlights-${photos.length}`}>
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Heading id={`tw-highlights-${photos.length}`}>{pick(c.heading, lang)}</Heading>
            <p className="tw-body mt-3">{pick(c.sub, lang)}</p>
          </div>
          <div className="flex flex-none gap-2">
            <button type="button" onClick={() => scroll(-1)} aria-label={pick(c.prev, lang)} className={arrow}>
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label={pick(c.next, lang)} className={arrow}>
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <ul ref={row} className="tw-snap -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0">
          {photos.map((h) => (
            <li key={h.src} className="w-[82%] flex-none snap-start sm:w-[46%] lg:w-[31.5%]">
              <figure>
                <div className="tw-frame relative aspect-[4/3] overflow-hidden rounded-sm bg-panel-2">
                  <Image src={h.src} alt={caption(h, lang)} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 82vw" loading="lazy" className="object-cover" style={{ objectPosition: h.position }} />
                </div>
                <figcaption className="mt-2 text-[14px] text-ink-dim">{caption(h, lang)}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/gallery" className="text-[16px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
            {pick(c.more, lang)}
          </Link>
        </p>
      </Section>
    </div>
  )
}
