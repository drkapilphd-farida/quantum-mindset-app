import { brand, programs, qsrGuarantee, SHARP_BRAIN_PRICES, trainer } from '@/config/site.config'
import type { Lang } from '@/lib/i18n'

// Copy for the problem-first homepage (site-rebuild Phase 4), EN + HI.
// Every name, number and price is read from site.config.ts — nothing here
// restates a program name or a stat by hand.

function inr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

function minPrice(id: keyof typeof programs): number | null {
  const amounts = programs[id].prices.map((p) => p.amountInr).filter((a) => a > 0)
  return amounts.length === 0 ? null : Math.min(...amounts)
}

const qsrFrom = minPrice('sharpBrain')
const execFrom = minPrice('executiveWorkshop')
const resetFrom = minPrice('overthinkingReset')
const residentialFrom = minPrice('residentialRetreat')

export type ProblemCard = {
  id: 'learning' | 'work' | 'mind' | 'meditation'
  pillar: string
  pain: string
  audience: string
  /** `livePrice`: the price line is the server-decided Sharp Brain price (early-bird / regular + next batch). */
  programs: { name: string; href: string; priceLine: string | null; livePrice?: boolean }[]
  cta: { label: string; href: string }
  extras: { label: string; href: string }[]
  note: string | null
}

export type HomeCopy = {
  problems: { eyebrow: string; title: string; cards: ProblemCard[] }
  startFree: { eyebrow: string; title: string; items: { title: string; desc: string; href: string; cta: string }[] }
  proof: { eyebrow: string; title: string; desc: string; tabs: { learning: string; meditation: string }; playlistCta: string; learningNote: string }
  how: { eyebrow: string; title: string; steps: { title: string; desc: string }[]; eegLine: string }
  about: { eyebrow: string; readStory: string }
  upcoming: { eyebrow: string; title: string; from: string; cta: string }
  organisations: { eyebrow: string; title: string; desc: string; ctaCorporate: string; ctaSchools: string }
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] }
}

