'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import { fillTemplate, isClassNumber } from '@/features/live-classes/liveClasses'
import { markRecordingWatched } from '../recordings'
import { recordingEmbedUrl, type ClassRecordingState } from '../rules'

type MessageKey = Parameters<ReturnType<typeof useAppT>>[0]

/** "Thu, 12 Nov 2026" for a class date ("YYYY-MM-DD"), in the learner's language, 0–9 digits. */
function formatClassDate(date: string, htmlLang: string): string {
  return new Intl.DateTimeFormat(`${htmlLang}-IN-u-nu-latn`, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(`${date}T12:00:00+05:30`))
}

// The 7 classes, each with its recording(s) in the privacy-enhanced YouTube
// player (youtube-nocookie.com, rel=0) — the raw YouTube link is never shown.
// "Mark as watched" counts that class as done.
export function ClassRecordingsList({ classes, watched }: { classes: ClassRecordingState[]; watched: number[] }): React.JSX.Element {
  const t = useAppT()
  const htmlLang = LANGUAGES[useUiLang()].htmlLang
  const [done, setDone] = useState<ReadonlySet<number>>(new Set(watched))
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function mark(recordingId: string, classNumber: number): Promise<void> {
    setPending(recordingId)
    setError(null)
    const res = await markRecordingWatched({ recordingId })
    setPending(null)
    if (!res.ok) return setError(t('training.recordings.error'))
    setDone((prev) => new Set(prev).add(classNumber))
  }

  return (
    <div className="flex flex-col gap-4">
      {error !== null && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {classes.map((c) => {
        const topic = isClassNumber(c.classNumber) ? t(`training.liveClasses.topics.c${c.classNumber}` as MessageKey) : ''
        const isDone = done.has(c.classNumber)
        return (
          <article key={c.classNumber} className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5" data-recording-class={c.classNumber} data-recording-state={c.state}>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold tracking-wide text-primary uppercase">{fillTemplate(t('training.liveClasses.classN'), { n: c.classNumber })}</p>
                <h3 className="text-base font-semibold text-foreground">{topic}</h3>
              </div>
              {isDone && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400" data-recording-watched="true">
                  {t('training.recordings.watched')}
                </span>
              )}
            </div>
            {c.state !== 'available' ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                {c.state === 'coming_soon' ? t('training.recordings.comingSoon') : t('training.recordings.afterClass')}
              </p>
            ) : (
              c.recordings.map((r) => (
                <div key={r.id} className="mt-4" data-recording-id={r.id}>
                  <p className="text-sm font-medium text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">{formatClassDate(r.classDate, htmlLang)}</p>
                  <div className="mt-2 aspect-video w-full overflow-hidden rounded-xl bg-black">
                    <iframe
                      src={recordingEmbedUrl(r.youtubeId)}
                      title={fillTemplate(t('training.recordings.playerTitle'), { n: c.classNumber })}
                      className="size-full"
                      loading="lazy"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  {!isDone && (
                    <Button variant="outline" size="sm" className="mt-3 rounded-full" disabled={pending === r.id} onClick={() => void mark(r.id, c.classNumber)} data-mark-watched="true">
                      {t('training.recordings.markWatched')}
                    </Button>
                  )}
                </div>
              ))
            )}
          </article>
        )
      })}
    </div>
  )
}
