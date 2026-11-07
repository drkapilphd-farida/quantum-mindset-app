import {
  FAQ_LENGTH,
  FAQ_LENGTH_MIND,
  FAQ_ONLINE,
  FAQ_ONLINE_MIND,
  MIND_QUOTE,
  STEP_APPROACH,
  STEP_DAILY,
  STEP_REGULAR,
  WHO_NO_EXPERIENCE,
  WHO_PERSONAL_COACHING,
  reasonFirst,
  seoTitle,
  situationFirst,
  topicQuote,
} from './common'
import type { Program } from './types'

// Mind & emotions, Performance, Heart-Brain Coherence and Personal Retreat —
// text as approved by the owner (Nov 2026). Mind pages use "support" and
// "coaching"; the distress line (and the trading disclaimer) show under the FAQ.

export const stress: Program = {
  slug: 'stress-anxiety-support',
  group: 'mind',
  name: { en: 'Stress, Anxiety & Panic Support', hi: 'तनाव, एंग्ज़ायटी और पैनिक सपोर्ट' },
  line: { en: 'Calm the body, steady the mind, step by step.', hi: 'शरीर शांत, मन स्थिर, कदम-दर-कदम।' },
  h1: { en: 'Stress, Anxiety & Panic Attack Support — 1-on-1', hi: 'तनाव, एंग्ज़ायटी और पैनिक अटैक में सपोर्ट — 1-on-1' },
  seoTitle: seoTitle('Stress, Anxiety & Panic Attack Support — 1-on-1 Coaching with Dr. Kapil Dev Sharma', 'तनाव, एंग्ज़ायटी और पैनिक अटैक में सपोर्ट — डॉ. कपिल देव शर्मा के साथ 1-on-1 कोचिंग'),
  seoDescription: {
    en: 'Support and coaching for stress, anxiety, panic attacks and low mood, alongside medical care where needed. The approach is chosen for each person.',
    hi: 'तनाव, एंग्ज़ायटी, पैनिक अटैक और उदासी में सपोर्ट और कोचिंग, ज़रूरत हो तो मेडिकल देखभाल के साथ। तरीका हर व्यक्ति के लिए अलग चुना जाता है।',
  },
  heroLine: {
    en: 'Support and coaching for stress, anxiety, panic attacks and low mood (depression) — alongside medical care where needed, with an approach chosen for you.',
    hi: 'तनाव, एंग्ज़ायटी, पैनिक अटैक और उदासी (डिप्रेशन) में सपोर्ट और कोचिंग — ज़रूरत हो तो मेडिकल देखभाल के साथ, आपके लिए चुने गए तरीके से।',
  },
  usedFor: [
    { title: { en: 'Stress', hi: 'तनाव' }, text: { en: 'Support for the stress you carry day to day.', hi: 'रोज़ के तनाव में सपोर्ट।' } },
    { title: { en: 'Anxiety', hi: 'एंग्ज़ायटी' }, text: { en: 'Coaching for worry and anxiety.', hi: 'चिंता और एंग्ज़ायटी में कोचिंग।' } },
    { title: { en: 'Panic attacks', hi: 'पैनिक अटैक' }, text: { en: 'Support for the moments of panic.', hi: 'घबराहट के पलों में सपोर्ट।' } },
    { title: { en: 'Low mood', hi: 'उदासी' }, text: { en: 'Support for low mood (depression), alongside medical care where needed.', hi: 'उदासी (डिप्रेशन) में सपोर्ट, ज़रूरत हो तो मेडिकल देखभाल के साथ।' } },
  ],
  who: [
    { en: 'People living with stress or anxiety', hi: 'जो तनाव या एंग्ज़ायटी के साथ जी रहे हैं' },
    { en: 'Those who have panic attacks', hi: 'जिन्हें पैनिक अटैक आते हैं' },
    { en: 'People with low mood, alongside medical care where needed', hi: 'जिनका मन उदास रहता है, ज़रूरत हो तो मेडिकल देखभाल के साथ' },
    { en: 'Anyone who wants personal support, not a fixed course', hi: 'जो तय कोर्स नहीं, व्यक्तिगत सपोर्ट चाहता है' },
  ],
  howHeading: 'works',
  how: [
    situationFirst({ en: 'What are you going through, and since when?', hi: 'आप किस दौर से गुज़र रहे हैं, और कब से?' }),
    { lead: { en: 'An approach chosen for you.', hi: 'आपके लिए चुना गया तरीका।' }, rest: { en: 'The approach is chosen for each person.', hi: 'तरीका हर व्यक्ति के लिए अलग चुना जाता है।' } },
    { lead: { en: 'Alongside medical care,', hi: 'मेडिकल देखभाल के साथ,' }, rest: { en: 'where it is needed.', hi: 'जहाँ उसकी ज़रूरत हो।' } },
    STEP_REGULAR,
  ],
  quote: MIND_QUOTE,
  faqTopic: { en: 'stress and anxiety support', hi: 'तनाव और एंग्ज़ायटी सपोर्ट' },
  faqs: [
    {
      q: { en: 'Is this a replacement for my doctor?', hi: 'क्या यह मेरे डॉक्टर की जगह है?' },
      a: {
        en: 'No. This is support and coaching, alongside medical care where needed. Please continue any care you are under.',
        hi: 'नहीं। यह सपोर्ट और कोचिंग है, ज़रूरत हो तो मेडिकल देखभाल के साथ। जो देखभाल चल रही है, उसे जारी रखें।',
      },
    },
    {
      q: { en: 'What approach do you use?', hi: 'आप कौन-सा तरीका अपनाते हैं?' },
      a: {
        en: 'The approach is chosen for each person, after understanding your situation in the Clarity Session.',
        hi: 'क्लैरिटी सेशन में आपकी स्थिति समझने के बाद, तरीका हर व्यक्ति के लिए अलग चुना जाता है।',
      },
    },
    FAQ_LENGTH_MIND,
    FAQ_ONLINE_MIND,
  ],
  related: ['heart-brain-coherence', 'subconscious-reprogramming', 'mindset-coaching'],
  videos: [],
  shorts: [],
  disclaimers: ['mind'],
}

