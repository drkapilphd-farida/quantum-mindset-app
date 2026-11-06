// Positioning rework (BRIEF.md, Phase 0) — every outbound link used by the
// reworked website pages lives here. WhatsApp links are always built with
// waLink(); never hand-encode a wa.me URL.
//
// A LINKS value still written as '[[...]]' is not known yet: a button that
// would use it must point to waLink(<that button's text>) instead.

export const WHATSAPP_NUMBER = '919540123161'
export const waLink = (text: string): string => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

export const DEMO_WA_TEXT = 'मुफ्त डेमो 12 नवंबर - सीट रोकिए'
export const VADODARA_MAPS_SEARCH = 'https://www.google.com/maps/search/?api=1&query=Hotel%20Surya%20Station%20Road%20Vadodara'
export const VADODARA_MAPS_EMBED = 'https://maps.google.com/maps?q=Hotel%20Surya%20Station%20Road%20Vadodara&output=embed'
export const YOUTUBE_CHANNEL = 'https://www.youtube.com/@innershiftWithDrKapil'

export const LINKS = {
  rzpTelepathyDeposit1000: 'https://rzp.io/rzp/elNaxRB', // ₹1,000 seat booking (confirmed by the owner, Phase 0)
  rzpOnline3999: 'https://rzp.io/rzp/NIZqolHs', // online, 3 evenings (owner, Phase 4.2)
  rzpSharpBrainSelfPaced2999: 'https://rzp.io/rzp/9RmomzjS', // Sharp Brain self-paced ₹2,999 (owner, Phase 4.2 → 6B)
  rzpRetreat11Discount: '[[RZP_RETREAT11_5999]]',
  waGroupOverthinking: '[[WA_GROUP_OVERTHINKING]]',
  googleBusinessProfile: '[[GBP_URL]]',
} as const

export type LinkKey = keyof typeof LINKS

/** True while a LINKS value is still a '[[...]]' placeholder. */
export function isPlaceholderLink(value: string): boolean {
  return value.startsWith('[[') && value.endsWith(']]')
}

/**
 * The href for a button that should open LINKS[key]. While that link is
 * still a placeholder, the button opens WhatsApp with its own text instead,
 * so no button ever points at a broken link.
 */
export function linkOrWhatsApp(key: LinkKey, buttonText: string): string {
  const value: string = LINKS[key]
  return isPlaceholderLink(value) ? waLink(buttonText) : value
}
