import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { NumberFlashExperience } from '@/features/flash-intelligence/components/NumberFlashExperience'
import { ExerciseLockedScreen } from '@/components/exercises/ExerciseLockedScreen'
import { getExerciseAccess } from '@/lib/exercises/queries/getExerciseAccess'
import { FLASH_INTELLIGENCE_MODULE } from '@/features/flash-intelligence/flashIntelligenceModule'

export const metadata: Metadata = {
  title: 'Number Flash™ — Sharp Brain Lab',
  description: 'Train your brain to recognize numbers instantly. Mission 2 of the Flash Intelligence Pack™.',
  robots: { index: false, follow: false },
}

export default async function NumberFlashPage(): Promise<React.JSX.Element> {
  // Curriculum exercise — paid access checked on the server, like the other
  // curriculum exercise pages (it could previously be opened by URL).
  if (!(await hasQuantumSpeedReadingProAccess())) {
    return <ProLockedScreen title="Number Flash" />
  }

  const access = await getExerciseAccess('quantum-speed-reading', FLASH_INTELLIGENCE_MODULE, 'number-flash')

  if (!access.allowed) {
    return (
      <ExerciseLockedScreen
        title="Number Flash"
        unlockHref={access.nextExercise?.href ?? '/labs/sharp-brain'}
        unlockLabel={access.nextExercise ? `Go to ${access.nextExercise.title}` : 'Back to Lab'}
      />
    )
  }

  return <NumberFlashExperience />
}
