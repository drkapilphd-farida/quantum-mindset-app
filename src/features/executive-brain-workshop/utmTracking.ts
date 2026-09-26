const UTM_PARAM_NAMES = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export type UtmParams = Partial<Record<(typeof UTM_PARAM_NAMES)[number], string>>

// Reads utm_* params straight from the current URL — never persisted to
// sessionStorage/localStorage, since every real entry point on this page
// (WhatsApp links, the corporate form) reads them fresh at click/submit
// time, and a single-page campaign landing page has no multi-page
// journey where the URL's own params would otherwise be lost.
export function readUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {}
  const searchParams = new URLSearchParams(window.location.search)
  const result: UtmParams = {}
  for (const name of UTM_PARAM_NAMES) {
    const value = searchParams.get(name)
    if (value !== null && value !== '') result[name] = value
  }
  return result
}

// A wa.me link has no field WhatsApp itself surfaces to the recipient
// other than the pre-filled message text — so "pass UTM params into the
// WhatsApp message" means appending them to the message itself (visible
// to whoever reads the chat), not as inert query params on the wa.me
// URL, which WhatsApp ignores entirely. No-op (message unchanged) when
// the visitor arrived with no real UTM params, so every existing plain
// wa.me link on this page reads exactly as authored for organic traffic.
export function appendUtmParamsToMessage(message: string): string {
  const utmParams = readUtmParams()
  const entries = Object.entries(utmParams).filter((entry): entry is [string, string] => entry[1] !== undefined)
  if (entries.length === 0) return message

  const utmSuffix = entries.map(([key, value]) => `${key}=${value}`).join(', ')
  return `${message}\n\n(${utmSuffix})`
}

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(appendUtmParamsToMessage(message))}`
}
