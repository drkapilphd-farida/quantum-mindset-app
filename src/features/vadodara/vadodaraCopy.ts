// /vadodara — page wording, word for word from copy/vadodara.md (Hindi).
// Dates, venue, price and deposit are not written here: they come from
// src/data/batches.ts ('vadodara') and fill the {placeholders}.

export const vadodaraCopy = {
  meta: {
    // copy/meta.md
    title: 'वडोदरा टेलीपैथी वर्कशॉप — 28–29 नवंबर | ₹5,999',
    description: 'वडोदरा में 2 दिन, Hotel Surya, स्टेशन के पास। 2017 से यहीं से चल रहा है। ₹1,000 पर सीट पक्की, बाकी मौके पर।',
  },
  h1: 'वडोदरा में टेलीपैथी वर्कशॉप',
  sub: '2 दिन। शहर में ही। रेलवे स्टेशन से 5 मिनट। 2017 से यही वर्कशॉप वडोदरा से चल रहा है — देश भर में।',
  strip: 'वडोदरा · 2017 से · 300+ वीडियो रिव्यू',
  batch: {
    dateLabel: 'तारीख:',
    timeLabel: 'समय:',
    venueLabel: 'जगह:',
    bothDays: 'दोनों दिन',
    city: 'वडोदरा',
    // {price} ({earlier} में से)। **{deposit} पर सीट पक्की, बाकी {balance} मौके पर।** …
    priceLine: '{price} ({earlier} में से)।',
    depositLine: '{deposit} पर सीट पक्की, बाकी {balance} मौके पर।',
    meals: 'नाश्ता, दोपहर का खाना और चाय शामिल।',
    button: 'सीट पक्की कीजिए — ₹1,000',
  },
  why: {
    heading: 'वडोदरा में यह क्यों',
    body: 'यह वर्कशॉप 2017 से देश भर में चल रहा है, पर इसकी जड़ वडोदरा में है — यहीं से शुरू हुआ। यहाँ के लोगों ने इसे बनाया है। इसीलिए यहाँ की बैच सबसे पहले खुलती है और सबसे पहले भरती है।',
  },
  station: {
    heading: 'स्टेशन के पास क्यों',
    body: 'बाहर के लोगों के लिए सबसे आसान जगह चुनी है — स्टेशन से 5 मिनट पैदल। सूरत, भरूच, आणंद, अहमदाबाद से आने वाले सुबह पहुँच सकते हैं और शाम लौट सकते हैं। पास में ठहरने की जगह भी है — पूछिए, बता देंगे।',
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
      { q: 'अगली बैच कब है?', a: '{dates}। हर महीने एक बैच, आमतौर पर महीने के आखिर में। वॉट्सऐप पर तारीख पक्की कीजिए।' },
      { q: 'जगह कहाँ है?', a: 'Hotel Surya, रेलवे स्टेशन के पास। पार्किंग और खाना दोनों की व्यवस्था है।' },
      { q: 'अकेले आ सकता हूँ?', a: 'ज़्यादातर लोग अकेले आते हैं। जोड़ी में आने की ज़रूरत नहीं।' },
      { q: 'बाहर से आ रहा हूँ, ठहरने की जगह?', a: 'वॉट्सऐप पर बताइए, पास की जगह बता देंगे।' },
      { q: 'कैंसिल कर दिया तो?', a: '₹1,000 वापस नहीं मिलते, पर अगली बैच में टल सकते हैं।' },
    ],
  },
  map: {
    title: 'Google Map — Hotel Surya, वडोदरा',
    open: 'Google Maps में खोलिए',
  },
  finalCta: {
    // {dates}, {venue} from src/data/batches.ts ("28–29 नवंबर, Hotel Surya").
    heading: '{dates}, {venue}',
    body: '{deposit} अभी, {balance} मौके पर।',
  },
} as const