export const mindset: Program = {
  slug: 'mindset-coaching',
  group: 'mind',
  name: { en: 'Mindset Coaching', hi: 'माइंडसेट कोचिंग' },
  line: { en: 'A clearer, stronger mindset for life and work.', hi: 'ज़िंदगी और काम के लिए साफ़, मज़बूत माइंडसेट।' },
  h1: { en: 'Mindset Coaching — 1-on-1', hi: 'माइंडसेट कोचिंग — 1-on-1' },
  seoTitle: seoTitle('Mindset Coaching — 1-on-1 with Dr. Kapil Dev Sharma', 'माइंडसेट कोचिंग — डॉ. कपिल देव शर्मा के साथ 1-on-1'),
  seoDescription: {
    en: '1-on-1 coaching to build a stronger, clearer mindset for life and work. Start with a Clarity Session.',
    hi: 'ज़िंदगी और काम के लिए मज़बूत, साफ़ माइंडसेट बनाने की 1-on-1 कोचिंग। क्लैरिटी सेशन से शुरुआत करें।',
  },
  heroLine: {
    en: 'Build a stronger, clearer mindset for life and work — 1-on-1 coaching, shaped around you.',
    hi: 'ज़िंदगी और काम के लिए मज़बूत, साफ़ माइंडसेट बनाइए — 1-on-1 कोचिंग, आपके हिसाब से।',
  },
  usedFor: [
    { title: { en: 'A stronger mindset', hi: 'मज़बूत माइंडसेट' }, text: { en: 'Build a stronger mindset for everyday life.', hi: 'रोज़ की ज़िंदगी के लिए मज़बूत माइंडसेट।' } },
    { title: { en: 'Clarity', hi: 'साफ़ी' }, text: { en: 'Think more clearly about what matters to you.', hi: 'जो आपके लिए मायने रखता है, उस पर साफ़ सोच।' } },
    { title: { en: 'Work', hi: 'काम' }, text: { en: 'A clearer mindset for your work.', hi: 'अपने काम के लिए साफ़ माइंडसेट।' } },
    { title: { en: 'Life', hi: 'ज़िंदगी' }, text: { en: "A steadier mindset for life's ups and downs.", hi: 'ज़िंदगी के उतार-चढ़ाव के लिए स्थिर माइंडसेट।' } },
  ],
  who: [
    { en: 'People who want a stronger mindset', hi: 'जो मज़बूत माइंडसेट चाहते हैं' },
    { en: 'Professionals and business owners', hi: 'प्रोफ़ेशनल्स और बिज़नेस करने वाले' },
    { en: 'Anyone who wants more clarity in life and work', hi: 'जो ज़िंदगी और काम में ज़्यादा साफ़ी चाहता है' },
    WHO_PERSONAL_COACHING,
  ],
  howHeading: 'works',
  how: [
    situationFirst({ en: 'What do you want to change in how you think?', hi: 'आप अपनी सोच में क्या बदलना चाहते हैं?' }),
    STEP_APPROACH,
    { lead: { en: 'Practice in real life,', hi: 'असली ज़िंदगी में अभ्यास,' }, rest: { en: 'at work and at home.', hi: 'काम पर और घर पर।' } },
    STEP_REGULAR,
  ],
  quote: MIND_QUOTE,
  faqTopic: { en: 'mindset coaching', hi: 'माइंडसेट कोचिंग' },
  faqs: [
    {
      q: { en: 'What is mindset coaching?', hi: 'माइंडसेट कोचिंग क्या है?' },
      a: { en: '1-on-1 coaching to build a stronger, clearer mindset for life and work.', hi: 'ज़िंदगी और काम के लिए मज़बूत, साफ़ माइंडसेट बनाने की 1-on-1 कोचिंग।' },
    },
    { q: { en: 'Is it only for work?', hi: 'क्या यह सिर्फ़ काम के लिए है?' }, a: { en: 'No. It is for both life and work.', hi: 'नहीं। यह ज़िंदगी और काम, दोनों के लिए है।' } },
    FAQ_LENGTH_MIND,
    FAQ_ONLINE_MIND,
  ],
  related: ['subconscious-reprogramming', 'business-loss-mindset', 'heart-brain-coherence'],
  videos: [],
  shorts: [],
  disclaimers: ['mind'],
}

