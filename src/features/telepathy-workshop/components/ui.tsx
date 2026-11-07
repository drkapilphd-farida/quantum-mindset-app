import type { ReactNode } from 'react'
import Image from 'next/image'

// Small layout pieces shared by the /telepathy-workshop sections, in the
// site's light workshop-page style (same tokens as the other workshop pages).

export function Section({
  id,
  tint = false,
  className = '',
  children,
  labelledBy,
}: {
  id?: string
  /** Slightly darker cream, to give the page rhythm. */
  tint?: boolean
  className?: string
  children: ReactNode
  labelledBy?: string
}): React.JSX.Element {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tint ? 'bg-panel-2' : 'bg-void'} relative scroll-mt-20 border-b border-line px-5 py-16 sm:px-8 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-content">{children}</div>
    </section>
  )
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }): React.JSX.Element {
  return (
    <p className={`tw-eyebrow flex items-center gap-2.5 text-gold ${className}`}>
      <span className="h-px w-[22px] bg-current opacity-60" aria-hidden="true" />
      {children}
    </p>
  )
}

export function Heading({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }): React.JSX.Element {
  return (
    <h2 id={id} className={`tw-h2 text-ink ${className}`}>
      {children}
    </h2>
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
    <div className={`${frame} relative overflow-hidden rounded-sm bg-panel-2 ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={position === undefined ? undefined : { objectPosition: position }} />
    </div>
  )
}

export function CheckDot(): React.JSX.Element {
  return (
    <span className="mt-[0.3em] flex size-5 flex-none items-center justify-center rounded-full border border-gold/50 bg-gold-soft" aria-hidden="true">
      <span className="size-1.5 rounded-full bg-gold" />
    </span>
  )
}

/** "₹7,999" struck through, then "₹5,999". */
export function PriceLine({ earlier, offer, note, className = '' }: { earlier: string; offer: string; note?: string; className?: string }): React.JSX.Element {
  return (
    <p className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className}`}>
      <s className="text-[17px] text-ink-faint decoration-2">{earlier}</s>
      <span className="text-[30px] font-extrabold leading-none text-ink sm:text-[34px]">{offer}</span>
      {note !== undefined && <span className="text-[15px] font-semibold text-gold">· {note}</span>}
    </p>
  )
}

/** The site's primary gold button. */
export const GOLD_BUTTON =
  'inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm bg-gold px-6 py-3.5 text-center text-[16px] font-semibold leading-snug text-[#1B1508] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#cb9a44]'

