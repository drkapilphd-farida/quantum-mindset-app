import { SITE_CONFIG_WHATSAPP_NUMBER, TELEPATHY_SEAT_PAYMENT_LINK, TELEPATHY_WORKSHOP_FEE } from './site.config'

// The Telepathy Workshop™ — every editable VALUE on /telepathy-workshop
// lives here: WhatsApp number and messages, batches (dates, venues — each
// hides itself after its last day), YouTube video IDs, image paths and
// gallery captions. The fee and the ₹1,000 Razorpay link live in
// site.config.ts (TELEPATHY_WORKSHOP_FEE, TELEPATHY_SEAT_PAYMENT_LINK).
// All page WORDING (English + Hindi side by side) lives in
// src/features/telepathy-workshop/telepathyWorkshopCopy.ts.
//
// Booking: "Book your seat — ₹1,000" opens the Razorpay link; after paying,
// Razorpay sends the visitor to /telepathy-workshop/booked, where they send
// their booking on WhatsApp. "Pay full ₹5,999 now" and "Questions?" are
// WhatsApp messages.
//
// Tracking: the site-wide Meta Pixel (root layout) counts the page view,
// every Razorpay tap as "InitiateCheckout" and every WhatsApp tap as
// "Contact"; this page adds GA4 "telepathy_book_seat_click" (₹1,000 taps),
// a Meta "Lead" + GA4 "telepathy_whatsapp_click" per WhatsApp tap (with
// the batch, the kind — question / pay_full / booked — and utm_source),
// GA4 "telepathy_booked_visit" on the thank-you page, and GA4
// "telepathy_video_play" for the free session and review videos.

// ── Booking (Razorpay) ──────────────────────────────────────────────
export const TELEPATHY_BOOKING_URL = TELEPATHY_SEAT_PAYMENT_LINK
/** The thank-you page Razorpay redirects to after the ₹1,000 payment. */
export const TELEPATHY_BOOKED_PATH = '/telepathy-workshop/booked'

// ── Fee (from site.config.ts) ───────────────────────────────────────
const inr = (n: number): string => `₹${n.toLocaleString('en-IN')}`
// Filled into every "{price}" / "{earlier}" / "{deposit}" / "{balance}" in the copy file.
export const TELEPATHY_PRICE = {
  earlier: inr(TELEPATHY_WORKSHOP_FEE.earlierInr), // shown struck through
  offer: inr(TELEPATHY_WORKSHOP_FEE.currentInr),
  offerInr: TELEPATHY_WORKSHOP_FEE.currentInr,
  deposit: inr(TELEPATHY_WORKSHOP_FEE.depositInr),
  depositInr: TELEPATHY_WORKSHOP_FEE.depositInr,
  balance: inr(TELEPATHY_WORKSHOP_FEE.currentInr - TELEPATHY_WORKSHOP_FEE.depositInr),
} as const

// ── WhatsApp ────────────────────────────────────────────────────────
// Number in international format, no "+" or spaces. Same number as the rest of the site.
export const TELEPATHY_WHATSAPP_NUMBER = SITE_CONFIG_WHATSAPP_NUMBER // '919540123161'
// Shown on the final button.
export const TELEPATHY_WHATSAPP_DISPLAY = '+91 95401 23161'

export type TelepathyBatchId = 'mumbai' | 'ahmedabad' | 'vadodara' | 'pune'

// How each batch is named inside the (English) WhatsApp messages.
export const TELEPATHY_BATCH_MESSAGE_LABELS: Record<TelepathyBatchId, string> = {
  mumbai: 'Mumbai, 14–15 Nov 2026',
  ahmedabad: 'Ahmedabad, 21–22 Nov 2026',
  vadodara: 'Vadodara (please share the date and venue)',
  pune: 'Pune (please share the date and venue)',
}

/** WhatsApp messages before booking: a question, or paying the full fee. */
export type TelepathyMessageKind = 'question' | 'pay_full'

