import { trainer } from '@/config/site.config'
import type { Lang } from '@/lib/i18n'

// Copy for /programs/sharp-brain, EN + HI — Sharp Brain for Indian parents
// of Class 6–12 children (founder's final text, 4 Nov 2026; used word for
// word). Short, plain, concrete. Prices, seats and the next class date are
// NOT written here as fixed numbers: they come from the server
// (src/features/sharp-brain-enrol) and are passed in.
// Claims rule: no multipliers, no "100%", no left/right-brain or midbrain
// claims; improvement is always measured against the child's own Day 1.

export type SkillCard = { title: string; quote: string; method: string }

export type SharpBrainCopy = {
  hero: {
    h1: string
    sub: string
    /** "Book a seat for ₹2,999 — first 100 seats"; without the seat line once the intro seats are gone. */
    book: (price: string, firstSeats: number | null) => string
    demo: string
    forWho: string
    /** "Join today — start today · Next live class: Mon, 9 Nov, 8 pm". */
    startToday: (nextClass: string | null) => string
    guarantee: string
    strip: string[]
  }
  pain: { title: string; items: string[] }
  reframe: { title: string; body: string }
  skills: { title: string; cards: SkillCard[] }
  day30: { title: string; items: string[] }
  how: { title: string; steps: string[] }
  parents: { title: string; body: string }
  /** "Your Sharp Brain certificate" — samples only, no speed or percentage promises (see sharpBrainCopy.test.ts). */
  certificate: { eyebrow: string; title: string; intro: string; points: { title: string; desc: string }[]; vary: string; caption: string; certAlt: string; shareAlt: string; enlarge: string }
  proof: { eyebrow: string; title: string; oldLabel: string; playlistCta: string; more: string; fewer: string }
  trainer: { eyebrow: string; title: string; line: string; method: string; readStory: string }
  included: { title: string; items: string[]; memoryKit: string }
  offer: {
    title: (firstSeats: number | null) => string
    oneTime: string
    instalments: string
    perDay: (price: string) => string
    book: (price: string) => string
    questions: string
  }
  faq: { title: string; items: { question: string; answer: string }[] }
  final: { body: (price: string) => string; book: string; ask: string }
  alsoFor: { title: string; lines: string[]; ask: string }
  freeTest: string
  /** The weekly live Q&A line (LIVE_QA in src/config/liveClassCycle.ts). */
  liveQa: string
  sticky: { book: string; whatsapp: string }
  reviews: { metaTitle: string; eyebrow: string; h1: string; sub: string; programLink: string }
}