const en: HomeCopy = {
  problems: {
    eyebrow: 'Start with your problem',
    title: 'What would you like to solve?',
    cards: [
      {
        id: 'learning',
        pillar: 'Brain',
        pain: '“I read a page and can’t recall it.” / “My focus breaks in minutes.”',
        audience: 'For school & college students, exam aspirants and working professionals — parents can enrol their child',
        programs: [{ name: programs.sharpBrain.name, href: programs.sharpBrain.url, priceLine: qsrFrom === null ? null : `${inr(qsrFrom)} one-time`, livePrice: true }],
        cta: { label: 'See Sharp Brain™', href: programs.sharpBrain.url },
        extras: [{ label: 'Take the free Reading & Memory Test →', href: '/reading-memory-test' }],
        note: 'Read faster with understanding. Focus longer. Remember more. — 7 live classes + daily app practice, measured from your own Day 1 to Day 30.',
      },
      {
        id: 'work',
        pillar: 'Brain · Work',
        pain: '“I need calm focus and clear decisions under work pressure.”',
        audience: 'For leaders, founders and senior professionals',
        programs: [
          {
            name: programs.executiveWorkshop.name,
            href: programs.executiveWorkshop.url,
            priceLine: execFrom === null ? null : `from ${inr(execFrom)}`,
          },
        ],
        cta: { label: 'See the workshop', href: programs.executiveWorkshop.url },
        extras: [{ label: 'For companies →', href: `${programs.executiveWorkshop.url}#corporate` }],
        note: null,
      },
      {
        id: 'mind',
        pillar: 'Mind',
        pain: '“My mind won’t stop — overthinking, stress, worry.”',
        audience: 'For adults caught in overthinking loops (taught in Hindi)',
        programs: [
          {
            name: programs.overthinkingReset.name,
            href: programs.overthinkingReset.url,
            priceLine: resetFrom === null ? null : `from ${inr(resetFrom)}`,
          },
        ],
        cta: { label: 'Start the 21-day reset', href: programs.overthinkingReset.url },
        extras: [{ label: `Need personal help? ${programs.oneOnOneCoaching.name} →`, href: programs.oneOnOneCoaching.url }],
        note: null,
      },
      {
        id: 'meditation',
        pillar: 'Meditation',
        pain: '“I want real inner peace and deeper meditation.”',
        audience: 'For adults ready for a guided, deeper practice',
        programs: [
          { name: programs.onlineRetreat.name, href: programs.onlineRetreat.url, priceLine: null },
          {
            name: programs.residentialRetreat.name,
            href: programs.residentialRetreat.url,
            priceLine: residentialFrom === null ? null : `from ${inr(residentialFrom)}`,
          },
        ],
        cta: { label: 'See the online retreat', href: programs.onlineRetreat.url },
        extras: [{ label: 'Residential retreats →', href: programs.residentialRetreat.url }],
        note: null,
      },
    ],
  },
  startFree: {
    eyebrow: 'Start free',
    title: 'Not sure yet? Start with a free step.',
    items: [
      { title: 'Free Reading & Memory Test', desc: 'About 3 minutes · reading speed, memory and retention', href: '/reading-memory-test', cta: 'Take the test' },
      { title: 'Overthinking Test', desc: '2 minutes · a self-awareness check, not a diagnosis', href: '/mind-assessment', cta: 'Take the test' },
    ],
  },
  proof: {
    eyebrow: 'Real learners on video',
    title: 'Hear it from people who did the work',
    desc: 'Unscripted video reviews from our YouTube channel.',
    tabs: { learning: 'Learning', meditation: 'Meditation' },
    playlistCta: 'See all videos on YouTube',
    learningNote: 'From earlier batches (the program was then called Quantum Speed Reading)',
  },
  how: {
    eyebrow: 'How we work',
    title: 'Measure. Train. Practise daily. Re-measure.',
    steps: [
      { title: 'Measure', desc: 'Start with a baseline — your reading speed, comprehension or stress score on Day 1.' },
      { title: 'Train', desc: `Learn the technique live with ${trainer.name} — step by step, not a recording.` },
      { title: 'Practise daily', desc: 'Short daily sessions in the app or on WhatsApp — usually 10 to 20 minutes.' },
      { title: 'Re-measure', desc: 'Compare with your own Day 1 baseline, so progress is measured, not claimed.' },
    ],
    eegLine: 'Offline workshops include a live EEG brain-state demo — for learning and engagement, not a medical test.',
  },
  about: { eyebrow: 'Your coach', readStory: 'Read his story →' },
  upcoming: { eyebrow: 'Upcoming live events', title: 'Join us in person', from: 'from', cta: 'View details' },
  organisations: {
    eyebrow: 'For organisations',
    title: 'Brain performance training for teams and schools',
    desc: 'Workshops on focus, stress and clear decision-making for corporate teams, and Sharp Brain for Schools — focus, memory, smart reading and mobile discipline for students.',
    ctaCorporate: 'For Corporate Teams',
    ctaSchools: 'For Schools',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you start',
    items: [
      {
        question: 'Which program is right for me?',
        answer: `Reading, focus and memory → Sharp Brain: Self-paced (₹${SHARP_BRAIN_PRICES.selfPacedInr.toLocaleString('en-IN')}) or the Live batch (₹${SHARP_BRAIN_PRICES.liveInr.toLocaleString('en-IN')}). Stress, anxiety, mindset, performance or a spiritual practice → ${programs.oneOnOneCoaching.name}. Not sure? Take the free Reading & Memory Test or message us on WhatsApp.`,
      },
      {
        question: 'Is this science-based or spiritual?',
        answer:
          'Both, clearly separated. Sharp Brain is science-backed training — reading, attention and memory methods, measured from your own Day 1. Spiritual practices such as aura reading, chakra activation and meditation are offered only in 1-on-1 Personal Sessions. None of it is therapy or medical care; if you are under a doctor’s care or in crisis, please consult a licensed professional.',
      },
      {
        question: 'Online or offline?',
        answer: 'Sharp Brain is online: the app plus 7 classes — live on Zoom in the Live batch, recorded in Self-paced. Personal Sessions are online or in person.',
      },
      {
        question: 'Hindi or English?',
        answer: 'Sharp Brain classes are taught in simple Hindi with English terms. For Personal Sessions, tell us your preferred language when you enquire.',
      },
      {
        question: 'What about refunds?',
        answer: `Each program’s terms are on our Refund & Cancellation Policy page. The Sharp Brain Live batch also carries a results guarantee: ${qsrGuarantee.en.statement}`,
      },
      {
        question: 'How do I contact you?',
        answer: `WhatsApp is fastest — tap “Talk to us”. You can also email info@mindurmind.org.in. ${brand.name} is based in ${brand.city}, Gujarat.`,
      },
    ],
  },
}

