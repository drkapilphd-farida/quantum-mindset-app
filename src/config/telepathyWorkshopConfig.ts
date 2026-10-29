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
  { id: 'WZMSSuRTr78', captionEn: '', captionHi: '' },
  { id: 'uNWLFqACpDU', captionEn: '', captionHi: '' },
  { id: 'NubHGGlQdo8', captionEn: '', captionHi: '' },
  { id: 'pRG3sdsXiHM', captionEn: '', captionHi: '' },
  { id: '8fFMNvaH__Q', captionEn: '', captionHi: '' },
  { id: 'eFskqwYdrw4', captionEn: '', captionHi: '' },
]

// "Watch All Reviews on YouTube" button (hidden unless this is an https:// link).
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@innershiftWithDrKapil/videos'

// ── Images ──────────────────────────────────────────────────────────
// All photos live in public/images/telepathy-workshop/. To swap a photo,
// replace the file under the SAME name. `position` is the CSS
// object-position: which part of the photo stays in view when it is
// cropped to fit (x% y%; "50% 50%" = centre).
const IMG = '/images/telepathy-workshop'

export type TelepathyPhoto = { src: string; width: number; height: number; position: string }

// Hero crossfade, in order. The first one loads first and is the og:image.
// Add or remove entries to change how many photos rotate.
export const HERO_IMAGES: readonly TelepathyPhoto[] = [
  { src: `${IMG}/hero-1.jpg`, width: 6528, height: 4896, position: '29% 60%' },
  { src: `${IMG}/hero-2.jpg`, width: 1440, height: 1080, position: '50% 50%' },
  { src: `${IMG}/hero-3.jpg`, width: 4096, height: 3072, position: '50% 50%' },
  { src: `${IMG}/hero-4.jpg`, width: 4000, height: 1824, position: '50% 50%' },
  { src: `${IMG}/hero-5.jpg`, width: 4000, height: 1824, position: '50% 50%' },
]
// Seconds each hero photo stays, and the fade between them.
export const HERO_SLIDE_SECONDS = 6
export const HERO_FADE_SECONDS = 1.5

export const TELEPATHY_IMAGES = {
  problem: `${IMG}/problem.jpg`,
  guruWithin: `${IMG}/guru-within.jpg`,
  relationships: `${IMG}/relationships.jpg`,
  trader: `${IMG}/trader.jpg`,
  muse: `${IMG}/muse2-demo.jpg`,
  portrait: `${IMG}/dr-kapil-portrait.jpg`,
  finalCta: `${IMG}/final-cta.jpg`,
} as const

// About photo: keeps Dr. Kapil's face in view in the 4:5 frame.
export const PORTRAIT_POSITION = '6% 50%'

// Gallery strip + lightbox, in order (up to 20). width/height = the file's size.
const g = (n: number, width: number, height: number): TelepathyPhoto => ({ src: `${IMG}/gallery-${String(n).padStart(2, '0')}.jpg`, width, height, position: '50% 50%' })
export const GALLERY_IMAGES: readonly TelepathyPhoto[] = [
  g(1, 4032, 3024), g(2, 2400, 1800), g(3, 1280, 960), g(4, 4096, 3072), g(5, 4096, 3072),
  g(6, 4096, 3072), g(7, 4096, 3072), g(8, 1440, 656), g(9, 1440, 656), g(10, 1440, 656),
  g(11, 4000, 1824), g(12, 4000, 1824), g(13, 4000, 1824), g(14, 4000, 1824), g(15, 1824, 4000),
  g(16, 4032, 3024), g(17, 4032, 3024), g(18, 5712, 4284), g(19, 4032, 3024), g(20, 4032, 3024),
]

// og:image (WhatsApp/Facebook link preview) = the first hero photo.
export const TELEPATHY_OG_IMAGE = { url: HERO_IMAGES[0]?.src ?? `${IMG}/hero-1.jpg`, width: HERO_IMAGES[0]?.width ?? 6528, height: HERO_IMAGES[0]?.height ?? 4896 } as const
