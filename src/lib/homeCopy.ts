import { brand, programs, qsrGuarantee, trainer } from '@/config/site.config'
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

const qsrFrom = minPrice('qsr')
const execFrom = minPrice('executiveWorkshop')
const resetFrom = minPrice('overthinkingReset')
const residentialFrom = minPrice('residentialRetreat')

function trustLine(lang: Lang): string {
  return lang === 'hi'
    ? `${trainer.years.total} वर्ष · ${trainer.learners} विद्यार्थी · ${trainer.workshops} वर्कशॉप्स`
    : `${trainer.years.total} years · ${trainer.learners} learners · ${trainer.workshops} workshops`
}

export type ProblemCard = {
  id: 'learning' | 'work' | 'mind' | 'meditation'
  pillar: string
  pain: string
  audience: string
  programs: { name: string; href: string; priceLine: string | null }[]
  cta: { label: string; href: string }
  extras: { label: string; href: string }[]
  note: string | null
}

export type HomeCopy = {
  hero: { h1: string; sub: string; trust: string; ctaPrimary: string; ctaSecondary: string; photoAlt: string }
  problems: { eyebrow: string; title: string; cards: ProblemCard[] }
  startFree: { eyebrow: string; title: string; items: { title: string; desc: string; href: string; cta: string }[] }
  proof: { eyebrow: string; title: string; desc: string; tabs: { learning: string; meditation: string }; playlistCta: string }
  how: { eyebrow: string; title: string; steps: { title: string; desc: string }[]; eegLine: string }
  about: { eyebrow: string; readStory: string }
  upcoming: { eyebrow: string; title: string; from: string; cta: string }
  organisations: { eyebrow: string; title: string; desc: string; cta: string }
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] }
}