const hi: HomeCopy = {
  problems: {
    eyebrow: 'अपनी समस्या से शुरू करें',
    title: 'आप क्या हल करना चाहते हैं?',
    cards: [
      {
        id: 'learning',
        pillar: 'ब्रेन',
        pain: '“पूरा पेज पढ़ता हूं, पर याद नहीं रहता।” / “कुछ ही मिनटों में ध्यान भटक जाता है।”',
        audience: 'स्कूल-कॉलेज के विद्यार्थियों, परीक्षा की तैयारी करने वालों और कामकाजी लोगों के लिए — अभिभावक अपने बच्चे का नामांकन कर सकते हैं',
        programs: [{ name: programs.sharpBrain.nameHi, href: programs.sharpBrain.url, priceLine: qsrFrom === null ? null : `${inr(qsrFrom)} एकमुश्त`, livePrice: true }],
        cta: { label: 'Sharp Brain™ देखें', href: programs.sharpBrain.url },
        extras: [{ label: 'मुफ़्त Reading और Memory Test दें →', href: '/reading-memory-test' }],
        note: 'तेज़ पढ़ें, समझ के साथ। ज़्यादा देर फोकस करें। ज़्यादा याद रखें। — 7 लाइव क्लासेस + रोज़ ऐप अभ्यास, Day 1 से Day 30 तक नापा हुआ।',
      },
      {
        id: 'work',
        pillar: 'ब्रेन · काम',
        pain: '“मुझे काम के दबाव में शांत फोकस और साफ़ फ़ैसले चाहिए।”',
        audience: 'लीडर्स, फाउंडर्स और सीनियर पेशेवरों के लिए',
        programs: [
          {
            name: programs.executiveWorkshop.nameHi,
            href: programs.executiveWorkshop.url,
            priceLine: execFrom === null ? null : `${inr(execFrom)} से`,
          },
        ],
        cta: { label: 'वर्कशॉप देखें', href: programs.executiveWorkshop.url },
        extras: [{ label: 'कंपनियों के लिए →', href: `${programs.executiveWorkshop.url}#corporate` }],
        note: null,
      },
      {
        id: 'mind',
        pillar: 'माइंड',
        pain: '“मेरा दिमाग रुकता ही नहीं — ओवरथिंकिंग, तनाव, चिंता।”',
        audience: 'ओवरथिंकिंग में फंसे वयस्कों के लिए (हिंदी में)',
        programs: [
          {
            name: programs.overthinkingReset.nameHi,
            href: programs.overthinkingReset.url,
            priceLine: resetFrom === null ? null : `${inr(resetFrom)} से`,
          },
        ],
        cta: { label: '21-दिवसीय रीसेट शुरू करें', href: programs.overthinkingReset.url },
        extras: [{ label: `व्यक्तिगत मदद चाहिए? ${programs.oneOnOneCoaching.nameHi} →`, href: programs.oneOnOneCoaching.url }],
        note: null,
      },
      {
        id: 'meditation',
        pillar: 'मेडिटेशन',
        pain: '“मुझे सच्ची आंतरिक शांति और गहरा ध्यान चाहिए।”',
        audience: 'गहरे, मार्गदर्शित अभ्यास के लिए तैयार वयस्कों के लिए',
        programs: [
          { name: programs.onlineRetreat.nameHi, href: programs.onlineRetreat.url, priceLine: null },
          {
            name: programs.residentialRetreat.nameHi,
            href: programs.residentialRetreat.url,
            priceLine: residentialFrom === null ? null : `${inr(residentialFrom)} से`,
          },
        ],
        cta: { label: 'ऑनलाइन रिट्रीट देखें', href: programs.onlineRetreat.url },
        extras: [{ label: 'रेजिडेंशियल रिट्रीट्स →', href: programs.residentialRetreat.url }],
        note: null,
      },
    ],
  },
  startFree: {
    eyebrow: 'फ्री में शुरू करें',
    title: 'अभी तय नहीं? एक फ्री कदम से शुरू करें।',
    items: [
      { title: 'मुफ़्त Reading और Memory Test', desc: 'लगभग 3 मिनट · पढ़ने की रफ़्तार, याददाश्त और याद टिकना', href: '/reading-memory-test', cta: 'टेस्ट दें' },
      { title: 'ओवरथिंकिंग टेस्ट', desc: '2 मिनट · एक सेल्फ-अवेयरनेस चेक, निदान नहीं', href: '/mind-assessment', cta: 'टेस्ट दें' },
    ],
  },
  proof: {
    eyebrow: 'वीडियो पर असली विद्यार्थी',
    title: 'उन लोगों से सुनें जिन्होंने मेहनत की',
    desc: 'हमारे YouTube चैनल से बिना स्क्रिप्ट के वीडियो रिव्यूज़।',
    tabs: { learning: 'सीखना', meditation: 'मेडिटेशन' },
    playlistCta: 'YouTube पर सभी वीडियो देखें',
    learningNote: 'पहले के बैच से (तब इस प्रोग्राम का नाम Quantum Speed Reading था)',
  },
  how: {
    eyebrow: 'हम कैसे काम करते हैं',
    title: 'मापें। सीखें। रोज़ अभ्यास करें। फिर मापें।',
    steps: [
      { title: 'मापें', desc: 'एक बेसलाइन से शुरू करें — दिन 1 पर आपकी रीडिंग स्पीड, समझ या तनाव स्कोर।' },
      { title: 'सीखें', desc: `${trainer.nameHi} के साथ लाइव तकनीक सीखें — कदम-दर-कदम, रिकॉर्डिंग नहीं।` },
      { title: 'रोज़ अभ्यास', desc: 'ऐप या WhatsApp पर छोटे दैनिक सेशन — आमतौर पर 10 से 20 मिनट।' },
      { title: 'फिर मापें', desc: 'अपने ही दिन 1 के बेसलाइन से तुलना करें, ताकि प्रगति मापी जाए, दावा न की जाए।' },
    ],
    eegLine: 'ऑफलाइन वर्कशॉप में एक लाइव EEG ब्रेन-स्टेट डेमो शामिल है — सीखने और एंगेजमेंट के लिए, मेडिकल टेस्ट नहीं।',
  },
  about: { eyebrow: 'आपके कोच', readStory: 'उनकी कहानी पढ़ें →' },
  upcoming: { eyebrow: 'आगामी लाइव इवेंट', title: 'हमसे व्यक्तिगत रूप से मिलें', from: 'से', cta: 'विवरण देखें' },
  organisations: {
    eyebrow: 'संस्थाओं के लिए',
    title: 'टीमों और स्कूलों के लिए ब्रेन परफॉर्मेंस ट्रेनिंग',
    desc: 'कॉर्पोरेट टीमों के लिए फोकस, तनाव और स्पष्ट निर्णय पर वर्कशॉप, और स्कूलों के लिए Sharp Brain — विद्यार्थियों के लिए फोकस, मेमोरी, स्मार्ट रीडिंग और मोबाइल डिसिप्लिन।',
    ctaCorporate: 'कॉर्पोरेट टीमों के लिए',
    ctaSchools: 'स्कूलों के लिए',
  },
  faq: {
    eyebrow: 'सवाल',
    title: 'शुरू करने से पहले',
    items: [
      {
        question: 'मेरे लिए कौन सा प्रोग्राम सही है?',
        answer: `पढ़ना, ध्यान और याददाश्त → Sharp Brain: सेल्फ़-पेस्ड (₹${SHARP_BRAIN_PRICES.selfPacedInr.toLocaleString('en-IN')}) या लाइव बैच (₹${SHARP_BRAIN_PRICES.liveInr.toLocaleString('en-IN')})। तनाव, एंग्ज़ायटी, माइंडसेट, परफ़ॉर्मेंस या कोई आध्यात्मिक साधना → ${programs.oneOnOneCoaching.nameHi}। तय नहीं? मुफ़्त Reading & Memory Test दें या हमें WhatsApp पर संदेश भेजें।`,
      },
      {
        question: 'यह विज्ञान-आधारित है या आध्यात्मिक?',
        answer:
          'दोनों, साफ़ तौर पर अलग-अलग। Sharp Brain विज्ञान पर आधारित प्रशिक्षण है — रीडिंग, ध्यान और याददाश्त के तरीके, आपके अपने Day 1 से नापे गए। ऑरा रीडिंग, चक्र एक्टिवेशन और मेडिटेशन जैसी आध्यात्मिक साधनाएँ सिर्फ़ 1-on-1 पर्सनल सेशन में होती हैं। इनमें से कुछ भी थेरेपी या मेडिकल इलाज नहीं है; अगर आपका इलाज चल रहा है या आप संकट में हैं, तो कृपया किसी लाइसेंस-प्राप्त पेशेवर से सलाह लें।',
      },
      {
        question: 'ऑनलाइन या ऑफलाइन?',
        answer: 'Sharp Brain ऑनलाइन है: ऐप और 7 क्लास — लाइव बैच में Zoom पर लाइव, सेल्फ़-पेस्ड में रिकॉर्डेड। पर्सनल सेशन ऑनलाइन या आमने-सामने होते हैं।',
      },
      {
        question: 'हिंदी या अंग्रेज़ी?',
        answer: 'Sharp Brain की क्लास आसान हिंदी में होती हैं, ज़रूरी अंग्रेज़ी शब्दों के साथ। पर्सनल सेशन के लिए enquiry में अपनी भाषा बता दीजिए।',
      },
      {
        question: 'रिफंड के बारे में?',
        answer: `हर प्रोग्राम की शर्तें हमारी रिफंड व कैंसिलेशन नीति पेज पर हैं। Sharp Brain लाइव बैच के साथ एक रिज़ल्ट गारंटी भी है: ${qsrGuarantee.hi.statement}`,
      },
      {
        question: 'आपसे संपर्क कैसे करें?',
        answer: `WhatsApp सबसे तेज़ है — “हमसे बात करें” पर टैप करें। आप info@mindurmind.org.in पर ईमेल भी कर सकते हैं। ${brand.name} वडोदरा, गुजरात में स्थित है।`,
      },
    ],
  },
}

export const homeCopy: Record<Lang, HomeCopy> = { en, hi }
