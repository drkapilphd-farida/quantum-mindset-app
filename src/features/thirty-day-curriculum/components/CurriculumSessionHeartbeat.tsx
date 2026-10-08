'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { loadActiveCurriculumSession } from '../curriculumSessionRunner'
import { usePracticeHeartbeat } from '../usePracticeHeartbeat'

const PLAN_ROUTE = '/labs/sharp-brain/thirty-day-curriculum'

/**
 * Pace control: keeps counting practice time while a learner is on an
 * exercise's own page during a 30-day-plan day (the day view counts for
 * itself). Mounted once in the dashboard layout; renders nothing.
 */
export function CurriculumSessionHeartbeat(): null {
  const pathname = usePathname()
  const [day, setDay] = useState<number | null>(null)
  useEffect(() => {
    const session = loadActiveCurriculumSession()
    setDay(session !== null && session.replay !== true && !pathname.startsWith(PLAN_ROUTE) ? session.day : null)
  }, [pathname])
  usePracticeHeartbeat(day ?? 1, day !== null)
  return null
}
