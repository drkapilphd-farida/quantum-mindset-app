import { SHARP_BRAIN_PRICES, trainer } from '@/config/site.config'
import type { Lang } from '@/lib/i18n'
import { LINKS } from '@/data/links'

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
  app: { eyebrow: string; title: string; note: string; plan: { title: string; points: string[]; alt: string }; groups: ExerciseGroup[]; shotAlt: Record<ExerciseGroup['id'], string> }
  classes: { eyebrow: string; title: string; items: { title: string; desc: string }[]; note: string }
  audiences: { eyebrow: string; title: string; cards: { title: string; desc: string }[]; line: string }
  how: { eyebrow: string; title: string; steps: { title: string; desc: string }[] }
  /** "Your Sharp Brain certificate" — samples only, no speed or percentage promises (see sharpBrainCopy.test.ts). */
  certificate: { eyebrow: string; title: string; intro: string; points: { title: string; desc: string }[]; vary: string; caption: string; certAlt: string; shareAlt: string; enlarge: string }
  proof: { eyebrow: string; title: string; oldLabel: string; playlistCta: string }
  trainer: { eyebrow: string; readStory: string }
  offer: { eyebrow: string; title: string; items: string[]; questions: string }
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] }
  final: { title: string; speedTest: string }
  sticky: { cta: string }
  reviews: { metaTitle: string; eyebrow: string; h1: string; sub: string; programLink: string }
  /** Phase 6B — two offers on one page: live batch and self-paced. */
  offers: OffersCopy
}

/** A comparison-table cell: a short text, included / not included, or included with a short note (e.g. "offline"). */
export type OfferCell = string | true | false | { included: true; note: string }

export type OffersCopy = {
  hero: { h1: string; sub: string; liveButton: (price: string) => string; selfButton: string; seats: string }
  /** Owner (Nov 2026): rolling admission — replaces every batch date. */
  rolling: string
  table: {
    title: string
    feature: string
    included: string
    notIncluded: string
    /** card: how a row reads on the plan card when it differs from the table label (shown highlighted, with a small note). */
    rows: { feature: string; self: OfferCell; live: OfferCell; card?: { text: string; note: string } }[]
  }
  live: { name: string; badge: string; perDay: (price: string) => string; cta: string }
  self: { name: string; price: string; noLive: string; recordings: string; cta: string; upgrade: string }
  /** Owner (Nov 2026): four ways to join, cheapest first. */
  plansTitle: string
  plansSub: string
  plans: SharpBrainPlan[]
  /** Comparison table across the four plans (columns follow `plans`). */
  plansTable: { title: string; feature: string; included: string; notIncluded: string; rows: { feature: string; cells: OfferCell[] }[] }
  refund: { title: string; text: string }
  heroPlansButton: string
  heroTestButton: string
  heroLine: string
  stickyFrom: string
}

export type SharpBrainPlan = {
  id: 'workshop' | 'self' | 'live' | 'offline'
  name: string
  price: string
  /** Short line under the price. */
  note: string
  badge: string | null
  points: string[]
  cta: string
  /** A WhatsApp message (opens WhatsApp) or a direct payment link. */
  href: { kind: 'whatsapp'; message: string } | { kind: 'link'; url: string }
  featured: boolean
}

// Self-paced price (Razorpay payment link LINKS.rzpSharpBrainSelfPaced2999).
const selfPacedPrice = `₹${SHARP_BRAIN_PRICES.selfPacedInr.toLocaleString('en-IN')}`

