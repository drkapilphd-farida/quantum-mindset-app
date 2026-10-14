import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { getAppT } from '@/lib/app-i18n/server'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import type { MessageKey } from '@/lib/app-i18n/translate'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { getNextClass } from '../actions'
import { fillTemplate, formatSessionDate, formatSessionTime, isClassNumber } from '../liveClasses'

// "Next class: Class 1 · Foundation · Sat, 18 Oct, 7:00 pm → Register" —
// replaces "0 of 7 live classes" on the dashboard and the plan page. Only
// for Sharp Brain learners; registering happens on the Live Classes page.
export async function NextClassCard(): Promise<React.JSX.Element | null> {
  const [enrolled, next] = await Promise.all([hasQuantumSpeedReadingProAccess(), getNextClass()])
  if (!enrolled) return null
  const { t, lang } = await getAppT()
  const htmlLang = LANGUAGES[lang].htmlLang
  const topic = next !== null && isClassNumber(next.classNumber) ? t(`training.liveClasses.topics.c${next.classNumber}` as MessageKey) : ''

  return (
    <Link href="/masterclasses" className="play-card mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3" data-next-class={next?.classNumber ?? 'tba'}>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: '#6d28d9' }} aria-hidden="true">
        <CalendarDays className="size-5" />
      </span>
      {next === null ? (
        <span className="min-w-0 flex-1 text-base font-semibold text-foreground">{t('training.liveClasses.tbaLine')}</span>
      ) : (
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-bold tracking-wider text-primary uppercase">{t('training.liveClasses.nextTitle')}</span>
          <span className="text-base font-semibold break-words text-foreground">{fillTemplate(t('training.liveClasses.nextLine'), { n: next.classNumber, topic })}</span>
          <span className="text-sm text-muted-foreground tabular-nums">{fillTemplate(t('training.liveClasses.nextWhen'), { date: formatSessionDate(next.startsAt, htmlLang), time: formatSessionTime(next.startsAt, htmlLang) })}</span>
        </span>
      )}
      <span className={`shrink-0 text-sm font-bold ${next?.registered === true ? 'text-emerald-700 dark:text-emerald-300' : 'text-primary'}`}>
        {next?.registered === true ? t('training.liveClasses.registeredCta') : next === null ? t('training.liveClasses.planLink') + ' →' : t('training.liveClasses.registerCta')}
      </span>
    </Link>
  )
}
