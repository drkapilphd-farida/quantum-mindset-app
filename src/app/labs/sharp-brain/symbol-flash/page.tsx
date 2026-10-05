import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { SymbolFlashExperience } from '@/features/flash-intelligence/components/SymbolFlashExperience'
import { ExerciseLockedScreen } from '@/components/exercises/ExerciseLockedScreen'
import { getExerciseAccess } from '@/lib/exercises/queries/getExerciseAccess'
import { FLASH_INTELLIGENCE_MODULE } from '@/features/flash-intelligence/flashIntelligenceModule'

export const metadata: Metadata = {
  title: 'Symbol Flash™ — Sharp Brain Lab',
  description: 'Train ultra-fast visual recognition using symbols instead of words. Mission 3 of the Flash Intelligence Pack™.',
  robots: { index: false, follow: false },
}

export default async function SymbolFlashPage(): Promise<React.JSX.Element> {
  // Curriculum exercise — paid access checked on the server, like the other
  // curriculum exercise pages (it could previously be opened by URL).
  if (!(await hasQuantumSpeedReadingProAccess())) {
    return <ProLockedScreen title="Symbol Flash" />
  }

  const access = await getExerciseAccess('quantum-speed-reading', FLASH_INTELLIGENCE_MODULE, 'symbol-flash')

  if (!access.allowed) {
    return (
      <ExerciseLockedScreen
        title="Symbol Flash"
        unlockHref={access.nextExercise?.href ?? '/labs/sharp-brain'}
        unlockTarget={access.nextExercise?.title ?? null}
      />
    )
  }

  return <SymbolFlashExperience />
}
