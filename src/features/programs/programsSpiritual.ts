import { SHORT_REVIEW_VIDEOS } from '@/config/telepathyWorkshopConfig'
import {
  FAQ_LENGTH,
  FAQ_ONLINE,
  STEP_DAILY,
  STEP_KRIYA,
  WHO_AFTER_FOUNDATION,
  WHO_COMMITTED,
  WHO_NO_EXPERIENCE,
  WHO_SEEKERS,
  foundationFirst,
  reasonFirst,
  seoTitle,
  topicQuote,
} from './common'
import type { Program } from './types'

// Telepathy (exact text of the owner's design file) and the spiritual and
// intention programs — text as approved by the owner (Nov 2026).

const COSMIC_FUSION_REVIEW = { id: 'WZMSSuRTr78', title: { en: 'Cosmic Fusion — workshop review', hi: 'कॉस्मिक फ्यूज़न — वर्कशॉप रिव्यू' } }

export const telepathy: Program = {
  slug: 'telepathy',
  group: 'rel',
  name: { en: 'Telepathy', hi: 'टेलीपैथी' },
  line: { en: 'Share feelings and intentions, and deepen your connection with others.', hi: 'भावनाएँ और इरादे साझा कीजिए, दूसरों से जुड़ाव गहरा कीजिए।' },
  h1: { en: 'Learn Telepathy — 1-on-1 with Dr. Kapil Dev Sharma', hi: 'टेलीपैथी कैसे सीखें — डॉ. कपिल देव शर्मा के साथ 1-on-1' },
  seoTitle: seoTitle('Learn Telepathy — 1-on-1 with Dr. Kapil Dev Sharma', 'टेलीपैथी कैसे सीखें — डॉ. कपिल देव शर्मा के साथ 1-on-1'),
  seoDescription: {
    en: 'Learn telepathy 1-on-1: share your feelings and intentions, deepen your relationships and build a spiritual connection — taught through Kriya Yoga and prana. Start with a Clarity Session.',
    hi: 'टेलीपैथी 1-on-1 सीखिए: अपनी भावनाएँ और इरादे साझा कीजिए, रिश्ते गहरे कीजिए और आध्यात्मिक जुड़ाव बनाइए — क्रिया योग और प्राण के ज़रिए। क्लैरिटी सेशन से शुरुआत करें।',
  },
  heroLine: {
    en: 'Share your feelings and intentions, deepen your relationships, and build a real spiritual connection — taught through Kriya Yoga and the movement of prana, for your own reason.',
    hi: 'अपनी भावनाएँ और इरादे साझा कीजिए, रिश्ते गहरे कीजिए, और सच्चा आध्यात्मिक जुड़ाव बनाइए — क्रिया योग और प्राण की गति के ज़रिए, आपकी अपनी वजह के लिए।',
  },
  experienceSuffix: { en: 'telepathy taught since 2017', hi: '2017 से टेलीपैथी सिखा रहे हैं' },
  usedFor: [
    { title: { en: 'Relationships', hi: 'रिश्ते' }, text: { en: 'Feel understood and bring warmth back into a close relationship.', hi: 'किसी क़रीबी रिश्ते में समझे जाने का एहसास और गर्माहट वापस लाना।' } },
    { title: { en: 'Sharing your feelings', hi: 'भावनाएँ साझा करना' }, text: { en: 'Send what is in your heart to another person, clearly and calmly.', hi: 'दिल की बात किसी दूसरे तक साफ़ और शांत ढंग से पहुँचाना।' } },
    { title: { en: 'Manifestation', hi: 'मैनिफ़ेस्टेशन' }, text: { en: 'Hold a clear intention and work with it every day.', hi: 'एक साफ़ इरादा रखना और हर दिन उसके साथ काम करना।' } },
    { title: { en: 'Spiritual connection', hi: 'आध्यात्मिक जुड़ाव' }, text: { en: 'A deeper, quieter connection with yourself and the universe.', hi: 'अपने आप और ब्रह्मांड से एक गहरा, शांत जुड़ाव।' } },
  ],
  who: [
    { en: 'Anyone facing distance or misunderstanding in a relationship', hi: 'किसी रिश्ते में दूरी या ग़लतफ़हमी झेल रहे लोग' },
    { en: 'People who want to work with intention and manifestation', hi: 'जो इरादे और मैनिफ़ेस्टेशन के साथ काम करना चाहते हैं' },
    WHO_SEEKERS,
    WHO_NO_EXPERIENCE,
  ],
  howHeading: 'teaches',
  how: [
    reasonFirst({ en: 'Why do you want to learn telepathy?', hi: 'आप टेलीपैथी क्यों सीखना चाहते हैं?' }),
    STEP_KRIYA,
    { lead: { en: 'Cosmic Fusion and Heart-Brain Coherence,', hi: 'कॉस्मिक फ्यूज़न और हार्ट-ब्रेन कोहेरेंस,' }, rest: { en: 'added as you need them.', hi: 'ज़रूरत के हिसाब से जोड़े जाते हैं।' } },
    STEP_DAILY,
  ],
  quote: topicQuote({ en: 'telepathy', hi: 'टेलीपैथी' }),
  faqTopic: { en: 'telepathy', hi: 'टेलीपैथी' },
  faqs: [
    {
      q: { en: 'Can anyone learn telepathy?', hi: 'क्या कोई भी टेलीपैथी सीख सकता है?' },
      a: {
        en: 'Yes. You start with the foundation practices. Dr. Kapil first understands why you want to learn it, then guides you step by step.',
        hi: 'हाँ। शुरुआत फ़ाउंडेशन अभ्यास से होती है। डॉ. कपिल पहले समझते हैं कि आप इसे क्यों सीखना चाहते हैं, फिर कदम-दर-कदम मार्गदर्शन करते हैं।',
      },
    },
    FAQ_LENGTH,
    FAQ_ONLINE,
    {
      q: { en: 'Is there a group workshop?', hi: 'क्या कोई ग्रुप वर्कशॉप है?' },
      a: { en: 'Not at the moment. Telepathy is now taught only 1-on-1, so it fits your own purpose.', hi: 'अभी नहीं। टेलीपैथी अब सिर्फ़ 1-on-1 सिखाई जाती है, ताकि यह आपके अपने उद्देश्य के हिसाब से हो।' },
    },
  ],
  related: ['cosmic-fusion', 'heart-brain-coherence', 'manifestation'],
  videos: [
    { id: 'pRG3sdsXiHM', title: { en: 'Telepathy & Mind Reading — Colombo', hi: 'टेलीपैथी और माइंड रीडिंग — कोलंबो' } },
    { id: 'l_3qAC_pgPI', title: { en: 'Online Telepathy review', hi: 'ऑनलाइन टेलीपैथी रिव्यू' } },
    { id: 'iEpjmpMe4qw', title: { en: 'Participant experience', hi: 'प्रतिभागी का अनुभव' } },
  ],
  shorts: [...SHORT_REVIEW_VIDEOS],
  disclaimers: [],
}

