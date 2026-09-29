import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { MixedFlashExperience } from '@/features/flash-intelligence/components/MixedFlashExperience'
import { ExerciseLockedScreen } from '@/components/exercises/ExerciseLockedScreen'
import { getExerciseAccess } from '@/lib/exercises/queries/getExerciseAccess'
import { FLASH_INTELLIGENCE_MODULE } from '@/features/flash-intelligence/flashIntelligenceModule'

export const metadata: Metadata = {
  title: 'Mixed Flash™ — Sharp Brain Lab',
  description: 'Words, numbers, and symbols — the brain never knows which is coming next. The Boss Mission of the Flash Intelligence Pack™.',
  robots: { index: false, follow: false },
}

export default async function MixedFlashPage(): Promise<React.JSX.Element> {
  // Curriculum exercise — paid access checked on the server, like the other
  // curriculum exercise pages (it could previously be opened by URL).
  if (!(await hasQuantumSpeedReadingProAccess())) {
    return <ProLockedScreen title="Mixed Flash" />
  }

  const access = await getExerciseAccess('quantum-speed-reading', FLASH_INTELLIGENCE_MODULE, 'mixed-flash')

  if (!access.allowed) {
    return (
      <ExerciseLockedScreen
        title="Mixed Flash"
        unlockHref={access.nextExercise?.href ?? '/labs/sharp-brain'}
        unlockLabel={access.nextExercise ? `Go to ${access.nextExercise.title}` : 'Back to Lab'}
      />
    )
  }

  return <MixedFlashExperience />
}
