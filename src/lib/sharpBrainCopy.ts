import { programs, qsrGuarantee, sharpBrainEnrolment, trainer } from '@/config/site.config'
import type { Lang } from '@/lib/i18n'

// Copy for /programs/sharp-brain, EN + HI (rewritten 1 Oct 2026: one
// universal positioning, one offer). Sharp Brain™ is a 30-day brain-skills
// training for anyone who learns — not a kids' program, not a speed-reading
// course. Prices, batch dates and countdowns are NOT here: they come from
// the server (src/features/sharp-brain-enrol).
// Claims rule: no multipliers, no "100%", no left/right-brain or midbrain
// language; improvement is always "measured from your own Day 1".
// "Quantum" appears only in the last FAQ.

export type SkillRow = { skill: string; wrong: string; train: string; change: string }
export type ExerciseGroup = { id: 'focus' | 'reading' | 'memory' | 'visual' | 'calm'; skill: string; exercises: string[] }

export type SharpBrainCopy = {
  hero: { eyebrow: string; h1: string; sub: string; speedTest: string; trust: (nextBatch: string) => string }
  problems: { eyebrow: string; title: string; cards: string[]; line: string }
  why: {
    eyebrow: string
    title: string
    intro: string
    headings: { skill: string; wrong: string; train: string; change: string }
    rows: SkillRow[]
    footer: string
  }
  outcomes: { eyebrow: string; title: string; items: string[] }
  app: { eyebrow: string; title: string; note: string; groups: ExerciseGroup[]; shotAlt: Record<ExerciseGroup['id'], string> }
  classes: { eyebrow: string; title: string; items: { title: string; desc: string }[]; note: string }
  audiences: { eyebrow: string; title: string; cards: { title: string; desc: string }[]; line: string }
  how: { eyebrow: string; title: string; steps: { title: string; desc: string }[] }
  proof: { eyebrow: string; title: string; oldLabel: string; playlistCta: string }
  trainer: { eyebrow: string; readStory: string }
  offer: { eyebrow: string; title: string; items: string[]; questions: string }
  guarantee: { title: string; statement: string; request: string; policy: string }
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] }
  final: { title: string; speedTest: string }
  sticky: { cta: string }
}

// "15th and 25th" — from the batch schedule in site.config.
const ord = (d: number): string => `${d}${d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th'}`
const batchDaysEn = sharpBrainEnrolment.batchStartDays.map(ord).join(' and ')
const batchDaysHi = sharpBrainEnrolment.batchStartDays.join(' और ')

const regular = `₹${(programs.sharpBrain.prices[0]?.amountInr ?? 0).toLocaleString('en-IN')}`

