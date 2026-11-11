import type { Metadata } from 'next'
import Image from 'next/image'
import { REVIEW_VIDEOS } from '@/features/programs/reviewVideos'
import { SHARP_BRAIN_VIDEO_REVIEWS } from '@/config/sharpBrainVideoReviews'
import { DEFAULT_THUMB_FRAME, reviewFrameSrc, reviewFrameStyle, type ThumbFrame, type VideoShape } from '@/lib/video/reviewFrames'

// TEMPORARY — delete before merging (owner, Nov 2026). Every review video
// with its three in-video frames (hq1 25% · hq2 50% · hq3 75%), cropped
// exactly as on the site, so the owner can pick the best one. Open without a
// login on a hard-to-guess path (the admin login sent him to the app login),
// noindex/nofollow, not in the sitemap or robots.txt, linked from nowhere.
export const metadata: Metadata = { title: 'Review thumbnails', robots: { index: false, follow: false } }

const FRAMES: ThumbFrame[] = [1, 2, 3]

type Row = { id: string; shape: VideoShape; caption: string; current: ThumbFrame }

function Frame({ row, frame }: { row: Row; frame: ThumbFrame }): React.JSX.Element {
  const vertical = row.shape === 'S'
  // Same card shape as on the site: Shorts 9:16, long videos 16:9.
  const boxAspect = vertical ? 9 / 16 : 16 / 9
  const { objectPosition, ...zoom } = reviewFrameStyle(boxAspect, row.shape)
  const chosen = frame === row.current
  return (
    <figure className="flex flex-col items-center gap-1.5">
      <div className={`relative overflow-hidden rounded-md border-2 bg-muted ${chosen ? 'border-emerald-600' : 'border-transparent'} ${vertical ? 'aspect-[9/16] w-[120px]' : 'aspect-video w-[220px]'}`}>
        <span className="absolute inset-0" style={zoom}>
          <Image src={reviewFrameSrc(row.id, frame)} alt="" fill sizes={vertical ? '120px' : '220px'} className="object-cover" style={{ objectPosition }} />
        </span>
      </div>
      <figcaption className={`text-xs ${chosen ? 'font-semibold text-emerald-700' : 'text-muted-foreground'}`}>
        hq{frame}
        {chosen ? ' · now on the site' : ''}
      </figcaption>
    </figure>
  )
}

function Section({ title, rows }: { title: string; rows: Row[] }): React.JSX.Element {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">
        {title} ({rows.length})
      </h2>
      <ol className="divide-y rounded-md border">
        {rows.map((row, index) => (
          <li key={row.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-start md:gap-6" data-review-thumb-row={row.id}>
            <div className="min-w-0 md:w-72 md:flex-none">
              <p className="text-sm font-medium">
                {index + 1}. {row.caption}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {row.id} · {row.shape === 'S' ? 'Short (9:16)' : 'Long (16:9)'}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {FRAMES.map((frame) => (
                <Frame key={frame} row={row} frame={frame} />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function ReviewThumbsPage(): React.JSX.Element {
  const sessions: Row[] = REVIEW_VIDEOS.map((v) => ({ id: v.id, shape: v.type, caption: v.caption.en, current: v.thumbFrame ?? DEFAULT_THUMB_FRAME }))
  const sharpBrain: Row[] = SHARP_BRAIN_VIDEO_REVIEWS.map((v) => ({ id: v.videoId, shape: 'S', caption: v.caption.en, current: v.thumbFrame ?? DEFAULT_THUMB_FRAME }))
  return (
    <main className="mx-auto max-w-6xl space-y-8 bg-white px-4 py-8 text-neutral-900 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Review thumbnails</h1>
        <p className="text-sm text-muted-foreground">
          Each review video with YouTube&apos;s three frames from inside the video — hq1 (25%), hq2 (50%), hq3 (75%) — cropped exactly as on the site. The green one is on the site now (hq2 unless chosen). Send the video ID and the frame you want (1, 2 or 3).
        </p>
      </div>
      <Section title="Personal Sessions reviews" rows={sessions} />
      <Section title="Sharp Brain reviews" rows={sharpBrain} />
    </main>
  )
}
