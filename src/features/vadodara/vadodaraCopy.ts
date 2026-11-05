// /vadodara — page wording, word for word from copy/vadodara.md (Hindi),
// with the Phase 4.2 changes (no hotel, station or map anywhere; venue is
// sent on WhatsApp after booking).
// Dates, venue, price and deposit are not written here: they come from
// src/data/batches.ts ('vadodara') and fill the {placeholders}.

export const vadodaraCopy = {
  meta: {
    // copy/meta.md
    title: 'वडोदरा टेलीपैथी वर्कशॉप — 28–29 नवंबर | ₹5,999',
    description: 'वडोदरा में 2 दिन। 2017 से देश भर में। ₹1,000 में सीट बुक, बाकी वर्कशॉप के दिन।',
  },
  h1: 'वडोदरा में टेलीपैथी वर्कशॉप',
  sub: '2 दिन। शहर में ही। 2017 से देश भर में चल रहा वर्कशॉप — अब वडोदरा में।',
  strip: 'वडोदरा · 2017 से · 300+ वीडियो रिव्यू',
  batch: {
    dateLabel: 'तारीख:',
    timeLabel: 'समय:',
    bothDays: 'दोनों दिन',
    // {price} ({earlier} में से)। **{deposit} पर सीट पक्की, बाकी {balance} मौके पर।** …
    priceLine: '{price} ({earlier} में से)।',
    depositLine: '{deposit} पर सीट पक्की, बाकी {balance} मौके पर।',
    meals: 'नाश्ता, दोपहर का खाना और चाय शामिल।',
    button: 'सीट पक्की कीजिए — ₹1,000',
  },
  forWho: {
    heading: 'किसके लिए',
    items: [
      'जिनके घर में बातचीत बंद है',
      'जो डर और चक्कर में जी रहे हैं',
      'ट्रेडर, दुकानदार, बिज़नेसमैन — जिनका काम दिमाग़ से चलता है',
      'माता-पिता, जो बच्चे से दूरी महसूस करते हैं',
      'जो साधना में गहराई चाहते हैं, पर भीड़ वाले सत्संग से ऊब चुके हैं',
    ],
  },
  // Shown only when src/data/reviews.csv exists with Vadodara rows (it does not yet).
  localReviews: { heading: 'वडोदरा में पहले कौन आया' },
  faq: {
    heading: 'स्थानीय FAQ',
    items: [
      // {dates} = the next Vadodara batch ("28–29 नवंबर"), from src/data/batches.ts.
      { q: 'अगली बैच कब है?', a: '{dates}। वॉट्सऐप पर तारीख पक्की कीजिए।' },
      // copy/telepathy-v2.md FAQ 5
      { q: 'जगह कहाँ है?', a: 'बुकिंग के बाद जगह, समय और पहुँचने का तरीका वॉट्सऐप पर भेजा जाता है।' },
      { q: 'अकेले आ सकता हूँ?', a: 'ज़्यादातर लोग अकेले आते हैं। जोड़ी में आने की ज़रूरत नहीं।' },
      { q: 'बाहर से आ रहा हूँ, ठहरने की जगह?', a: 'वॉट्सऐप पर बताइए, पास की जगह बता देंगे।' },
      { q: 'कैंसिल कर दिया तो?', a: '₹1,000 वापस नहीं मिलते, पर अगली बैच में टल सकते हैं।' },
    ],
  },
  finalCta: {
    // {dates} from src/data/batches.ts ("28–29 नवंबर, वडोदरा").
    heading: '{dates}, वडोदरा',
    body: '{deposit} अभी, {balance} मौके पर।',
  },
} as const
