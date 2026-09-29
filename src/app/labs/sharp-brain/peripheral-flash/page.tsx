import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { PeripheralFlashExperience } from '@/features/flash-intelligence/components/PeripheralFlashExperience'
import { ExerciseLockedScreen } from '@/components/exercises/ExerciseLockedScreen'
import { getExerciseAccess } from '@/lib/exercises/queries/getExerciseAccess'
import { FLASH_INTELLIGENCE_MODULE } from '@/features/flash-intelligence/flashIntelligenceModule'

export const metadata: Metadata = {
  title: 'Peripheral Flash™ — Sharp Brain Lab',
  description: 'Visual Span Training. Keep your eyes on the center — recognize what appears around it, without moving your eyes.',
  robots: { index: false, follow: false },
}

export default async function PeripheralFlashPage(): Promise<React.JSX.Element> {
  // Curriculum exercise — paid access checked on the server, like the other
  // curriculum exercise pages (it could previously be opened by URL).
  if (!(await hasQuantumSpeedReadingProAccess())) {
    return <ProLockedScreen title="Peripheral Flash" />
  }

  const access = await getExerciseAccess('quantum-speed-reading', FLASH_INTELLIGENCE_MODULE, 'peripheral-flash')

  if (!access.allowed) {
    return (
      <ExerciseLockedScreen
        title="Peripheral Flash"
        unlockHref={access.nextExercise?.href ?? '/labs/sharp-brain'}
        unlockLabel={access.nextExercise ? `Go to ${access.nextExercise.title}` : 'Back to Lab'}
      />
    )
  }

  return <PeripheralFlashExperience />
}
