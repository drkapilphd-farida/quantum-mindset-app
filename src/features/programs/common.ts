import { CLARITY_SESSION, EXPERIENCE_LINE } from '@/config/site.config'
import type { Bi, GroupId, ProgramLang } from './types'

// Shared tokens and shared copy blocks for the hub and the 15 program pages.
// English word for word from the owner's approved copy ("Personal Sessions —
// website copy", Nov 8 2026); Hindi pending the owner's approval.

export const TOKENS = {
  navy: '#0E1B2C',
  navyCard: '#16263D',
  navyBorder: '#2C3D57',
  amber: '#F2A93B',
  amberHover: '#E39A2A',
  blue: '#1F3A8A',
  page: '#FBFAF7',
  quizBand: '#EEF2FB',
  cardBorder: '#E3E6EC',
  text: '#0E1B2C',
  muted: '#4A5568',
} as const

export const GROUPS: Record<GroupId, { label: Bi; tagBg: string; tagFg: string; border: string }> = {
  mind: { label: { en: 'Mind & emotions', hi: 'मन और भावनाएँ' }, tagBg: '#DDF3EF', tagFg: '#0B5E57', border: '#0F766E' },
  rel: { label: { en: 'Relationships & intention', hi: 'रिश्ते और इरादा' }, tagBg: '#FBE2EE', tagFg: '#9D174D', border: '#BE185D' },
  perf: { label: { en: 'Performance', hi: 'परफ़ॉर्मेंस' }, tagBg: '#DEE7FB', tagFg: '#1E40AF', border: '#1D4ED8' },
  spirit: { label: { en: 'Spiritual · Kriya Yoga', hi: 'आध्यात्मिक · क्रिया योग' }, tagBg: '#EAE1FB', tagFg: '#5B21B6', border: '#6D28D9' },
  deep: { label: { en: 'Deep experience', hi: 'गहरा अनुभव' }, tagBg: '#FCEBCB', tagFg: '#8A4B00', border: '#B45309' },
}

const price = `₹${CLARITY_SESSION.priceInr.toLocaleString('en-IN')}`
const minutes = CLARITY_SESSION.minutes

export const say = (text: Bi, lang: ProgramLang): string => text[lang]

/** A shared list line: bold lead (before " — ") + the rest. */
export type LeadLine = { lead: Bi; rest?: Bi }

export const COMMON = {
  price,
  minutes,
  bookButton: { en: `Book a Clarity Session — ${price}`, hi: `क्लैरिटी सेशन बुक करें — ${price}` },
  watchButton: { en: 'Watch experiences ↓', hi: 'अनुभव देखें ↓' },
  experience: EXPERIENCE_LINE,
  only1on1: { en: '1-on-1 only', hi: 'सिर्फ़ 1-on-1' },
  afterFoundation: { en: 'After foundation level', hi: 'फ़ाउंडेशन लेवल के बाद' },
  breadcrumbHub: { en: 'Personal Sessions', hi: 'पर्सनल सेशन' },
  soundLikeHeading: { en: 'Does this sound like you?', hi: 'क्या यह आपकी बात है?' },
  whyHeading: { en: 'Why this happens', hi: 'ऐसा क्यों होता है' },
  changesHeading: { en: 'What changes for you', hi: 'आपके लिए क्या बदलता है' },
  quoteBy: { en: '— Dr. Kapil Dev Sharma', hi: '— डॉ. कपिल देव शर्मा' },
  reviewsHeading: { en: 'What participants experienced', hi: 'प्रतिभागियों के अनुभव' },
  faqHeading: (topic: Bi): Bi => ({ en: `Questions about ${topic.en}`, hi: `${topic.hi} के बारे में सवाल` }),
  relatedHeading: { en: 'Often taken together', hi: 'इसके साथ अक्सर लिया जाता है' },
  learnMore: { en: 'Learn more →', hi: 'और जानिए →' },
  playVideo: { en: 'Play video', hi: 'वीडियो चलाएँ' },
  sticky: { en: `Book a Clarity Session — ${price}`, hi: `क्लैरिटी सेशन बुक करें — ${price}` },
  photoAlt: { en: 'Dr. Kapil Dev Sharma', hi: 'डॉ. कपिल देव शर्मा' },
} as const

/** Shared block: What you get. */
export const WHAT_YOU_GET = {
  heading: { en: 'What you get', hi: 'आपको क्या मिलता है' },
  items: [
    {
      lead: { en: 'Live 1-on-1 sessions with Dr. Kapil', hi: 'डॉ. कपिल के साथ लाइव 1-on-1 सेशन' },
      rest: { en: 'online, or in person in Vadodara', hi: 'ऑनलाइन, या वडोदरा में आमने-सामने' },
    },
    {
      lead: { en: 'Your personal meditation / therapy session recordings', hi: 'आपके अपने मेडिटेशन / थेरेपी सेशन की रिकॉर्डिंग' },
      rest: { en: 'recorded for you, live, during your sessions', hi: 'आपके लिए, आपके सेशन के दौरान लाइव रिकॉर्ड की गई' },
    },
    { lead: { en: 'A daily practice plan made for your goal', hi: 'आपके लक्ष्य के लिए बना रोज़ का अभ्यास प्लान' } },
    { lead: { en: 'WhatsApp support between sessions', hi: 'सेशन के बीच WhatsApp पर सपोर्ट' } },
    { lead: { en: 'Progress review and a clear next step', hi: 'प्रगति की समीक्षा और साफ़ अगला कदम' } },
  ] as LeadLine[],
  highlight: {
    en: 'Meditation and therapy sessions made only for you. These are not ready-made audios. In your sessions, Dr. Kapil writes and records guided meditation and therapy sessions for your goal, your words and your pace. They are yours to keep and use for life — on a hard day, before sleep, before an important moment.',
    hi: 'मेडिटेशन और थेरेपी सेशन, सिर्फ़ आपके लिए बने। ये पहले से बने ऑडियो नहीं हैं। आपके सेशन में डॉ. कपिल आपके लक्ष्य, आपके शब्दों और आपकी गति के हिसाब से गाइडेड मेडिटेशन और थेरेपी सेशन लिखते और रिकॉर्ड करते हैं। ये हमेशा के लिए आपके हैं — किसी मुश्किल दिन, सोने से पहले, किसी ज़रूरी पल से पहले।',
  },
} as const

