import { LINKS } from '@/data/links'
import type { EventCopy } from './types'

// Owner's offer ladder (23 Nov 2026). Content rules: no cure/treat/heal/
// guarantee/100%/इलाज — skills, practice and experience only.

export const TELEPATHY_PATH = '/telepathy-online-workshop'
export const RISHIKESH_PATH = '/rishikesh-retreat'

/** Telepathy & Intuition — monthly online workshop, ₹999, 3 evenings × 2.5 hours. */
export const TELEPATHY_COPY: EventCopy = {
  meta: {
    title: { en: 'Telepathy & Intuition — Live Online Workshop with Dr. Kapil | ₹999', hi: 'टेलीपैथी और इनट्यूशन — डॉ. कपिल के साथ लाइव ऑनलाइन वर्कशॉप | ₹999' },
    description: {
      en: '3 live evenings on Zoom, 2.5 hours each — heart-brain coherence, intuition, telepathy practice in pairs and Cosmic Fusion. Every month. ₹999.',
      hi: 'Zoom पर 3 लाइव शाम, हर शाम 2.5 घंटे — हार्ट-ब्रेन कोहेरेंस, इनट्यूशन, जोड़ी में टेलीपैथी अभ्यास और कॉस्मिक फ्यूजन। हर महीने। ₹999।',
    },
  },
  pill: { en: 'LIVE ONLINE WORKSHOP · EVERY MONTH', hi: 'लाइव ऑनलाइन वर्कशॉप · हर महीने' },
  h1: { en: 'Telepathy & Intuition — 3 live evenings with Dr. Kapil', hi: 'टेलीपैथी और इनट्यूशन — डॉ. कपिल के साथ 3 लाइव शाम' },
  sub: {
    en: 'Learn to quieten the mind, trust your inner voice and practise telepathy in pairs — from home, on Zoom. Taught since 2017, now online every month.',
    hi: 'मन को शांत करना, अपनी अंदर की आवाज़ पर भरोसा करना और जोड़ी में टेलीपैथी का अभ्यास सीखिए — घर से, Zoom पर। 2017 से सिखाया जा रहा है, अब हर महीने ऑनलाइन।',
  },
  facts: [
    { en: '3 evenings × 2.5 hours', hi: '3 शाम × 2.5 घंटे' },
    { en: 'Live on Zoom', hi: 'Zoom पर लाइव' },
    { en: 'Practice in pairs', hi: 'जोड़ी में अभ्यास' },
    { en: 'Hindi + English', hi: 'हिंदी + अंग्रेज़ी' },
  ],
  priceLine: { en: '₹999 · a new batch every month', hi: '₹999 · हर महीने नया बैच' },
  book: { en: 'Pay ₹999 & book my seat', hi: '₹999 पे करें और सीट बुक करें' },
  bookMessage: 'Hi Dr. Kapil, I have a question about the Telepathy & Intuition online workshop (₹999). Please share the next dates.',
  payUrl: LINKS.rzpTelepathyOnline999,
  ask: { en: 'Ask a question on WhatsApp', hi: 'WhatsApp पर सवाल पूछें' },
  forWhom: {
    heading: { en: 'Who it is for', hi: 'यह किसके लिए है' },
    items: [
      { en: 'Traders and business people who want clearer, calmer decisions', hi: 'ट्रेडर और बिज़नेस वाले, जो साफ़ और शांत फ़ैसले लेना चाहते हैं' },
      { en: 'Anyone curious about intuition and the power of the mind', hi: 'जो इनट्यूशन और मन की शक्ति के बारे में जानना चाहते हैं' },
      { en: 'Meditators who want to go a step deeper', hi: 'मेडिटेशन करने वाले जो एक कदम और गहराई में जाना चाहते हैं' },
      { en: 'People who learn best by doing, not just listening', hi: 'जो सिर्फ़ सुनकर नहीं, करके सीखना पसंद करते हैं' },
    ],
  },
  plan: {
    heading: { en: 'What happens in 3 evenings', hi: 'तीन शाम में क्या होता है' },
    steps: [
      { title: { en: 'Evening 1 — Heart-brain coherence and intuition', hi: 'शाम 1 — हार्ट-ब्रेन कोहेरेंस और इनट्यूशन' }, line: { en: 'Heart and mind in one rhythm; your first practice in recognising your inner voice.', hi: 'दिल और दिमाग़ एक ताल पर; अंदर की आवाज़ पहचानने का पहला अभ्यास।' } },
      { title: { en: 'Evening 2 — Telepathy', hi: 'शाम 2 — टेलीपैथी' }, line: { en: 'The method, then practice in pairs — three rounds.', hi: 'विधि, फिर जोड़ी में अभ्यास — तीन चक्र।' } },
      { title: { en: 'Evening 3 — Cosmic Fusion, and making it stick', hi: 'शाम 3 — कॉस्मिक फ्यूजन, और अभ्यास पक्का' }, line: { en: 'Connecting your prana to universal energy; a 10-minute daily plan for home; Q&A.', hi: 'प्राण को ब्रह्मांड की ऊर्जा से जोड़ना; घर पर 10 मिनट का रोज़ का प्लान; सवाल-जवाब।' } },
    ],
  },
  price: {
    title: { en: 'Telepathy & Intuition Workshop', hi: 'टेलीपैथी और इनट्यूशन वर्कशॉप' },
    amount: '₹999',
    sub: { en: 'one-time · all 3 evenings', hi: 'एक बार · तीनों शाम' },
    included: [
      { en: '3 live evenings', hi: '3 लाइव शाम' },
      { en: 'Pair practice', hi: 'जोड़ी में अभ्यास' },
      { en: '10-minute daily plan', hi: '10 मिनट का रोज़ का प्लान' },
      { en: 'Live Q&A', hi: 'लाइव सवाल-जवाब' },
    ],
    note: { en: 'A new batch every month. After payment we confirm your seat on WhatsApp and send the dates and Zoom link.', hi: 'हर महीने नया बैच। पेमेंट के बाद हम WhatsApp पर आपकी सीट पक्की करके तारीख़ और Zoom लिंक भेजेंगे।' },
  },
  faqHeading: { en: 'Questions', hi: 'सवाल' },
  faq: [
    { q: { en: 'Do I need any experience?', hi: 'क्या पहले से कोई अनुभव चाहिए?' }, a: { en: 'No. Everything is taught step by step from the first evening.', hi: 'नहीं। पहली शाम से सब कुछ कदम-दर-कदम सिखाया जाता है।' } },
    { q: { en: 'Is it recorded?', hi: 'क्या रिकॉर्डिंग मिलेगी?' }, a: { en: 'The practice is done live, in pairs, so please attend all three evenings.', hi: 'अभ्यास लाइव, जोड़ी में होता है, इसलिए तीनों शाम ज़रूर जुड़िए।' } },
    { q: { en: 'What language is it in?', hi: 'किस भाषा में है?' }, a: { en: 'Simple Hindi and English, mixed naturally.', hi: 'आसान हिंदी और अंग्रेज़ी, स्वाभाविक रूप से मिली-जुली।' } },
    { q: { en: 'Can I learn this 1-on-1?', hi: 'क्या इसे 1-on-1 सीख सकते हैं?' }, a: { en: 'Yes — deeper telepathy and intuition work is available in Personal Sessions.', hi: 'हाँ — टेलीपैथी और इनट्यूशन पर गहरा काम पर्सनल सेशन में होता है।' } },
  ],
  finalHeading: { en: 'Your intuition is already there. Learn to hear it.', hi: 'आपका इनट्यूशन पहले से आपके भीतर है। उसे सुनना सीखिए।' },
  heroImage: '/gallery/retreats/telepathy-card-circle.jpg',
  photos: {
    heading: { en: 'From our workshops', hi: 'हमारी वर्कशॉप से' },
    sub: { en: 'Real participants, real practice — in pairs, in silence, in a circle.', hi: 'असली प्रतिभागी, असली अभ्यास — जोड़ी में, मौन में, घेरे में।' },
    items: [
      { src: '/gallery/retreats/telepathy-card-circle.jpg', alt: { en: 'Participants in a circle practising telepathy with cards', hi: 'घेरे में बैठे प्रतिभागी कार्ड से टेलीपैथी का अभ्यास करते हुए' } },
      { src: '/gallery/retreats/pair-practice-closeup.jpg', alt: { en: 'Two participants practising in silence, facing each other', hi: 'आमने-सामने बैठे दो प्रतिभागी मौन अभ्यास करते हुए' } },
      { src: '/gallery/retreats/pair-practice-silence.jpg', alt: { en: 'Pair practice in a quiet hall with Dr. Kapil', hi: 'डॉ. कपिल के साथ शांत हॉल में जोड़ी अभ्यास' } },
      { src: '/gallery/retreats/academy-meditation.jpg', alt: { en: 'Group meditation at the Mind Ur Mind Academy', hi: 'मन उर मन अकादमी में ग्रुप मेडिटेशन' } },
    ],
  },
}

