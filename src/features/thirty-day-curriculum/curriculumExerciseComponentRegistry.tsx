'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

export type EmbeddableExerciseProps = { onComplete: () => void; onExit?: () => void }

// Every registry entry is lazy-loaded (next/dynamic, ssr: false) — the
// wizard only ever mounts ONE of these 41 heavy exercise engines at a
// time, so eagerly importing all 41 into the curriculum route's bundle
// would be real, avoidable bloat. Cast through `unknown`: the real
// components' onComplete signatures vary (`() => void`,
// `(accuracyPercent: number) => void`, `(result, estimatedWpm) => void`,
// etc.) — TypeScript already allows a caller to pass a zero-arg function
// wherever more parameters are declared (verified throughout this
// feature's own components), so this is a real, safe compatibility, not
// a loophole; the cast just lets the registry hold one uniform type
// instead of 41 bespoke ones. `onExit` is genuinely optional at this
// level: most of the 41 don't declare it at all (their own internal exit
// path already returns to the day view via curriculumReturnRouting.ts's
// wizard-day flag — see DayMasterPlayer.tsx), so an unused extra prop is
// simply ignored by React; only the 10 Visual Activation Suite drills
// below actually require it.
function lazy(importFn: () => Promise<{ default: ComponentType<never> }>): ComponentType<EmbeddableExerciseProps> {
  return dynamic(importFn, { ssr: false }) as unknown as ComponentType<EmbeddableExerciseProps>
}

function lazyNamed<T extends ComponentType<never>>(importFn: () => Promise<Record<string, T>>, exportName: string): ComponentType<EmbeddableExerciseProps> {
  return lazy(() => importFn().then((mod) => ({ default: mod[exportName] as ComponentType<never> })))
}

