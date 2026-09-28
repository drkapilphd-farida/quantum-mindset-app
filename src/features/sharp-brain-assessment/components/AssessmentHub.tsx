'use client'

import { useCallback, useState } from 'react'
import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage } from '@/context/LanguageContext'
import { ASSESSMENT_COPY } from '../assessmentCopy'
import { passageForStage } from '../assessmentPassages'
import type { AssessmentStage, AssessmentState } from '../assessmentTypes'
import { AssessmentFlow } from './AssessmentFlow'
import { ResultsComparison, ShareCard } from './ResultsComparison'

// Day 1 vs Day 30 assessment hub (Phase 8, Item 11): shows the right next
// step for where the learner is, runs the flow, then the comparison.

const primaryButton = 'inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 text-[15px] font-semibold text-primary-foreground'
const secondaryButton = 'inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium hover:bg-muted'

export function AssessmentHub({ state }: { state: AssessmentState }): React.JSX.Element {
  const { lang } = useLanguage()
  const copy = ASSESSMENT_COPY[lang]
  const [running, setRunning] = useState<AssessmentStage | null>(null)
  const stopRunning = useCallback(() => setRunning(null), [])
  const { day1, day30, window } = state

  const header = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="mt-1 text-xs font-medium text-muted-foreground">{copy.disclaimer}</p>
      </div>
      <LanguageToggle />
    </div>
  )

  if (running !== null) {
    return (
      <div className="space-y-6">
        {header}
        <AssessmentFlow stage={running} passage={passageForStage(running, day1?.passageId ?? null)} copy={copy} onCancel={stopRunning} />
      </div>
    )
  }

  const dateFormatter = new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' })

  return (
    <div className="space-y-6">
      {header}

      {day1 !== null && day30 !== null && (
        <section className="space-y-5">
          <h2 className="text-lg font-semibold">{copy.resultsTitle}</h2>
          <ResultsComparison day1={day1} day30={day30} copy={copy} />
          <ShareCard copy={copy} />
        </section>
      )}

      {day1 === null && (
        <section className="space-y-4 rounded-2xl border border-border p-5">
          <p className="text-[15px] leading-relaxed">{state.hasPacedDay1Only ? copy.pacedOnly : copy.noBaseline}</p>
          <p className="text-sm text-muted-foreground">{copy.about}</p>
          <button type="button" className={primaryButton} onClick={() => setRunning('day1')}>
            {state.hasPacedDay1Only ? copy.newBaseline : copy.startDay1}
          </button>
        </section>
      )}

      {day1 !== null && day30 === null && (
        <>
          <section className="space-y-4 rounded-2xl border border-border p-5">
            {window.status === 'locked' && <p className="text-[15px] leading-relaxed">{copy.locked(dateFormatter.format(new Date(window.unlocksOn)), window.programDay)}</p>}
            {(window.status === 'open' || window.status === 'late') && (
              <>
                <p className="text-[15px] font-medium">{window.status === 'late' ? copy.late : copy.open}</p>
                <button type="button" className={primaryButton} onClick={() => setRunning('day30')}>
                  {copy.startDay30}
                </button>
              </>
            )}
          </section>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">{copy.day1Results}</h2>
            <ResultsComparison day1={day1} day30={null} copy={copy} />
          </section>
          <section className="space-y-2">
            <button type="button" className={secondaryButton} onClick={() => setRunning('day1')}>
              {copy.newBaseline}
            </button>
            <p className="text-xs text-muted-foreground">{copy.newBaselineNote}</p>
          </section>
        </>
      )}
    </div>
  )
}