export const subconscious: Program = {
  slug: 'subconscious-reprogramming',
  group: 'mind',
  name: { en: 'Subconscious Reprogramming', hi: 'सबकॉन्शियस रीप्रोग्रामिंग' },
  line: { en: 'Change the old inner patterns that hold you back.', hi: 'उन पुराने अंदरूनी पैटर्न को बदलिए जो आपको रोकते हैं।' },
  h1: { en: 'Subconscious Reprogramming — 1-on-1', hi: 'सबकॉन्शियस माइंड रीप्रोग्रामिंग — 1-on-1' },
  seoTitle: seoTitle('Subconscious Reprogramming — 1-on-1 Coaching with Dr. Kapil Dev Sharma', 'सबकॉन्शियस माइंड रीप्रोग्रामिंग — डॉ. कपिल देव शर्मा के साथ 1-on-1'),
  seoDescription: {
    en: '1-on-1 coaching to change old inner patterns and beliefs that hold you back. Start with a Clarity Session.',
    hi: 'उन पुराने अंदरूनी पैटर्न और मान्यताओं को बदलने की 1-on-1 कोचिंग जो आपको रोकती हैं। क्लैरिटी सेशन से शुरुआत करें।',
  },
  heroLine: {
    en: 'Change the old inner patterns and beliefs that hold you back — 1-on-1 coaching, shaped around you.',
    hi: 'उन पुराने अंदरूनी पैटर्न और मान्यताओं को बदलिए जो आपको रोकती हैं — 1-on-1 कोचिंग, आपके हिसाब से।',
  },
  usedFor: [
    { title: { en: 'Old patterns', hi: 'पुराने पैटर्न' }, text: { en: 'Change inner patterns that keep repeating.', hi: 'बार-बार दोहराए जाने वाले अंदरूनी पैटर्न बदलना।' } },
    { title: { en: 'Limiting beliefs', hi: 'रोकने वाली मान्यताएँ' }, text: { en: 'Change beliefs that hold you back.', hi: 'उन मान्यताओं को बदलना जो आपको रोकती हैं।' } },
    { title: { en: 'New habits of mind', hi: 'मन की नई आदतें' }, text: { en: 'Build new inner patterns in their place.', hi: 'उनकी जगह नए अंदरूनी पैटर्न बनाना।' } },
    { title: { en: 'Moving forward', hi: 'आगे बढ़ना' }, text: { en: 'Step past what has held you back.', hi: 'जो आपको रोकता रहा है, उससे आगे बढ़ना।' } },
  ],
  who: [
    { en: 'People who keep repeating the same patterns', hi: 'जो बार-बार वही पैटर्न दोहराते हैं' },
    { en: 'Those held back by old beliefs', hi: 'जिन्हें पुरानी मान्यताएँ रोकती हैं' },
    { en: 'Anyone ready to work on the inside', hi: 'जो भीतर से काम करने को तैयार है' },
    WHO_PERSONAL_COACHING,
  ],
  howHeading: 'works',
  how: [
    situationFirst({ en: 'Which patterns or beliefs hold you back?', hi: 'कौन-से पैटर्न या मान्यताएँ आपको रोकती हैं?' }),
    STEP_APPROACH,
    { lead: { en: 'Building new patterns,', hi: 'नए पैटर्न बनाना,' }, rest: { en: 'step by step.', hi: 'कदम-दर-कदम।' } },
    STEP_REGULAR,
  ],
  quote: MIND_QUOTE,
  faqTopic: { en: 'subconscious reprogramming', hi: 'सबकॉन्शियस रीप्रोग्रामिंग' },
  faqs: [
    {
      q: { en: 'What is subconscious reprogramming?', hi: 'सबकॉन्शियस रीप्रोग्रामिंग क्या है?' },
      a: { en: 'Coaching to change old inner patterns and beliefs that hold you back.', hi: 'उन पुराने अंदरूनी पैटर्न और मान्यताओं को बदलने की कोचिंग जो आपको रोकती हैं।' },
    },
    {
      q: { en: 'What approach do you use?', hi: 'आप कौन-सा तरीका अपनाते हैं?' },
      a: { en: 'The approach is chosen for you, after understanding your situation in the Clarity Session.', hi: 'क्लैरिटी सेशन में आपकी स्थिति समझने के बाद, तरीका आपके लिए चुना जाता है।' },
    },
    FAQ_LENGTH_MIND,
    FAQ_ONLINE_MIND,
  ],
  related: ['mindset-coaching', 'stress-anxiety-support', 'manifestation'],
  videos: [],
  shorts: [],
  disclaimers: ['mind'],
}

