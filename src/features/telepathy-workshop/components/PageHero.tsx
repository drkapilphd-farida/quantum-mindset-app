import type { ReactNode } from 'react'
import { Starfield } from './Starfield'

// The dark, starry hero of the /telepathy-workshop page, for its sister
// pages (/telepathy-workshop/online, /vadodara): H1, subtitle and whatever
// block goes under them. Same classes as HeroSection, without the photos.
export function PageHero({ id, title, sub, children }: { id: string; title: string; sub: string; children?: ReactNode }): React.JSX.Element {
  return (
    <section aria-labelledby={id} className="tw-dark relative isolate overflow-hidden px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
      <div className="tw-hero-overlay absolute inset-0 -z-20" />
      <Starfield className="absolute inset-0 -z-10 h-full w-full" />
      <div className="mx-auto w-full max-w-4xl text-center">
        <h1 id={id} className="tw-h1 mx-auto max-w-[22ch] text-ink">
          {title}
        </h1>
        <p className="tw-body mx-auto mt-6 max-w-2xl">{sub}</p>
        {children}
      </div>
    </section>
  )
}
