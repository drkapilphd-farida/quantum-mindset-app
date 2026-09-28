import { programForCheckoutHref, programForPath } from '@/config/site.config'
import { trackGaEvent } from './ga4'
import { trackMetaPixelEvent } from './metaPixel'

// The three conversion events used across the site, each sent to both
// Meta Pixel (standard event) and GA4. content_name is always a public
// program name from site.config.ts, never an internal id. Both senders
// are no-ops until their IDs are configured.

export function trackViewContent(contentName: string): void {
  trackMetaPixelEvent('ViewContent', { content_name: contentName })
  trackGaEvent('view_item', { content_name: contentName })
}

export function trackInitiateCheckout(contentName: string): void {
  trackMetaPixelEvent('InitiateCheckout', { content_name: contentName, currency: 'INR' })
  trackGaEvent('begin_checkout', { content_name: contentName })
}

/** WhatsApp clicks, form submits and free tests started. */
export function trackLead(contentName: string, method: string): void {
  trackMetaPixelEvent('Lead', { content_name: contentName, method })
  trackGaEvent('generate_lead', { content_name: contentName, method })
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
