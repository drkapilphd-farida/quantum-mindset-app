import type { Bi } from '@/features/programs/types'

// /calm-mind-batch — the 21-Day Online Retreat (owner, 23 Nov 2026; it
// replaces the 21-Day Calm Mind batch and the Mind Reset course): 7 live
// classes, a live morning meditation every day, a private WhatsApp group.
// {startDate} etc. are filled in from site.config.ts (calmMindBatch).
// Content rules: no cure/treat/heal/guarantee/100%/इलाज — skills, practice
// and habits only.

export const CALM_PRICE_LABEL = '₹3,999'
export const CALM_REGULAR_LABEL = '₹4,999'

export const CALM_COPY = {
  meta: {
    title: { en: '21-Day Online Retreat with Dr. Kapil Dev Sharma — Calm Mind, Clear Life', hi: '21 दिन का ऑनलाइन रिट्रीट — डॉ. कपिल देव शर्मा के साथ' },
    description: {
      en: 'A live morning meditation every day, 7 live Zoom classes and a private WhatsApp group. 21 days to a calmer mind, better sleep and less overthinking. Early-bird ₹3,999 until 20 Dec (then ₹4,999).',
      hi: 'हर सुबह लाइव मेडिटेशन, 7 लाइव Zoom क्लास और प्राइवेट WhatsApp ग्रुप। 21 दिन में शांत मन, बेहतर नींद और कम ओवरथिंकिंग। अर्ली-बर्ड ₹3,999, 20 दिसंबर तक (फिर ₹4,999)।',
    },
  },
  disclaimer: {
    en: 'This is a coaching and meditation program, not a substitute for medical or psychological treatment. If you are in crisis, please contact a doctor or Tele-MANAS 14416.',
    hi: 'यह coaching और meditation program है, चिकित्सा या मनोवैज्ञानिक उपचार का विकल्प नहीं। संकट में हों तो डॉक्टर या Tele-MANAS 14416 से संपर्क करें।',
  },
  hero: {
    pill: { en: '21-DAY ONLINE RETREAT · 50 SEATS', hi: '21 दिन का ऑनलाइन रिट्रीट · 50 सीटें' },
    h1: { en: '21 days to a calm mind — a live online retreat with Dr. Kapil', hi: '21 दिन में शांत मन — डॉ. कपिल के साथ लाइव ऑनलाइन रिट्रीट' },
    sub: {
      en: 'A live guided meditation every morning at 6:30, 7 live evening classes on Zoom, and a private WhatsApp group — from your own home. Calm, Clear, Connect: one week each.',
      hi: 'हर सुबह 6:30 बजे लाइव गाइडेड मेडिटेशन, Zoom पर 7 लाइव शाम की क्लास, और एक प्राइवेट WhatsApp ग्रुप — अपने घर से। Calm, Clear, Connect: हर हफ़्ता एक चरण।',
    },
    batchLine: (start: string, days: string, time: string): Bi => ({ en: `Next batch starts ${start} · ${days} · ${time}`, hi: `अगला बैच ${start} से शुरू · ${days} · ${time}` }),
    reserve: { en: 'Reserve my seat — ₹3,999 early-bird', hi: 'मेरी सीट पक्की करें — ₹3,999 अर्ली-बर्ड' },
    ask: { en: 'Have a question? Ask on WhatsApp', hi: 'कोई सवाल? WhatsApp पर पूछिए' },
    seatsLeft: (n: number): Bi => ({ en: `Only ${n} seats left in this batch`, hi: `इस बैच में सिर्फ़ ${n} सीटें बाकी` }),
  },
  askMessage: 'Hi Dr. Kapil, I want to know more about the 21-Day Online Retreat.',
  waitlistMessage: 'Hi Dr. Kapil, please add me to the waitlist for the next 21-Day Online Retreat.',
  full: { en: 'Batch full — join the waitlist', hi: 'बैच भर गया — वेटलिस्ट में नाम लिखवाइए' },
  ended: { en: 'Next batch: dates announced soon — join the waitlist', hi: 'अगला बैच: तारीख़ें जल्द आएँगी — वेटलिस्ट में नाम लिखवाइए' },
  familiar: {
    heading: { en: 'Does this feel familiar?', hi: 'क्या यह जाना-पहचाना लगता है?' },
    cards: [
      { en: 'Your mind speeds up the moment you lie down.', hi: 'लेटते ही मन तेज़ दौड़ने लगता है।' },
      { en: 'A heavy chest or restless feeling before work or a call.', hi: 'काम या किसी कॉल से पहले सीने में भारीपन या बेचैनी।' },
      { en: 'The same thought, again and again, on a loop.', hi: 'एक ही विचार, बार-बार, घूमता रहता है।' },
      { en: 'Tired all day, yet unable to truly relax.', hi: 'दिन भर थकान, फिर भी सच में आराम नहीं मिलता।' },
    ] as Bi[],
    closing: {
      en: 'This is a pattern your mind has learned — and the mind can learn a calmer one. That is exactly what these 21 days of daily practice train.',
      hi: 'यह एक पैटर्न है जो मन ने सीख लिया है — और मन एक शांत पैटर्न भी सीख सकता है। ये 21 दिन ठीक यही सिखाते हैं।',
    },
  },
  get: {
    heading: { en: 'What you get', hi: 'आपको क्या मिलता है' },
    cards: [
      { title: { en: 'Live morning meditation, every day', hi: 'हर सुबह लाइव मेडिटेशन' }, line: { en: '6:30–7:00 AM on Zoom, all 21 days. Missed it? The recording reaches you the same morning.', hi: 'Zoom पर सुबह 6:30–7:00, पूरे 21 दिन। छूट गया? रिकॉर्डिंग उसी सुबह आप तक पहुँच जाती है।' } },
      { title: { en: '7 live classes with Dr. Kapil', hi: 'डॉ. कपिल के साथ 7 लाइव क्लास' }, line: { en: 'Evening classes, 75 minutes: understanding, guided practice and your questions answered.', hi: 'शाम की क्लास, 75 मिनट: समझ, गाइडेड अभ्यास और आपके सवालों के जवाब।' } },
      { title: { en: 'Private WhatsApp group', hi: 'प्राइवेट WhatsApp ग्रुप' }, line: { en: 'The Zoom link and the day’s practice every morning, and a simple “✓ done” check-in every night.', hi: 'हर सुबह Zoom लिंक और आज का अभ्यास, और हर रात एक आसान “✓ हो गया” चेक-इन।' } },
      { title: { en: 'All recordings for 3 months', hi: 'सारी रिकॉर्डिंग 3 महीने तक' }, line: { en: 'Every class and meditation, to repeat whenever you need.', hi: 'हर क्लास और मेडिटेशन, जब चाहें दोबारा करने के लिए।' } },
      { title: { en: '21-day practice tracker', hi: '21 दिन का प्रैक्टिस ट्रैकर' }, line: { en: 'Rate your restlessness, sleep and focus on day 1, 11 and 21, and see your own change.', hi: 'दिन 1, 11 और 21 पर अपनी बेचैनी, नींद और फ़ोकस को नंबर दीजिए, और अपना बदलाव ख़ुद देखिए।' } },
      { title: { en: 'Certificate of completion', hi: 'पूरा करने पर सर्टिफ़िकेट' }, line: { en: 'For everyone who completes the 21 days.', hi: '21 दिन पूरे करने वाले हर व्यक्ति को।' } },
    ] as { title: Bi; line: Bi }[],
  },
  journey: {
    heading: { en: 'Your 21-day journey — Calm · Clear · Connect', hi: 'आपका 21 दिन का सफ़र — Calm · Clear · Connect' },
    steps: [
      { title: { en: 'Opening: arriving in the retreat', hi: 'शुरुआत: रिट्रीट में आना' }, line: { en: 'How the 21 days work, your daily rhythm, and your first guided practice.', hi: '21 दिन कैसे चलेंगे, आपकी रोज़ की लय, और आपका पहला गाइडेड अभ्यास।' } },
      { title: { en: 'Week 1 · Calm: breath and body', hi: 'हफ़्ता 1 · Calm: साँस और शरीर' }, line: { en: 'Breathing techniques that settle you in minutes; releasing physical tension.', hi: 'साँस की तकनीकें जो कुछ ही मिनट में शांत करें; शरीर का तनाव छोड़ना।' } },
      { title: { en: 'Week 1 · Calm: deeper sleep', hi: 'हफ़्ता 1 · Calm: गहरी नींद' }, line: { en: 'A bedtime routine that slows the mind down.', hi: 'सोने से पहले का एक रूटीन जो मन को धीमा करे।' } },
      { title: { en: 'Week 2 · Clear: the thought loop', hi: 'हफ़्ता 2 · Clear: विचारों का चक्कर' }, line: { en: 'How overthinking runs, and how to step out of it mid-way.', hi: 'ओवरथिंकिंग कैसे चलती है, और बीच में ही उससे बाहर कैसे निकलें।' } },
      { title: { en: 'Week 2 · Clear: making friends with emotions', hi: 'हफ़्ता 2 · Clear: भावनाओं से दोस्ती' }, line: { en: 'Handling fear and anger without suppressing them.', hi: 'डर और ग़ुस्से को दबाए बिना सँभालना।' } },
      { title: { en: 'Week 3 · Connect: inner silence and intuition', hi: 'हफ़्ता 3 · Connect: भीतर की शांति और इनट्यूशन' }, line: { en: 'Heart-brain coherence and deeper meditation; listening to your inner voice.', hi: 'हार्ट-ब्रेन कोहेरेंस और गहरा मेडिटेशन; अपनी अंदर की आवाज़ सुनना।' } },
      { title: { en: 'Closing: your path ahead', hi: 'समापन: आगे का रास्ता' }, line: { en: 'Your own 10-minute daily routine for life; day-21 progress check and certificate.', hi: 'ज़िंदगी भर के लिए आपका अपना 10 मिनट का रूटीन; दिन 21 पर प्रोग्रेस जाँच और सर्टिफ़िकेट।' } },
    ] as { title: Bi; line: Bi }[],
  },
  outcomes: {
    heading: { en: 'By day 21, you will have', hi: 'दिन 21 तक आपके पास होगा' },
    items: [
      { en: '3 techniques to calm yourself in an anxious moment', hi: 'घबराहट के पल में ख़ुद को शांत करने की 3 तकनीकें' },
      { en: 'A bedtime routine that slows the mind down', hi: 'सोने से पहले का एक रूटीन जो मन को धीमा करे' },
      { en: 'A clear way to spot and stop overthinking', hi: 'ओवरथिंकिंग को पहचानने और रोकने का साफ़ तरीका' },
      { en: 'A daily meditation habit, built over 21 mornings', hi: '21 सुबहों में बनी रोज़ के मेडिटेशन की आदत' },
      { en: 'Your own 10-minute daily practice', hi: 'आपका अपना 10 मिनट का रोज़ का अभ्यास' },
    ] as Bi[],
  },
  classRuns: {
    heading: { en: 'How every live class runs', hi: 'हर लाइव क्लास कैसे चलती है' },
    segments: [
      { minutes: 25, label: { en: 'understanding', hi: 'समझ' } },
      { minutes: 35, label: { en: 'guided practice', hi: 'गाइडेड अभ्यास' } },
      { minutes: 15, label: { en: 'your questions', hi: 'आपके सवाल' } },
    ] as { minutes: number; label: Bi }[],
    min: { en: 'min', hi: 'मिनट' },
    line: { en: 'Camera optional. Hindi and English, in simple words.', hi: 'कैमरा ज़रूरी नहीं। हिंदी और अंग्रेज़ी, आसान शब्दों में।' },
  },
  reviews: {
    heading: { en: 'What people say about learning with Dr. Kapil', hi: 'डॉ. कपिल से सीखने वालों के अनुभव' },
    sub: { en: 'From his 1-on-1 sessions and meditation workshops.', hi: 'उनके 1-on-1 सेशन और मेडिटेशन वर्कशॉप से।' },
  },
  price: {
    title: { en: '21-Day Online Retreat', hi: '21 दिन का ऑनलाइन रिट्रीट' },
    sub: { en: 'Early-bird until 20 December · then ₹4,999 · just ₹190 a day', hi: 'अर्ली-बर्ड 20 दिसंबर तक · फिर ₹4,999 · सिर्फ़ ₹190 प्रतिदिन' },
    seats: { en: 'Seats: 50 per retreat', hi: 'सीटें: हर रिट्रीट में 50' },
    seatsLeftShort: (n: number): Bi => ({ en: `Only ${n} left`, hi: `सिर्फ़ ${n} बाकी` }),
    included: [
      { en: '21 live morning meditations', hi: '21 लाइव सुबह के मेडिटेशन' },
      { en: '7 live evening classes', hi: '7 लाइव शाम की क्लास' },
      { en: 'Private WhatsApp group', hi: 'प्राइवेट WhatsApp ग्रुप' },
      { en: 'Recordings for 3 months', hi: '3 महीने तक रिकॉर्डिंग' },
      { en: 'Practice tracker', hi: 'प्रैक्टिस ट्रैकर' },
      { en: 'Certificate', hi: 'सर्टिफ़िकेट' },
    ] as Bi[],
    upgrade: {
      en: 'Want deeper 1-on-1 work later? Your retreat fee is adjusted in any 1-on-1 plan taken within 14 days of the retreat ending.',
      hi: 'बाद में गहराई से 1-on-1 काम करना चाहें? रिट्रीट ख़त्म होने के 14 दिन के भीतर कोई भी 1-on-1 प्लान लेने पर आपकी रिट्रीट फ़ीस एडजस्ट हो जाती है।',
    },
  },
  compare: {
    heading: { en: 'Online Retreat or 1-on-1?', hi: 'ऑनलाइन रिट्रीट या 1-on-1?' },
    batch: { en: 'Online Retreat', hi: 'ऑनलाइन रिट्रीट' },
    oneOnOne: { en: '1-on-1', hi: '1-on-1' },
    rows: [
      { label: { en: 'Best for', hi: 'किसके लिए सही' }, batch: { en: 'Building a daily practice with a group', hi: 'ग्रुप के साथ रोज़ का अभ्यास बनाना' }, one: { en: 'Deep personal work on your own pattern', hi: 'अपने पैटर्न पर गहरा निजी काम' } },
      { label: { en: 'Format', hi: 'तरीका' }, batch: { en: '21 live morning meditations + 7 live classes', hi: '21 लाइव सुबह के मेडिटेशन + 7 लाइव क्लास' }, one: { en: 'Private sessions, plan from 2 days to 6 months', hi: 'निजी सेशन, 2 दिन से 6 महीने तक का प्लान' } },
      { label: { en: 'Start', hi: 'शुरुआत' }, batch: { en: '₹3,999 early-bird', hi: '₹3,999 अर्ली-बर्ड' }, one: { en: 'Clarity Session ₹1,100', hi: 'क्लैरिटी सेशन ₹1,100' } },
    ] as { label: Bi; batch: Bi; one: Bi }[],
    batchButton: { en: 'Reserve my seat', hi: 'मेरी सीट पक्की करें' },
    oneButton: { en: 'Book Clarity Session', hi: 'क्लैरिटी सेशन बुक करें' },
  },
  faq: {
    heading: { en: 'Questions', hi: 'सवाल' },
    missed: { q: { en: 'What if I miss a live class?', hi: 'अगर कोई लाइव क्लास छूट जाए तो?' }, a: { en: 'Every class and morning meditation is recorded; the recording reaches you the same day, and stays with you for 3 months.', hi: 'हर क्लास और सुबह का मेडिटेशन रिकॉर्ड होता है; रिकॉर्डिंग उसी दिन आप तक पहुँचती है और 3 महीने तक आपके पास रहती है।' } },
    camera: { q: { en: 'Do I need to switch on my camera or speak?', hi: 'क्या कैमरा ऑन करना या बोलना ज़रूरी है?' }, a: { en: 'No. Camera and mic are optional. You can just listen and practise.', hi: 'नहीं। कैमरा और माइक ज़रूरी नहीं। आप सिर्फ़ सुनकर अभ्यास कर सकते हैं।' } },
    language: { q: { en: 'What language is it in?', hi: 'क्लास किस भाषा में है?' }, a: { en: 'Simple Hindi and English, mixed naturally.', hi: 'आसान हिंदी और अंग्रेज़ी, स्वाभाविक रूप से मिली-जुली।' } },
    medication: { q: { en: 'I take medication. Can I join?', hi: 'मैं दवा लेता/लेती हूँ। क्या मैं जुड़ सकता/सकती हूँ?' }, a: { en: "Yes. These are breathing, relaxation and meditation practices; continue your doctor's advice as it is.", hi: 'हाँ। ये साँस, रिलैक्सेशन और मेडिटेशन के अभ्यास हैं; अपने डॉक्टर की सलाह वैसे ही जारी रखिए।' } },
    time: { q: { en: 'How much time does it need daily?', hi: 'रोज़ कितना समय लगेगा?' }, a: { en: '30 minutes every morning for the live meditation, plus 75 minutes on the 7 class evenings.', hi: 'हर सुबह 30 मिनट लाइव मेडिटेशन, और 7 क्लास वाली शामों को 75 मिनट।' } },
    links: { q: { en: 'How do I get the Zoom link and WhatsApp group?', hi: 'Zoom लिंक और WhatsApp ग्रुप कैसे मिलेगा?' }, a: { en: 'Immediately after payment on the confirmation page, and by email.', hi: 'पेमेंट के तुरंत बाद कन्फ़र्मेशन पेज पर, और ईमेल से।' } },
    after: {
      q: { en: 'What happens after 21 days?', hi: '21 दिन के बाद क्या होता है?' },
      a: { en: 'You keep all recordings and your routine. If you want deeper 1-on-1 work, you can continue with a plan.', hi: 'सारी रिकॉर्डिंग और आपका रूटीन आपके पास रहते हैं। गहराई से 1-on-1 काम करना चाहें, तो किसी प्लान के साथ आगे बढ़ सकते हैं।' },
      adjust: { en: ' (retreat fee adjusted within 14 days)', hi: ' (14 दिन के भीतर रिट्रीट फ़ीस एडजस्ट)' },
    },
    refund: { q: { en: 'Refund?', hi: 'रिफ़ंड?' } },
  },
  /** Owner (Nov 2026): price card and FAQ 8. */
  refund: {
    en: "Full refund if you cancel before the first class begins. After the first class, refunds aren't available — but you can move once to the next batch.",
    hi: 'पहली class शुरू होने से पहले रद्द करने पर पूरा पैसा वापस। पहली class के बाद refund नहीं, लेकिन आप एक बार अगले batch में शिफ़्ट हो सकते हैं।',
  },
  finalCta: {
    heading: (start: string): Bi => ({ en: `Your retreat starts on ${start}.`, hi: `आपका रिट्रीट ${start} से शुरू होता है।` }),
  },
  sticky: { en: '₹3,999 early-bird · Reserve my seat', hi: '₹3,999 अर्ली-बर्ड · मेरी सीट पक्की करें' },
  checkout: {
    title: { en: 'Your details', hi: 'आपकी जानकारी' },
    name: { en: 'Name', hi: 'नाम' },
    email: { en: 'Email', hi: 'ईमेल' },
    phone: { en: 'WhatsApp number', hi: 'WhatsApp नंबर' },
    pay: { en: 'Continue to payment', hi: 'पेमेंट पर आगे बढ़ें' },
    paying: { en: 'Opening payment…', hi: 'पेमेंट खुल रहा है…' },
    phoneError: { en: 'Please enter a valid 10-digit Indian mobile number.', hi: 'कृपया सही 10 अंकों का भारतीय मोबाइल नंबर लिखें।' },
    error: { en: 'The payment could not be opened. Please try again, or message us on WhatsApp.', hi: 'पेमेंट नहीं खुल सका। कृपया फिर से कोशिश करें, या WhatsApp पर मैसेज करें।' },
    close: { en: 'Close', hi: 'बंद करें' },
  },
  joined: {
    title: (start: string): Bi => ({ en: `You're in! 🎉 Welcome to the ${start} Online Retreat.`, hi: `आप जुड़ गए! 🎉 ${start} ऑनलाइन रिट्रीट में आपका स्वागत है।` }),
    whatsapp: { en: 'Join the WhatsApp group', hi: 'WhatsApp ग्रुप से जुड़िए' },
    zoom: { en: 'Your Zoom link', hi: 'आपका Zoom लिंक' },
    calendar: { en: 'Add all 7 classes to my calendar', hi: 'सभी 7 क्लास मेरे कैलेंडर में जोड़ें' },
    pending: { en: 'Your joining details will reach you on WhatsApp within 2 hours', hi: 'जुड़ने की जानकारी 2 घंटे के भीतर WhatsApp पर आप तक पहुँच जाएगी' },
    tipsHeading: { en: 'Before class 1', hi: 'पहली क्लास से पहले' },
    tips: [
      { en: 'A quiet place', hi: 'एक शांत जगह' },
      { en: 'Headphones', hi: 'हेडफ़ोन' },
      { en: 'Write in one line what you want to feel on day 21.', hi: 'एक लाइन में लिखिए कि दिन 21 पर आप क्या महसूस करना चाहते हैं।' },
    ] as Bi[],
  },
  /** Batch card on other pages (hub, stress page, overthinking course). */
  card: {
    lead: { en: 'Prefer learning in a group?', hi: 'ग्रुप में सीखना पसंद है?' },
    name: { en: '21-Day Online Retreat', hi: '21 दिन का ऑनलाइन रिट्रीट' },
    detail: (start: string): Bi => ({ en: `Daily live meditation + 7 live classes · ₹3,999 early-bird · Starts ${start}`, hi: `रोज़ लाइव मेडिटेशन + 7 लाइव क्लास · ₹3,999 अर्ली-बर्ड · ${start} से` }),
    button: { en: 'See the retreat', hi: 'रिट्रीट देखिए' },
  },
  /** Homepage line under "How Personal Sessions work". */
  homeLine: { en: 'Or join the group: 21-Day Online Retreat — ₹3,999 early-bird →', hi: 'या ग्रुप में जुड़िए: 21 दिन का ऑनलाइन रिट्रीट — ₹3,999 अर्ली-बर्ड →' },
  /** Overthinking Test result screen. */
  testOptions: {
    batch: { en: 'Join the 21-Day Online Retreat — ₹3,999 early-bird', hi: '21 दिन के ऑनलाइन रिट्रीट से जुड़ें — ₹3,999 अर्ली-बर्ड' },
    clarity: { en: 'Prefer 1-on-1? Book Clarity Session — ₹1,100', hi: '1-on-1 चाहिए? क्लैरिटी सेशन बुक करें — ₹1,100' },
  },
  footer: { en: '21-Day Online Retreat', hi: '21 दिन का ऑनलाइन रिट्रीट' },
} as const
