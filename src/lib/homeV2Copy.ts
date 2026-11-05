// Phase 4.2 (conversion rework) — homepage wording for `/` (English, the
// default since Phase 4.3) and `/hi` (Hindi), from copy/home-v2.md; the EEG and
// franchise strips from copy/home-hi.md / copy/home-en.md. Telepathy links
// on /hi go to /telepathy-workshop?lang=hi (telepathyHref).

type Bi = { hi: string; en: string }

export const homeV2 = {
  meta: {
    // Titles from copy/meta.md; descriptions from the Phase 4.2 prompt (no hotel, not Vadodara-only).
    title: { hi: 'मन की ताकत — जो दिखती है स्क्रीन पर | मन उर मन', en: 'Mind power you can see on a screen | Mind Ur Mind' },
    description: {
      hi: 'टेलीपैथी, इनट्यूशन, हार्ट-ब्रेन कोहेरेंस, कॉस्मिक फ्यूजन — 2 दिन का लाइव वर्कशॉप, मुंबई, अहमदाबाद, वडोदरा या घर से ऑनलाइन। 2017 से, 300+ वीडियो रिव्यू।',
      en: 'Telepathy, intuition, heart-brain coherence, Cosmic Fusion — a 2-day live workshop in Mumbai, Ahmedabad, Vadodara or online. Since 2017, 300+ video reviews.',
    },
  },
  hero: {
    strip: { hi: '2017 से टेलीपैथी वर्कशॉप · 300+ वीडियो रिव्यू · 12 साल से सिखा रहे हैं', en: 'Telepathy workshop since 2017 · 300+ video reviews · 12 years of teaching' },
    // Phase 5: new H1 (owner).
    h1: { hi: 'टेलीपैथी सीखिए — और उसके पीछे की मन की ताकत', en: 'Learn telepathy — and the mind power behind it' },
    sub: {
      hi: 'टेलीपैथी से अपनी बात बिना कहे पहुँचाइए, इनट्यूशन से सही फैसले लीजिए, हार्ट-ब्रेन कोहेरेंस से डर उतारिए, और कॉस्मिक फ्यूजन से ऊर्जा भरिए — 2 दिन का लाइव वर्कशॉप, मुंबई, अहमदाबाद, वडोदरा में या घर से ऑनलाइन।',
      en: 'Send your message without words through telepathy, decide right with intuition, drop fear with heart-brain coherence, and refill your energy with Cosmic Fusion — a 2-day live workshop in Mumbai, Ahmedabad, Vadodara, or online from home.',
    },
    ctaPrimary: { hi: 'अपनी तारीख चुनिए', en: 'Pick your date' },
    ctaSecondary: { hi: 'वर्कशॉप में क्या होता है →', en: 'What happens in the workshop →' },
    smallLine: { hi: '₹1,000 में सीट बुक · बाकी वर्कशॉप के दिन', en: 'Book with ₹1,000 · Pay the rest on the day' },
  },
  benefits: {
    heading: { hi: '2 दिन बाद क्या बदलता है', en: 'What changes after 2 days' },
    more: { hi: 'जानिए कैसे →', en: 'See how →' },
    // Phase 4.3: the trading tile first (it links to the traders section).
    tiles: [
      { title: { hi: 'डर और लालच के बिना ट्रेड', en: 'Trade without fear and greed' }, body: { hi: 'डर-लालच को हाथ लगाने से पहले पहचानिए — इनट्यूशन और कोहेरेंस', en: 'Spot fear and greed before they act — intuition and coherence' }, hash: '#traders' },
      { title: { hi: 'रिश्तों में बात फिर से पहुँचने लगती है', en: 'Your words start reaching people again' }, body: { hi: 'अपनी भावना बिना कहे भेजने का अभ्यास — टेलीपैथी', en: 'Practise sending feelings without words — telepathy' } },
      { title: { hi: 'डर उतरता है, मन शांत होता है', en: 'Fear drops, the mind settles' }, body: { hi: 'दिल और दिमाग़ एक ताल में — EEG पर दिखता है', en: 'Heart and mind in one rhythm — visible on an EEG' } },
      { title: { hi: 'फैसले साफ़ होते हैं', en: 'Decisions get clear' }, body: { hi: 'अंदर की आवाज़ पहचानना और उस पर भरोसा — इनट्यूशन', en: 'Recognise and trust your inner voice — intuition' } },
      { title: { hi: 'ऊर्जा लौटती है, इरादे पूरे होने लगते हैं', en: 'Energy returns, intentions start to land' }, body: { hi: 'प्राण को ब्रह्मांड की ऊर्जा से जोड़ना — कॉस्मिक फ्यूजन', en: 'Connecting prana to universal energy — Cosmic Fusion' } },
    ],
  },
  muse: {
    heading: { hi: 'मानिए मत। देखिए।', en: "Don't believe it. Watch it." },
    body: {
      hi: 'वर्कशॉप में EEG हेडबैंड लाइव लगता है और स्क्रीन पर दिमाग़ की तरंगें दिखती हैं — बेचैन कैसे शांत होती हैं, 90 सेकंड में। अपनी आँखों से।',
      en: 'An EEG headband goes on a volunteer, and brain waves appear on screen — how a restless mind settles in 90 seconds. With your own eyes.',
    },
    note: { hi: 'यह कोई मेडिकल टेस्ट नहीं — सबूत है, इलाज नहीं।', en: 'Not a medical test. Proof, not treatment.' },
  },
  journey: {
    heading: { hi: 'वर्कशॉप शुरुआत है — आगे का सफ़र', en: 'The workshop is the start — the journey ahead' },
    steps: [
      { label: { hi: '2 दिन का वर्कशॉप — शुरुआत', en: '2-day workshop — the start' }, href: 'telepathy' },
      { label: { hi: '11 रात ऑनलाइन रिट्रीट — अभ्यास गहरा', en: '11-night online retreat — go deeper' }, href: '/retreats/online-11-day' },
      { label: { hi: '7 दिन लोनावला — फोन बंद, सिर्फ साधना', en: '7 days in Lonavala — phone off, only practice' }, href: '/retreats/residential' },
      { label: { hi: '1-on-1 डॉ. कपिल के साथ', en: '1-on-1 with Dr. Kapil' }, href: '/mentoring/personal-class' },
    ],
  },
  sharpBrain: {
    title: { hi: 'बच्चे की पढ़ाई और याद के लिए — Sharp Brain', en: "For your child's studies and memory — Sharp Brain" },
    body: {
      hi: 'पढ़ने की रफ्तार और याद, 30 दिन में, नाप कर। पहले मुफ्त Reading & Memory Test दीजिए।',
      en: 'Reading speed and recall in 30 days, measured. Start with the free Reading & Memory Test.',
    },
    test: { hi: 'मुफ्त टेस्ट दीजिए', en: 'Take the free test' },
    // Phase 4.3: Sharp Brain reviews live on /reviews. (Hindi wording not given — see the Phase 4.3 report.)
    reviews: { hi: 'रिव्यू देखिए →', en: 'See reviews →' },
    see: { hi: 'Sharp Brain देखिए →', en: 'See Sharp Brain →' },
  },
  overthinking: { hi: 'सोच का चक्कर नहीं रुकता? 21 दिन, ₹499 से।', en: "Overthinking won't stop? 21 days, from ₹499." },
  franchise: {
    lead: { hi: 'ट्रेनर या एजुप्रेन्योर हैं?', en: 'Trainer or edupreneur?' },
    body: { hi: 'Sharp Brain का अपना सेंटर चलाइए — तैयार कोर्स, ऐप, लैंडिंग पेज, मार्केटिंग सामग्री।', en: 'Run your own Sharp Brain centre — ready curriculum, app, landing page, marketing material.' },
    button: { hi: 'ट्रेनर बनिए', en: 'Become a trainer' },
  },
} satisfies Record<string, unknown>

export type HomeLang = 'hi' | 'en'

export const say = (text: Bi, lang: HomeLang): string => text[lang]

/** /telepathy-workshop (English), or its Hindi version from /hi (Phase 4.3). */
export function telepathyHref(lang: HomeLang, hash = ''): string {
  return lang === 'hi' ? `/telepathy-workshop?lang=hi${hash}` : `/telepathy-workshop${hash}`
}
