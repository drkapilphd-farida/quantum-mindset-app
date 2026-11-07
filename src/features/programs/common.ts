import { CLARITY_SESSION, EXPERIENCE_LINE } from '@/config/site.config'
import type { Bi, GroupId, ProgramLang } from './types'

// Shared tokens and wording for the hub and the 15 program pages — exactly
// as in the owner's strict design brief (Nov 2026).

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

export const say = (text: Bi, lang: ProgramLang): string => text[lang]

export const COMMON = {
  price,
  minutes: CLARITY_SESSION.minutes,
  bookButton: { en: `Book a Clarity Session — ${price}`, hi: `क्लैरिटी सेशन बुक करें — ${price}` },
  watchButton: { en: 'Watch experiences ↓', hi: 'अनुभव देखें ↓' },
  experience: EXPERIENCE_LINE,
  only1on1: { en: '1-on-1 only', hi: 'सिर्फ़ 1-on-1' },
  breadcrumbHub: { en: 'Personal Sessions', hi: 'पर्सनल सेशन' },
  usedForHeading: { en: 'What people use it for', hi: 'लोग इसे किसलिए सीखते हैं' },
  whoHeading: { en: 'Who it is for', hi: 'यह किसके लिए है' },
  howTeaches: { en: 'How Dr. Kapil teaches it', hi: 'डॉ. कपिल इसे कैसे सिखाते हैं' },
  howWorks: { en: 'How Dr. Kapil works with you', hi: 'डॉ. कपिल आपके साथ कैसे काम करते हैं' },
  quoteBy: { en: '— Dr. Kapil Dev Sharma', hi: '— डॉ. कपिल देव शर्मा' },
  reviewsHeading: { en: 'What participants experienced', hi: 'प्रतिभागियों के अनुभव' },
  bandTitle: { en: 'Start with a Clarity Session', hi: 'क्लैरिटी सेशन से शुरुआत कीजिए' },
  bandLine: {
    en: `${CLARITY_SESSION.minutes} minutes · ${price} · your reason, your plan, your first practice.`,
    hi: `${CLARITY_SESSION.minutes} मिनट · ${price} · आपकी वजह, आपका प्लान, आपका पहला अभ्यास।`,
  },
  bandButton: { en: 'Book my Clarity Session', hi: 'मेरा क्लैरिटी सेशन बुक करें' },
  faqHeading: (topic: Bi): Bi => ({ en: `Questions about ${topic.en}`, hi: `${topic.hi} के बारे में सवाल` }),
  relatedHeading: { en: 'Often taken together', hi: 'इसके साथ अक्सर लिया जाता है' },
  learnMore: { en: 'Learn more →', hi: 'और जानिए →' },
  playVideo: { en: 'Play video', hi: 'वीडियो चलाएँ' },
  sticky: { en: `Book a Clarity Session — ${price}`, hi: `क्लैरिटी सेशन बुक करें — ${price}` },
  photoAlt: { en: 'Dr. Kapil Dev Sharma', hi: 'डॉ. कपिल देव शर्मा' },
  disclaimers: {
    mind: {
      en: 'This is not medical treatment. If you are in serious distress or have thoughts of harming yourself, please contact a doctor or a mental health professional immediately.',
      hi: 'यह मेडिकल इलाज नहीं है। अगर आप गहरे तनाव में हैं या ख़ुद को नुकसान पहुँचाने के विचार आ रहे हैं, तो कृपया तुरंत किसी डॉक्टर या मानसिक स्वास्थ्य विशेषज्ञ से संपर्क करें।',
    },
    traders: {
      en: 'Mind and intuition training only. This is not financial or investment advice.',
      hi: 'यह सिर्फ़ मन और इनट्यूशन की ट्रेनिंग है। यह वित्तीय या निवेश सलाह नहीं है।',
    },
  },
} as const

/** Quote: the topic version, or the mind-pages version. */
export function topicQuote(topic: Bi): Bi {
  return {
    en: `“Two people may come to learn ${topic.en} for two different reasons. So I teach each person differently — for their own life.”`,
    hi: `“दो लोग ${topic.hi} दो अलग-अलग वजहों से सीखने आ सकते हैं। इसलिए मैं हर व्यक्ति को अलग तरह से सिखाता हूँ — उसकी अपनी ज़िंदगी के लिए।”`,
  }
}

export const MIND_QUOTE: Bi = {
  en: '“Two people may come with the same problem for two different reasons. So I work with each person differently — for their own life.”',
  hi: '“दो लोग एक ही समस्या के साथ, दो अलग-अलग वजहों से आ सकते हैं। इसलिए मैं हर व्यक्ति के साथ अलग तरह से काम करता हूँ — उसकी अपनी ज़िंदगी के लिए।”',
}

