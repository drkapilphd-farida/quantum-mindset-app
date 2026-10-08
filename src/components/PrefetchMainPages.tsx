'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const MAIN_PAGES = ['/dashboard', '/labs/sharp-brain/thirty-day-curriculum', '/masterclasses', '/settings'] as const

/**
 * Speed fix 4: once the app is idle after opening, quietly pre-load the main
 * pages, so tapping one (also from the phone menu, which is hidden until
 * opened) shows its page-shaped placeholder at once.
 */
export function PrefetchMainPages(): null {
  const router = useRouter()
  useEffect(() => {
    const run = (): void => {
      for (const page of MAIN_PAGES) router.prefetch(page)
    }
    // Called on window itself: a detached requestIdleCallback throws "Illegal invocation".
    if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
    else globalThis.setTimeout(run, 2500)
  }, [router])
  return null
}