export const aura: Program = {
  slug: 'aura-reading',
  group: 'spirit',
  name: { en: 'Aura Reading & Body Scanning', hi: 'ऑरा रीडिंग और बॉडी स्कैनिंग' },
  line: { en: 'Learn to see auras, their colours and their energy.', hi: 'ऑरा, उसके रंग और उसकी ऊर्जा देखना सीखिए।' },
  h1: { en: 'Aura Reading & Body Scanning — 1-on-1', hi: 'ऑरा कैसे देखें — ऑरा रीडिंग और बॉडी स्कैनिंग, 1-on-1' },
  seoTitle: seoTitle('Aura Reading & Body Scanning — Learn 1-on-1 with Dr. Kapil Dev Sharma', 'ऑरा कैसे देखें — ऑरा रीडिंग 1-on-1 सीखें, डॉ. कपिल देव शर्मा के साथ'),
  seoDescription: {
    en: "Learn to see your own or another person's aura, its colours and its positive or negative energy — taught 1-on-1 through Kriya Yoga. Start with a Clarity Session.",
    hi: 'अपना या किसी और का ऑरा, उसके रंग और उसमें सकारात्मक या नकारात्मक ऊर्जा देखना सीखिए — क्रिया योग के ज़रिए 1-on-1। क्लैरिटी सेशन से शुरुआत करें।',
  },
  heroLine: {
    en: "Learn to see your own or another person's aura — its colours, and the positive or negative energy in it — taught 1-on-1 through Kriya Yoga, for your own reason.",
    hi: 'अपना या किसी और का ऑरा देखना सीखिए — उसके रंग, और उसमें मौजूद सकारात्मक या नकारात्मक ऊर्जा — क्रिया योग के ज़रिए 1-on-1, आपकी अपनी वजह के लिए।',
  },
  usedFor: [
    { title: { en: 'Seeing auras', hi: 'ऑरा देखना' }, text: { en: "See your own aura or another person's, and its colours.", hi: 'अपना या किसी और का ऑरा और उसके रंग देखना।' } },
    { title: { en: 'Reading energy', hi: 'ऊर्जा पहचानना' }, text: { en: 'Notice positive or negative energy in an aura.', hi: 'ऑरा में सकारात्मक या नकारात्मक ऊर्जा पहचानना।' } },
    { title: { en: 'Understanding people', hi: 'लोगों को समझना' }, text: { en: "Practitioners use it to sense a person's state of mind.", hi: 'अभ्यास करने वाले इससे किसी व्यक्ति की मनःस्थिति महसूस करते हैं।' } },
    { title: { en: "Knowing a person's nature", hi: 'स्वभाव को जानना' }, text: { en: "Sense a person's nature, as practitioners describe it.", hi: 'किसी व्यक्ति का स्वभाव महसूस करना, जैसा अभ्यास करने वाले बताते हैं।' } },
  ],
  who: [
    { en: 'People curious to see auras and energy', hi: 'जो लोग ऑरा और ऊर्जा देखना सीखना चाहते हैं' },
    { en: 'Those who want to understand people more deeply', hi: 'जो लोगों को और गहराई से समझना चाहते हैं' },
    WHO_SEEKERS,
    WHO_NO_EXPERIENCE,
  ],
  howHeading: 'teaches',
  how: [
    reasonFirst({ en: 'Why do you want to learn aura reading?', hi: 'आप ऑरा रीडिंग क्यों सीखना चाहते हैं?' }),
    STEP_KRIYA,
    { lead: { en: 'Seeing and scanning,', hi: 'देखना और स्कैन करना,' }, rest: { en: 'practised step by step — your own aura first.', hi: 'कदम-दर-कदम अभ्यास — पहले अपना ऑरा।' } },
    STEP_DAILY,
  ],
  quote: topicQuote({ en: 'aura reading', hi: 'ऑरा रीडिंग' }),
  faqTopic: { en: 'aura reading', hi: 'ऑरा रीडिंग' },
  faqs: [
    {
      q: { en: 'Can anyone learn aura reading?', hi: 'क्या कोई भी ऑरा रीडिंग सीख सकता है?' },
      a: {
        en: 'Yes. You start with the foundation practices. Dr. Kapil first understands why you want to learn it, then guides you step by step.',
        hi: 'हाँ। शुरुआत फ़ाउंडेशन अभ्यास से होती है। डॉ. कपिल पहले समझते हैं कि आप इसे क्यों सीखना चाहते हैं, फिर कदम-दर-कदम मार्गदर्शन करते हैं।',
      },
    },
    {
      q: { en: 'What is body scanning?', hi: 'बॉडी स्कैनिंग क्या है?' },
      a: { en: 'It is part of the same practice: sensing the energy in a person, step by step.', hi: 'यह इसी अभ्यास का हिस्सा है: किसी व्यक्ति में ऊर्जा को कदम-दर-कदम महसूस करना।' },
    },
    FAQ_LENGTH,
    FAQ_ONLINE,
  ],
  related: ['chakra-activation', 'cosmic-fusion', 'telepathy'],
  videos: [],
  shorts: [],
  disclaimers: [],
}

