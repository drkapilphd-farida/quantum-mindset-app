'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { itemName, type StudioItem, type StudioLang } from '../content'
import { orderScore, shuffle, storyLevel } from '../storyMethod'
import { OrderRecall } from './OrderRecall'
import { StudioPicture } from './StudioPicture'
import { SuggestButton } from './SuggestButton'

const rng = (n: number): number => Math.floor(Math.random() * n)

// One Story-method round: see the list in order → make one linked story
// (writing it down is optional; an idea can be suggested) → put the items
// back in order.
export function StoryRound({
  level,
  list,
  unseen,
  lang,
  practice,
  onDone,
}: {
  level: number
  list: readonly StudioItem[]
  unseen: readonly StudioItem[]
  lang: StudioLang
  practice: boolean
  onDone: (outcome: RoundOutcome) => void
}): React.JSX.Element {
  const t = useAppT()
  const pictures = practice || storyLevel(level).pictures
  const [stage, setStage] = useState<'study' | 'recall'>('study')
  const [story, setStory] = useState('')
  const [suggested, setSuggested] = useState(false)
  const choices = useMemo(() => shuffle([...list, ...unseen], rng).map((i) => ({ id: i.id, label: itemName(i, lang), picture: pictures })), [list, unseen, lang, pictures])

  if (stage === 'recall') {
    return (
      <OrderRecall
        choices={choices}
        count={list.length}
        onCheck={(answer) => {
          const correct = orderScore(
            list.map((i) => i.id),
            answer,
          )
          onDone({ correct, total: list.length, score: correct * level })
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4" data-story-study={list.length}>
      <div>
        <h2 className="text-xl font-bold text-foreground">{t('training.studio.storyStudyTitle')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('training.studio.storyStudyHint')}</p>
      </div>
      {pictures ? (
        <ol className="grid grid-cols-3 gap-3 min-[420px]:grid-cols-4">
          {list.map((i, n) => (
            <li key={i.id}>
              <StudioPicture id={i.id} label={itemName(i, lang)} number={n + 1} size={48} />
            </li>
          ))}
        </ol>
      ) : (
        <ol className="grid grid-cols-2 gap-x-4 gap-y-1">
          {list.map((i, n) => (
            <li key={i.id} className="flex gap-2 text-base font-semibold text-foreground" data-story-word={i.id}>
              <span className="w-6 text-right text-primary tabular-nums">{n + 1}.</span>
              {itemName(i, lang)}
            </li>
          ))}
        </ol>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.storyWrite')}</span>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value.slice(0, 2000))}
          rows={3}
          placeholder={t('training.studio.storyWritePlaceholder')}
          className="rounded-xl border border-border bg-background px-3 py-2 text-base text-foreground"
        />
      </label>
      <SuggestButton
        request={{ kind: 'story', items: list.map((i) => itemName(i, lang)), lang }}
        onIdea={(text) => {
          setSuggested(true)
          setStory((s) => (s.trim() === '' ? text : `${s}\n${text}`))
        }}
      />
      {suggested && <p className="text-xs text-muted-foreground">{t('training.studio.suggestNote')}</p>}
      <Button size="lg" className="min-h-12 rounded-full" onClick={() => setStage('recall')} data-story-ready="true">
        {t('training.studio.storyReady')}
      </Button>
    </div>
  )
}
