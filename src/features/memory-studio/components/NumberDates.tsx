'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import type { StudioLang } from '../content'
import { DATES_PER_ROUND, dateEvent, digitScore, NUMBER_DATES_EXERCISE_ID, pairsOf, pickDates, type HistoryDate, type NumberList } from '../numberCode'
import { saveSimpleResult } from '../saveResult'
import { DigitPad } from './DigitPad'
import { NumberPictureCard } from './NumberPictureCard'

const rng = (n: number): number => Math.floor(Math.random() * n)

// Dates: each event with its year as two pictures (19 + 47) → make one scene
// with the event in it → then, for each event, type its year.
export function NumberDates({ list, lang, onBack }: { list: NumberList; lang: StudioLang; onBack: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const last = useRef<string[]>([])
  const [dates, setDates] = useState<HistoryDate[]>(() => pickDates([], rng))
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<'study' | 'recall' | 'result'>('study')
  const [correct, setCorrect] = useState(0)
  const started = useRef(performance.now())

  const again = (): void => {
    last.current = dates.map((x) => x.id)
    setDates(pickDates(last.current, rng))
    setI(0)
    setCorrect(0)
    setPhase('study')
    started.current = performance.now()
  }

  if (phase === 'result')
    return (
      <div className="flex flex-col gap-4" data-dates-result={correct}>
        <h2 className="font-heading text-3xl font-bold text-foreground tabular-nums">{t('training.studio.correctOf', { correct, total: DATES_PER_ROUND })}</h2>
        <ul className="flex flex-col gap-1 text-sm text-foreground">
          {dates.map((x) => (
            <li key={x.id} className="flex gap-2">
              <span className="font-bold text-primary tabular-nums">{x.year}</span>
              {dateEvent(x, lang)}
            </li>
          ))}
        </ul>
        <Button size="lg" className="min-h-12 rounded-full" onClick={again} data-dates-again="true">
          {t('training.studio.numberDatesAgain')}
        </Button>
        <Button variant="outline" size="lg" className="min-h-12 rounded-full" onClick={onBack}>
          {t('training.studio.back')}
        </Button>
      </div>
    )

  const date = dates[i]!
  if (phase === 'recall')
    return (
      <div className="flex flex-col gap-4" data-dates-recall={date.id}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: i + 1, total: DATES_PER_ROUND })}</p>
        <h2 className="text-xl font-bold break-words text-foreground">{t('training.studio.numberDateQuestion', { event: dateEvent(date, lang) })}</h2>
        <DigitPad
          key={date.id}
          length={4}
          onSubmit={(answer) => {
            const total = correct + (digitScore(date.year, answer) === 4 ? 1 : 0)
            setCorrect(total)
            if (i + 1 < DATES_PER_ROUND) setI(i + 1)
            else {
              saveSimpleResult(NUMBER_DATES_EXERCISE_ID, total, DATES_PER_ROUND, performance.now() - started.current, uiLang)
              setPhase('result')
            }
          }}
        />
      </div>
    )

  return (
    <div className="flex flex-col items-center gap-4" data-dates-study={date.id}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: i + 1, total: DATES_PER_ROUND })}</p>
      <p className="text-center text-xl font-bold break-words text-foreground">{dateEvent(date, lang)}</p>
      <p className="font-heading text-4xl font-bold text-primary tabular-nums">{date.year}</p>
      <div className="flex justify-center gap-6">
        {pairsOf(date.year).map((pair, k) => (
          <NumberPictureCard key={`${k}-${pair}`} list={list} pair={pair} size={60} />
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">{t('training.studio.numberDateHint')}</p>
      <Button
        size="lg"
        className="min-h-12 w-full rounded-full"
        onClick={() => {
          if (i + 1 < DATES_PER_ROUND) setI(i + 1)
          else {
            setI(0)
            setPhase('recall')
          }
        }}
        data-dates-next="true"
      >
        {i + 1 < DATES_PER_ROUND ? t('training.studio.next') : t('training.studio.faceReady')}
      </Button>
    </div>
  )
}
