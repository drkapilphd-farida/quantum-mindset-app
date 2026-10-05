import type { Metadata } from 'next'
import { EyeWarmupExperience } from '@/features/quantum-speed-reading/components/EyeWarmupExperience'
import { ExerciseLockedScreen } from '@/components/exercises/ExerciseLockedScreen'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { getExerciseAccess } from '@/lib/exercises/queries/getExerciseAccess'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { EYE_FOUNDATION_MODULE } from '@/features/quantum-speed-reading/eyeFoundationModule'

export const metadata: Metadata = {
  title: 'Eye Warm-up — Sharp Brain Lab',
  description: "Let's loosen up your eyes before we begin.",
  robots: { index: false, follow: false },
}

export default async function EyeWarmupPage(): Promise<React.JSX.Element> {
  // Quantum Speed Reading Paywall™ — checked before the sequential-
  // mastery gate below: Reading Preparation™ requires Pro regardless of
  // how far a free user has otherwise progressed.
  if (!(await hasQuantumSpeedReadingProAccess())) {
    return <ProLockedScreen title="Eye Warm-up" />
  }

  const access = await getExerciseAccess('quantum-speed-reading', EYE_FOUNDATION_MODULE, 'eye-warm-up')

  if (!access.allowed) {
    return (
      <ExerciseLockedScreen
        title="Eye Warm-up"
        unlockHref={access.nextExercise?.href ?? '/labs/sharp-brain'}
        unlockTarget={access.nextExercise?.title ?? null}
      />
    )
  }

  return <EyeWarmupExperience />
}
