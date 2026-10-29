'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Lang } from '@/lib/i18n'
import { GALLERY_IMAGES } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { Ornament } from './ui'

const c = telepathyCopy.gallery
/** Auto-scroll speed in px per second. */
const SPEED = 28
/** After a swipe or tap, wait this long before drifting again. */
const RESUME_AFTER_MS = 2500

// Gallery (between Muse 2 and About): a slow, endless strip of workshop
// photos that drifts on its own, pauses on hover / touch / keyboard focus,
// and can be swiped. A tap opens the full-size photo viewer. Thumbnails
// are small lazy images; full size loads only in the viewer.
// Reduced-motion visitors get a plain swipeable row.
export function GallerySection({ lang }: { lang: Lang }): React.JSX.Element | null {
  const stripRef = useRef<HTMLDivElement>(null)
  const [looping, setLooping] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  // Drift: move scrollLeft a little every frame; wrap at the copy boundary.
  useEffect(() => {
    if (GALLERY_IMAGES.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    setLooping(true)
    const strip = stripRef.current
    if (!strip) return undefined

    let raf = 0
    let last = 0
    let carry = 0
    let onScreen = false
    let hovering = false
    let resumeAt = 0

    const frame = (now: number): void => {
      raf = requestAnimationFrame(frame)
      const dt = last === 0 ? 0 : Math.min(now - last, 100)
      last = now
      if (hovering || now < resumeAt) return
      const half = strip.scrollWidth / 2
      carry += (SPEED * dt) / 1000
      const whole = Math.floor(carry)
      if (whole < 1) return
      carry -= whole
      let next = strip.scrollLeft + whole
      if (next >= half) next -= half
      strip.scrollLeft = next
    }
    const play = (): void => {
      if (raf === 0 && onScreen && !document.hidden) {
        last = 0
        raf = requestAnimationFrame(frame)
      }
    }
    const pause = (): void => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    // Manual swipes past either end wrap around too.
    const onScroll = (): void => {
      const half = strip.scrollWidth / 2
      if (strip.scrollLeft <= 0) strip.scrollLeft += half
      else if (strip.scrollLeft >= half * 1.5) strip.scrollLeft -= half
    }
    const hold = (): void => {
      resumeAt = performance.now() + RESUME_AFTER_MS
    }
    const enter = (event: PointerEvent): void => {
      if (event.pointerType === 'mouse') hovering = true
    }
    const leave = (event: PointerEvent): void => {
      if (event.pointerType === 'mouse') hovering = false
    }
    const focusIn = (): void => {
      hovering = true
    }
    const focusOut = (): void => {
      hovering = false
    }
    const onVisibility = (): void => (document.hidden ? pause() : play())
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? false
      if (onScreen) play()
      else pause()
    })

    io.observe(strip)
    strip.addEventListener('scroll', onScroll, { passive: true })
    strip.addEventListener('pointerenter', enter)
    strip.addEventListener('pointerleave', leave)
    strip.addEventListener('pointerdown', hold)
    strip.addEventListener('touchstart', hold, { passive: true })
    strip.addEventListener('touchmove', hold, { passive: true })
    strip.addEventListener('wheel', hold, { passive: true })
    strip.addEventListener('focusin', focusIn)
    strip.addEventListener('focusout', focusOut)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      pause()
      io.disconnect()
      strip.removeEventListener('scroll', onScroll)
      strip.removeEventListener('pointerenter', enter)
      strip.removeEventListener('pointerleave', leave)
      strip.removeEventListener('pointerdown', hold)
      strip.removeEventListener('touchstart', hold)
      strip.removeEventListener('touchmove', hold)
      strip.removeEventListener('wheel', hold)
      strip.removeEventListener('focusin', focusIn)
      strip.removeEventListener('focusout', focusOut)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const close = useCallback(() => {
    setOpenIndex(null)
    openerRef.current?.focus()
  }, [])

  if (GALLERY_IMAGES.length === 0) return null

  // The second copy only exists to make the loop seamless: hidden from
  // screen readers and keyboard.
  const copies = looping ? [0, 1] : [0]

  return (
    <section aria-labelledby="tw-gallery" className="tw-section-warm relative py-20 sm:py-28">
      <div className="tw-reveal mx-auto max-w-3xl px-4 text-center sm:px-8">
        <Ornament className="mb-5 justify-center" />
        <h2 id="tw-gallery" className="tw-display tw-h2 text-ink">
          {pick(c.heading, lang)}
        </h2>
      </div>

      <div ref={stripRef} className="tw-snap mt-12 overflow-x-auto overscroll-x-contain">
        <ul className="flex w-max gap-3 px-4 sm:gap-4 sm:px-8">
          {copies.flatMap((copy) =>
            GALLERY_IMAGES.map((photo, index) => (
              <li key={`${copy}-${photo.src}`} aria-hidden={copy === 1 ? true : undefined} inert={copy === 1 ? true : undefined} className="flex-none">
                <button
                  type="button"
                  onClick={(event) => {
                    openerRef.current = event.currentTarget
                    setOpenIndex(index)
                  }}
                  aria-label={pick(c.open, lang, { n: String(index + 1), total: String(GALLERY_IMAGES.length) })}
                  className="tw-frame group block overflow-hidden rounded-2xl"
                >
                  <Image
                    src={photo.src}
                    alt={pick(c.imageAlt, lang)}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 640px) 440px, 300px"
                    quality={70}
                    className="h-48 w-auto object-cover transition-transform duration-500 group-hover:scale-105 sm:h-64"
                    draggable={false}
                  />
                </button>
              </li>
            )),
          )}
        </ul>
      </div>

      {openIndex !== null && <Lightbox lang={lang} index={openIndex} onIndex={setOpenIndex} onClose={close} />}
    </section>
  )
}

