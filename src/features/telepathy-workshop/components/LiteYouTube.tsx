'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { trackGaEvent } from '@/lib/analytics/ga4'

export type VideoKind = 'free-session' | 'review-long' | 'review-short'

// A "lite" YouTube embed: the video's thumbnail with a play button; the
// real player (youtube-nocookie, the only YouTube domain the CSP allows)
// loads only after a tap — keeps the page fast. Each play is tracked as GA4
// "telepathy_video_play" (video id + kind).
export function LiteYouTube({ id, kind, label, sizes, className = '' }: { id: string; kind: VideoKind; label: string; sizes: string; className?: string }): React.JSX.Element {
  const [playing, setPlaying] = useState(false)
  const vertical = kind === 'review-short'

  return (
    <div className={`tw-frame relative overflow-hidden rounded-sm bg-[#111] ${vertical ? 'aspect-[9/16]' : 'aspect-video'} ${className}`}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          aria-label={label}
          onClick={() => {
            setPlaying(true)
            trackGaEvent('telepathy_video_play', { video_id: id, kind })
          }}
          className="group absolute inset-0 h-full w-full"
        >
          <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className={`flex items-center justify-center rounded-full bg-gold text-[#1B1508] shadow-lg ring-4 ring-white/30 ${vertical ? 'size-12' : 'size-16'}`}>
              <Play className={`ml-1 fill-current ${vertical ? 'size-5' : 'size-7'}`} aria-hidden="true" />
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
