'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Lang } from '@/lib/i18n'
import { GALLERY_IMAGES, type GalleryPhoto } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { Heading, Section } from './ui'

const c = telepathyCopy.gallery

/** "Mumbai · 2023", "2023", or '' when neither is known. */
function caption(photo: GalleryPhoto, lang: Lang): string {
  return [photo.city === null ? null : pick(c.cities[photo.city], lang), photo.year === null ? null : String(photo.year)].filter(Boolean).join(' · ')
}

// I — workshop photos: a plain grid of real photos with city/year captions
// (ordinary lazy-loaded images, so they show in every browser). A tap opens
// the full-size photo viewer (prev/next/close, keyboard and swipe).
export function GallerySection({ lang }: { lang: Lang }): React.JSX.Element | null {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const close = useCallback(() => {
    setOpenIndex(null)
    openerRef.current?.focus()
  }, [])

  if (GALLERY_IMAGES.length === 0) return null

  return (
    <Section labelledBy="tw-gallery">
      <Heading id="tw-gallery" className="tw-reveal text-center">
        {pick(c.heading, lang)}
      </Heading>
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {GALLERY_IMAGES.map((photo, index) => {
          const text = caption(photo, lang)
          return (
            <li key={photo.src}>
              <button
                type="button"
                onClick={(event) => {
                  openerRef.current = event.currentTarget
                  setOpenIndex(index)
                }}
                aria-label={`${pick(c.open, lang, { n: String(index + 1), total: String(GALLERY_IMAGES.length) })}${text ? ` — ${text}` : ''}`}
                className="tw-frame group relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-panel-2"
              >
                <Image src={photo.src} alt={pick(c.imageAlt, lang)} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 32vw, 48vw" quality={70} className="object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: photo.position }} />
              </button>
              {text && <p className="mt-1.5 text-[13.5px] text-ink-dim">{text}</p>}
            </li>
          )
        })}
      </ul>
      {openIndex !== null && <Lightbox lang={lang} index={openIndex} onIndex={setOpenIndex} onClose={close} />}
    </Section>
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
  const text = caption(photo, lang)
  const navButton = 'flex size-12 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-[#e8c46e] hover:text-[#e8c46e]'

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={pick(c.viewer, lang)}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/95"
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
      <div className="relative h-[78svh] w-full max-w-[min(96vw,1600px)]">
        <Image key={photo.src} src={photo.src} alt={pick(c.imageAlt, lang)} fill sizes="96vw" quality={85} className="select-none object-contain" draggable={false} />
      </div>
      <p className="mt-3 text-[14px] text-white/80" aria-live="polite">
        {index + 1} / {total}
        {text && ` · ${text}`}
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
