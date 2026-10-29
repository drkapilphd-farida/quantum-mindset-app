// The Telepathy Workshop™ — ALL page wording, English and Hindi side by
// side. Edit text here only; components read it through `pick()`.
//
// Placeholders filled in automatically from src/config/telepathyWorkshopConfig.ts:
//   {price} → offer price (₹4,999)   {mrp} → struck-through price (₹6,500)   {phone} → WhatsApp number
// Lines marked "REVIEW" were not in the brief (image alt text, a button
// label for screen readers) and were written for the page; please check
// the Hindi.

export type Bi = { en: string; hi: string }

export const telepathyCopy = {
  meta: {
    title: {
      en: 'The Telepathy Workshop™ — Awaken the Guru Within | Dr. Kapil Dev Sharma',
      hi: 'जिस गुरु को आप बाहर ढूँढ रहे हैं, वो आपके भीतर ही है | The Telepathy Workshop™',
    },
    description: {
      en: 'Learn Telepathy, Intuition Development, Cosmic Fusion and Heart-Brain Coherence in a 2-day experiential workshop, designed and developed by Dr. Kapil Dev Sharma and taught to 10,000+ people over 12 years.',
      hi: '2 दिन की अनुभव आधारित वर्कशॉप में सीखिए Telepathy, Intuition Development, Cosmic Fusion और Heart-Brain Coherence। डॉ. कपिल देव शर्मा द्वारा विकसित, और 12 साल में 10,000+ लोगों को सिखाई गई।',
    },
  },

  // Small name line above the hero label (same in both languages).
  workshopName: { en: 'The Telepathy Workshop™ — Awaken the Guru Within', hi: 'The Telepathy Workshop™ — Awaken the Guru Within' },

  // ── S1: Hero ──────────────────────────────────────────────────────
  hero: {
    label: { en: '2-DAY OFFLINE WORKSHOP • MUMBAI • AHMEDABAD • VADODARA', hi: '2 दिन की ऑफ़लाइन वर्कशॉप • मुंबई • अहमदाबाद • वडोदरा' },
    headline: { en: 'The Guru You Are Searching For Is Already Inside You', hi: 'जिस गुरु को आप बाहर ढूँढ रहे हैं, वो आपके भीतर ही है' },
    subheadline: {
      en: 'Learn Telepathy, Intuition Development, Cosmic Fusion and Heart-Brain Coherence in a 2-day experiential workshop, designed and developed by Dr. Kapil Dev Sharma and taught to 10,000+ people over 12 years.',
      hi: '2 दिन की अनुभव आधारित वर्कशॉप में सीखिए Telepathy, Intuition Development, Cosmic Fusion और Heart-Brain Coherence। डॉ. कपिल देव शर्मा द्वारा विकसित, और 12 साल में 10,000+ लोगों को सिखाई गई।',
    },
    badges: [
      { en: '12 Years of Workshops', hi: '12 साल से वर्कशॉप' },
      { en: '10,000+ People Trained', hi: '10,000+ लोग प्रशिक्षित' },
      { en: '200+ Video Reviews', hi: '200+ वीडियो रिव्यू' },
    ],
    // Price line: {mrp} struck through, then offer, then seats note.
    priceOffer: { en: '{price} only', hi: 'सिर्फ़ {price}' },
    seats: { en: 'Limited seats', hi: 'सीटें सीमित' },
    primaryCta: { en: 'Book Your Seat on WhatsApp', hi: 'WhatsApp पर सीट बुक करें' },
    secondaryCta: { en: 'See Dates & Cities ↓', hi: 'तारीख़ और शहर देखें ↓' },
    imageAlt: { en: 'Participants at The Telepathy Workshop', hi: 'The Telepathy Workshop में प्रतिभागी' }, // REVIEW
  },

  stickyBar: { en: 'Book on WhatsApp — {price}', hi: 'WhatsApp पर बुक करें — {price}' },
  floatingButtonLabel: { en: 'Book Your Seat on WhatsApp', hi: 'WhatsApp पर सीट बुक करें' },

  // ── S2: The problem ───────────────────────────────────────────────
  problem: {
    heading: { en: 'When Your Inner Energy Is Low, Life Feels Like a Struggle', hi: 'जब भीतर की ऊर्जा कम होती है, तो ज़िंदगी संघर्ष लगने लगती है' },
    intro: { en: 'Do you recognise any of these?', hi: 'क्या इनमें से कुछ आपके साथ भी होता है?' },
    items: [
      { en: 'Money comes, but never stays', hi: 'पैसा आता है, पर टिकता नहीं' },
      { en: 'Relationships feel distant, misunderstood or broken', hi: 'रिश्तों में दूरी, ग़लतफ़हमी या टूटन है' },
      { en: 'Health and energy are always low', hi: 'सेहत और ऊर्जा हमेशा कम रहती है' },
      { en: 'In trading, fear and greed make your decisions for you', hi: 'ट्रेडिंग में आपके फ़ैसले डर और लालच लेते हैं' },
      { en: 'The mind is never at peace', hi: 'मन कभी शांत नहीं रहता' },
      { en: 'A constant fear sits in the background of everything', hi: 'हर चीज़ के पीछे एक डर बैठा रहता है' },
    ],
    closing: {
      en: 'In our teaching, these are not separate problems. They are signs of one root cause: a disconnection from the cosmic energy that flows through you, and from the inner voice that is meant to guide you.',
      hi: 'हमारी शिक्षा के अनुसार ये अलग-अलग समस्याएँ नहीं हैं। इन सबकी जड़ एक ही है: उस ब्रह्मांडीय ऊर्जा से कट जाना जो आपके भीतर बहती है, और उस अंदर की आवाज़ से दूर हो जाना जो आपको रास्ता दिखाने के लिए है।',
    },
    imageAlt: { en: 'A person weighed down by worry and low energy', hi: 'चिंता और कम ऊर्जा से घिरा एक व्यक्ति' }, // REVIEW
  },

  // ── S3: The guru within ───────────────────────────────────────────
  guru: {
    heading: { en: 'The Real Guru Is Not Outside. It Speaks Through Your Intuition.', hi: 'असली गुरु बाहर नहीं है। वो आपकी Intuition के रूप में बोलता है।' },
    body: [
      {
        en: 'Every person carries an inner guide, a voice that knows the right path before the mind has worked it out. Many traditions call it the voice of God. We call it Intuition.',
        hi: 'हर इंसान के भीतर एक मार्गदर्शक है, एक ऐसी आवाज़ जो दिमाग के सोचने से पहले ही सही रास्ता जानती है। कई परंपराएँ इसे ईश्वर की आवाज़ कहती हैं। हम इसे Intuition कहते हैं।',
      },
      {
        en: 'Most people never hear it clearly, because it is drowned out by fear, noise and overthinking. And when we ignore it, we keep taking the wrong turn in relationships, money and life.',
        hi: 'ज़्यादातर लोग इसे कभी साफ़ नहीं सुन पाते, क्योंकि यह डर, शोर और ज़्यादा सोचने में दब जाती है। और जब हम इसे अनसुना करते हैं, तो रिश्तों, पैसे और ज़िंदगी में बार-बार गलत मोड़ ले लेते हैं।',
      },
    ],
    highlight: {
      en: 'This workshop teaches you how to hear that inner Guru again, and how to trust it.',
      hi: 'यह वर्कशॉप सिखाती है कि भीतर के उस गुरु को फिर से कैसे सुनें, और उस पर भरोसा कैसे करें।',
    },
    imageAlt: { en: 'A person in meditation, listening within', hi: 'ध्यान में बैठा एक व्यक्ति, भीतर की आवाज़ सुनते हुए' }, // REVIEW
  },

  // ── S4: The four skills ───────────────────────────────────────────
  skills: {
    heading: { en: 'What You Will Learn in 2 Days', hi: '2 दिन में आप क्या सीखेंगे' },
    // icon: telepathy | intuition | cosmic | coherence (drawn in SkillIcons.tsx)
    cards: [
      {
        icon: 'telepathy',
        name: { en: 'Telepathy', hi: 'Telepathy' },
        title: { en: 'Heal Your Relationships', hi: 'रिश्तों को हील करें' },
        body: {
          en: 'Learn how to send your message to another person through the mind, and share your feelings at a deeper level. Use it to bring warmth back into strained relationships, with family, partner, friends, or anyone.',
          hi: 'सीखिए कि अपना संदेश मन के ज़रिए दूसरे तक कैसे पहुँचाएँ, और अपनी भावनाएँ गहरे स्तर पर कैसे साझा करें। परिवार, जीवनसाथी, दोस्त या कोई भी, बिगड़े रिश्तों में फिर से अपनापन लाने के लिए।',
        },
      },
      {
        icon: 'intuition',
        name: { en: 'Intuition Development', hi: 'Intuition Development' },
        title: { en: 'Hear the Guru Within', hi: 'भीतर के गुरु को सुनें' },
        body: {
          en: 'Practical exercises, like the Good/Bad card experiment, to recognise your inner voice and act on it with confidence. The guidance you need for the right path is already inside you.',
          hi: 'Good/Bad कार्ड जैसे practical प्रयोगों से अपनी अंदर की आवाज़ को पहचानिए और भरोसे के साथ उस पर चलिए। सही रास्ते का मार्गदर्शन आपके भीतर ही है।',
        },
      },
      {
        icon: 'cosmic',
        name: { en: 'Cosmic Fusion', hi: 'Cosmic Fusion' },
        title: { en: 'Connect to Universal Energy', hi: 'ब्रह्मांडीय ऊर्जा से जुड़ें' },
        body: {
          en: 'Connect your prana (life force) with the universal cosmic energy. Use this energy to support your wellbeing and to raise your vibrations for manifestation.',
          hi: 'अपने प्राण को ब्रह्मांडीय ऊर्जा से जोड़िए। इस ऊर्जा से अपने स्वास्थ्य और सुकून को सहारा दीजिए, और manifestation के लिए अपनी vibrations ऊँची कीजिए।',
        },
      },
      {
        icon: 'coherence',
        name: { en: 'Heart-Brain Coherence', hi: 'Heart-Brain Coherence' },
        title: { en: 'The Foundation', hi: 'सबकी नींव' },
        body: {
          en: 'Bring your heart and mind into one rhythm. This calms fear and creates the inner stillness in which telepathy, intuition and cosmic connection become possible. It also helps you make clearer, calmer decisions.',
          hi: 'दिल और दिमाग को एक लय में लाइए। इससे डर शांत होता है और वो भीतरी स्थिरता आती है जिसमें telepathy, intuition और cosmic connection संभव होते हैं। साथ ही आप ज़्यादा साफ़ और शांत फ़ैसले ले पाते हैं।',
        },
      },
    ],
  },

  // ── S5: Relationships ─────────────────────────────────────────────
  relationships: {
    heading: { en: 'Some Things Cannot Be Said in Words. They Can Be Felt.', hi: 'कुछ बातें शब्दों में नहीं कही जातीं। वो महसूस की जाती हैं।' },
    body: [
      {
        en: 'There are people we cannot speak to openly: a parent who stopped listening, a partner who has gone silent, a child who has moved away emotionally.',
        hi: 'कुछ लोगों से हम खुलकर बात नहीं कर पाते: माता-पिता जिन्होंने सुनना बंद कर दिया, जीवनसाथी जो चुप हो गया, बच्चा जो भावनात्मक रूप से दूर चला गया।',
      },
      {
        en: 'Through Telepathy, you learn to send your feelings, love and intention to them through the mind. Many participants have shared how their relationships softened and healed after practising it.',
        hi: 'Telepathy से आप अपनी भावनाएँ, प्रेम और इरादा मन के ज़रिए उन तक भेजना सीखते हैं। कई प्रतिभागियों ने बताया है कि इसका अभ्यास करने के बाद उनके रिश्तों में नरमी आई और वो हील हुए।',
      },
    ],
    imageAlt: { en: 'Two people sharing a quiet, close moment', hi: 'दो लोग एक शांत, अपनेपन भरे पल में' }, // REVIEW
  },

  // ── S6: For traders ───────────────────────────────────────────────
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
    imageAlt: { en: 'A trader looking at market charts', hi: 'मार्केट चार्ट देखता एक ट्रेडर' }, // REVIEW
  },

  // ── S7: Muse 2 ────────────────────────────────────────────────────
  muse: {
    heading: { en: "Don't Just Feel the Change. See It on Screen.", hi: 'बदलाव सिर्फ़ महसूस नहीं, स्क्रीन पर देखिए भी।' },
    body: {
      en: 'During the workshop, a Muse 2 EEG headband measures your brain waves live. You see for yourself how a restless mind looks, and how it changes after meditation and coherence practice.',
      hi: 'वर्कशॉप में Muse 2 EEG हेडबैंड से आपकी brain waves लाइव मापी जाती हैं। आप खुद देखते हैं कि बेचैन दिमाग कैसा दिखता है, और ध्यान व coherence के अभ्यास के बाद वो कैसे बदलता है।',
    },
    tagline: { en: 'Your mind, live on screen.', hi: 'आपका दिमाग, लाइव स्क्रीन पर।' },
    imageAlt: { en: 'A participant wearing the Muse 2 EEG headband, with brain waves on screen', hi: 'Muse 2 EEG हेडबैंड पहने प्रतिभागी, स्क्रीन पर brain waves' }, // REVIEW
  },

  // ── S8: About ─────────────────────────────────────────────────────
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
    // Count-up stats: `value` is the number it counts to, `suffix` follows it.
    stats: [
      { value: 12, suffix: '', label: { en: 'Years', hi: 'साल' } },
      { value: 10000, suffix: '+', label: { en: 'People Trained', hi: 'लोग प्रशिक्षित' } },
      { value: 200, suffix: '+', label: { en: 'Video Reviews', hi: 'वीडियो रिव्यू' } },
      { value: 3, suffix: '', label: { en: 'Cities', hi: 'शहर' } },
    ],
    imageAlt: { en: 'Dr. Kapil Dev Sharma', hi: 'डॉ. कपिल देव शर्मा' },
  },

  // ── S9: Video reviews (video IDs are in telepathyWorkshopConfig.ts) ──
  reviews: {
    heading: { en: 'Hear It From Them, in Their Own Words', hi: 'उन्हीं से सुनिए, उन्हीं के शब्दों में' },
    sub: { en: '200+ participants have shared their experience on camera. Here are a few.', hi: '200+ प्रतिभागियों ने कैमरे पर अपना अनुभव साझा किया है। इनमें से कुछ यहाँ हैं।' },
    button: { en: 'Watch All Reviews on YouTube', hi: 'YouTube पर सभी रिव्यू देखें' },
    playLabel: { en: 'Play video review', hi: 'वीडियो रिव्यू चलाएँ' }, // REVIEW (screen readers only)
    placeholder: { en: 'Video coming soon', hi: 'वीडियो जल्द' }, // REVIEW (shown only until real IDs are added)
  },

  // ── S10: Who is this for ──────────────────────────────────────────
  whoFor: {
    heading: { en: 'Who Is This Workshop For?', hi: 'यह वर्कशॉप किसके लिए है?' },
    items: [
      { en: 'Anyone whose relationships need healing', hi: 'जिनके रिश्तों को हीलिंग की ज़रूरत है' },
      { en: 'Those who feel stuck with money, health or peace of mind', hi: 'जो पैसे, सेहत या मन की शांति को लेकर अटके हुए महसूस करते हैं' },
      { en: 'Traders who struggle with fear and greed', hi: 'ट्रेडर्स जो डर और लालच से परेशान हैं' },
      { en: 'Seekers who want to hear and trust their inner voice', hi: 'साधक जो अपनी अंदर की आवाज़ को सुनना और उस पर भरोसा करना चाहते हैं' },
      { en: 'Anyone drawn to meditation, energy and the power of the mind', hi: 'ध्यान, ऊर्जा और मन की शक्ति में रुचि रखने वाला हर व्यक्ति' },
    ],
  },

  // ── S11: Dates & cities (countdown dates are in telepathyWorkshopConfig.ts) ──
  dates: {
    heading: { en: 'Choose Your City', hi: 'अपना शहर चुनिए' },
    sub: { en: 'Same timings and inclusions in every city.', hi: 'हर शहर में समय और सुविधाएँ एक जैसी।' },
    datesLabel: { en: 'Dates', hi: 'तारीख़' },
    venueLabel: { en: 'Venue', hi: 'स्थान' },
    // `whatsapp` picks the pre-filled message; `calendar` links to a TELEPATHY_WORKSHOP_DATES entry (null = no calendar link).
    cities: [
      {
        id: 'mumbai',
        whatsapp: 'mumbai',
        calendar: 'mumbai',
        city: { en: 'MUMBAI', hi: 'मुंबई' },
        dates: { en: '14 & 15 November 2026 (Sat–Sun)', hi: '14 और 15 नवंबर 2026 (शनि–रवि)' },
        venue: {
          en: 'Hotel Better Home International, Sahar Road, Opp. Andheri East Railway Station, Andheri East, Mumbai',
          hi: 'होटल बेटर होम इंटरनेशनल, सहार रोड, अंधेरी ईस्ट रेलवे स्टेशन के सामने, अंधेरी ईस्ट, मुंबई',
        },
        button: { en: 'Book Mumbai on WhatsApp', hi: 'मुंबई के लिए WhatsApp पर बुक करें' },
      },
      {
        id: 'ahmedabad',
        whatsapp: 'ahmedabad',
        calendar: 'ahmedabad',
        city: { en: 'AHMEDABAD', hi: 'अहमदाबाद' },
        dates: { en: '21 & 22 November 2026 (Sat–Sun)', hi: '21 और 22 नवंबर 2026 (शनि–रवि)' },
        venue: { en: 'Hotel Silver Cloud, Ashram Road, Ahmedabad', hi: 'होटल सिल्वर क्लाउड, आश्रम रोड, अहमदाबाद' },
        button: { en: 'Book Ahmedabad on WhatsApp', hi: 'अहमदाबाद के लिए WhatsApp पर बुक करें' },
      },
      {
        id: 'vadodara',
        whatsapp: 'vadodara',
        calendar: null,
        city: { en: 'VADODARA', hi: 'वडोदरा' },
        dates: { en: 'Contact on WhatsApp', hi: 'WhatsApp पर संपर्क करें' },
        venue: { en: 'Contact on WhatsApp', hi: 'WhatsApp पर संपर्क करें' },
        button: { en: 'Ask About Vadodara on WhatsApp', hi: 'वडोदरा के लिए WhatsApp पर पूछें' },
      },
    ],
    infoTime: { en: '9:30 AM – 6:00 PM (both days)', hi: 'सुबह 9:30 – शाम 6:00 (दोनों दिन)' },
    infoMeals: { en: 'Breakfast, Lunch & High Tea included', hi: 'नाश्ता, लंच और हाई टी शामिल' },
    calendarLink: { en: 'Add to Google Calendar', hi: 'Google Calendar में जोड़ें' },
    // Google Calendar event title (the workshop name stays in English).
    calendarTitle: { en: 'The Telepathy Workshop™ — {city}', hi: 'The Telepathy Workshop™ — {city}' },
    countdownLabel: { en: 'Next workshop begins in', hi: 'अगली वर्कशॉप शुरू होने में' },
    countdownUnits: {
      days: { en: 'Days', hi: 'दिन' },
      hours: { en: 'Hours', hi: 'घंटे' },
      minutes: { en: 'Minutes', hi: 'मिनट' },
      seconds: { en: 'Seconds', hi: 'सेकंड' },
    },
  },

  // ── S12: FAQ ──────────────────────────────────────────────────────
  faq: {
    heading: { en: 'FAQ', hi: 'FAQ' },
    items: [
      { q: { en: 'Do I need prior meditation experience?', hi: 'क्या ध्यान का पहले से अनुभव ज़रूरी है?' }, a: { en: 'No. Everything is taught from the beginning.', hi: 'नहीं। सब कुछ शुरुआत से सिखाया जाता है।' } },
      {
        q: { en: 'Is this available online?', hi: 'क्या यह ऑनलाइन भी है?' },
        a: {
          en: 'No. It is offline only, because the practical exercises and the Muse 2 experience happen in person.',
          hi: 'नहीं। यह सिर्फ़ ऑफ़लाइन है, क्योंकि practical अभ्यास और Muse 2 का अनुभव आमने-सामने ही होता है।',
        },
      },
      {
        q: { en: 'Is Telepathy something anyone can learn?', hi: 'क्या Telepathy कोई भी सीख सकता है?' },
        a: {
          en: 'Yes. It is a skill developed through practice. The workshop gives you the method and the exercises to keep practising at home.',
          hi: 'हाँ। यह अभ्यास से विकसित होने वाली skill है। वर्कशॉप आपको विधि और अभ्यास देती है, जिन्हें आप घर पर जारी रख सकते हैं।',
        },
      },
      {
        q: { en: 'Is this a trading course?', hi: 'क्या यह ट्रेडिंग कोर्स है?' },
        a: {
          en: 'No. It works on the mind. Traders use it to handle fear and greed, but no trading tips or investment advice are given.',
          hi: 'नहीं। यह मन पर काम करती है। ट्रेडर्स इसका उपयोग डर और लालच संभालने के लिए करते हैं, लेकिन इसमें कोई ट्रेडिंग टिप या निवेश सलाह नहीं दी जाती।',
        },
      },
      { q: { en: 'Are meals included?', hi: 'क्या खाना शामिल है?' }, a: { en: 'Yes. Breakfast, lunch and high tea are included on both days.', hi: 'हाँ। दोनों दिन नाश्ता, लंच और हाई टी शामिल है।' } },
      {
        q: { en: 'How do I book?', hi: 'बुकिंग कैसे करें?' },
        a: {
          en: 'Send "TELEPATHY" on WhatsApp. Our team will share the payment details and confirm your seat.',
          hi: 'WhatsApp पर "TELEPATHY" लिखकर भेजिए। हमारी टीम पेमेंट की जानकारी भेजकर आपकी सीट कन्फ़र्म करेगी।',
        },
      },
    ],
  },

  // ── S13: Final CTA ────────────────────────────────────────────────
  finalCta: {
    heading: { en: 'Stop Searching Outside. Start Listening Within.', hi: 'बाहर ढूँढना बंद कीजिए। भीतर सुनना शुरू कीजिए।' },
    body: { en: 'Seats are limited, and the {price} fee is only for this batch.', hi: 'सीटें सीमित हैं, और {price} की फ़ीस सिर्फ़ इस बैच के लिए है।' },
    button: { en: 'Message on WhatsApp: {phone}', hi: 'WhatsApp पर मैसेज करें: {phone}' },
    imageAlt: { en: 'Sunrise over the horizon', hi: 'क्षितिज पर उगता सूरज' }, // REVIEW
  },

  // ── Disclaimer (above the site footer) ────────────────────────────
  disclaimer: {
    en: 'Experiences and results vary from person to person. This workshop is a meditation and personal-growth programme. It is not a substitute for medical treatment and does not provide financial or investment advice. Muse 2 is used for demonstration and awareness only.',
    hi: 'अनुभव और परिणाम हर व्यक्ति के लिए अलग हो सकते हैं। यह वर्कशॉप ध्यान और व्यक्तिगत विकास का कार्यक्रम है। यह किसी चिकित्सा उपचार का विकल्प नहीं है और कोई वित्तीय या निवेश सलाह नहीं देती। Muse 2 का उपयोग केवल प्रदर्शन और जागरूकता के लिए किया जाता है।',
  },
} as const
