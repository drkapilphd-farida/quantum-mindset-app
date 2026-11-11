import { CLARITY_SESSION, EXPERIENCE_LINE, SHARP_BRAIN_PRICES } from '@/config/site.config'

// Homepage wording for `/` (English) and `/hi` (Hindi).
// Nov 2026 (owner): the business focus is (1) Sharp Brain with two offers —
// Self-paced and Live batch — and (2) 1-on-1 Personal Sessions. The
// telepathy workshop is on hold and is not on the homepage. Lines reuse the
// approved Sharp Brain (Phase 6B) and Personal Sessions wording.

type Bi = { hi: string; en: string }

const inr = (n: number): string => `₹${n.toLocaleString('en-IN')}`
const selfPacedPrice = inr(SHARP_BRAIN_PRICES.selfPacedInr)
const livePrice = inr(SHARP_BRAIN_PRICES.liveInr)
const clarityPrice = inr(CLARITY_SESSION.priceInr)

export const homeV2 = {
  meta: {
    title: {
      hi: 'Sharp Brain और डॉ. कपिल के साथ पर्सनल सेशन | मन उर मन',
      en: 'Sharp Brain & Personal Sessions with Dr. Kapil Dev Sharma | Mind Ur Mind',
    },
    description: {
      hi: `Sharp Brain — पढ़ने की रफ़्तार, ध्यान और याददाश्त, 30 दिन में, नाप कर (सेल्फ़-पेस्ड ${selfPacedPrice} · लाइव बैच ${livePrice})। और डॉ. कपिल देव शर्मा के साथ 1-on-1 पर्सनल सेशन।`,
      en: `Sharp Brain — reading speed, focus and memory in 30 days, measured (Self-paced ${selfPacedPrice} · Live batch ${livePrice}). And 1-on-1 Personal Sessions with Dr. Kapil Dev Sharma.`,
    },
  },
  hero: {
    strip: { hi: `डॉ. कपिल देव शर्मा · ${EXPERIENCE_LINE.hi}`, en: `Dr. Kapil Dev Sharma · ${EXPERIENCE_LINE.en}` },
    h1: { hi: 'तेज़ दिमाग़। शांत मन।', en: 'A sharper brain. A calmer mind.' },
    sub: {
      hi: 'Sharp Brain — पढ़ने की रफ़्तार, ध्यान और याददाश्त, 30 दिन में, नाप कर। और डॉ. कपिल के साथ 1-on-1 पर्सनल सेशन — मन, परफ़ॉर्मेंस और साधना के लिए।',
      en: 'Sharp Brain — reading speed, focus and memory in 30 days, measured. And 1-on-1 Personal Sessions with Dr. Kapil — for your mind, your performance and your practice.',
    },
    ctaPrimary: { hi: 'Sharp Brain देखिए', en: 'Explore Sharp Brain' },
    ctaSecondary: { hi: 'पर्सनल सेशन', en: 'Personal Sessions' },
    smallLine: { hi: `सेल्फ़-पेस्ड ${selfPacedPrice} · लाइव बैच ${livePrice}`, en: `Self-paced ${selfPacedPrice} · Live batch ${livePrice}` },
  },
  paths: {
    heading: { hi: 'आप किसके लिए आए हैं?', en: 'What are you here for?' },
    sharpBrain: {
      eyebrow: { hi: 'पढ़ाई और काम के लिए', en: 'For study and work' },
      title: { hi: 'Sharp Brain — 30 दिन, नाप कर', en: 'Sharp Brain — 30 days, measured' },
      points: [
        { hi: 'ऐप पर रोज़ 10–15 मिनट अभ्यास', en: '10–15 minutes of app practice a day' },
        { hi: 'Day 1 / Day 30 टेस्ट + सर्टिफ़िकेट', en: 'Day 1 / Day 30 test + certificate' },
        { hi: 'सातों क्लास — सेल्फ़-पेस्ड में रिकॉर्डेड, लाइव बैच में लाइव', en: 'The 7 classes — recorded in Self-paced, live in the Live batch' },
      ],
      prices: [
        { label: { hi: 'सेल्फ़-पेस्ड', en: 'Self-paced' }, price: selfPacedPrice },
        { label: { hi: 'लाइव बैच', en: 'Live batch' }, price: livePrice },
      ],
      button: { hi: 'Sharp Brain देखिए', en: 'See Sharp Brain' },
      test: { hi: 'मुफ़्त Reading & Memory Test →', en: 'Free Reading & Memory Test →' },
    },
    sessions: {
      eyebrow: { hi: 'डॉ. कपिल के साथ 1-on-1', en: '1-on-1 with Dr. Kapil' },
      title: { hi: 'पर्सनल सेशन', en: 'Personal Sessions' },
      // Owner (plans brief, Nov 2026): the main program first, before the groups.
      first: { hi: 'तनाव, एंग्ज़ायटी, पैनिक और डिप्रेशन सपोर्ट →', en: 'Stress, Anxiety, Panic & Depression Support →' },
      groups: [
        { title: { hi: 'मन और भावनाएँ', en: 'Mind & emotions' }, topics: { hi: 'तनाव, एंग्ज़ायटी, पैनिक, माइंडसेट कोचिंग, सबकॉन्शियस रीप्रोग्रामिंग', en: 'Stress, anxiety, panic, mindset coaching, subconscious reprogramming' } },
        { title: { hi: 'परफ़ॉर्मेंस', en: 'Performance' }, topics: { hi: 'ट्रेडर्स के लिए इनट्यूशन ट्रेनिंग, डर के लिए हार्ट-ब्रेन कोहेरेंस', en: 'Intuition training for traders, heart-brain coherence for fear' } },
        { title: { hi: 'आध्यात्मिक साधना (सिर्फ़ 1-on-1)', en: 'Spiritual practices (1-on-1 only)' }, topics: { hi: 'टेलीपैथी और इनट्यूशन, ऑरा रीडिंग, चक्र एक्टिवेशन, समाधि मेडिटेशन, कुंडलिनी मेडिटेशन, एस्ट्रल प्रोजेक्शन', en: 'Telepathy & intuition, aura reading, chakra activation, samadhi meditation, kundalini meditation, astral projection' } },
      ],
      button: { hi: 'सारे प्रोग्राम देखिए →', en: 'See all programs →' },
      price: { hi: `क्लैरिटी सेशन — ₹${CLARITY_SESSION.priceInr.toLocaleString('en-IN')} (${CLARITY_SESSION.minutes} मिनट)`, en: `Clarity Session — ₹${CLARITY_SESSION.priceInr.toLocaleString('en-IN')} (${CLARITY_SESSION.minutes} minutes)` },
      note: { hi: 'कोचिंग और सपोर्ट — मेडिकल इलाज नहीं।', en: 'Coaching and support — not medical care.' },
    },
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
  },
  reviews: {
    heading: { hi: 'Sharp Brain — विद्यार्थियों के अपने शब्दों में', en: "Sharp Brain — in students' own words" },
    sessionsHeading: { hi: 'पर्सनल सेशन — क्लाइंट्स के अपने शब्दों में', en: "Personal Sessions — in clients' own words" },
    more: { hi: 'सारे रिव्यू देखिए →', en: 'See all reviews →' },
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
