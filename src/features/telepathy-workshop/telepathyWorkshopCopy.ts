// The Telepathy Workshop™ — ALL page wording, English and Hindi side by
// side. Edit text here only; components read it through `pick()`.
//
// Placeholders filled in automatically:
//   {price} → current fee   {earlier} → earlier fee (struck through)   — from site.config.ts (TELEPATHY_WORKSHOP_FEE)
//   {phone} → WhatsApp number (telepathyWorkshopConfig.ts)
// Honest-language rule: participants' experiences ("many participants
// share…"), never promised results.

export type Bi = { en: string; hi: string }

export const telepathyCopy = {
  meta: {
    title: {
      en: 'Telepathy & Intuition Workshop — 2-Day Offline with Dr. Kapil Dev Sharma | Mind Ur Mind',
      hi: 'Telepathy और Intuition वर्कशॉप — डॉ. कपिल देव शर्मा के साथ 2 दिन (ऑफ़लाइन) | Mind Ur Mind',
    },
    description: {
      en: 'Learn Heart-Brain Coherence, Intuition, Telepathy and Cosmic Fusion in a 2-day offline workshop researched, developed and taught by Dr. Kapil Dev Sharma — to 10,000+ people over 12 years. {price} (earlier {earlier}). Mumbai, Ahmedabad, Vadodara. Limited seats.',
      hi: '2 दिन की ऑफ़लाइन वर्कशॉप में Heart-Brain Coherence, Intuition, Telepathy और Cosmic Fusion सीखिए — डॉ. कपिल देव शर्मा की रिसर्च से बनी, 12 साल में 10,000+ लोगों को सिखाई गई। फ़ीस {price} (पहले {earlier})। मुंबई, अहमदाबाद, वडोदरा। सीमित seats।',
    },
  },

  // Header button, sticky phone button and floating button.
  bookButton: { en: 'Book on WhatsApp — {price}', hi: 'WhatsApp पर बुक करें — {price}' },

  // ── A. Hero ───────────────────────────────────────────────────────
  hero: {
    eyebrow: { en: '2-DAY OFFLINE EXPERIENTIAL WORKSHOP · MUMBAI · AHMEDABAD · VADODARA', hi: '2 दिन की ऑफ़लाइन अनुभव-आधारित वर्कशॉप · मुंबई · अहमदाबाद · वडोदरा' },
    workshopName: { en: 'The Telepathy Workshop™', hi: 'The Telepathy Workshop™' },
    headline: { en: 'The Guru You Are Searching For Is Already Inside You', hi: 'जिस गुरु को आप बाहर खोज रहे हैं, वह आपके भीतर ही है' },
    subheadline: {
      en: 'Learn Heart-Brain Coherence, Intuition, Telepathy and Cosmic Fusion in a 2-day workshop researched, developed and taught by Dr. Kapil Dev Sharma — to 10,000+ people over 12 years.',
      hi: '2 दिन की वर्कशॉप में Heart-Brain Coherence, Intuition, Telepathy और Cosmic Fusion सीखिए — जिसे डॉ. कपिल देव शर्मा ने खुद रिसर्च करके बनाया है और 12 साल में 10,000+ लोगों को सिखाया है।',
    },
    seats: { en: 'Limited seats per batch', hi: 'हर batch में सीमित seats' },
    watchCta: { en: '▶ Watch the free session', hi: '▶ Free session देखें' },
    imageAlt: { en: 'Participants at The Telepathy Workshop', hi: 'The Telepathy Workshop में प्रतिभागी' },
  },

  // ── B. Trust strip ────────────────────────────────────────────────
  trust: [
    { value: '12', label: { en: 'years of workshops', hi: 'साल से वर्कशॉप' } },
    { value: '10,000+', label: { en: 'people trained', hi: 'लोग प्रशिक्षित' } },
    { value: '200+', label: { en: 'video reviews', hi: 'वीडियो रिव्यू' } },
    { value: '3', label: { en: 'cities', hi: 'शहर' } },
  ],

  // ── C. Free session video ─────────────────────────────────────────
  freeSession: {
    heading: { en: 'Watch a free session before you book', hi: 'Book करने से पहले यह free session देखें' },
    sub: { en: 'A recorded session of the free Telepathy workshop — see how Dr. Kapil teaches.', hi: 'Free Telepathy workshop का recorded session — देखिए Dr. Kapil कैसे सिखाते हैं।' },
    playLabel: { en: 'Play the free session', hi: 'Free session चलाएँ' },
  },

  // ── D. Who it's for ───────────────────────────────────────────────
  whoFor: {
    heading: { en: 'Who is this workshop for?', hi: 'यह वर्कशॉप किसके लिए है?' },
    changeLabel: { en: 'What can change', hi: 'क्या बदल सकता है' },
    cards: [
      {
        title: { en: 'Relationships with distance or silence', hi: 'रिश्तों में दूरी या चुप्पी' },
        pain: { en: 'A parent who stopped listening, a partner who has gone silent, a child who has moved away emotionally.', hi: 'माता-पिता जिन्होंने सुनना बंद कर दिया, जीवनसाथी जो चुप हो गया, बच्चा जो भावनात्मक रूप से दूर चला गया।' },
        change: { en: 'Learn to send your feelings, love and intention through the mind. Many participants share that their relationships softened after practising it.', hi: 'मन के ज़रिए अपनी भावनाएँ, प्रेम और इरादा भेजना सीखिए। कई प्रतिभागी बताते हैं कि अभ्यास के बाद उनके रिश्तों में नरमी आई।' },
      },
      {
        title: { en: 'Fear, anxiety and overthinking', hi: 'डर, बेचैनी और ज़्यादा सोचना' },
        pain: { en: 'The mind is never at peace, and a constant fear sits in the background of everything.', hi: 'मन कभी शांत नहीं रहता, और हर चीज़ के पीछे एक डर बैठा रहता है।' },
        change: { en: 'Heart-Brain Coherence brings heart and mind into one rhythm. Participants often describe feeling calmer and steadier.', hi: 'Heart-Brain Coherence दिल और दिमाग को एक लय में लाता है। प्रतिभागी अक्सर बताते हैं कि वे ज़्यादा शांत और स्थिर महसूस करते हैं।' },
      },
      {
        title: { en: 'Confused decisions', hi: 'उलझे हुए फ़ैसले' },
        pain: { en: 'Stuck between choices in career, business or life — and the wrong turn keeps repeating.', hi: 'करियर, बिज़नेस या ज़िंदगी में विकल्पों के बीच अटके हुए — और बार-बार गलत मोड़।' },
        change: { en: 'Practise recognising your inner voice and checking it calmly, so decisions come from clarity instead of fear.', hi: 'अपनी अंदर की आवाज़ को पहचानने और शांत मन से परखने का अभ्यास, ताकि फ़ैसले डर से नहीं, स्पष्टता से हों।' },
      },
      {
        title: { en: 'Traders and investors', hi: 'ट्रेडर्स और निवेशक' },
        pain: { en: 'Fear makes you exit early. Greed makes you stay too long.', hi: 'डर में आप जल्दी exit करते हैं। लालच में ज़रूरत से ज़्यादा देर रुकते हैं।' },
        change: { en: 'Learn to recognise fear and greed before they act for you. (More below.)', hi: 'डर और लालच को उनके हावी होने से पहले पहचानना सीखिए। (नीचे और जानकारी।)' },
      },
      {
        title: { en: 'Seekers', hi: 'साधक' },
        pain: { en: 'You want to connect with your inner voice, but it is drowned out by noise and overthinking.', hi: 'आप अपनी अंदर की आवाज़ से जुड़ना चाहते हैं, पर वो शोर और ज़्यादा सोचने में दब जाती है।' },
        change: { en: 'Simple, experiential practices to hear that inner Guru again — and to trust it.', hi: 'सरल, अनुभव-आधारित अभ्यास, जिनसे भीतर के गुरु को फिर से सुन सकें — और उस पर भरोसा कर सकें।' },
      },
    ],
  },

  // Traders (kept from the earlier page, with its disclaimer).
  traders: {
    heading: { en: "For Traders: Your Chart Doesn't Take the Trade. Your Mind Does.", hi: 'ट्रेडर्स: ट्रेड चार्ट नहीं लेता, आपका दिमाग लेता है।' },
    body: {
      en: 'Most trading mistakes come from fear and greed, not from lack of knowledge. Fear makes you exit early. Greed makes you stay too long.',
      hi: 'ज़्यादातर ट्रेडिंग गलतियाँ जानकारी की कमी से नहीं, डर और लालच से होती हैं। डर में आप जल्दी exit करते हैं। लालच में ज़रूरत से ज़्यादा देर रुकते हैं।',
    },
    listIntro: { en: 'In this workshop you learn to:', hi: 'इस वर्कशॉप में आप सीखते हैं:' },
    items: [
      { en: 'Stay calm when the market moves against you', hi: 'मार्केट उल्टा चले, तब भी शांत रहना' },
      { en: 'Recognise fear and greed before they act for you', hi: 'डर और लालच को उनके हावी होने से पहले पहचानना' },
      { en: 'Combine your analysis with your intuition', hi: 'अपने analysis और intuition को साथ में इस्तेमाल करना' },
      { en: 'Pause before an impulsive trade', hi: 'impulsive ट्रेड से पहले रुककर सोचना' },
    ],
    note: {
      en: 'This workshop does not give trading tips or investment advice. It works on the mind that makes the decision.',
      hi: 'यह वर्कशॉप ट्रेडिंग टिप्स या निवेश सलाह नहीं देती। यह उस दिमाग पर काम करती है जो फ़ैसला लेता है।',
    },
    imageAlt: { en: 'A trader looking at market charts', hi: 'मार्केट चार्ट देखता एक ट्रेडर' },
  },

  // ── E. What you'll learn ──────────────────────────────────────────
  learn: {
    heading: { en: "What you'll learn in 2 days", hi: '2 दिन में आप क्या सीखेंगे' },
    whatLabel: { en: 'What it is', hi: 'यह क्या है' },
    practiseLabel: { en: 'What you practise', hi: 'आप क्या अभ्यास करते हैं' },
    helpsLabel: { en: 'What participants say it helps with', hi: 'प्रतिभागियों के अनुसार इससे किसमें मदद मिली' },
    // icon: telepathy | intuition | cosmic | coherence (drawn in SkillIcons.tsx)
    modules: [
      {
        icon: 'coherence',
        name: { en: 'Heart-Brain Coherence', hi: 'Heart-Brain Coherence' },
        what: { en: 'Bringing your heart and mind into one rhythm — the foundation for everything else in the workshop.', hi: 'दिल और दिमाग को एक लय में लाना — वर्कशॉप की बाकी हर चीज़ की नींव।' },
        practise: { en: 'Guided practice that calms fear and creates inner stillness — seen live on the Muse 2 headband.', hi: 'गाइडेड अभ्यास जो डर को शांत करके भीतरी स्थिरता लाता है — Muse 2 हेडबैंड पर लाइव दिखता है।' },
        helps: { en: 'Feeling calm, overcoming fear, clearer decisions.', hi: 'शांति, डर से बाहर आना, ज़्यादा साफ़ फ़ैसले।' },
      },
      {
        icon: 'intuition',
        name: { en: 'Intuition Development', hi: 'Intuition Development' },
        what: { en: 'The inner voice that knows the right path before the mind has worked it out. Many traditions call it the voice of God.', hi: 'वो अंदर की आवाज़ जो दिमाग के सोचने से पहले ही सही रास्ता जानती है। कई परंपराएँ इसे ईश्वर की आवाज़ कहती हैं।' },
        practise: { en: 'Practical exercises, like the Good/Bad card experiment, to recognise your inner voice and act on it with confidence.', hi: 'Good/Bad कार्ड जैसे practical प्रयोग, जिनसे आप अपनी अंदर की आवाज़ पहचानें और भरोसे के साथ उस पर चलें।' },
        helps: { en: 'Hearing their inner voice — and trusting it.', hi: 'अपनी अंदर की आवाज़ सुनना — और उस पर भरोसा करना।' },
      },
      {
        icon: 'telepathy',
        name: { en: 'Telepathy', hi: 'Telepathy' },
        what: { en: 'Sending your feelings, love and intention to another person through the mind.', hi: 'मन के ज़रिए अपनी भावनाएँ, प्रेम और इरादा किसी दूसरे तक पहुँचाना।' },
        practise: { en: 'The method and exercises to share your feelings at a deeper level — and to keep practising at home.', hi: 'भावनाओं को गहरे स्तर पर साझा करने की विधि और अभ्यास — जिन्हें आप घर पर जारी रख सकते हैं।' },
        helps: { en: 'Healing relationships with people they cannot speak to openly.', hi: 'उन लोगों के साथ रिश्ते सुधारना जिनसे खुलकर बात नहीं हो पाती।' },
      },
      {
        icon: 'cosmic',
        name: { en: 'Cosmic Fusion', hi: 'Cosmic Fusion' },
        what: { en: 'Connecting your breath and prana (life force) with a larger, universal energy.', hi: 'अपनी साँस और प्राण को एक बड़ी, ब्रह्मांडीय ऊर्जा से जोड़ना।' },
        practise: { en: 'Breath and prana practices you can repeat every day.', hi: 'साँस और प्राण के अभ्यास, जिन्हें आप रोज़ दोहरा सकते हैं।' },
        helps: { en: 'Calm, and a daily practice for their health and wellbeing.', hi: 'शांति, और सेहत व सुकून के लिए एक रोज़ का अभ्यास।' },
      },
    ],
  },

  // Muse 2 (dark section, part of "What you'll learn")
  muse: {
    eyebrow: { en: 'LIVE Muse 2 brain-wave demo', hi: 'LIVE Muse 2 brain-wave डेमो' },
    heading: { en: "Don't Just Feel the Change. See It on Screen.", hi: 'बदलाव सिर्फ़ महसूस नहीं, स्क्रीन पर देखिए भी।' },
    body: {
      en: 'See on screen how your brain activity changes when you are distracted, focused or calm. During the workshop, a Muse 2 EEG headband measures brain waves live.',
      hi: 'स्क्रीन पर देखिए कि जब आप बेचैन, एकाग्र या शांत होते हैं, तो दिमाग की गतिविधि कैसे बदलती है। वर्कशॉप में Muse 2 EEG हेडबैंड brain waves को लाइव मापता है।',
    },
    waveRestless: { en: 'restless', hi: 'बेचैन' },
    waveCalm: { en: 'calm', hi: 'शांत' },
    tagline: { en: 'Your mind, live on screen.', hi: 'आपका दिमाग, लाइव स्क्रीन पर।' },
    imageAlt: { en: 'A participant wearing the Muse 2 EEG headband, with brain waves on screen', hi: 'Muse 2 EEG हेडबैंड पहने प्रतिभागी, स्क्रीन पर brain waves' },
  },

  // ── F. Short review strip (middle of the page) ────────────────────
  shortStrip: {
    heading: { en: 'In their own words', hi: 'उन्हीं के शब्दों में' },
    more: { en: 'More reviews ↓', hi: 'और रिव्यू ↓' },
  },

  // ── G. 2-day schedule ─────────────────────────────────────────────
  schedule: {
    heading: { en: 'Your 2 days', hi: 'आपके 2 दिन' },
    time: { en: '9:30 am – 6:00 pm, both days', hi: 'सुबह 9:30 – शाम 6:00, दोनों दिन' },
    days: [
      {
        label: { en: 'Day 1', hi: 'पहला दिन' },
        title: { en: 'Foundation', hi: 'नींव' },
        items: [
          { en: 'Foundation: how the mind, emotions and the inner voice work', hi: 'नींव: मन, भावनाएँ और अंदर की आवाज़ कैसे काम करते हैं' },
          { en: 'Heart-Brain Coherence', hi: 'Heart-Brain Coherence' },
          { en: 'Intuition Development', hi: 'Intuition Development' },
          { en: 'Live Muse 2 brain-wave demo', hi: 'Muse 2 brain-wave का लाइव डेमो' },
        ],
      },
      {
        label: { en: 'Day 2', hi: 'दूसरा दिन' },
        title: { en: 'Connection', hi: 'जुड़ाव' },
        items: [
          { en: 'Telepathy practice', hi: 'Telepathy का अभ्यास' },
          { en: 'Cosmic Fusion', hi: 'Cosmic Fusion' },
          { en: 'Integration and your daily practice plan', hi: 'सब कुछ जोड़ना, और आपका रोज़ का अभ्यास-प्लान' },
        ],
      },
    ],
  },

  // ── H. Full video reviews ─────────────────────────────────────────
  reviews: {
    heading: { en: 'Hear it from them, in their own words', hi: 'उन्हीं से सुनिए, उन्हीं के शब्दों में' },
    sub: { en: '200+ participants have shared their experience on camera.', hi: '200+ प्रतिभागियों ने कैमरे पर अपना अनुभव साझा किया है।' },
    shortsLabel: { en: 'Short reviews', hi: 'छोटे रिव्यू' },
    channel: { en: 'Watch 200+ more reviews on YouTube →', hi: 'YouTube पर 200+ और रिव्यू देखें →' },
    playLabel: { en: 'Play video review', hi: 'वीडियो रिव्यू चलाएँ' },
  },

  // ── I. Workshop photos ────────────────────────────────────────────
  gallery: {
    heading: { en: 'Moments From 12 Years of Workshops', hi: '12 साल की वर्कशॉप की झलकियाँ' },
    imageAlt: { en: 'A moment from The Telepathy Workshop', hi: 'The Telepathy Workshop का एक पल' },
    cities: {
      mumbai: { en: 'Mumbai', hi: 'मुंबई' },
      ahmedabad: { en: 'Ahmedabad', hi: 'अहमदाबाद' },
      vadodara: { en: 'Vadodara', hi: 'वडोदरा' },
      lonavala: { en: 'Lonavala', hi: 'लोनावला' },
      pune: { en: 'Pune', hi: 'पुणे' },
      rishikesh: { en: 'Rishikesh', hi: 'ऋषिकेश' },
    },
    // Screen-reader labels for the photo viewer.
    open: { en: 'Open photo {n} of {total}', hi: 'फ़ोटो {n} / {total} खोलें' },
    close: { en: 'Close', hi: 'बंद करें' },
    previous: { en: 'Previous photo', hi: 'पिछली फ़ोटो' },
    next: { en: 'Next photo', hi: 'अगली फ़ोटो' },
    viewer: { en: 'Workshop photos', hi: 'वर्कशॉप की फ़ोटो' },
  },

  // ── J. About ──────────────────────────────────────────────────────
  about: {
    heading: { en: 'Researched, Developed and Taught by Dr. Kapil Dev Sharma', hi: 'डॉ. कपिल देव शर्मा द्वारा रिसर्च, विकसित और सिखाई गई वर्कशॉप' },
    body: [
      {
        en: 'Dr. Kapil Dev Sharma is the founder of Mind Ur Mind and a brain, mind and meditation coach with over two decades of experience.',
        hi: 'डॉ. कपिल देव शर्मा Mind Ur Mind के संस्थापक हैं, और दो दशक से ज़्यादा अनुभव वाले मन, दिमाग और ध्यान के कोच हैं।',
      },
      {
        en: 'He researched and developed this workshop himself and has been teaching it for 12 years. In that time, more than 10,000 people have learned Telepathy, Intuition and Cosmic Fusion from him, making him one of the pioneers of teaching these skills in India.',
        hi: 'यह वर्कशॉप उन्होंने खुद रिसर्च करके विकसित की है और पिछले 12 साल से सिखा रहे हैं। इस दौरान 10,000 से ज़्यादा लोग उनसे Telepathy, Intuition और Cosmic Fusion सीख चुके हैं, और वो भारत में इन skills को सिखाने वाले अग्रणी लोगों में से एक हैं।',
      },
    ],
    imageAlt: { en: 'Dr. Kapil Dev Sharma teaching a workshop', hi: 'वर्कशॉप में सिखाते हुए डॉ. कपिल देव शर्मा' },
  },

  // ── K. Batches ────────────────────────────────────────────────────
  batches: {
    heading: { en: 'Choose your batch', hi: 'अपना batch चुनिए' },
    sub: { en: 'Same timings and inclusions in every city.', hi: 'हर शहर में समय और सुविधाएँ एक जैसी।' },
    datesLabel: { en: 'Dates', hi: 'तारीख़' },
    venueLabel: { en: 'Venue', hi: 'स्थान' },
    button: { en: 'Book this batch', hi: 'यह batch बुक करें' },
    // id must match TELEPATHY_BATCHES in telepathyWorkshopConfig.ts (dates there hide a batch after it ends).
    cities: [
      {
        id: 'mumbai',
        city: { en: 'Mumbai', hi: 'मुंबई' },
        dates: { en: '14–15 Nov 2026 (Sat–Sun)', hi: '14–15 नवंबर 2026 (शनि–रवि)' },
        venue: { en: 'Hotel Better Home International, Sahar Road, opp. Andheri East Railway Station, Andheri East', hi: 'होटल बेटर होम इंटरनेशनल, सहार रोड, अंधेरी ईस्ट रेलवे स्टेशन के सामने, अंधेरी ईस्ट' },
      },
      {
        id: 'ahmedabad',
        city: { en: 'Ahmedabad', hi: 'अहमदाबाद' },
        dates: { en: '21–22 Nov 2026 (Sat–Sun)', hi: '21–22 नवंबर 2026 (शनि–रवि)' },
        venue: { en: 'Hotel Silver Cloud, Ashram Road', hi: 'होटल सिल्वर क्लाउड, आश्रम रोड' },
      },
      {
        id: 'vadodara',
        city: { en: 'Vadodara', hi: 'वडोदरा' },
        dates: { en: 'Date on WhatsApp', hi: 'तारीख़ WhatsApp पर' },
        venue: { en: 'Venue on WhatsApp', hi: 'स्थान WhatsApp पर' },
      },
    ],
    infoTime: { en: '9:30 am – 6:00 pm (both days)', hi: 'सुबह 9:30 – शाम 6:00 (दोनों दिन)' },
    infoMeals: { en: 'Breakfast, lunch & high tea included', hi: 'नाश्ता, लंच और हाई टी शामिल' },
    calendarLink: { en: 'Add to Google Calendar', hi: 'Google Calendar में जोड़ें' },
    // Google Calendar event title (the workshop name stays in English).
    calendarTitle: { en: 'The Telepathy Workshop™ — {city}', hi: 'The Telepathy Workshop™ — {city}' },
    countdownLabel: { en: 'Next batch begins in', hi: 'अगला batch शुरू होने में' },
    countdownUnits: {
      days: { en: 'Days', hi: 'दिन' },
      hours: { en: 'Hours', hi: 'घंटे' },
      minutes: { en: 'Minutes', hi: 'मिनट' },
      seconds: { en: 'Seconds', hi: 'सेकंड' },
    },
  },

  // ── L. What's included ────────────────────────────────────────────
  included: {
    heading: { en: "What's included", hi: 'इसमें क्या शामिल है' },
    items: [
      { en: '2 full days of live training with Dr. Kapil', hi: 'Dr. Kapil के साथ 2 पूरे दिन की लाइव ट्रेनिंग' },
      { en: 'Live Muse 2 brain-wave demo', hi: 'Muse 2 brain-wave का लाइव डेमो' },
      { en: 'Practice techniques to continue at home', hi: 'घर पर जारी रखने के लिए अभ्यास की तकनीकें' },
      { en: 'Certificate of participation', hi: 'भागीदारी का सर्टिफ़िकेट' },
      { en: 'Breakfast, lunch & high tea', hi: 'नाश्ता, लंच और हाई टी' },
      { en: 'WhatsApp support after the workshop', hi: 'वर्कशॉप के बाद WhatsApp पर सपोर्ट' },
    ],
  },

  // ── M. FAQ ────────────────────────────────────────────────────────
  faq: {
    heading: { en: 'Frequently asked questions', hi: 'अक्सर पूछे जाने वाले सवाल' },
    items: [
      {
        q: { en: 'Is this religious?', hi: 'क्या यह धार्मिक है?' },
        a: { en: 'No. These are experiential practices, and people of all backgrounds and faiths attend.', hi: 'नहीं। ये अनुभव-आधारित अभ्यास हैं, और हर पृष्ठभूमि और धर्म के लोग इसमें आते हैं।' },
      },
      {
        q: { en: 'Is this scientific?', hi: 'क्या यह वैज्ञानिक है?' },
        a: {
          en: 'Heart-brain coherence and brain-wave measurement (the Muse 2 demo) are explained in the workshop. Telepathy and Cosmic Fusion are experiential practices. What participants describe are their own experiences — results are not guaranteed.',
          hi: 'Heart-brain coherence और brain-wave measurement (Muse 2 डेमो) वर्कशॉप में समझाए जाते हैं। Telepathy और Cosmic Fusion अनुभव-आधारित अभ्यास हैं। प्रतिभागी जो बताते हैं, वो उनके अपने अनुभव हैं — परिणाम की गारंटी नहीं है।',
        },
      },
      {
        q: { en: 'Who should not attend?', hi: 'किसे नहीं आना चाहिए?' },
        a: { en: 'If you are in an acute mental-health crisis, please consult a professional first.', hi: 'अगर आप किसी गंभीर मानसिक-स्वास्थ्य संकट से गुज़र रहे हैं, तो पहले किसी विशेषज्ञ से सलाह लें।' },
      },
      {
        q: { en: 'Do I need prior meditation experience?', hi: 'क्या ध्यान का पहले से अनुभव ज़रूरी है?' },
        a: { en: 'No. Everything is taught from the beginning.', hi: 'नहीं। सब कुछ शुरुआत से सिखाया जाता है।' },
      },
      {
        q: { en: 'Is this available online?', hi: 'क्या यह ऑनलाइन भी है?' },
        a: {
          en: 'No. It is offline only, because the practical exercises and the Muse 2 experience happen in person.',
          hi: 'नहीं। यह सिर्फ़ ऑफ़लाइन है, क्योंकि practical अभ्यास और Muse 2 का अनुभव आमने-सामने ही होता है।',
        },
      },
      {
        q: { en: 'Is this a trading course?', hi: 'क्या यह ट्रेडिंग कोर्स है?' },
        a: {
          en: 'No. It works on the mind. Traders use it to handle fear and greed, but no trading tips or investment advice are given.',
          hi: 'नहीं। यह मन पर काम करती है। ट्रेडर्स इसका उपयोग डर और लालच संभालने के लिए करते हैं, लेकिन इसमें कोई ट्रेडिंग टिप या निवेश सलाह नहीं दी जाती।',
        },
      },
      {
        q: { en: 'Can I change my batch?', hi: 'क्या batch बदला जा सकता है?' },
        a: { en: 'Message us on WhatsApp — the team will help you with your options.', hi: 'हमें WhatsApp पर मैसेज करें — टीम आपको विकल्पों के बारे में बताएगी।' },
      },
      {
        q: { en: 'What if I miss a day?', hi: 'अगर एक दिन छूट जाए तो?' },
        a: { en: 'Message us on WhatsApp — the team will help you with your options.', hi: 'हमें WhatsApp पर मैसेज करें — टीम आपको विकल्पों के बारे में बताएगी।' },
      },
      {
        q: { en: 'Are meals included?', hi: 'क्या खाना शामिल है?' },
        a: { en: 'Yes. Breakfast, lunch and high tea are included on both days.', hi: 'हाँ। दोनों दिन नाश्ता, लंच और हाई टी शामिल है।' },
      },
      {
        q: { en: 'How do I book and pay?', hi: 'बुकिंग और पेमेंट कैसे करें?' },
        a: {
          en: 'Tap "Book on WhatsApp" (or "Book this batch"). Our team will share the payment details on WhatsApp and confirm your seat. The fee is {price}.',
          hi: '"WhatsApp पर बुक करें" (या "यह batch बुक करें") दबाइए। हमारी टीम WhatsApp पर पेमेंट की जानकारी भेजकर आपकी सीट कन्फ़र्म करेगी। फ़ीस {price} है।',
        },
      },
    ],
    notTreatment: { en: 'This workshop is not medical or psychological treatment.', hi: 'यह वर्कशॉप कोई चिकित्सीय या मनोवैज्ञानिक उपचार नहीं है।' },
  },

  // ── N. Final call to action ───────────────────────────────────────
  finalCta: {
    heading: { en: 'Stop Searching Outside. Start Listening Within.', hi: 'बाहर ढूँढना बंद कीजिए। भीतर सुनना शुरू कीजिए।' },
    body: { en: 'Seats are limited in every batch.', hi: 'हर batch में सीटें सीमित हैं।' },
    portraitAlt: { en: 'Dr. Kapil Dev Sharma inviting you to the workshop', hi: 'डॉ. कपिल देव शर्मा आपको वर्कशॉप में आमंत्रित करते हुए' },
  },

  // ── Disclaimer (above the site footer) ────────────────────────────
  disclaimer: {
    en: 'Experiences and results vary from person to person. This workshop is a meditation and personal-growth programme. It is not medical or psychological treatment and does not provide financial or investment advice. Muse 2 is used for demonstration and awareness only.',
    hi: 'अनुभव और परिणाम हर व्यक्ति के लिए अलग हो सकते हैं। यह वर्कशॉप ध्यान और व्यक्तिगत विकास का कार्यक्रम है। यह कोई चिकित्सीय या मनोवैज्ञानिक उपचार नहीं है और कोई वित्तीय या निवेश सलाह नहीं देती। Muse 2 का उपयोग केवल प्रदर्शन और जागरूकता के लिए किया जाता है।',
  },
} as const