export const cosmicFusion: Program = {
  slug: 'cosmic-fusion',
  group: 'spirit',
  name: { en: 'Cosmic Fusion', hi: 'कॉस्मिक फ्यूज़न' },
  line: { en: 'Unite your prana with universal energy — a deeply calm state.', hi: 'अपने प्राण को ब्रह्मांड की ऊर्जा से जोड़िए — गहरी शांत अवस्था।' },
  h1: { en: 'Cosmic Fusion Meditation — 1-on-1', hi: 'कॉस्मिक फ्यूज़न मेडिटेशन — 1-on-1' },
  seoTitle: seoTitle('Cosmic Fusion Meditation — 1-on-1 with Dr. Kapil Dev Sharma', 'कॉस्मिक फ्यूज़न मेडिटेशन — डॉ. कपिल देव शर्मा के साथ 1-on-1'),
  seoDescription: {
    en: 'Unite your prana with universal energy and bring your mind into a higher, universal state — a deeply calming practice, taught 1-on-1. Start with a Clarity Session.',
    hi: 'अपने प्राण को ब्रह्मांड की ऊर्जा से जोड़िए और मन को ऊँची, सार्वभौमिक अवस्था में ले जाइए — गहराई से शांत करने वाला अभ्यास, 1-on-1। क्लैरिटी सेशन से शुरुआत करें।',
  },
  heroLine: {
    en: 'Unite your prana with universal energy and bring your mind into a higher, universal state of consciousness — taught 1-on-1 through Kriya Yoga, for your own reason.',
    hi: 'अपने प्राण को ब्रह्मांड की ऊर्जा से जोड़िए और मन को चेतना की ऊँची, सार्वभौमिक अवस्था में ले जाइए — क्रिया योग के ज़रिए 1-on-1, आपकी अपनी वजह के लिए।',
  },
  usedFor: [
    { title: { en: 'Deep calm', hi: 'गहरी शांति' }, text: { en: 'A deeply calming, high-vibration state.', hi: 'गहराई से शांत, ऊँचे कंपन वाली अवस्था।' } },
    { title: { en: 'Manifestation', hi: 'मैनिफ़ेस्टेशन' }, text: { en: 'Work with a clear intention from a calm, steady mind.', hi: 'शांत, स्थिर मन से एक साफ़ इरादे के साथ काम करना।' } },
    { title: { en: 'Inner well-being', hi: 'भीतरी सुकून' }, text: { en: 'Time each day for your inner well-being.', hi: 'हर दिन अपने भीतरी सुकून के लिए समय।' } },
    { title: { en: 'Feeling close to the divine', hi: 'ईश्वर से निकटता' }, text: { en: 'A state participants describe as feeling close to the divine.', hi: 'ऐसी अवस्था जिसे प्रतिभागी ईश्वर के क़रीब होने जैसा बताते हैं।' } },
  ],
  who: [
    { en: 'People who want deep calm and inner well-being', hi: 'जो गहरी शांति और भीतरी सुकून चाहते हैं' },
    { en: 'Those working with intention and manifestation', hi: 'जो इरादे और मैनिफ़ेस्टेशन के साथ काम करते हैं' },
    WHO_SEEKERS,
    WHO_NO_EXPERIENCE,
  ],
  howHeading: 'teaches',
  how: [
    reasonFirst({ en: 'Why do you want to practise Cosmic Fusion?', hi: 'आप कॉस्मिक फ्यूज़न क्यों करना चाहते हैं?' }),
    STEP_KRIYA,
    { lead: { en: 'Uniting with universal energy,', hi: 'ब्रह्मांड की ऊर्जा से जुड़ना,' }, rest: { en: 'step by step, at your own pace.', hi: 'कदम-दर-कदम, आपकी अपनी गति से।' } },
    STEP_DAILY,
  ],
  quote: topicQuote({ en: 'Cosmic Fusion', hi: 'कॉस्मिक फ्यूज़न' }),
  faqTopic: { en: 'Cosmic Fusion', hi: 'कॉस्मिक फ्यूज़न' },
  faqs: [
    {
      q: { en: 'What is Cosmic Fusion?', hi: 'कॉस्मिक फ्यूज़न क्या है?' },
      a: {
        en: 'A meditation in which you unite your prana with universal energy and bring your mind into a higher, universal state of consciousness.',
        hi: 'एक मेडिटेशन जिसमें आप अपने प्राण को ब्रह्मांड की ऊर्जा से जोड़ते हैं और मन को चेतना की ऊँची, सार्वभौमिक अवस्था में ले जाते हैं।',
      },
    },
    {
      q: { en: 'Can anyone learn it?', hi: 'क्या कोई भी इसे सीख सकता है?' },
      a: { en: 'Yes. You start with the foundation practices, and Dr. Kapil guides you step by step.', hi: 'हाँ। शुरुआत फ़ाउंडेशन अभ्यास से होती है, और डॉ. कपिल कदम-दर-कदम मार्गदर्शन करते हैं।' },
    },
    FAQ_LENGTH,
    FAQ_ONLINE,
  ],
  related: ['manifestation', 'telepathy', 'chakra-activation'],
  videos: [COSMIC_FUSION_REVIEW],
  shorts: [],
  disclaimers: [],
}

