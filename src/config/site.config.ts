import { RAZORPAY_MASTERCLASS_PAYMENT_LINK } from './masterclassPaymentLink'
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
const SKILLS_TRAINING_SINCE = 2015
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
  skillsTrainingSinceYear: SKILLS_TRAINING_SINCE,
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
    shortBio: `${YEARS_TOTAL} years in education and mind training · Trainer in reading, focus and memory skills since ${SKILLS_TRAINING_SINCE} · ${LEARNERS} learners · ${WORKSHOPS} workshops`,
    longBio:
      `Dr. Kapil Dev Sharma brings ${YEARS_TOTAL} years of experience — ${YEARS_PROFESSOR} years as a professor and researcher in formal education, and more than a decade as a mind trainer, life coach and meditation teacher. He has trained learners in reading, focus and memory skills since ${SKILLS_TRAINING_SINCE}, and developed his own structured 30-day method, now called Sharp Brain™.`,
    stats: [
      { value: String(YEARS_TOTAL), label: 'Years in education & mind training' },
      { value: LEARNERS, label: 'Learners' },
      { value: WORKSHOPS, label: 'Workshops' },
      { value: String(FOUNDED), label: 'Mind Ur Mind founded' },
    ],
  } satisfies TrainerCopy,
  hi: {
    title: 'ब्रेन, माइंड व मेडिटेशन कोच',
    shortBio: `शिक्षा और माइंड ट्रेनिंग में ${YEARS_TOTAL} वर्ष · ${SKILLS_TRAINING_SINCE} से रीडिंग, फोकस और मेमोरी स्किल्स के ट्रेनर · ${LEARNERS} विद्यार्थी · ${WORKSHOPS} वर्कशॉप्स`,
    longBio:
      `डॉ. कपिल देव शर्मा के पास ${YEARS_TOTAL} वर्षों का अनुभव है — ${YEARS_PROFESSOR} वर्ष औपचारिक शिक्षा में प्रोफेसर और शोधकर्ता के रूप में, और एक दशक से अधिक समय से माइंड ट्रेनर, लाइफ कोच और मेडिटेशन शिक्षक के रूप में। वे ${SKILLS_TRAINING_SINCE} से विद्यार्थियों को रीडिंग, फोकस और मेमोरी स्किल्स सिखा रहे हैं, और उन्होंने अपनी खुद की संरचित 30-दिवसीय विधि विकसित की है, जिसे अब Sharp Brain™ कहा जाता है।`,
    stats: [
      { value: String(YEARS_TOTAL), label: 'वर्ष शिक्षा व माइंड ट्रेनिंग में' },
      { value: LEARNERS, label: 'विद्यार्थी' },
      { value: WORKSHOPS, label: 'वर्कशॉप्स' },
      { value: String(FOUNDED), label: 'Mind Ur Mind की स्थापना' },
    ],
  } satisfies TrainerCopy,
} as const

export const trainer: Widen<typeof trainerData> = trainerData

/** `hidden` = kept in the registry but not sold or shown on any page. */
export type ProgramStatus = 'active' | 'upcoming' | 'closed' | 'hidden'
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
  /** Length of each session/retreat in days, when fixed. `null` = not published yet — hidden on the page. */
  durationDays?: number | null
  /** Fixed-length packages (e.g. 1-on-1 coaching). No prices — the fee is set per person after applying. */
  packages?: readonly { id: string; days: number }[]
  /** Dated live events only. Hidden everywhere once `endISO` has passed. */
  event?: {
    endISO: string
    dateDisplay: string
    dateDisplayHi: string
    city: string
    cityHi: string
  }
}