function Lightbox({ lang, index, onIndex, onClose }: { lang: Lang; index: number; onIndex: (i: number) => void; onClose: () => void }): React.JSX.Element {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const swipeStart = useRef<number | null>(null)
  const total = GALLERY_IMAGES.length
  const photo = GALLERY_IMAGES[index]
  const go = useCallback((step: number) => onIndex((index + step + total) % total), [index, onIndex, total])

  useEffect(() => {
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') go(1)
      else if (event.key === 'ArrowLeft') go(-1)
      else if (event.key === 'Tab') {
        // Keep focus inside the viewer.
        const buttons = dialogRef.current?.querySelectorAll('button')
        if (!buttons || buttons.length === 0) return
        const first = buttons[0]
        const lastButton = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          lastButton?.focus()
        } else if (!event.shiftKey && document.activeElement === lastButton) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go, onClose])

  if (photo === undefined) return <></>

  const navButton = 'flex size-12 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-gold hover:text-gold'

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={pick(c.viewer, lang)}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95"
      onPointerDown={(event) => {
        swipeStart.current = event.clientX
      }}
      onPointerUp={(event) => {
        if (swipeStart.current === null) return
        const dx = event.clientX - swipeStart.current
        swipeStart.current = null
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
      }}
    >
      <div className="relative h-[82svh] w-full max-w-[min(96vw,1600px)]">
        <Image key={photo.src} src={photo.src} alt={pick(c.imageAlt, lang)} fill sizes="96vw" quality={85} className="select-none object-contain" draggable={false} />
      </div>
      <p className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[14px] tabular-nums text-white/80" aria-live="polite">
        {index + 1} / {total}
      </p>
      <button ref={closeRef} type="button" onClick={onClose} aria-label={pick(c.close, lang)} className={`${navButton} absolute right-3 top-3`}>
        <X className="size-6" aria-hidden="true" />
      </button>
      <button type="button" onClick={() => go(-1)} aria-label={pick(c.previous, lang)} className={`${navButton} absolute bottom-5 left-4 sm:bottom-auto sm:left-5 sm:top-1/2 sm:-translate-y-1/2`}>
        <ChevronLeft className="size-6" aria-hidden="true" />
      </button>
      <button type="button" onClick={() => go(1)} aria-label={pick(c.next, lang)} className={`${navButton} absolute bottom-5 right-4 sm:bottom-auto sm:right-5 sm:top-1/2 sm:-translate-y-1/2`}>
        <ChevronRight className="size-6" aria-hidden="true" />
      </button>
    </div>
  )
}
