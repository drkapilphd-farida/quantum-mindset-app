import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { WordFlashExperience } from '@/features/flash-intelligence/components/WordFlashExperience'
import { ExerciseLockedScreen } from '@/components/exercises/ExerciseLockedScreen'
import { getWordFlashUnlock } from '@/features/flash-intelligence/wordFlashAccess'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'

export const metadata: Metadata = {
  title: 'Rapid Recognition Drill™ — Sharp Brain Lab',
  description: 'A word flashes briefly — identify it before it disappears. The entry game of the Flash Intelligence Pack™, training instant word recognition.',
  robots: { index: false, follow: false },
}

export default async function WordFlashPage(): Promise<React.JSX.Element> {
  // Curriculum exercise — paid access checked on the server, like the other
  // curriculum exercise pages (it could previously be opened by URL).
  if (!(await hasQuantumSpeedReadingProAccess())) {
    return <ProLockedScreen title="Rapid Recognition Drill" />
  }

  // No Eye Foundation requirement any more (see getWordFlashUnlock).
  const unlock = await getWordFlashUnlock()
  if (!unlock.open) {
    return (
      <ExerciseLockedScreen
        title="Rapid Recognition Drill"
        unlockHref={unlock.nextExercise?.href ?? '/labs/sharp-brain'}
        unlockTarget={unlock.nextExercise?.title ?? null}
      />
    )
  }

  return <WordFlashExperience />
}
