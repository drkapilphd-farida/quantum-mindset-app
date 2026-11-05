// /vadodara — page wording. Hindi word for word from copy/vadodara.md with
// the Phase 4.2 changes (no hotel, station or map; venue is sent on
// WhatsApp after booking); English (the default since Phase 4.3) word for
// word from PHASE-4.3 part 8. Dates, price and deposit are not written
// here: they come from src/data/batches.ts ('vadodara') and fill the
// {placeholders}.

type Bi = { en: string; hi: string }

export const vadodaraCopy = {
  meta: {
    title: { hi: 'वडोदरा टेलीपैथी वर्कशॉप — 28–29 नवंबर | ₹5,999', en: 'Telepathy Workshop in Vadodara — 28–29 November | ₹5,999' },
    description: {
      hi: 'वडोदरा में 2 दिन। 2017 से देश भर में। ₹1,000 में सीट बुक, बाकी वर्कशॉप के दिन।',
      en: '2 days in Vadodara. Running across India since 2017. Book with ₹1,000, pay the rest on the day.',
    },
  },
  h1: { hi: 'वडोदरा में टेलीपैथी वर्कशॉप', en: 'Telepathy Workshop in Vadodara' },
  sub: { hi: '2 दिन। शहर में ही। 2017 से देश भर में चल रहा वर्कशॉप — अब वडोदरा में।', en: '2 days, right in the city. A workshop running across India since 2017 — now in Vadodara.' },
  strip: { hi: 'वडोदरा · 2017 से · 300+ वीडियो रिव्यू', en: 'Since 2017 · 300+ video reviews' },
  batch: {
    dateLabel: { hi: 'तारीख:', en: 'Date:' },
    timeLabel: { hi: 'समय:', en: 'Time:' },
    // Hindi: the batch's timeHi + ", दोनों दिन"; English as written.
    bothDays: { hi: 'दोनों दिन', en: 'both days' },
    timeEn: '9:30 am – 6:00 pm',
    priceLine: { hi: '{price} ({earlier} में से)।', en: '{price} (from {earlier}).' },
    depositLine: { hi: '{deposit} पर सीट पक्की, बाकी {balance} मौके पर।', en: 'Book with {deposit}, pay {balance} on the day.' },
    meals: { hi: 'नाश्ता, दोपहर का खाना और चाय शामिल।', en: 'Breakfast, lunch and tea included.' },
    button: { hi: 'सीट पक्की कीजिए — ₹1,000', en: 'Book seat — ₹1,000' },
  },
  forWho: {
    heading: { hi: 'किसके लिए', en: "Who it's for" },
    items: [
      { hi: 'जिनके घर में बातचीत बंद है', en: 'People who have stopped talking at home' },
      { hi: 'जो डर और चक्कर में जी रहे हैं', en: 'People living with fear and an endless loop of thoughts' },
      { hi: 'ट्रेडर, दुकानदार, बिज़नेसमैन — जिनका काम दिमाग़ से चलता है', en: 'Traders, shopkeepers and business people — whose work runs on the mind' },
      { hi: 'माता-पिता, जो बच्चे से दूरी महसूस करते हैं', en: 'Parents who feel distant from their child' },
      { hi: 'जो साधना में गहराई चाहते हैं, पर भीड़ वाले सत्संग से ऊब चुके हैं', en: 'People who want depth in practice but are tired of crowded satsangs' },
    ],
  },
  // Shown only when src/data/reviews.csv exists with Vadodara rows (it does not yet).
  localReviews: { heading: { hi: 'वडोदरा में पहले कौन आया', en: '' } },
  faq: {
    heading: { hi: 'स्थानीय FAQ', en: 'FAQ' },
    items: [
      // {dates} = the next Vadodara batch ("28–29 नवंबर" / "28–29 November"), from src/data/batches.ts.
      { q: { hi: 'अगली बैच कब है?', en: 'When is the next batch?' }, a: { hi: '{dates}। वॉट्सऐप पर तारीख पक्की कीजिए।', en: '{dates}. Confirm your date on WhatsApp.' } },
      { q: { hi: 'जगह कहाँ है?', en: 'Where is the venue?' }, a: { hi: 'बुकिंग के बाद जगह, समय और पहुँचने का तरीका वॉट्सऐप पर भेजा जाता है।', en: 'After booking, the venue, timing and directions are sent to you on WhatsApp.' } },
      { q: { hi: 'अकेले आ सकता हूँ?', en: 'Can I come alone?' }, a: { hi: 'ज़्यादातर लोग अकेले आते हैं। जोड़ी में आने की ज़रूरत नहीं।', en: "Most people come alone. You don't need a partner." } },
      { q: { hi: 'बाहर से आ रहा हूँ, ठहरने की जगह?', en: "I'm coming from outside — where can I stay?" }, a: { hi: 'वॉट्सऐप पर बताइए, पास की जगह बता देंगे।', en: "Message us on WhatsApp and we'll suggest a place nearby." } },
      { q: { hi: 'कैंसिल कर दिया तो?', en: 'What if I cancel?' }, a: { hi: '₹1,000 वापस नहीं मिलते, पर अगली बैच में टल सकते हैं।', en: "The ₹1,000 isn't refunded, but it moves to the next batch." } },
    ],
  },
  finalCta: {
    heading: { hi: '{dates}, वडोदरा', en: '{dates}, Vadodara' },
    body: { hi: '{deposit} अभी, {balance} मौके पर।', en: '{deposit} now, {balance} on the day.' },
  },
} satisfies Record<string, unknown>

export const say = (text: Bi, lang: 'hi' | 'en'): string => text[lang]
