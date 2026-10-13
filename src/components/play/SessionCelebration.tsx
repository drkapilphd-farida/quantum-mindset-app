'use client'

import { useAppT } from '@/lib/app-i18n/client'
import { Confetti } from './Confetti'
import { Stars } from './Stars'

// Top of an exercise's "session complete" screen: 1–3 stars, and confetti
// with "New personal best!" when this session matched or beat the best.
export function SessionCelebration({ stars, newBest }: { stars: 1 | 2 | 3; newBest: boolean }): React.JSX.Element {
  const t = useAppT()
  return (
    <div className="flex flex-col items-center gap-2" data-session-stars={stars}>
      {newBest && <Confetti />}
      <Stars count={stars} size={44} />
      {newBest && (
        <p className="rounded-full px-4 py-1 text-sm font-bold" style={{ background: 'var(--play-warn-bg, #fef3c7)', color: 'var(--foreground)' }} data-new-best="true">
          {t('training.shell.newBest')}
        </p>
      )}
    </div>
  )
}
