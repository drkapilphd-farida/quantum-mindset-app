'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Clock, Lock, Star } from 'lucide-react'
import { programs } from '@/config/site.config'
import { dayTitle, phaseDescription, phaseTitle } from '@/lib/app-i18n/curriculumText'
import { useAppI18n } from '@/lib/app-i18n/client'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CHECKPOINT_DAYS, CURRICULUM_PHASES, TOTAL_CURRICULUM_DAYS } from '../curriculumDatabase'
import { isCurriculumDayUnlocked } from '../curriculumProgress'
import { dayMinutes, dayStepCount, type SkillBar, type SkillId } from '../skillProgress'

type ThirtyDayCurriculumOverviewProps = {
  onSelectDay: (day: number) => void
  onLockedDayClick: (day: number) => void
  /** Opens the enrolment offer (shown only to learners without the program). */
  onStartProgram: () => void
  isPro: boolean
  /** Server-recorded finished days — every lock, tick and the Today card come from these. */
  serverCompletedDays: readonly number[]
  /** Pace control: when the next day opens (null = open now). */
  nextDayOpensAt?: string | null
  /** Focus / Memory / Reading / Retention: first practice → now (server-computed). */
  skillBars: readonly SkillBar[]
}

const SKILL_COLOUR: Record<SkillId, string> = {
  focus: 'var(--skill-focus, #4f46e5)',
  memory: 'var(--skill-memory, #7c3aed)',
  reading: 'var(--skill-reading, #ea580c)',
  retention: 'var(--skill-calm, #0d9488)',
}

