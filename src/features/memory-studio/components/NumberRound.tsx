'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { digitScore, numberPicture, pairsOf, type NumberList } from '../numberCode'
import { DigitPad } from './DigitPad'
import { NumberPictureCard } from './NumberPictureCard'
import { SuggestButton } from './SuggestButton'

// One number round: see the number in pairs (with their pictures at the
// easier levels) → make one scene from the pictures, in order → type the
// number back. Points: digits in the right place × level.
export function NumberRound({ number, list, pictures, level, onDone }: { number: string; list: NumberList; pictures: boolean; level: number; onDone: (o: RoundOutcome) => void }): React.JSX.Element {
  const t = useAppT()
  const [stage, setStage] = useState<'study' | 'recall'>('study')
  const [scene, setScene] = useState('')
  const pairs = pairsOf(number)

  if (stage === 'recall')
    return (
      <div className="flex flex-col gap-4" data-number-recall={number.length}>
        <h2 className="text-xl font-bold text-foreground">{t('training.studio.numberRecall')}</h2>
        <DigitPad length={number.length} onSubmit={(answer) => onDone({ correct: digitScore(number, answer), total: number.length, score: digitScore(number, answer) * level })} />
      </div>
    )

  return (
    <div className="flex flex-col gap-4" data-number-study={number}>
      <p className="text-center font-heading text-3xl font-bold tracking-wider text-foreground tabular-nums" data-number-target={number}>
        {pairs.join(' ')}
      </p>
      {pictures ? (
        <div className="flex flex-wrap justify-center gap-4">
          {pairs.map((pair, i) => (
            <NumberPictureCard key={`${i}-${pair}`} list={list} pair={pair} size={52} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">{t('training.studio.numberNoPictures')}</p>
      )}
      <p className="text-center text-sm text-muted-foreground">{t('training.studio.numberStudyHint')}</p>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.numberScene')}</span>
        <textarea value={scene} onChange={(e) => setScene(e.target.value.slice(0, 1000))} rows={2} className="rounded-xl border border-border bg-background px-3 py-2 text-base text-foreground" />
      </label>
      {pictures && pairs.length >= 2 && <SuggestButton request={{ kind: 'story', items: pairs.map((pair) => numberPicture(list, pair).word), lang: list }} onIdea={(text) => setScene(text.slice(0, 1000))} />}
      <Button size="lg" className="min-h-12 rounded-full" onClick={() => setStage('recall')} data-number-ready="true">
        {t('training.studio.faceReady')}
      </Button>
    </div>
  )
}
