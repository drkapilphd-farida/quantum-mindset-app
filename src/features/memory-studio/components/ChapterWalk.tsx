'use client'

import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { CHAPTER_EXERCISE_ID, weakIdeas, type ChapterIdea, type ChapterQuestion } from '../chapterBook'
import { addChapterReviews } from '../chapterActions'
import { shuffle } from '../storyMethod'
import { saveSimpleResult } from '../saveResult'

const rng = (n: number): number => Math.floor(Math.random() * n)
type Stage = { name: 'journey'; i: number } | { name: 'walk'; i: number } | { name: 'questions'; i: number } | { name: 'result' }

// Chapter Journey (each key idea at a station of the palace) → "walk the
// chapter" (which idea is at each station?) → 5 questions → missed ideas go
// to the review queue.
export function ChapterWalk({ mapId, title, ideas, questions, stations, skipJourney = false, onDone }: { mapId: string; title: string; ideas: readonly ChapterIdea[]; questions: readonly ChapterQuestion[]; stations: readonly string[]; skipJourney?: boolean; onDone: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [stage, setStage] = useState<Stage>(skipJourney ? { name: 'walk', i: 0 } : { name: 'journey', i: 0 })
  const answers = useRef<{ idea: number; right: boolean }[]>([])
  const [score, setScore] = useState({ walk: 0, questions: 0 })
  const started = useRef(performance.now())
  const options = useMemo(
    () =>
      ideas.map((_, i) =>
        shuffle(
          [
            i,
            ...shuffle(
              ideas.map((__, j) => j).filter((j) => j !== i),
              rng,
            ).slice(0, Math.min(3, ideas.length - 1)),
          ],
          rng,
        ),
      ),
    [ideas],
  )
  const qs = useMemo(() => questions.map((q) => ({ ...q, order: shuffle([0, 1, 2, 3], rng) })), [questions])

  if (stage.name === 'journey') {
    const idea = ideas[stage.i]!
    return (
      <div className="flex flex-col gap-4" data-chapter-journey={stage.i}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: stage.i + 1, total: ideas.length })}</p>
        <p className="text-sm font-semibold text-primary">{stations[stage.i]}</p>
        <h2 className="font-heading text-2xl font-bold break-words text-foreground">{idea.title}</h2>
        {idea.detail && <p className="text-base break-words text-foreground">{idea.detail}</p>}
        {idea.points.length > 0 && (
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            {idea.points.map((p, j) => (
              <li key={j} className="break-words">
                {p}
              </li>
            ))}
          </ul>
        )}
        <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">{t('training.studio.chapterJourneyHint', { station: stations[stage.i]! })}</p>
        <Button size="lg" className="min-h-12 rounded-full" onClick={() => setStage(stage.i + 1 < ideas.length ? { name: 'journey', i: stage.i + 1 } : { name: 'walk', i: 0 })} data-chapter-journey-next="true">
          {stage.i + 1 < ideas.length ? t('training.studio.next') : t('training.studio.chapterWalkStart')}
        </Button>
      </div>
    )
  }

  if (stage.name === 'walk') {
    const i = stage.i
    return (
      <div className="flex flex-col gap-4" data-chapter-walk={i}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.chapterWalkTitle')} · {t('training.studio.nOfTotal', { n: i + 1, total: ideas.length })}</p>
        <h2 className="text-xl font-bold break-words text-foreground">{t('training.studio.chapterWalkQuestion', { station: stations[i]! })}</h2>
        <div className="flex flex-col gap-2">
          {options[i]!.map((o) => (
            <button
              key={o}
              type="button"
              className="min-h-12 rounded-xl border-2 border-border/60 bg-background px-3 text-left text-base font-semibold break-words text-foreground"
              onClick={() => {
                const right = o === i
                answers.current.push({ idea: i, right })
                const next = { ...score, walk: score.walk + (right ? 1 : 0) }
                setScore(next)
                setStage(i + 1 < ideas.length ? { name: 'walk', i: i + 1 } : qs.length > 0 ? { name: 'questions', i: 0 } : { name: 'result' })
              }}
              data-chapter-walk-option={o}
            >
              {ideas[o]!.title}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (stage.name === 'questions') {
    const q = qs[stage.i]!
    return (
      <div className="flex flex-col gap-4" data-chapter-question={stage.i}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: stage.i + 1, total: qs.length })}</p>
        <h2 className="text-lg font-bold break-words text-foreground">{q.question}</h2>
        <div className="flex flex-col gap-2">
          {q.order.map((o) => (
            <button
              key={o}
              type="button"
              className="min-h-12 rounded-xl border-2 border-border/60 bg-background px-3 text-left text-base break-words text-foreground"
              onClick={() => {
                const right = o === q.correctIndex
                answers.current.push({ idea: q.idea, right })
                const next = { ...score, questions: score.questions + (right ? 1 : 0) }
                setScore(next)
                if (stage.i + 1 < qs.length) return setStage({ name: 'questions', i: stage.i + 1 })
                const total = ideas.length + qs.length
                saveSimpleResult(CHAPTER_EXERCISE_ID, next.walk + next.questions, total, performance.now() - started.current, uiLang)
                void addChapterReviews({ id: mapId, weak: weakIdeas(answers.current), lang: uiLang })
                setStage({ name: 'result' })
              }}
              data-chapter-option={o}
            >
              {q.options[o]}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const weak = weakIdeas(answers.current)
  return (
    <div className="flex flex-col gap-4" data-chapter-result={`${score.walk}/${score.questions}`}>
      <h2 className="font-heading text-2xl font-bold break-words text-foreground">{title}</h2>
      <p className="text-base text-foreground tabular-nums">{t('training.studio.chapterWalkScore', { correct: score.walk, total: ideas.length })}</p>
      {qs.length > 0 && <p className="text-base text-foreground tabular-nums">{t('training.studio.chapterQuestionsScore', { correct: score.questions, total: qs.length })}</p>}
      {weak.length > 0 ? (
        <div className="rounded-xl bg-muted/60 p-3 text-sm">
          <p className="font-semibold text-foreground">{t('training.studio.chapterWeak')}</p>
          <ul className="mt-1 list-disc pl-5 text-muted-foreground">
            {weak.map((i) => (
              <li key={i} className="break-words">
                {ideas[i]?.title}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t('training.studio.chapterAllRight')}</p>
      )}
      <p className="text-sm text-muted-foreground">{t('training.studio.savedForReview')}</p>
      <Button size="lg" className="min-h-12 rounded-full" onClick={onDone} data-chapter-done="true">
        {t('training.studio.continue')}
      </Button>
    </div>
  )
}