// Shared FAQ answers used on several pages (approved text).
export const FAQ_LENGTH: { q: Bi; a: Bi } = {
  q: { en: 'How long does it take?', hi: 'इसमें कितना समय लगता है?' },
  a: {
    en: 'It depends on your reason and your daily practice. Your plan and its length are decided in the Clarity Session.',
    hi: 'यह आपकी वजह और रोज़ के अभ्यास पर निर्भर है। आपका प्लान और उसकी अवधि क्लैरिटी सेशन में तय होती है।',
  },
}
export const FAQ_LENGTH_MIND: { q: Bi; a: Bi } = {
  q: { en: 'How long does it take?', hi: 'इसमें कितना समय लगता है?' },
  a: {
    en: 'It depends on your situation. Your plan and its length are decided in the Clarity Session.',
    hi: 'यह आपकी स्थिति पर निर्भर है। आपका प्लान और उसकी अवधि क्लैरिटी सेशन में तय होती है।',
  },
}
export const FAQ_ONLINE: { q: Bi; a: Bi } = {
  q: { en: 'Is it taught online?', hi: 'क्या यह ऑनलाइन सिखाया जाता है?' },
  a: { en: 'Yes, online or in person in Vadodara, always 1-on-1.', hi: 'हाँ, ऑनलाइन या वडोदरा में आमने-सामने, हमेशा 1-on-1।' },
}
export const FAQ_ONLINE_MIND: { q: Bi; a: Bi } = {
  q: { en: 'Is it online?', hi: 'क्या यह ऑनलाइन है?' },
  a: { en: 'Yes, online or in person in Vadodara, always 1-on-1.', hi: 'हाँ, ऑनलाइन या वडोदरा में आमने-सामने, हमेशा 1-on-1।' },
}

// Shared list items / steps (approved text).
export const WHO_NO_EXPERIENCE: Bi = { en: 'No experience needed — you start with the foundation', hi: 'कोई अनुभव ज़रूरी नहीं — शुरुआत फ़ाउंडेशन से होती है' }
export const WHO_SEEKERS: Bi = { en: 'Seekers who want a real, guided spiritual practice', hi: 'वे साधक जो सच्चा, मार्गदर्शन वाला आध्यात्मिक अभ्यास चाहते हैं' }
export const WHO_PERSONAL_COACHING: Bi = { en: 'Anyone who wants personal coaching, not a fixed course', hi: 'जो तय कोर्स नहीं, व्यक्तिगत कोचिंग चाहता है' }
export const WHO_AFTER_FOUNDATION: Bi = { en: 'Taught only after the foundation level', hi: 'सिर्फ़ फ़ाउंडेशन लेवल के बाद सिखाया जाता है' }
export const WHO_COMMITTED: Bi = { en: 'Those ready for a committed daily practice', hi: 'जो रोज़ के समर्पित अभ्यास के लिए तैयार हैं' }

export const STEP_KRIYA = {
  lead: { en: 'Kriya Yoga and prana.', hi: 'क्रिया योग और प्राण।' },
  rest: { en: 'Practices that move and steady your prana.', hi: 'ऐसे अभ्यास जो आपके प्राण को चलाते और स्थिर करते हैं।' },
}
export const STEP_DAILY = {
  lead: { en: 'Daily guided practice,', hi: 'रोज़ का मार्गदर्शित अभ्यास,' },
  rest: { en: 'with follow-up until it becomes your own.', hi: 'फ़ॉलो-अप के साथ, जब तक यह आपका अपना न हो जाए।' },
}
export const STEP_APPROACH = {
  lead: { en: 'An approach chosen for you.', hi: 'आपके लिए चुना गया तरीका।' },
  rest: { en: 'The approach that fits you best.', hi: 'वही तरीका जो आपके लिए सबसे सही हो।' },
}
export const STEP_REGULAR = {
  lead: { en: 'Regular sessions,', hi: 'नियमित सेशन,' },
  rest: { en: 'with follow-up as you go.', hi: 'आगे बढ़ते हुए फ़ॉलो-अप के साथ।' },
}

export function reasonFirst(question: Bi): { lead: Bi; rest: Bi } {
  return {
    lead: { en: 'Your reason first.', hi: 'पहले आपकी वजह।' },
    rest: { en: `${question.en} Your answer shapes everything.`, hi: `${question.hi} आपका जवाब ही सब तय करता है।` },
  }
}
export function situationFirst(question: Bi): { lead: Bi; rest: Bi } {
  return {
    lead: { en: 'Your situation first.', hi: 'पहले आपकी स्थिति।' },
    rest: { en: `${question.en} Your answer shapes everything.`, hi: `${question.hi} आपका जवाब ही सब तय करता है।` },
  }
}
export function foundationFirst(name: Bi): { lead: Bi; rest: Bi } {
  return {
    lead: { en: 'The foundation level first.', hi: 'पहले फ़ाउंडेशन लेवल।' },
    rest: { en: `${name.en} is taught only after it.`, hi: `${name.hi} उसके बाद ही सिखाया जाता है।` },
  }
}

export function seoTitle(en: string, hi: string): Bi {
  return { en: `${en} | Mind Ur Mind`, hi: `${hi} | मन उर मन` }
}
