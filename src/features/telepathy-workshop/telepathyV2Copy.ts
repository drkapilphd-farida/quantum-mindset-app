// Phase 4.2 (conversion rework) — the new /telepathy-workshop wording,
// word for word from copy/telepathy-v2.md: Hindi (main) and English
// (?lang=en). Dates, prices and seats are not written here: they come from
// src/data/batches.ts and fill the {placeholders}. No venue anywhere —
// venue and timing are sent on WhatsApp after booking.

export const v2 = {
  meta: {
    title: { hi: 'टेलीपैथी वर्कशॉप — 2 दिन, लाइव | डॉ. कपिल देव शर्मा', en: 'Telepathy Workshop — 2 days, live | Dr. Kapil Dev Sharma' },
    description: {
      hi: 'टेलीपैथी, कॉस्मिक फ्यूजन, हार्ट-ब्रेन कोहेरेंस, इनट्यूशन — 2 दिन का लाइव वर्कशॉप। 2017 से, 300+ वीडियो रिव्यू। ₹1,000 में सीट बुक।',
      en: 'Telepathy, Cosmic Fusion, heart-brain coherence, intuition — a 2-day live workshop. Since 2017, 300+ video reviews. Book with ₹1,000.',
    },
  },

  // 1. Hero
  hero: {
    strip: { hi: '2017 से · हज़ारों लोग · 300+ वीडियो रिव्यू · EEG पर लाइव सबूत', en: 'Since 2017 · Thousands of people · 300+ video reviews · Live proof on EEG' },
    h1: { hi: 'जो दिल में है, वो बिना कहे पहुँचे — टेलीपैथी सीखिए, 2 दिन में', en: "Let what's in your heart reach them without words — learn telepathy in 2 days" },
    sub: {
      hi: 'टेलीपैथी, कॉस्मिक फ्यूजन, हार्ट-ब्रेन कोहेरेंस और इनट्यूशन — 2 दिन का लाइव वर्कशॉप, डॉ. कपिल देव शर्मा के साथ। सिर्फ सुनना नहीं — जोड़ी में असली अभ्यास। और दिमाग़ में जो बदलता है, वो EEG पर स्क्रीन पर दिखता है।',
      en: 'Telepathy, Cosmic Fusion, heart-brain coherence and intuition — a 2-day live workshop with Dr. Kapil Dev Sharma. Not just listening — real practice in pairs. And what changes in your brain shows up live on an EEG screen.',
    },
    ctaPrimary: { hi: 'अपनी तारीख चुनिए', en: 'Pick your date' },
    ctaSecondary: { hi: 'पहले बात करनी है? डॉ. कपिल से वॉट्सऐप पर', en: 'Want to talk first? WhatsApp Dr. Kapil' },
    smallLine: { hi: '₹1,000 में सीट बुक · बाकी वर्कशॉप के दिन · घर से ऑनलाइन भी', en: 'Book with ₹1,000 · Pay the rest on the day · Online from home too' },
  },

  // 2. Date cards (also on the homepage)
  dates: {
    heading: { hi: 'अगली बैच — अपनी तारीख चुनिए', en: 'Next batches — pick your date' },
    sub: {
      hi: '₹1,000 में सीट बुक, बाकी ₹4,999 वर्कशॉप के दिन। जगह और समय बुकिंग के बाद वॉट्सऐप पर।',
      en: 'Book your seat with ₹1,000, pay ₹4,999 on the day. Venue and timing are sent on WhatsApp after booking.',
    },
    nearest: { hi: 'सबसे नज़दीक', en: 'Nearest' },
    // {n} = days until the first day (IST). 1 and 0 have their own words.
    daysLeft: { hi: '{n} दिन बाकी', en: '{n} days left' },
    tomorrow: { hi: 'कल से', en: 'From tomorrow' },
    today: { hi: 'आज से', en: 'From today' },
    offline: {
      book: { hi: '₹1,000 में सीट बुक', en: 'Book with ₹1,000' },
      rest: { hi: 'बाकी ₹4,999 वर्कशॉप के दिन', en: '₹4,999 on the day' },
      button: { hi: 'सीट बुक कीजिए — ₹1,000', en: 'Book seat — ₹1,000' },
    },
    online: {
      chip: { hi: 'घर से · ज़ूम पर', en: 'From home · on Zoom' },
      evenings: { hi: '3 शाम', en: '3 evenings' },
      where: { hi: 'ऑनलाइन · रात 7:30–10', en: 'Online · 7:30–10 pm' },
      // {price} · {seats} सीट
      price: { hi: '{price} · {seats} सीट', en: '{price} · {seats} seats' },
      button: { hi: 'ऑनलाइन सीट बुक — ₹3,999', en: 'Book online seat — ₹3,999' },
      more: { hi: 'क्या-क्या होगा →', en: "What's included →" },
    },
    moveLine: { hi: 'तारीख नहीं जमी? ₹1,000 अगली बैच में चला जाता है।', en: "Date doesn't suit you? Your ₹1,000 moves to the next batch." },
    askLink: { hi: 'डॉ. कपिल से वॉट्सऐप पर पूछिए →', en: 'Ask Dr. Kapil on WhatsApp →' },
    pune: { hi: 'पुणे: अगली तारीख जल्दी — वॉट्सऐप पर पूछिए', en: 'Pune: next date soon — ask on WhatsApp' },
    finalHeading: { hi: 'आपकी अटकी चीज़ यहीं से खुलती है — अपनी तारीख चुनिए', en: 'This is where it starts to move — pick your date' },
    cities: {
      mumbai: { hi: 'मुंबई', en: 'Mumbai' },
      ahmedabad: { hi: 'अहमदाबाद', en: 'Ahmedabad' },
      vadodara: { hi: 'वडोदरा', en: 'Vadodara' },
      pune: { hi: 'पुणे', en: 'Pune' },
      online: { hi: 'ऑनलाइन', en: 'Online' },
    },
    // Mobile sticky bar: {city} {date}
    sticky: { hi: 'अगली बैच: {city} {date} · ₹1,000 में सीट', en: 'Next batch: {city} {date} · Book with ₹1,000' },
    stickyButton: { hi: 'बुक', en: 'Book' },
  },

  // 3. What brings you here (6 cards) — Phase 4.3: the trading card first.
  why: {
    heading: { hi: 'आप किस वजह से आए हैं?', en: 'What brings you here?' },
    sub: {
      hi: 'लोग वर्कशॉप के लिए नहीं आते — अपनी किसी अटकी चीज़ के लिए आते हैं। देखिए, आपकी कौन-सी है।',
      en: "People don't come for a workshop — they come for something that's stuck. See which one is yours.",
    },
    inWorkshop: { hi: 'वर्कशॉप में', en: 'In the workshop' },
    cards: [
      {
        title: { hi: 'ट्रेडिंग में डर और लालच', en: 'Fear and greed in trading' },
        pain: { hi: 'डर में जल्दी निकल जाते हैं, लालच में ज़्यादा रुक जाते हैं। चार्ट नहीं, दिमाग़ गड़बड़ा रहा है।', en: "Fear exits early, greed stays too long. It isn't the chart — it's the mind." },
        practice: { hi: 'डर और लालच को हाथ लगाने से पहले पहचानना, और अपनी एनालिसिस को अंदर की आवाज़ से मिलाना।', en: 'Spot fear and greed before they act, and match your analysis with your inner voice.' },
        tag: { hi: 'इनट्यूशन · कोहेरेंस', en: 'Intuition · Coherence' },
        link: { hi: 'ट्रेडर्स के लिए पूरा हिस्सा ↓', en: 'Full section for traders ↓' },
      },
      {
        title: { hi: 'रिश्तों में दूरी', en: 'Distance in relationships' },
        pain: { hi: 'जो कहना है, कह नहीं पाते — और जो कहते हैं, पहुँचता नहीं। घर में चुप्पी है।', en: "You can't say what you mean — and what you say doesn't land. There's silence at home." },
        practice: { hi: 'अपनी भावना और बात बिना शब्दों के सामने वाले तक भेजने का अभ्यास — जोड़ी में, असली।', en: 'Practise sending your feelings and message without words — in pairs, for real.' },
        tag: { hi: 'टेलीपैथी', en: 'Telepathy' },
      },
      {
        title: { hi: 'डर और चिंता', en: 'Fear and worry' },
        pain: { hi: 'पीछे-पीछे एक डर चलता रहता है। दिमाग़ बंद ही नहीं होता।', en: 'A fear keeps running in the background. The mind never switches off.' },
        practice: {
          hi: 'दिल और दिमाग़ को एक ताल में लाने का अभ्यास — बेचैनी उतरती है, और आप EEG पर देखते हैं कि दिमाग़ कैसे शांत होता है।',
          en: 'Bring heart and mind into one rhythm — the restlessness settles, and you watch your brain calm down on an EEG.',
        },
        tag: { hi: 'हार्ट-ब्रेन कोहेरेंस', en: 'Heart-brain coherence' },
      },
      {
        title: { hi: 'फैसलों में उलझन', en: 'Stuck decisions' },
        pain: { hi: 'करियर, व्यापार, रिश्ता — दो रास्तों के बीच अटके हैं, और गलत मोड़ बार-बार आता है।', en: 'Career, business, a relationship — stuck between two roads, and the wrong turn keeps repeating.' },
        practice: { hi: 'अंदर की आवाज़ पहचानना, उसे डर की आवाज़ से अलग करना, और उस पर भरोसा करना।', en: 'Learn to recognise your inner voice, tell it apart from fear, and trust it.' },
        tag: { hi: 'इनट्यूशन', en: 'Intuition' },
      },
      {
        title: { hi: 'ऊर्जा कम, मन और शरीर थका हुआ', en: 'Low energy, a tired mind and body' },
        pain: { hi: 'सब कुछ है, फिर भी अंदर से खाली और थका हुआ महसूस होता है।', en: 'You have everything, yet feel empty and drained inside.' },
        practice: { hi: 'अपने प्राण को ब्रह्मांड की ऊर्जा से जोड़ने का अभ्यास — ऊँची, शुद्ध ऊर्जा ग्रहण करना, हीलिंग के लिए।', en: 'Practise connecting your prana to universal energy — receiving high, pure energy for healing.' },
        tag: { hi: 'कॉस्मिक फ्यूजन', en: 'Cosmic Fusion' },
      },
      {
        title: { hi: 'चाहतें अधूरी रह जाती हैं', en: 'Wishes that stay unfulfilled' },
        pain: { hi: 'जो चाहते हैं, वो पास आते-आते रुक जाता है।', en: 'What you want keeps stopping just short of you.' },
        practice: { hi: 'ऊँची ऊर्जा की अवस्था में अपना इरादा साफ़ और स्थिर रखना — मैनिफ़ेस्टेशन का अभ्यास।', en: 'Hold a clear, steady intention in a high-energy state — the practice of manifestation.' },
        tag: { hi: 'कॉस्मिक फ्यूजन', en: 'Cosmic Fusion' },
      },
    ],
  },

  // 4. The 4 things you learn
  learn: {
    heading: { hi: '2 दिन में आप ये 4 चीज़ें सीखते हैं', en: 'In 2 days, you learn these 4 things' },
    cards: [
      {
        title: { hi: 'टेलीपैथी — मन से मन तक', en: 'Telepathy — mind to mind' },
        body: {
          hi: 'अपनी बात, अपनी भावना — किसी तक भी, कहीं भी भेजने की विधि। वर्कशॉप में जोड़ी में असली अभ्यास होता है: भेजना, ग्रहण करना, और फिर मिलान करना।',
          en: 'Mind-to-mind communication — a method to send your message and emotions to anyone, anywhere. In the workshop you practise for real, in pairs: send, receive, then check.',
        },
      },
      {
        title: { hi: 'कॉस्मिक फ्यूजन — प्राण से ब्रह्मांड तक', en: 'Cosmic Fusion — from prana to the universe' },
        body: {
          hi: 'अपने प्राण को सार्वभौमिक ऊर्जा से जोड़िए और ऊँची, शुद्ध ऊर्जा ग्रहण कीजिए। मैनिफ़ेस्टेशन और हीलिंग के लिए यह सबसे असरदार अभ्यास है।',
          en: 'Connect your prana to universal energy and receive high-vibration, pure energy. The most powerful practice for manifestation and healing.',
        },
        tag: { hi: 'सिर्फ ऑफलाइन वर्कशॉप में', en: 'Offline workshop only' },
      },
      {
        title: { hi: 'हार्ट-ब्रेन कोहेरेंस — दिल और दिमाग़ एक ताल में', en: 'Heart-brain coherence — heart and mind in one rhythm' },
        body: {
          hi: 'जब दिल और दिमाग़ एक लय में आते हैं, डर उतरता है, मन शांत होता है और फैसले साफ़ होते हैं। यह बदलाव EEG पर स्क्रीन पर दिखता है।',
          en: 'When heart and mind come into one rhythm, fear drops, the mind settles and decisions clear. You see this change live on an EEG screen.',
        },
      },
      {
        title: { hi: 'इनट्यूशन — अंदर की आवाज़', en: 'Intuition — the inner voice' },
        body: {
          hi: 'अंदर की आवाज़ को पहचानना, उसे डर और आदत की आवाज़ से अलग करना, और सही समय पर उस पर भरोसा करना।',
          en: 'Recognise your inner voice, tell it apart from fear and habit, and trust it at the right moment.',
        },
      },
    ],
  },

  // 5. Proof (also on the homepage)
  proof: {
    heading: { hi: 'इन्होंने करके देखा — कैमरे पर बताया', en: 'They did it — and said so on camera' },
    sub: {
      hi: '2017 से हज़ारों लोग यह वर्कशॉप कर चुके हैं। 300+ ने कैमरे पर अपना अनुभव बताया — कोई स्क्रिप्ट नहीं।',
      en: 'Thousands have done this workshop since 2017. 300+ shared their experience on camera — no script.',
    },
    link: { hi: 'सब 300+ वीडियो देखिए →', en: 'Watch all 300+ videos →' },
  },

  // 9. Offline or online
  compare: {
    heading: { hi: 'ऑफलाइन या ऑनलाइन — आपके लिए कौन-सा?', en: 'Offline or online — which one is for you?' },
    columns: { hi: ['ऑफलाइन — 2 दिन', 'ऑनलाइन — 3 शाम'], en: ['Offline — 2 days', 'Online — 3 evenings'] },
    rows: [
      { label: { hi: 'समय', en: 'Duration' }, offline: { hi: '17 घंटे', en: '17 hours' }, online: { hi: '7.5 घंटे', en: '7.5 hours' } },
      { label: { hi: 'टेलीपैथी अभ्यास', en: 'Telepathy practice' }, offline: { hi: 'आमने-सामने, जोड़ी में', en: 'face to face, in pairs' }, online: { hi: 'ब्रेकआउट रूम में, जोड़ी में', en: 'in breakout rooms, in pairs' } },
      { label: { hi: 'हार्ट-ब्रेन कोहेरेंस, इनट्यूशन', en: 'Heart-brain coherence, intuition' }, offline: { hi: '✓', en: '✓' }, online: { hi: '✓', en: '✓' } },
      { label: { hi: 'कॉस्मिक फ्यूजन', en: 'Cosmic Fusion' }, offline: { hi: '✓', en: '✓' }, online: { hi: '—', en: '—' } },
      { label: { hi: 'EEG लाइव डेमो', en: 'Live EEG demo' }, offline: { hi: '✓', en: '✓' }, online: { hi: '—', en: '—' } },
      { label: { hi: 'कीमत', en: 'Fee' }, offline: { hi: '₹5,999 (₹1,000 में सीट)', en: '₹5,999 (book with ₹1,000)' }, online: { hi: '₹3,999', en: '₹3,999' } },
    ],
    note: {
      hi: 'पूरा अनुभव चाहिए तो ऑफलाइन। शहर तक नहीं आ सकते तो ऑनलाइन — 60 दिन में ऑफलाइन आएँ तो ₹1,000 की छूट।',
      en: "Want the full experience? Go offline. Can't travel? Go online — join an offline batch within 60 days and get ₹1,000 off.",
    },
  },

  // 10. Dr. Kapil
  drKapil: {
    line: { hi: 'जिस गुरु को आप ढूँढ रहे हैं, वो आपके अंदर ही है।', en: 'The Guru you are searching for is already inside you.' },
    body: {
      hi: '15 साल अंग्रेज़ी कम्युनिकेशन पढ़ाया। 2016 में पूरा एक साल हिमालय में — गोमुख से आगे, एक संत से क्रिया योग सीखा। लौटकर 2017 में यह वर्कशॉप शुरू किया, और जो सिखाता हूँ उसे EEG पर नापना भी।',
      en: 'Fifteen years teaching English communication. In 2016, a full year in the Himalayas — beyond Gaumukh, learning Kriya Yoga from a saint. Back in 2017, I started this workshop — and began measuring what I teach on an EEG.',
    },
    story: { hi: 'पूरी कहानी →', en: 'Full story →' },
    name: { hi: 'डॉ. कपिल देव शर्मा', en: 'Dr. Kapil Dev Sharma' },
  },

  // 11. FAQ — these 7 go on top; the existing ones follow.
  faq: [
    {
      q: { hi: 'टेलीपैथी सच में होती है?', en: 'Is telepathy real?' },
      a: {
        hi: 'हम विधि सिखाते हैं, और वर्कशॉप में जोड़ी में अभ्यास होता है। 2017 से हज़ारों लोग यह कर चुके हैं, 300+ ने कैमरे पर अनुभव बताया। आपको क्या महसूस होगा — इसका वादा नहीं करते।',
        en: "We teach the method, and you practise it in pairs in the workshop. Thousands have done it since 2017; 300+ shared their experience on camera. We don't promise what you will feel.",
      },
    },
    { q: { hi: 'क्या यह धार्मिक है?', en: 'Is this religious?' }, a: { hi: 'नहीं। किसी धर्म या मान्यता की ज़रूरत नहीं।', en: 'No. No religion or belief is needed.' } },
    {
      q: { hi: 'हीलिंग से क्या मतलब है?', en: 'What do you mean by healing?' },
      a: { hi: 'कॉस्मिक फ्यूजन ऊर्जा का अभ्यास है। यह डॉक्टर के इलाज की जगह नहीं — उसके साथ किया जाने वाला अभ्यास है।', en: 'Cosmic Fusion is an energy practice. It does not replace medical treatment — it is practised alongside it.' },
    },
    {
      q: { hi: '₹1,000 का क्या होता है?', en: 'What happens to the ₹1,000?' },
      a: {
        hi: 'सीट पक्की होती है। बाकी ₹4,999 वर्कशॉप के दिन (UPI या नकद)। ₹1,000 वापस नहीं मिलते, पर अगली बैच में चले जाते हैं।',
        en: "It confirms your seat. The remaining ₹4,999 is paid on the day (UPI or cash). It isn't refunded, but it moves to the next batch.",
      },
    },
    { q: { hi: 'जगह कहाँ है?', en: 'Where is the venue?' }, a: { hi: 'बुकिंग के बाद जगह, समय और पहुँचने का तरीका वॉट्सऐप पर भेजा जाता है।', en: 'After booking, the venue, timing and directions are sent to you on WhatsApp.' } },
    {
      q: { hi: 'ऑनलाइन उपलब्ध है?', en: 'Is it available online?' },
      a: { hi: 'हाँ, 3 शाम का ऑनलाइन संस्करण ₹3,999 में। EEG का लाइव डेमो और कॉस्मिक फ्यूजन सिर्फ ऑफलाइन में है।', en: 'Yes — a 3-evening online version for ₹3,999. The live EEG demo and Cosmic Fusion happen only offline.' },
    },
  ],
  // FAQ 7 = the existing "How do I book?" — new English answer only (copy/telepathy-v2.md).
  faqHowToBookEn: "Tap 'Book seat — ₹1,000' and pay on Razorpay. You'll get a WhatsApp confirmation with venue and timing; the rest is paid on the day.",
} as const
