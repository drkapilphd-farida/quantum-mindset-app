import { FOUNDING_PARTNERS, PARTNER_PROGRAM } from '@/config/partnerProgram'
import { formatInr } from './earnings'

// /partner — Sharp Brain™ Partner Program. English only, simple words.
// Copy from the owner's partner brief (Nov 2026); the short lines that the
// brief left to the design reference are translated from its Hindi.
// Rules: no "guaranteed income", no "job"/"naukri"; every earning number is
// labelled as an example; the EEG is the "Brain State Demo", no device brand.

const fee = formatInr(PARTNER_PROGRAM.feeInr)
const emi = `${PARTNER_PROGRAM.emi.count} × ${formatInr(PARTNER_PROGRAM.emi.amountInr)}`

export const partnerCopy = {
  meta: {
    title: 'Sharp Brain™ Partner Program — Start Your Own Brain Training Business | Mind Ur Mind',
    description:
      "Bring Sharp Brain to your area: a measurable focus, memory and reading program with a Day 1 and Day 30 score. No shop or centre needed. Apply for a personal meeting with Dr. Kapil Dev Sharma.",
  },
  nav: { cta: 'Apply' },
  hero: {
    eyebrow: 'SHARP BRAIN™ PARTNER PROGRAM · MIND UR MIND',
    h1: 'Solve the biggest problem of the mobile age — and start your own Brain Training business',
    sub: "In every home, children's focus, memory and study habits are getting weaker. Sharp Brain is a measurable solution — with a Day 1 and Day 30 score. Now you can bring it to your area.",
    apply: 'Apply for a Personal Meeting',
    calc: 'Calculate Your Earnings ↓',
    card: {
      label: 'Your estimated monthly earnings',
      students: (self: number, live: number) => `${self} Self + ${live} Live students / month`,
      back: `${fee} back`,
      note: 'Change it in the calculator below · Example only, not a guarantee',
    },
    stats: [
      { value: '20+ years', label: 'of experience' },
      { value: '500+', label: 'workshops' },
      { value: '10,000+', label: 'people trained' },
      { value: '0 sq ft', label: 'no shop or centre needed' },
    ],
  },
  problem: {
    title: 'Every parent says…',
    cards: [
      { quote: 'Can’t sit and study for even 10 minutes', line: 'Phone habits keep pulling their attention away.' },
      { quote: 'Forgets what they studied', line: 'What they learnt does not come back in the exam.' },
      { quote: 'Takes too long to read', line: 'Slow reading means the syllabus never gets finished.' },
    ],
    band: {
      title: 'Sharp Brain™ — Focus · Memory · Smart Reading',
      text: '7 live classes + app practice + Day 1 and Day 30 measurement. Parents see results, not just talk — that is why it is easy to sell.',
      prices: [
        { label: 'Self', price: formatInr(PARTNER_PROGRAM.selfPriceInr) },
        { label: 'Live', price: formatInr(PARTNER_PROGRAM.livePriceInr) },
      ],
    },
    // Owner (Nov 2026): say clearly that Sharp Brain is not Midbrain or
    // Quantum Speed Reading — respectfully, without running them down.
    different: {
      title: 'Not Midbrain Activation. Not Quantum Speed Reading.',
      text: 'Many parents have heard of those programs — they have their own approach. Sharp Brain is different: a science-backed, 100% results-oriented program. It uses proven learning methods — attention training, reading-skill practice, memory techniques, active recall and revision — and every child is tested on Day 1 and Day 30, so parents see their own child’s progress in numbers.',
    },
  },
  proof: {
    title: 'Real students. Real results.',
    sub: 'Students of Sharp Brain talk about their experience in their own words.',
    more: 'See more reviews',
    youtube: 'More reviews on our YouTube channel →',
  },
  calculator: {
    title: 'Calculate your own earnings',
    sub: `Move the sliders — see how fast your ${fee} comes back.`,
    self: { label: `Self students per month (${formatInr(PARTNER_PROGRAM.selfPriceInr)})`, note: `You keep ${formatInr(PARTNER_PROGRAM.perStudent.self)} per student (15% royalty)` },
    live: { label: `Live students per month (${formatInr(PARTNER_PROGRAM.livePriceInr)})` },
    liveNote: {
      drKapil: `You keep ${formatInr(PARTNER_PROGRAM.perStudent.liveDrKapil)} per student (Dr. Kapil takes the class, 50% royalty)`,
      self: `You keep ${formatInr(PARTNER_PROGRAM.perStudent.liveSelf)} per student (you take the class, 15% royalty)`,
    },
    teacher: { question: 'Who takes the live classes?', drKapil: 'Dr. Kapil (at the start)', self: 'Me (Level 2 certified)' },
    result: {
      monthly: 'Your earnings every month',
      fromSelf: 'From Self',
      fromLive: 'From Live',
      back: `${fee} back`,
      yearly: 'In a year (at this pace)',
      note: 'This is only an example, not a guarantee of income. Real earnings depend on your effort and your area.',
    },
  },
  firstMonth: {
    title: 'Your first month',
    weeks: [
      { week: 'Week 1', title: '7-day online training', text: 'The program, the app, the test and the demo script — then your certificate.' },
      { week: 'Week 2', title: 'First society demo', text: 'A free Reading-Memory Test for children, with the score shown to parents.' },
      { week: 'Week 3', title: 'First students, first earnings', text: 'You collect the fee, you activate the student in the app.' },
      { week: 'Week 4', title: 'Local ads and schools', text: 'Local ads with ready-made videos, and a free school seminar.' },
    ],
  },
  compare: {
    title: 'Compared with a typical franchise',
    caption: 'A typical Abacus or Brain franchise compared with the Sharp Brain Partner Program',
    typical: 'Typical Abacus/Brain franchise*',
    ours: 'Sharp Brain Partner',
    rows: [
      { label: 'Space', typical: '300–1000 sq ft centre', ours: 'None — from home, in societies' },
      { label: 'Brand fee', typical: '₹25,000 to ₹2,00,000', ours: `${fee} (EMI available)` },
      { label: 'Royalty', typical: '20–30%', ours: '15% (50% when we take the live class)' },
      { label: 'Teaching', typical: 'You do it yourself', ours: 'Dr. Kapil takes the live classes at the start' },
      { label: 'Result measurement', typical: 'Depends on brand', ours: 'Day 1 and Day 30 report in the app' },
    ],
    footnote: '*Based on typical ranges of Abacus/Brain brands listed on Franchise India, November 2026.',
  },
  get: {
    title: 'What you get',
    items: [
      '7-day training and certificate',
      'Partner dashboard (students, earnings, royalty)',
      'Your own page, link and QR',
      'Ready ad videos, posts and flyers',
      'Society demo and school seminar scripts',
      'Your own area',
      'Weekly partner call with Dr. Kapil',
      'No monthly fee, no targets',
    ],
  },
  packages: {
    title: 'Choose your package',
    founding: `Founding Partners: first ${FOUNDING_PARTNERS.total} at ${formatInr(FOUNDING_PARTNERS.priceInr)} · ${FOUNDING_PARTNERS.seatsLeft} seats left`,
    gst: '+ GST',
    apply: 'Apply',
    items: [
      {
        name: 'Sharp Brain Partner',
        price: fee,
        sub: `or ${emi} EMI`,
        text: 'Training, app, dashboard, full marketing kit, your own area.',
        primary: true,
      },
      {
        name: 'Partner + EEG Brain Demo',
        price: formatInr(PARTNER_PROGRAM.eegPackageInr),
        sub: 'Everything + EEG headband',
        text: 'The child’s brain state on screen during the demo — the most powerful moment for parents.',
        primary: false,
      },
    ],
  },
  about: {
    eyebrow: 'Your mentor',
    name: 'Dr. Kapil Dev Sharma',
    photoAlt: 'Dr. Kapil Dev Sharma',
    text: 'Mind, brain and meditation coach for 20+ years. Professor for 15 years. 500+ workshops, 10,000+ people trained. Working on Sharp Brain since 2015.',
    quote: '“I will give you not just a program, but a complete system — so you can change the lives of children in your area and earn well.”',
  },
  apply: {
    title: 'Apply for a 30-minute personal meeting',
    sub: 'Dr. Kapil will talk to you himself — your area, the demo and the full numbers.',
    name: 'Name',
    phone: 'WhatsApp number',
    phoneHint: '10-digit Indian mobile number',
    city: 'City / Area',
    choose: 'Choose',
    occupation: 'What do you do now?',
    contact: 'Do you have direct contact with children or parents?',
    invest: `The partner fee is ${fee} + GST. Are you ready to invest?`,
    start: 'When would you like to start?',
    submit: 'Send application',
    sending: 'Sending…',
    privacy: 'Your details will only be used to schedule the meeting.',
    thanks: {
      title: 'Thank you! We have received your application.',
      text: "You will get Dr. Kapil's 3-minute video and a link to book your meeting on WhatsApp.",
      whatsapp: 'Send my details on WhatsApp too',
    },
  },
  faq: {
    title: 'Questions',
    items: [
      {
        question: 'Do I need experience?',
        answer:
          'No. The 7-day training teaches you everything — the demo, the test, how to talk to parents and the app. If you already know children or parents, starting is easier.',
      },
      {
        question: 'Is Sharp Brain like Midbrain Activation or Quantum Speed Reading?',
        answer:
          'No. Those are different programs with their own approach. Sharp Brain is a science-backed, 100% results-oriented program: proven learning methods, and a Day 1 and Day 30 test that measures every child’s progress.',
      },
      {
        question: 'How much time is needed?',
        answer: 'You can do it part-time. Start with 1–2 society demos a week and follow up with parents.',
      },
      {
        question: 'How will I get paid?',
        answer:
          'You collect the student’s fee yourself — cash, UPI or online. You activate the student in the app and send the royalty within 7 days.',
      },
      {
        question: 'Is there a monthly fee or target?',
        answer:
          'No. You only pay royalty per student: 15% on Self, and on Live 50% (when Dr. Kapil takes the class) or 15% (when you take it yourself after Level 2 certification).',
      },
      {
        question: 'Who takes the live classes?',
        answer:
          'At the start, Dr. Kapil himself, on Zoom. After assisting in 2 batches and passing the certification, you can take them yourself.',
      },
      { question: 'Is EMI available?', answer: `Yes, ${emi}.` },
    ],
  },
} as const
