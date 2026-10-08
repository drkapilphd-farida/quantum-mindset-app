'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// A thin progress bar at the top of the screen that starts the moment a link
// is tapped and finishes when the next page arrives, so a click never looks
// like nothing happened (speed fix 4, 8 Oct 2026).
export function NavigationProgress(): React.JSX.Element | null {
  const pathname = usePathname()
  const search = useSearchParams()
  const [progress, setProgress] = useState<number | null>(null)
  const timer = useRef<number | null>(null)
  const safety = useRef<number | null>(null)

  function stopTimers(): void {
    if (timer.current !== null) window.clearInterval(timer.current)
    if (safety.current !== null) window.clearTimeout(safety.current)
    timer.current = null
    safety.current = null
  }

  // The new page has arrived: complete the bar, then hide it.
  useEffect(() => {
    stopTimers()
    setProgress((p) => (p === null ? null : 100))
    const hide = window.setTimeout(() => setProgress(null), 250)
    return () => window.clearTimeout(hide)
  }, [pathname, search])

  useEffect(() => {
    function onClick(event: MouseEvent): void {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest?.('a')
      if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      const url = new URL(href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return
      stopTimers()
      setProgress(8)
      // Creep towards 90% while waiting; the real arrival completes it.
      timer.current = window.setInterval(() => setProgress((p) => (p === null ? null : Math.min(90, p + (90 - p) * 0.12))), 200)
      // Never leave a bar stuck (e.g. a link that turned out not to navigate).
      safety.current = window.setTimeout(() => {
        stopTimers()
        setProgress(null)
      }, 15_000)
    }
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      stopTimers()
    }
  }, [])

  if (progress === null) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px]" aria-hidden="true" data-nav-progress={Math.round(progress)}>
      <div className="h-full bg-primary shadow-[0_0_8px_var(--color-primary)] transition-[width] duration-200 ease-out motion-reduce:transition-none" style={{ width: `${progress}%` }} />
    </div>
  )
}
