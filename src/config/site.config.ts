import { RAZORPAY_MASTERCLASS_PAYMENT_LINK } from './masterclassPaymentLink'
import { RAZORPAY_QUANTUM_MINDSET_HABIT_BUILDER_PAYMENT_LINK } from './quantumMindsetHabitBuilderPaymentLink'
import { HABIT_BUILDER_SIGNUP_HREF } from './habitBuilderSignupLink'
import { CLASSPLUS_OVERTHINKING_COURSE_LINK } from './overthinkingCoursePaymentLink'
import { RAZORPAY_RETREAT_PAYMENT_LINK } from './retreatPaymentLink'
import { STARTER_MONTHLY_399, FAMILY_PRO_MONTHLY_699 } from './pricingLinks'

// Single source of truth for everything public-facing that used to be
// retyped by hand across pages: brand name and tagline, the trainer's
// name/bio/stats/photo, and every program's public name, price and
// checkout link (site-rebuild Phase 2). Components, i18n copy, metadata,
// OG images and WhatsApp pre-filled messages read from here, so a rename
// or a price change is one edit, not a codebase-wide search.
//
// Deliberately a leaf module: it only imports plain link constants, never
// whatsappSupportLink.ts or i18n.ts (both import *this* file).

// Widens literal types (from `as const`) back to string/number while
// keeping the object's shape, so values can be mixed into i18n copy whose
// en/hi variants must share one type.
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : T extends object
        ? { readonly [K in keyof T]: Widen<T[K]> }
        : T

// Headline numbers — edit here only; bios, stats and trust lines are built from them.
const YEARS_TOTAL = 26
const YEARS_PROFESSOR = 15
const QSR_SINCE = 2015
const FOUNDED = 2014
const LEARNERS = '10,000+'
const WORKSHOPS = '500+'

export const SITE_CONFIG_WHATSAPP_NUMBER = '919540123161'