const en: SharpBrainCopy = {
  hero: {
    eyebrow: 'Brain skills training · 30 days · Live + App',
    h1: 'Sharp Brain™ — Read faster. Focus longer. Remember more.',
    sub: `A 30-day brain-skills program for students, exam aspirants and working professionals. 7 live classes with ${trainer.name} + 10–15 minutes of daily app practice — with your progress measured from Day 1 to Day 30.`,
    speedTest: 'Take the free Reading Speed Test →',
    trust: (nextBatch) => `${trainer.years.total} years in education & mind training · ${trainer.learners} learners · Next batch: ${nextBatch}`,
  },
  problems: {
    eyebrow: 'Sound familiar?',
    title: 'Reading, focus and memory — the everyday struggles',
    cards: [
      'You read a page — and can’t recall it a minute later.',
      'You sit down to study or work, and your mind wanders in minutes.',
      'Too much to read — books, notes, reports — and never enough time.',
      'Your phone breaks your focus again and again.',
    ],
    line: 'This isn’t about intelligence. Reading, focus and memory are skills — and skills can be trained.',
  },
  why: {
    eyebrow: 'Why it happens — and what we train',
    title: 'Five skills, trained every day',
    intro: 'Your brain gets better at whatever it practises. Sharp Brain gives it 30 days of the right practice.',
    headings: { skill: 'Skill', wrong: 'What usually goes wrong', train: 'What we train', change: 'What changes for you' },
    rows: [
      {
        skill: 'Focus',
        wrong: 'Attention jumps every few minutes; constant switching.',
        train: 'Short daily attention drills that train you to hold attention and ignore distractions.',
        change: 'You stay with one task longer.',
      },
      {
        skill: 'Smart Reading',
        wrong: 'Reading word by word, saying every word in your head, re-reading lines.',
        train: 'Reading in meaningful phrases, controlling the inner voice, fewer re-reads.',
        change: 'You read faster while keeping understanding.',
      },
      {
        skill: 'Memory',
        wrong: 'Information is only “read”, not stored.',
        train: 'Memory techniques — visual images, association, memory palace, peg system, acronyms.',
        change: 'What you study stays.',
      },
      {
        skill: 'Retention',
        wrong: 'No revision method; you forget in days.',
        train: 'Active recall after reading, mind maps, spaced revision.',
        change: 'You remember for exams and work, not just today.',
      },
      {
        skill: 'Mobile Discipline',
        wrong: 'Notifications break attention.',
        train: 'Focus sessions, phone-away habits, 20-20-20 eye care.',
        change: 'Longer, calmer study and work blocks.',
      },
    ],
    footer:
      'Repeated practice strengthens the brain networks you use. That’s why the program is daily, short and measured — not a one-time motivation session.',
  },
  outcomes: {
    eyebrow: 'After 30 days',
    title: 'What you’ll be able to do after 30 days',
    items: [
      'Read with a method: faster, with understanding — and know your Effective Reading Speed.',
      'Hold focus for longer study and work sessions.',
      'Use 4–5 memory techniques for formulas, facts, names and presentations.',
      'Revise in a way that makes information stay.',
      'Control phone distraction with simple daily habits.',
      'Compare your own reading numbers from Class 1 and Class 7.',
    ],
  },
  app: {
    eyebrow: 'Inside the app',
    title: 'Your daily practice in the Mind Ur Mind App',
    note: '10–15 minutes a day. Progress tracked automatically.',
    groups: [
      { id: 'focus', skill: 'Focus', exercises: ['Color-Word Sync Grid', 'Peripheral Vision Activator'] },
      { id: 'reading', skill: 'Smart Reading', exercises: ['Phrase Reading', 'Sentence Reading', 'Inner Voice Control', 'Regression Control', 'Guided-pace (RSVP) practice'] },
      { id: 'memory', skill: 'Memory', exercises: ['Dot Memory Grid', 'Word Flash Grid', 'Visual Memory Reading', 'Mental Object Rotation'] },
      { id: 'visual', skill: 'Visualisation', exercises: ['Sensory Imagery Builder', 'Deep Visualisation Recall'] },
      { id: 'calm', skill: 'Calm & Discipline', exercises: ['Calm Breath Balance', '2-Minute Brain Gym Circuit'] },
    ],
    shotAlt: {
      focus: 'Color-Word Sync Grid exercise in the Mind Ur Mind App',
      reading: 'Phrase Reading exercise in the Mind Ur Mind App',
      memory: 'Dot Memory Grid exercise in the Mind Ur Mind App',
      visual: 'Sensory Imagery Builder exercise in the Mind Ur Mind App',
      calm: 'Calm Breath Balance exercise in the Mind Ur Mind App',
    },
  },
  classes: {
    eyebrow: 'The main value',
    title: 'The 7 live classes',
    items: [
      { title: 'Your Brain & How You Learn', desc: 'How attention, reading and memory work; your Day 1 reading assessment; setting your personal goal.' },
      { title: 'Focus Training', desc: 'Attention drills, handling distractions, the 25-minute deep-focus method for study and work.' },
      { title: 'Smart Reading I', desc: 'Reading in phrases instead of word by word, reducing re-reading, reading with a purpose.' },
      { title: 'Smart Reading II', desc: 'Controlling the inner voice, reading faster while keeping understanding, recall right after reading.' },
      { title: 'Memory Techniques', desc: 'Visual memory, association, memory palace, peg system and acronyms for facts, formulas and names.' },
      { title: 'Retention System', desc: 'Active recall, mind maps and spaced revision so what you learn stays — for exams and for work.' },
      { title: 'Mobile Discipline & Your Day 30 Result', desc: 'Phone-distraction habits, your Day 30 reading assessment, and your 90-day practice plan.' },
    ],
    note: `Live on Zoom with ${trainer.name} — not recordings. Doubts answered in class.`,
  },
  audiences: {
    eyebrow: 'Who it’s for',
    title: 'For anyone who reads, studies or learns',
    cards: [
      { title: 'School & college students', desc: 'Study less time, remember more, score with less stress.' },
      { title: 'Competitive-exam aspirants (UPSC, SSC, banking, NEET, JEE, CA…)', desc: 'Cover a large syllabus faster and revise so it stays.' },
      { title: 'Working professionals', desc: 'Read reports and emails faster, focus in deep-work blocks, remember what matters.' },
      { title: 'Parents', desc: 'Enrol your child (from about Class 6 upward) to build focus, memory and study habits — and see their progress.' },
    ],
    line: 'If you read, study or learn for your work — this program is for you.',
  },
  how: {
    eyebrow: 'How it works',
    title: 'Measure, train, practise, re-measure',
    steps: [
      { title: 'Reading assessment in Class 1', desc: 'Your reading speed and comprehension — your own starting point.' },
      { title: '7 live classes', desc: `Live on Zoom with ${trainer.name} across the 30 days.` },
      { title: 'Daily app practice', desc: '10–15 minutes a day in the Mind Ur Mind App, tracked automatically.' },
      { title: 'Reading assessment in Class 7', desc: 'The same measures again, compared with Class 1.' },
    ],
  },
  proof: {
    eyebrow: 'Real learners',
    title: 'Video reviews',
    oldLabel: 'From earlier batches',
    playlistCta: 'See all videos on YouTube',
  },
  trainer: { eyebrow: 'Your trainer', readStory: 'Read his full story →' },
  offer: {
    eyebrow: 'Enrol',
    title: 'Everything in the Sharp Brain 30-Day Program',
    items: [
      `7 live classes with ${trainer.name}`,
      '30 days of guided app practice (all exercises)',
      'Reading assessment in Class 1 and Class 7',
      'Memory & revision methods for exams and work',
      'Certificate of completion',
      'WhatsApp support during the program',
    ],
    questions: 'Questions? Chat on WhatsApp',
  },
  guarantee: {
    title: qsrGuarantee.en.label,
    statement: qsrGuarantee.en.statement,
    request: qsrGuarantee.en.requestWindow,
    policy: 'See the Refund & Cancellation Policy',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you enrol',
    items: [
      {
        question: 'Who is this for?',
        answer:
          'School and college students, competitive-exam aspirants and working professionals — anyone who reads, studies or learns for work. Parents can enrol their child from about Class 6 upward; younger children can join with a parent.',
      },
      {
        question: 'Is this science-based?',
        answer:
          'Yes. It uses well-established learning methods — attention training, reading-skill practice, visual memory techniques, active recall and spaced revision. No blindfolds, no “midbrain activation”, no magic claims. Your improvement is measured, not promised.',
      },
      {
        question: 'How much time does it take each day?',
        answer: '10–15 minutes of app practice a day, plus 7 live classes on Zoom spread across the 30 days. You get the class times with your batch schedule when you enrol.',
      },
      {
        question: 'Is it in Hindi or English?',
        answer: 'Classes are taught in simple Hindi with English terms; the app is available in English and Hindi.',
      },
      {
        question: 'What if I miss a live class?',
        answer: `Join the same class free in the next batch — batches start on the ${batchDaysEn} of every month.`,
      },
      {
        question: `What do I get for ${regular}?`,
        answer: `7 live classes with ${trainer.name}, 30 days of guided app practice with all exercises, a reading assessment in Class 1 and Class 7, memory and revision methods for exams and work, a certificate of completion and WhatsApp support during the program. One-time payment — no subscription, no instalments.`,
      },
      {
        question: 'What if it doesn’t work for me?',
        answer: `${qsrGuarantee.en.statement} ${qsrGuarantee.en.requestWindow}`,
      },
      {
        question: 'What happened to Quantum Speed Reading?',
        answer: 'It is now Sharp Brain — the same core training under a clearer name, with a stronger focus on memory and focus.',
      },
    ],
  },
  final: { title: 'Your brain can learn better. Start in the next batch.', speedTest: 'Take the free Reading Speed Test →' },
  sticky: { cta: 'Enrol' },
}