export const businessLoss: Program = {
  slug: 'business-loss-mindset',
  group: 'mind',
  name: { en: 'Mindset After a Business Loss', hi: 'बिज़नेस नुकसान के बाद माइंडसेट' },
  line: { en: 'Rebuild confidence and clarity after a setback.', hi: 'झटके के बाद आत्मविश्वास और साफ़ी फिर से।' },
  h1: { en: 'Mindset After a Business Loss — 1-on-1', hi: 'बिज़नेस में नुकसान के बाद माइंडसेट — 1-on-1' },
  seoTitle: seoTitle('Mindset After a Business Loss — 1-on-1 Coaching with Dr. Kapil Dev Sharma', 'बिज़नेस में नुकसान के बाद माइंडसेट — डॉ. कपिल देव शर्मा के साथ 1-on-1 कोचिंग'),
  seoDescription: {
    en: '1-on-1 coaching to rebuild confidence, clarity and decision-making after a financial or business setback.',
    hi: 'आर्थिक या बिज़नेस झटके के बाद आत्मविश्वास, साफ़ी और फ़ैसले लेने की क्षमता फिर से बनाने की 1-on-1 कोचिंग।',
  },
  heroLine: {
    en: 'Rebuild your confidence, clarity and decision-making after a financial or business setback — 1-on-1 coaching, shaped around you.',
    hi: 'आर्थिक या बिज़नेस झटके के बाद अपना आत्मविश्वास, साफ़ी और फ़ैसले लेने की क्षमता फिर से बनाइए — 1-on-1 कोचिंग, आपके हिसाब से।',
  },
  usedFor: [
    { title: { en: 'Confidence', hi: 'आत्मविश्वास' }, text: { en: 'Rebuild your confidence after a setback.', hi: 'झटके के बाद आत्मविश्वास फिर से बनाना।' } },
    { title: { en: 'Clarity', hi: 'साफ़ी' }, text: { en: 'See your situation and next steps more clearly.', hi: 'अपनी स्थिति और अगले कदम ज़्यादा साफ़ देखना।' } },
    { title: { en: 'Decision-making', hi: 'फ़ैसले लेना' }, text: { en: 'Make decisions again with a steadier mind.', hi: 'स्थिर मन से फिर से फ़ैसले लेना।' } },
    { title: { en: 'A fresh start', hi: 'नई शुरुआत' }, text: { en: 'Move forward after a financial or business loss.', hi: 'आर्थिक या बिज़नेस नुकसान के बाद आगे बढ़ना।' } },
  ],
  who: [
    { en: 'Business owners after a loss', hi: 'नुकसान के बाद बिज़नेस करने वाले' },
    { en: 'People after a financial setback', hi: 'आर्थिक झटके के बाद लोग' },
    { en: 'Those who find decisions hard after a loss', hi: 'जिन्हें नुकसान के बाद फ़ैसले लेना मुश्किल लगता है' },
    WHO_PERSONAL_COACHING,
  ],
  howHeading: 'works',
  how: [
    situationFirst({ en: 'What happened, and how is it affecting you?', hi: 'क्या हुआ, और उसका आप पर क्या असर हो रहा है?' }),
    STEP_APPROACH,
    { lead: { en: 'Confidence, clarity and decisions,', hi: 'आत्मविश्वास, साफ़ी और फ़ैसले,' }, rest: { en: 'rebuilt step by step.', hi: 'कदम-दर-कदम फिर से।' } },
    STEP_REGULAR,
  ],
  quote: MIND_QUOTE,
  faqTopic: { en: 'mindset after a business loss', hi: 'बिज़नेस नुकसान के बाद माइंडसेट' },
  faqs: [
    {
      q: { en: 'Do you give business or financial advice?', hi: 'क्या आप बिज़नेस या वित्तीय सलाह देते हैं?' },
      a: { en: 'No. This is mindset coaching: confidence, clarity and decision-making.', hi: 'नहीं। यह माइंडसेट कोचिंग है: आत्मविश्वास, साफ़ी और फ़ैसले लेने की क्षमता।' },
    },
    {
      q: { en: 'Is it only for business owners?', hi: 'क्या यह सिर्फ़ बिज़नेस करने वालों के लिए है?' },
      a: { en: 'No. It is for anyone after a financial or business setback.', hi: 'नहीं। यह हर उस व्यक्ति के लिए है जिसे आर्थिक या बिज़नेस झटका लगा है।' },
    },
    FAQ_LENGTH_MIND,
    FAQ_ONLINE_MIND,
  ],
  related: ['mindset-coaching', 'stress-anxiety-support', 'intuition-for-traders'],
  videos: [],
  shorts: [],
  disclaimers: ['mind'],
}

