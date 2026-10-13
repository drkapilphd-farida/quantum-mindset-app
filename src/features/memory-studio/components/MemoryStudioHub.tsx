import Link from 'next/link'
import { getAppT } from '@/lib/app-i18n/server'
import { getMethodLevels } from '../methodLevels'
import { MethodCard } from './MethodCard'
import { ReviewDueCard } from './ReviewDueCard'

// Memory Studio (play design): today's review, then every memory method as a
// tile with the learner's level.
const METHODS = [
  { href: '/labs/sharp-brain/chapter-book', icon: 'chapter', title: 'training.studio.chapterTitle', desc: 'training.studio.chapterDesc', exercise: 'chapter-book' },
  { href: '/labs/sharp-brain/story-method', icon: 'story-rocket', title: 'training.studio.storyTitle', desc: 'training.studio.storyDesc', exercise: 'story-method' },
  { href: '/labs/sharp-brain/peg-method', icon: 'peg-shape', title: 'training.studio.pegTitle', desc: 'training.studio.pegDesc', exercise: 'peg-method' },
  { href: '/labs/sharp-brain/memory-palace', icon: 'palace', title: 'training.palace.title', desc: 'training.studio.palaceDesc', exercise: 'memory-palace' },
  { href: '/labs/sharp-brain/my-palaces', icon: 'my-palaces', title: 'training.studio.myPalacesTitle', desc: 'training.studio.myPalacesDesc', exercise: 'palace-personal' },
  { href: '/labs/sharp-brain/names-and-faces', icon: 'name-face', title: 'training.studio.nameFaceTitle', desc: 'training.studio.nameFaceDesc', exercise: 'name-face' },
  { href: '/labs/sharp-brain/number-pictures', icon: 'number', title: 'training.studio.numberTitle', desc: 'training.studio.numberDesc', exercise: 'number-code' },
  { href: '/labs/sharp-brain/keyword-method', icon: 'keyword', title: 'training.studio.keywordTitle', desc: 'training.studio.keywordDesc', exercise: 'keyword-method' },
  { href: '/labs/sharp-brain/acronyms', icon: 'acronym', title: 'training.studio.acronymTitle', desc: 'training.studio.acronymDesc', exercise: 'acronym-own' },
] as const

export async function MemoryStudioHub(): Promise<React.JSX.Element> {
  const [{ t }, levels] = await Promise.all([getAppT(), getMethodLevels(METHODS.map((m) => m.exercise))])
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5" data-memory-studio="true">
      <div>
        <span className="inline-block rounded-full px-3 py-0.5 text-xs font-bold tracking-wider text-white uppercase" style={{ background: '#7c3aed' }}>
          {t('training.skills.memory')}
        </span>
        <h1 className="mt-2 text-[2rem] text-foreground">{t('training.studio.title')}</h1>
        <p className="mt-1 text-base text-muted-foreground">{t('training.studio.subtitle')}</p>
      </div>
      <ReviewDueCard />
      <div className="grid grid-cols-2 gap-3">
        {METHODS.map((m) => {
          const level = levels[m.exercise] ?? null
          return <MethodCard key={m.href} href={m.href} icon={m.icon} title={t(m.title)} description={t(m.desc)} levelLabel={level === null ? t('training.studio.methodNew') : t('training.studio.levelChip', { level })} />
        })}
      </div>
      <Link href="/labs/sharp-brain/review" className="self-start text-sm font-semibold text-primary" data-review-link="true">
        {t('training.studio.reviewTitle')} →
      </Link>
    </div>
  )
}