export const manifestation: Program = {
  slug: 'manifestation',
  group: 'rel',
  name: { en: 'Manifestation', hi: 'मैनिफ़ेस्टेशन' },
  line: { en: 'Bring clarity and focus to what you want to create.', hi: 'आप जो बनाना चाहते हैं, उस पर साफ़ी और फ़ोकस।' },
  h1: { en: 'Manifestation Practice — 1-on-1', hi: 'मैनिफ़ेस्टेशन का अभ्यास — 1-on-1' },
  seoTitle: seoTitle('Manifestation Practice — 1-on-1 with Dr. Kapil Dev Sharma', 'मैनिफ़ेस्टेशन कैसे करें — डॉ. कपिल देव शर्मा के साथ 1-on-1'),
  seoDescription: {
    en: 'Work with intention, telepathy and Cosmic Fusion to bring clarity and focus to what you want to create in life — taught 1-on-1.',
    hi: 'इरादे, टेलीपैथी और कॉस्मिक फ्यूज़न के साथ काम कीजिए, ताकि ज़िंदगी में जो बनाना चाहते हैं उस पर साफ़ी और फ़ोकस आए — 1-on-1।',
  },
  heroLine: {
    en: 'Work with intention, telepathy and Cosmic Fusion to bring clarity and focus to what you want to create in life — taught 1-on-1, for your own reason.',
    hi: 'इरादे, टेलीपैथी और कॉस्मिक फ्यूज़न के साथ काम कीजिए, ताकि ज़िंदगी में आप जो बनाना चाहते हैं उस पर साफ़ी और फ़ोकस आए — 1-on-1, आपकी अपनी वजह के लिए।',
  },
  usedFor: [
    { title: { en: 'Clarity', hi: 'साफ़ी' }, text: { en: 'Get clear about what you want to create.', hi: 'आप क्या बनाना चाहते हैं, उस पर साफ़ी।' } },
    { title: { en: 'Focus', hi: 'फ़ोकस' }, text: { en: 'Keep your focus on it, every day.', hi: 'हर दिन उस पर फ़ोकस बनाए रखना।' } },
    { title: { en: 'Working with intention', hi: 'इरादे के साथ काम' }, text: { en: 'Hold a clear intention and work with it.', hi: 'एक साफ़ इरादा रखना और उसके साथ काम करना।' } },
    { title: { en: 'Telepathy and Cosmic Fusion', hi: 'टेलीपैथी और कॉस्मिक फ्यूज़न' }, text: { en: 'Practices that support your intention.', hi: 'ऐसे अभ्यास जो आपके इरादे को सहारा देते हैं।' } },
  ],
  who: [
    { en: 'People who want clarity about what they want in life', hi: 'जो जानना चाहते हैं कि ज़िंदगी में उन्हें क्या चाहिए' },
    { en: 'Those who want to work with intention every day', hi: 'जो हर दिन इरादे के साथ काम करना चाहते हैं' },
    { en: 'Seekers drawn to telepathy and Cosmic Fusion', hi: 'वे साधक जो टेलीपैथी और कॉस्मिक फ्यूज़न की ओर खिंचते हैं' },
    WHO_NO_EXPERIENCE,
  ],
  howHeading: 'teaches',
  how: [
    reasonFirst({ en: 'What do you want to create, and why?', hi: 'आप क्या बनाना चाहते हैं, और क्यों?' }),
    { lead: { en: 'A clear intention.', hi: 'साफ़ इरादा।' }, rest: { en: 'Shaping one clear intention to work with.', hi: 'काम करने के लिए एक साफ़ इरादा तैयार करना।' } },
    { lead: { en: 'Telepathy and Cosmic Fusion,', hi: 'टेलीपैथी और कॉस्मिक फ्यूज़न,' }, rest: { en: 'added as you need them.', hi: 'ज़रूरत के हिसाब से जोड़े जाते हैं।' } },
    STEP_DAILY,
  ],
  quote: topicQuote({ en: 'manifestation', hi: 'मैनिफ़ेस्टेशन' }),
  faqTopic: { en: 'manifestation', hi: 'मैनिफ़ेस्टेशन' },
  faqs: [
    {
      q: { en: 'What is manifestation practice?', hi: 'मैनिफ़ेस्टेशन का अभ्यास क्या है?' },
      a: {
        en: 'Working with intention, telepathy and Cosmic Fusion to bring clarity and focus to what you want to create in life.',
        hi: 'इरादे, टेलीपैथी और कॉस्मिक फ्यूज़न के साथ काम करना, ताकि ज़िंदगी में आप जो बनाना चाहते हैं उस पर साफ़ी और फ़ोकस आए।',
      },
    },
    {
      q: { en: 'Do I need to know telepathy first?', hi: 'क्या पहले टेलीपैथी आनी चाहिए?' },
      a: { en: 'No. You start with the foundation; telepathy and Cosmic Fusion are added as you need them.', hi: 'नहीं। शुरुआत फ़ाउंडेशन से होती है; टेलीपैथी और कॉस्मिक फ्यूज़न ज़रूरत के हिसाब से जोड़े जाते हैं।' },
    },
    FAQ_LENGTH,
    FAQ_ONLINE,
  ],
  related: ['telepathy', 'cosmic-fusion', 'heart-brain-coherence'],
  videos: [COSMIC_FUSION_REVIEW],
  shorts: [],
  disclaimers: [],
}

