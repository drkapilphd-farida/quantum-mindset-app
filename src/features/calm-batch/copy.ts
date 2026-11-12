import type { Bi } from '@/features/programs/types'

// /calm-mind-batch — 21-Day Calm Mind live online batch (owner's brief, Nov
// 2026). English word for word from the brief; Hindi in simple spoken Hindi,
// pending the owner's approval. {startDate} etc. are filled in from
// site.config.ts (calmMindBatch). Content rules: no cure/treat/heal/
// guarantee/100%/इलाज — skills, practice and habits only.

export const CALM_PRICE_LABEL = '₹2,999'

export const CALM_COPY = {
  meta: {
    title: { en: '21-Day Calm Mind — Live Online Batch with Dr. Kapil Dev Sharma', hi: '21 दिन का शांत मन — डॉ. कपिल देव शर्मा के साथ लाइव ऑनलाइन बैच' },
    description: {
      en: '6 live Zoom classes, daily 10-minute guided practice and WhatsApp support. Learn to calm your mind, sleep better and stop overthinking in 21 days. ₹2,999.',
      hi: '6 लाइव Zoom क्लास, रोज़ 10 मिनट का गाइडेड अभ्यास और WhatsApp सपोर्ट। 21 दिन में मन शांत करना, बेहतर नींद और ओवरथिंकिंग रोकना सीखिए। ₹2,999।',
    },
  },
  disclaimer: {
    en: 'This is a coaching and meditation program, not a substitute for medical or psychological treatment. If you are in crisis, please contact a doctor or Tele-MANAS 14416.',
    hi: 'यह coaching और meditation program है, चिकित्सा या मनोवैज्ञानिक उपचार का विकल्प नहीं। संकट में हों तो डॉक्टर या Tele-MANAS 14416 से संपर्क करें।',
  },
  hero: {
    pill: { en: 'LIVE ONLINE BATCH · 25 SEATS', hi: 'लाइव ऑनलाइन बैच · 25 सीटें' },
    h1: { en: 'Build a calm mind in 21 days — live, with Dr. Kapil', hi: '21 दिन में शांत मन की आदत — डॉ. कपिल के साथ, लाइव' },
    sub: {
      en: '6 live Zoom classes, a 10-minute guided practice every day, and a private WhatsApp group. Learn simple techniques you can use anywhere — and keep them for life.',
      hi: '6 लाइव Zoom क्लास, हर दिन 10 मिनट का गाइडेड अभ्यास, और एक प्राइवेट WhatsApp ग्रुप। आसान तकनीकें सीखिए जो कहीं भी काम आएँ — और ज़िंदगी भर आपके साथ रहें।',
    },
    batchLine: (start: string, days: string, time: string): Bi => ({ en: `Next batch starts ${start} · ${days} · ${time}`, hi: `अगला बैच ${start} से शुरू · ${days} · ${time}` }),
    reserve: { en: 'Reserve my seat — ₹2,999', hi: 'मेरी सीट पक्की करें — ₹2,999' },
    ask: { en: 'Have a question? Ask on WhatsApp', hi: 'कोई सवाल? WhatsApp पर पूछिए' },
    seatsLeft: (n: number): Bi => ({ en: `Only ${n} seats left in this batch`, hi: `इस बैच में सिर्फ़ ${n} सीटें बाकी` }),
  },
  askMessage: 'Hi Dr. Kapil, I want to know more about the 21-Day Calm Mind batch.',
  waitlistMessage: 'Hi Dr. Kapil, please add me to the waitlist for the next 21-Day Calm Mind batch.',
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
      en: 'This is a pattern your mind has learned — and the mind can learn a calmer one. That is exactly what these 21 days train.',
      hi: 'यह एक पैटर्न है जो मन ने सीख लिया है — और मन एक शांत पैटर्न भी सीख सकता है। ये 21 दिन ठीक यही सिखाते हैं।',
    },
  },
  get: {
    heading: { en: 'What you get', hi: 'आपको क्या मिलता है' },
    cards: [
      { title: { en: '6 live Zoom classes with Dr. Kapil', hi: 'डॉ. कपिल के साथ 6 लाइव Zoom क्लास' }, line: { en: 'Twice a week, 60 minutes: understanding, guided practice and your questions answered.', hi: 'हफ़्ते में दो बार, 60 मिनट: समझ, गाइडेड अभ्यास और आपके सवालों के जवाब।' } },
      { title: { en: 'A 10-minute guided practice for every day', hi: 'हर दिन के लिए 10 मिनट का गाइडेड अभ्यास' }, line: { en: '21 recordings, one for each day, yours to keep forever.', hi: '21 रिकॉर्डिंग, हर दिन के लिए एक, हमेशा के लिए आपकी।' } },
      { title: { en: 'Private WhatsApp group', hi: 'प्राइवेट WhatsApp ग्रुप' }, line: { en: 'Daily practice reminder, and weekly answers from Dr. Kapil.', hi: 'रोज़ अभ्यास की याद, और हर हफ़्ते डॉ. कपिल के जवाब।' } },
      { title: { en: 'Calm Mind Toolkit (PDF)', hi: 'Calm Mind Toolkit (PDF)' }, line: { en: '3 quick techniques for anxious moments, a bedtime routine and an overthinking stopper, on one page.', hi: 'घबराहट के पलों के लिए 3 तुरंत काम आने वाली तकनीकें, सोने से पहले का रूटीन और ओवरथिंकिंग रोकने का तरीका — एक पेज पर।' } },
      { title: { en: 'Progress tracker', hi: 'प्रोग्रेस ट्रैकर' }, line: { en: 'Rate your restlessness, sleep and focus on day 1, 11 and 21, and see your own change.', hi: 'दिन 1, 11 और 21 पर अपनी बेचैनी, नींद और फ़ोकस को नंबर दीजिए, और अपना बदलाव ख़ुद देखिए।' } },
      { title: { en: 'Class recordings', hi: 'क्लास की रिकॉर्डिंग' }, line: { en: 'Missed a class? The recording reaches you within 48 hours.', hi: 'कोई क्लास छूट गई? उसकी रिकॉर्डिंग 48 घंटे के भीतर आप तक पहुँच जाती है।' } },
    ] as { title: Bi; line: Bi }[],
  },
  journey: {
    heading: { en: 'Your 21-day journey', hi: 'आपका 21 दिन का सफ़र' },
    steps: [
      { title: { en: "The mind's alarm", hi: 'मन का अलार्म' }, line: { en: 'Why stress builds up, and 2 breathing techniques that settle you in minutes.', hi: 'तनाव क्यों बढ़ता है, और साँस की 2 तकनीकें जो कुछ ही मिनट में आपको शांत कर दें।' } },
      { title: { en: 'Calm through the body', hi: 'शरीर से शांति' }, line: { en: 'Releasing physical tension; a bedtime routine for deeper sleep.', hi: 'शरीर का तनाव छोड़ना; गहरी नींद के लिए सोने से पहले का रूटीन।' } },
      { title: { en: 'The thought loop', hi: 'विचारों का चक्कर' }, line: { en: 'How overthinking runs, and how to step out of it mid-way.', hi: 'ओवरथिंकिंग कैसे चलती है, और बीच में ही उससे बाहर कैसे निकलें।' } },
      { title: { en: 'Making friends with emotions', hi: 'भावनाओं से दोस्ती' }, line: { en: 'Handling fear and anger without suppressing them.', hi: 'डर और ग़ुस्से को दबाए बिना सँभालना।' } },
      { title: { en: 'A new habit in the subconscious', hi: 'सबकॉन्शियस में नई आदत' }, line: { en: 'Guided visualization to make calm your default.', hi: 'गाइडेड विज़ुअलाइज़ेशन, ताकि शांति आपकी आदत बन जाए।' } },
      { title: { en: 'Your path ahead', hi: 'आगे का रास्ता' }, line: { en: 'Build your own 10-minute daily routine; day-21 progress check.', hi: 'अपना 10 मिनट का रोज़ का रूटीन बनाइए; दिन 21 पर प्रोग्रेस की जाँच।' } },
    ] as { title: Bi; line: Bi }[],
  },
  outcomes: {
    heading: { en: 'By day 21, you will have', hi: 'दिन 21 तक आपके पास होगा' },
    items: [
      { en: '3 techniques to calm yourself in an anxious moment', hi: 'घबराहट के पल में ख़ुद को शांत करने की 3 तकनीकें' },
      { en: 'A bedtime routine that slows the mind down', hi: 'सोने से पहले का एक रूटीन जो मन को धीमा करे' },
      { en: 'A clear way to spot and stop overthinking', hi: 'ओवरथिंकिंग को पहचानने और रोकने का साफ़ तरीका' },
      { en: '21 guided recordings, yours forever', hi: '21 गाइडेड रिकॉर्डिंग, हमेशा के लिए आपकी' },
      { en: 'Your own 10-minute daily practice', hi: 'आपका अपना 10 मिनट का रोज़ का अभ्यास' },
    ] as Bi[],
  },
  classRuns: {
    heading: { en: 'How every live class runs', hi: 'हर लाइव क्लास कैसे चलती है' },
    segments: [
      { minutes: 20, label: { en: 'understanding', hi: 'समझ' } },
      { minutes: 25, label: { en: 'guided practice', hi: 'गाइडेड अभ्यास' } },
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
    title: { en: '21-Day Calm Mind — Live Batch', hi: '21 दिन का शांत मन — लाइव बैच' },
    sub: { en: 'one-time · all inclusive', hi: 'एक बार · सब कुछ शामिल' },
    seats: { en: 'Seats: 25 per batch', hi: 'सीटें: हर बैच में 25' },
    seatsLeftShort: (n: number): Bi => ({ en: `Only ${n} left`, hi: `सिर्फ़ ${n} बाकी` }),
    included: [
      { en: '6 live classes', hi: '6 लाइव क्लास' },
      { en: '21 daily recordings', hi: '21 रोज़ की रिकॉर्डिंग' },
      { en: 'WhatsApp group', hi: 'WhatsApp ग्रुप' },
      { en: 'Toolkit PDF', hi: 'Toolkit PDF' },
      { en: 'Progress tracker', hi: 'प्रोग्रेस ट्रैकर' },
      { en: 'Class recordings', hi: 'क्लास रिकॉर्डिंग' },
    ] as Bi[],
    upgrade: {
      en: 'Want deeper 1-on-1 work later? Your ₹2,999 is adjusted in any 1-on-1 plan taken within 14 days of the batch ending.',
      hi: 'बाद में गहराई से 1-on-1 काम करना चाहें? बैच ख़त्म होने के 14 दिन के भीतर कोई भी 1-on-1 प्लान लेने पर आपके ₹2,999 एडजस्ट हो जाते हैं।',
    },
  },
  compare: {
    heading: { en: 'Group batch or 1-on-1?', hi: 'ग्रुप बैच या 1-on-1?' },
    batch: { en: 'Live Batch', hi: 'लाइव बैच' },
    oneOnOne: { en: '1-on-1', hi: '1-on-1' },
    rows: [
      { label: { en: 'Best for', hi: 'किसके लिए सही' }, batch: { en: 'Learning the core techniques with a group', hi: 'ग्रुप के साथ मुख्य तकनीकें सीखना' }, one: { en: 'Deep personal work on your own pattern', hi: 'अपने पैटर्न पर गहरा निजी काम' } },
      { label: { en: 'Format', hi: 'तरीका' }, batch: { en: '6 live group classes + daily recordings', hi: '6 लाइव ग्रुप क्लास + रोज़ की रिकॉर्डिंग' }, one: { en: 'Private sessions, plan from 2 days to 6 months', hi: 'निजी सेशन, 2 दिन से 6 महीने तक का प्लान' } },
      { label: { en: 'Start', hi: 'शुरुआत' }, batch: { en: '₹2,999', hi: '₹2,999' }, one: { en: 'Clarity Session ₹1,100', hi: 'क्लैरिटी सेशन ₹1,100' } },
    ] as { label: Bi; batch: Bi; one: Bi }[],
    batchButton: { en: 'Reserve my seat', hi: 'मेरी सीट पक्की करें' },
    oneButton: { en: 'Book Clarity Session', hi: 'क्लैरिटी सेशन बुक करें' },
  },
  faq: {
    heading: { en: 'Questions', hi: 'सवाल' },
    missed: { q: { en: 'What if I miss a live class?', hi: 'अगर कोई लाइव क्लास छूट जाए तो?' }, a: { en: 'The recording reaches you within 48 hours, and the daily practice continues on WhatsApp.', hi: 'रिकॉर्डिंग 48 घंटे के भीतर आप तक पहुँच जाती है, और रोज़ का अभ्यास WhatsApp पर चलता रहता है।' } },
    camera: { q: { en: 'Do I need to switch on my camera or speak?', hi: 'क्या कैमरा ऑन करना या बोलना ज़रूरी है?' }, a: { en: 'No. Camera and mic are optional. You can just listen and practise.', hi: 'नहीं। कैमरा और माइक ज़रूरी नहीं। आप सिर्फ़ सुनकर अभ्यास कर सकते हैं।' } },
    language: { q: { en: 'What language is it in?', hi: 'क्लास किस भाषा में है?' }, a: { en: 'Simple Hindi and English, mixed naturally.', hi: 'आसान हिंदी और अंग्रेज़ी, स्वाभाविक रूप से मिली-जुली।' } },
    medication: { q: { en: 'I take medication. Can I join?', hi: 'मैं दवा लेता/लेती हूँ। क्या मैं जुड़ सकता/सकती हूँ?' }, a: { en: "Yes. These are breathing, relaxation and meditation practices; continue your doctor's advice as it is.", hi: 'हाँ। ये साँस, रिलैक्सेशन और मेडिटेशन के अभ्यास हैं; अपने डॉक्टर की सलाह वैसे ही जारी रखिए।' } },
    time: { q: { en: 'How much time does it need daily?', hi: 'रोज़ कितना समय लगेगा?' }, a: { en: '10 minutes on non-class days; 60 minutes on class days.', hi: 'जिस दिन क्लास नहीं, उस दिन 10 मिनट; क्लास वाले दिन 60 मिनट।' } },
    links: { q: { en: 'How do I get the Zoom link and WhatsApp group?', hi: 'Zoom लिंक और WhatsApp ग्रुप कैसे मिलेगा?' }, a: { en: 'Immediately after payment on the confirmation page, and by email.', hi: 'पेमेंट के तुरंत बाद कन्फ़र्मेशन पेज पर, और ईमेल से।' } },
    after: {
      q: { en: 'What happens after 21 days?', hi: '21 दिन के बाद क्या होता है?' },
      a: { en: 'You keep all recordings and your routine. If you want deeper 1-on-1 work, you can continue with a plan.', hi: 'सारी रिकॉर्डिंग और आपका रूटीन आपके पास रहते हैं। गहराई से 1-on-1 काम करना चाहें, तो किसी प्लान के साथ आगे बढ़ सकते हैं।' },
      adjust: { en: ' (₹2,999 adjusted within 14 days)', hi: ' (14 दिन के भीतर ₹2,999 एडजस्ट)' },
    },
    refund: { q: { en: 'Refund?', hi: 'रिफ़ंड?' } },
  },
  finalCta: {
    heading: (start: string): Bi => ({ en: `Your calmer mind starts on ${start}.`, hi: `आपका शांत मन ${start} से शुरू होता है।` }),
  },
  sticky: { en: '₹2,999 · Reserve my seat', hi: '₹2,999 · मेरी सीट पक्की करें' },
  checkout: {
    title: { en: 'Your details', hi: 'आपकी जानकारी' },
    name: { en: 'Name', hi: 'नाम' },
    email: { en: 'Email', hi: 'ईमेल' },
    phone: { en: 'WhatsApp number', hi: 'WhatsApp नंबर' },
    pay: { en: 'Continue to payment — ₹2,999', hi: 'पेमेंट पर आगे बढ़ें — ₹2,999' },
    paying: { en: 'Opening payment…', hi: 'पेमेंट खुल रहा है…' },
    phoneError: { en: 'Please enter a valid 10-digit Indian mobile number.', hi: 'कृपया सही 10 अंकों का भारतीय मोबाइल नंबर लिखें।' },
    error: { en: 'The payment could not be opened. Please try again, or message us on WhatsApp.', hi: 'पेमेंट नहीं खुल सका। कृपया फिर से कोशिश करें, या WhatsApp पर मैसेज करें।' },
    close: { en: 'Close', hi: 'बंद करें' },
  },
  joined: {
    title: (start: string): Bi => ({ en: `You're in! 🎉 Welcome to the ${start} batch.`, hi: `आप जुड़ गए! 🎉 ${start} बैच में आपका स्वागत है।` }),
    whatsapp: { en: 'Join the WhatsApp group', hi: 'WhatsApp ग्रुप से जुड़िए' },
    zoom: { en: 'Your Zoom link', hi: 'आपका Zoom लिंक' },
    calendar: { en: 'Add all 6 classes to my calendar', hi: 'सभी 6 क्लास मेरे कैलेंडर में जोड़ें' },
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
    name: { en: '21-Day Calm Mind — Live Batch', hi: '21 दिन का शांत मन — लाइव बैच' },
    detail: (start: string): Bi => ({ en: `6 live classes with Dr. Kapil · ₹2,999 · Next batch ${start}`, hi: `डॉ. कपिल के साथ 6 लाइव क्लास · ₹2,999 · अगला बैच ${start}` }),
    button: { en: 'See the batch', hi: 'बैच देखिए' },
  },
  /** Homepage line under "How Personal Sessions work". */
  homeLine: { en: 'Or learn in a group: 21-Day Calm Mind Live Batch — ₹2,999 →', hi: 'या ग्रुप में सीखिए: 21 दिन का शांत मन लाइव बैच — ₹2,999 →' },
  /** Overthinking Test result screen. */
  testOptions: {
    batch: { en: 'Start with the Live Batch — ₹2,999', hi: 'लाइव बैच से शुरू करें — ₹2,999' },
    clarity: { en: 'Prefer 1-on-1? Book Clarity Session — ₹1,100', hi: '1-on-1 चाहिए? क्लैरिटी सेशन बुक करें — ₹1,100' },
  },
  footer: { en: '21-Day Calm Mind Batch', hi: '21 दिन का शांत मन बैच' },
} as const
