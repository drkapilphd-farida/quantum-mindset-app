import Link from 'next/link'
import { getAppT } from '@/lib/app-i18n/server'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import { getReminderBanner } from '../actions'

const PLAN = '/labs/sharp-brain/thirty-day-curriculum'

// Daily reminders (Phase 3) — the in-app banner: today's status in the
// learner's language, with the streak shown gently. Missed days never reset
// anything; the next day is simply waiting.
export async function ReminderBanner(): Promise<React.JSX.Element | null> {
  const data = await getReminderBanner()
  if (data === null) return null
  const { t, lang } = await getAppT()
  const { status, streak } = data
  const time = (iso: string): string => new Intl.DateTimeFormat(`${LANGUAGES[lang].htmlLang}-IN-u-nu-latn`, { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date(iso))

  const text =
    status.kind === 'ready'
      ? t('dashboard.reminders.banner.ready', { day: status.day })
      : status.kind === 'opens_later'
        ? t('dashboard.reminders.banner.opensLater', { day: status.day, time: time(status.opensAt) })
        : status.kind === 'missed'
          ? status.missedDays === 1
            ? t('dashboard.reminders.banner.missedOne', { day: status.day })
            : t('dashboard.reminders.banner.missedMany', { n: status.missedDays, day: status.day })
          : t('dashboard.reminders.banner.complete')
  const action =
    status.kind === 'ready' || status.kind === 'missed'
      ? { href: `${PLAN}?view=day&day=${status.day}`, label: t('dashboard.reminders.banner.start', { day: status.day }) }
      : status.kind === 'complete'
        ? { href: '/labs/sharp-brain/certificate', label: t('dashboard.reminders.banner.viewCertificate') }
        : null

  return (
    <div className="mx-auto mb-4 flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between" data-reminder-banner={status.kind}>
      <div className="min-w-0">
        <p className="font-semibold text-foreground">{text}</p>
        {streak >= 2 && <p className="mt-0.5 text-xs text-muted-foreground" data-streak={streak}>{t('dashboard.reminders.banner.streak', { n: streak })}</p>}
      </div>
      {action !== null && (
        <Link href={action.href} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
          {action.label}
        </Link>
      )}
    </div>
  )
}