/** Rishikesh residential retreat — 26–29 March 2027, ₹24,999 with stay and food. No venue name on the site (owner). */
export const RISHIKESH_COPY: EventCopy = {
  meta: {
    title: { en: 'Rishikesh Meditation Retreat, 26–29 March 2027 — with Dr. Kapil | ₹24,999', hi: 'ऋषिकेश मेडिटेशन रिट्रीट, 26–29 मार्च 2027 — डॉ. कपिल के साथ | ₹24,999' },
    description: {
      en: '4 days by the Ganga in Rishikesh: morning meditation, Kriya and pranayama, silence, satsang with Dr. Kapil. Stay and food included. ₹24,999. Small group.',
      hi: 'ऋषिकेश में गंगा किनारे 4 दिन: सुबह का मेडिटेशन, क्रिया और प्राणायाम, मौन, डॉ. कपिल के साथ सत्संग। रहना और खाना शामिल। ₹24,999। छोटा ग्रुप।',
    },
  },
  pill: { en: 'RESIDENTIAL RETREAT · 26–29 MARCH 2027', hi: 'रेजिडेंशियल रिट्रीट · 26–29 मार्च 2027' },
  h1: { en: '4 days of deep meditation by the Ganga, in Rishikesh', hi: 'ऋषिकेश में गंगा किनारे, 4 दिन का गहरा मेडिटेशन' },
  sub: {
    en: 'Step away from the phone and the noise. Meditate, breathe and rest in the Himalayan foothills with Dr. Kapil and a small group — stay and food included.',
    hi: 'फ़ोन और शोर से दूर। हिमालय की गोद में डॉ. कपिल और एक छोटे ग्रुप के साथ मेडिटेशन, साँस और आराम — रहना और खाना शामिल।',
  },
  facts: [
    { en: '26–29 March 2027', hi: '26–29 मार्च 2027' },
    { en: 'Rishikesh, by the Ganga', hi: 'ऋषिकेश, गंगा किनारे' },
    { en: 'Stay + all meals', hi: 'रहना + सारा खाना' },
    { en: 'Small group', hi: 'छोटा ग्रुप' },
  ],
  priceLine: { en: '₹24,999 · stay and food included', hi: '₹24,999 · रहना और खाना शामिल' },
  book: { en: 'Reserve my place', hi: 'मेरी जगह पक्की करें' },
  bookMessage: 'Hi Dr. Kapil, I want to reserve a place in the Rishikesh Retreat (26–29 March 2027, ₹24,999).',
  forWhom: {
    heading: { en: 'Who it is for', hi: 'यह किसके लिए है' },
    items: [
      { en: 'Busy people who need a real break, not just a holiday', hi: 'व्यस्त लोग जिन्हें सिर्फ़ छुट्टी नहीं, असली ठहराव चाहिए' },
      { en: 'Meditators ready to go deeper with daily guided practice', hi: 'मेडिटेशन करने वाले जो रोज़ के गाइडेड अभ्यास से गहराई में जाना चाहते हैं' },
      { en: 'Those who finished the 21-Day Online Retreat and want more', hi: 'जिन्होंने 21 दिन का ऑनलाइन रिट्रीट किया है और आगे बढ़ना चाहते हैं' },
      { en: 'Anyone who wants to experience Rishikesh with a guide', hi: 'जो गाइड के साथ ऋषिकेश का अनुभव लेना चाहते हैं' },
    ],
  },
  plan: {
    heading: { en: 'Your 4 days', hi: 'आपके 4 दिन' },
    steps: [
      { title: { en: 'Day 1 — Arrive and settle', hi: 'दिन 1 — पहुँचना और ठहरना' }, line: { en: 'Check-in, opening circle, an evening meditation to slow down.', hi: 'चेक-इन, शुरुआती सर्कल, मन धीमा करने वाला शाम का मेडिटेशन।' } },
      { title: { en: 'Day 2 — Breath and body', hi: 'दिन 2 — साँस और शरीर' }, line: { en: 'Sunrise meditation, Kriya and pranayama, a silent walk by the Ganga.', hi: 'सूर्योदय मेडिटेशन, क्रिया और प्राणायाम, गंगा किनारे मौन सैर।' } },
      { title: { en: 'Day 3 — Silence and depth', hi: 'दिन 3 — मौन और गहराई' }, line: { en: 'A half-day of silence, deep guided meditation and an evening satsang.', hi: 'आधा दिन मौन, गहरा गाइडेड मेडिटेशन और शाम का सत्संग।' } },
      { title: { en: 'Day 4 — Carry it home', hi: 'दिन 4 — इसे घर ले जाना' }, line: { en: 'Your own daily routine, closing circle, departure after lunch.', hi: 'आपका अपना रोज़ का रूटीन, समापन सर्कल, दोपहर के खाने के बाद विदाई।' } },
    ],
  },
  price: {
    title: { en: 'Rishikesh Retreat · 26–29 March 2027', hi: 'ऋषिकेश रिट्रीट · 26–29 मार्च 2027' },
    amount: '₹24,999',
    sub: { en: 'per person · stay and food included', hi: 'प्रति व्यक्ति · रहना और खाना शामिल' },
    included: [
      { en: '3 nights stay', hi: '3 रात रहना' },
      { en: 'All meals', hi: 'सारा खाना' },
      { en: 'All sessions', hi: 'सारे सेशन' },
      { en: 'Small group', hi: 'छोटा ग्रुप' },
    ],
    note: { en: 'Travel to Rishikesh is not included. Places are limited — reserve on WhatsApp and we will share the full details.', hi: 'ऋषिकेश तक आने-जाने का ख़र्च शामिल नहीं। जगह सीमित है — WhatsApp पर पक्की कीजिए, हम पूरी जानकारी भेजेंगे।' },
  },
  faqHeading: { en: 'Questions', hi: 'सवाल' },
  faq: [
    { q: { en: 'Do I need meditation experience?', hi: 'क्या मेडिटेशन का अनुभव चाहिए?' }, a: { en: 'No. Every session is guided; beginners are welcome.', hi: 'नहीं। हर सेशन गाइडेड है; शुरुआत करने वाले भी आ सकते हैं।' } },
    { q: { en: 'What is included in ₹24,999?', hi: '₹24,999 में क्या शामिल है?' }, a: { en: 'Your stay for 3 nights, all meals and all sessions. Travel to Rishikesh is not included.', hi: '3 रात रहना, सारा खाना और सारे सेशन। ऋषिकेश तक आने-जाने का ख़र्च शामिल नहीं।' } },
    { q: { en: 'Where exactly is it?', hi: 'जगह ठीक कहाँ है?' }, a: { en: 'In Rishikesh, close to the Ganga. The full address is shared with you after you reserve.', hi: 'ऋषिकेश में, गंगा के पास। पूरा पता जगह पक्की होने के बाद भेजा जाता है।' } },
    { q: { en: 'What language is it in?', hi: 'किस भाषा में है?' }, a: { en: 'Simple Hindi and English.', hi: 'आसान हिंदी और अंग्रेज़ी।' } },
  ],
  finalHeading: { en: '4 days that stay with you for years.', hi: '4 दिन जो सालों तक आपके साथ रहें।' },
  heroImage: '/gallery/retreats/rishikesh-ganga-group.jpg',
  photos: {
    heading: { en: 'From our earlier retreats', hi: 'हमारे पिछले रिट्रीट से' },
    sub: { en: 'Mornings by the Ganga, yoga under the sky, deep meditation together.', hi: 'गंगा किनारे सुबह, खुले आसमान के नीचे योग, साथ में गहरा मेडिटेशन।' },
    items: [
      { src: '/gallery/retreats/rishikesh-ganga-group.jpg', alt: { en: 'Retreat group with Dr. Kapil on the banks of the Ganga', hi: 'गंगा किनारे डॉ. कपिल के साथ रिट्रीट ग्रुप' } },
      { src: '/gallery/retreats/retreat-meditation-hall.jpg', alt: { en: 'Guided meditation in the retreat hall', hi: 'रिट्रीट हॉल में गाइडेड मेडिटेशन' } },
      { src: '/gallery/retreats/rishikesh-rooftop-yoga.jpg', alt: { en: 'Morning yoga on the rooftop', hi: 'छत पर सुबह का योग' } },
      { src: '/gallery/retreats/rishikesh-ganga-morning.jpg', alt: { en: 'Morning by the Ganga in Rishikesh', hi: 'ऋषिकेश में गंगा किनारे सुबह' } },
      { src: '/gallery/retreats/retreat-hall-session.jpg', alt: { en: 'A session in the retreat hall', hi: 'रिट्रीट हॉल में एक सेशन' } },
      { src: '/gallery/retreats/meditation-with-monk.jpg', alt: { en: 'Dr. Kapil with a meditating monk', hi: 'ध्यान में बैठे एक साधु के साथ डॉ. कपिल' } },
    ],
  },
  disclaimer: { en: 'This is a meditation retreat, not a substitute for medical or psychological treatment.', hi: 'यह मेडिटेशन रिट्रीट है, चिकित्सा या मनोवैज्ञानिक उपचार का विकल्प नहीं।' },
}
