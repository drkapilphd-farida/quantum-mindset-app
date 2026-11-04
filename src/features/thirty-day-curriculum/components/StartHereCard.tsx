import Link from 'next/link'
import { Compass } from 'lucide-react'
import { getAppT } from '@/lib/app-i18n/server'
import { ORIENTATION_VIDEO_ID } from '@/config/liveClassCycle'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'

// "Start here" — the first thing a new Sharp Brain learner sees (until Day 1
// is done): the 10-minute orientation video once it is added
// (ORIENTATION_VIDEO_ID), and until then a short text guide.
export async function StartHereCard({ completedDays }: { completedDays: number }): Promise<React.JSX.Element | null> {
  if (completedDays > 0 || !(await hasQuantumSpeedReadingProAccess())) return null
  const { t } = await getAppT()
  const points = [t('dashboard.startHere.p1'), t('dashboard.startHere.p2'), t('dashboard.startHere.p3'), t('dashboard.startHere.p4')]

  return (
    <section className="play-card mx-auto w-full max-w-3xl p-5 sm:p-6" aria-labelledby="start-here" data-start-here>
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: '#0f766e' }} aria-hidden="true">
          <Compass className="size-5" />
        </span>
        <div>
          <h2 id="start-here" className="text-lg font-bold text-foreground">
            {t('dashboard.startHere.title')}
          </h2>
          <p className="text-sm text-muted-foreground">{t('dashboard.startHere.intro')}</p>
        </div>
      </div>
      {ORIENTATION_VIDEO_ID !== null && (
        <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ORIENTATION_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`}
            title={t('dashboard.startHere.video')}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        </div>
      )}
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ol>
      <Link href="/labs/sharp-brain/thirty-day-curriculum" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">
        {t('dashboard.startHere.cta')}
      </Link>
    </section>
  )
}
