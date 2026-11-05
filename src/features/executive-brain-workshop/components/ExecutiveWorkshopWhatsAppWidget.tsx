'use client'

import WhatsAppWidget from '@/components/WhatsAppWidget'
import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'
import { buildWhatsAppLink } from '../utmTracking'

// Same floating widget every other landing page on this site uses.
// bottomClassName lifts it clear of ExecutiveWorkshopStickyBar's own
// mobile-only bottom bar (same "bottom-24 sm:bottom-7" clearance pattern
// already used on the homepage for its own sticky elements).
export function ExecutiveWorkshopWhatsAppWidget(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig

  return (
    <WhatsAppWidget
      href={buildWhatsAppLink(config.whatsappNumber, 'Hi, I want details of the Executive Brain Performance Workshop in Mumbai')}
      bubble="Dr. Kapil replies himself, within 24 hours."
      buttonLabel="Chat on WhatsApp"
      ariaLabel="Ask Dr. Kapil on WhatsApp"
      bottomClassName="bottom-24 sm:bottom-7"
      analyticsLocation="executive_workshop_widget"
      autoDismissBubbleMs={6000}
      revealAfterElementId="top"
    />
  )
}