export const CURRICULUM_EMBEDDABLE_COMPONENTS: Readonly<Record<string, ComponentType<EmbeddableExerciseProps>>> = {
  // Brain Gym — Visual Activation Suite™. Each of these 10 catalog ids
  // gets its OWN specific drill component directly (NOT the shared
  // `VisualActivationSuiteExperience` orchestrator, which internally runs
  // all 10 drills back-to-back before ever calling onComplete — mounting
  // that as a single wizard step was the exact cause of the "loops
  // through Brain Gym forever" bug: a learner picking a Brain Gym slot
  // that landed on any of these 10 ids would sit through the whole
  // 10-drill circuit before the wizard ever got a chance to advance to
  // Right-Brain/Visualization/Reading, and exiting mid-circuit fell
  // through to a raw `/labs/sharp-brain` redirect since the
  // orchestrator's own `onExit` was never wired here). Each individual
  // drill component (ThetaBreathingAnchor, etc.) already takes exactly
  // `{ onComplete: () => void; onExit: () => void }` — both required —
  // so the wizard now drives one real, complete, single drill per step,
  // exactly like every other Brain Gym pick.
  // The four former watch-only drills now end with an answer step (exercise-core glimpse trainer).
  'peripheral-flash-expander': lazyNamed(() => import('@/features/exercise-core/components/GlimpseExperiences'), 'PeripheralFlashGlimpse'),
  'quantum-tachistoscope-multi-word-blast': lazyNamed(() => import('@/features/exercise-core/components/GlimpseExperiences'), 'MultiWordFlashGlimpse'),
  'blink-trigger-micro-recall': lazyNamed(() => import('@/features/exercise-core/components/GlimpseExperiences'), 'BlinkRecallGlimpse'),
  'schulte-grid-speed-drill': lazyNamed(() => import('@/components/qsr/visual-activation/SchulteGridSpeedDrill'), 'SchulteGridSpeedDrill'),
  'rapid-visual-span-expander': lazyNamed(() => import('@/features/exercise-core/components/GlimpseExperiences'), 'RapidVisualSpanGlimpse'),

  'cross-lateral-tap': lazyNamed(() => import('@/features/brain-gym/components/CrossLateralTapExperience'), 'CrossLateralTapExperience'),
  'fast-pattern-blinking': lazyNamed(() => import('@/features/brain-gym/components/FastPatternBlinkingExperience'), 'FastPatternBlinkingExperience'),

  // Right-Brain / Intuition
  'photographic-memory': lazyNamed(() => import('@/features/photographic-memory/components/PhotographicMemoryExperience'), 'PhotographicMemoryExperience'),
  'pictorial-essence-sprint': lazyNamed(
    () => import('@/features/pictorial-essence-sprint/components/PictorialEssenceSprintExperience'),
    'PictorialEssenceSprintExperience',
  ),
  'hemispheric-color-sync': lazyNamed(
    () => import('@/features/hemispheric-color-sync/components/HemisphericColorSyncExperience'),
    'HemisphericColorSyncExperience',
  ),
  'dot-memory-grid': lazyNamed(() => import('@/features/dot-memory-grid/components/DotMemoryGridExperience'), 'DotMemoryGridExperience'),
  'number-flash-grid': lazyNamed(() => import('@/features/number-flash-grid/components/NumberFlashGridExperience'), 'NumberFlashGridExperience'),
  'word-flash-grid': lazyNamed(() => import('@/features/word-flash-grid/components/WordFlashGridExperience'), 'WordFlashGridExperience'),
  'image-flash-grid': lazyNamed(() => import('@/features/image-flash-grid/components/ImageFlashGridExperience'), 'ImageFlashGridExperience'),

  // Visualization
  'quantum-mental-rotation': lazyNamed(
    () => import('@/features/quantum-mental-rotation/components/QuantumMentalRotationExperience'),
    'QuantumMentalRotationExperience',
  ),
  'color-scene-transformation': lazyNamed(
    () => import('@/features/color-scene-transformation/components/ColorSceneTransformationExperience'),
    'ColorSceneTransformationExperience',
  ),
  'sensory-hologram-builder': lazyNamed(
    () => import('@/features/sensory-hologram-builder/components/SensoryHologramBuilderExperience'),
    'SensoryHologramBuilderExperience',
  ),
  'calm-breathing': lazyNamed(() => import('@/features/calm-breathing/components/CalmBreathingExperience'), 'CalmBreathingExperience'),

  // Reading Hub
  'dynamic-chunk-sliding': lazyNamed(() => import('@/features/dynamic-chunk-sliding/components/DynamicChunkSlidingExperience'), 'DynamicChunkSlidingExperience'),
  'vertical-chunk-sliding': lazyNamed(() => import('@/features/vertical-chunk-sliding/components/VerticalChunkSlidingExperience'), 'VerticalChunkSlidingExperience'),
  'flash-recall-sprint': lazyNamed(() => import('@/features/flash-recall-sprint/components/FlashRecallSprintExperience'), 'FlashRecallSprintExperience'),
  'vertical-flash-recall': lazyNamed(() => import('@/features/vertical-flash-recall/components/VerticalFlashRecallExperience'), 'VerticalFlashRecallExperience'),
  'vertical-word-reading': lazyNamed(() => import('@/features/vertical-word-reading/components/VerticalWordReadingExperience'), 'VerticalWordReadingExperience'),
  'phrase-reading-mode': lazyNamed(() => import('@/features/phrase-reading-mode/components/PhraseReadingModeExperience'), 'PhraseReadingModeExperience'),
  'sentence-reading-mode': lazyNamed(() => import('@/features/sentence-reading-mode/components/SentenceReadingModeExperience'), 'SentenceReadingModeExperience'),
  'paragraph-reading-mode': lazyNamed(() => import('@/features/paragraph-reading-mode/components/ParagraphReadingModeExperience'), 'ParagraphReadingModeExperience'),
  'guided-paragraph-reading-mode': lazyNamed(
    () => import('@/features/guided-paragraph-reading-mode/components/GuidedParagraphReadingModeExperience'),
    'GuidedParagraphReadingModeExperience',
  ),
  'subvocalization-destroyer': lazyNamed(
    () => import('@/features/subvocalization-destroyer/components/SubvocalizationDestroyerExperience'),
    'SubvocalizationDestroyerExperience',
  ),
  'photographic-reading': lazyNamed(() => import('@/features/photographic-reading/components/PhotographicReadingExperience'), 'PhotographicReadingExperience'),
  'dual-stream-split-reader': lazyNamed(
    () => import('@/features/dual-stream-split-reader/components/DualStreamSplitReaderExperience'),
    'DualStreamSplitReaderExperience',
  ),
}

export function getEmbeddableComponent(exerciseId: string): ComponentType<EmbeddableExerciseProps> | undefined {
  return CURRICULUM_EMBEDDABLE_COMPONENTS[exerciseId]
}