const en: HomeCopy = {
  hero: {
    h1: brand.tagline,
    sub: `${trainer.name} — ${trainer.en.title}. Practical, science-informed training for focus, learning, overthinking and inner calm.`,
    trust: trustLine('en'),
    ctaPrimary: 'Find the right program for you',
    ctaSecondary: 'Talk to us',
    photoAlt: trainer.photo.alt,
  },
  problems: {
    eyebrow: 'Start with your problem',
    title: 'What would you like to solve?',
    cards: [
      {
        id: 'learning',
        pillar: 'Brain',
        pain: '“I read and study for hours but can’t remember.”',
        audience: 'For students, exam aspirants and professionals',
        programs: [{ name: programs.qsr.name, href: programs.qsr.url, priceLine: qsrFrom === null ? null : `${inr(qsrFrom)} one-time` }],
        cta: { label: 'See the 30-day program', href: programs.qsr.url },
        extras: [{ label: 'For my child →', href: `${programs.qsr.url}#every-age` }],
        note: 'Prefer in person? Offline workshops with a live EEG brain-state demo in 6 cities.',
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
      { title: 'Reading Speed Test', desc: '2 minutes · your real reading speed and comprehension', href: '/programs/quantum-speed-reading/speed-test', cta: 'Take the test' },
      { title: 'Overthinking Test', desc: '2 minutes · a self-awareness check, not a diagnosis', href: '/mind-assessment', cta: 'Take the test' },
      { title: programs.focusStarter.name, desc: 'About 10 minutes a day · free for 7 days', href: programs.focusStarter.url, cta: 'Start free' },
    ],
  },
  proof: {
    eyebrow: 'Real learners on video',
    title: 'Hear it from people who did the work',
    desc: 'Unscripted video reviews from our YouTube channel.',
    tabs: { learning: 'Learning', meditation: 'Meditation' },
    playlistCta: 'See all video reviews on YouTube',
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
    desc: 'Workshops on focus, stress and clear decision-making for corporate teams, and reading and focus programs for schools.',
    cta: 'Talk about your team',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you start',
    items: [
      {
        question: 'Which program is right for me?',
        answer: `Start with the problem you want to solve. Reading and remembering → ${programs.qsr.name}. Overthinking and stress → the ${programs.overthinkingReset.name}, or ${programs.oneOnOneCoaching.name} for personal help. Calm focus at work → the ${programs.executiveWorkshop.name}. Deeper meditation → the retreats. Not sure? Take a free test or message us on WhatsApp.`,
      },
      {
        question: 'Is this science-based or spiritual?',
        answer:
          'Both, clearly separated. The brain and mind programs are science-informed training — reading, attention, memory and stress-management techniques, measured from your own baseline. The retreats teach traditional meditation practices. None of it is therapy or medical treatment; if you are in treatment or in crisis, please consult a licensed professional.',
      },
      {
        question: 'Online or offline?',
        answer: `Most programs run online and live. In-person options: offline Quantum Speed Reading workshops, the ${programs.executiveWorkshop.name} in Mumbai, and residential retreats in Lonavala and Rishikesh.`,
      },
      {
        question: 'Hindi or English?',
        answer: `The ${programs.overthinkingReset.name} is taught in Hindi. For other programs, message us on WhatsApp to confirm the language of your batch. This website is available in English and Hindi — use the EN / हिंदी switch at the top.`,
      },
      {
        question: 'What about refunds?',
        answer: `Each program’s terms are on our Refund & Cancellation Policy page. ${programs.qsr.name} also carries a results guarantee: ${qsrGuarantee.en.statement}`,
      },
      {
        question: 'How do I contact you?',
        answer: `WhatsApp is fastest — tap “Talk to us”. You can also email info@mindurmind.org.in. ${brand.name} is based in ${brand.city}, Gujarat.`,
      },
    ],
  },
}

const hi: HomeCopy = {
  hero: {
    h1: brand.taglineHi,
    sub: `${trainer.nameHi} — ${trainer.hi.title}। फोकस, सीखने, ओवरथिंकिंग और आंतरिक शांति के लिए व्यावहारिक, विज्ञान-सूचित प्रशिक्षण।`,
    trust: trustLine('hi'),
    ctaPrimary: 'अपने लिए सही प्रोग्राम खोजें',
    ctaSecondary: 'हमसे बात करें',
    photoAlt: trainer.photo.alt,
  },
  problems: {
    eyebrow: 'अपनी समस्या से शुरू करें',
    title: 'आप क्या हल करना चाहते हैं?',
    cards: [
      {
        id: 'learning',
        pillar: 'ब्रेन',
        pain: '“मैं घंटों पढ़ता हूं, पर याद नहीं रहता।”',
        audience: 'विद्यार्थियों, परीक्षा उम्मीदवारों और पेशेवरों के लिए',
        programs: [{ name: programs.qsr.nameHi, href: programs.qsr.url, priceLine: qsrFrom === null ? null : `${inr(qsrFrom)} एकमुश्त` }],
        cta: { label: '30-दिवसीय प्रोग्राम देखें', href: programs.qsr.url },
        extras: [{ label: 'मेरे बच्चे के लिए →', href: `${programs.qsr.url}#every-age` }],
        note: 'व्यक्तिगत रूप से सीखना पसंद है? 6 शहरों में लाइव EEG ब्रेन-स्टेट डेमो के साथ ऑफलाइन वर्कशॉप।',
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
      { title: 'रीडिंग स्पीड टेस्ट', desc: '2 मिनट · आपकी असली रीडिंग स्पीड और समझ', href: '/programs/quantum-speed-reading/speed-test', cta: 'टेस्ट दें' },
      { title: 'ओवरथिंकिंग टेस्ट', desc: '2 मिनट · एक सेल्फ-अवेयरनेस चेक, निदान नहीं', href: '/mind-assessment', cta: 'टेस्ट दें' },
      { title: programs.focusStarter.nameHi, desc: 'रोज़ लगभग 10 मिनट · 7 दिन फ्री', href: programs.focusStarter.url, cta: 'फ्री शुरू करें' },
    ],
  },
  proof: {
    eyebrow: 'वीडियो पर असली विद्यार्थी',
    title: 'उन लोगों से सुनें जिन्होंने मेहनत की',
    desc: 'हमारे YouTube चैनल से बिना स्क्रिप्ट के वीडियो रिव्यूज़।',
    tabs: { learning: 'सीखना', meditation: 'मेडिटेशन' },
    playlistCta: 'YouTube पर सभी वीडियो रिव्यूज़ देखें',
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
    desc: 'कॉर्पोरेट टीमों के लिए फोकस, तनाव और स्पष्ट निर्णय पर वर्कशॉप, और स्कूलों के लिए रीडिंग व फोकस प्रोग्राम।',
    cta: 'अपनी टीम के बारे में बात करें',
  },
  faq: {
    eyebrow: 'सवाल',
    title: 'शुरू करने से पहले',
    items: [
      {
        question: 'मेरे लिए कौन सा प्रोग्राम सही है?',
        answer: `उस समस्या से शुरू करें जिसे आप हल करना चाहते हैं। पढ़ना और याद रखना → ${programs.qsr.nameHi}। ओवरथिंकिंग और तनाव → ${programs.overthinkingReset.nameHi}, या व्यक्तिगत मदद के लिए ${programs.oneOnOneCoaching.nameHi}। काम पर शांत फोकस → ${programs.executiveWorkshop.nameHi}। गहरा ध्यान → रिट्रीट्स। तय नहीं? एक फ्री टेस्ट दें या हमें WhatsApp पर संदेश भेजें।`,
      },
      {
        question: 'यह विज्ञान-आधारित है या आध्यात्मिक?',
        answer:
          'दोनों, साफ़ तौर पर अलग-अलग। ब्रेन और माइंड प्रोग्राम विज्ञान-सूचित प्रशिक्षण हैं — रीडिंग, ध्यान, याददाश्त और तनाव-प्रबंधन तकनीकें, आपके अपने बेसलाइन से मापी गईं। रिट्रीट्स पारंपरिक ध्यान अभ्यास सिखाते हैं। इनमें से कुछ भी थेरेपी या मेडिकल इलाज नहीं है; अगर आपका इलाज चल रहा है या आप संकट में हैं, तो कृपया किसी लाइसेंस-प्राप्त पेशेवर से सलाह लें।',
      },
      {
        question: 'ऑनलाइन या ऑफलाइन?',
        answer: `ज़्यादातर प्रोग्राम ऑनलाइन और लाइव चलते हैं। व्यक्तिगत विकल्प: ऑफलाइन क्वांटम स्पीड रीडिंग वर्कशॉप, मुंबई में ${programs.executiveWorkshop.nameHi}, और लोनावला व ऋषिकेश में रेजिडेंशियल रिट्रीट्स।`,
      },
      {
        question: 'हिंदी या अंग्रेज़ी?',
        answer: `${programs.overthinkingReset.nameHi} हिंदी में सिखाया जाता है। बाकी प्रोग्राम के लिए अपने बैच की भाषा WhatsApp पर पूछ लें। यह वेबसाइट अंग्रेज़ी और हिंदी दोनों में है — ऊपर EN / हिंदी स्विच का उपयोग करें।`,
      },
      {
        question: 'रिफंड के बारे में?',
        answer: `हर प्रोग्राम की शर्तें हमारी रिफंड व कैंसिलेशन नीति पेज पर हैं। ${programs.qsr.nameHi} के साथ एक रिज़ल्ट गारंटी भी है: ${qsrGuarantee.hi.statement}`,
      },
      {
        question: 'आपसे संपर्क कैसे करें?',
        answer: `WhatsApp सबसे तेज़ है — “हमसे बात करें” पर टैप करें। आप info@mindurmind.org.in पर ईमेल भी कर सकते हैं। ${brand.name} वडोदरा, गुजरात में स्थित है।`,
      },
    ],
  },
}

export const homeCopy: Record<Lang, HomeCopy> = { en, hi }
