import { appFeatures, programs, qsrGuarantee } from '@/config/site.config'
import type { Lang } from '@/lib/i18n'

// Wording tied to the Day 1 vs Day 30 assessment (Phase 8, Item 11): shown
// only while appFeatures.dayThirtyComparison is on, so the page never
// promises more than the app does (docs/sharp-brain-deferred-claims.md).
const D30 = appFeatures.dayThirtyComparison

// Copy for /programs/sharp-brain (site-rebuild Phase 5B), EN + HI.
// Sharp Brain™ — Focus · Memory · Smart Reading, formerly "Quantum Speed
// Reading". Names, prices and the guarantee come from site.config.ts.
// Claims rule: no multipliers, no "100% retention", no left/right-brain
// language; improvement is always "measured from your own Day 1 baseline".

export type AudienceTab = { id: 'parents' | 'students' | 'professionals'; label: string; title: string; points: string[] }

export type SharpBrainCopy = {
  hero: {
    h1: string
    sub: string
    positioning: string
    parentLine: string
    ctaPrimary: string
    ctaSecondary: string
  }
  audiences: { eyebrow: string; title: string; tabs: AudienceTab[] }
  skills: { eyebrow: string; title: string; items: { title: string; desc: string }[] }
  how: { eyebrow: string; title: string; steps: { title: string; desc: string }[]; eegLine: string }
  formats: {
    eyebrow: string
    title: string
    batchLine: string
    priceOnRequest: string
    items: { id: 'workshop' | 'program' | 'self'; name: string; desc: string; cta: string; recommended?: boolean }[]
    oneTime: string
    orgLine: { lead: string; schools: string; corporate: string }
  }
  parents: { eyebrow: string; title: string; points: string[] }
  proof: { eyebrow: string; title: string; oldLabel: string; playlistCta: string }
  trainer: { eyebrow: string; readStory: string }
  guarantee: { title: string; statement: string; request: string; policy: string }
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] }
  final: { title: string; cta: string; freeTitle: string; freeDesc: string; starter: string; speedTest: string; liveSession: string }
  sticky: { cta: string }
}

const p = programs