export const traders: Program = {
  slug: 'intuition-for-traders',
  group: 'perf',
  name: { en: 'Intuition for Traders', hi: 'ट्रेडर्स के लिए इनट्यूशन' },
  line: { en: 'Clearer decisions, less fear and greed. Paper trading first.', hi: 'साफ़ फ़ैसले, कम डर और लालच। पहले पेपर ट्रेडिंग।' },
  h1: { en: 'Intuition Training for Traders — 1-on-1', hi: 'ट्रेडर्स के लिए इनट्यूशन ट्रेनिंग — 1-on-1' },
  seoTitle: seoTitle('Intuition Training for Traders — 1-on-1 Mind Coaching with Dr. Kapil Dev Sharma', 'ट्रेडर्स के लिए इनट्यूशन ट्रेनिंग — डॉ. कपिल देव शर्मा के साथ 1-on-1'),
  seoDescription: {
    en: 'Clarity in decisions, control over fear and greed, and intuition practice for entry and exit — paper trading first. Mind training only, not investment advice.',
    hi: 'फ़ैसलों में साफ़ी, डर और लालच पर काबू, और एंट्री-एग्ज़िट के लिए इनट्यूशन का अभ्यास — पहले पेपर ट्रेडिंग। सिर्फ़ मन की ट्रेनिंग, निवेश सलाह नहीं।',
  },
  heroLine: {
    en: 'Clarity in your decisions, control over fear and greed, and intuition practice for entry and exit — 1-on-1, with paper trading first.',
    hi: 'फ़ैसलों में साफ़ी, डर और लालच पर काबू, और एंट्री-एग्ज़िट के लिए इनट्यूशन का अभ्यास — 1-on-1, शुरुआत पेपर ट्रेडिंग से।',
  },
  usedFor: [
    { title: { en: 'Clear decisions', hi: 'साफ़ फ़ैसले' }, text: { en: 'Decide with a calmer, clearer mind.', hi: 'शांत और साफ़ मन से फ़ैसले लेना।' } },
    { title: { en: 'Fear and greed', hi: 'डर और लालच' }, text: { en: 'Gain control over fear and greed.', hi: 'डर और लालच पर काबू पाना।' } },
    { title: { en: 'Entry and exit', hi: 'एंट्री और एग्ज़िट' }, text: { en: 'Practise intuition for entry and exit.', hi: 'एंट्री और एग्ज़िट के लिए इनट्यूशन का अभ्यास।' } },
    { title: { en: 'Paper trading first', hi: 'पहले पेपर ट्रेडिंग' }, text: { en: 'The first 10 days are practised only with paper trading.', hi: 'पहले 10 दिन सिर्फ़ पेपर ट्रेडिंग से अभ्यास।' } },
  ],
  who: [
    { en: 'Traders whose decisions are pulled by fear or greed', hi: 'वे ट्रेडर्स जिनके फ़ैसले डर या लालच में बह जाते हैं' },
    { en: 'People who want more clarity before entry and exit', hi: 'जो एंट्री और एग्ज़िट से पहले ज़्यादा साफ़ी चाहते हैं' },
    { en: 'Those who want to train the mind, not look for tips', hi: 'जो टिप्स नहीं, अपने मन को ट्रेन करना चाहते हैं' },
    { en: 'No experience in meditation needed', hi: 'मेडिटेशन का कोई अनुभव ज़रूरी नहीं' },
  ],
  howHeading: 'teaches',
  how: [
    reasonFirst({ en: 'What happens in your mind when you trade?', hi: 'ट्रेड करते समय आपके मन में क्या होता है?' }),
    { lead: { en: 'Calm and clarity.', hi: 'शांति और साफ़ी।' }, rest: { en: 'Practices for a calmer, clearer mind under pressure.', hi: 'दबाव में शांत और साफ़ मन के अभ्यास।' } },
    { lead: { en: 'Intuition practice for entry and exit,', hi: 'एंट्री-एग्ज़िट के लिए इनट्यूशन का अभ्यास,' }, rest: { en: 'only with paper trading for the first 10 days.', hi: 'पहले 10 दिन सिर्फ़ पेपर ट्रेडिंग के साथ।' } },
    STEP_DAILY,
  ],
  quote: topicQuote({ en: 'intuition for trading', hi: 'ट्रेडिंग के लिए इनट्यूशन' }),
  faqTopic: { en: 'intuition for traders', hi: 'ट्रेडर्स के लिए इनट्यूशन' },
  faqs: [
    {
      q: { en: 'Do you give trading tips or investment advice?', hi: 'क्या आप ट्रेडिंग टिप्स या निवेश सलाह देते हैं?' },
      a: { en: 'No. Dr. Kapil works only on the mind and intuition. He does not give investment advice.', hi: 'नहीं। डॉ. कपिल सिर्फ़ मन और इनट्यूशन पर काम करते हैं। वे निवेश सलाह नहीं देते।' },
    },
    {
      q: { en: 'Why paper trading first?', hi: 'पहले पेपर ट्रेडिंग क्यों?' },
      a: {
        en: 'The first 10 days are practised only with paper trading, so you build the skill without risking money.',
        hi: 'पहले 10 दिन सिर्फ़ पेपर ट्रेडिंग से अभ्यास होता है, ताकि आप पैसे का जोखिम लिए बिना यह स्किल बनाएँ।',
      },
    },
    FAQ_LENGTH,
    FAQ_ONLINE,
  ],
  related: ['heart-brain-coherence', 'mindset-coaching', 'business-loss-mindset'],
  videos: [],
  shorts: [],
  disclaimers: ['traders'],
}