// Pre-filled messages — English in both languages. The pre-booking ones
// start with "TELEPATHY - " (the WhatsApp auto-reply keyword); the
// "I've paid" message from the thank-you page does not, so a learner who
// has already paid doesn't get the sales auto-reply.
export function telepathyWhatsAppMessage(kind: TelepathyMessageKind, batch: TelepathyBatchId | null): string {
  const about = batch === null ? '' : ` — ${TELEPATHY_BATCH_MESSAGE_LABELS[batch]}`
  return kind === 'pay_full'
    ? `TELEPATHY - Hi Dr. Kapil, I want to pay the full ${TELEPATHY_PRICE.offer} for the Telepathy Workshop${about}.`
    : `TELEPATHY - Hi Dr. Kapil, I have a question about the Telepathy Workshop${about}.`
}

/**
 * The thank-you page's "Send my booking on WhatsApp" message. The Razorpay
 * payment id (from the redirect) is added when known, so the team can match the payment.
 */
export function telepathyBookedMessage(name: string, batch: TelepathyBatchId | null, paymentId: string | null = null): string {
  const cityBatch = batch === null ? '__' : TELEPATHY_BATCH_MESSAGE_LABELS[batch].replace(/ \(please share the date and venue\)$/, '')
  const lines = [
    `Hi Dr. Kapil, I've paid ${TELEPATHY_PRICE.deposit} to book my seat for the Telepathy Workshop.`,
    `Name: ${name.trim() === '' ? '__' : name.trim()}`,
    `City/batch: ${cityBatch}`,
    ...(paymentId === null ? [] : [`Payment ID: ${paymentId}`]),
  ]
  return lines.join('\n')
}

