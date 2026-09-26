import type { Metadata } from 'next'
import { ColorSceneTransformationExperience } from '@/features/color-scene-transformation/components/ColorSceneTransformationExperience'

export const metadata: Metadata = {
  title: 'Color & Scene Transformation Journey — Quantum Speed Reading Lab™',
  robots: { index: false, follow: false },
}

// Color & Scene Transformation Journey™ — the second Visualization
// Development exercise, alongside Quantum Mental Object Rotation™.
// Deliberately its own route/folder, no collision with any existing V1
// or V2 route.
export default function ColorSceneTransformationPage(): React.JSX.Element {
  return <ColorSceneTransformationExperience />
}