export const coherence: Program = {
  slug: 'heart-brain-coherence',
  group: 'rel',
  name: { en: 'Heart-Brain Coherence', hi: 'हार्ट-ब्रेन कोहेरेंस' },
  line: { en: 'From fear and tension to a calm, steady state.', hi: 'डर और तनाव से शांत, स्थिर अवस्था तक।' },
  h1: { en: 'Heart-Brain Coherence — 1-on-1', hi: 'हार्ट-ब्रेन कोहेरेंस — डर और तनाव से शांत अवस्था, 1-on-1' },
  seoTitle: seoTitle('Heart-Brain Coherence — 1-on-1 Practice with Dr. Kapil Dev Sharma', 'हार्ट-ब्रेन कोहेरेंस — डॉ. कपिल देव शर्मा के साथ 1-on-1 अभ्यास'),
  seoDescription: {
    en: 'A practice for people who live with fear or constant tension, to reach a calm, steady state — taught 1-on-1. Start with a Clarity Session.',
    hi: 'उन लोगों के लिए अभ्यास जो डर या लगातार तनाव में रहते हैं — शांत, स्थिर अवस्था तक पहुँचने के लिए, 1-on-1। क्लैरिटी सेशन से शुरुआत करें।',
  },
  heroLine: {
    en: 'For people who live with fear or constant tension — a practice to reach a calm, steady state, taught 1-on-1 for your own reason.',
    hi: 'उन लोगों के लिए जो डर या लगातार तनाव में रहते हैं — शांत, स्थिर अवस्था तक पहुँचने का अभ्यास, 1-on-1, आपकी अपनी वजह के लिए।',
  },
  usedFor: [
    { title: { en: 'Less fear', hi: 'कम डर' }, text: { en: 'Move from fear towards a calm state.', hi: 'डर से शांत अवस्था की ओर बढ़ना।' } },
    { title: { en: 'Constant tension', hi: 'लगातार तनाव' }, text: { en: 'Step out of constant tension, day by day.', hi: 'दिन-ब-दिन लगातार तनाव से बाहर आना।' } },
    { title: { en: 'A steady state', hi: 'स्थिर अवस्था' }, text: { en: 'Reach a calm, steady state when it matters.', hi: 'ज़रूरत के समय शांत, स्थिर अवस्था में पहुँचना।' } },
    { title: { en: 'Calmer relationships', hi: 'शांत रिश्ते' }, text: { en: 'Meet the people close to you from a calmer place.', hi: 'अपनों से ज़्यादा शांत मन से मिलना।' } },
  ],
  who: [
    { en: 'People who live with fear', hi: 'जो डर के साथ जीते हैं' },
    { en: 'Those under constant tension', hi: 'जो लगातार तनाव में रहते हैं' },
    { en: 'Anyone who wants a calm, steady state', hi: 'जो भी शांत, स्थिर अवस्था चाहता है' },
    WHO_NO_EXPERIENCE,
  ],
  howHeading: 'teaches',
  how: [
    reasonFirst({ en: 'What brings fear or tension into your day?', hi: 'आपके दिन में डर या तनाव कहाँ से आता है?' }),
    { lead: { en: 'The coherence practice.', hi: 'कोहेरेंस का अभ्यास।' }, rest: { en: 'Bringing heart and mind into one rhythm.', hi: 'दिल और दिमाग़ को एक ताल में लाना।' } },
    { lead: { en: 'Using it in daily life,', hi: 'रोज़ की ज़िंदगी में इस्तेमाल,' }, rest: { en: 'in the moments that usually bring fear or tension.', hi: 'उन पलों में जब आमतौर पर डर या तनाव आता है।' } },
    STEP_DAILY,
  ],
  quote: topicQuote({ en: 'heart-brain coherence', hi: 'हार्ट-ब्रेन कोहेरेंस' }),
  faqTopic: { en: 'heart-brain coherence', hi: 'हार्ट-ब्रेन कोहेरेंस' },
  faqs: [
    {
      q: { en: 'What is heart-brain coherence?', hi: 'हार्ट-ब्रेन कोहेरेंस क्या है?' },
      a: {
        en: 'A practice to bring heart and mind into one rhythm, so you can reach a calm, steady state.',
        hi: 'दिल और दिमाग़ को एक ताल में लाने का अभ्यास, ताकि आप शांत, स्थिर अवस्था तक पहुँच सकें।',
      },
    },
    {
      q: { en: 'Can anyone learn it?', hi: 'क्या कोई भी इसे सीख सकता है?' },
      a: { en: 'Yes. You start with the foundation, and Dr. Kapil guides you step by step.', hi: 'हाँ। शुरुआत फ़ाउंडेशन से होती है, और डॉ. कपिल कदम-दर-कदम मार्गदर्शन करते हैं।' },
    },
    FAQ_LENGTH,
    FAQ_ONLINE,
  ],
  related: ['stress-anxiety-support', 'telepathy', 'intuition-for-traders'],
  videos: [],
  shorts: [],
  // Owner (Nov 2026): this page also shows the distress line.
  disclaimers: ['mind'],
}