/** wa.me click-to-chat link with a pre-filled message. */
export function waLink(message: string): string {
  return `https://wa.me/${SITE_CONFIG_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

const brandData = {
  name: 'Mind Ur Mind',
  positioning: 'Brain, Mind & Meditation Coach',
  tagline: 'Sharp Brain. Calm Mind. Better Life.',
  taglineHi: 'तेज़ दिमाग। शांत मन। बेहतर जीवन।',
  appName: 'Mind Ur Mind App',
  /** Razorpay/legal account name — the only place "Mind Ur Mind Academy" may still appear. */
  legalAccountName: 'Mind Ur Mind Academy',
  foundedYear: FOUNDED,
  city: 'Vadodara',
} as const

export const brand: Widen<typeof brandData> = brandData

type TrainerStat = { value: string; label: string }

type TrainerCopy = {
  title: string
  shortBio: string
  longBio: string
  stats: readonly TrainerStat[]
}

const trainerData = {
  /** Full name — use everywhere. "Dr. Kapil" only in casual copy ("Ask Dr. Kapil"). */
  name: 'Dr. Kapil Dev Sharma',
  nameHi: 'डॉ. कपिल देव शर्मा',
  casualName: 'Dr. Kapil',
  // TODO(content): doctorate field/subject and awarding university not yet
  // confirmed — do not invent. Leave null until Dr. Kapil Dev Sharma
  // supplies the exact wording. Renderers must hide this when null
  // (TrainerBio does) — a TODO or empty value never reaches a page.
  doctorate: null as string | null,
  years: { total: YEARS_TOTAL, professor: YEARS_PROFESSOR },
  qsrSinceYear: QSR_SINCE,
  learners: LEARNERS,
  workshops: WORKSHOPS,
  photo: {
    src: '/assets/dr-kapil-dev-sharma-executive.jpg',
    width: 1374,
    height: 1145,
    webp: {
      480: '/assets/dr-kapil-dev-sharma-executive-480.webp',
      800: '/assets/dr-kapil-dev-sharma-executive-800.webp',
      1200: '/assets/dr-kapil-dev-sharma-executive-1200.webp',
    },
    alt: 'Dr. Kapil Dev Sharma, Brain, Mind & Meditation Coach',
  },
  en: {
    title: 'Brain, Mind & Meditation Coach',
    shortBio: `${YEARS_TOTAL} years in education and mind training · Quantum Speed Reading trainer since ${QSR_SINCE} · ${LEARNERS} learners · ${WORKSHOPS} workshops`,
    longBio:
      `Dr. Kapil Dev Sharma brings ${YEARS_TOTAL} years of experience — ${YEARS_PROFESSOR} years as a professor and researcher in formal education, and more than a decade as a mind trainer, life coach and meditation teacher. He was one of the first trainers to teach Quantum Speed Reading in India, since ${QSR_SINCE}, and has developed his own structured 30-day method.`,
    stats: [
      { value: String(YEARS_TOTAL), label: 'Years in education & mind training' },
      { value: LEARNERS, label: 'Learners' },
      { value: WORKSHOPS, label: 'Workshops' },
      { value: String(FOUNDED), label: 'Mind Ur Mind founded' },
    ],
  } satisfies TrainerCopy,
  hi: {
    title: 'ब्रेन, माइंड व मेडिटेशन कोच',
    shortBio: `शिक्षा और माइंड ट्रेनिंग में ${YEARS_TOTAL} वर्ष · ${QSR_SINCE} से क्वांटम स्पीड रीडिंग ट्रेनर · ${LEARNERS} विद्यार्थी · ${WORKSHOPS} वर्कशॉप्स`,
    longBio:
      `डॉ. कपिल देव शर्मा के पास ${YEARS_TOTAL} वर्षों का अनुभव है — ${YEARS_PROFESSOR} वर्ष औपचारिक शिक्षा में प्रोफेसर और शोधकर्ता के रूप में, और एक दशक से अधिक समय से माइंड ट्रेनर, लाइफ कोच और मेडिटेशन शिक्षक के रूप में। वे ${QSR_SINCE} से भारत में क्वांटम स्पीड रीडिंग सिखाने वाले शुरुआती ट्रेनर्स में से एक हैं, और उन्होंने अपनी खुद की संरचित 30-दिवसीय विधि विकसित की है।`,
    stats: [
      { value: String(YEARS_TOTAL), label: 'वर्ष शिक्षा व माइंड ट्रेनिंग में' },
      { value: LEARNERS, label: 'विद्यार्थी' },
      { value: WORKSHOPS, label: 'वर्कशॉप्स' },
      { value: String(FOUNDED), label: 'Mind Ur Mind की स्थापना' },
    ],
  } satisfies TrainerCopy,
} as const

export const trainer: Widen<typeof trainerData> = trainerData

export type ProgramStatus = 'active' | 'upcoming' | 'closed'
export type ProgramPillar = 'brain' | 'mind' | 'meditation' | 'business'

type ProgramPrice = { label: string; amountInr: number }
type ProgramCheckout = { label: string; href: string }

export type Program = {
  id: string
  /** Public name — menus, cards, headings, footer, FAQ, meta titles, WhatsApp. */
  name: string
  nameHi: string
  /** Only for tight UI (app sidebar, small buttons) where the full name can't fit. */
  shortName?: string
  shortNameHi?: string
  /**
   * In-app name, when it differs from the public marketing name — e.g. the
   * free starter's full 21-day in-app journey and its completion certificate.
   */
  appName?: string
  appNameHi?: string
  outcome: string
  audience: string
  format: string
  /**
   * Empty array = no published price (enrolment by application/enquiry).
   * Anything rendering prices must hide the price line when this is empty.
   */
  prices: readonly ProgramPrice[]
  checkout: readonly ProgramCheckout[]
  url: string
  status: ProgramStatus
  pillar: ProgramPillar
}

const programsData = {
  qsr: {
    id: 'qsr',
    name: 'Quantum Speed Reading — 30-Day Live Program',
    nameHi: 'क्वांटम स्पीड रीडिंग — 30-दिवसीय लाइव प्रोग्राम',
    shortName: '30-Day Live Program',
    shortNameHi: '30-दिवसीय लाइव प्रोग्राम',
    outcome: 'Read faster with stronger comprehension and retention, trained over 30 days of guided daily practice.',
    audience: 'Students, competitive-exam aspirants, professionals and parents',
    format: 'Online · 30 days · 7 live sessions + daily app practice',
    prices: [{ label: 'One-time enrolment', amountInr: 9999 }],
    checkout: [{ label: 'Razorpay', href: RAZORPAY_MASTERCLASS_PAYMENT_LINK }],
    url: '/programs/quantum-speed-reading',
    status: 'active',
    pillar: 'brain',
  },
  focusStarter: {
    id: 'focusStarter',
    name: '7-Day Free Focus & Reading Starter',
    nameHi: '7-दिवसीय फ्री फोकस व रीडिंग स्टार्टर',
    appName: '21-Day Focus & Reading Program',
    appNameHi: '21-दिवसीय फोकस व रीडिंग प्रोग्राम',
    outcome: 'Build a daily focus and reading habit — start free for 7 days, continue to 21 days if it works for you.',
    audience: 'Anyone who wants an easy, low-commitment start',
    format: 'App-based · 10 minutes a day · Days 1–7 free, Days 8–21 optional',
    prices: [
      { label: 'Days 1–7', amountInr: 0 },
      { label: 'Days 8–21 (one-time)', amountInr: 99 },
    ],
    checkout: [
      { label: 'Free sign-up', href: HABIT_BUILDER_SIGNUP_HREF },
      { label: 'Razorpay (Days 8–21)', href: RAZORPAY_QUANTUM_MINDSET_HABIT_BUILDER_PAYMENT_LINK },
    ],
    url: '/programs/habit-builder',
    status: 'active',
    pillar: 'brain',
  },
  overthinkingReset: {
    id: 'overthinkingReset',
    name: '21-Day Overthinking Reset',
    nameHi: '21-दिवसीय ओवरथिंकिंग रीसेट',
    outcome: 'Understand your overthinking patterns and build mental clarity through 21 days of guided daily practice.',
    audience: 'Adults caught in overthinking, worry and stress loops (taught in Hindi)',
    format: 'Online, self-paced · 21 days · daily video, meditation and activity',
    prices: [
      { label: '1-month access', amountInr: 499 },
      { label: '6-month access + 2 live sessions', amountInr: 999 },
    ],
    checkout: [{ label: 'Classplus', href: CLASSPLUS_OVERTHINKING_COURSE_LINK }],
    url: '/mentoring/overthinking-course',
    status: 'active',
    pillar: 'mind',
  },
  oneOnOneCoaching: {
    id: 'oneOnOneCoaching',
    name: '1-on-1 Mind Coaching with Dr. Kapil',
    nameHi: 'डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग',
    outcome: 'Private coaching shaped entirely around your own situation — overthinking, focus or personal growth.',
    audience: 'Individuals who want personal, custom-paced guidance',
    format: 'Private sessions · online or in person · by application',
    prices: [],
    checkout: [{ label: 'Apply on WhatsApp', href: waLink('Hi Dr. Kapil, I want to apply for 1-on-1 Mind Coaching with Dr. Kapil.') }],
    url: '/mentoring/personal-class',
    status: 'active',
    pillar: 'mind',
  },
  onlineRetreat: {
    id: 'onlineRetreat',
    name: '11-Day Online Deep Meditation Retreat',
    nameHi: '11-दिवसीय ऑनलाइन डीप मेडिटेशन रिट्रीट',
    outcome: 'An intensive, live, nightly meditation journey in authentic Kriya Yoga and Prana practice.',
    audience: 'Adults ready for a deep, guided meditation practice',
    format: 'Online · 11 nights, monthly (10th–20th) · 7:30–10:30 PM IST',
    // TODO(content): no retreat fee is published on the site yet — add it here once confirmed.
    prices: [],
    checkout: [{ label: 'Razorpay', href: RAZORPAY_RETREAT_PAYMENT_LINK }],
    url: '/retreats/online-11-day',
    status: 'active',
    pillar: 'meditation',
  },
  residentialRetreat: {
    id: 'residentialRetreat',
    name: 'Residential Meditation Retreats — Lonavala & Rishikesh',
    nameHi: 'रेजिडेंशियल मेडिटेशन रिट्रीट्स — लोनावला व ऋषिकेश',
    outcome: 'A small-group, fully immersive in-person retreat guided by Dr. Kapil Dev Sharma.',
    audience: 'Adults wanting a fully in-person meditation retreat',
    format: 'Residential · Lonavala & Rishikesh · 3–4 batches a year',
    prices: [
      { label: 'Sharing room', amountInr: 35000 },
      { label: 'Private room', amountInr: 45000 },
    ],
    checkout: [{ label: 'Reserve on WhatsApp', href: waLink('Hi Dr. Kapil, I want to secure my seat in the Residential Meditation Retreats — Lonavala & Rishikesh') }],
    url: '/retreats/residential',
    status: 'active',
    pillar: 'meditation',
  },
  executiveWorkshop: {
    id: 'executiveWorkshop',
    name: 'Executive Brain Performance Workshop',
    nameHi: 'Executive Brain Performance Workshop',
    outcome: 'Calm, focus and decision clarity for leaders — with a live EEG demo and 21 days of guided practice.',
    audience: 'Executives, founders and senior professionals',
    format: 'In person · Mumbai · one day (18 October 2026) + 21-day WhatsApp practice',
    // Prices/links are owned by executiveBrainWorkshopConfig.ts (the page's
    // operational config); mirrored here for the registry only.
    prices: [
      { label: 'Early Bird', amountInr: 4999 },
      { label: 'Standard', amountInr: 7999 },
      { label: 'Executive 1:1 Track', amountInr: 29999 },
    ],
    checkout: [{ label: 'Razorpay', href: 'https://razorpay.me/@mindurmindacademy' }],
    url: '/executive-brain-workshop',
    status: 'upcoming',
    pillar: 'business',
  },
  prefrontalPower: {
    id: 'prefrontalPower',
    name: 'PREfrontal POWER Mumbai',
    nameHi: 'PREfrontal POWER मुंबई',
    outcome: 'A one-day, science-informed brain training workshop for focus, emotional regulation and decision-making.',
    audience: 'Adults and professionals in Mumbai',
    format: 'In person · Mumbai · one day (27 September 2026) · 40 seats',
    prices: [{ label: 'Per person', amountInr: 3500 }],
    checkout: [
      {
        label: 'Register on WhatsApp',
        href: waLink("Hi, I'm interested in attending PREfrontal POWER on 27 September in Mumbai. Please share the registration details."),
      },
    ],
    url: '/prefrontal-power-mumbai',
    status: 'upcoming',
    pillar: 'brain',
  },
  qsrMumbai: {
    id: 'qsrMumbai',
    name: 'Quantum Speed Reading — Mumbai 2-Day Live Workshop',
    nameHi: 'क्वांटम स्पीड रीडिंग — मुंबई 2-दिवसीय लाइव वर्कशॉप',
    outcome: 'The 30-day program with two in-person coaching days in Mumbai.',
    audience: 'Mumbai-based learners who prefer in-person coaching',
    format: 'In person · Mumbai · 2 days + 30-day app curriculum',
    prices: [{ label: 'One-time enrolment', amountInr: 9999 }],
    checkout: [],
    url: '/programs/quantum-speed-reading-mumbai',
    // Unpublished pilot — the page returns 404 until venue/dates are confirmed.
    status: 'closed',
    pillar: 'brain',
  },
  franchise: {
    id: 'franchise',
    name: 'Franchise & Trainer Partner Program',
    nameHi: 'फ्रैंचाइज़ व ट्रेनर पार्टनर प्रोग्राम',
    outcome: 'Run your own Quantum Speed Reading training business with a ready curriculum, platform and certification.',
    audience: 'Educators, graduates and entrepreneurs',
    format: 'Application · 7-day certification · ongoing partner support',
    prices: [],
    checkout: [{ label: 'Apply on WhatsApp', href: waLink('Hi Dr. Kapil, I want to apply to become a certified Quantum Speed Reading trainer partner.') }],
    url: '/franchise-individual',
    status: 'active',
    pillar: 'business',
  },
  app: {
    id: 'app',
    name: 'Mind Ur Mind App',
    nameHi: 'Mind Ur Mind App',
    outcome: 'Daily reading, focus and memory practice with progress tracking.',
    audience: 'Program participants and families',
    format: 'Web app · subscription plans (parked — /pricing is noindex since site-rebuild Phase 1)',
    prices: [
      { label: 'Starter (monthly)', amountInr: 399 },
      { label: 'Family Pro (monthly)', amountInr: 699 },
    ],
    checkout: [
      { label: 'Starter monthly', href: STARTER_MONTHLY_399 },
      { label: 'Family Pro monthly', href: FAMILY_PRO_MONTHLY_699 },
    ],
    url: '/pricing',
    status: 'active',
    pillar: 'brain',
  },
} as const satisfies Record<string, Program>

export const programs: Widen<typeof programsData> = programsData

export type ProgramId = keyof typeof programs

export const siteConfig = { brand, trainer, programs } as const

/** The first checkout/enquiry link of a program — throws at module load if the registry entry has none. */
export function primaryCheckoutHref(id: ProgramId): string {
  const first = programs[id].checkout[0]
  if (first === undefined) throw new Error(`site.config: program "${id}" has no checkout link`)
  return first.href
}
