import { CLARITY_SESSION, EXPERIENCE_LINE, calmMindBatch, programs } from '@/config/site.config'

// Homepage wording for `/` (English) and `/hi` (Hindi).
// Owner's offer ladder (23 Nov 2026): two doors in the hero — Sharp Brain
// (students & professionals) and the 21-Day Online Retreat (stress &
// overthinking) — then the 3 main programs (Sharp Brain, Online Retreat,
// Personal Sessions), then a "more ways" strip (Telepathy workshop,
// Rishikesh retreat, organisations). Prices come from site.config.ts.

type Bi = { hi: string; en: string }

const inr = (n: number): string => `₹${n.toLocaleString('en-IN')}`
const sbPrice = (i: number): string => inr(programs.sharpBrain.prices[i]?.amountInr ?? 0)
const fromPrice = sbPrice(0)
const clarityPrice = inr(CLARITY_SESSION.priceInr)
const retreatEarly = inr(calmMindBatch.earlyBirdPrice)
const retreatRegular = inr(calmMindBatch.regularPrice)
const rishikeshPrice = inr(programs.residentialRetreat.prices[0]?.amountInr ?? 0)

export const homeV2 = {
  meta: {
    title: {
      hi: 'Sharp Brain, 21 दिन का ऑनलाइन रिट्रीट और पर्सनल सेशन — डॉ. कपिल देव शर्मा | मन उर मन',
      en: 'Sharp Brain, 21-Day Online Retreat & Personal Sessions — Dr. Kapil Dev Sharma | Mind Ur Mind',
    },
    description: {
      hi: `Sharp Brain — फ़ोकस, याददाश्त और स्मार्ट रीडिंग (${fromPrice} से)। 21 दिन का ऑनलाइन रिट्रीट — शांत मन, बेहतर नींद (अर्ली-बर्ड ${retreatEarly})। डॉ. कपिल देव शर्मा के साथ 1-on-1 पर्सनल सेशन (क्लैरिटी सेशन ${clarityPrice})।`,
      en: `Sharp Brain — focus, memory and smart reading (from ${fromPrice}). 21-Day Online Retreat — a calmer mind and better sleep (early-bird ${retreatEarly}). 1-on-1 Personal Sessions with Dr. Kapil Dev Sharma (Clarity Session ${clarityPrice}).`,
    },
  },
  hero: {
    strip: { hi: `डॉ. कपिल देव शर्मा · ${EXPERIENCE_LINE.hi}`, en: `Dr. Kapil Dev Sharma · ${EXPERIENCE_LINE.en}` },
    h1: { hi: 'तेज़ दिमाग़। शांत मन।', en: 'A sharper brain. A calmer mind.' },
    sub: {
      hi: 'PhD, 15 साल प्रोफ़ेसर और 12+ साल माइंड कोच, डॉ. कपिल के साथ — विज्ञान और ध्यान का मेल। आप किस लिए आए हैं?',
      en: 'With Dr. Kapil — PhD, 15 years a professor and 12+ years a mind coach — science and meditation together. What brings you here?',
    },
    doors: [
      {
        id: 'sharp-brain',
        who: { hi: 'विद्यार्थी और प्रोफ़ेशनल', en: 'Students & professionals' },
        title: { hi: 'Sharp Brain', en: 'Sharp Brain' },
        line: { hi: 'फ़ोकस, याददाश्त और पढ़ने की रफ़्तार — 30 दिन में, नाप कर।', en: 'Focus, memory and reading speed — in 30 days, measured.' },
        price: { hi: `${fromPrice} से`, en: `from ${fromPrice}` },
        hrefEn: '/programs/sharp-brain',
        hrefHi: '/programs/sharp-brain?lang=hi',
      },
      {
        id: 'online-retreat',
        who: { hi: 'तनाव और ओवरथिंकिंग', en: 'Stress & overthinking' },
        title: { hi: '21 दिन का ऑनलाइन रिट्रीट', en: '21-Day Online Retreat' },
        line: { hi: 'हर सुबह लाइव मेडिटेशन + 7 लाइव क्लास। 1 जनवरी से।', en: 'A live meditation every morning + 7 live classes. Starts 1 January.' },
        price: { hi: `${retreatEarly} अर्ली-बर्ड`, en: `${retreatEarly} early-bird` },
        hrefEn: '/online-retreat',
        hrefHi: '/online-retreat?lang=hi',
      },
    ],
    smallLine: {
      hi: `Sharp Brain ${fromPrice} से · ऑनलाइन रिट्रीट ${retreatEarly} अर्ली-बर्ड · क्लैरिटी सेशन ${clarityPrice}`,
      en: `Sharp Brain from ${fromPrice} · Online Retreat ${retreatEarly} early-bird · Clarity Session ${clarityPrice}`,
    },
  },
  paths: {
    heading: { hi: 'तीन रास्ते — अपना चुनिए', en: 'Three ways to work with Dr. Kapil' },
    sharpBrain: {
      eyebrow: { hi: 'पढ़ाई और काम के लिए', en: 'For study and work' },
      title: { hi: 'Sharp Brain', en: 'Sharp Brain' },
      line: { hi: 'फ़ोकस · याददाश्त · स्मार्ट रीडिंग — ऐप पर रोज़ 10–15 मिनट, Day 1 / Day 30 टेस्ट और सर्टिफ़िकेट।', en: 'Focus · Memory · Smart Reading — 10–15 minutes of app practice a day, a Day 1 / Day 30 test and a certificate.' },
      prices: [
        { label: { hi: '2 दिन ऑनलाइन वर्कशॉप', en: '2-day online workshop' }, price: sbPrice(0) },
        { label: { hi: 'सेल्फ़-पेस्ड', en: 'Self-paced' }, price: sbPrice(1) },
        { label: { hi: 'लाइव ऑनलाइन', en: 'Live online' }, price: sbPrice(2) },
        { label: { hi: 'ऑफ़लाइन + EEG', en: 'Offline + EEG' }, price: sbPrice(3) },
      ],
      button: { hi: 'चारों प्लान देखिए', en: 'See all 4 plans' },
    },
    retreat: {
      eyebrow: { hi: 'तनाव, नींद और ओवरथिंकिंग के लिए', en: 'For stress, sleep and overthinking' },
      title: { hi: '21 दिन का ऑनलाइन रिट्रीट', en: '21-Day Online Retreat' },
      points: [
        { hi: 'हर सुबह 6:30 बजे लाइव मेडिटेशन', en: 'Live meditation every morning at 6:30' },
        { hi: 'डॉ. कपिल के साथ 7 लाइव शाम की क्लास', en: '7 live evening classes with Dr. Kapil' },
        { hi: 'प्राइवेट WhatsApp ग्रुप + 3 महीने रिकॉर्डिंग', en: 'Private WhatsApp group + 3 months of recordings' },
        { hi: 'Calm · Clear · Connect — हर हफ़्ता एक चरण', en: 'Calm · Clear · Connect — one week each' },
      ],
      price: retreatEarly,
      regular: retreatRegular,
      priceNote: { hi: 'अर्ली-बर्ड 20 दिसंबर तक · 1 जनवरी से · 50 सीटें', en: 'Early-bird till 20 Dec · starts 1 Jan · 50 seats' },
      button: { hi: 'रिट्रीट देखिए', en: 'See the retreat' },
    },
    sessions: {
      eyebrow: { hi: 'डॉ. कपिल के साथ 1-on-1', en: '1-on-1 with Dr. Kapil' },
      title: { hi: 'पर्सनल सेशन', en: 'Personal Sessions' },
      line: { hi: 'आपकी अपनी स्थिति पर निजी काम — मन, परफ़ॉर्मेंस और आध्यात्मिक साधना (साधना सिर्फ़ 1-on-1)।', en: 'Private work on your own situation — mind, performance and spiritual practice (spiritual practices are 1-on-1 only).' },
      steps: [
        { hi: `क्लैरिटी सेशन — ${clarityPrice}, 60 मिनट`, en: `Clarity Session — ${clarityPrice}, 60 minutes` },
        { hi: 'फिर आपका प्लान: 2 दिन से 6 महीने', en: 'Then your plan: 2 days to 6 months' },
        { hi: `7 दिन में प्लान लेने पर ${clarityPrice} एडजस्ट`, en: `${clarityPrice} adjusted if you join within 7 days` },
      ],
      book: { hi: `क्लैरिटी सेशन बुक करें — ${clarityPrice}`, en: `Book Clarity Session — ${clarityPrice}` },
      button: { hi: 'सारे प्रोग्राम देखिए →', en: 'See all programs →' },
      note: { hi: 'कोचिंग और सपोर्ट — मेडिकल इलाज नहीं।', en: 'Coaching and support — not medical care.' },
    },
  },
  more: {
    heading: { hi: 'और भी', en: 'More ways to join' },
    items: [
      { id: 'telepathy', title: { hi: 'टेलीपैथी और इनट्यूशन वर्कशॉप', en: 'Telepathy & Intuition Workshop' }, line: { hi: '3 लाइव शाम, ऑनलाइन · हर महीने', en: '3 live evenings online · every month' }, price: '₹999', href: '/telepathy-online-workshop' },
      { id: 'rishikesh', title: { hi: 'ऋषिकेश रिट्रीट', en: 'Rishikesh Retreat' }, line: { hi: '26–29 मार्च 2027 · रहना और खाना शामिल', en: '26–29 March 2027 · stay and food included' }, price: rishikeshPrice, href: '/rishikesh-retreat' },
      { id: 'organisations', title: { hi: 'संस्थाओं के लिए', en: 'For Organisations' }, line: { hi: 'कंपनियों और स्कूलों के लिए वर्कशॉप', en: 'Workshops for companies and schools' }, price: null, href: '/corporate' },
    ] as { id: string; title: Bi; line: Bi; price: string | null; href: string }[],
  },
  // Owner (homepage upgrade, Nov 2026): one line of 4 facts under the hero.
  trust: [
    { hi: 'PhD · 15 साल प्रोफ़ेसर', en: 'PhD · 15 years professor' },
    { hi: '12+ साल माइंड कोचिंग', en: '12+ years mind coaching' },
    { hi: '500+ वर्कशॉप', en: '500+ workshops' },
    { hi: 'Solomon Daniel के पॉडकास्ट पर फ़ीचर्ड', en: "Featured on Solomon Daniel's Podcast" },
  ] as Bi[],
  howSessions: {
    heading: { hi: 'पर्सनल सेशन कैसे होते हैं', en: 'How Personal Sessions work' },
    steps: [
      {
        lead: { hi: `क्लैरिटी सेशन, ${CLARITY_SESSION.minutes} मिनट, ${clarityPrice}`, en: `Clarity Session, ${CLARITY_SESSION.minutes} min, ${clarityPrice}` },
        rest: { hi: 'अपना पैटर्न समझिए और पहला बदलाव महसूस कीजिए।', en: 'understand your pattern and feel the first shift.' },
      },
      {
        lead: { hi: 'आपका प्लान', en: 'Your plan' },
        rest: { hi: `2 दिन से 6 महीने तक; 7 दिन के भीतर प्लान चुनने पर ${clarityPrice} एडजस्ट हो जाते हैं।`, en: `from 2 days to 6 months; the ${clarityPrice} is adjusted if you choose a plan within 7 days.` },
      },
      {
        lead: { hi: '1-on-1 सेशन + हर सेशन के बाद एक मेडिटेशन रिकॉर्डिंग।', en: '1-on-1 sessions + a meditation recording after every session.' },
        rest: null,
      },
    ] as { lead: Bi; rest: Bi | null }[],
    button: { hi: `क्लैरिटी सेशन बुक करें — ${clarityPrice}`, en: `Book Clarity Session — ${clarityPrice}` },
  },
  meet: {
    heading: { hi: 'डॉ. कपिल से मिलिए', en: 'Meet Dr. Kapil' },
    lines: [
      { hi: '15 साल प्रोफ़ेसर (PhD, अंग्रेज़ी साहित्य)।', en: '15 years as a professor (PhD, English Literature).' },
      { hi: '2016: हिमालय में पूरे एक साल की साधना।', en: '2016: a full year of sadhana in the Himalayas.' },
      { hi: '2015 से: Sharp Brain; 12+ साल 1-on-1 माइंड कोचिंग।', en: 'Since 2015: Sharp Brain; 12+ years of 1-on-1 mind coaching.' },
    ] as Bi[],
    story: { hi: 'मेरी कहानी →', en: 'My story →' },
  },
  finalCta: {
    // Owner's heading is Hindi; the English page shows the same line in English.
    heading: { hi: 'आपका पहला कदम आज।', en: 'Your first step, today.' },
    clarity: { hi: `क्लैरिटी सेशन बुक करें — ${clarityPrice}`, en: `Book Clarity Session — ${clarityPrice}` },
    sharpBrain: { hi: 'Sharp Brain देखिए', en: 'Explore Sharp Brain' },
    retreat: { hi: 'ऑनलाइन रिट्रीट देखिए', en: 'See the Online Retreat' },
  },
  reviews: {
    heading: { hi: 'Sharp Brain — विद्यार्थियों के अपने शब्दों में', en: "Sharp Brain — in students' own words" },
    sessionsHeading: { hi: 'पर्सनल सेशन — क्लाइंट्स के अपने शब्दों में', en: "Personal Sessions — in clients' own words" },
    more: { hi: 'सारे रिव्यू देखिए →', en: 'See all reviews →' },
  },
  // Owner (schools page brief, 15 Nov 2026): a "For Schools" card on the home page.
  schools: {
    eyebrow: { hi: 'स्कूलों के लिए', en: 'For Schools' },
    lead: { hi: 'Principal या school management में हैं?', en: 'Principal or school management?' },
    body: {
      hi: 'EEG Brain & Focus Assessment से अपने students का focus, memory और reading speed देखिए, और 30 दिन में बढ़ाइए। एक class के लिए pilot मुफ़्त।',
      en: "See your students' focus, memory and reading speed with an EEG Brain & Focus Assessment, and grow them in 30 days. The pilot for one class is free.",
    },
    button: { hi: 'Sharp Brain for Schools देखिए', en: 'See Sharp Brain for Schools' },
  },
  franchise: {
    lead: { hi: 'टीचर, ट्यूशन या एजुप्रेन्योर हैं?', en: 'Teacher, tutor or edupreneur?' },
    body: { hi: 'अपने इलाके में Sharp Brain चलाइए — ट्रेनिंग, ऐप, डैशबोर्ड और मार्केटिंग किट के साथ।', en: 'Bring Sharp Brain to your area — with training, the app, a dashboard and a marketing kit.' },
    button: { hi: 'पार्टनर बनिए', en: 'Become a Partner' },
  },
} satisfies Record<string, unknown>

/** Personal Sessions review Shorts for the homepage row (from the reviews data: mind, meditation, telepathy — no Sharp Brain). */
export const HOME_SESSION_REVIEW_IDS: readonly string[] = ['otIFQVpc-RQ', 'SPD1x72viiU', 'QjoJl5R0bBk', '4Qiz0rkpTwc', 'VA_IKWt4f2g', 'Nji0LLBwhtc', 'QwMZfl9jLvA']

export type HomeLang = 'hi' | 'en'

export const say = (text: Bi, lang: HomeLang): string => text[lang]

/** Sharp Brain in the visitor's language (Hindi version at ?lang=hi). */
export function sharpBrainHref(lang: HomeLang, hash = ''): string {
  return lang === 'hi' ? `/programs/sharp-brain?lang=hi${hash}` : `/programs/sharp-brain${hash}`
}