export const retreat: Program = {
  slug: 'personal-retreat',
  group: 'deep',
  name: { en: 'Personal Retreat', hi: 'पर्सनल रिट्रीट' },
  line: { en: 'A multi-day 1-on-1 intensive with Dr. Kapil.', hi: 'डॉ. कपिल के साथ कई दिनों का 1-on-1 इंटेंसिव।' },
  h1: { en: 'Personal Retreat — 1-on-1 Intensive with Dr. Kapil', hi: 'पर्सनल रिट्रीट — डॉ. कपिल के साथ 1-on-1 इंटेंसिव' },
  seoTitle: seoTitle('Personal Retreat — 1-on-1 Multi-Day Intensive with Dr. Kapil Dev Sharma', 'पर्सनल रिट्रीट — डॉ. कपिल देव शर्मा के साथ कई दिनों का 1-on-1 इंटेंसिव'),
  seoDescription: {
    en: 'A deep, personal, multi-day 1-on-1 intensive with Dr. Kapil Dev Sharma, in place of group retreats. Start with a Clarity Session.',
    hi: 'डॉ. कपिल देव शर्मा के साथ गहरा, व्यक्तिगत, कई दिनों का 1-on-1 इंटेंसिव, ग्रुप रिट्रीट की जगह। क्लैरिटी सेशन से शुरुआत करें।',
  },
  heroLine: {
    en: 'A deep, personal, multi-day intensive — 1-on-1 with Dr. Kapil, shaped around your own reason.',
    hi: 'एक गहरा, व्यक्तिगत, कई दिनों का इंटेंसिव — डॉ. कपिल के साथ 1-on-1, आपकी अपनी वजह के हिसाब से।',
  },
  usedFor: [
    { title: { en: 'Going deep', hi: 'गहराई में जाना' }, text: { en: 'A deep, personal experience over several days.', hi: 'कई दिनों का गहरा, व्यक्तिगत अनुभव।' } },
    { title: { en: 'Personal attention', hi: 'व्यक्तिगत ध्यान' }, text: { en: 'Every day with Dr. Kapil, 1-on-1.', hi: 'हर दिन डॉ. कपिल के साथ, 1-on-1।' } },
    { title: { en: 'Time for yourself', hi: 'अपने लिए समय' }, text: { en: 'Step away and give the days fully to your practice.', hi: 'रोज़मर्रा से हटकर दिन पूरी तरह अभ्यास को देना।' } },
    { title: { en: 'Your own focus', hi: 'आपका अपना फ़ोकस' }, text: { en: 'Days shaped around what you want to work on.', hi: 'दिन उसी के हिसाब से, जिस पर आप काम करना चाहते हैं।' } },
  ],
  who: [
    { en: 'People who want a deep, personal experience', hi: 'जो गहरा, व्यक्तिगत अनुभव चाहते हैं' },
    { en: 'Those who prefer 1-on-1 to a group', hi: 'जो ग्रुप की जगह 1-on-1 पसंद करते हैं' },
    { en: 'Anyone ready to give several days fully to it', hi: 'जो कई दिन पूरी तरह इसके लिए दे सकते हैं' },
    { en: 'Past retreat participants who want to go deeper', hi: 'पहले रिट्रीट कर चुके लोग जो और गहराई चाहते हैं' },
  ],
  howHeading: 'teaches',
  how: [
    reasonFirst({ en: 'What do you want from these days?', hi: 'इन दिनों से आप क्या चाहते हैं?' }),
    { lead: { en: 'A plan for your days,', hi: 'आपके दिनों का प्लान,' }, rest: { en: 'made only for you.', hi: 'सिर्फ़ आपके लिए बना।' } },
    { lead: { en: 'Daily 1-on-1 sessions and practice,', hi: 'रोज़ 1-on-1 सेशन और अभ्यास,' }, rest: { en: 'guided by Dr. Kapil.', hi: 'डॉ. कपिल के मार्गदर्शन में।' } },
    { lead: { en: 'Follow-up after the retreat,', hi: 'रिट्रीट के बाद फ़ॉलो-अप,' }, rest: { en: 'so the practice stays with you.', hi: 'ताकि अभ्यास आपके साथ बना रहे।' } },
  ],
  quote: topicQuote({ en: 'a retreat', hi: 'रिट्रीट' }),
  faqTopic: { en: 'the personal retreat', hi: 'पर्सनल रिट्रीट' },
  faqs: [
    {
      q: { en: 'Are there group retreats now?', hi: 'क्या अभी ग्रुप रिट्रीट होते हैं?' },
      a: { en: 'Not at the moment. The retreat is now a personal, 1-on-1 intensive.', hi: 'अभी नहीं। रिट्रीट अब व्यक्तिगत, 1-on-1 इंटेंसिव है।' },
    },
    {
      q: { en: 'How many days is it?', hi: 'यह कितने दिन का होता है?' },
      a: { en: 'It is a multi-day intensive. The number of days is decided in the Clarity Session.', hi: 'यह कई दिनों का इंटेंसिव है। दिनों की संख्या क्लैरिटी सेशन में तय होती है।' },
    },
    {
      q: { en: 'Where does it happen?', hi: 'यह कहाँ होता है?' },
      // TODO(owner): the place was not given yet — answer kept to the approved line.
      a: { en: 'The place is discussed in the Clarity Session.', hi: 'जगह क्लैरिटी सेशन में तय होती है।' },
    },
    {
      q: { en: 'Do I need experience?', hi: 'क्या अनुभव ज़रूरी है?' },
      a: { en: 'No. The days are planned around your experience and your reason.', hi: 'नहीं। दिन आपके अनुभव और आपकी वजह के हिसाब से तय होते हैं।' },
    },
  ],
  related: ['cosmic-fusion', 'samadhi-meditation', 'heart-brain-coherence'],
  videos: [
    { id: 'ZyD_iQTOR60', title: { en: '7-Day Retreat', hi: '7 दिन का रिट्रीट' } },
    { id: 'vbNGdtGRxeQ', title: { en: 'Retreat experience', hi: 'रिट्रीट का अनुभव' } },
    { id: '8a3vd3ep7QY', title: { en: 'Retreat experience', hi: 'रिट्रीट का अनुभव' } },
  ],
  shorts: [],
  disclaimers: [],
}

// Re-exported for the content tests.
export const MIND_SLUGS = ['stress-anxiety-support', 'mindset-coaching', 'subconscious-reprogramming', 'business-loss-mindset'] as const