// The 30-day plan page (redesign, Oct 2026): what to do today first, then the
// 30 days at a glance, then skill growth, then the 4 phases (folded). The
// longer explanation sits behind "About the program".
export function ThirtyDayCurriculumOverview({ onSelectDay, onLockedDayClick, onStartProgram, isPro, serverCompletedDays, nextDayOpensAt = null, skillBars }: ThirtyDayCurriculumOverviewProps): React.JSX.Element {
  const { t, lang } = useAppI18n()
  const [aboutOpen, setAboutOpen] = useState(false)
  const time = (iso: string): string => new Intl.DateTimeFormat(`${LANGUAGES[lang].htmlLang}-IN-u-nu-latn`, { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date(iso))

  // Today = the first day not yet finished (a learner with gaps from old test data still gets the earliest open day).
  const firstUnfinished = Array.from({ length: TOTAL_CURRICULUM_DAYS }, (_, i) => i + 1).find((d) => !serverCompletedDays.includes(d)) ?? null
  const todayOpen = firstUnfinished !== null && isCurriculumDayUnlocked(firstUnfinished, serverCompletedDays, isPro, nextDayOpensAt)
  const opensLater = firstUnfinished !== null && isPro && !todayOpen && nextDayOpensAt !== null && serverCompletedDays.includes(firstUnfinished - 1)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-10" data-plan-overview="true">
      {/* (a) Today */}
      <section className="play-card flex flex-col gap-3 p-5" data-today-card={firstUnfinished === null ? 'complete' : todayOpen ? 'open' : opensLater ? 'opens-later' : 'locked'}>
        <p className="text-xs font-bold tracking-wider text-primary uppercase">{t('curriculum.overview.today')}</p>
        {firstUnfinished === null ? (
          <>
            <h1 className="text-[1.75rem] leading-tight text-foreground">{t('curriculum.overview.allDone')}</h1>
            <Link href="/labs/sharp-brain/certificate" className="btn-finish inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold">
              {t('curriculum.overview.viewCertificate')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h1 className="text-[1.75rem] leading-tight text-foreground">{t('curriculum.overview.dayN', { day: firstUnfinished })}</h1>
              <p className="text-base text-muted-foreground tabular-nums">{t('curriculum.overview.dayMeta', { steps: dayStepCount(firstUnfinished), minutes: dayMinutes(firstUnfinished) })}</p>
            </div>
            <p className="text-base text-muted-foreground">{dayTitle(t, firstUnfinished)}</p>
            {!isPro ? (
              <button type="button" onClick={onStartProgram} className="btn-finish inline-flex min-h-12 items-center justify-center rounded-2xl px-6 text-base font-bold" data-enroll-button="true">
                {t('curriculum.startProgram', { program: programs.sharpBrain.name })}
              </button>
            ) : todayOpen ? (
              <button type="button" onClick={() => onSelectDay(firstUnfinished)} className="btn-finish inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold" data-today-start={firstUnfinished}>
                {t('curriculum.overview.start')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <p className="flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-semibold text-foreground" style={{ background: 'var(--play-warn-bg)' }}>
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                {opensLater && nextDayOpensAt !== null ? t('curriculum.overview.opensAt', { day: firstUnfinished, time: time(nextDayOpensAt) }) : t('curriculum.overview.finishPrevious')}
              </p>
            )}
            {opensLater && <p className="text-sm text-muted-foreground">{t('training.play.todayComplete')}</p>}
          </>
        )}
      </section>

      {/* (b) The 30 days */}
      <section className="play-card p-4" aria-labelledby="plan-days">
        <h2 id="plan-days" className="text-xl text-foreground">{t('curriculum.allDays')}</h2>
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10">
          {Array.from({ length: TOTAL_CURRICULUM_DAYS }, (_, index) => index + 1).map((day) => (
            <DayCell key={day} day={day} isToday={day === firstUnfinished} serverCompletedDays={serverCompletedDays} nextDayOpensAt={nextDayOpensAt} isPro={isPro} onSelectDay={onSelectDay} onLockedDayClick={onLockedDayClick} />
          ))}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <li className="flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-500" aria-hidden="true" />
            {t('curriculum.overview.legendDone')}
          </li>
          <li className="flex items-center gap-1">
            <span className="size-3 rounded-sm ring-2 ring-primary" aria-hidden="true" />
            {t('curriculum.overview.legendToday')}
          </li>
          <li className="flex items-center gap-1">
            <Lock className="size-3.5" aria-hidden="true" />
            {t('curriculum.overview.legendLocked')}
          </li>
        </ul>
        {opensLater && nextDayOpensAt !== null && firstUnfinished !== null && (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-foreground" data-next-opens="true">
            <Clock className="size-4" aria-hidden="true" />
            {t('curriculum.overview.opensAt', { day: firstUnfinished, time: time(nextDayOpensAt) })}
          </p>
        )}
      </section>

      {/* (c) Skills: first practice → now */}
      <section className="play-card flex flex-col gap-4 p-4" aria-labelledby="plan-skills" data-skill-bars="true">
        <div>
          <h2 id="plan-skills" className="text-xl text-foreground">{t('curriculum.overview.skillsTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('curriculum.overview.skillsHint')}</p>
        </div>
        {skillBars.map((bar) => (
          <SkillRow key={bar.skill} bar={bar} />
        ))}
      </section>

      {/* (d) Phases, folded */}
      <section className="play-card p-4" aria-labelledby="plan-phases">
        <h2 id="plan-phases" className="text-xl text-foreground">{t('curriculum.overview.phasesTitle')}</h2>
        <div className="mt-2 flex flex-col divide-y divide-border">
          {CURRICULUM_PHASES.map((phase) => {
            const [start, end] = phase.dayRange
            const done = serverCompletedDays.filter((day) => day >= start && day <= end).length
            return (
              <details key={phase.id} className="group py-2" data-phase={phase.id}>
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0">
                    <span className="block text-xs font-bold tracking-wider text-muted-foreground uppercase">{t('curriculum.overview.phaseDays', { start, end })}</span>
                    <span className="block text-base font-semibold text-foreground">{phaseTitle(t, phase.id)}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground tabular-nums">
                    {done}/{end - start + 1}
                    <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </span>
                </summary>
                <p className="pt-1 pb-2 text-base text-muted-foreground">{phaseDescription(t, phase.id)}</p>
              </details>
            )
          })}
        </div>
        <button type="button" onClick={() => setAboutOpen(true)} className="mt-2 min-h-11 text-base font-semibold text-primary underline underline-offset-4" data-about-program="true">
          {t('curriculum.overview.about')}
        </button>
      </section>

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('curriculum.overview.about')}</DialogTitle>
            <DialogDescription className="text-base">{t('curriculum.intro')}</DialogDescription>
          </DialogHeader>
          <p className="text-base font-semibold text-foreground">{t('curriculum.overview.aboutDayIntro')}</p>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-base text-foreground">
            <li>{t('curriculum.overview.aboutStep1')}</li>
            <li>{t('curriculum.overview.aboutStep2')}</li>
            <li>{t('curriculum.overview.aboutStep3')}</li>
            <li>{t('curriculum.overview.aboutStep4')}</li>
          </ol>
          <p className="text-sm text-muted-foreground">{t('curriculum.allDaysHintPro')}</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SkillRow({ bar }: { bar: SkillBar }): React.JSX.Element {
  const { t } = useAppI18n()
  const value = (n: number): string => (bar.unit === 'wpm' ? t('curriculum.overview.wpm', { n }) : `${n}%`)
  // Percent bars use 0–100; reading speed uses a scale that always fits the learner's own numbers.
  const max = bar.unit === 'wpm' ? Math.max(400, Math.ceil(Math.max(bar.start ?? 0, bar.now ?? 0) / 100) * 100) : 100
  const width = (n: number): string => `${Math.max(3, Math.min(100, (n / max) * 100))}%`
  return (
    <div className="flex flex-col gap-1" data-skill={bar.skill} data-skill-start={bar.start ?? ''} data-skill-now={bar.now ?? ''}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-base font-semibold text-foreground">{t(`curriculum.overview.skills.${bar.skill}`)}</span>
        {bar.start !== null && bar.now !== null && (
          <span className="text-sm text-muted-foreground tabular-nums">{t('curriculum.overview.startNow', { start: value(bar.start), now: value(bar.now) })}</span>
        )}
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        {bar.now !== null && <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: width(bar.now), background: SKILL_COLOUR[bar.skill] }} />}
        {bar.start !== null && <div className="absolute inset-y-0 w-0.5 bg-foreground/70" style={{ left: width(bar.start) }} />}
      </div>
      <p className="text-sm text-muted-foreground">{bar.now === null ? t('curriculum.overview.skillEmpty') : t(`curriculum.overview.skillHelp.${bar.skill}`)}</p>
    </div>
  )
}

function DayCell({
  day,
  isToday,
  serverCompletedDays,
  nextDayOpensAt,
  isPro,
  onSelectDay,
  onLockedDayClick,
}: {
  day: number
  isToday: boolean
  serverCompletedDays: readonly number[]
  nextDayOpensAt: string | null
  isPro: boolean
  onSelectDay: (day: number) => void
  onLockedDayClick: (day: number) => void
}): React.JSX.Element {
  const { t } = useAppI18n()
  const unlocked = isCurriculumDayUnlocked(day, serverCompletedDays, isPro, nextDayOpensAt)
  const completed = serverCompletedDays.includes(day)
  const isCheckpoint = CHECKPOINT_DAYS.includes(day)

  // A locked tile is still a button: it explains why (enrol / finish the day before / opens at midnight).
  return (
    <button
      type="button"
      onClick={() => (unlocked ? onSelectDay(day) : onLockedDayClick(day))}
      title={unlocked ? dayTitle(t, day) : t('curriculum.dayLockedTitle', { day })}
      aria-label={`${t('curriculum.dayShort', { day })}${completed ? ' ✓' : ''}`}
      aria-current={isToday ? 'step' : undefined}
      data-day={day}
      data-day-unlocked={unlocked}
      data-day-completed={completed}
      data-day-today={isToday}
      data-day-locked-pro={!unlocked}
      className={`relative flex aspect-square min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl border-2 font-heading text-lg tabular-nums transition-colors ${
        isToday
          ? 'border-primary bg-primary/15 text-foreground ring-2 ring-primary ring-offset-2 ring-offset-card'
          : completed
            ? 'border-amber-400/70 bg-amber-400/10 text-foreground'
            : unlocked
              ? 'border-border bg-card text-foreground'
              : 'border-border/40 bg-muted/40 text-muted-foreground/60'
      }`}
    >
      {isCheckpoint && !completed && <span className="absolute top-1 right-1.5 size-1.5 rounded-full bg-amber-500" aria-hidden="true" />}
      <span className="leading-none">{day}</span>
      {completed ? (
        <span className="flex" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <Star key={i} className="size-2.5 fill-amber-400 text-amber-500" />
          ))}
        </span>
      ) : !unlocked ? (
        <Lock className="size-3" aria-hidden="true" />
      ) : null}
    </button>
  )
}
