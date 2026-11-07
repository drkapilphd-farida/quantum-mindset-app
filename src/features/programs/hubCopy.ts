import { COMMON } from './common'
import type { Bi, GroupId, ProgramSlug } from './types'

// /personal-sessions hub — English exactly as in the owner's design file
// (design-personal-sessions-hub.html), Hindi as approved (Nov 2026).

export type ChipId = GroupId | 'all'
export type Q1 = 'mind' | 'rel' | 'perf' | 'spirit'
export type Q2 = 'change' | 'learn'

/** Quiz result: exactly the owner's mapping. The first program is pre-selected in the form. */
export const QUIZ_RESULTS: Record<`${Q1}-${Q2}`, [ProgramSlug, ProgramSlug]> = {
  'mind-change': ['stress-anxiety-support', 'subconscious-reprogramming'],
  'mind-learn': ['mindset-coaching', 'heart-brain-coherence'],
  'rel-change': ['heart-brain-coherence', 'telepathy'],
  'rel-learn': ['telepathy', 'manifestation'],
  'perf-change': ['intuition-for-traders', 'heart-brain-coherence'],
  'perf-learn': ['intuition-for-traders', 'heart-brain-coherence'],
  'spirit-change': ['cosmic-fusion', 'chakra-activation'],
  'spirit-learn': ['aura-reading', 'telepathy'],
}

/** Names as the quiz result shows them ("Aura Reading", not the full card name). */
export const QUIZ_NAMES: Partial<Record<ProgramSlug, Bi>> = {
  'aura-reading': { en: 'Aura Reading', hi: 'ऑरा रीडिंग' },
}