/** Shared block: Your journey. */
export const JOURNEY = {
  heading: { en: 'Your journey', hi: 'आपका सफ़र' },
  steps: [
    {
      lead: { en: `Clarity Session (${minutes} min)`, hi: `क्लैरिटी सेशन (${minutes} मिनट)` },
      rest: { en: 'we understand what you want to change, and why', hi: 'हम समझते हैं कि आप क्या बदलना चाहते हैं, और क्यों' },
    },
    {
      lead: { en: 'Your personal plan', hi: 'आपका पर्सनल प्लान' },
      rest: { en: 'the right practices and package, only for you', hi: 'सही अभ्यास और पैकेज, सिर्फ़ आपके लिए' },
    },
    {
      lead: { en: 'Guided 1-on-1 sessions', hi: 'मार्गदर्शित 1-on-1 सेशन' },
      rest: { en: 'with your personal meditations recorded live', hi: 'आपके अपने मेडिटेशन लाइव रिकॉर्ड होते हुए' },
    },
    {
      lead: { en: 'Daily practice', hi: 'रोज़ का अभ्यास' },
      rest: { en: 'with your recordings and WhatsApp support', hi: 'आपकी रिकॉर्डिंग और WhatsApp सपोर्ट के साथ' },
    },
    {
      lead: { en: 'Review and next level', hi: 'समीक्षा और अगला लेवल' },
      rest: { en: 'we look at your progress and decide the next step together', hi: 'हम आपकी प्रगति देखते हैं और साथ मिलकर अगला कदम तय करते हैं' },
    },
  ] as LeadLine[],
} as const

/** Shared block: Quote band. */
export const QUOTE: Bi = {
  en: '“Two people may come to learn the same thing for two different reasons. So I teach each person differently — for their own life.”',
  hi: '“दो लोग एक ही चीज़ दो अलग-अलग वजहों से सीखने आ सकते हैं। इसलिए मैं हर व्यक्ति को अलग तरह से सिखाता हूँ — उसकी अपनी ज़िंदगी के लिए।”',
}

/** Shared block: Clarity Session card. */
export const CLARITY_CARD = {
  eyebrow: { en: 'START HERE', hi: 'यहाँ से शुरू कीजिए' },
  title: { en: 'Clarity Session', hi: 'क्लैरिटी सेशन' },
  price: { en: `${price} · ${minutes} minutes`, hi: `${price} · ${minutes} मिनट` },
  ticks: [
    { en: 'A deep, private conversation about what you want to change', hi: 'आप क्या बदलना चाहते हैं, इस पर एक गहरी, निजी बातचीत' },
    { en: 'Your personal plan and the right package', hi: 'आपका पर्सनल प्लान और सही पैकेज' },
    { en: 'Your first personal meditation / therapy session, recorded for you', hi: 'आपका पहला पर्सनल मेडिटेशन / थेरेपी सेशन, आपके लिए रिकॉर्ड किया गया' },
  ] as Bi[],
  note: { en: 'Fully adjusted in your fee if you join a program within 7 days.', hi: 'अगर आप 7 दिन के भीतर कोई प्रोग्राम जॉइन करते हैं, तो यह रक़म आपकी फ़ीस में पूरी तरह एडजस्ट हो जाती है।' },
  button: { en: 'Book my Clarity Session', hi: 'मेरा क्लैरिटी सेशन बुक करें' },
} as const

/** Required disclaimers (small paragraph under the FAQ). */
export const DISCLAIMERS = {
  mind: {
    en: 'This is coaching and mind training, not medical treatment. If you are in serious distress or have thoughts of harming yourself, please contact a doctor or a mental health professional immediately.',
    hi: 'यह कोचिंग और मन की ट्रेनिंग है, मेडिकल इलाज नहीं। अगर आप गहरे तनाव में हैं या ख़ुद को नुकसान पहुँचाने के विचार आ रहे हैं, तो कृपया तुरंत किसी डॉक्टर या मानसिक स्वास्थ्य विशेषज्ञ से संपर्क करें।',
  },
  traders: {
    en: 'Mind and intuition training only. This is not financial or investment advice.',
    hi: 'यह सिर्फ़ मन और इनट्यूशन की ट्रेनिंग है। यह वित्तीय या निवेश सलाह नहीं है।',
  },
  foundation: {
    en: 'Taught only after the foundation level, with personal guidance at every step. Please tell Dr. Kapil about any health conditions before you start.',
    hi: 'सिर्फ़ फ़ाउंडेशन लेवल के बाद, हर कदम पर व्यक्तिगत मार्गदर्शन के साथ सिखाया जाता है। शुरू करने से पहले अपनी किसी भी स्वास्थ्य समस्या के बारे में डॉ. कपिल को ज़रूर बताएँ।',
  },
} as const

export function seoTitle(en: string, hi: string): Bi {
  return { en: `${en} | Mind Ur Mind`, hi: `${hi} | मन उर मन` }
}