export const chakra: Program = {
  slug: 'chakra-activation',
  group: 'spirit',
  name: { en: 'Chakra Activation', hi: 'चक्र जागरण' },
  line: { en: 'Awaken and balance your energy centres through Kriya Yoga.', hi: 'क्रिया योग से अपने ऊर्जा केंद्रों को जगाइए और संतुलित कीजिए।' },
  h1: { en: 'Chakra Activation — 1-on-1', hi: 'चक्र जागरण — 1-on-1' },
  seoTitle: seoTitle('Chakra Activation through Kriya Yoga — 1-on-1 with Dr. Kapil Dev Sharma', 'चक्र जागरण कैसे करें — क्रिया योग से, डॉ. कपिल देव शर्मा के साथ 1-on-1'),
  seoDescription: {
    en: 'Chakra activation through Kriya Yoga and the movement of prana, taught 1-on-1 with personal guidance. Start with a Clarity Session.',
    hi: 'क्रिया योग और प्राण की गति के ज़रिए चक्र जागरण, व्यक्तिगत मार्गदर्शन के साथ 1-on-1। क्लैरिटी सेशन से शुरुआत करें।',
  },
  heroLine: {
    en: 'Chakra activation through Kriya Yoga and the movement of prana — taught 1-on-1, with personal guidance, for your own reason.',
    hi: 'क्रिया योग और प्राण की गति के ज़रिए चक्र जागरण — 1-on-1, व्यक्तिगत मार्गदर्शन के साथ, आपकी अपनी वजह के लिए।',
  },
  usedFor: [
    { title: { en: 'Working with the chakras', hi: 'चक्रों के साथ अभ्यास' }, text: { en: 'Guided practice with the energy centres.', hi: 'ऊर्जा केंद्रों के साथ मार्गदर्शित अभ्यास।' } },
    { title: { en: 'Moving prana', hi: 'प्राण की गति' }, text: { en: 'Learn the movement of prana through Kriya Yoga.', hi: 'क्रिया योग से प्राण की गति सीखना।' } },
    { title: { en: 'Balance', hi: 'संतुलन' }, text: { en: 'Balance in your energy centres, as participants describe it.', hi: 'ऊर्जा केंद्रों में संतुलन, जैसा प्रतिभागी बताते हैं।' } },
    { title: { en: 'A deeper practice', hi: 'गहरा अभ्यास' }, text: { en: 'A foundation for deeper spiritual practice.', hi: 'गहरे आध्यात्मिक अभ्यास की नींव।' } },
  ],
  who: [
    { en: 'Seekers who want to work with their chakras', hi: 'वे साधक जो अपने चक्रों के साथ काम करना चाहते हैं' },
    { en: 'People interested in Kriya Yoga and prana', hi: 'जो क्रिया योग और प्राण में रुचि रखते हैं' },
    { en: 'Those who want a real, guided spiritual practice', hi: 'जो सच्चा, मार्गदर्शन वाला आध्यात्मिक अभ्यास चाहते हैं' },
    WHO_NO_EXPERIENCE,
  ],
  howHeading: 'teaches',
  how: [
    reasonFirst({ en: 'Why do you want to work with your chakras?', hi: 'आप अपने चक्रों के साथ क्यों काम करना चाहते हैं?' }),
    STEP_KRIYA,
    { lead: { en: 'One chakra at a time,', hi: 'एक-एक चक्र,' }, rest: { en: 'with personal guidance at every step.', hi: 'हर कदम पर व्यक्तिगत मार्गदर्शन के साथ।' } },
    STEP_DAILY,
  ],
  quote: topicQuote({ en: 'chakra activation', hi: 'चक्र जागरण' }),
  faqTopic: { en: 'chakra activation', hi: 'चक्र जागरण' },
  faqs: [
    {
      q: { en: 'How are the chakras activated here?', hi: 'यहाँ चक्र जागरण कैसे होता है?' },
      a: { en: 'Through Kriya Yoga and the movement of prana, with personal guidance.', hi: 'क्रिया योग और प्राण की गति के ज़रिए, व्यक्तिगत मार्गदर्शन के साथ।' },
    },
    {
      q: { en: 'Can anyone learn it?', hi: 'क्या कोई भी इसे सीख सकता है?' },
      a: { en: 'Yes. You start with the foundation practices, and Dr. Kapil guides you step by step.', hi: 'हाँ। शुरुआत फ़ाउंडेशन अभ्यास से होती है, और डॉ. कपिल कदम-दर-कदम मार्गदर्शन करते हैं।' },
    },
    FAQ_LENGTH,
    FAQ_ONLINE,
  ],
  related: ['kundalini-meditation', 'cosmic-fusion', 'aura-reading'],
  videos: [],
  shorts: [],
  disclaimers: [],
}

