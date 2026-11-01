'use client'

import type { ReactNode } from 'react'
import { programs } from '@/config/site.config'
import { TELEPATHY_BOOKING_URL, TELEPATHY_PRICE, telepathyWhatsAppHref, type TelepathyBatchId } from '@/config/telepathyWorkshopConfig'
import { trackMetaPixelEvent } from '@/lib/analytics/metaPixel'
import { trackGaEvent } from '@/lib/analytics/ga4'
import { readUtmParams } from '@/lib/analytics/utm'

/** Which batch a button is for ('general' = no batch: header, hero, final CTA…). */
export type TelepathyBatchTag = TelepathyBatchId | 'general'
/** What a WhatsApp button is for. */
export type TelepathyWhatsAppKind = 'question' | 'pay_full' | 'booked'

const utmSource = (): string => readUtmParams().utm_source ?? '(none)'

/**
 * A WhatsApp tap on these pages: GA4 "telepathy_whatsapp_click" with the
 * batch, the kind, where on the page it was and the visitor's utm_source;
 * before booking (question / pay full) also a Meta "Lead".
 */
export function trackTelepathyWhatsApp(batch: TelepathyBatchTag, kind: TelepathyWhatsAppKind, location: string): void {
  const source = utmSource()
  if (kind !== 'booked') {
    trackMetaPixelEvent('Lead', { content_name: programs.telepathyWorkshop.name, method: 'whatsapp', kind, batch, location, utm_source: source, currency: 'INR', value: TELEPATHY_PRICE.offerInr })
  }
  trackGaEvent('telepathy_whatsapp_click', { batch, kind, location, utm_source: source })
}

/** A tap on "Book your seat — ₹1,000" (the site-wide tracker adds Meta "InitiateCheckout"). */
export function trackTelepathyBookSeat(batch: TelepathyBatchTag, location: string): void {
  trackGaEvent('telepathy_book_seat_click', { batch, location, utm_source: utmSource(), value: String(TELEPATHY_PRICE.depositInr), currency: 'INR' })
}

type LinkProps = {
  batch: TelepathyBatchTag
  /** Where on the page the button is (sent with the events). */
  location: string
  className?: string
  ariaLabel?: string
  children: ReactNode
}

// Every WhatsApp button on /telepathy-workshop. The site-wide
// ConversionTracker also counts the tap as "Contact" (and leaves this page's
// messages exactly as written).
export function WhatsAppLink({ message, kind, batch, location, className = '', ariaLabel, children }: LinkProps & { message: string; kind: TelepathyWhatsAppKind }): React.JSX.Element {
  return (
    <a href={telepathyWhatsAppHref(message)} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} onClick={() => trackTelepathyWhatsApp(batch, kind, location)} className={className}>
      {children}
    </a>
  )
}

// "Book your seat — ₹1,000": the Razorpay payment link, in the same tab so
// Razorpay can bring the visitor back to the thank-you page.
export function BookSeatLink({ batch, location, className = '', ariaLabel, children }: LinkProps): React.JSX.Element {
  return (
    <a href={TELEPATHY_BOOKING_URL} aria-label={ariaLabel} onClick={() => trackTelepathyBookSeat(batch, location)} className={className}>
      {children}
    </a>
  )
}

/** The site's primary gold button. */
export const GOLD_BUTTON =
  'inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm bg-gold px-6 py-3.5 text-center text-[16px] font-semibold leading-snug text-[#1B1508] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#cb9a44]'

export function WhatsAppGlyph({ className = 'size-5' }: { className?: string }): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z" />
    </svg>
  )
}
