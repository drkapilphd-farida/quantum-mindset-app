'use client'

import { useAppT } from '@/lib/app-i18n/client'

// While an exercise loads: the shape of the screen to come (title, a card,
// two buttons) instead of a blank page with "Loading…". Pulses gently;
// stays still for reduced motion. Screen readers still hear the loading text.
export function LoadingSkeleton(): React.JSX.Element {
  const t = useAppT()
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 py-8" role="status" data-loading-skeleton="true">
      <span className="sr-only">{t('training.shell.loading')}</span>
      <div className="h-4 w-24 rounded-full bg-muted motion-safe:animate-pulse" />
      <div className="h-8 w-3/4 rounded-xl bg-muted motion-safe:animate-pulse" />
      <div className="h-36 w-full rounded-2xl bg-muted motion-safe:animate-pulse" />
      <div className="h-12 w-full rounded-2xl bg-muted motion-safe:animate-pulse" />
      <div className="h-12 w-full rounded-2xl bg-muted/70 motion-safe:animate-pulse" />
    </div>
  )
}
