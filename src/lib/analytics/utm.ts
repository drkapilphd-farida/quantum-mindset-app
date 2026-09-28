// UTM capture for every marketing page. The first utm_* params a visitor
// arrives with are kept in sessionStorage, so they survive moving from a
// landing page to a program page before clicking WhatsApp or submitting a
// form. The current URL wins when it has its own utm_* params.

const UTM_PARAM_NAMES = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
const STORAGE_KEY = 'mum_utm'

export type UtmParams = Partial<Record<(typeof UTM_PARAM_NAMES)[number], string>>

function fromUrl(): UtmParams {
  const searchParams = new URLSearchParams(window.location.search)
  const result: UtmParams = {}
  for (const name of UTM_PARAM_NAMES) {
    const value = searchParams.get(name)
    if (value !== null && value !== '') result[name] = value
  }
  return result
}

function fromStorage(): UtmParams {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (raw === null) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    const result: UtmParams = {}
    for (const name of UTM_PARAM_NAMES) {
      const value = (parsed as Record<string, unknown>)[name]
      if (typeof value === 'string' && value !== '') result[name] = value
    }
    return result
  } catch {
    return {}
  }
}

/** Saves the current URL's utm_* params for this browser session (no-op without any). */
export function captureUtmParams(): void {
  if (typeof window === 'undefined') return
  const current = fromUrl()
  if (Object.keys(current).length === 0) return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // Storage blocked (private mode etc.) — the URL itself is still read at click time.
  }
}

export function readUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {}
  const current = fromUrl()
  return Object.keys(current).length > 0 ? current : fromStorage()
}

const UTM_MARKER = 'utm_source='

// WhatsApp only shows the pre-filled text, so UTM params go into the
// message itself. No-op for visitors without UTM params, and never added
// twice.
export function appendUtmParamsToMessage(message: string): string {
  if (message.includes(UTM_MARKER)) return message
  const entries = Object.entries(readUtmParams()).filter((entry): entry is [string, string] => entry[1] !== undefined)
  if (entries.length === 0) return message
  return `${message}\n\n(${entries.map(([key, value]) => `${key}=${value}`).join(', ')})`
}

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(appendUtmParamsToMessage(message))}`
}

/** Adds UTM params to the text of an existing wa.me / api.whatsapp.com link. */
export function withUtmInWhatsAppHref(href: string): string {
  try {
    const url = new URL(href)
    const text = url.searchParams.get('text') ?? ''
    const next = appendUtmParamsToMessage(text)
    if (next === text) return href
    url.searchParams.set('text', next)
    return url.toString()
  } catch {
    return href
  }
}
