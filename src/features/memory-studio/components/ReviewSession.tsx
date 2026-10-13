'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { recordReview, type ListMethod, type ReviewCard } from '../actions'
import { saveSimpleResult } from '../saveResult'
import { PegPicture } from './PegPicture'
import { MEMORY_STUDIO_ROUTE } from './MethodHome'

export const REVIEW_EXERCISE_ID = 'spaced-review'

function methodTitle(t: ReturnType<typeof useAppT>, method: ListMethod): string {
  const titles: Record<ListMethod, Parameters<typeof t>[0]> = {
    story: 'training.studio.storyTitle',
    peg: 'training.studio.pegTitle',
    palace: 'training.studio.myPalacesTitle',
    chapter: 'training.studio.chapterTitle',
    'name-face': 'training.studio.nameFaceTitle',
    number: 'training.studio.numberTitle',
    keyword: 'training.studio.keywordTitle',
    acronym: 'training.studio.acronymTitle',
  }
  return t(titles[method])
}

// Today's review (about 5 minutes): recall the card in your head, show the
// answer, and say honestly whether you remembered it. Remembered cards come
// back later (3 → 7 → 14 → 30 days); forgotten ones come back tomorrow.
export function ReviewSession({ cards }: { cards: readonly ReviewCard[] }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const lang = uiLang === 'hi' ? 'hi' : 'en'
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(false)
  const [tally, setTally] = useState({ remembered: 0, forgot: 0 })
  const started = useRef(performance.now())

  const shell = (children: React.ReactNode): React.JSX.Element => (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-6" data-review-session={index}>
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.skills.retention')}</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-foreground">{t('training.studio.reviewTitle')}</h1>
      </div>
      {children}
    </div>
  )

  if (cards.length === 0)
    return shell(
      <>
        <p className="text-sm text-muted-foreground" data-review-empty="true">{t('training.studio.reviewNone')}</p>
        <Button asChild size="lg" className="min-h-12 rounded-full">
          <Link href={MEMORY_STUDIO_ROUTE}>{t('training.studio.backToStudio')}</Link>
        </Button>
      </>,
    )

  if (index >= cards.length)
    return shell(
      <div className="flex flex-col gap-4" data-review-done={tally.remembered}>
        <h2 className="font-heading text-2xl font-bold text-foreground">{t('training.studio.reviewDoneTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('training.studio.reviewDoneBody', { remembered: tally.remembered, forgot: tally.forgot })}</p>
        <Button asChild size="lg" className="min-h-12 rounded-full">
          <Link href={MEMORY_STUDIO_ROUTE}>{t('training.studio.backToStudio')}</Link>
        </Button>
      </div>,
    )

  const card = cards[index]!
  const answer = (result: 'remembered' | 'forgot'): void => {
    void recordReview({ id: card.id, result })
    const next = { ...tally, [result]: tally[result] + 1 }
    setTally(next)
    setShown(false)
    if (index + 1 >= cards.length) saveSimpleResult(REVIEW_EXERCISE_ID, next.remembered, cards.length, performance.now() - started.current, uiLang)
    setIndex(index + 1)
  }

  return shell(
    <>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: index + 1, total: cards.length })}</p>
      <div className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-2xl border border-border/60 bg-card p-5 text-center" data-review-card={card.kind}>
        {card.kind === 'list' ? (
          <>
            <p className="text-lg font-semibold break-words text-foreground">{t('training.studio.listFront', { title: card.title })}</p>
            <p className="text-sm text-muted-foreground">
              {t('training.studio.itemCount', { count: card.items.length })} · {methodTitle(t, card.method)}
            </p>
            {shown && (
              <ol className="mt-2 flex w-full flex-col gap-1 text-left" data-review-answer="true">
                {card.items.map((it, i) => (
                  <li key={`${i}-${it}`} className="flex gap-2 text-base break-words text-foreground">
                    <span className="w-6 shrink-0 text-right text-primary tabular-nums">{i + 1}.</span>
                    {it}
                  </li>
                ))}
              </ol>
            )}
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-foreground">{t('training.studio.pegFront', { n: card.n })}</p>
            {shown && (
              <div data-review-answer="true">
                <PegPicture set={card.set} n={card.n} lang={lang} size={72} />
              </div>
            )}
          </>
        )}
      </div>
      {shown ? (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="lg" className="min-h-12 rounded-full" onClick={() => answer('forgot')} data-review-forgot="true">
            {t('training.studio.forgot')}
          </Button>
          <Button size="lg" className="min-h-12 rounded-full" onClick={() => answer('remembered')} data-review-remembered="true">
            {t('training.studio.remembered')}
          </Button>
        </div>
      ) : (
        <Button size="lg" className="min-h-12 rounded-full" onClick={() => setShown(true)} data-review-show="true">
          {t('training.studio.show')}
        </Button>
      )}
    </>,
  )
}