const en: SharpBrainCopy = {
  hero: {
    h1: 'Your child studies for two hours — and still can’t recall it the next day?',
    sub: `30 days, 15 minutes a day. Training for focus, reading speed and memory — 7 live classes with ${trainer.name}. Measured on Day 1 and Day 30.`,
    book: (price, firstSeats) => (firstSeats === null ? `Book a seat for ${price}` : `Book a seat for ${price} — first ${firstSeats} seats`),
    demo: 'Watch the free demo',
    forWho: 'For Class 6 to 12. Classes at 8 pm, one hour. Parents don’t have to sit with them.',
    startToday: (nextClass) => (nextClass === null ? 'Join today — start today' : `Join today — start today · Next live class: ${nextClass}`),
    guarantee: 'Complete all 30 days. No improvement? Full refund.',
    strip: [`${trainer.years.total} years of experience`, `${trainer.learners} learners`, `${trainer.workshops} workshops`, 'Start any day', 'Classes in Hindi'],
  },
  pain: {
    title: 'Sound familiar?',
    items: [
      'He sits with the book for two hours. Next day it’s gone.',
      'Reading one page and the mind wanders off — every single time.',
      'Re-reads the same line four times.',
      'Phone in hand within ten minutes.',
      'Marks aren’t the problem. The effort isn’t turning into results.',
    ],
  },
  reframe: {
    title: 'This isn’t about intelligence.',
    body: 'Reading, focus and memory are skills — and skills are trained, not born. Your child’s brain gets better at whatever it practises for 30 days straight. Right now it’s practising switching, scrolling and re-reading. We give it 30 days of the right practice instead.',
  },
  skills: {
    title: 'Five skills, trained every day',
    cards: [
      { title: 'Focus', quote: 'The mind jumps off after one page. Now it will stay put for 20 minutes.', method: 'Short daily attention drills.' },
      { title: 'Speed', quote: 'Re-reading every line stops. Same understanding, half the time.', method: 'Phrase reading, inner-voice control.' },
      { title: 'Memory', quote: 'Formulas, names, dates — locked in with visual technique.', method: 'Memory palace, association, pegs.' },
      { title: 'Revision', quote: 'What’s studied before the exam stays till the exam.', method: 'Active recall, mind maps, spaced revision.' },
      { title: 'Phone discipline', quote: 'The notification habit breaks. Phone stays away while studying.', method: 'Focus sessions, 20-20-20 eye care.' },
    ],
  },
  day30: {
    title: 'What your child will be able to do on Day 30',
    items: [
      'Read with a method — faster, with understanding, and know their own reading number.',
      'Hold focus through a longer study block.',
      'Use 4–5 memory techniques for formulas, facts and names.',
      'Revise in a way that makes things stay.',
      'Keep the phone away on their own.',
      'Compare their own Day 1 and Day 30 numbers, in writing.',
    ],
  },
  how: {
    title: 'Measure. Train. Practise. Re-measure.',
    steps: [
      'Join today — Day 1 reading & memory test in the app, your child’s own starting point.',
      '7 live classes on Zoom with Dr. Kapil (Mon & Thu, 8 pm) — recordings in the app if one is missed.',
      '15 minutes of app practice a day, tracked automatically.',
      'Day 30 test on an equally hard passage. Numbers compared with Day 1.',
    ],
  },
  parents: {
    title: 'What parents actually have to do: nothing.',
    body: 'No teaching. No sitting alongside. No checking homework. 15 minutes on the app, one hour of class at 8 pm. You see progress in the parent view and get the Day 1 and Day 30 numbers at the end.',
  },
  certificate: {
    eyebrow: 'Your certificate',
    title: 'Your Sharp Brain certificate',
    intro: 'Finish Day 30 and you receive a certificate with your own before-and-after numbers.',
    points: [
      { title: 'Your own numbers', desc: 'Reading speed, comprehension and effective speed on Day 1 and Day 30, plus your Memory and Retention scores.' },
      { title: 'A fair test', desc: 'The numbers come from a self-paced reading test, equally hard on Day 1 and Day 30.' },
      { title: 'Easy to verify', desc: 'Every certificate has a unique ID and a public verification link.' },
      { title: 'Yours to keep and share', desc: 'In 8 languages, as a PDF and as an image for WhatsApp and Instagram.' },
    ],
    vary: 'Results vary from learner to learner.',
    caption: 'Sample. Your certificate shows your own name and your own results.',
    certAlt: 'Sample Sharp Brain certificate, marked SAMPLE, with "Your Name" and blank results',
    shareAlt: 'Sample share image for WhatsApp and Instagram, marked SAMPLE, with blank results',
    enlarge: 'Tap to view full size.',
  },
  proof: {
    eyebrow: 'Real learners',
    title: 'Video reviews',
    oldLabel: 'From earlier batches',
    playlistCta: 'See all videos on YouTube',
    more: 'Watch more videos',
    fewer: 'Show fewer',
  },
  trainer: {
    eyebrow: 'Your trainer',
    title: `${trainer.name} — Brain, mind and meditation coach.`,
    line: `${trainer.years.total} years in education · Training reading, focus and memory since ${trainer.skillsTrainingSinceYear} · ${trainer.learners} learners · ${trainer.workshops} workshops · Based in Vadodara.`,
    method: 'No blindfolds. No ‘midbrain activation’. Methods you can measure.',
    readStory: 'Read his full story →',
  },
  included: {
    title: 'What’s included',
    items: [
      `7 live classes with Dr. Kapil (one hour each, 8–9 pm, Mon & Thu) + recordings`,
      '30 days of app practice, all exercises',
      'Day 1 and Day 30 tests',
      'Memory and revision methods for exams',
      'Certificate with your child’s own numbers',
      'WhatsApp support through the 30 days',
    ],
    memoryKit: 'Memory Kit ₹999 optional',
  },
  offer: {
    title: (firstSeats) => (firstSeats === null ? 'Sharp Brain for parents' : `Sharp Brain for parents — first ${firstSeats} seats`),
    oneTime: 'one time',
    instalments: 'or ₹1,499 × 2',
    perDay: (price) => `About ${price} a day for 30 days · Secure Razorpay checkout`,
    book: (price) => `Book a seat — ${price}`,
    questions: 'Questions? Chat on WhatsApp',
  },
  faq: {
    title: 'Questions',
    items: [
      { question: 'My child is in Class 8. Too young?', answer: 'From Class 6 it works. Below that, join with a parent.' },
      { question: 'Classes in which language?', answer: 'Simple Hindi with English terms. App in 8 languages.' },
      { question: 'Time per day?', answer: '15 minutes practice + two live classes a week (Mon & Thu, 8–9 pm).' },
      { question: 'Missed a class?', answer: 'Every class repeats in the next cycle, and the recording is in the app.' },
      { question: 'What if it doesn’t work?', answer: 'Full refund: complete all 30 days, all 7 classes (live or recording) and both tests; claim within 7 days of your Day 30.' },
      { question: 'Any subscription?', answer: 'None. One payment, no auto-debit.' },
    ],
  },
  final: {
    body: (price) => `Start today. A month from now the numbers will be on paper either way — better, or the same. For ${price} and 15 minutes a day, it’s worth finding out.`,
    book: 'Book a seat',
    ask: 'Ask on WhatsApp',
  },
  alsoFor: {
    title: 'Also for',
    lines: ['College students', 'Exam aspirants', 'Professionals'],
    ask: 'Ask on WhatsApp',
  },
  freeTest: 'Not sure yet? Take the free Reading & Memory Test →',
  liveQa: 'Sunday 7 pm — 30-minute live Q&A',
  sticky: { book: 'Book a seat', whatsapp: 'WhatsApp' },
  reviews: {
    metaTitle: 'Video Reviews — Sharp Brain™ | Mind Ur Mind',
    eyebrow: 'Real learners',
    h1: 'Sharp Brain™ video reviews',
    sub: 'Learners from earlier batches talk about their experience in their own words. Watch them here or on our YouTube channel.',
    programLink: 'See what’s in the 30-Day Program →',
  },
}

