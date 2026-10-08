'use client'

import { useState } from 'react'
import { Check, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import { waLink } from '@/config/site.config'
import { cancelClassRegistration, registerForClass, type LiveClassesView } from '../actions'
import { canRegister, CLASS_NUMBERS, CLASS_TOPICS_EN, classesDone, fillTemplate, formatSessionDate, formatSessionTime, isClassNumber, nextSessionFor, upcomingSessions, type Session } from '../liveClasses'

type MessageKey = Parameters<ReturnType<typeof useAppT>>[0]

// Live classes (Phase 3, item 3): the learner's progress through Classes 1–7
// (across any monthly cycle) and the upcoming sessions to register for. No
// Zoom link in the app — registering opens WhatsApp to Dr. Kapil, who sends it.
export function LiveClassesExperience({ view, now }: { view: LiveClassesView; now: number }): React.JSX.Element {
  const t = useAppT()
  const htmlLang = LANGUAGES[useUiLang()].htmlLang
  const [registered, setRegistered] = useState<ReadonlySet<string>>(new Set(view.registeredSessionIds))
  const [error, setError] = useState<string | null>(null)
  const done = classesDone(view.marks)
  const upcoming = upcomingSessions(view.sessions, now)

  const topic = (n: number): string => (isClassNumber(n) ? t(`training.liveClasses.topics.c${n}` as MessageKey) : '')
  const when = (s: Session): string =>
    fillTemplate(t('training.liveClasses.when'), { date: formatSessionDate(s.startsAt, htmlLang), from: formatSessionTime(s.startsAt, htmlLang), to: formatSessionTime(s.endsAt, htmlLang) })

  function whatsappUrl(s: Session): string {
    return waLink(
      fillTemplate(t('training.liveClasses.whatsapp'), {
        name: view.learner.name || view.learner.email,
        n: s.classNumber,
        topic: s.topicOverride ?? (isClassNumber(s.classNumber) ? CLASS_TOPICS_EN[s.classNumber] : ''),
        when: `${formatSessionDate(s.startsAt, htmlLang)}, ${formatSessionTime(s.startsAt, htmlLang)} IST`,
        email: view.learner.email,
      }),
    )
  }

  // WhatsApp opens straight from the tap (a phone blocks it after a server
  // round-trip); the registration is saved alongside and undone on failure.
  function register(s: Session): void {
    setError(null)
    window.open(whatsappUrl(s), '_blank', 'noopener')
    setRegistered((prev) => new Set(prev).add(s.id))
    void registerForClass({ sessionId: s.id }).then((res) => {
      if (res.ok) return
      setRegistered((prev) => {
        const next = new Set(prev)
        next.delete(s.id)
        return next
      })
      setError(res.error === 'not-enrolled' ? t('training.liveClasses.notEnrolled') : res.error === 'closed' ? t('training.liveClasses.closed') : t('training.liveClasses.error'))
    })
  }

  async function cancel(s: Session): Promise<void> {
    setError(null)
    const res = await cancelClassRegistration({ sessionId: s.id })
    if (!res.ok) return setError(t('training.liveClasses.error'))
    setRegistered((prev) => {
      const next = new Set(prev)
      next.delete(s.id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6" data-live-classes="true">
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="my-classes">
        <h2 id="my-classes" className="text-lg font-semibold text-foreground">
          {t('training.liveClasses.myClasses')}
        </h2>
        <p className="mt-1 text-sm font-medium text-primary" data-live-progress={`${done.size}/${view.daysCompleted}`}>
          {fillTemplate(t('training.liveClasses.progress'), { classes: done.size, days: view.daysCompleted })}
        </p>
        <ul className="mt-4 divide-y divide-border/60">
          {CLASS_NUMBERS.map((n) => {
            const isDone = done.has(n)
            const next = isDone ? null : nextSessionFor(n, view.sessions, now)
            return (
              <li key={n} className="flex items-center gap-3 py-3" data-class-row={n} data-class-done={isDone}>
                {isDone ? (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                ) : (
                  <Circle className="size-7 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{fillTemplate(t('training.liveClasses.classN'), { n })}</p>
                  <p className="text-sm leading-snug text-muted-foreground">{topic(n)}</p>
                </div>
                <span className={`max-w-[42%] shrink-0 text-right text-xs ${isDone ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                  {isDone ? t('training.liveClasses.done') : next ? fillTemplate(t('training.liveClasses.next'), { date: formatSessionDate(next.startsAt, htmlLang) }) : t('training.liveClasses.tba')}
                </span>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">{t('training.liveClasses.recordingsNote')}</p>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="upcoming-classes">
        <h2 id="upcoming-classes" className="text-lg font-semibold text-foreground">
          {t('training.liveClasses.upcoming')}
        </h2>
        {!view.enrolled && <p className="text-sm text-muted-foreground">{t('training.liveClasses.notEnrolled')}</p>}
        {error !== null && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {upcoming.length === 0 && <p className="text-sm text-muted-foreground">{t('training.liveClasses.noneUpcoming')}</p>}
        {upcoming.map((s) => {
          const isRegistered = registered.has(s.id)
          const open = canRegister(s, now)
          return (
            <article key={s.id} className="rounded-2xl border bg-card p-5 shadow-sm" data-session={s.classNumber} data-session-state={s.status === 'cancelled' ? 'cancelled' : isRegistered ? 'registered' : open ? 'open' : 'closed'}>
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">{fillTemplate(t('training.liveClasses.classN'), { n: s.classNumber })}</p>
              <h3 className="mt-0.5 text-base font-semibold text-foreground">{s.topicOverride ?? topic(s.classNumber)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{when(s)}</p>
              <div className="mt-4 flex flex-col gap-2">
                {s.status === 'cancelled' ? (
                  <p className="text-sm font-medium text-destructive">{t('training.liveClasses.sessionCancelled')}</p>
                ) : isRegistered ? (
                  <>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400" role="status">
                      {t('training.liveClasses.registered')}
                    </p>
                    {open && (
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm" className="rounded-full">
                          <a href={whatsappUrl(s)} target="_blank" rel="noopener">
                            {t('training.liveClasses.resend')}
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => void cancel(s)} data-session-cancel="true">
                          {t('training.liveClasses.cancel')}
                        </Button>
                      </div>
                    )}
                  </>
                ) : open && view.enrolled ? (
                  <Button size="lg" className="min-h-12 rounded-full" onClick={() => register(s)} data-session-register="true">
                    {t('training.liveClasses.register')}
                  </Button>
                ) : (
                  !open && <p className="text-sm text-muted-foreground">{t('training.liveClasses.closed')}</p>
                )}
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}

/** For the 30-day plan page: "4 of 7 live classes" with a link. */
export function LiveClassesProgressLink({ classesDone: count }: { classesDone: number }): React.JSX.Element {
  const t = useAppT()
  return (
    <a href="/masterclasses" className="mx-auto mt-4 flex w-full max-w-3xl items-center justify-between gap-3 rounded-2xl border bg-card px-5 py-3 text-sm shadow-sm hover:bg-muted/40" data-live-classes-link="true">
      <span className="font-medium text-foreground">{fillTemplate(t('training.liveClasses.planLine'), { classes: count })}</span>
      <span className="font-semibold text-primary">{t('training.liveClasses.planLink')} →</span>
    </a>
  )
}
