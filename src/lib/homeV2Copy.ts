import { SHARP_BRAIN_PRICES } from '@/config/site.config'

// Homepage wording for `/` (English) and `/hi` (Hindi).
// Nov 2026 (owner): the business focus is (1) Sharp Brain with two offers —
// Self-paced and Live batch — and (2) 1-on-1 Personal Sessions. The
// telepathy workshop is on hold and is not on the homepage. Lines reuse the
// approved Sharp Brain (Phase 6B) and Personal Sessions wording.

type Bi = { hi: string; en: string }

const inr = (n: number): string => `₹${n.toLocaleString('en-IN')}`
const selfPacedPrice = inr(SHARP_BRAIN_PRICES.selfPacedInr)
const livePrice = inr(SHARP_BRAIN_PRICES.liveInr)

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
    strip: { hi: 'डॉ. कपिल देव शर्मा · 12 साल से माइंड ट्रेनिंग', en: 'Dr. Kapil Dev Sharma · 12 years of mind training' },
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
      groups: [
        { title: { hi: 'मन और भावनाएँ', en: 'Mind & emotions' }, topics: { hi: 'तनाव, एंग्ज़ायटी, पैनिक, माइंडसेट कोचिंग, सबकॉन्शियस रीप्रोग्रामिंग', en: 'Stress, anxiety, panic, mindset coaching, subconscious reprogramming' } },
        { title: { hi: 'परफ़ॉर्मेंस', en: 'Performance' }, topics: { hi: 'ट्रेडर्स के लिए इनट्यूशन ट्रेनिंग, डर के लिए हार्ट-ब्रेन कोहेरेंस', en: 'Intuition training for traders, heart-brain coherence for fear' } },
        { title: { hi: 'आध्यात्मिक साधना (सिर्फ़ 1-on-1)', en: 'Spiritual practices (1-on-1 only)' }, topics: { hi: 'ऑरा रीडिंग, चक्र एक्टिवेशन, समाधि मेडिटेशन, कुंडलिनी मेडिटेशन, एस्ट्रल प्रोजेक्शन', en: 'Aura reading, chakra activation, samadhi meditation, kundalini meditation, astral projection' } },
      ],
      button: { hi: 'पर्सनल सेशन देखिए', en: 'See Personal Sessions' },
      note: { hi: 'कोचिंग और सपोर्ट — मेडिकल इलाज नहीं।', en: 'Coaching and support — not medical care.' },
    },
  },
  reviews: {
    heading: { hi: 'Sharp Brain — विद्यार्थियों के अपने शब्दों में', en: "Sharp Brain — in students' own words" },
    more: { hi: 'सारे रिव्यू देखिए →', en: 'See all reviews →' },
  },
  franchise: {
    lead: { hi: 'टीचर, ट्यूशन या एजुप्रेन्योर हैं?', en: 'Teacher, tutor or edupreneur?' },
    body: { hi: 'अपने इलाके में Sharp Brain चलाइए — ट्रेनिंग, ऐप, डैशबोर्ड और मार्केटिंग किट के साथ।', en: 'Bring Sharp Brain to your area — with training, the app, a dashboard and a marketing kit.' },
    button: { hi: 'पार्टनर बनिए', en: 'Become a Partner' },
  },
} satisfies Record<string, unknown>

export type HomeLang = 'hi' | 'en'

export const say = (text: Bi, lang: HomeLang): string => text[lang]

/** Sharp Brain in the visitor's language (Hindi version at ?lang=hi). */
export function sharpBrainHref(lang: HomeLang, hash = ''): string {
  return lang === 'hi' ? `/programs/sharp-brain?lang=hi${hash}` : `/programs/sharp-brain${hash}`
}
