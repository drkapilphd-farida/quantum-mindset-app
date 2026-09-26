'use client'

import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'
import { buildWhatsAppLink } from '../utmTracking'
import { trackGaEvent } from '@/lib/analytics/ga4'
import { trackMetaPixelEvent } from '@/lib/analytics/metaPixel'

export function ExecutiveWorkshopFinalCta(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig

  return (
    <section className="border-b border-slate-800 bg-void px-6 py-20 text-center text-ink sm:px-8">
      <h2 className="text-[28px] font-bold tracking-tight sm:text-[36px]">One day to learn it. 21 days to own it.</h2>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="#pricing"
          onClick={() => {
            trackGaEvent('signup_cta_click', { location: 'final_cta' })
            trackMetaPixelEvent('InitiateCheckout', { content_name: 'final_cta_reserve_seat' })
          }}
          className="inline-flex items-center justify-center rounded-sm bg-gold px-7 py-3.5 text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
        >
          Reserve My Seat
        </a>
        <a
          href="#corporate"
          className="inline-flex items-center justify-center rounded-sm border border-line-strong px-7 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-panel"
        >
          Corporate Enquiry
        </a>
        <a
          href={buildWhatsAppLink(config.whatsappNumber, 'Hi, I want details of the Executive Brain Performance Workshop in Mumbai')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackGaEvent('whatsapp_click', { location: 'final_cta' })}
          className="inline-flex items-center justify-center rounded-sm border border-line-strong px-7 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-panel"
        >
          WhatsApp Us
        </a>
      </div>
    </section>
  )
}
