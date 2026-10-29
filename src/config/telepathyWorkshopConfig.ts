import { SITE_CONFIG_WHATSAPP_NUMBER } from './site.config'

// The Telepathy Workshop™ — every editable VALUE on /telepathy-workshop
// lives here: prices, WhatsApp number and messages, workshop dates for the
// countdown and calendar links, YouTube video IDs, image paths. All page
// WORDING (English + Hindi side by side) lives in
// src/features/telepathy-workshop/telepathyWorkshopCopy.ts.
//
// Meta Pixel: the pixel is already installed site-wide (root layout,
// components/analytics/MetaPixel.tsx, ID in site.config.ts →
// analytics.metaPixelId), so this page needs no pixel snippet of its own.
// Every WhatsApp button on this page fires a Meta "Lead" event (see
// WhatsAppLink.tsx); the site-wide ConversionTracker also counts the tap
// as "Contact", as it does on every page.

// ── WhatsApp ────────────────────────────────────────────────────────
// Number in international format, no "+" or spaces. Same number as the rest of the site.
export const TELEPATHY_WHATSAPP_NUMBER = SITE_CONFIG_WHATSAPP_NUMBER // '919540123161'
// Shown on the final button (copy reads "… WhatsApp: {phone}").
export const TELEPATHY_WHATSAPP_DISPLAY = '95401 23161'

// Pre-filled messages — always English in both languages (auto-reply keywords depend on them).
export const TELEPATHY_WHATSAPP_MESSAGES = {
  general: 'TELEPATHY - I want to know about the workshop',
  mumbai: 'TELEPATHY - Mumbai 14-15 Nov',
  ahmedabad: 'TELEPATHY - Ahmedabad 21-22 Nov',
  vadodara: 'TELEPATHY - Vadodara',
} as const

export type TelepathyWhatsAppTopic = keyof typeof TELEPATHY_WHATSAPP_MESSAGES

export function telepathyWhatsAppHref(topic: TelepathyWhatsAppTopic): string {
  return `https://wa.me/${TELEPATHY_WHATSAPP_NUMBER}?text=${encodeURIComponent(TELEPATHY_WHATSAPP_MESSAGES[topic])}`
}

// ── Price ───────────────────────────────────────────────────────────
// Filled into every "{price}" / "{mrp}" in the copy file.
export const TELEPATHY_PRICE = {
  mrp: '₹6,500', // shown struck through
  offer: '₹4,999',
} as const

// ── Dates (countdown + "Add to Google Calendar") ────────────────────
// The visible date and venue text is in the copy file; keep it in sync.
// Times are IST. The countdown shows the first workshop whose start is
// still in the future, and hides once all have started.
export type TelepathyWorkshopDate = {
  city: 'mumbai' | 'ahmedabad'
  startISO: string
  /** Last day, same daily hours. */
  days: number
  dailyStart: string // HH:MM, IST
  dailyEnd: string // HH:MM, IST
  /** English venue, used as the Google Calendar location. */
  calendarLocation: string
}

export const TELEPATHY_WORKSHOP_DATES: readonly TelepathyWorkshopDate[] = [
  {
    city: 'mumbai',
    startISO: '2026-11-14T09:30:00+05:30',
    days: 2,
    dailyStart: '09:30',
    dailyEnd: '18:00',
    calendarLocation: 'Hotel Better Home International, Sahar Road, Opp. Andheri East Railway Station, Andheri East, Mumbai',
  },
  {
    city: 'ahmedabad',
    startISO: '2026-11-21T09:30:00+05:30',
    days: 2,
    dailyStart: '09:30',
    dailyEnd: '18:00',
    calendarLocation: 'Hotel Silver Cloud, Ashram Road, Ahmedabad',
  },
]

// ── Video reviews ───────────────────────────────────────────────────
// Paste the 11-character YouTube ID of each review (the part after
// "watch?v=" or "youtu.be/"; for a Short, the part after "/shorts/").
// Captions are optional: leave "" to show none. An ID still starting with
// "VIDEO_ID" shows a placeholder card instead of a thumbnail.
export const REVIEW_VIDEOS: readonly { id: string; captionEn: string; captionHi: string }[] = [
  { id: 'VIDEO_ID_1', captionEn: '', captionHi: '' },
  { id: 'VIDEO_ID_2', captionEn: '', captionHi: '' },
  { id: 'VIDEO_ID_3', captionEn: '', captionHi: '' },
  { id: 'VIDEO_ID_4', captionEn: '', captionHi: '' },
  { id: 'VIDEO_ID_5', captionEn: '', captionHi: '' },
  { id: 'VIDEO_ID_6', captionEn: '', captionHi: '' },
]

// "Watch All Reviews on YouTube" button. While this still says
// YOUTUBE_CHANNEL_URL the button is hidden.
export const YOUTUBE_CHANNEL_URL = 'YOUTUBE_CHANNEL_URL'

// ── Images ──────────────────────────────────────────────────────────
// Replace the files in public/images/telepathy-workshop/ with your own
// photos under the SAME names (any size; they are cropped to fit).
const IMG = '/images/telepathy-workshop'
export const TELEPATHY_IMAGES = {
  hero: `${IMG}/hero-workshop.jpg`,
  problem: `${IMG}/problem.jpg`,
  guruWithin: `${IMG}/guru-within.jpg`,
  relationships: `${IMG}/relationships.jpg`,
  trader: `${IMG}/trader.jpg`,
  muse: `${IMG}/muse2-demo.jpg`,
  portrait: `${IMG}/dr-kapil-portrait.jpg`,
  finalCta: `${IMG}/final-cta.jpg`,
} as const

// og:image (WhatsApp/Facebook link preview). Size of the current file.
export const TELEPATHY_OG_IMAGE = { url: TELEPATHY_IMAGES.hero, width: 1920, height: 1080 } as const
