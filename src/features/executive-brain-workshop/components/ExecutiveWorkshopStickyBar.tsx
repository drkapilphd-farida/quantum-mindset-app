'use client'

import { MessageCircle } from 'lucide-react'
import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'
import { buildWhatsAppLink } from '../utmTracking'
import { trackGaEvent } from '@/lib/analytics/ga4'
import { trackMetaPixelEvent } from '@/lib/analytics/metaPixel'

// Mobile-only sticky bottom bar — Reserve Seat + a WhatsApp icon button,
// always visible (unlike the desktop nav's CTA, which scrolls out of
// view with the rest of the sticky header on small screens where the
// header itself isn't sticky-pinned the same way).
export function ExecutiveWorkshopStickyBar(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-slate-800 bg-void/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
      <a
        href="#pricing"
        onClick={() => {
          trackGaEvent('signup_cta_click', { location: 'mobile_sticky_bar' })
          trackMetaPixelEvent('InitiateCheckout', { content_name: 'mobile_sticky_reserve_seat' })
        }}
        className="flex-1 rounded-sm bg-gold px-4 py-3 text-center text-[14px] font-semibold text-[#1B1508]"
      >
        Reserve Seat
      </a>
      <a
        href={buildWhatsAppLink(config.whatsappNumber, 'Hi, I want details of the Executive Brain Performance Workshop in Mumbai')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={() => trackGaEvent('whatsapp_click', { location: 'mobile_sticky_bar' })}
        className="flex size-11 flex-none items-center justify-center rounded-full bg-[#25D366] text-white"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
      </a>
    </div>
  )
}
