// Google Analytics 4 — marketing/conversion tracking for the public
// landing pages (QSR, Retreat, homepage). Deliberately separate from
// track.ts's `trackEvent` (Sprint 1's internal product-analytics log,
// typed to in-app learning events and backed by the app logger, not
// GA4) — different destination, different event vocabulary, no shared
// call sites.
export const GA_MEASUREMENT_ID = process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID']

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

// Marketing conversion events this session wires up: WhatsApp inquiry
// clicks and Razorpay checkout button clicks, across both landing
// pages, plus a video-engagement event for the Residential Retreats
// page's "watch more" playlist link (not itself a conversion, but a
// meaningful engagement signal distinct from a WhatsApp/checkout click),
// and a Classplus checkout-click event for the Overthinking Mastery
// Course page (external checkout, same conversion intent as
// razorpay_checkout_click but a different provider — kept distinct so
// GA4 reports can tell the two apart). Extend this union, not ad-hoc
// string literals, so every call site stays typo-proof and greppable.
export type GaEventName =
  | 'whatsapp_click'
  | 'razorpay_checkout_click'
  | 'video_testimonial_click'
  | 'classplus_click'
  | 'signup_cta_click'
  | 'watch_training_click'

// No-ops when GA isn't configured (NEXT_PUBLIC_GA_MEASUREMENT_ID unset)
// or gtag.js hasn't loaded yet — never throws, since a tracking call
// must never be able to break a conversion-critical CTA click.
//
// Incident fix (see the "Fix CSP eval() Error Breaking Overthinking
// Test Report Reveal" task): that "never throws" promise wasn't
// actually kept — window.gtag(...) itself was called unguarded, so if
// gtag.js's own internals throw (confirmed in production: the site's
// CSP blocks 'unsafe-eval' outside dev — see next.config.ts's own
// comment on why — and Google's gtag.js/GA4 library is known to use
// eval-like patterns internally for some configurations, e.g. certain
// Enhanced Conversions/Consent Mode/Ads-linking features), that
// exception propagated straight out of trackGaEvent into whatever
// synchronous call site invoked it. On the Overthinking Test's lead
// form, that call site sits immediately after the successful save (see
// OverthinkingTestExperience.tsx's onSubmitLead) — an uncaught throw
// there could abort the rest of that function before the full report
// ever rendered, even though the save itself had already succeeded.
// This wraps the one call that can actually throw, not the guard above
// it, so a legitimate GA outage never blocks a real conversion anywhere
// this function is called (QSR, retreats, franchise, the Overthinking
// Test, etc.) — fixing it here, in the shared utility, covers every
// call site at once rather than defensively wrapping each one.
export function trackGaEvent(event: GaEventName, params?: Record<string, string>): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  try {
    window.gtag('event', event, params)
  } catch {
    // Deliberately silent — a broken/blocked analytics call is never
    // worth surfacing to the user or breaking the flow it's attached to.
  }
}