const hi: SharpBrainCopy = {
  hero: {
    eyebrow: 'ब्रेन स्किल्स ट्रेनिंग · 30 दिन · लाइव + ऐप',
    h1: 'Sharp Brain™ — तेज़ पढ़ें। ज़्यादा देर फोकस करें। ज़्यादा याद रखें।',
    sub: `विद्यार्थियों, प्रतियोगी परीक्षा की तैयारी करने वालों और कामकाजी लोगों के लिए 30 दिन का ब्रेन-स्किल्स प्रोग्राम। ${trainer.nameHi} के साथ 7 लाइव क्लासेस + रोज़ 10–15 मिनट ऐप पर अभ्यास — और Day 1 से Day 30 तक आपकी प्रगति नापी जाती है।`,
    speedTest: 'मुफ़्त Reading Speed Test दें →',
    trust: (nextBatch) => `शिक्षा और माइंड ट्रेनिंग में ${trainer.years.total} वर्ष · ${trainer.learners} विद्यार्थी · अगला बैच: ${nextBatch}`,
  },
  problems: {
    eyebrow: 'क्या ये आपके साथ भी होता है?',
    title: 'पढ़ना, फोकस और याददाश्त — रोज़ की मुश्किलें',
    cards: [
      'पूरा पेज पढ़ लिया — और एक मिनट बाद कुछ याद नहीं।',
      'पढ़ने या काम करने बैठते हैं, और कुछ ही मिनटों में मन भटक जाता है।',
      'पढ़ने को बहुत कुछ है — किताबें, नोट्स, रिपोर्ट्स — पर समय कभी पूरा नहीं पड़ता।',
      'फ़ोन बार-बार आपका ध्यान तोड़ देता है।',
    ],
    line: 'बात बुद्धि की नहीं है। पढ़ना, फोकस और याददाश्त स्किल्स हैं — और स्किल्स सिखाई जा सकती हैं।',
  },
  why: {
    eyebrow: 'ऐसा क्यों होता है — और हम क्या सिखाते हैं',
    title: 'पाँच स्किल्स, हर दिन का अभ्यास',
    intro: 'दिमाग़ जिस चीज़ का अभ्यास करता है, उसी में बेहतर होता जाता है। Sharp Brain उसे 30 दिन का सही अभ्यास देता है।',
    headings: { skill: 'स्किल', wrong: 'आम तौर पर क्या गड़बड़ होता है', train: 'हम क्या सिखाते हैं', change: 'आपके लिए क्या बदलता है' },
    rows: [
      {
        skill: 'फोकस',
        wrong: 'ध्यान हर कुछ मिनट में भटकता है; बार-बार एक काम से दूसरे पर।',
        train: 'रोज़ के छोटे ध्यान-अभ्यास, जो ध्यान टिकाना और भटकावों को अनदेखा करना सिखाते हैं।',
        change: 'आप एक काम पर ज़्यादा देर टिके रहते हैं।',
      },
      {
        skill: 'स्मार्ट रीडिंग',
        wrong: 'शब्द-शब्द पढ़ना, मन में हर शब्द बोलना, लाइनें दोबारा पढ़ना।',
        train: 'अर्थपूर्ण वाक्यांशों में पढ़ना, मन की आवाज़ पर नियंत्रण, कम दोहराव।',
        change: 'समझ बनाए रखते हुए आप तेज़ पढ़ते हैं।',
      },
      {
        skill: 'याददाश्त',
        wrong: 'जानकारी सिर्फ़ “पढ़ी” जाती है, दिमाग़ में बैठती नहीं।',
        train: 'मेमोरी तकनीकें — विज़ुअल इमेज, एसोसिएशन, मेमोरी पैलेस, पेग सिस्टम, एक्रोनिम।',
        change: 'जो पढ़ते हैं, वह याद रहता है।',
      },
      {
        skill: 'लंबे समय तक याद',
        wrong: 'दोहराने का कोई तरीका नहीं; कुछ ही दिनों में भूल जाते हैं।',
        train: 'पढ़ने के बाद एक्टिव रिकॉल, माइंड मैप, अंतराल पर दोहराव (spaced revision)।',
        change: 'आज ही नहीं, परीक्षा और काम के समय भी याद रहता है।',
      },
      {
        skill: 'मोबाइल अनुशासन',
        wrong: 'नोटिफ़िकेशन ध्यान तोड़ते रहते हैं।',
        train: 'फोकस सेशन, फ़ोन दूर रखने की आदतें, आँखों के लिए 20-20-20 नियम।',
        change: 'पढ़ाई और काम के लंबे, शांत सत्र।',
      },
    ],
    footer: 'बार-बार का अभ्यास उन ब्रेन नेटवर्क्स को मज़बूत करता है जिनका आप इस्तेमाल करते हैं। इसीलिए प्रोग्राम रोज़ का, छोटा और नापा हुआ है — एक बार का मोटिवेशन सेशन नहीं।',
  },
  outcomes: {
    eyebrow: '30 दिन बाद',
    title: '30 दिन बाद आप क्या कर पाएँगे',
    items: [
      'तरीके से पढ़ना: तेज़, समझ के साथ — और अपनी Effective Reading Speed जानना।',
      'पढ़ाई और काम के लंबे सत्रों में फोकस बनाए रखना।',
      'फ़ॉर्मूले, तथ्य, नाम और प्रेज़ेंटेशन याद रखने के लिए 4–5 मेमोरी तकनीकों का इस्तेमाल।',
      'ऐसे दोहराना कि जानकारी याद रहे।',
      'आसान रोज़ की आदतों से फ़ोन के भटकाव पर काबू।',
      'Class 1 और Class 7 के अपने रीडिंग आँकड़ों की तुलना करना।',
    ],
  },
  app: {
    eyebrow: 'ऐप के अंदर',
    title: 'Mind Ur Mind App में आपका रोज़ का अभ्यास',
    note: 'रोज़ 10–15 मिनट। प्रगति अपने-आप ट्रैक होती है।',
    groups: [
      { id: 'focus', skill: 'फोकस', exercises: ['Color-Word Sync Grid', 'Peripheral Vision Activator'] },
      { id: 'reading', skill: 'स्मार्ट रीडिंग', exercises: ['Phrase Reading', 'Sentence Reading', 'Inner Voice Control', 'Regression Control', 'तय गति पर अभ्यास (RSVP)'] },
      { id: 'memory', skill: 'याददाश्त', exercises: ['Dot Memory Grid', 'Word Flash Grid', 'Visual Memory Reading', 'Mental Object Rotation'] },
      { id: 'visual', skill: 'विज़ुअलाइज़ेशन', exercises: ['Sensory Imagery Builder', 'Deep Visualisation Recall'] },
      { id: 'calm', skill: 'शांति और अनुशासन', exercises: ['Calm Breath Balance', '2-Minute Brain Gym Circuit'] },
    ],
    shotAlt: {
      focus: 'Mind Ur Mind App में Color-Word Sync Grid अभ्यास',
      reading: 'Mind Ur Mind App में Phrase Reading अभ्यास',
      memory: 'Mind Ur Mind App में Dot Memory Grid अभ्यास',
      visual: 'Mind Ur Mind App में Sensory Imagery Builder अभ्यास',
      calm: 'Mind Ur Mind App में Calm Breath Balance अभ्यास',
    },
  },
  classes: {
    eyebrow: 'प्रोग्राम की असली ताक़त',
    title: '7 लाइव क्लासेस',
    items: [
      { title: 'आपका दिमाग़ और आप कैसे सीखते हैं', desc: 'ध्यान, पढ़ना और याददाश्त कैसे काम करते हैं; आपका Day 1 रीडिंग असेसमेंट; अपना व्यक्तिगत लक्ष्य तय करना।' },
      { title: 'फोकस ट्रेनिंग', desc: 'ध्यान के अभ्यास, भटकावों से निपटना, पढ़ाई और काम के लिए 25 मिनट का डीप-फोकस तरीका।' },
      { title: 'स्मार्ट रीडिंग I', desc: 'शब्द-शब्द की जगह वाक्यांशों में पढ़ना, दोबारा पढ़ना कम करना, उद्देश्य के साथ पढ़ना।' },
      { title: 'स्मार्ट रीडिंग II', desc: 'मन की आवाज़ पर नियंत्रण, समझ बनाए रखते हुए तेज़ पढ़ना, पढ़ने के तुरंत बाद याद करना।' },
      { title: 'मेमोरी तकनीकें', desc: 'तथ्य, फ़ॉर्मूले और नाम याद रखने के लिए विज़ुअल मेमोरी, एसोसिएशन, मेमोरी पैलेस, पेग सिस्टम और एक्रोनिम।' },
      { title: 'याद बनाए रखने का सिस्टम', desc: 'एक्टिव रिकॉल, माइंड मैप और अंतराल पर दोहराव, ताकि जो सीखें वह याद रहे — परीक्षा के लिए भी और काम के लिए भी।' },
      { title: 'मोबाइल अनुशासन और आपका Day 30 नतीजा', desc: 'फ़ोन से भटकाव की आदतें, आपका Day 30 रीडिंग असेसमेंट, और आपका 90 दिन का अभ्यास प्लान।' },
    ],
    note: `${trainer.nameHi} के साथ Zoom पर लाइव — रिकॉर्डिंग नहीं। सवालों के जवाब क्लास में ही।`,
  },
  audiences: {
    eyebrow: 'यह किसके लिए है',
    title: 'हर उस व्यक्ति के लिए जो पढ़ता, पढ़ाई करता या सीखता है',
    cards: [
      { title: 'स्कूल और कॉलेज के विद्यार्थी', desc: 'कम समय पढ़ें, ज़्यादा याद रखें, कम तनाव में अच्छे अंक लाएँ।' },
      { title: 'प्रतियोगी परीक्षा की तैयारी करने वाले (UPSC, SSC, बैंकिंग, NEET, JEE, CA…)', desc: 'बड़ा सिलेबस जल्दी कवर करें और ऐसे दोहराएँ कि याद रहे।' },
      { title: 'कामकाजी लोग', desc: 'रिपोर्ट्स और ईमेल तेज़ पढ़ें, डीप-वर्क में फोकस करें, ज़रूरी बातें याद रखें।' },
      { title: 'अभिभावक', desc: 'अपने बच्चे (लगभग कक्षा 6 से ऊपर) का नामांकन करें — फोकस, याददाश्त और पढ़ाई की आदतें बनाने के लिए — और उसकी प्रगति देखें।' },
    ],
    line: 'अगर आप पढ़ते हैं, पढ़ाई करते हैं या काम के लिए सीखते हैं — यह प्रोग्राम आपके लिए है।',
  },
  how: {
    eyebrow: 'यह कैसे काम करता है',
    title: 'नापें, सीखें, अभ्यास करें, फिर नापें',
    steps: [
      { title: 'Class 1 में रीडिंग असेसमेंट', desc: 'आपकी रीडिंग स्पीड और समझ — आपकी अपनी शुरुआत।' },
      { title: '7 लाइव क्लासेस', desc: `30 दिनों में ${trainer.nameHi} के साथ Zoom पर लाइव।` },
      { title: 'रोज़ ऐप पर अभ्यास', desc: 'Mind Ur Mind App में रोज़ 10–15 मिनट, अपने-आप ट्रैक।' },
      { title: 'Class 7 में रीडिंग असेसमेंट', desc: 'वही माप दोबारा, Class 1 से तुलना के साथ।' },
    ],
  },
  proof: {
    eyebrow: 'असली विद्यार्थी',
    title: 'वीडियो रिव्यूज़',
    oldLabel: 'पहले के बैचों से',
    playlistCta: 'YouTube पर सभी वीडियो देखें',
  },
  trainer: { eyebrow: 'आपके ट्रेनर', readStory: 'पूरी कहानी पढ़ें →' },
  offer: {
    eyebrow: 'नामांकन',
    title: 'Sharp Brain 30-दिवसीय प्रोग्राम में सब कुछ',
    items: [
      `${trainer.nameHi} के साथ 7 लाइव क्लासेस`,
      '30 दिन का गाइडेड ऐप अभ्यास (सभी एक्सरसाइज़)',
      'Class 1 और Class 7 में रीडिंग असेसमेंट',
      'परीक्षा और काम के लिए याद रखने और दोहराने के तरीके',
      'कोर्स पूरा करने का सर्टिफ़िकेट',
      'प्रोग्राम के दौरान WhatsApp सपोर्ट',
    ],
    questions: 'सवाल हैं? WhatsApp पर बात करें',
  },
  guarantee: {
    title: qsrGuarantee.hi.label,
    statement: qsrGuarantee.hi.statement,
    request: qsrGuarantee.hi.requestWindow,
    policy: 'रिफंड और कैंसिलेशन नीति देखें',
  },
  faq: {
    eyebrow: 'सवाल',
    title: 'नामांकन से पहले',
    items: [
      {
        question: 'यह किसके लिए है?',
        answer:
          'स्कूल और कॉलेज के विद्यार्थी, प्रतियोगी परीक्षा की तैयारी करने वाले और कामकाजी लोग — हर वह व्यक्ति जो पढ़ता, पढ़ाई करता या काम के लिए सीखता है। अभिभावक लगभग कक्षा 6 से ऊपर के बच्चे का नामांकन कर सकते हैं; छोटे बच्चे अभिभावक के साथ जुड़ सकते हैं।',
      },
      {
        question: 'क्या यह विज्ञान पर आधारित है?',
        answer:
          'हाँ। इसमें सीखने के जाने-माने तरीके इस्तेमाल होते हैं — ध्यान का प्रशिक्षण, रीडिंग स्किल का अभ्यास, विज़ुअल मेमोरी तकनीकें, एक्टिव रिकॉल और अंतराल पर दोहराव। न आँखों पर पट्टी, न “मिडब्रेन एक्टिवेशन”, न कोई जादुई दावा। आपका सुधार नापा जाता है, उसका वादा नहीं किया जाता।',
      },
      {
        question: 'रोज़ कितना समय लगता है?',
        answer: 'रोज़ 10–15 मिनट ऐप पर अभ्यास, और 30 दिनों में फैली Zoom पर 7 लाइव क्लासेस। क्लास का समय नामांकन के बाद बैच शेड्यूल के साथ मिलता है।',
      },
      {
        question: 'यह हिंदी में है या अंग्रेज़ी में?',
        answer: 'क्लासेस आसान हिंदी में होती हैं, ज़रूरी अंग्रेज़ी शब्दों के साथ; ऐप अंग्रेज़ी और हिंदी दोनों में उपलब्ध है।',
      },
      {
        question: 'अगर कोई लाइव क्लास छूट जाए तो?',
        answer: `वही क्लास अगले बैच में मुफ़्त में जॉइन करें — बैच हर महीने की ${batchDaysHi} तारीख़ को शुरू होते हैं।`,
      },
      {
        question: `${regular} में क्या मिलता है?`,
        answer: `${trainer.nameHi} के साथ 7 लाइव क्लासेस, सभी एक्सरसाइज़ के साथ 30 दिन का गाइडेड ऐप अभ्यास, Class 1 और Class 7 में रीडिंग असेसमेंट, परीक्षा और काम के लिए याद रखने व दोहराने के तरीके, सर्टिफ़िकेट और प्रोग्राम के दौरान WhatsApp सपोर्ट। एकमुश्त भुगतान — न सब्सक्रिप्शन, न किश्तें।`,
      },
      { question: 'अगर यह मेरे लिए काम न करे तो?', answer: `${qsrGuarantee.hi.statement} ${qsrGuarantee.hi.requestWindow}` },
      { question: 'Quantum Speed Reading का क्या हुआ?', answer: 'अब इसका नाम Sharp Brain है — वही मूल प्रशिक्षण, साफ़ नाम, और फोकस व याददाश्त पर ज़्यादा ज़ोर।' },
    ],
  },
  final: { title: 'आपका दिमाग़ बेहतर सीख सकता है। अगले बैच से शुरू करें।', speedTest: 'मुफ़्त Reading Speed Test दें →' },
  sticky: { cta: 'नामांकन' },
}

export const sharpBrainCopy: Record<Lang, SharpBrainCopy> = { en, hi }