const en: SharpBrainCopy = {
  hero: {
    h1: 'Sharp Brain™ — Focus · Memory · Smart Reading',
    sub: `Reads but doesn’t remember? Attention lost to the phone? In 30 days, build focus, memory and reading skills — ${D30 ? 'measured from Day 1 to Day 30' : 'with your progress tracked from Day 1'}.`,
    positioning:
      'A cognitive skills program for focus, memory, smart reading and mobile discipline — with improvement measured from your own Day 1 to Day 30.',
    parentLine: 'From screen time to focus time',
    ctaPrimary: 'See formats & prices',
    ctaSecondary: `Try the ${p.focusStarter.name}`,
  },
  audiences: {
    eyebrow: 'Who it’s for',
    title: 'Choose your path',
    tabs: [
      {
        id: 'parents',
        label: 'For Parents',
        title: 'For parents of children aged about 10–17',
        points: [
          'Homework and reading that used to drag on start finishing sooner',
          'Simple screen-time habits: the 20-20-20 rule, posture and eye care, phone away before practice',
          D30 ? 'You see the Day 1 and Day 30 results side by side' : 'A parent view in the app showing reading speed, comprehension and practice consistency',
        ],
      },
      {
        id: 'students',
        label: 'For Students & Exam Aspirants',
        title: 'For students and exam aspirants',
        points: [
          'UPSC, banking and government exams: cover current affairs and editorials in less time, leaving more time to revise',
          'JEE and NEET: remember diagrams, formulas and long theory chapters with visual learning',
          'Board exams: turn long chapters into structured notes and mind maps instead of rote memorisation',
        ],
      },
      {
        id: 'professionals',
        label: 'For Working Professionals',
        title: 'For working professionals',
        points: [
          'Get through reports, research and books faster, without losing what they say',
          'Hold your focus through long documents and meetings',
          'Keep your phone from eating your working day',
        ],
      },
    ],
  },
  skills: {
    eyebrow: 'The 5 skills',
    title: 'What Sharp Brain trains',
    items: [
      { title: 'Focus', desc: 'Short daily attention drills so you can stay with one task for longer.' },
      { title: 'Memory & Retention', desc: 'Practical memory techniques — memory palace, peg system, acronyms — so what you study stays.' },
      { title: 'Smart Reading', desc: 'Reading with recall: read in meaningful chunks, with fewer re-reads, while keeping comprehension.' },
      { title: 'Visual Learning', desc: 'Turn text into mental images and mind maps, a well-established way to remember more.' },
      { title: 'Mobile Discipline', desc: 'Simple screen-time habits — phone away before practice, the 20-20-20 rule, posture and eye care.' },
    ],
  },
  how: {
    eyebrow: 'How it works',
    title: D30 ? 'Measure, train, practise, re-measure' : 'Measure, train, practise, track',
    steps: [
      {
        title: 'Day 1 assessment',
        desc: D30
          ? 'A self-paced reading speed check, 5 comprehension questions and a 2-minute attention task — your own baseline.'
          : 'Reading speed and comprehension — your own baseline.',
      },
      { title: '7 live classes', desc: 'Live classes with Dr. Kapil Dev Sharma across the 30 days — not recordings.' },
      { title: '30 days of app practice', desc: 'About 10 minutes a day in the Mind Ur Mind App, with progress tracked automatically.' },
      D30
        ? { title: 'Day 30 re-assessment', desc: 'The same measures again, with a different passage of the same level, compared with your Day 1 results.' }
        : { title: 'Track your progress', desc: 'Your reading speed and comprehension are tracked through the 30 days, so you can see how far you have come from Day 1.' },
    ],
    eegLine: 'In-person students in Vadodara can also join live EEG brain-state sessions — for learning and engagement, not a medical test.',
  },
  formats: {
    eyebrow: 'Formats & prices',
    title: 'Choose how you want to learn',
    batchLine: 'New 30-Day Program batches start on the 7th and the 25th of every month.',
    priceOnRequest: 'Price shared on request',
    items: [
      { id: 'workshop', name: p.sharpBrainWorkshop.name, desc: p.sharpBrainWorkshop.format + '. ' + p.sharpBrainWorkshop.outcome, cta: 'Ask for the next dates' },
      { id: 'program', name: p.sharpBrain.name, desc: p.sharpBrain.format + '. The complete program with live guidance.', cta: 'Enrol now', recommended: true },
      { id: 'self', name: p.sharpBrainSelfLearning.name, desc: p.sharpBrainSelfLearning.format + '. Learn at your own pace.', cta: 'Ask on WhatsApp' },
    ],
    oneTime: 'one-time',
    orgLine: { lead: 'For a whole class, school or team:', schools: 'Sharp Brain for Schools', corporate: 'For Corporate Teams' },
  },
  parents: {
    eyebrow: 'For parents',
    title: 'From screen time to focus time',
    points: [
      'Simple screen-time habits: phone away before practice, the 20-20-20 rule, posture and eye care',
      'About 10 minutes of guided daily practice in the Mind Ur Mind App',
      D30 ? 'You see the Day 1 and Day 30 results side by side' : 'A parent view in the app showing reading speed, comprehension and practice consistency',
    ],
  },
  proof: {
    eyebrow: 'Real learners',
    title: 'Video reviews',
    oldLabel: 'From earlier batches (the program was then called Quantum Speed Reading)',
    playlistCta: 'See all video reviews on YouTube',
  },
  trainer: { eyebrow: 'Your trainer', readStory: 'Read his full story →' },
  guarantee: {
    title: qsrGuarantee.en.title,
    statement: qsrGuarantee.en.statement,
    request: qsrGuarantee.en.requestWindow,
    policy: 'See the Refund & Cancellation Policy',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you enrol',
    items: [
      {
        question: 'Is this midbrain activation or blindfold reading?',
        answer: 'No. No blindfolds, no magic claims — measurable skill training.',
      },
      {
        question: 'What happened to Quantum Speed Reading?',
        answer: 'It is now Sharp Brain — same core training, clearer name, stronger focus on memory and focus.',
      },
      {
        question: 'Is it suitable for complete beginners?',
        answer: 'Yes. The program assumes no prior skill and starts from your own Day 1 baseline; most learners start as complete beginners.',
      },
      {
        question: 'How much time does it take each day?',
        answer: 'About 10 minutes a day in the app, plus the 7 live classes spread across the 30 days.',
      },
      {
        question: 'Which age groups is it for?',
        answer: 'Children of about 10–17 (with a parent), students and exam aspirants, and working professionals. The pace adapts to where you start.',
      },
      {
        question: `What do I get for ₹${p.sharpBrain.prices[0]?.amountInr.toLocaleString('en-IN') ?? ''}?`,
        answer:
          'The full 30-day app curriculum, all 7 live classes with Dr. Kapil Dev Sharma, reading speed and comprehension tracking from Day 1 to Day 30, and app access for the full 30 days — a one-time enrolment, not a subscription.',
      },
      {
        question: 'What if it doesn’t work for me?',
        answer: `${qsrGuarantee.en.statement} ${qsrGuarantee.en.requestWindow}`,
      },
      {
        question: 'What happens right after I pay?',
        answer: 'Enrolment is confirmed personally by Dr. Kapil’s team, not an automated system — you’ll hear from us with your batch schedule shortly after checkout.',
      },
    ],
  },
  final: {
    title: 'Start your 30 days',
    cta: 'Enrol in the 30-Day Program',
    freeTitle: 'Not ready yet? Start free.',
    freeDesc: 'No payment needed.',
    starter: `Try the ${p.focusStarter.name}`,
    speedTest: 'Take the free Reading Speed Test',
    liveSession: 'Join a free live Q&A with Dr. Kapil',
  },
  sticky: { cta: 'Enrol' },
}

