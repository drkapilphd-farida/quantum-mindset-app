'use client'

import Image from 'next/image'
import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'
import { buildWhatsAppLink } from '../utmTracking'
import { trackGaEvent } from '@/lib/analytics/ga4'
import { trackMetaPixelEvent } from '@/lib/analytics/metaPixel'
import { EegWaveform } from './EegWaveform'

// Photo choice: /founder-warm.jpg — the same high-resolution (5280x3588)
// professional portrait already used as this site's own default founder
// photo (see GuideProfileCard.tsx's own doc comment on why it's the
// fallback everywhere else). next/image handles the responsive
// sizes/WebP conversion automatically (this app's existing convention —
// no manually pre-generated image variants anywhere else in the repo),
// so no separate optimized copies were created by hand.
export function ExecutiveWorkshopHero(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig
  const earlyBirdPlan = config.pricingPlans.find((plan) => plan.id === 'early-bird')

  function handleReserveClick(): void {
    trackGaEvent('signup_cta_click', { location: 'hero' })
    trackMetaPixelEvent('InitiateCheckout', { content_name: 'hero_reserve_seat' })
  }

  function handleWhatsAppClick(): void {
    trackGaEvent('whatsapp_click', { location: 'hero' })
  }

  return (
    <section id="top" className="relative overflow-hidden bg-void text-ink">
      <EegWaveform className="pointer-events-none absolute inset-x-0 top-1/2 h-64 w-full -translate-y-1/2 text-teal/25 sm:h-80" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/40 via-void/70 to-void" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="font-mono text-[12.5px] uppercase tracking-[0.14em] text-teal-light">Executive Brain Performance Workshop</p>
            <h1 className="mt-4 font-display text-[32px] leading-tight font-bold tracking-tight sm:text-[44px]">
              Stay Calm Under Pressure. <span className="text-teal-light">Focus Deeper.</span> Decide Clearer.
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-dim sm:text-[17.5px]">
              A one-day, science-based live workshop in Mumbai — see your brain state change live on EEG, measure your own before-and-after, then 21
              days of guided daily practice on WhatsApp.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <span className="rounded-full border border-line-strong bg-panel px-3.5 py-1.5 text-[13px] text-ink-dim">📅 {config.eventDateDisplay}</span>
              <span className="rounded-full border border-line-strong bg-panel px-3.5 py-1.5 text-[13px] text-ink-dim">📍 Andheri East, Mumbai</span>
              <span className="rounded-full border border-line-strong bg-panel px-3.5 py-1.5 text-[13px] text-ink-dim">⏱ 1 day + 21-day follow-up</span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#pricing"
                onClick={handleReserveClick}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-3.5 text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
              >
                Reserve My Seat{earlyBirdPlan ? ` — ₹${earlyBirdPlan.price.toLocaleString('en-IN')}` : ''}
              </a>
              <a
                href="#corporate"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-line-strong px-7 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-panel"
              >
                Corporate Team Enquiry
              </a>
            </div>

            <p className="mt-6 text-[13px] text-ink-faint">
              Live EEG brain-state demo · Personal before/after measurement · 21-day WhatsApp practice
            </p>

            <div className="mt-4 hidden sm:block">
              <a
                href={buildWhatsAppLink(
                  config.whatsappNumber,
                  'Hi, I want details of the Executive Brain Performance Workshop in Mumbai',
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="text-[13.5px] font-medium text-teal-light underline decoration-teal-light/40 underline-offset-4 hover:text-teal"
              >
                Or ask us on WhatsApp →
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line-strong bg-panel shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <Image
                src="/founder-warm.jpg"
                alt="Dr. Kapil Dev Sharma"
                fill
                priority
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 380px, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl border border-line-strong bg-panel-2/95 px-5 py-4 text-center shadow-lg backdrop-blur-sm">
              <p className="text-[14.5px] font-semibold text-ink">Dr. Kapil Dev Sharma</p>
              <p className="mt-0.5 text-[12px] text-ink-faint">Mind Trainer &amp; Life Coach · 20+ years</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