export function telepathyWhatsAppHref(message: string): string {
  return `https://wa.me/${TELEPATHY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// ── Batches ─────────────────────────────────────────────────────────
// The visible city/date/venue text is in the copy file (cities[].id must
// match). A dated batch disappears from the page after `endISO` (its last
// day, 6 pm IST) and the countdown moves to the next one. Times are IST.
export type TelepathyBatch = {
  id: TelepathyBatchId
  /** First day 9:30 am — null while the date is shared on WhatsApp. */
  startISO: string | null
  /** Last day 6 pm — after this the batch is hidden. null = always shown. */
  endISO: string | null
  days: number
  dailyStart: string // HH:MM
  dailyEnd: string // HH:MM
  /** English venue, used as the Google Calendar location ('' = no calendar link). */
  calendarLocation: string
}

export const TELEPATHY_BATCHES: readonly TelepathyBatch[] = [
  {
    id: 'mumbai',
    startISO: '2026-11-14T09:30:00+05:30',
    endISO: '2026-11-15T18:00:00+05:30',
    days: 2,
    dailyStart: '09:30',
    dailyEnd: '18:00',
    calendarLocation: 'Hotel Better Home International, Sahar Road, Opp. Andheri East Railway Station, Andheri East, Mumbai',
  },
  {
    id: 'ahmedabad',
    startISO: '2026-11-21T09:30:00+05:30',
    endISO: '2026-11-22T18:00:00+05:30',
    days: 2,
    dailyStart: '09:30',
    dailyEnd: '18:00',
    calendarLocation: 'Hotel Silver Cloud, Ashram Road, Ahmedabad',
  },
  { id: 'vadodara', startISO: null, endISO: null, days: 2, dailyStart: '09:30', dailyEnd: '18:00', calendarLocation: '' },
  { id: 'pune', startISO: null, endISO: null, days: 2, dailyStart: '09:30', dailyEnd: '18:00', calendarLocation: '' },
]

// ── Videos ──────────────────────────────────────────────────────────
// 11-character YouTube IDs (after "watch?v=", "youtu.be/" or "/shorts/").
// Players load only when tapped (thumbnail + play button until then).

/** "Watch a free session before you book" (near the top). */
export const FREE_SESSION_VIDEO = '8h9lCf--Ic0'

/** Long reviews (16:9): the first two are shown large, the rest below them. */
export const LONG_REVIEW_VIDEOS: readonly string[] = ['iEpjmpMe4qw', '_1A-vR9f9oo', 'WZMSSuRTr78', 'NubHGGlQdo8', 'pRG3sdsXiHM']

/** Short reviews (9:16). The first SHORTS_IN_MIDDLE_STRIP appear mid-page (after "What you'll learn"); the rest in the full review section. */
export const SHORT_REVIEW_VIDEOS: readonly string[] = [
  'AQP2r2GNuME', 'iNz45u5sUl8', '4Qiz0rkpTwc', 'lSa9AvoySro', '9qqFc77b_OU', 'Go9QZBTDeO8',
  '6rJVyaUuAlI', '4Pde6v_k99E', 'G8cRLDDz-6g', 'nLUqnN1h08M', 'yQzvY-YDaM0', '0dCrpH8VML4',
  'uNWLFqACpDU', '8fFMNvaH__Q', 'eFskqwYdrw4',
]
export const SHORTS_IN_MIDDLE_STRIP = 6

// "Watch 300+ more reviews on YouTube →"
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@innershiftWithDrKapil'

// ── Images ──────────────────────────────────────────────────────────
// All photos live in public/images/telepathy-workshop/. To swap a photo,
// replace the file under the SAME name. `position` is the CSS
// object-position: which part of the photo stays in view when it is
// cropped to fit (x% y%; "50% 50%" = centre).
const IMG = '/images/telepathy-workshop'

export type TelepathyPhoto = { src: string; width: number; height: number; position: string }

// Hero crossfade, in order. The first one loads first and is the og:image.
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
  trader: `${IMG}/trader.jpg`,
  muse: `${IMG}/muse2-demo.jpg`,
  portrait: `${IMG}/dr-kapil-portrait.jpg`,
  ctaPortrait: `${IMG}/dr-kapil-cta.jpg`,
  finalCta: `${IMG}/final-cta.jpg`,
} as const

// Final call to action: Dr. Kapil's photo is shown whole (never cropped) at
// this size. Set FINAL_CTA_BACKGROUND to false to drop the soft
// final-cta.jpg background behind the section.
export const CTA_PORTRAIT_SIZE = { width: 1374, height: 1145 } as const
export const FINAL_CTA_BACKGROUND = true

// About photo: keeps Dr. Kapil's face in view in the 4:5 frame.
export const PORTRAIT_POSITION = '6% 50%'

// Gallery: real workshop photos, in order. City and year come from each
// photo's own location/date data (blank where it had none) — edit freely.
export type GalleryPhoto = TelepathyPhoto & { city: 'mumbai' | 'ahmedabad' | 'vadodara' | 'lonavala' | 'pune' | 'rishikesh' | null; year: number | null }
const g = (n: number, width: number, height: number, city: GalleryPhoto['city'], year: number | null): GalleryPhoto => ({
  src: `${IMG}/gallery-${String(n).padStart(2, '0')}.jpg`,
  width,
  height,
  position: '50% 50%',
  city,
  year,
})
export const GALLERY_IMAGES: readonly GalleryPhoto[] = [
  g(1, 4032, 3024, null, 2023), g(2, 2400, 1800, null, 2023), g(3, 1280, 960, null, null), g(4, 4096, 3072, 'vadodara', 2023),
  g(5, 4096, 3072, 'lonavala', 2023), g(6, 4096, 3072, 'mumbai', 2023), g(7, 4096, 3072, 'rishikesh', 2023), g(8, 1440, 656, 'rishikesh', 2022),
  g(9, 1440, 656, 'rishikesh', 2022), g(10, 1440, 656, 'rishikesh', 2022), g(11, 4000, 1824, 'rishikesh', 2022), g(12, 4000, 1824, 'ahmedabad', 2022),
  g(13, 4000, 1824, 'ahmedabad', 2022), g(14, 4000, 1824, 'mumbai', 2022), g(15, 1824, 4000, 'mumbai', 2022), g(16, 4032, 3024, 'rishikesh', 2024),
  g(17, 4032, 3024, 'rishikesh', 2024), g(18, 5712, 4284, 'pune', 2024), g(19, 4032, 3024, 'rishikesh', 2025), g(20, 4032, 3024, 'rishikesh', 2025),
]

// og:image (WhatsApp/Facebook link preview) = the first hero photo.
export const TELEPATHY_OG_IMAGE = { url: HERO_IMAGES[0]?.src ?? `${IMG}/hero-1.jpg`, width: HERO_IMAGES[0]?.width ?? 6528, height: HERO_IMAGES[0]?.height ?? 4896 } as const