const hi: SharpBrainCopy = {
  hero: {
    h1: 'Sharp Brain™ — Focus · Memory · Smart Reading',
    sub: `पढ़ता है पर याद नहीं रहता? ध्यान मोबाइल में रहता है? 30 दिन में focus, memory और reading की skills — ${D30 ? 'Day 1 से Day 30 तक नापी हुई' : 'Day 1 से आपकी प्रगति ट्रैक होती है'}।`,
    positioning: 'Focus, Memory, Smart Reading और Mobile Discipline का cognitive skills program — Day 1 से Day 30 तक नापा हुआ सुधार।',
    parentLine: 'Screen से Focus तक',
    ctaPrimary: 'फॉर्मेट और कीमत देखें',
    ctaSecondary: `${p.focusStarter.nameHi} आज़माएं`,
  },
  audiences: {
    eyebrow: 'यह किसके लिए है',
    title: 'अपना रास्ता चुनें',
    tabs: [
      {
        id: 'parents',
        label: 'अभिभावकों के लिए',
        title: 'लगभग 10–17 साल के बच्चों के अभिभावकों के लिए',
        points: [
          'जो होमवर्क और पढ़ाई पहले खिंचती थी, वह जल्दी पूरी होने लगती है',
          'स्क्रीन-टाइम की आसान आदतें: 20-20-20 नियम, सही बैठने और आंखों की देखभाल, अभ्यास से पहले फ़ोन दूर',
          D30 ? 'आप दिन 1 और दिन 30 के नतीजे साथ-साथ देखते हैं' : 'ऐप में अभिभावकों के लिए एक व्यू, जिसमें रीडिंग स्पीड, समझ और अभ्यास की नियमितता दिखती है',
        ],
      },
      {
        id: 'students',
        label: 'विद्यार्थियों व परीक्षा उम्मीदवारों के लिए',
        title: 'विद्यार्थियों और परीक्षा उम्मीदवारों के लिए',
        points: [
          'UPSC, बैंकिंग और सरकारी परीक्षाएं: करंट अफेयर्स और संपादकीय कम समय में पढ़ें, दोहराने के लिए ज़्यादा समय बचे',
          'JEE और NEET: विज़ुअल लर्निंग से डायग्राम, फ़ॉर्मूले और लंबे थ्योरी अध्याय याद रखें',
          'बोर्ड परीक्षाएं: रटने की जगह लंबे अध्यायों को संरचित नोट्स और माइंड मैप में बदलें',
        ],
      },
      {
        id: 'professionals',
        label: 'कामकाजी पेशेवरों के लिए',
        title: 'कामकाजी पेशेवरों के लिए',
        points: [
          'रिपोर्ट्स, रिसर्च और किताबें तेज़ी से पढ़ें, बिना यह खोए कि उनमें क्या लिखा है',
          'लंबे दस्तावेज़ों और मीटिंग्स में फोकस बनाए रखें',
          'फ़ोन को अपना कामकाजी दिन खाने से रोकें',
        ],
      },
    ],
  },
  skills: {
    eyebrow: '5 स्किल्स',
    title: 'Sharp Brain क्या प्रशिक्षित करता है',
    items: [
      { title: 'Focus', desc: 'छोटे दैनिक ध्यान अभ्यास, ताकि आप एक काम पर लंबे समय तक टिक सकें।' },
      { title: 'Memory & Retention', desc: 'व्यावहारिक मेमोरी तकनीकें — मेमोरी पैलेस, पेग सिस्टम, एक्रोनिम — ताकि जो पढ़ें वह याद रहे।' },
      { title: 'Smart Reading', desc: 'याद रखते हुए पढ़ना: अर्थपूर्ण हिस्सों में पढ़ें, कम दोहराव के साथ, समझ बनाए रखते हुए।' },
      { title: 'Visual Learning', desc: 'टेक्स्ट को मानसिक चित्रों और माइंड मैप में बदलें — ज़्यादा याद रखने का एक स्थापित तरीका।' },
      { title: 'Mobile Discipline', desc: 'स्क्रीन-टाइम की आसान आदतें — अभ्यास से पहले फ़ोन दूर, 20-20-20 नियम, सही बैठना और आंखों की देखभाल।' },
    ],
  },
  how: {
    eyebrow: 'यह कैसे काम करता है',
    title: D30 ? 'मापें, सीखें, अभ्यास करें, फिर मापें' : 'मापें, सीखें, अभ्यास करें, प्रगति देखें',
    steps: [
      {
        title: 'दिन 1 असेसमेंट',
        desc: D30
          ? 'अपनी गति से पढ़ने की स्पीड जांच, समझ के 5 सवाल और 2 मिनट का ध्यान टास्क — आपका अपना बेसलाइन।'
          : 'रीडिंग स्पीड और समझ — आपका अपना बेसलाइन।',
      },
      { title: '7 लाइव क्लासेस', desc: '30 दिनों में डॉ. कपिल देव शर्मा के साथ लाइव क्लासेस — रिकॉर्डिंग नहीं।' },
      { title: '30 दिन ऐप अभ्यास', desc: 'Mind Ur Mind App में रोज़ लगभग 10 मिनट, प्रगति अपने-आप ट्रैक होती है।' },
      D30
        ? { title: 'दिन 30 दोबारा असेसमेंट', desc: 'वही माप दोबारा, उसी स्तर के एक अलग पैसेज के साथ, आपके दिन 1 के नतीजों से तुलना करते हुए।' }
        : { title: 'अपनी प्रगति देखें', desc: 'पूरे 30 दिन आपकी रीडिंग स्पीड और समझ ट्रैक होती है, ताकि आप देख सकें कि दिन 1 से कितना आगे आए।' },
    ],
    eegLine: 'वडोदरा में व्यक्तिगत रूप से आने वाले विद्यार्थी लाइव EEG ब्रेन-स्टेट सेशन में भी शामिल हो सकते हैं — सीखने और एंगेजमेंट के लिए, मेडिकल टेस्ट नहीं।',
  },
  formats: {
    eyebrow: 'फॉर्मेट और कीमत',
    title: 'चुनें कि आप कैसे सीखना चाहते हैं',
    batchLine: '30-दिवसीय प्रोग्राम के नए बैच हर महीने की 7 और 25 तारीख को शुरू होते हैं।',
    priceOnRequest: 'कीमत पूछने पर बताई जाएगी',
    items: [
      { id: 'workshop', name: p.sharpBrainWorkshop.nameHi, desc: '2 दिन · ऑनलाइन या ऑफलाइन (शहर-वार बैच)। फोकस, मेमोरी और स्मार्ट रीडिंग का लाइव, व्यावहारिक प्रशिक्षण।', cta: 'अगली तारीखें पूछें' },
      { id: 'program', name: p.sharpBrain.nameHi, desc: 'ऑनलाइन · 7 लाइव क्लासेस + 30 दिन ऐप अभ्यास। लाइव मार्गदर्शन के साथ पूरा प्रोग्राम।', cta: 'अभी नामांकन करें', recommended: true },
      { id: 'self', name: p.sharpBrainSelfLearning.nameHi, desc: 'रिकॉर्डेड लेसन + 30 दिन ऐप अभ्यास। अपनी गति से सीखें।', cta: 'WhatsApp पर पूछें' },
    ],
    oneTime: 'एकमुश्त',
    orgLine: { lead: 'पूरी क्लास, स्कूल या टीम के लिए:', schools: 'स्कूलों के लिए Sharp Brain', corporate: 'कॉर्पोरेट टीमों के लिए' },
  },
  parents: {
    eyebrow: 'अभिभावकों के लिए',
    title: 'Screen से Focus तक',
    points: [
      'स्क्रीन-टाइम की आसान आदतें: अभ्यास से पहले फ़ोन दूर, 20-20-20 नियम, सही बैठना और आंखों की देखभाल',
      'Mind Ur Mind App में रोज़ लगभग 10 मिनट का गाइडेड अभ्यास',
      D30 ? 'आप दिन 1 और दिन 30 के नतीजे साथ-साथ देखते हैं' : 'ऐप में अभिभावकों के लिए एक व्यू, जिसमें रीडिंग स्पीड, समझ और अभ्यास की नियमितता दिखती है',
    ],
  },
  proof: {
    eyebrow: 'असली विद्यार्थी',
    title: 'वीडियो रिव्यूज़',
    oldLabel: 'पहले के बैच से (तब इस प्रोग्राम का नाम Quantum Speed Reading था)',
    playlistCta: 'YouTube पर सभी वीडियो रिव्यूज़ देखें',
  },
  trainer: { eyebrow: 'आपके ट्रेनर', readStory: 'पूरी कहानी पढ़ें →' },
  guarantee: {
    title: qsrGuarantee.hi.title,
    statement: qsrGuarantee.hi.statement,
    request: qsrGuarantee.hi.requestWindow,
    policy: 'रिफंड और कैंसिलेशन नीति देखें',
  },
  faq: {
    eyebrow: 'सवाल',
    title: 'नामांकन से पहले',
    items: [
      { question: 'क्या यह मिडब्रेन एक्टिवेशन या ब्लाइंडफोल्ड रीडिंग है?', answer: 'नहीं। कोई आंखों पर पट्टी नहीं, कोई जादुई दावे नहीं — मापने योग्य स्किल ट्रेनिंग।' },
      { question: 'Quantum Speed Reading का क्या हुआ?', answer: 'अब इसका नाम Sharp Brain है — वही मूल प्रशिक्षण, साफ़ नाम, और मेमोरी व फोकस पर ज़्यादा ज़ोर।' },
      { question: 'क्या यह बिल्कुल नए लोगों के लिए है?', answer: 'हां। प्रोग्राम किसी पूर्व कौशल की उम्मीद नहीं करता और आपके अपने दिन 1 के बेसलाइन से शुरू होता है; ज़्यादातर विद्यार्थी बिल्कुल शुरुआत से आते हैं।' },
      { question: 'रोज़ कितना समय लगता है?', answer: 'ऐप में रोज़ लगभग 10 मिनट, और 30 दिनों में फैली 7 लाइव क्लासेस।' },
      { question: 'यह किस उम्र के लिए है?', answer: 'लगभग 10–17 साल के बच्चे (अभिभावक के साथ), विद्यार्थी और परीक्षा उम्मीदवार, और कामकाजी पेशेवर। गति आपकी शुरुआती स्थिति के अनुसार ढलती है।' },
      {
        question: `₹${p.sharpBrain.prices[0]?.amountInr.toLocaleString('en-IN') ?? ''} में क्या मिलता है?`,
        answer: 'पूरा 30-दिवसीय ऐप पाठ्यक्रम, डॉ. कपिल देव शर्मा के साथ सभी 7 लाइव क्लासेस, दिन 1 से दिन 30 तक रीडिंग स्पीड और समझ की ट्रैकिंग, और पूरे 30 दिन का ऐप एक्सेस — एकमुश्त नामांकन, कोई सब्सक्रिप्शन नहीं।',
      },
      { question: 'अगर यह मेरे लिए काम न करे तो?', answer: `${qsrGuarantee.hi.statement} ${qsrGuarantee.hi.requestWindow}` },
      { question: 'भुगतान के तुरंत बाद क्या होता है?', answer: 'नामांकन की पुष्टि डॉ. कपिल की टीम व्यक्तिगत रूप से करती है, कोई ऑटोमेटेड सिस्टम नहीं — चेकआउट के तुरंत बाद हम आपसे आपके बैच शेड्यूल के साथ संपर्क करेंगे।' },
    ],
  },
  final: {
    title: 'अपने 30 दिन शुरू करें',
    cta: '30-दिवसीय प्रोग्राम में नामांकन करें',
    freeTitle: 'अभी तैयार नहीं? फ्री में शुरू करें।',
    freeDesc: 'कोई भुगतान नहीं।',
    starter: `${p.focusStarter.nameHi} आज़माएं`,
    speedTest: 'फ्री रीडिंग स्पीड टेस्ट दें',
    liveSession: 'डॉ. कपिल के साथ फ्री लाइव Q&A में शामिल हों',
  },
  sticky: { cta: 'नामांकन' },
}

export const sharpBrainCopy: Record<Lang, SharpBrainCopy> = { en, hi }
