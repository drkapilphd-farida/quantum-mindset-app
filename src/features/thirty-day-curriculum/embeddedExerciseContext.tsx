'use client'

import { createContext, useContext } from 'react'

// True Full-Screen Viewport Lock™ — every embeddable exercise's Canvas
// (ReadingLayout.tsx, ExercisePracticeLayout.tsx) was built for full-page
// standalone use: its own Exit button, its own BrandWatermark, its own
// min-h-[100dvh]. That's correct when the exercise owns its own route
// (e.g. /labs/sharp-brain/rsvp — no other chrome exists there).
// It's actively harmful when DayMasterPlayer.tsx embeds that same
// component in-page inside its own wizard card: the wizard already shows
// an equivalent Exit/Skip header, so the embedded exercise's own
// min-h-[100dvh] + duplicate header stacked underneath it was forcing
// the page to be taller than one screen and scroll — exactly the mobile
// bug this context exists to fix. DayMasterPlayer provides `true` only
// while rendering an embedded step; every standalone route never
// provides it at all, so useIsEmbeddedExercise() defaults to false and
// those routes are completely unaffected.
const EmbeddedExerciseContext = createContext(false)

export function EmbeddedExerciseProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <EmbeddedExerciseContext.Provider value={true}>{children}</EmbeddedExerciseContext.Provider>
}

export function useIsEmbeddedExercise(): boolean {
  return useContext(EmbeddedExerciseContext)
}

// Which 30-day programme day an embedded exercise is being played for, so
// its server-saved result can be filed under that day (exercise_results.
// curriculum_day). null everywhere outside DayMasterPlayer.
export type CurriculumDayInfo = { day: number; isReplay: boolean }

const CurriculumDayContext = createContext<CurriculumDayInfo | null>(null)

export function CurriculumDayProvider({ value, children }: { value: CurriculumDayInfo; children: React.ReactNode }): React.JSX.Element {
  return <CurriculumDayContext.Provider value={value}>{children}</CurriculumDayContext.Provider>
}

export function useCurriculumDayInfo(): CurriculumDayInfo | null {
  return useContext(CurriculumDayContext)
}