const hi: SharpBrainCopy = {
  hero: {
    h1: 'आपका बच्चा दो घंटे पढ़ता है — और अगले दिन फिर भी याद नहीं रहता?',
    sub: `30 दिन, रोज़ 15 मिनट। ध्यान, पढ़ने की स्पीड और याद रखने की ट्रेनिंग — 7 लाइव क्लास, ${trainer.nameHi} के साथ। Day 1 और Day 30 पर नापा जाता है।`,
    book: (price, firstSeats) => (firstSeats === null ? `${price} में सीट बुक करें` : `${price} में सीट बुक करें — पहली ${firstSeats} सीट`),
    demo: 'फ्री डेमो देखें',
    forWho: 'क्लास 6 से 12 तक। क्लास रात 8 बजे, एक घंटा। पैरेंट को साथ बैठना नहीं है।',
    startToday: (nextClass) => (nextClass === null ? 'आज join करें, आज से शुरू' : `आज join करें, आज से शुरू · अगली लाइव क्लास: ${nextClass}`),
    guarantee: '30 दिन पूरे करें। सुधार न मिले तो पूरा पैसा वापस।',
    strip: [`${trainer.years.total} साल का अनुभव`, `${trainer.learners} लोग सीख चुके`, `${trainer.workshops} वर्कशॉप`, 'किसी भी दिन शुरू करें', 'क्लास हिंदी में'],
  },
  pain: {
    title: 'जानी-पहचानी बात लगी?',
    items: [
      'दो घंटे किताब लेकर बैठा रहता है। अगले दिन सब गया।',
      'एक पन्ना पढ़ते-पढ़ते दिमाग भाग जाता है — हर बार।',
      'वही लाइन चार बार पढ़ता है।',
      'दस मिनट में फोन हाथ में।',
      'नंबर समस्या नहीं है। मेहनत नतीजे में नहीं बदल रही।',
    ],
  },
  reframe: {
    title: 'ये बुद्धि का मामला नहीं है।',
    body: 'पढ़ना, ध्यान और याद रखना — ये हुनर हैं। हुनर सीखे जाते हैं, पैदा नहीं होते। बच्चे का दिमाग 30 दिन जिसकी प्रैक्टिस करेगा, उसमें बेहतर हो जाएगा। अभी वो स्क्रॉल करना, ध्यान भटकाना और लाइन दोबारा पढ़ना प्रैक्टिस कर रहा है। हम उसे 30 दिन सही प्रैक्टिस देते हैं।',
  },
  skills: {
    title: 'पाँच स्किल्स, हर दिन का अभ्यास',
    cards: [
      { title: 'ध्यान', quote: 'एक पन्ना पढ़ते ही दिमाग भाग जाता है। अब 20 मिनट तक एक जगह रुकेगा।', method: 'रोज़ छोटे अटेंशन ड्रिल।' },
      { title: 'स्पीड', quote: 'हर लाइन दोबारा पढ़ना बंद। वही समझ, आधा समय।', method: 'फ्रेज़ रीडिंग, अंदर की आवाज़ पर काबू।' },
      { title: 'याद', quote: 'फ़ॉर्मूले, नाम, तारीखें — विज़ुअल तकनीक से पक्का याद।', method: 'मेमोरी पैलेस, एसोसिएशन, पेग।' },
      { title: 'रिवीज़न', quote: 'परीक्षा से पहले जो पढ़ा, वो परीक्षा तक रहता है।', method: 'एक्टिव रिकॉल, माइंड मैप, स्पेस्ड रिवीज़न।' },
      { title: 'फोन पर काबू', quote: 'नोटिफिकेशन की लत टूटेगी। पढ़ते वक्त फोन दूर रहेगा।', method: 'फोकस सेशन, 20-20-20 आँखों की देखभाल।' },
    ],
  },
  day30: {
    title: 'Day 30 पर आपका बच्चा क्या कर पाएगा',
    items: [
      'तरीके से पढ़ना — तेज़, समझ के साथ, और अपना पढ़ने का नंबर खुद जानना।',
      'लंबे समय तक एक जगह ध्यान टिकाना।',
      'फ़ॉर्मूले, तथ्य और नाम के लिए 4–5 याद रखने की तकनीक।',
      'ऐसा रिवीज़न जिससे चीज़ें टिकती हैं।',
      'खुद से फोन दूर रखना।',
      'अपने Day 1 और Day 30 के नंबर लिखित में तुलना करना।',
    ],
  },
  how: {
    title: 'नापो। सिखाओ। अभ्यास कराओ। फिर नापो।',
    steps: [
      'आज join करें — Day 1 पर ऐप में पढ़ने और याद का टेस्ट, बच्चे की अपनी शुरुआत।',
      'Zoom पर डॉ. कपिल के साथ 7 लाइव क्लास (सोम और गुरु, रात 8 बजे) — छूटे तो रिकॉर्डिंग ऐप में।',
      'रोज़ 15 मिनट ऐप प्रैक्टिस, अपने आप ट्रैक।',
      'Day 30 पर बराबर कठिनाई वाले पैसेज का टेस्ट। नंबरों की तुलना Day 1 से।',
    ],
  },
  parents: {
    title: 'पैरेंट को असल में करना क्या है: कुछ नहीं।',
    body: 'पढ़ाना नहीं। साथ बैठना नहीं। होमवर्क चेक करना नहीं। ऐप पर 15 मिनट, रात 8 बजे एक घंटा क्लास। पैरेंट व्यू में प्रगति दिखेगी और अंत में Day 1 और Day 30 के नंबर आपको मिलेंगे।',
  },
  certificate: {
    eyebrow: 'आपका प्रमाणपत्र',
    title: 'आपका Sharp Brain प्रमाणपत्र',
    intro: 'Day 30 पूरा करने पर आपको प्रमाणपत्र मिलता है, जिसमें आपके अपने पहले और बाद के नंबर होते हैं।',
    points: [
      { title: 'आपके अपने नंबर', desc: 'Day 1 और Day 30 पर पढ़ने की गति, समझ और प्रभावी गति, साथ में आपके याददाश्त (Memory) और टिकाव (Retention) स्कोर।' },
      { title: 'निष्पक्ष टेस्ट', desc: 'ये नंबर अपनी गति से पढ़ने वाले एक टेस्ट से आते हैं, जो Day 1 और Day 30 पर बराबर कठिन होता है।' },
      { title: 'आसानी से जाँच', desc: 'हर प्रमाणपत्र की एक अलग ID और एक सार्वजनिक जाँच लिंक होती है।' },
      { title: 'रखें और शेयर करें', desc: '8 भाषाओं में, PDF के रूप में और WhatsApp व Instagram के लिए इमेज के रूप में।' },
    ],
    vary: 'नतीजे हर विद्यार्थी के लिए अलग होते हैं।',
    caption: 'नमूना। आपके प्रमाणपत्र पर आपका अपना नाम और आपके अपने नतीजे होंगे।',
    certAlt: 'Sharp Brain प्रमाणपत्र का नमूना, SAMPLE चिह्न के साथ, "आपका नाम" और खाली नतीजे',
    shareAlt: 'WhatsApp और Instagram के लिए शेयर इमेज का नमूना, SAMPLE चिह्न के साथ, खाली नतीजे',
    enlarge: 'पूरा आकार देखने के लिए टैप करें।',
  },
  proof: {
    eyebrow: 'असली विद्यार्थी',
    title: 'वीडियो रिव्यूज़',
    oldLabel: 'पहले के बैचों से',
    playlistCta: 'YouTube पर सभी वीडियो देखें',
    more: 'और वीडियो देखें',
    fewer: 'कम दिखाएं',
  },
  trainer: {
    eyebrow: 'आपके ट्रेनर',
    title: `${trainer.nameHi} — ब्रेन, माइंड और मेडिटेशन कोच।`,
    line: `शिक्षा में ${trainer.years.total} साल · ${trainer.skillsTrainingSinceYear} से पढ़ने, ध्यान और याद रखने की ट्रेनिंग · ${trainer.learners} लोग सीख चुके · ${trainer.workshops} वर्कशॉप · वडोदरा।`,
    method: 'पट्टी नहीं। ‘मिडब्रेन एक्टिवेशन’ नहीं। ऐसे तरीके जिन्हें नापा जा सके।',
    readStory: 'पूरी कहानी पढ़ें →',
  },
  included: {
    title: 'क्या-क्या मिलेगा',
    items: [
      'डॉ. कपिल के साथ 7 लाइव क्लास (एक-एक घंटा, रात 8–9, सोम और गुरु) + रिकॉर्डिंग',
      '30 दिन ऐप प्रैक्टिस, सारे एक्सरसाइज़',
      'Day 1 और Day 30 के टेस्ट',
      'परीक्षा के लिए याद और रिवीज़न के तरीके',
      'बच्चे के अपने नंबरों वाला सर्टिफिकेट',
      '30 दिन WhatsApp सपोर्ट',
    ],
    memoryKit: 'मेमोरी किट ₹999 (वैकल्पिक)',
  },
  offer: {
    title: (firstSeats) => (firstSeats === null ? 'पैरेंट्स के लिए Sharp Brain' : `पैरेंट्स के लिए Sharp Brain — पहली ${firstSeats} सीट`),
    oneTime: 'एक बार',
    instalments: 'या ₹1,499 × 2',
    perDay: (price) => `30 दिन का लगभग ${price} रोज़ · सुरक्षित Razorpay चेकआउट`,
    book: (price) => `सीट बुक करें — ${price}`,
    questions: 'सवाल हैं? WhatsApp पर बात करें',
  },
  faq: {
    title: 'सवाल',
    items: [
      { question: 'बच्चा क्लास 8 में है। बहुत छोटा?', answer: 'क्लास 6 से चलता है। उससे नीचे पैरेंट के साथ जोड़ें।' },
      { question: 'क्लास किस भाषा में?', answer: 'सरल हिंदी, अंग्रेज़ी शब्दों के साथ। ऐप 8 भाषाओं में।' },
      { question: 'रोज़ कितना समय?', answer: '15 मिनट प्रैक्टिस + हफ्ते में दो लाइव क्लास (सोम और गुरु, रात 8–9)।' },
      { question: 'क्लास छूट गई?', answer: 'हर क्लास अगले चक्र में दोबारा होती है, और रिकॉर्डिंग ऐप में है।' },
      { question: 'काम न किया तो?', answer: 'पूरा रिफंड: 30 दिन, सातों क्लास (लाइव या रिकॉर्डिंग) और दोनों टेस्ट पूरे करें; अपने Day 30 के 7 दिन में दावा करें।' },
      { question: 'सब्सक्रिप्शन है?', answer: 'नहीं। एक बार का भुगतान, कोई ऑटो-डेबिट नहीं।' },
    ],
  },
  final: {
    body: (price) => `आज से शुरू करें। एक महीने बाद नंबर कागज़ पर होंगे — बेहतर, या वही। ${price} और रोज़ 15 मिनट के लिए जान लेना बनता है।`,
    book: 'सीट बुक करें',
    ask: 'WhatsApp पर पूछें',
  },
  alsoFor: {
    title: 'इनके लिए भी',
    lines: ['कॉलेज के विद्यार्थी', 'प्रतियोगी परीक्षा की तैयारी करने वाले', 'प्रोफ़ेशनल'],
    ask: 'WhatsApp पर पूछें',
  },
  freeTest: 'अभी तय नहीं? मुफ़्त Reading और Memory Test दें →',
  liveQa: 'रविवार शाम 7 बजे — 30 मिनट का लाइव Q&A',
  sticky: { book: 'सीट बुक करें', whatsapp: 'WhatsApp' },
  reviews: {
    metaTitle: 'Video Reviews — Sharp Brain™ | Mind Ur Mind',
    eyebrow: 'असली विद्यार्थी',
    h1: 'Sharp Brain™ वीडियो रिव्यूज़',
    sub: 'पहले के बैचों के विद्यार्थी अपने शब्दों में अपना अनुभव बताते हैं। यहाँ देखें या हमारे YouTube चैनल पर।',
    programLink: '30-दिवसीय प्रोग्राम में क्या है, देखें →',
  },
}