function advanced(args: {
  slug: 'samadhi-meditation' | 'kundalini-meditation' | 'astral-projection'
  name: Program['name']
  line: Program['line']
  h1: Program['h1']
  seo: [string, string]
  seoDescription: Program['seoDescription']
  heroLine: Program['heroLine']
  usedFor: Program['usedFor']
  whoFirstTwo: [Program['who'][number], Program['who'][number]]
  reasonQuestion: Program['name']
  foundationName: Program['name']
  thirdStep: Program['how'][number]
  topic: Program['name']
  faqFirst: Program['faqs'][number]
  faqSecond: Program['faqs'][number]
  related: Program['related']
}): Program {
  return {
    slug: args.slug,
    group: 'spirit',
    name: args.name,
    line: args.line,
    h1: args.h1,
    seoTitle: seoTitle(args.seo[0], args.seo[1]),
    seoDescription: args.seoDescription,
    heroLine: args.heroLine,
    usedFor: args.usedFor,
    who: [...args.whoFirstTwo, WHO_COMMITTED, WHO_AFTER_FOUNDATION],
    howHeading: 'teaches',
    how: [reasonFirst(args.reasonQuestion), foundationFirst(args.foundationName), args.thirdStep, STEP_DAILY],
    quote: topicQuote(args.topic),
    faqTopic: args.topic,
    faqs: [args.faqFirst, args.faqSecond, FAQ_LENGTH, FAQ_ONLINE],
    related: args.related,
    videos: [],
    shorts: [],
    disclaimers: [],
  }
}

const YOUR_OWN_PATH = { title: { en: 'Your own path', hi: 'आपका अपना रास्ता' }, text: { en: 'A practice shaped for your own spiritual reason.', hi: 'आपकी अपनी आध्यात्मिक वजह के लिए बना अभ्यास।' } }
const KRIYA_GUIDED_STEP = { lead: { en: 'Kriya Yoga,', hi: 'क्रिया योग,' }, rest: { en: 'with personal guidance at every step.', hi: 'हर कदम पर व्यक्तिगत मार्गदर्शन के साथ।' } }

export const samadhi: Program = advanced({
  slug: 'samadhi-meditation',
  name: { en: 'Samadhi Meditation', hi: 'समाधि मेडिटेशन' },
  line: { en: 'Deep meditative stillness, after the foundation level.', hi: 'ध्यान की गहरी स्थिरता, फ़ाउंडेशन लेवल के बाद।' },
  h1: { en: 'Samadhi Meditation — 1-on-1', hi: 'समाधि मेडिटेशन — 1-on-1' },
  seo: ['Samadhi Meditation through Kriya Yoga — 1-on-1 with Dr. Kapil Dev Sharma', 'समाधि ध्यान — क्रिया योग से, डॉ. कपिल देव शर्मा के साथ 1-on-1'],
  seoDescription: {
    en: 'Samadhi meditation through Kriya Yoga, taught 1-on-1 only after the foundation level, with personal guidance. Start with a Clarity Session.',
    hi: 'क्रिया योग के ज़रिए समाधि मेडिटेशन, फ़ाउंडेशन लेवल के बाद ही, व्यक्तिगत मार्गदर्शन के साथ 1-on-1। क्लैरिटी सेशन से शुरुआत करें।',
  },
  heroLine: {
    en: 'Deep meditative stillness through Kriya Yoga — taught 1-on-1, only after the foundation level, with personal guidance.',
    hi: 'क्रिया योग के ज़रिए गहरी ध्यान की स्थिरता — 1-on-1, सिर्फ़ फ़ाउंडेशन लेवल के बाद, व्यक्तिगत मार्गदर्शन के साथ।',
  },
  usedFor: [
    { title: { en: 'Deep stillness', hi: 'गहरी स्थिरता' }, text: { en: 'Deep meditative stillness, as participants describe it.', hi: 'गहरी ध्यान की स्थिरता, जैसा प्रतिभागी बताते हैं।' } },
    { title: { en: 'Going deeper', hi: 'और गहराई' }, text: { en: 'Taking your meditation further after the foundation.', hi: 'फ़ाउंडेशन के बाद ध्यान को आगे ले जाना।' } },
    { title: { en: 'Kriya Yoga', hi: 'क्रिया योग' }, text: { en: 'A complete practice through Kriya Yoga.', hi: 'क्रिया योग के ज़रिए पूरा अभ्यास।' } },
    YOUR_OWN_PATH,
  ],
  whoFirstTwo: [
    { en: 'Meditators who want to go deeper', hi: 'वे ध्यान करने वाले जो और गहराई चाहते हैं' },
    { en: 'Seekers drawn to Kriya Yoga', hi: 'वे साधक जो क्रिया योग की ओर खिंचते हैं' },
  ],
  reasonQuestion: { en: 'Why do you want to practise samadhi meditation?', hi: 'आप समाधि मेडिटेशन क्यों करना चाहते हैं?' },
  foundationName: { en: 'Samadhi meditation', hi: 'समाधि मेडिटेशन' },
  thirdStep: KRIYA_GUIDED_STEP,
  topic: { en: 'samadhi meditation', hi: 'समाधि मेडिटेशन' },
  faqFirst: {
    q: { en: 'Can a beginner start with samadhi meditation?', hi: 'क्या नए लोग सीधे समाधि मेडिटेशन से शुरू कर सकते हैं?' },
    a: { en: 'No. It is taught only after the foundation level. Everyone starts with the foundation.', hi: 'नहीं। यह सिर्फ़ फ़ाउंडेशन लेवल के बाद सिखाया जाता है। हर कोई फ़ाउंडेशन से शुरू करता है।' },
  },
  faqSecond: {
    q: { en: 'How is it taught?', hi: 'यह कैसे सिखाया जाता है?' },
    a: { en: 'Through Kriya Yoga, 1-on-1, with personal guidance at every step.', hi: 'क्रिया योग के ज़रिए, 1-on-1, हर कदम पर व्यक्तिगत मार्गदर्शन के साथ।' },
  },
  related: ['kundalini-meditation', 'cosmic-fusion', 'personal-retreat'],
})

