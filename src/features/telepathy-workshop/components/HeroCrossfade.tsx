'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { HERO_FADE_SECONDS, HERO_IMAGES, HERO_SLIDE_SECONDS } from '@/config/telepathyWorkshopConfig'

// Hero background: a slow crossfade through HERO_IMAGES (no arrows or
// dots). The first photo is server-rendered with priority (the LCP image);
// the others mount only once the page is idle, and the rotation moves on
// only to photos that have finished loading. Pauses while the tab is
// hidden or the hero is off-screen; reduced-motion visitors see photo 1 only.
export function HeroCrossfade({ alt }: { alt: string }): React.JSX.Element {
  const [extrasMounted, setExtrasMounted] = useState(false)
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set([0]))
  const [active, setActive] = useState(0)
  // The rotation timer reads the latest loaded set through this ref.
  const loadedRef = useRef(loaded)
  useEffect(() => {
    loadedRef.current = loaded
  }, [loaded])

  // Mount photos 2+ after the page is interactive (and never for reduced motion).
  useEffect(() => {
    if (HERO_IMAGES.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let idleId: number | undefined
    let timerId: number | undefined
    const mount = (): void => setExtrasMounted(true)
    const schedule = (): void => {
      if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(mount, { timeout: 3000 })
      else timerId = window.setTimeout(mount, 1500)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => {
      window.removeEventListener('load', schedule)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timerId !== undefined) window.clearTimeout(timerId)
    }
  }, [])

  // Advance every HERO_SLIDE_SECONDS while visible.
  useEffect(() => {
    if (!extrasMounted) return undefined
    const hero = document.getElementById('tw-hero')
    let onScreen = true
    let timer: number | undefined
    const stop = (): void => {
      window.clearInterval(timer)
      timer = undefined
    }
    const start = (): void => {
      if (timer !== undefined || document.hidden || !onScreen) return
      timer = window.setInterval(() => {
        setActive((current) => {
          // Next photo that has loaded (skip any still downloading).
          for (let step = 1; step <= HERO_IMAGES.length; step++) {
            const next = (current + step) % HERO_IMAGES.length
            if (loadedRef.current.has(next)) return next
          }
          return current
        })
      }, HERO_SLIDE_SECONDS * 1000)
    }
    const onVisibility = (): void => (document.hidden ? stop() : start())
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? false
      if (onScreen) start()
      else stop()
    })
    if (hero) io.observe(hero)
    document.addEventListener('visibilitychange', onVisibility)
    start()
    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [extrasMounted])

  return (
    <div className="absolute inset-0 -z-30">
      {HERO_IMAGES.map((photo, index) => {
        if (index > 0 && !extrasMounted) return null
        return (
          <Image
            key={photo.src}
            src={photo.src}
            alt={index === 0 ? alt : ''}
            fill
            sizes="100vw"
            priority={index === 0}
            fetchPriority={index === 0 ? 'high' : 'low'}
            onLoad={index === 0 ? undefined : () => setLoaded((prev) => new Set(prev).add(index))}
            className="object-cover"
            style={{
              objectPosition: photo.position,
              opacity: index === active ? 1 : 0,
              transition: `opacity ${HERO_FADE_SECONDS}s ease-in-out`,
            }}
          />
        )
      })}
    </div>
  )
}
