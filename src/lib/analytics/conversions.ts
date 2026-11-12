import { programForCheckoutHref, programForPath } from '@/config/site.config'
import { trackGaEvent } from './ga4'
import { trackMetaPixelEvent } from './metaPixel'

// The three conversion events used across the site, each sent to both
// Meta Pixel (standard event) and GA4. content_name is always a public
// program name from site.config.ts, never an internal id. Both senders
// are no-ops until their IDs are configured.

/** valueInr: the page's price, when it has one (e.g. the Calm Mind batch, ₹2,999). */
export function trackViewContent(contentName: string, valueInr?: number): void {
  const value = valueInr !== undefined ? { currency: 'INR', value: valueInr } : {}
  trackMetaPixelEvent('ViewContent', { content_name: contentName, ...value })
  trackGaEvent('view_item', { content_name: contentName, ...value })
}

/** valueInr: the price shown on the button that was clicked (omitted when the page doesn't know it). */
export function trackInitiateCheckout(contentName: string, valueInr?: number): void {
  trackMetaPixelEvent('InitiateCheckout', { content_name: contentName, currency: 'INR', ...(valueInr !== undefined ? { value: valueInr } : {}) })
  trackGaEvent('begin_checkout', { content_name: contentName, ...(valueInr !== undefined ? { currency: 'INR', value: valueInr } : {}) })
}

/** Form submits and finished free tests. */
export function trackLead(contentName: string, method: string): void {
  trackMetaPixelEvent('Lead', { content_name: contentName, method })
  trackGaEvent('generate_lead', { content_name: contentName, method })
}

/** A tap on any WhatsApp link or button: Meta "Contact", GA4 "contact" (conversion brief: same events in both). */
export function trackWhatsAppContact(contentName: string): void {
  trackMetaPixelEvent('Contact', { content_name: contentName })
  trackGaEvent('contact', { content_name: contentName, method: 'whatsapp' })
}

/** "Choose this plan" (conversion brief): InitiateCheckout with the plan and its fee. */
export function trackChoosePlan(planName: string, feeInr: number): void {
  trackMetaPixelEvent('InitiateCheckout', { content_name: planName, currency: 'INR', value: feeInr })
  trackGaEvent('begin_checkout', { content_name: planName, currency: 'INR', value: feeInr })
}

const CHECKOUT_HOSTS = ['rzp.io', 'razorpay.me', 'pages.razorpay.com', 'courses.store', 'classplusapp.com']
const WHATSAPP_HOSTS = ['wa.me', 'api.whatsapp.com', 'web.whatsapp.com']

export type LinkKind = 'checkout' | 'whatsapp' | null

export function classifyHref(href: string): LinkKind {
  let host: string
  try {
    host = new URL(href).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
  if (CHECKOUT_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return 'checkout'
  if (WHATSAPP_HOSTS.includes(host)) return 'whatsapp'
  return null
}

/** The program a click belongs to: the page's own program first, then the link's. */
export function contentNameFor(pathname: string, href: string, fallback: string): string {
  return programForPath(pathname)?.name ?? programForCheckoutHref(href)?.name ?? fallback
}
