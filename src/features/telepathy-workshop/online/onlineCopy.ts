// /telepathy-workshop/online — page wording. Hindi word for word from
// copy/telepathy-online.md (with the Phase 4.3 fixes: no Gujarat/Vadodara-
// only lines, EEG instead of Muse 2); English (the default since Phase 4.3)
// word for word from PHASE-4.3 part 7. Dates, price and seats are not
// written here: they come from src/data/batches.ts (batch 'online').

type Bi = { en: string; hi: string }

export const onlineCopy = {
  meta: {
    title: { hi: 'घर से टेलीपैथी — 3 शाम ऑनलाइन, 17–19 नवंबर | ₹3,999', en: 'Telepathy from home — 3 evenings online, 17–19 November | ₹3,999' },
    description: {
      hi: '3 शाम, लाइव, ज़ूम पर, जोड़ी में अभ्यास। हार्ट-ब्रेन कोहेरेंस, इनट्यूशन, टेलीपैथी। 40 सीट, रिकॉर्डिंग नहीं।',
      en: '3 live evenings on Zoom, practice in pairs. Heart-brain coherence, intuition, telepathy. 40 seats, no recording.',
    },
  },
  h1: { hi: 'घर से टेलीपैथी — 3 शाम, लाइव ऑनलाइन', en: 'Telepathy from home — 3 evenings, live online' },
  sub: {
    hi: 'कहीं जाना नहीं। 3 शाम, 2.5-2.5 घंटे, ज़ूम पर लाइव, डॉ. कपिल के साथ। जोड़ी में करके — सुनकर नहीं।',
    en: 'No travel. 3 evenings, 2.5 hours each, live on Zoom with Dr. Kapil. You learn by doing it in pairs — not by just listening.',
  },
  // Batch block: "{date} · {time} · {venue}" / "{price} · {seats} {seatsSuffix} · {noRecording}".
  // Date and venue from src/data/batches.ts; the Hindi time is the batch's timeHi.
  batchTimeEn: '7:30–10:00 pm IST',
  seatsSuffix: { hi: 'सीट', en: 'seats' },
  noRecording: { hi: 'रिकॉर्डिंग नहीं', en: 'No recording' },
  bookButton: { hi: 'सीट पक्की कीजिए — ₹3,999', en: 'Book your seat — ₹3,999' },
  evenings: {
    heading: { hi: 'तीन शाम में क्या', en: 'What happens in 3 evenings' },
    items: [
      { label: { hi: 'शाम 1 —', en: 'Evening 1 —' }, text: { hi: 'हार्ट-ब्रेन कोहेरेंस। दिल और दिमाग़ एक ताल पर। अंदर की आवाज़ पहचानने का पहला अभ्यास।', en: 'Heart-brain coherence. Heart and mind in one rhythm. Your first practice in recognising your inner voice.' } },
      { label: { hi: 'शाम 2 —', en: 'Evening 2 —' }, text: { hi: 'टेलीपैथी। विधि, फिर जोड़ी में अभ्यास, तीन चक्र।', en: 'Telepathy. The method, then practice in pairs — three rounds.' } },
      { label: { hi: 'शाम 3 —', en: 'Evening 3 —' }, text: { hi: 'अपना अभ्यास पक्का कीजिए। घर पर 10 मिनट का रोज़ का प्लान। सवाल-जवाब।', en: 'Make your practice stick. A 10-minute daily plan for home. Q&A.' } },
    ],
  },
  included: {
    heading: { hi: 'क्या मिलेगा', en: 'What you get' },
    items: [
      { hi: 'तीनों शाम लाइव, डॉ. कपिल के साथ', en: 'All three evenings live with Dr. Kapil' },
      { hi: 'जोड़ी में टेलीपैथी अभ्यास, ब्रेकआउट रूम में', en: 'Telepathy practice in pairs, in breakout rooms' },
      { hi: 'घर पर रोज़ 10 मिनट का लिखित अभ्यास', en: 'A written 10-minute daily practice for home' },
      { hi: '30 दिन वॉट्सऐप सपोर्ट', en: '30 days of WhatsApp support' },
      { hi: 'सर्टिफिकेट', en: 'Certificate' },
    ],
  },
  difference: {
    heading: { hi: 'साफ बात — ऑफलाइन से क्या फर्क है', en: 'Straight talk — how it differs from offline' },
    body: {
      hi: 'ऑफलाइन 2 दिन, 17 घंटे का है, और उसमें EEG का लाइव डेमो और कॉस्मिक फ्यूजन भी है। यह 3 शाम, 7.5 घंटे — इसीलिए सस्ता है, और कॉस्मिक फ्यूजन यहाँ नहीं है।',
      en: "The offline workshop is 2 days, 17 hours, and includes the live EEG demo and Cosmic Fusion. This is 3 evenings, 7.5 hours — that's why it costs less, and Cosmic Fusion isn't part of it.",
    },
    discount: { hi: '60 दिन के अंदर ऑफलाइन बैच में आएँ तो ₹1,000 की छूट।', en: 'Join an offline batch within 60 days and get ₹1,000 off.' },
  },
  forWho: {
    heading: { hi: 'किसके लिए', en: "Who it's for" },
    items: [
      { hi: 'मुंबई, अहमदाबाद या वडोदरा नहीं आ सकते', en: "You can't travel to Mumbai, Ahmedabad or Vadodara" },
      { hi: 'पहले परखना चाहते हैं कि यह आपका काम है या नहीं', en: 'You want to try it before the full workshop' },
      { hi: 'रात 7:30 के बाद ही खाली होते हैं', en: "You're only free after 7:30 pm" },
    ],
  },
  notFor: {
    heading: { hi: 'किसके लिए नहीं', en: "Who it's not for" },
    body: {
      hi: 'पूरा अनुभव, स्क्रीन पर सबूत और हाथ से करके सीखना चाहते हैं — तो कोई ऑफलाइन बैच चुनिए।',
      en: 'If you want the full experience, the on-screen proof and hands-on learning — choose an offline batch.',
    },
  },
  faq: {
    heading: { hi: 'FAQ', en: 'FAQ' },
    items: [
      {
        q: { hi: 'ऑनलाइन में भी टेलीपैथी सीखी जा सकती है?', en: 'Can telepathy really be learned online?' },
        a: {
          hi: 'हाँ, विधि वही है और अभ्यास जोड़ी में होता है। फर्क सिर्फ इतना है कि मैं आपके सामने नहीं हूँ और EEG डेमो नहीं होगा।',
          en: "Yes. The method is the same and the practice happens in pairs. The only difference: I'm not in the room with you, and there's no EEG demo.",
        },
      },
      { q: { hi: 'कैमरा चालू रखना है?', en: 'Do I need my camera on?' }, a: { hi: 'हाँ, अभ्यास के लिए ज़रूरी है। पीछे बैठ सकते हैं, पर आपको दिखना पड़ेगा।', en: "Yes, it's needed for the practice. You can sit back, but you need to be visible." } },
      {
        q: { hi: 'रिकॉर्डिंग मिलेगी?', en: 'Will there be a recording?' },
        a: { hi: 'नहीं। तीनों शाम लाइव ही हैं। मिस हुए तो अगली बैच में वही शाम दोबारा कर सकते हैं।', en: 'No. All three evenings are live only. If you miss one, you can repeat that evening in the next batch.' },
      },
      { q: { hi: 'इंटरनेट कमज़ोर है?', en: 'My internet is weak?' }, a: { hi: 'ऑडियो चालू रखिए, वीडियो बंद — अभ्यास फिर भी हो जाएगा।', en: 'Keep audio on and video off — you can still practise.' } },
    ],
  },
  finalCta: {
    // "{start}" = first evening from src/data/batches.ts ("17 नवंबर" / "17 November").
    heading: { hi: '{start} से शुरू', en: 'Starts {start}' },
    // "{seats}" / "{price}" from src/data/batches.ts.
    body: { hi: '{seats} सीट। {price}। रिकॉर्डिंग नहीं — आना पड़ेगा।', en: '{seats} seats. {price}. No recording — you need to be there.' },
    button: { hi: 'सीट पक्की कीजिए', en: 'Book your seat' },
  },
} satisfies Record<string, unknown>

export const say = (text: Bi, lang: 'hi' | 'en'): string => text[lang]