export const kundalini: Program = advanced({
  slug: 'kundalini-meditation',
  name: { en: 'Kundalini Meditation', hi: 'कुंडलिनी मेडिटेशन' },
  line: { en: 'Guided step by step, after the foundation level.', hi: 'कदम-दर-कदम मार्गदर्शन, फ़ाउंडेशन लेवल के बाद।' },
  h1: { en: 'Kundalini Meditation — 1-on-1', hi: 'कुंडलिनी जागरण मेडिटेशन — 1-on-1' },
  seo: ['Kundalini Meditation through Kriya Yoga — 1-on-1 with Dr. Kapil Dev Sharma', 'कुंडलिनी जागरण — क्रिया योग से, डॉ. कपिल देव शर्मा के साथ 1-on-1'],
  seoDescription: {
    en: 'Kundalini meditation through Kriya Yoga and the movement of prana, taught 1-on-1 only after the foundation level, with personal guidance at every step.',
    hi: 'क्रिया योग और प्राण की गति के ज़रिए कुंडलिनी मेडिटेशन, फ़ाउंडेशन लेवल के बाद ही, हर कदम पर व्यक्तिगत मार्गदर्शन के साथ 1-on-1।',
  },
  heroLine: {
    en: 'Kundalini meditation through Kriya Yoga and the movement of prana — taught 1-on-1, only after the foundation level, with personal guidance at every step.',
    hi: 'क्रिया योग और प्राण की गति के ज़रिए कुंडलिनी मेडिटेशन — 1-on-1, सिर्फ़ फ़ाउंडेशन लेवल के बाद, हर कदम पर व्यक्तिगत मार्गदर्शन के साथ।',
  },
  usedFor: [
    { title: { en: 'A deeper practice', hi: 'गहरा अभ्यास' }, text: { en: 'Taking your spiritual practice further after the foundation.', hi: 'फ़ाउंडेशन के बाद आध्यात्मिक अभ्यास को आगे ले जाना।' } },
    { title: { en: 'Moving prana', hi: 'प्राण की गति' }, text: { en: 'Working with prana through Kriya Yoga.', hi: 'क्रिया योग से प्राण के साथ काम करना।' } },
    { title: { en: 'Careful guidance', hi: 'सावधान मार्गदर्शन' }, text: { en: 'A practice done step by step, never rushed.', hi: 'कदम-दर-कदम अभ्यास, कभी जल्दबाज़ी नहीं।' } },
    YOUR_OWN_PATH,
  ],
  whoFirstTwo: [
    { en: 'Seekers drawn to kundalini meditation', hi: 'वे साधक जो कुंडलिनी मेडिटेशन की ओर खिंचते हैं' },
    { en: 'People interested in Kriya Yoga and prana', hi: 'जो क्रिया योग और प्राण में रुचि रखते हैं' },
  ],
  reasonQuestion: { en: 'Why do you want to practise kundalini meditation?', hi: 'आप कुंडलिनी मेडिटेशन क्यों करना चाहते हैं?' },
  foundationName: { en: 'Kundalini meditation', hi: 'कुंडलिनी मेडिटेशन' },
  thirdStep: { lead: { en: 'Kriya Yoga and prana,', hi: 'क्रिया योग और प्राण,' }, rest: { en: 'with personal guidance at every step.', hi: 'हर कदम पर व्यक्तिगत मार्गदर्शन के साथ।' } },
  topic: { en: 'kundalini meditation', hi: 'कुंडलिनी मेडिटेशन' },
  faqFirst: {
    q: { en: 'Can a beginner start with kundalini meditation?', hi: 'क्या नए लोग सीधे कुंडलिनी मेडिटेशन से शुरू कर सकते हैं?' },
    a: { en: 'No. It is taught only after the foundation level, with personal guidance at every step.', hi: 'नहीं। यह सिर्फ़ फ़ाउंडेशन लेवल के बाद, हर कदम पर व्यक्तिगत मार्गदर्शन के साथ सिखाया जाता है।' },
  },
  faqSecond: {
    q: { en: 'How is it taught?', hi: 'यह कैसे सिखाया जाता है?' },
    a: { en: 'Through Kriya Yoga and the movement of prana, 1-on-1.', hi: 'क्रिया योग और प्राण की गति के ज़रिए, 1-on-1।' },
  },
  related: ['chakra-activation', 'samadhi-meditation', 'cosmic-fusion'],
})

