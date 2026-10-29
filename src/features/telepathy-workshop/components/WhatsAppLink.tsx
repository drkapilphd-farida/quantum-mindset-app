'use client'

import type { ReactNode } from 'react'
import { programs } from '@/config/site.config'
import { telepathyWhatsAppHref, type TelepathyWhatsAppTopic } from '@/config/telepathyWorkshopConfig'
import { trackMetaPixelEvent } from '@/lib/analytics/metaPixel'

/** Fires the Meta "Lead" event on this page's WhatsApp buttons (content_name = registry name). */
export function trackTelepathyLead(topic: TelepathyWhatsAppTopic, location: string): void {
  trackMetaPixelEvent('Lead', { content_name: programs.telepathyWorkshop.name, method: 'whatsapp', topic, location })
}

type WhatsAppLinkProps = {
  topic: TelepathyWhatsAppTopic
  /** Where on the page the button is (sent with the Lead event). */
  location: string
  className?: string
  ariaLabel?: string
  children: ReactNode
}

// Every WhatsApp button on /telepathy-workshop. The site-wide
// ConversionTracker additionally counts the tap as "Contact" and adds the
// visitor's utm_* tags to the end of the pre-filled message.
export function WhatsAppLink({ topic, location, className = '', ariaLabel, children }: WhatsAppLinkProps): React.JSX.Element {
  return (
    <a
      href={telepathyWhatsAppHref(topic)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={() => trackTelepathyLead(topic, location)}
      className={className}
    >
      {children}
    </a>
  )
}

export function WhatsAppGlyph({ className = 'size-5' }: { className?: string }): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z" />
    </svg>
  )
}