export const HUB = {
  meta: {
    title: {
      en: 'Personal Sessions with Dr. Kapil Dev Sharma — 1-on-1 Coaching & Spiritual Practice | Mind Ur Mind',
      hi: 'डॉ. कपिल देव शर्मा के साथ पर्सनल सेशन — 1-on-1 कोचिंग और आध्यात्मिक साधना | मन उर मन',
    },
    description: {
      en: 'Mind and emotions, relationships, trading decisions or a deep spiritual practice — 1-on-1 with Dr. Kapil Dev Sharma, online or in person. Start with a Clarity Session (₹2,100, 75 minutes).',
      hi: 'मन और भावनाएँ, रिश्ते, ट्रेडिंग के फ़ैसले या गहरी आध्यात्मिक साधना — डॉ. कपिल देव शर्मा के साथ 1-on-1, ऑनलाइन या आमने-सामने। क्लैरिटी सेशन (₹2,100, 75 मिनट) से शुरुआत करें।',
    },
  },
  hero: {
    eyebrow: { en: '1-ON-1 WITH DR. KAPIL DEV SHARMA', hi: 'डॉ. कपिल देव शर्मा के साथ 1-on-1' },
    h1a: { en: 'Your problem is personal.', hi: 'आपकी समस्या आपकी अपनी है।' },
    h1b: { en: 'Your path should be too.', hi: 'आपका रास्ता भी आपका अपना होना चाहिए।' },
    sub: {
      en: 'Mind and emotions, relationships, trading decisions or a deep spiritual practice — every session is built around you, your reason and your pace. Online or in person.',
      hi: 'मन और भावनाएँ, रिश्ते, ट्रेडिंग के फ़ैसले या गहरी आध्यात्मिक साधना — हर सेशन आपके, आपकी वजह और आपकी गति के हिसाब से बनता है। ऑनलाइन या आमने-सामने।',
    },
    book: COMMON.bookButton,
    quiz: { en: 'Find my path in 30 seconds', hi: '30 सेकंड में अपना रास्ता जानिए' },
    videoTitle: { en: 'How a personal session works', hi: 'पर्सनल सेशन कैसे होता है' },
    videoAria: { en: "Play Dr. Kapil's introduction video", hi: 'डॉ. कपिल का परिचय वीडियो चलाएँ' },
    stats: [
      { value: { en: '12+ years', hi: '12+ साल' }, label: { en: 'of mind coaching', hi: 'माइंड कोचिंग' } },
      { value: { en: '15 years', hi: '15 साल' }, label: { en: 'as a professor', hi: 'प्रोफ़ेसर' } },
      { value: { en: '500+', hi: '500+' }, label: { en: 'workshops', hi: 'वर्कशॉप' } },
      { value: { en: '10,000+', hi: '10,000+' }, label: { en: 'people trained', hi: 'प्रशिक्षित लोग' } },
    ],
  },
  programs: {
    title: { en: 'What are you here for?', hi: 'आप किसलिए आए हैं?' },
    sub: { en: 'Choose what matters to you. Every program is taught 1-on-1.', hi: 'अपने लिए जो ज़रूरी है वह चुनिए। हर प्रोग्राम 1-on-1 सिखाया जाता है।' },
    filterLabel: { en: 'Filter programs', hi: 'प्रोग्राम फ़िल्टर करें' },
    chips: [
      { id: 'all', label: { en: 'Everything', hi: 'सब कुछ' } },
      { id: 'mind', label: { en: 'Calm my mind', hi: 'मन शांत करना' } },
      { id: 'rel', label: { en: 'Relationships & intention', hi: 'रिश्ते और इरादा' } },
      { id: 'perf', label: { en: 'Trade with clarity', hi: 'साफ़ ट्रेडिंग' } },
      { id: 'spirit', label: { en: 'Grow spiritually', hi: 'आध्यात्मिक विकास' } },
      { id: 'deep', label: { en: 'A deep retreat', hi: 'गहरा रिट्रीट' } },
    ] as { id: ChipId; label: Bi }[],
  },
  quiz: {
    eyebrow: { en: 'NOT SURE WHERE TO START?', hi: 'तय नहीं कि कहाँ से शुरू करें?' },
    title: { en: 'Find your path in 30 seconds', hi: '30 सेकंड में अपना रास्ता जानिए' },
    q1: { en: '1. What do you want most right now?', hi: '1. आपको अभी सबसे ज़्यादा क्या चाहिए?' },
    q1Options: [
      { id: 'mind', label: { en: 'Peace of mind — less stress, fear or overthinking', hi: 'मन की शांति — कम तनाव, डर या ज़्यादा सोचना' } },
      { id: 'rel', label: { en: 'Better relationships and connection', hi: 'बेहतर रिश्ते और जुड़ाव' } },
      { id: 'perf', label: { en: 'Clearer decisions in trading', hi: 'ट्रेडिंग में साफ़ फ़ैसले' } },
      { id: 'spirit', label: { en: 'A deeper spiritual experience', hi: 'गहरा आध्यात्मिक अनुभव' } },
    ] as { id: Q1; label: Bi }[],
    q2: { en: '2. Which feels closer to you?', hi: '2. आपके क़रीब क्या है?' },
    q2Options: [
      { id: 'change', label: { en: 'I want to change something inside me', hi: 'मैं अपने भीतर कुछ बदलना चाहता/चाहती हूँ' } },
      { id: 'learn', label: { en: 'I want to learn a new skill', hi: 'मैं कोई नई स्किल सीखना चाहता/चाहती हूँ' } },
    ] as { id: Q2; label: Bi }[],
    resultEyebrow: { en: 'YOUR SUGGESTED PATH', hi: 'आपका सुझाया गया रास्ता' },
    resultLine: {
      en: 'In your Clarity Session, Dr. Kapil confirms this and builds your personal plan.',
      hi: 'अपने क्लैरिटी सेशन में डॉ. कपिल इसकी पुष्टि करते हैं और आपका पर्सनल प्लान बनाते हैं।',
    },
    resultButton: { en: `Book my Clarity Session — ${COMMON.price}`, hi: `मेरा क्लैरिटी सेशन बुक करें — ${COMMON.price}` },
    noResult: { en: 'Answer both questions to see your suggested path.', hi: 'अपना सुझाया गया रास्ता देखने के लिए दोनों सवालों के जवाब दीजिए।' },
  },
  how: {
    title: { en: 'How it works', hi: 'कैसे होता है' },
    steps: [
      { title: { en: 'Clarity Session', hi: 'क्लैरिटी सेशन' }, text: { en: '75 minutes, ₹2,100. We understand what you want to change, and why.', hi: '75 मिनट, ₹2,100। हम समझते हैं कि आप क्या बदलना चाहते हैं, और क्यों।' } },
      { title: { en: 'Your personal plan', hi: 'आपका पर्सनल प्लान' }, text: { en: 'The right practices and the right package, chosen only for you.', hi: 'सही अभ्यास और सही पैकेज, सिर्फ़ आपके लिए चुने गए।' } },
      { title: { en: 'Daily practice, guided', hi: 'रोज़ का अभ्यास, मार्गदर्शन के साथ' }, text: { en: 'Live 1-on-1 sessions plus daily practice, with support on WhatsApp.', hi: 'लाइव 1-on-1 सेशन और रोज़ का अभ्यास, WhatsApp पर सपोर्ट के साथ।' } },
      { title: { en: 'Follow-up & next level', hi: 'फ़ॉलो-अप और अगला लेवल' }, text: { en: 'We review your progress and decide the next step together.', hi: 'हम आपकी प्रगति देखते हैं और साथ मिलकर अगला कदम तय करते हैं।' } },
    ],
  },
  quote: {
    eyebrow: { en: 'WHY ONLY 1-ON-1', hi: 'सिर्फ़ 1-on-1 क्यों' },
    text: {
      en: '“Two people may come to learn telepathy for two different reasons. So I teach each person differently — for their own life.”',
      hi: '“दो लोग दो अलग-अलग वजहों से टेलीपैथी सीखने आ सकते हैं। इसलिए मैं हर व्यक्ति को अलग तरह से सिखाता हूँ — उसकी अपनी ज़िंदगी के लिए।”',
    },
  },
  proof: {
    title: { en: 'What people experienced', hi: 'लोगों के अनुभव' },
    sub: { en: 'Real participants, in their own words.', hi: 'असली प्रतिभागी, उनके अपने शब्दों में।' },
    videos: [
      { id: 'pRG3sdsXiHM', title: { en: 'Telepathy & Mind Reading', hi: 'टेलीपैथी और माइंड रीडिंग' } },
      { id: 'WZMSSuRTr78', title: { en: 'Cosmic Fusion', hi: 'कॉस्मिक फ्यूज़न' } },
      { id: 'ZyD_iQTOR60', title: { en: '7-Day Retreat', hi: '7 दिन का रिट्रीट' } },
    ],
    all: { en: 'See all reviews →', hi: 'सारे रिव्यू देखिए →' },
  },
  about: {
    eyebrow: { en: 'YOUR GUIDE', hi: 'आपके मार्गदर्शक' },
    name: { en: 'Dr. Kapil Dev Sharma', hi: 'डॉ. कपिल देव शर्मा' },
    text: {
      en: '12+ years of mind coaching · 15 years as a professor. Spent the whole of 2016 in the Himalayas, and has guided workshops and personal students since 2017. The spiritual practices are taught through Kriya Yoga and the movement of prana; the mind sessions use the approach that fits each person best.',
      hi: '12+ साल माइंड कोचिंग · 15 साल प्रोफ़ेसर। 2016 का पूरा साल हिमालय में बिताया, और 2017 से वर्कशॉप और व्यक्तिगत विद्यार्थियों का मार्गदर्शन कर रहे हैं। आध्यात्मिक अभ्यास क्रिया योग और प्राण की गति के ज़रिए सिखाए जाते हैं; मन के सेशन में वह तरीका अपनाया जाता है जो हर व्यक्ति के लिए सबसे सही हो।',
    },
  },
  book: {
    eyebrow: { en: 'START HERE', hi: 'यहाँ से शुरू कीजिए' },
    title: { en: 'Clarity Session', hi: 'क्लैरिटी सेशन' },
    minutes: { en: '· 75 minutes', hi: '· 75 मिनट' },
    ticks: [
      { en: 'A deep conversation about what you want to change', hi: 'आप क्या बदलना चाहते हैं, इस पर गहरी बातचीत' },
      { en: 'Your personal plan and the right package', hi: 'आपका पर्सनल प्लान और सही पैकेज' },
      { en: 'Your first practice to start right away', hi: 'तुरंत शुरू करने के लिए आपका पहला अभ्यास' },
    ],
    name: { en: 'Name', hi: 'नाम' },
    phone: { en: 'WhatsApp number', hi: 'WhatsApp नंबर' },
    city: { en: 'City', hi: 'शहर' },
    program: { en: 'Which program interests you?', hi: 'आपको कौन-सा प्रोग्राम पसंद है?' },
    choose: { en: 'Choose', hi: 'चुनें' },
    notSure: { en: 'Not sure yet', hi: 'अभी तय नहीं' },
    change: { en: 'What would you like to change in your life, and why?', hi: 'आप अपनी ज़िंदगी में क्या बदलना चाहते हैं, और क्यों?' },
    submit: { en: 'Request my Clarity Session', hi: 'मेरे क्लैरिटी सेशन का अनुरोध भेजें' },
    sending: { en: 'Sending…', hi: 'भेजा जा रहा है…' },
    note: {
      en: 'Dr. Kapil reads every request personally and replies on WhatsApp with a time and the payment link.',
      hi: 'डॉ. कपिल हर अनुरोध ख़ुद पढ़ते हैं और WhatsApp पर समय और पेमेंट लिंक के साथ जवाब देते हैं।',
    },
    thanksTitle: { en: 'Thank you! Your request is in.', hi: 'धन्यवाद! आपका अनुरोध मिल गया।' },
    thanksText: { en: 'Dr. Kapil will reply on WhatsApp with a time and the payment link.', hi: 'डॉ. कपिल WhatsApp पर समय और पेमेंट लिंक के साथ जवाब देंगे।' },
    phoneError: { en: 'Please enter a valid 10-digit Indian mobile number.', hi: 'कृपया सही 10 अंकों का भारतीय मोबाइल नंबर लिखें।' },
  },
  faq: {
    title: { en: 'Questions', hi: 'सवाल' },
    items: [
      {
        q: { en: 'What happens in the Clarity Session?', hi: 'क्लैरिटी सेशन में क्या होता है?' },
        a: {
          en: 'A 75-minute 1-on-1 conversation (₹2,100). We understand what you want to change and why, then Dr. Kapil suggests your personal plan and package.',
          hi: '75 मिनट की 1-on-1 बातचीत (₹2,100)। हम समझते हैं कि आप क्या बदलना चाहते हैं और क्यों, फिर डॉ. कपिल आपका पर्सनल प्लान और पैकेज सुझाते हैं।',
        },
      },
      {
        q: { en: 'Online or in person?', hi: 'ऑनलाइन या आमने-सामने?' },
        a: { en: 'Both. Most sessions are online; in-person sessions are in Vadodara.', hi: 'दोनों। ज़्यादातर सेशन ऑनलाइन होते हैं; आमने-सामने सेशन वडोदरा में होते हैं।' },
      },
      {
        q: { en: 'Do I need any experience for the spiritual practices?', hi: 'क्या आध्यात्मिक अभ्यासों के लिए अनुभव ज़रूरी है?' },
        a: {
          en: 'No. Everyone starts with the foundation. Kundalini, samadhi and astral projection are taught only after the foundation level, with personal guidance at every step.',
          hi: 'नहीं। हर कोई फ़ाउंडेशन से शुरू करता है। कुंडलिनी, समाधि और एस्ट्रल प्रोजेक्शन सिर्फ़ फ़ाउंडेशन लेवल के बाद, हर कदम पर व्यक्तिगत मार्गदर्शन के साथ सिखाए जाते हैं।',
        },
      },
      {
        q: { en: 'How much do the programs cost?', hi: 'प्रोग्राम की फ़ीस कितनी है?' },
        a: {
          en: 'Only the Clarity Session has a fixed price on the website. Your package depends on your plan and is discussed in that session.',
          hi: 'वेबसाइट पर सिर्फ़ क्लैरिटी सेशन की तय क़ीमत है। आपका पैकेज आपके प्लान पर निर्भर है और उसी सेशन में तय होता है।',
        },
      },
      {
        q: { en: 'Is my conversation private?', hi: 'क्या मेरी बातचीत निजी रहती है?' },
        a: { en: 'Yes. Everything you share in a session stays between you and Dr. Kapil.', hi: 'हाँ। सेशन में आप जो भी साझा करते हैं, वह आपके और डॉ. कपिल के बीच रहता है।' },
      },
    ],
    disclaimer: {
      en: 'Personal sessions are coaching and spiritual practice, not medical treatment. If you are in serious distress or have thoughts of harming yourself, please contact a doctor or a mental health professional immediately. Intuition training is mind training only, not financial or investment advice.',
      hi: 'पर्सनल सेशन कोचिंग और आध्यात्मिक अभ्यास हैं, मेडिकल इलाज नहीं। अगर आप गहरे तनाव में हैं या ख़ुद को नुकसान पहुँचाने के विचार आ रहे हैं, तो कृपया तुरंत किसी डॉक्टर या मानसिक स्वास्थ्य विशेषज्ञ से संपर्क करें। इनट्यूशन ट्रेनिंग सिर्फ़ मन की ट्रेनिंग है, वित्तीय या निवेश सलाह नहीं।',
    },
  },
} as const
