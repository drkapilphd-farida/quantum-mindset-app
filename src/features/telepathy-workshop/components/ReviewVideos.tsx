'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { Lang } from '@/lib/i18n'
import { REVIEW_VIDEOS } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'

const isPlaceholder = (id: string): boolean => id.startsWith('VIDEO_ID')

// "Lite" YouTube embeds: a thumbnail with a gold play button; the real
// player (youtube-nocookie, the only YouTube domain the CSP allows) loads
// only after a tap. Swipe carousel on phones, 2-column grid from 640px.
export function ReviewVideos({ lang }: { lang: Lang }): React.JSX.Element {
  const [playing, setPlaying] = useState<string | null>(null)

  return (
    <ul className="tw-snap -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0">
      {REVIEW_VIDEOS.map((video, index) => {
        const caption = lang === 'hi' ? video.captionHi : video.captionEn
        const label = caption !== '' ? `${pick(telepathyCopy.reviews.playLabel, lang)}: ${caption}` : `${pick(telepathyCopy.reviews.playLabel, lang)} ${index + 1}`
        return (
          <li key={`${video.id}-${index}`} className="w-[84%] flex-none snap-start sm:w-auto">
            <div className="tw-frame relative aspect-video overflow-hidden rounded-2xl bg-panel">
              {isPlaceholder(video.id) ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_40%,rgba(232,196,110,0.18),transparent_60%),linear-gradient(160deg,#1c1840,#0d0e26)]">
                  <span className="flex size-14 items-center justify-center rounded-full border border-gold/50 text-gold/80">
                    <Play className="ml-1 size-6" aria-hidden="true" />
                  </span>
                  <span className="text-[13px] text-ink-faint">{pick(telepathyCopy.reviews.placeholder, lang)}</span>
                </div>
              ) : playing === video.id ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`}
                  title={caption !== '' ? caption : label}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <button type="button" onClick={() => setPlaying(video.id)} aria-label={label} className="group absolute inset-0 h-full w-full">
                  <Image
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt=""
                    fill
                    sizes="(min-width: 1180px) 560px, (min-width: 640px) 46vw, 84vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-void/70 via-void/10 to-void/20" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="tw-btn-gold flex size-16 items-center justify-center rounded-full">
                      <Play className="ml-1 size-7 fill-current" aria-hidden="true" />
                    </span>
                  </span>
                </button>
              )}
            </div>
            {caption !== '' && <p className="mt-2.5 text-center text-[15px] text-ink-dim">{caption}</p>}
          </li>
        )
      })}
    </ul>
  )
}
