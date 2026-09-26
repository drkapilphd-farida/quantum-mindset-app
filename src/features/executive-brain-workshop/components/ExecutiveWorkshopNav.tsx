'use client'

import Link from 'next/link'
import { LivingBrainLogo } from '@/components/brand/LivingBrainLogo'
import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'
import { trackGaEvent } from '@/lib/analytics/ga4'
import { trackMetaPixelEvent } from '@/lib/analytics/metaPixel'

// Distraction-Free Landing Nav™ — same posture as QsrMumbaiNav.tsx: no
// cross-page links, one CTA. #pricing is this page's own anchor (never
// a separate route), so "Reserve My Seat" always scrolls, never
// navigates away.
export function ExecutiveWorkshopNav(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig

  function handleReserveClick(): void {
    trackGaEvent('signup_cta_click', { location: 'nav' })
    trackMetaPixelEvent('InitiateCheckout', { content_name: 'nav_reserve_seat' })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-void/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-mono text-sm tracking-[0.06em] text-ink">
          <LivingBrainLogo size={24} decorative={false} animated={false} />
          <span className="hidden sm:inline">MIND UR MIND</span>
        </Link>

        <div className="hidden text-center text-xs text-ink-dim sm:block">
          <span className="font-semibold text-ink">{config.eventDateDisplay}</span>
          <span className="mx-2 text-ink-faint">·</span>
          <span>Andheri East, Mumbai</span>
        </div>

        <a
          href="#pricing"
          onClick={handleReserveClick}
          className="flex-none rounded-sm bg-gold px-4 py-2 text-[13px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
        >
          Reserve My Seat
        </a>
      </nav>
    </header>
  )
}