export const astral: Program = advanced({
  slug: 'astral-projection',
  name: { en: 'Astral Projection', hi: 'एस्ट्रल प्रोजेक्शन' },
  line: { en: 'An advanced practice, after the foundation level.', hi: 'एक उन्नत अभ्यास, फ़ाउंडेशन लेवल के बाद।' },
  h1: { en: 'Astral Projection — 1-on-1', hi: 'एस्ट्रल प्रोजेक्शन — 1-on-1' },
  seo: ['Astral Projection through Kriya Yoga — 1-on-1 with Dr. Kapil Dev Sharma', 'एस्ट्रल प्रोजेक्शन कैसे सीखें — क्रिया योग से, डॉ. कपिल देव शर्मा के साथ 1-on-1'],
  seoDescription: {
    en: 'Astral projection through Kriya Yoga, taught 1-on-1 only after the foundation level, with personal guidance. Start with a Clarity Session.',
    hi: 'क्रिया योग के ज़रिए एस्ट्रल प्रोजेक्शन, फ़ाउंडेशन लेवल के बाद ही, व्यक्तिगत मार्गदर्शन के साथ 1-on-1। क्लैरिटी सेशन से शुरुआत करें।',
  },
  heroLine: {
    en: 'An advanced practice through Kriya Yoga — taught 1-on-1, only after the foundation level, with personal guidance.',
    hi: 'क्रिया योग के ज़रिए एक उन्नत अभ्यास — 1-on-1, सिर्फ़ फ़ाउंडेशन लेवल के बाद, व्यक्तिगत मार्गदर्शन के साथ।',
  },
  usedFor: [
    { title: { en: 'An advanced practice', hi: 'उन्नत अभ्यास' }, text: { en: 'Going further after the foundation level.', hi: 'फ़ाउंडेशन लेवल के बाद आगे बढ़ना।' } },
    { title: { en: 'Kriya Yoga', hi: 'क्रिया योग' }, text: { en: 'A practice taught through Kriya Yoga.', hi: 'क्रिया योग के ज़रिए सिखाया जाने वाला अभ्यास।' } },
    { title: { en: 'Personal guidance', hi: 'व्यक्तिगत मार्गदर्शन' }, text: { en: 'Every step guided personally by Dr. Kapil.', hi: 'हर कदम पर डॉ. कपिल का व्यक्तिगत मार्गदर्शन।' } },
    YOUR_OWN_PATH,
  ],
  whoFirstTwo: [
    { en: 'Seekers drawn to astral projection', hi: 'वे साधक जो एस्ट्रल प्रोजेक्शन की ओर खिंचते हैं' },
    { en: 'People interested in Kriya Yoga', hi: 'जो क्रिया योग में रुचि रखते हैं' },
  ],
  reasonQuestion: { en: 'Why do you want to learn astral projection?', hi: 'आप एस्ट्रल प्रोजेक्शन क्यों सीखना चाहते हैं?' },
  foundationName: { en: 'Astral projection', hi: 'एस्ट्रल प्रोजेक्शन' },
  thirdStep: KRIYA_GUIDED_STEP,
  topic: { en: 'astral projection', hi: 'एस्ट्रल प्रोजेक्शन' },
  faqFirst: {
    q: { en: 'Can a beginner start with astral projection?', hi: 'क्या नए लोग सीधे एस्ट्रल प्रोजेक्शन से शुरू कर सकते हैं?' },
    a: { en: 'No. It is taught only after the foundation level. Everyone starts with the foundation.', hi: 'नहीं। यह सिर्फ़ फ़ाउंडेशन लेवल के बाद सिखाया जाता है। हर कोई फ़ाउंडेशन से शुरू करता है।' },
  },
  faqSecond: {
    q: { en: 'How is it taught?', hi: 'यह कैसे सिखाया जाता है?' },
    a: { en: 'Through Kriya Yoga, 1-on-1, with personal guidance at every step.', hi: 'क्रिया योग के ज़रिए, 1-on-1, हर कदम पर व्यक्तिगत मार्गदर्शन के साथ।' },
  },
  related: ['samadhi-meditation', 'kundalini-meditation', 'chakra-activation'],
})
