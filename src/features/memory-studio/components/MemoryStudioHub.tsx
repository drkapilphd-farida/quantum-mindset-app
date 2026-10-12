import Link from 'next/link'
import { getAppT } from '@/lib/app-i18n/server'
import { MethodCard } from './MethodCard'
import { ReviewDueCard } from './ReviewDueCard'

// Memory Studio: the memory methods (more arrive release by release) and
// today's review.
export async function MemoryStudioHub(): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5" data-memory-studio="true">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.skills.memory')}</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-foreground">{t('training.studio.title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('training.studio.subtitle')}</p>
      </div>
      <ReviewDueCard />
      <div className="flex flex-col gap-3">
        <MethodCard href="/labs/sharp-brain/story-method" icon="story-rocket" title={t('training.studio.storyTitle')} description={t('training.studio.storyDesc')} />
        <MethodCard href="/labs/sharp-brain/peg-method" icon="peg-shape" title={t('training.studio.pegTitle')} description={t('training.studio.pegDesc')} />
        <MethodCard href="/labs/sharp-brain/memory-palace" icon="palace" title={t('training.palace.title')} description={t('training.studio.palaceDesc')} />
      </div>
      <Link href="/labs/sharp-brain/review" className="self-start text-sm font-medium text-primary" data-review-link="true">
        {t('training.studio.reviewTitle')} →
      </Link>
    </div>
  )
}