export const sharpBrainCopy: Record<Lang, SharpBrainCopy> = { en, hi }

// Pre-filled WhatsApp texts (English, like every pre-filled WhatsApp message).
export const LIVE_QA_WHATSAPP = 'Hi, I want to join the Sunday 7 pm live Q&A about Sharp Brain. My child is in Class __'
export const DEMO_WATCHED_WHATSAPP = 'Hi, I watched the demo. My child is in Class __'

/** /sharp-brain/demo — the on-demand demo video page. */
export const sharpBrainDemoCopy: Record<Lang, { metaTitle: string; h1: string; videoSoon: string; call: string; or: string; lines: [string, string, string] }> = {
  en: {
    metaTitle: 'Sharp Brain — free demo | Mind Ur Mind',
    h1: 'Sharp Brain — watch the free demo',
    videoSoon: 'The demo video will be here soon.',
    call: 'WhatsApp / Call: +91 95401 23161',
    or: 'or call',
    lines: [
      '30 days, 15 minutes a day — focus, reading speed and memory for Class 6–12.',
      '7 live classes with Dr. Kapil (Mon & Thu, 8 pm) — recordings in the app if one is missed.',
      'Measured on Day 1 and Day 30 — your child’s own numbers, in writing.',
    ],
  },
  hi: {
    metaTitle: 'Sharp Brain — फ्री डेमो | Mind Ur Mind',
    h1: 'Sharp Brain — फ्री डेमो देखें',
    videoSoon: 'डेमो वीडियो जल्द ही यहाँ होगा।',
    call: 'WhatsApp / कॉल: +91 95401 23161',
    or: 'या कॉल करें',
    lines: [
      '30 दिन, रोज़ 15 मिनट — क्लास 6–12 के लिए ध्यान, पढ़ने की स्पीड और याद।',
      'डॉ. कपिल के साथ 7 लाइव क्लास (सोम और गुरु, रात 8 बजे) — छूटे तो रिकॉर्डिंग ऐप में।',
      'Day 1 और Day 30 पर नापा जाता है — बच्चे के अपने नंबर, लिखित में।',
    ],
  },
}
