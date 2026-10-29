import type { ReactNode } from 'react'
import Image from 'next/image'

// Small layout pieces shared by the /telepathy-workshop sections.

export function Section({
  id,
  tone,
  className = '',
  children,
  labelledBy,
}: {
  id?: string
  tone: 'dark' | 'warm'
  className?: string
  children: ReactNode
  labelledBy?: string
}): React.JSX.Element {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tone === 'dark' ? 'tw-section-dark' : 'tw-section-warm'} relative scroll-mt-20 px-4 py-20 sm:px-8 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-content">{children}</div>
    </section>
  )
}

export function Heading({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }): React.JSX.Element {
  return (
    <h2 id={id} className={`tw-display tw-h2 text-ink ${className}`}>
      {children}
    </h2>
  )
}

export function Ornament({ className = '' }: { className?: string }): React.JSX.Element {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
      <svg viewBox="0 0 24 24" className="size-4 text-gold" fill="currentColor">
        <path d="M12 2l1.8 6.7L20 10l-6.2 1.6L12 22l-1.8-10.4L4 10l6.2-1.3L12 2z" />
      </svg>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  )
}

/** A framed photo (next/image, lazy, cropped to fill). */
export function Photo({
  src,
  alt,
  sizes,
  className = '',
  frame = 'tw-frame',
  priority = false,
  position,
}: {
  src: string
  alt: string
  sizes: string
  className?: string
  frame?: 'tw-frame' | 'tw-frame-glow'
  priority?: boolean
  /** CSS object-position: which part stays in view when cropped. */
  position?: string
}): React.JSX.Element {
  return (
    <div className={`${frame} relative overflow-hidden rounded-[28px] bg-panel ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={position === undefined ? undefined : { objectPosition: position }} />
    </div>
  )
}

export function CheckDot(): React.JSX.Element {
  return (
    <span className="mt-[0.35em] flex size-5 flex-none items-center justify-center rounded-full border border-gold/50 bg-gold/10" aria-hidden="true">
      <span className="size-1.5 rounded-full bg-gold" />
    </span>
  )
}