const en: SharpBrainCopy = {
  hero: {
    eyebrow: 'Brain skills training · 30 days · Live + App',
    h1: 'Sharp Brain™ — Read faster. Focus longer. Remember more.',
    sub: `A 30-day brain-skills program for students, exam aspirants and working professionals. 7 live classes with ${trainer.name} + 10–15 minutes of daily app practice — with your progress measured from Day 1 to Day 30.`,
    speedTest: 'Take the free Reading & Memory Test →',
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
      'Compare your own reading numbers from Day 1 and Day 30.',
    ],
  },
  app: {
    eyebrow: 'Inside the app',
    title: 'Your daily practice in the Mind Ur Mind App',
    note: '10–15 minutes a day. Progress tracked automatically.',
    plan: {
      title: 'Your 30-day plan, one day at a time',
      points: ['Open the app and today’s steps are ready: about 12 minutes.', 'All 30 days on one screen, with stars for every day you finish.', 'Miss a day? Restart where you left off. Nothing is lost.'],
      alt: 'A 34-second tour of the Mind Ur Mind App: the 30-day plan, focus, memory, speed reading and calm breathing',
    },
    groups: [
      { id: 'focus', skill: 'Focus', exercises: ['Color-Word Sync Grid', 'Peripheral Vision Activator'] },
      { id: 'reading', skill: 'Smart Reading', exercises: ['Word Flash (one word at a time)', 'Phrase Reading', 'Sentence Reading', 'Inner Voice Control', 'Progressive Chunk Reading'] },
      { id: 'memory', skill: 'Memory', exercises: ['Keyword method', 'Names and faces', 'Number pictures', 'Mental Object Rotation'] },
      { id: 'visual', skill: 'Memory Studio', exercises: ['Peg method', 'Story method', 'Memory Palace', 'Chapter & Book'] },
      { id: 'calm', skill: 'Calm & Discipline', exercises: ['Calm Breathing', 'Eye relaxation break'] },
    ],
    shotAlt: {
      focus: 'Peripheral Vision Activator exercise running in the Mind Ur Mind App',
      reading: 'Word Flash speed reading, one word at a time',
      memory: 'Keyword method practice round in the Mind Ur Mind App',
      visual: 'Peg method list in the Memory Studio of the Mind Ur Mind App',
      calm: 'Calm Breathing exercise in the Mind Ur Mind App',
    },
  },
  classes: {
    eyebrow: 'The main value',
    title: 'The 7 live classes',
    items: [
      { title: 'Foundation', desc: 'How attention, reading and memory work, and how your 30 days are planned.' },
      { title: 'Eye & Focus Training', desc: 'Eye-movement and attention drills for steady focus while you read and study.' },
      { title: 'Inner Voice Control', desc: 'Reading without saying every word in your head, so you read faster and still understand.' },
      { title: 'Memory Systems', desc: 'Memory palace, association and other methods for facts, formulas and names.' },
      { title: 'Visualisation & Imagination', desc: 'Using mental pictures to understand, remember and stay calm under pressure.' },
      { title: 'Study & Work Application', desc: 'Using the methods for exams, revision and reading at work.' },
      { title: 'Day 30 Review & Your Next Plan', desc: 'Habits, phone discipline and your plan after the 30 days.' },
    ],
    note: `Live on Zoom with ${trainer.name}, 7:00–9:00 pm IST, one full cycle every month. Missed a class? Join it in a later month, or watch the recording on Classplus.`,
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
      { title: 'Fair reading test on Day 1', desc: 'A self-paced reading test in the app: your reading speed and comprehension — your own starting point.' },
      { title: '7 live classes', desc: `Live on Zoom with ${trainer.name} across the 30 days.` },
      { title: 'Daily app practice', desc: '10–15 minutes a day in the Mind Ur Mind App, tracked automatically.' },
      { title: 'Fair reading test on Day 30', desc: 'An equally hard passage, compared with your Day 1 result.' },
    ],
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
  },
  trainer: { eyebrow: 'Your trainer', readStory: 'Read his full story →' },
  offer: {
    eyebrow: 'Enrol',
    title: 'Everything in the Sharp Brain 30-Day Program',
    items: [
      `7 live classes with ${trainer.name}`,
      '30 days of guided app practice (all exercises)',
      'Fair reading test on Day 1 and Day 30',
      'Memory & revision methods for exams and work',
      'Certificate of completion',
      'WhatsApp support during the program',
    ],
    questions: 'Questions? Chat on WhatsApp',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you enrol',
    items: [
      { question: 'Do I get the certificate with self-paced?', answer: 'Yes — the same certificate.' },
      { question: 'Are there live classes in self-paced?', answer: 'No. All 7 classes are recorded.' },
      { question: 'How do I upgrade?', answer: 'Within 7 days of buying, pay ₹6,000 and move to the live batch. Message us on WhatsApp for the link.' },
      { question: 'Can I download the recorded classes?', answer: 'No. You can watch them in the app for 30 days.' },
      {
        question: 'What is the EEG brain test?',
        answer:
          'It is a simple test done with an EEG headband. It shows an indicator of your focus on a graph while you read and meditate. Comparing Day 1 and Day 30, you can see your own change. It is not a medical test. The test is done in person, at the offline workshop.',
      },
    ],
  },
  final: { title: 'Your brain can learn better. Start in the next batch.', speedTest: 'Take the free Reading & Memory Test →' },
  sticky: { cta: 'Enrol' },
  reviews: {
    metaTitle: 'Video Reviews — Sharp Brain™ | Mind Ur Mind',
    eyebrow: 'Real learners',
    h1: 'Sharp Brain™ video reviews',
    sub: 'Learners from earlier batches talk about their experience in their own words. Watch them here or on our YouTube channel.',
    programLink: 'See what’s in the 30-Day Program →',
  },
  offers: {
    hero: {
      h1: 'Reading speed, focus and memory — in 30 days, measured.',
      sub: '10–15 minutes of app practice a day · Your own numbers on Day 1 and Day 30',
      liveButton: (price) => `Live batch · ${price}`,
      selfButton: `Self-paced · ${selfPacedPrice}`,
      seats: '40 seats per live batch · Join anytime — start with the next live class.',
    },
    rolling: 'Join anytime — start with the next live class.',
    table: {
      title: 'Self-paced or live batch',
      feature: 'Feature',
      included: 'Included',
      notIncluded: 'Not included',
      rows: [
        { feature: 'The 7 classes', self: 'Recorded', live: 'Live' },
        // Owner (Nov 2026): EEG brain test — Live batch only, offline.
        {
          feature: 'EEG Brain Test (Day 1 & Day 30)',
          self: false,
          live: { included: true, note: 'offline' },
          card: {
            text: '🧠 EEG Brain Test on Day 1 & Day 30 (EEG headband) — see your focus change on a graph',
            note: 'Offline, at in-person workshops. Online students take the regular Day 1 & Day 30 Sharp Brain test.',
          },
        },
        { feature: '30 days of app practice', self: true, live: true },
        { feature: 'Day 1 / Day 30 test + certificate', self: true, live: true },
      ],
    },
    live: { name: 'Live batch', badge: 'Includes live classes', perDay: (price) => `≈ ${price}/day`, cta: 'Take a seat in the live batch' },
    self: {
      name: 'Self-paced',
      price: selfPacedPrice,
      noLive: 'No live classes — all 7 classes are recorded.',
      recordings: 'Class recordings unlock instantly in the app.',
      cta: 'Start self-paced',
      upgrade: 'Upgrade to the live batch within 7 days by paying ₹6,000 — message us on WhatsApp.',
    },

    plansTitle: 'Choose how you want to join',
    plansSub: 'Start small with the 2-day workshop, or go straight to the full 30-day program.',
    plans: [
      {
        id: 'workshop',
        name: '2-Day Online Workshop',
        price: '₹499',
        note: '2 live online sessions · max 50 per batch',
        badge: 'Start here',
        points: [
          '2 live online sessions with Dr. Kapil Dev Sharma',
          'Focus, memory and smart-reading techniques you can use the same day',
          'See how the full program works before you decide',
        ],
        cta: 'Book my seat · ₹499',
        href: { kind: 'whatsapp', message: 'Hi Dr. Kapil, I want to book the ₹499 Sharp Brain 2-Day Online Workshop.' },
        featured: false,
      },
      {
        id: 'self',
        name: 'Self-paced',
        price: selfPacedPrice,
        note: 'Learn on your own time',
        badge: null,
        points: ['All 7 classes, recorded — unlock instantly', '30 days of guided app practice', 'Day 1 & Day 30 test + certificate'],
        cta: `Start self-paced · ${selfPacedPrice}`,
        href: { kind: 'link', url: LINKS.rzpSharpBrainSelfPaced2999 },
        featured: false,
      },
      {
        id: 'live',
        name: 'Live Online',
        price: '₹4,999',
        note: 'Next batch: Mon 14 Dec 2026 · then 11 Jan 2027',
        badge: 'Most popular',
        points: [
          '7 live classes on Zoom with Dr. Kapil — Mon & Wed, 8 PM',
          'Missed a class? Watch the recording',
          '30 days of guided app practice',
          'Day 1 & Day 30 test + certificate',
          'Not satisfied after the first 2 classes? Full refund.',
        ],
        cta: 'Book Live Online · ₹4,999',
        href: { kind: 'whatsapp', message: 'Hi Dr. Kapil, I want to join the ₹4,999 Sharp Brain Live Online batch (starts 14 Dec).' },
        featured: true,
      },
      {
        id: 'offline',
        name: 'Offline Workshop + EEG',
        price: '₹8,999',
        note: 'In person · city and dates on WhatsApp',
        badge: 'With EEG brain test',
        points: [
          '2-day in-person workshop, 10 AM – 4 PM, lunch included',
          'Live EEG brain test before and after — see your focus on a graph',
          'The remaining 5 classes live online',
          '30 days of guided app practice + certificate',
        ],
        cta: 'Ask for the next workshop',
        href: { kind: 'whatsapp', message: 'Hi Dr. Kapil, I want to join the ₹8,999 Sharp Brain Offline Workshop with EEG. Please share the next city and dates.' },
        featured: false,
      },
    ],
    plansTable: {
      title: 'Compare the plans',
      feature: 'What you get',
      included: 'Included',
      notIncluded: 'Not included',
      rows: [
        { feature: 'Classes with Dr. Kapil', cells: ['2 live', '7 recorded', '7 live', '2 days in person + 5 live'] },
        { feature: '30 days of app practice', cells: [false, true, true, true] },
        { feature: 'Day 1 & Day 30 test + certificate', cells: [false, true, true, true] },
        { feature: 'EEG brain test', cells: [false, false, false, { included: true, note: 'in person' }] },
        { feature: 'Refund after first 2 classes', cells: [false, false, true, false] },
      ],
    },
    refund: {
      title: 'Refund policy — Live Online',
      text: 'Join the first 2 live classes. If you are not satisfied, message us on WhatsApp before the 3rd class and we refund your full fee.',
    },
    heroPlansButton: 'See plans — from ₹499',
    heroTestButton: 'Take the free Brain Test',
    heroLine: '4 ways to join · Start with the ₹499 workshop or go straight to the 30-day program.',
    stickyFrom: 'from ₹499',
  },
}