const programsData = {
  // Sharp Brain™ — Focus · Memory · Smart Reading (formerly "Quantum Speed
  // Reading"; renamed in site-rebuild Phase 5B). Cognitive-skills program,
  // pillar: brain. Formats below share one landing page, /programs/sharp-brain.
  sharpBrain: {
    id: 'sharpBrain',
    name: 'Sharp Brain 30-Day Program',
    nameHi: 'Sharp Brain 30-दिवसीय प्रोग्राम',
    shortName: 'Sharp Brain',
    shortNameHi: 'Sharp Brain',
    outcome: 'Read faster with understanding, focus longer, remember more — measured from your own Day 1 to Day 30.',
    audience: 'School and college students, competitive-exam aspirants, working professionals — and parents enrolling their child',
    format: 'Online · 7 live classes + 30 days of app practice',
    prices: [{ label: 'One-time enrolment', amountInr: 9999 }],
    // Every "Enrol" button leads to the batch picker on the program page;
    // the price (early-bird / regular / test offer) and the Razorpay link
    // are decided on the server there — see sharpBrainEnrolment below and
    // src/features/sharp-brain-enrol.
    checkout: [{ label: 'Choose your batch', href: '/programs/sharp-brain#enrol' }],
    url: '/programs/sharp-brain',
    status: 'active',
    pillar: 'brain',
  },
  sharpBrainWorkshop: {
    id: 'sharpBrainWorkshop',
    name: 'Sharp Brain Workshop',
    nameHi: 'Sharp Brain वर्कशॉप',
    outcome: 'Two days of live, hands-on training in focus, memory and smart reading, online or in person.',
    audience: 'Students, parents with children, professionals',
    format: '2 days · online or offline (city batches)',
    // TODO(content): workshop price not published — shown once added here.
    prices: [] as ProgramPrice[],
    checkout: [{ label: 'Join the waitlist on WhatsApp', href: waLink('Hi Dr. Kapil, I want to know about the next Sharp Brain Workshop.') }],
    url: '/programs/sharp-brain',
    // Hidden (2026-10-01): the Sharp Brain page sells one offer, the 30-Day Program.
    status: 'hidden',
    pillar: 'brain',
  },
  sharpBrainSelfLearning: {
    id: 'sharpBrainSelfLearning',
    name: 'Sharp Brain Self-Learning',
    nameHi: 'Sharp Brain सेल्फ-लर्निंग',
    outcome: 'Recorded lessons plus 30 days of app practice, at your own pace.',
    audience: 'Learners who prefer to study at their own pace',
    format: 'Recorded lessons + 30 days of app practice',
    // TODO(content): self-learning price and checkout link not provided yet.
    prices: [] as ProgramPrice[],
    checkout: [{ label: 'Ask on WhatsApp', href: waLink('Hi Dr. Kapil, I want to know about Sharp Brain Self-Learning.') }],
    url: '/programs/sharp-brain',
    // Hidden (2026-10-01): the Sharp Brain page sells one offer, the 30-Day Program.
    status: 'hidden',
    pillar: 'brain',
  },
  sharpBrainSchools: {
    id: 'sharpBrainSchools',
    name: 'Sharp Brain for Schools',
    nameHi: 'स्कूलों के लिए Sharp Brain',
    outcome: 'Focus, memory, smart reading and mobile discipline for students, delivered in schools.',
    audience: 'Schools and institutions',
    format: 'In-school programs and talks',
    prices: [] as ProgramPrice[],
    checkout: [{ label: 'Enquire on WhatsApp', href: waLink('Hi Dr. Kapil, I want to bring Sharp Brain to our school.') }],
    url: '/corporate#schools',
    status: 'active',
    pillar: 'brain',
  },

  focusStarter: {
    id: 'focusStarter',
    // Shown only to learners who already started it (see
    // hasStartedPracticeJourney). Never "Starter" or "₹99" in visible text.
    name: 'Sharp Brain Practice Journey',
    nameHi: 'Sharp Brain प्रैक्टिस जर्नी',
    appName: 'Sharp Brain Practice Journey',
    appNameHi: 'Sharp Brain प्रैक्टिस जर्नी',
    outcome: 'Build a daily focus and reading habit — start free for 7 days, continue to 21 days if it works for you.',
    audience: 'Anyone who wants an easy, low-commitment start',
    format: 'App-based · 10 minutes a day · Days 1–7 free, Days 8–21 optional',
    prices: [
      { label: 'Days 1–7', amountInr: 0 },
      { label: 'Days 8–21 (one-time)', amountInr: 99 },
    ],
    // Closed to new buyers (positioning decision, 2026-09-29): one program,
    // one price, one path — Sharp Brain leads go to the ₹9,999 program or a
    // free live session. Existing Starter holders keep their app access.
    // /programs/habit-builder 301-redirects to /programs/sharp-brain.
    checkout: [] as ProgramCheckout[],
    url: '/programs/habit-builder',
    status: 'closed',
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
    // Customised program — no fixed prices. The fee depends on the package
    // (7, 14 or 21 days) and session timing, shared after the application.
    packages: [
      { id: '7-day', days: 7 },
      { id: '14-day', days: 14 },
      { id: '21-day', days: 21 },
    ],
    pillar: 'mind',
  },
  onlineRetreat: {
    id: 'onlineRetreat',
    name: '11-Day Online Deep Meditation Retreat',
    nameHi: '11-दिवसीय ऑनलाइन डीप मेडिटेशन रिट्रीट',
    outcome: 'An intensive, live, nightly meditation journey in authentic Kriya Yoga and Prana practice.',
    audience: 'Adults ready for a deep, guided meditation practice',
    format: 'Online · 11 nights, monthly (10th–20th) · 7:30–10:30 PM IST',
    prices: [{ label: 'Per person', amountInr: 6999 }] as ProgramPrice[],
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
    durationDays: 7 as number | null,
    pillar: 'meditation',
  },
  executiveWorkshop: {
    id: 'executiveWorkshop',
    name: 'Executive Brain Performance Workshop',
    nameHi: 'Executive Brain Performance Workshop',
    outcome: 'Calm, focus and decision clarity for leaders — with a live EEG brain-state demo and 21 days of guided practice.',
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
    // Mirrors executiveBrainWorkshopConfig.ts (the page's own config).
    event: {
      endISO: '2026-10-18T17:30:00+05:30',
      dateDisplay: 'Sun, 18 Oct 2026',
      dateDisplayHi: 'रवि, 18 अक्टूबर 2026',
      city: 'Mumbai',
      cityHi: 'मुंबई',
    },
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
    event: {
      endISO: '2026-09-27T23:59:59+05:30',
      dateDisplay: 'Sun, 27 Sep 2026',
      dateDisplayHi: 'रवि, 27 सितंबर 2026',
      city: 'Mumbai',
      cityHi: 'मुंबई',
    },
    pillar: 'brain',
  },

  franchise: {
    id: 'franchise',
    name: 'Franchise & Trainer Partner Program',
    nameHi: 'फ्रैंचाइज़ व ट्रेनर पार्टनर प्रोग्राम',
    outcome: 'Run your own Sharp Brain™ training business with a ready curriculum, platform and certification.',
    audience: 'Educators, graduates and entrepreneurs',
    format: 'Application · 7-day certification · ongoing partner support',
    prices: [],
    checkout: [{ label: 'Apply on WhatsApp', href: waLink('Hi Dr. Kapil, I want to apply to become a certified Sharp Brain trainer partner.') }],
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

/** A program's checkout link by its label — throws at module load if missing. */
export function checkoutHref(id: ProgramId, label: string): string {
  const found = programs[id].checkout.find((c) => c.label === label)
  if (found === undefined) throw new Error(`site.config: program "${id}" has no checkout "${label}"`)
  return found.href
}

/** The program whose page is `pathname` (hash-only anchor entries excluded). */
export function programForPath(pathname: string): (typeof programs)[ProgramId] | null {
  const path = pathname.replace(/\/+$/, '') || '/'
  const all = Object.values(programs) as (typeof programs)[ProgramId][]
  return all.find((p) => !p.url.includes('#') && p.url === path) ?? null
}

/** The program a checkout link belongs to (first match in registry order). */
export function programForCheckoutHref(href: string): (typeof programs)[ProgramId] | null {
  const all = Object.values(programs) as (typeof programs)[ProgramId][]
  return all.find((p) => p.checkout.some((c) => c.href === href)) ?? null
}

/**
 * Analytics IDs — loaded site-wide only when set. Leave empty until the
 * real IDs are supplied; never put a placeholder here.
 * TODO(content): GA4 measurement ID (G-…) and Meta Pixel ID not provided yet.
 */
export const analytics: { readonly ga4MeasurementId: string; readonly metaPixelId: string } = {
  ga4MeasurementId: '',
  metaPixelId: '',
}

/** The first checkout/enquiry link of a program — throws at module load if the registry entry has none. */
export function primaryCheckoutHref(id: ProgramId): string {
  const first = programs[id].checkout[0]
  if (first === undefined) throw new Error(`site.config: program "${id}" has no checkout link`)
  return first.href
}

/**
 * Testimonials shown on the site — exact names as they appear in
 * src/config/testimonials.ts. Only names listed here render anywhere;
 * every other testimonial stays in the data file, hidden.
 * TODO(content): waiting for the confirmed list of verified names.
 */
export const verifiedTestimonialNames: readonly string[] = []

const contactData = {
  email: 'info@mindurmind.org.in',
  /** Same number for calls and WhatsApp. */
  phoneDisplay: '+91 95401 23161',
  phoneHref: 'tel:+919540123161',
  address: {
    en: 'Gitanjali Duplex, Novino–Tarsali Road, Vadodara, Gujarat, India',
    hi: 'गीतांजलि डुप्लेक्स, नोविनो–तरसाली रोड, वडोदरा, गुजरात, भारत',
  },
  // TODO(content): working hours not provided yet — do not invent. Pages
  // hide this when null (a preview-only TODO marker shows instead).
  hours: null as { en: string; hi: string } | null,
  /** Official YouTube channel ("MindUrMind | Dr Kapil Dev Sharma"). */
  youtube: {
    handle: '@innershiftWithDrKapil',
    url: 'https://www.youtube.com/@innershiftWithDrKapil',
  },
} as const

export const contact: Widen<typeof contactData> = contactData

/**
 * Companies, schools and institutions Dr. Kapil Dev Sharma has worked
 * with — shown on /about and /corporate only when listed here.
 * TODO(content): waiting for the confirmed list; do not invent names.
 */
export const organisationsWorkedWith: readonly string[] = []

/**
 * Sharp Brain formats that franchise / trainer partners may run — shown on
 * /franchise-individual when set (use the registry names, e.g.
 * programs.sharpBrainWorkshop.name).
 * TODO(content): not confirmed yet — do not guess.
 */
export const franchisePartnerFormats: readonly string[] | null = null

/**
 * QSR results guarantee — the single wording used on the QSR page, FAQs
 * and the Refund & Cancellation Policy page, so the conditions can never
 * differ between them. `statement` is the binding sentence; `short` is
 * the one-line summary for tight spots (it must not add or drop a
 * condition).
 */
const qsrGuaranteeData = {
  en: {
    title: '100% Results Guarantee',
    /** Title on sales pages (Sharp Brain page, test result), which carry no "100%" claims. */
    label: 'Results Guarantee',
    statement:
      "If you complete the full 30-day protocol as instructed — every daily app session, and all 7 live masterclass sessions with Dr. Kapil Dev Sharma — and your reading speed (WPM) and comprehension haven't measurably improved between your Day 1 baseline and your Day 30 checkpoint, we'll issue a full refund of your enrolment fee.",
    short:
      "100% Results Guarantee — a full refund if your WPM and comprehension haven't measurably improved after the complete 30-day protocol.",
    requestWindow: 'Request it within 7 days of completing Day 30.',
  },
  hi: {
    title: '100% रिज़ल्ट गारंटी',
    label: 'रिज़ल्ट गारंटी',
    statement:
      'अगर आप पूरा 30-दिवसीय प्रोटोकॉल निर्देशानुसार पूरा करते हैं — हर दैनिक ऐप सेशन, और डॉ. कपिल देव शर्मा के साथ सभी 7 लाइव मास्टरक्लास सेशन — और आपके दिन 1 के बेसलाइन और दिन 30 के चेकपॉइंट के बीच आपकी रीडिंग स्पीड (WPM) और समझ में मापने योग्य सुधार नहीं होता, तो हम आपकी नामांकन फीस का पूरा रिफंड देंगे।',
    short:
      '100% रिज़ल्ट गारंटी — पूरा 30-दिवसीय प्रोटोकॉल पूरा करने के बाद भी अगर आपकी WPM और समझ में मापने योग्य सुधार नहीं होता, तो पूरा रिफंड।',
    requestWindow: 'दिन 30 पूरा करने के 7 दिनों के भीतर अनुरोध करें।',
  },
} as const

export const qsrGuarantee: Widen<typeof qsrGuaranteeData> = qsrGuaranteeData

/**
 * Sharp Brain 30-Day Program — batches, early-bird and the Reading Speed
 * Test offer. All dates are IST and every price is decided on the server
 * (src/features/sharp-brain-enrol), never from the visitor's clock.
 *
 * - Two batches a month, starting on each day in `batchStartDays`.
 * - Early-bird for a batch ends `earlyBirdEndsDaysBefore` days before it
 *   starts, at 23:59 IST (15th → 10th, 25th → 20th).
 * - Test offer: `testOffer.discountInr` off the regular price for
 *   `testOffer.validHours`, one per WhatsApp number, ever.
 * - Offers never stack: the buyer pays the lowest available price, never
 *   below `floorInr`.
 * - `seatsPerBatch: null` = no seat limit is shown anywhere. Only set a
 *   real number.
 *
 * Checkout: with RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET set, each checkout
 * creates its own Razorpay Payment Link (amount, batch and offer in its
 * notes). Without them the fixed links below are used; a discounted price
 * is only offered on production once its fixed link is set.
 */
const sharpBrainEnrolmentData = {
  batchStartDays: [15, 25],
  earlyBirdEndsDaysBefore: 5,
  regularInr: 9999,
  earlyBirdInr: 8999,
  floorInr: 8999,
  testOffer: { discountInr: 1000, validHours: 48 },
  seatsPerBatch: null as number | null,
  fallbackLinks: {
    regular: RAZORPAY_MASTERCLASS_PAYMENT_LINK,
    // TODO(business): Dr. Kapil to create a fixed ₹8,999 Razorpay link
    // (used for early-bird and the test offer while the API keys are missing).
    discounted: null as string | null,
  },
} as const

export const sharpBrainEnrolment: Widen<typeof sharpBrainEnrolmentData> & {
  readonly seatsPerBatch: number | null
  readonly fallbackLinks: { readonly regular: string; readonly discounted: string | null }
} = sharpBrainEnrolmentData

export type UpcomingEvent = {
  id: string
  name: string
  nameHi: string
  url: string
  prices: readonly { label: string; amountInr: number }[]
  event: NonNullable<Program['event']>
}

/** Upcoming dated events that haven't ended yet (at `now`), soonest first. */
export function upcomingEvents(now: Date = new Date()): UpcomingEvent[] {
  const all = Object.values(programs) as readonly (Omit<UpcomingEvent, 'event'> & { status: string; event?: Program['event'] })[]
  return all
    .filter((p): p is typeof p & { event: NonNullable<Program['event']> } => p.status === 'upcoming' && p.event !== undefined)
    .filter((p) => new Date(p.event.endISO).getTime() > now.getTime())
    .sort((a, b) => new Date(a.event.endISO).getTime() - new Date(b.event.endISO).getTime())
    .map((p) => ({ id: p.id, name: p.name, nameHi: p.nameHi, url: p.url, prices: p.prices, event: p.event }))
}