const hi: SharpBrainCopy = {
  hero: {
    eyebrow: 'ब्रेन स्किल्स ट्रेनिंग · 30 दिन · लाइव + ऐप',
    h1: 'Sharp Brain™ — तेज़ पढ़ें। ज़्यादा देर फोकस करें। ज़्यादा याद रखें।',
    sub: `विद्यार्थियों, प्रतियोगी परीक्षा की तैयारी करने वालों और कामकाजी लोगों के लिए 30 दिन का ब्रेन-स्किल्स प्रोग्राम। ${trainer.nameHi} के साथ 7 लाइव क्लासेस + रोज़ 10–15 मिनट ऐप पर अभ्यास — और Day 1 से Day 30 तक आपकी प्रगति नापी जाती है।`,
    speedTest: 'मुफ़्त Reading और Memory Test दें →',
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
      'Day 1 और Day 30 के अपने रीडिंग आँकड़ों की तुलना करना।',
    ],
  },
  app: {
    eyebrow: 'ऐप के अंदर',
    title: 'Mind Ur Mind App में आपका रोज़ का अभ्यास',
    note: 'रोज़ 10–15 मिनट। प्रगति अपने-आप ट्रैक होती है।',
    plan: {
      title: 'आपका 30 दिन का प्लान, रोज़ एक दिन',
      points: ['ऐप खोलते ही आज के steps तैयार: लगभग 12 मिनट।', 'सारे 30 दिन एक ही screen पर, हर पूरे दिन के लिए stars।', 'कोई दिन छूट गया? वहीं से फिर शुरू करें, कुछ नहीं खोता।'],
      alt: 'Mind Ur Mind App की 34 सेकंड की झलक: 30 दिन का प्लान, फ़ोकस, याददाश्त, स्पीड रीडिंग और शांत साँस',
    },
    groups: [
      { id: 'focus', skill: 'फोकस', exercises: ['Color-Word Sync Grid', 'Peripheral Vision Activator'] },
      { id: 'reading', skill: 'स्मार्ट रीडिंग', exercises: ['Word Flash (एक बार में एक शब्द)', 'Phrase Reading', 'Sentence Reading', 'Inner Voice Control', 'Progressive Chunk Reading'] },
      { id: 'memory', skill: 'याददाश्त', exercises: ['Keyword method', 'Names and faces', 'Number pictures', 'Mental Object Rotation'] },
      { id: 'visual', skill: 'Memory Studio', exercises: ['Peg method', 'Story method', 'Memory Palace', 'Chapter & Book'] },
      { id: 'calm', skill: 'शांति और अनुशासन', exercises: ['Calm Breathing', 'आँखों को आराम का ब्रेक'] },
    ],
    shotAlt: {
      focus: 'Mind Ur Mind App में चलता हुआ Peripheral Vision Activator अभ्यास',
      reading: 'Word Flash स्पीड रीडिंग, एक बार में एक शब्द',
      memory: 'Mind Ur Mind App में Keyword method का अभ्यास',
      visual: 'Mind Ur Mind App के Memory Studio में Peg method',
      calm: 'Mind Ur Mind App में Calm Breathing अभ्यास',
    },
  },
  classes: {
    eyebrow: 'प्रोग्राम की असली ताक़त',
    title: '7 लाइव क्लासेस',
    items: [
      { title: 'Foundation (बुनियाद)', desc: 'ध्यान, पढ़ना और याददाश्त कैसे काम करते हैं, और आपके 30 दिनों की योजना।' },
      { title: 'Eye & Focus Training', desc: 'पढ़ते और पढ़ाई करते समय स्थिर ध्यान के लिए आँखों और फ़ोकस के अभ्यास।' },
      { title: 'Inner Voice Control', desc: 'मन में हर शब्द बोले बिना पढ़ना, ताकि आप तेज़ पढ़ें और समझ भी बनी रहे।' },
      { title: 'Memory Systems', desc: 'तथ्य, फ़ॉर्मूले और नाम याद रखने के लिए मेमोरी पैलेस, एसोसिएशन और दूसरे तरीके।' },
      { title: 'Visualisation & Imagination', desc: 'समझने, याद रखने और दबाव में शांत रहने के लिए मन की तस्वीरों का उपयोग।' },
      { title: 'Study & Work Application', desc: 'परीक्षा, रिवीज़न और काम की रीडिंग में इन तरीकों का उपयोग।' },
      { title: 'Day 30 Review & Your Next Plan', desc: 'आदतें, फ़ोन अनुशासन और 30 दिनों के बाद की आपकी योजना।' },
    ],
    note: `${trainer.nameHi} के साथ Zoom पर लाइव, शाम 7:00–9:00 बजे (IST), हर महीने एक पूरा चक्र। कोई क्लास छूट गई? उसे अगले महीने के चक्र में जॉइन करें, या Classplus पर रिकॉर्डिंग देखें।`,
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
      { title: 'Day 1 पर निष्पक्ष रीडिंग टेस्ट', desc: 'ऐप में अपनी गति से पढ़ने वाला टेस्ट: आपकी रीडिंग स्पीड और समझ — आपकी अपनी शुरुआत।' },
      { title: '7 लाइव क्लासेस', desc: `30 दिनों में ${trainer.nameHi} के साथ Zoom पर लाइव।` },
      { title: 'रोज़ ऐप पर अभ्यास', desc: 'Mind Ur Mind App में रोज़ 10–15 मिनट, अपने-आप ट्रैक।' },
      { title: 'Day 30 पर निष्पक्ष रीडिंग टेस्ट', desc: 'बराबर कठिन पैराग्राफ़, आपके Day 1 नतीजे से तुलना के साथ।' },
    ],
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
  },
  trainer: { eyebrow: 'आपके ट्रेनर', readStory: 'पूरी कहानी पढ़ें →' },
  offer: {
    eyebrow: 'नामांकन',
    title: 'Sharp Brain 30-दिवसीय प्रोग्राम में सब कुछ',
    items: [
      `${trainer.nameHi} के साथ 7 लाइव क्लासेस`,
      '30 दिन का गाइडेड ऐप अभ्यास (सभी एक्सरसाइज़)',
      'Day 1 और Day 30 पर निष्पक्ष रीडिंग टेस्ट',
      'परीक्षा और काम के लिए याद रखने और दोहराने के तरीके',
      'कोर्स पूरा करने का सर्टिफ़िकेट',
      'प्रोग्राम के दौरान WhatsApp सपोर्ट',
    ],
    questions: 'सवाल हैं? WhatsApp पर बात करें',
  },
  faq: {
    eyebrow: 'सवाल',
    title: 'नामांकन से पहले',
    items: [
      { question: 'क्या सेल्फ़-पेस्ड में सर्टिफ़िकेट मिलेगा?', answer: 'हाँ — वही सर्टिफ़िकेट।' },
      { question: 'क्या सेल्फ़-पेस्ड में लाइव क्लास मिलेंगी?', answer: 'नहीं। सातों क्लास रिकॉर्डेड हैं।' },
      { question: 'अपग्रेड कैसे करूँ?', answer: 'खरीदने के 7 दिन के भीतर ₹6,000 देकर लाइव बैच में जा सकते हैं। लिंक के लिए वॉट्सऐप कीजिए।' },
      { question: 'क्या रिकॉर्डेड क्लास डाउनलोड हो सकती हैं?', answer: 'नहीं। 30 दिन तक ऐप में देख सकते हैं।' },
      {
        question: 'EEG ब्रेन टेस्ट क्या है?',
        answer:
          'यह EEG हेडबैंड से किया जाने वाला एक आसान टेस्ट है, जो पढ़ते और ध्यान करते समय आपके फ़ोकस का संकेत (indicator) ग्राफ़ में दिखाता है। Day 1 और Day 30 की तुलना से आप अपना बदलाव ख़ुद देख सकते हैं। यह कोई मेडिकल जाँच नहीं है। यह टेस्ट ऑफ़लाइन वर्कशॉप में आमने-सामने होता है।',
      },
    ],
  },
  final: { title: 'आपका दिमाग़ बेहतर सीख सकता है। अगले बैच से शुरू करें।', speedTest: 'मुफ़्त Reading और Memory Test दें →' },
  sticky: { cta: 'नामांकन' },
  reviews: {
    metaTitle: 'Video Reviews — Sharp Brain™ | Mind Ur Mind',
    eyebrow: 'असली विद्यार्थी',
    h1: 'Sharp Brain™ वीडियो रिव्यूज़',
    sub: 'पहले के बैचों के विद्यार्थी अपने शब्दों में अपना अनुभव बताते हैं। यहाँ देखें या हमारे YouTube चैनल पर।',
    programLink: '30-दिवसीय प्रोग्राम में क्या है, देखें →',
  },
  offers: {
    hero: {
      h1: 'पढ़ने की रफ़्तार, ध्यान और याददाश्त — 30 दिन में, नाप कर।',
      sub: 'ऐप पर रोज़ 10–15 मिनट अभ्यास · Day 1 और Day 30 पर आपके अपने नंबर',
      liveButton: (price) => `लाइव बैच · ${price}`,
      selfButton: `सेल्फ़-पेस्ड · ${selfPacedPrice}`,
      seats: 'हर लाइव बैच में 40 सीट · कभी भी जुड़िए — अगली लाइव क्लास से शुरू कीजिए।',
    },
    rolling: 'कभी भी जुड़िए — अगली लाइव क्लास से शुरू कीजिए।',
    table: {
      title: 'सेल्फ़-पेस्ड या लाइव बैच',
      feature: 'सुविधा',
      included: 'शामिल',
      notIncluded: 'शामिल नहीं',
      rows: [
        { feature: 'सातों क्लास', self: 'रिकॉर्डेड', live: 'लाइव' },
        // Owner (Nov 2026): EEG ब्रेन टेस्ट — सिर्फ़ लाइव बैच, ऑफ़लाइन।
        {
          feature: 'EEG ब्रेन टेस्ट (Day 1 & Day 30)',
          self: false,
          live: { included: true, note: 'ऑफ़लाइन' },
          card: {
            text: '🧠 EEG ब्रेन टेस्ट — Day 1 और Day 30 पर (EEG हेडबैंड से) — अपने फ़ोकस का बदलाव ग्राफ़ में देखें',
            note: 'ऑफ़लाइन — आमने-सामने की वर्कशॉप में। ऑनलाइन छात्रों के लिए Day 1 और Day 30 का Sharp Brain टेस्ट।',
          },
        },
        { feature: '30 दिन ऐप अभ्यास', self: true, live: true },
        { feature: 'Day 1 / Day 30 टेस्ट + सर्टिफ़िकेट', self: true, live: true },
      ],
    },
    live: { name: 'लाइव बैच', badge: 'लाइव क्लास के साथ', perDay: (price) => `≈ ${price}/दिन`, cta: 'लाइव बैच में सीट लें' },
    self: {
      name: 'सेल्फ़-पेस्ड',
      price: selfPacedPrice,
      noLive: 'लाइव क्लास नहीं हैं — सातों क्लास रिकॉर्डेड।',
      recordings: 'क्लास की रिकॉर्डिंग ऐप में तुरंत खुल जाती है।',
      cta: 'सेल्फ़-पेस्ड शुरू करें',
      upgrade: '7 दिन के भीतर ₹6,000 देकर लाइव बैच में बदल सकते हैं — वॉट्सऐप पर बताइए।',
    },

    plansTitle: 'जुड़ने का तरीक़ा चुनिए',
    plansSub: '₹499 की 2 दिन की वर्कशॉप से शुरू करें, या सीधे 30 दिन का पूरा प्रोग्राम लें।',
    plans: [
      {
        id: 'workshop',
        name: '2 दिन की ऑनलाइन वर्कशॉप',
        price: '₹499',
        note: '2 लाइव ऑनलाइन सेशन · हर बैच में अधिकतम 50',
        badge: 'यहाँ से शुरू करें',
        points: [
          'डॉ. कपिल देव शर्मा के साथ 2 लाइव ऑनलाइन सेशन',
          'फ़ोकस, याददाश्त और स्मार्ट रीडिंग की तकनीकें, जो उसी दिन काम आएँ',
          'फ़ैसला लेने से पहले देखें कि पूरा प्रोग्राम कैसे चलता है',
        ],
        cta: 'मेरी सीट बुक करें · ₹499',
        href: { kind: 'whatsapp', message: 'नमस्ते डॉ. कपिल, मुझे ₹499 वाली Sharp Brain 2 दिन की ऑनलाइन वर्कशॉप बुक करनी है।' },
        featured: false,
      },
      {
        id: 'self',
        name: 'सेल्फ़-पेस्ड',
        price: selfPacedPrice,
        note: 'अपने समय पर सीखें',
        badge: null,
        points: ['सातों क्लास रिकॉर्डेड — तुरंत खुल जाती हैं', '30 दिन का गाइडेड ऐप अभ्यास', 'Day 1 और Day 30 टेस्ट + सर्टिफ़िकेट'],
        cta: `सेल्फ़-पेस्ड शुरू करें · ${selfPacedPrice}`,
        href: { kind: 'link', url: LINKS.rzpSharpBrainSelfPaced2999 },
        featured: false,
      },
      {
        id: 'live',
        name: 'लाइव ऑनलाइन',
        price: '₹4,999',
        note: 'अगला बैच: सोम 14 दिसंबर 2026 · फिर 11 जनवरी 2027',
        badge: 'सबसे लोकप्रिय',
        points: [
          'डॉ. कपिल के साथ Zoom पर 7 लाइव क्लास — सोम और बुध, रात 8 बजे',
          'क्लास छूटी? रिकॉर्डिंग देख लें',
          '30 दिन का गाइडेड ऐप अभ्यास',
          'Day 1 और Day 30 टेस्ट + सर्टिफ़िकेट',
          'पहली 2 क्लास के बाद संतुष्ट नहीं? पूरी फ़ीस वापस।',
        ],
        cta: 'लाइव ऑनलाइन बुक करें · ₹4,999',
        href: { kind: 'whatsapp', message: 'नमस्ते डॉ. कपिल, मुझे ₹4,999 वाले Sharp Brain लाइव ऑनलाइन बैच (14 दिसंबर) में जुड़ना है।' },
        featured: true,
      },
      {
        id: 'offline',
        name: 'ऑफ़लाइन वर्कशॉप + EEG',
        price: '₹8,999',
        note: 'आमने-सामने · शहर और तारीख़ WhatsApp पर',
        badge: 'EEG ब्रेन टेस्ट के साथ',
        points: [
          '2 दिन की आमने-सामने वर्कशॉप, सुबह 10 से शाम 4, लंच शामिल',
          'पहले और बाद में लाइव EEG ब्रेन टेस्ट — अपना फ़ोकस ग्राफ़ पर देखें',
          'बाक़ी 5 क्लास लाइव ऑनलाइन',
          '30 दिन का गाइडेड ऐप अभ्यास + सर्टिफ़िकेट',
        ],
        cta: 'अगली वर्कशॉप की जानकारी लें',
        href: { kind: 'whatsapp', message: 'नमस्ते डॉ. कपिल, मुझे ₹8,999 वाली Sharp Brain ऑफ़लाइन वर्कशॉप (EEG के साथ) में जुड़ना है। अगला शहर और तारीख़ बताइए।' },
        featured: false,
      },
    ],
    plansTable: {
      title: 'प्लान की तुलना',
      feature: 'आपको क्या मिलता है',
      included: 'शामिल',
      notIncluded: 'शामिल नहीं',
      rows: [
        { feature: 'डॉ. कपिल के साथ क्लास', cells: ['2 लाइव', '7 रिकॉर्डेड', '7 लाइव', '2 दिन आमने-सामने + 5 लाइव'] },
        { feature: '30 दिन ऐप अभ्यास', cells: [false, true, true, true] },
        { feature: 'Day 1 और Day 30 टेस्ट + सर्टिफ़िकेट', cells: [false, true, true, true] },
        { feature: 'EEG ब्रेन टेस्ट', cells: [false, false, false, { included: true, note: 'आमने-सामने' }] },
        { feature: 'पहली 2 क्लास के बाद रिफ़ंड', cells: [false, false, true, false] },
      ],
    },
    refund: {
      title: 'रिफ़ंड नीति — लाइव ऑनलाइन',
      text: 'पहली 2 लाइव क्लास में शामिल हों। संतुष्ट न हों तो तीसरी क्लास से पहले WhatsApp पर बता दें, हम पूरी फ़ीस लौटा देंगे।',
    },
    heroPlansButton: 'प्लान देखें — ₹499 से',
    heroTestButton: 'मुफ़्त Brain Test दें',
    heroLine: 'जुड़ने के 4 तरीक़े · ₹499 की वर्कशॉप से शुरू करें या सीधे 30 दिन का प्रोग्राम लें।',
    stickyFrom: '₹499 से',
  },
}

export const sharpBrainCopy: Record<Lang, SharpBrainCopy> = { en, hi }
