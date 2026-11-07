# BRIEF — mindurmind.org.in पोज़ीशनिंग रीवर्क (फाइनल · 5 नवंबर 2026)

> Claude Code के लिए: यह फ़ाइल पूरी पढ़िए. फिर सिर्फ फेज़ 0 कीजिए, रिपोर्ट दीजिए और रुकिए.
> हर फेज़ के बाद मंज़ूरी का इंतज़ार कीजिए. अगला फेज़ अपने-आप शुरू मत कीजिए.

## प्रोजेक्ट
Next.js (App Router) साइट, GitHub + Vercel. मालिक: Dr. Kapil Dev Sharma, वडोदरा.
एक ही आदमी सब चलाता है. कोई टीम नहीं, कोई डेवलपर नहीं.

## मकसद (एक वाक्य)
होमपेज का मुख्य दरवाज़ा **Telepathy Workshop** बनाना, और Sharp Brain को मुख्य
प्रोडक्ट से हटाकर सहायक लाइन बनाना.

## क्यों
Telepathy Workshop: 2017 से, 300+ वीडियो, 4 शहर, Muse 2 EEG लाइव डेमो.
यह अद्वितीय है. Sharp Brain भीड़ में है. फिलहाल Telepathy होमपेज से गायब है.

## तथ्य — एक ही सच, पूरी साइट पर (मालिक द्वारा पुष्ट)
| साल | क्या |
|---|---|
| 2014 | ट्रेनिंग की दुनिया में आए, मन उर मन शुरू ("12 साल से सिखा रहे हैं" = 2014 से) |
| 2015 | Quantum Speed Reading (आज का Sharp Brain) |
| 2016 | पूरा एक साल हिमालय में — गोमुख से आगे, एक संत से क्रिया योग |
| 2017 | **टेलीपैथी वर्कशॉप शुरू** |

नियम:
- "12 साल" / "Twelve years" सिर्फ कुल सिखाने के लिए (2014 से). टेलीपैथी वर्कशॉप के साथ कभी "12 साल" नहीं — वहाँ **"2017 से"**.
- संत का नाम कहीं नहीं — सिर्फ "एक संत" / "a saint".
- **"10,000+ लोग" = सब प्रोग्राम मिलाकर, 2014 से** (सबसे ज़्यादा टेलीपैथी में, पर सिर्फ टेलीपैथी नहीं).
  इसलिए 10,000 सिर्फ कुल के साथ ("12 साल से सिखा रहे हैं, 10,000+ लोग", About). टेलीपैथी वर्कशॉप के साथ कभी "10,000 ने सीखा / 10,000 में से" नहीं —
  वहाँ "2017 से" + "300+ वीडियो", और ज़रूरत हो तो "हज़ारों लोग".

## स्टैक
- Next.js (App Router), TypeScript
- काम सिर्फ branch `positioning-rework` पर
- Vercel preview पर जाँच. Production पर सीधे कुछ नहीं. `main` में मर्ज सिर्फ फेज़ 9 के बाद, मालिक की मंज़ूरी से.

---

## सख्त नियम — हर काम पर लागू
1. मौजूदा URL मत बदलिए. नए रूट सिर्फ ये: `/en`, `/telepathy-workshop/online`, `/vadodara`, `/reviews`.
2. कोई नई npm लाइब्रेरी नहीं. (Google Map = सादा iframe, YouTube = सादा iframe.)
3. मौजूदा कंपोनेंट और डिज़ाइन सिस्टम दोबारा इस्तेमाल कीजिए. नया CSS सिर्फ तब, जब मौजूदा से काम न चले — और रिपोर्ट में लिखिए.
4. एक फेज़ = एक पेज. (फेज़ 0, 5 और 9 कई फ़ाइलें छूते हैं, पर उनमें नई कॉपी नहीं, या सिर्फ तय लाइनें.)
5. `copy/` की कॉपी शब्द-दर-शब्द डालिए. सुधार, छोटा, "बेहतर", अनुवाद — कुछ नहीं.
6. जो हटाने को कहा है, उसके अलावा कुछ मत हटाइए.
7. हर फेज़ के बाद रिपोर्ट (फॉर्मेट नीचे).
8. हर फेज़ के बाद रुकिए.
9. कोड और कोड-कमेंट अंग्रेज़ी में. हिंदी कॉपी जस की तस.
10. कोई डिज़ाइन रिफ्रेश नहीं, नया फ़ॉन्ट नहीं, नया रंग नहीं. सिर्फ क्रम, कॉपी, रूट.
11. **कुछ भी खुद मत बनाइए** — कोई लिंक, कीमत, तारीख, आंकड़ा, नतीजा, रिव्यू लेबल, अंग्रेज़ी वाक्य.
    जो `copy/` या `data/` में नहीं है, वहाँ `[[नाम]]` रखिए और रिपोर्ट के "अनिश्चित" में लिखिए.
12. कोई बटन टूटे लिंक पर न जाए. Razorpay/ग्रुप लिंक अभी `[[...]]` है तो बटन `waLink(...)` पर जाए (नीचे देखिए) और रिपोर्ट में लिखिए.
13. कॉपी में टकराव दिखे (दो जगह अलग संख्या, अलग तारीख) तो खुद मत चुनिए — रिपोर्ट कीजिए और रुकिए.

## जो नहीं छूना है (बिल्कुल)
- **यही रिपो/Vercel प्रोजेक्ट `app.mindurmind.org.in` (Quantum Mind ऐप) और `habit.mindurmind.org.in` भी चलाता है.**
  उनके रूट, कंपोनेंट, middleware/subdomain routing, auth, Supabase कोड — कुछ नहीं छूना. यह रीवर्क सिर्फ `mindurmind.org.in` / `www` वाली वेबसाइट के लिए है.
  नैव, फुटर, भाषा टॉगल, रीडायरेक्ट या कोई साझा कंपोनेंट बदलने से ऐप या habit पर असर पड़ता हो — तो मत बदलिए, रिपोर्ट कीजिए, रुकिए.
- `app/layout.tsx` का फ़ॉन्ट और थीम सेटअप
- Razorpay इंटीग्रेशन का कोर लॉजिक (सिर्फ बटन का `href` बदलना ठीक है)
- Sharp Brain, Overthinking, रिट्रीट, personal-class के मौजूदा चेकआउट
- `telepathy-workshop` का Muse 2 सेक्शन, 300 वीडियो सेक्शन, "Your 2 days" शेड्यूल, "What's included", FAQ का बाकी हिस्सा
- `retreats/residential` का "This Isn't for Everyone" सेक्शन
- `mentoring/personal-class` की "Group vs Personal" तालिका
- `refund-policy`, `privacy`, `terms` का टेक्स्ट
- `sitemap.xml` का ढाँचा (सिर्फ नए URL जोड़ने हैं)
- कोई भी फोटो — न हटाना, न बदलना (होमपेज हीरो की फोटो भी)

---

## पेज-वार भाषा (अंतिम)

| पेज | भाषा | कॉपी कहाँ से |
|---|---|---|
| `/` | हिंदी | `copy/home-hi.md` |
| `/en` (नया) | अंग्रेज़ी | `copy/home-en.md` |
| `/telepathy-workshop` | हिंदी | `copy/telepathy.md` (पट्टी, ट्रेडर, हिमालय लाइन, ₹1,000, शहर, FAQ — सब इसी में) |
| `/telepathy-workshop/online` (नया) | हिंदी | `copy/telepathy-online.md` |
| `/vadodara` (नया) | हिंदी | `copy/vadodara.md` |
| `/reviews` (नया) | हिंदी | `copy/reviews.md` + `data/reviews.csv` |
| `/mentoring/overthinking-course` | हिंदी | `copy/overthinking.md` |
| `/gallery` | हिंदी | `copy/gallery.md` |
| `/programs/sharp-brain` | अंग्रेज़ी (मौजूदा) + हिंदी ₹2,999 ब्लॉक | `copy/en-changes.md` |
| `/mentoring/personal-class` | अंग्रेज़ी (मौजूदा) | `copy/en-changes.md` |
| `/executive-brain-workshop` | अंग्रेज़ी | `copy/en-changes.md` |
| `/corporate` | अंग्रेज़ी | `copy/en-changes.md` |
| `/retreats/*` | अंग्रेज़ी | `copy/en-changes.md` |
| `/about` | अंग्रेज़ी | `copy/about.md` (नई कहानी का अंग्रेज़ी हिस्सा, H1 "My story") |

- अंग्रेज़ी पेजों पर सिर्फ वही हिस्से बदलिए जो `en-changes.md` में हैं. बाकी अंग्रेज़ी टेक्स्ट जस का तस.
- अगर किसी अंग्रेज़ी पेज के लिए `copy/` में कोई पुरानी हिंदी फ़ाइल भी मिले, तो **`en-changes.md` ही मान्य है**.
- भाषा टॉगल हटेगा (फेज़ 4 में). उसकी जगह नैव में सादा लिंक: `/` पर "English" → `/en`, `/en` पर "हिंदी" → `/`. बाकी पेजों पर भाषा लिंक नहीं.

---

## तय तारीखें

| बैच | तारीख | समय | जगह | कीमत |
|---|---|---|---|---|
| मुंबई (ऑफलाइन) | 14–15 नवंबर 2026 | 9:30–18:00 | Hotel Better Home International, अंधेरी ईस्ट | ₹5,999 |
| ऑनलाइन | 17, 18, 19 नवंबर 2026 | 19:30–22:00 | ज़ूम | ₹3,999 · 40 सीट |
| अहमदाबाद (ऑफलाइन) | 21–22 नवंबर 2026 | 9:30–18:00 | Hotel Silver Cloud, आश्रम रोड | ₹5,999 |
| वडोदरा (ऑफलाइन) | 28–29 नवंबर 2026 | 9:30–18:00 | Hotel Surya, रेलवे स्टेशन के पास | ₹5,999 · ₹1,000 पर सीट पक्की |
| पुणे | तय नहीं | — | — | — |
| एग्जीक्यूटिव (मुंबई) | `[[EXEC_DATE]]` | — | — | — |
| मुफ्त डेमो (वडोदरा) | 12 नवंबर 2026, शाम 7 बजे | — | जगह तय नहीं → वॉट्सऐप | मुफ्त |

ऑनलाइन: **3 शाम**, 4 नहीं. ऑफलाइन: **17 घंटे**, 16 नहीं. "रिकॉर्डिंग नहीं" ऑनलाइन पेज पर तीन जगह है — हटाना नहीं.

---

## `data/` फ़ाइलें — फेज़ 0 में बनें, पूरी साइट इन्हीं से पढ़े

### `data/batches.ts`
तारीख, जगह, कीमत, सीट — **सिर्फ यहीं**. कोई पेज या टाइमर अपनी तारीख hardcode न करे.

```ts
export type Batch = {
  id: 'mumbai' | 'online' | 'ahmedabad' | 'vadodara' | 'pune' | 'exec-mumbai';
  startDate: string | null;   // 'YYYY-MM-DD', IST. null = तारीख तय नहीं
  endDate: string | null;
  labelHi: string;            // जैसे '28–29 नवंबर 2026'
  labelEn: string;            // जैसे '28–29 November 2026'
  timeHi?: string;
  venueHi?: string;
  venueEn?: string;
  priceInr?: number;
  depositInr?: number;        // वडोदरा: 1000
  seatsTotal?: number;        // ऑनलाइन: 40
  seatsLeft?: number | null;  // हाथ से भरा जाता है. null = सिर्फ "40 सीट" दिखे, कोई गिनती नहीं
  bookingLinkKey?: keyof typeof LINKS;
  mapsSearchUrl?: string;
};
```

नियम:
- `endDate` बीत गई (IST) → वह बैच अपने-आप छिप जाए.
- किसी शहर/प्रोग्राम का आगे कोई बैच नहीं, या `startDate` null → खाली जगह नहीं, यह लाइन दिखे:
  - हिंदी: `अगली तारीख जल्दी — वॉट्सऐप पर पूछिए`
  - अंग्रेज़ी: `Next date soon — ask on WhatsApp`
  - दोनों `FALLBACK_HI` / `FALLBACK_EN` नाम से export हों, और लिंक `waLink(...)` पर जाए.
- `seatsLeft` कभी अपने-आप न घटे. कोई नकली गिनती, नकली "सिर्फ 3 सीट बचीं" नहीं.

### `data/links.ts`
```ts
export const WHATSAPP_NUMBER = '919540123161';
export const waLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const DEMO_WA_TEXT = 'मुफ्त डेमो 12 नवंबर - सीट रोकिए';
export const VADODARA_MAPS_SEARCH =
  'https://www.google.com/maps/search/?api=1&query=Hotel%20Surya%20Station%20Road%20Vadodara';
export const VADODARA_MAPS_EMBED =
  'https://maps.google.com/maps?q=Hotel%20Surya%20Station%20Road%20Vadodara&output=embed';
export const YOUTUBE_CHANNEL = 'https://www.youtube.com/@innershiftWithDrKapil';

export const LINKS = {
  rzpTelepathyDeposit1000: '[[RZP_TELEPATHY_1000]]',   // फेज़ 0 की सूची से मालिक पुष्टि करेगा
  rzpOnline3999:           '[[RZP_ONLINE_3999]]',
  rzpSharpBrain7Day2999:   '[[RZP_SHARPBRAIN_2999]]',
  rzpRetreat11Discount:    '[[RZP_RETREAT11_5999]]',
  waGroupOverthinking:     '[[WA_GROUP_OVERTHINKING]]',
  googleBusinessProfile:   '[[GBP_URL]]',
} as const;
```
- वॉट्सऐप लिंक हमेशा `waLink()` से. हाथ से encode किया URL कहीं नहीं.
- कोई `LINKS` मान अभी `[[...]]` है → उस बटन का `href` = `waLink(<उस बटन का टेक्स्ट>)`. रिपोर्ट में लिखिए.
- Map: पेज पर `VADODARA_MAPS_EMBED` का iframe, और उसके नीचे "Google Maps में खोलिए" → `VADODARA_MAPS_SEARCH`. पिन मिलने पर सिर्फ ये दो मान बदलेंगे.

---

## रीडायरेक्ट मैप — फेज़ 0 में `next.config.js`, सभी 301 (`permanent: true`)
```
/telepathy/                      → /telepathy-workshop
/telepathycourse/                → /telepathy-workshop
/telepathy-mind-reading-offline/ → /telepathy-workshop
/about-us-telepathy/             → /about
/testimonials/                   → /reviews
/anxiety/                        → /mentoring/overthinking-course
/personalclass/                  → /mentoring/personal-class
/elementor-landing-page-1483/    → /
/courses                         → /          (फेज़ 5 में, जब /courses पेज हटे)
```
ट्रेलिंग स्लैश के साथ और बिना — दोनों पकड़े जाएँ. `/testimonials` → `/reviews` फेज़ 7 से पहले 404 देगा; इसे फेज़ 7 तक `/` पर भेजिए और फेज़ 7 में `/reviews` कीजिए.

---

# फेज़ 0 — सुरक्षा और ढाँचा (कोई कॉपी नहीं)
1. `main` पर tag `pre-rework-2026-11-05`, फिर branch `positioning-rework`.
2. रीडायरेक्ट मैप (ऊपर) लागू.
3. `data/batches.ts` और `data/links.ts` बनाइए, ऊपर के ढाँचे और तालिका से भरकर.
4. **सिर्फ सूची बनाइए, कुछ मत बदलिए:**
   - `telepathy-workshop` पेज पर मौजूद चारों चेकआउट (rzp.io, razorpay.me, classplus, WhatsApp): हर लिंक, किस बटन पर है, कितनी रकम का दिखता है. मालिक बताएगा कि ₹1,000 वाला कौन-सा है.
   - भाषा टॉगल: किस-किस पेज पर हिंदी टेक्स्ट टॉगल से आता है. टॉगल हटने पर कौन-सा हिंदी टेक्स्ट गायब होगा.
   - कहाँ-कहाँ तारीख hardcode है (टाइमर समेत).
   - फ़ाइल मैप की पुष्टि (नीचे) — असली पथ क्या हैं.
   - subdomain routing: `app.` और `habit.` कैसे अलग होते हैं (middleware? अलग फ़ोल्डर?). वेबसाइट और ऐप कौन-से कंपोनेंट साझा करते हैं (layout, नैव, फुटर, टॉगल).
     हर आगे के फेज़ में किन फ़ाइलों को छूने से ऐप पर असर पड़ सकता है — उनकी सूची.
5. **तथ्य-जाँच** — `copy/` की फ़ाइलों में "2017 से" और "10,000 = कुल" वाले सुधार पहले से लगे हुए हैं. कुछ मत बदलिए.
   पूरी `copy/` और मौजूदा `app/` में "12 साल", "12 years", "twelve years", "2014 से", "10,000", "10000" खोजिए.
   हर मिलान की सूची दीजिए: फ़ाइल, लाइन, और यह टेलीपैथी के बारे में है या कुल सिखाने के बारे में.
   `copy/` में कोई गड़बड़ दिखे या मौजूदा `app/` में टेलीपैथी के साथ "12 years"/"10,000 trained" हो — बदलिए मत, मालिक तय करेगा.
6. रिपोर्ट, रुकिए.

# फेज़ 1 — `/telepathy-workshop`
कॉपी: `copy/telepathy.md`, `copy/global.md`.
1. नया H1. पुराना H1 "The Guru You Are Searching For Is Already Inside You" उपशीर्षक बने.
2. क्रम: हीरो → एक पंक्ति की ऑनलाइन पट्टी (`/telepathy-workshop/online` पर) → ट्रेडर सेक्शन → "यह वर्कशॉप 2016 के बाद बना…" वाली पंक्ति → बाकी पेज जैसा है.
   इस पेज पर मौजूदा अंग्रेज़ी/हिंदी टेक्स्ट में टेलीपैथी के साथ "12 years/12 साल" हो तो फेज़ 0 की सूची के हिसाब से मालिक का फैसला लागू कीजिए.
3. ₹1,000 वाली लाइन बड़ी और साफ (मौजूदा टाइपोग्राफ़ी स्केल में से बड़ा साइज़, नया CSS नहीं).
4. शहर ब्लॉक `batches.ts` से: मुंबई, अहमदाबाद, वडोदरा (जगह + Maps लिंक), पुणे (fallback लाइन). "Date on WhatsApp" / "Venue on WhatsApp" हटें.
5. इस पेज के सारे बुकिंग बटन → `LINKS.rzpTelepathyDeposit1000`. बाकी तीन चेकआउट **सिर्फ इस पेज से** हटें. हीरो CTA का टेक्स्ट न बदले.
6. FAQ: सिर्फ "Is this available online?" का उत्तर `telepathy.md` वाले नए उत्तर से बदले. बाकी FAQ जस का तस.
7. इस पेज पर "team" वाली लाइनें → `global.md` की लाइन.

# फेज़ 2 — `/telepathy-workshop/online` (नया)
कॉपी: `copy/telepathy-online.md`.
1. फेज़ 1 वाले पेज के हीरो/लेआउट कंपोनेंट दोबारा इस्तेमाल. नया लेआउट नहीं.
2. बैच ब्लॉक `batches.ts` के `online` से. "40 सीट" — `seatsLeft` null है तो कोई गिनती नहीं.
3. बटन → `LINKS.rzpOnline3999`.
4. मुख्य नैव में नहीं. सिर्फ टेलीपैथी पेज की पट्टी और फुटर से पहुँच.
5. जाँच: पेज पर "4 शाम" 0 बार, "16 घंटे" 0 बार, "रिकॉर्डिंग नहीं" 3 बार.

# फेज़ 3 — `/vadodara` (नया)
कॉपी: `copy/vadodara.md` (भरा हुआ संस्करण).
1. पूरा लोकल लैंडिंग पेज, मौजूदा कंपोनेंट से.
2. बैच ब्लॉक `batches.ts` के `vadodara` से. बटन → `LINKS.rzpTelepathyDeposit1000`.
3. नक्शा: `VADODARA_MAPS_EMBED` iframe (`loading="lazy"`) + "Google Maps में खोलिए".
4. "वडोदरा में पहले कौन आया" — 3 वीडियो सिर्फ `data/reviews.csv` से, जहाँ शहर = वडोदरा. शीट नहीं है तो यह सेक्शन छिपा रहे, खाली न दिखे.

# फेज़ 4 — होमपेज: सिर्फ हीरो + `/en` + नैव-फुटर
कॉपी: `copy/home-hi.md` और `copy/home-en.md` (सिर्फ H1, उपशीर्षक, CTA, प्रूफ पट्टी), `copy/header-footer.md`.
1. `/`: हिंदी H1, उपशीर्षक, प्रूफ पट्टी.
   - प्राइमरी CTA `वडोदरा बैच — ₹1,000 पर सीट पक्की` → `/vadodara`
   - सेकंडरी CTA `मुफ्त डेमो में आइए` → `waLink(DEMO_WA_TEXT)`
   - CTA के नीचे शहर-लाइन, `batches.ts` से (बीते बैच अपने-आप हटें): `मुंबई 14–15 · ऑनलाइन 17–19 · अहमदाबाद 21–22 · वडोदरा 28–29`
2. `/en` (नया): वही होमपेज कंपोनेंट, अंग्रेज़ी हीरो (`home-en.md`). बाकी सेक्शन अभी जैसे हैं.
3. `/` पर बाकी सेक्शन इस फेज़ में न छुएँ. (हीरो हिंदी, बाकी फिलहाल मौजूदा — फेज़ 6 तक यही ठीक है.)
4. भाषा टॉगल हटाइए — **सिर्फ तब, जब फेज़ 0 की टॉगल-सूची मंज़ूर हो चुकी हो**. नैव में सादा भाषा लिंक.
5. नैव और फुटर `header-footer.md` से. नैव में अधिकतम 5 आइटम + दाईं ओर CTA. नैव से `/courses` का लिंक हटे.
   हिंदी पेजों पर हिंदी लेबल; `/en` और अंग्रेज़ी पेजों पर `header-footer.md` के अंग्रेज़ी लेबल
   (`Telepathy Workshop · Reviews · Sharp Brain · Retreats · Contact`, CTA `Hold a seat`, फुटर उसी फ़ाइल से).
6. हीरो फोटो वही रहे.

# फेज़ 5 — बाकी तकनीकी
1. `executive-brain-workshop`: "Registrations closed" → `en-changes.md` वाली लाइन. तारीख `batches.ts` के `exec-mumbai` से; null है तो `FALLBACK_EN`. "Notify me" → `waLink(...)`.
2. टाइमर कंपोनेंट: तारीख सिर्फ `batches.ts` से. तारीख बीतने पर शून्य पर अटके नहीं — `अगली बैच की तारीख जल्दी` दिखे.
3. `/courses` खाली पेज हटाइए + 301 `/courses → /`.
4. तीनों टेस्ट (`reading-memory-test`, `mind-assessment`, `discover-learning-potential`): रिज़ल्ट के बाद नाम + वॉट्सऐप नंबर फॉर्म, कॉपी `copy/tests.md`.
   फॉर्म डेटा उसी मौजूदा तरीके से जाए जिससे Reading Speed Test के लीड जाते हैं. ऐसा कोई तरीका न मिले तो नई सेवा मत जोड़िए — रिपोर्ट कीजिए, रुकिए.
5. पूरी साइट: `Dr. Kapil's team`, `our team`, `We respond to all queries within 24 hours`, `Chat directly with Dr. Kapil's team`, `Personally confirmed by Dr. Kapil's team` →
   - हिंदी पेज: `copy/global.md` की लाइन (24 घंटे वाली)
   - अंग्रेज़ी पेज: `Dr. Kapil replies himself, within 24 hours.`
   - वॉट्सऐप बटन (हिंदी पेज): `डॉ. कपिल से वॉट्सऐप पर पूछिए`

# फेज़ 6 — होमपेज पूरा (`/` और `/en`)
कॉपी: `copy/home-hi.md`, `copy/home-en.md`.
क्रम:
1. हीरो (फेज़ 4 वाला)
1a. "हिमालय में सीखा। स्क्रीन पर दिखाया।" बैंड (`copy/about.md` से), `पूरी कहानी →` → `/about`.
    `/en` पर इसका अंग्रेज़ी संस्करण `copy/` में नहीं है → `/en` पर यह बैंड न लगाइए, रिपोर्ट कीजिए.
2. `#solve` चार-कार्ड सेक्शन (Brain / Brain·Work / Mind / Meditation) पूरा हटे → 4 दर्द-ब्लॉक
3. Muse 2 सेक्शन
4. रिव्यू सेक्शन — 6 वीडियो `data/reviews.csv` से (`homepage = हाँ`). लेबल सिर्फ शीट के `label` कॉलम से. शीट नहीं है तो मौजूदा रिव्यू सेक्शन जैसा है वैसा रहे, बिना लेबल.
5. "और भी प्रोग्राम" — 3 छोटे कार्ड: Sharp Brain, Overthinking, Retreats
6. "यहाँ चमत्कार भी है, और नाप भी" सेक्शन (FAQ से "Is this science-based or spiritual?" हटकर)
7. FAQ (नए सवाल कॉपी से)
8. अंतिम CTA (तारीख `batches.ts` से)
9. फ्रैंचाइज़ पट्टी (`ट्रेनर बनिए` → मौजूदा ट्रेनर/फ्रैंचाइज़ पेज; न मिले तो रिपोर्ट)

# फेज़ 7 — `/reviews` और `gallery`
**शर्त: `data/reviews.csv` रिपो में हो. न हो तो यह फेज़ शुरू मत कीजिए.**
1. `/reviews`, कॉपी `copy/reviews.md`. फिल्टर: शहर / साल / नतीजा — सब `reviews.csv` के कॉलम से.
   - हर कार्ड पर लेबल सिर्फ `label` कॉलम से. खाली है तो `वर्कशॉप अनुभव · <शहर> · <साल>`. कोई लेबल अंदाज़े से नहीं.
   - वीडियो: पहले सिर्फ YouTube थंबनेल (`img.youtube.com/vi/<id>/hqdefault.jpg`), क्लिक पर iframe. 40 iframe एक साथ लोड नहीं.
   - रीडायरेक्ट `/testimonials → /reviews` अब चालू करें.
2. `gallery`: मौजूदा 40 फोटो दिखाइए (रिपो में कहाँ हैं, रिपोर्ट कीजिए; न मिलें तो रुकिए). कॉपी `copy/gallery.md`, फिल्टर उसी से. "फोटो आते ही जोड़ी जाती हैं" वाली लाइन हटे.

# फेज़ 8 — बाकी पेज (हर उप-फेज़ अलग कमिट, अलग रिपोर्ट, अलग रुकना)
कॉपी: `copy/en-changes.md` (अंग्रेज़ी पेज), `copy/overthinking.md` (हिंदी).
- **8a `programs/sharp-brain`**: H1; "No blindfolds, no midbrain activation, no magic claims." की जगह नई लाइन; हिंदी ₹2,999 ब्लॉक (बटन → `LINKS.rzpSharpBrain7Day2999`); हिंदी वॉट्सऐप लाइन; अंत में अंग्रेज़ी टेलीपैथी क्रॉस-लिंक. मौजूदा चेकआउट न छुएँ.
- **8b `mentoring/personal-class`**: "Fee depends on the package" हटे → तीन पैकेज. तुलना तालिका न छुएँ.
- **8c `mentoring/overthinking-course`**: H1, उपशीर्षक, ₹999 कार्ड डिफ़ॉल्ट + "सबसे ज़्यादा चुना जाता है" टैग, अंत में क्रॉस-लिंक.
  चेकआउट के बाद वाली स्क्रीन (`LINKS.waGroupOverthinking`) — अगर यह Razorpay कोर लॉजिक बदले बिना नहीं हो सकती, तो मत कीजिए, रिपोर्ट कीजिए.
- **8d `retreats/online-11-day` + `retreats/residential`**: पट्टी, FAQ, अंतिम CTA लाइन `en-changes.md` से. रेसिडेंशियल पर सिर्फ एक तारीख (नवंबर 2026, लोनावला), बाकी तारीखें हटकर "Other dates on WhatsApp". "This Isn't for Everyone" न छुएँ.
  रेसिडेंशियल पर "यह विधि कहाँ से आई" सेक्शन ("Four Things That Only Happen in the Room" के बाद) — सिर्फ तब, जब उसका अंग्रेज़ी संस्करण `copy/` में हो. न हो तो छोड़िए, रिपोर्ट कीजिए.
- **8e `executive-brain-workshop` + `corporate`**: एग्जीक्यूटिव H1 और उपशीर्षक; कॉर्पोरेट की 2 लाइनें.
- **8f `about`**: H1 `My story` और पूरी कहानी `copy/about.md` के अंग्रेज़ी हिस्से से (सन्यास वाली अंतिम पंक्ति समेत, जस की तस).
  पुराना कहानी वाला टेक्स्ट हटे. `en-changes.md` का पुराना About पैराग्राफ ("Measuring things in a lab...") **इस्तेमाल नहीं होगा**.
  पेज के बाकी सेक्शन और फोटो जस के तस. संत का नाम कहीं नहीं.

# फेज़ 9 — SEO और अंतिम जाँच
1. meta title + description `copy/meta.md` से, जस का तस. हिंदी पेज → हिंदी तालिका, अंग्रेज़ी पेज (`/en`, sharp-brain, personal-class, executive, corporate, retreats, about) → अंग्रेज़ी तालिका. जिस पेज की meta न मिले — मौजूदा meta न छुएँ, सूची रिपोर्ट में दीजिए.2. साइटमैप में जोड़िए: `/en`, `/telepathy-workshop/online`, `/vadodara`, `/reviews`. `/courses` हटाइए.
3. hreflang सिर्फ `/` ↔ `/en`: `hi` → `/`, `en` → `/en`, `x-default` → `/`. और कहीं नहीं.
4. हर रीडायरेक्ट `curl -I` से जाँचिए — 301 और सही `Location`.
5. फुटर में Google Business Profile लिंक (`LINKS.googleBusinessProfile`).
6. पूरी साइट में खोज (grep) — नतीजा रिपोर्ट में:
   - `4 शाम` → 0 · `16 घंटे` → 0 · `Date on WhatsApp` / `Venue on WhatsApp` → 0
   - `our team`, `Kapil's team`, `Dr. Kapil's team` → 0
     (सिर्फ "team" शब्द मत खोजिए — "See your team's brain state" सही है.)
   - `[[` → सिर्फ `[[EXEC_DATE]]` और `data/links.ts` के वे मान जो अभी नहीं मिले
   - "4 शहर", "10,000+", "300+" — हर पेज पर यही संख्या, कहीं अलग नहीं
   - "12 साल" / "12 years" — एक भी मिलान टेलीपैथी वर्कशॉप के बारे में नहीं (वहाँ "2017 से")
   - "10,000" — हर मिलान कुल (सब प्रोग्राम) के बारे में हो, किसी में "10,000 ने टेलीपैथी सीखी" जैसा अर्थ न निकले
   - `Measuring things in a lab` → 0 · संत का नाम → 0
7. टूटे लिंक खोजिए, ठीक कीजिए.
8. हर पेज 360px चौड़ाई पर — कोई क्षैतिज स्क्रॉल नहीं.
9. Lighthouse (मोबाइल): कोई पेज 2.5s से धीमा नहीं. धीमे पेजों की सूची.
10. हर पेज पर एक ही प्राइमरी CTA (दो बराबर वाले नहीं).

---

## प्रति-फेज़ रिपोर्ट (इसी रूप में)
```
फेज़: X
कमिट: phase-X: <क्या किया>
Vercel preview: <लिंक>
फ़ाइलें छुईं: ...
हटाया: ...
जोड़ा: ...
नया CSS लिखा: हाँ/नहीं (क्यों)
[[...]] जो बचे / बटन जो अभी वॉट्सऐप पर जा रहे हैं: ...
अनिश्चित / आपको देखना है: ...
अगला कदम: रुका हूँ — फेज़ X+1 के लिए मंज़ूरी चाहिए
```

## स्वीकृति जाँच सूची (मालिक, हर फेज़ पर)
- [ ] Vercel preview लिंक मोबाइल पर खोला
- [ ] कॉपी शब्द-दर-शब्द है, बदली नहीं
- [ ] कोई मौजूदा चीज़ बिना बताए नहीं हटी
- [ ] कोई नई लाइब्रेरी नहीं जुड़ी
- [ ] पुराने URL वही हैं
- [ ] डिज़ाइन नहीं बदला (सिर्फ जहाँ कहा)
- [ ] हर बटन दबाकर देखा — कोई टूटा नहीं
- [ ] ऐप (`app.`) और `habit.` का preview भी खोला — सब पहले जैसा चल रहा है

एक भी खाना खाली → उसी फेज़ पर वापस.

## रोलबैक
- हर फेज़ (और 8a–8f हर उप-फेज़) का अलग कमिट: `phase-N: <क्या किया>`
- कुछ बिगड़े → पिछले कमिट पर लौटिए, आगे न बढ़िए
- आपात स्थिति: tag `pre-rework-2026-11-05` पूरी पुरानी साइट है
- `main` में मर्ज सिर्फ फेज़ 9 के बाद, मालिक की मंज़ूरी से

## फ़ाइल मैप (अनुमानित — फेज़ 0 में पुष्टि)
```
app/page.tsx                              → / (हिंदी)
app/en/page.tsx                           → नया: /en
app/telepathy-workshop/page.tsx
app/telepathy-workshop/online/page.tsx    → नया
app/vadodara/page.tsx                     → नया
app/reviews/page.tsx                      → नया
app/programs/sharp-brain/page.tsx
app/mentoring/overthinking-course/page.tsx
app/mentoring/personal-class/page.tsx
app/retreats/online-11-day/page.tsx
app/retreats/residential/page.tsx
app/executive-brain-workshop/page.tsx
app/corporate/page.tsx
app/about/page.tsx
app/gallery/page.tsx
data/batches.ts                           → नया
data/links.ts                             → नया
data/reviews.csv                          → नया (मालिक भरेगा)
next.config.js                            → रीडायरेक्ट
```

## `copy/` फ़ाइलें जो रिपो में होनी चाहिए
global.md · home-hi.md · home-en.md · telepathy.md · telepathy-online.md · vadodara.md ·
reviews.md · overthinking.md · gallery.md · header-footer.md · tests.md · meta.md · en-changes.md ·
about.md (नई कहानी — हिंदी + अंग्रेज़ी, होमपेज बैंड, टेलीपैथी लाइन, रिट्रीट सेक्शन)

पुरानी `sharp-brain.md`, `personal.md`, `retreats.md`, `executive.md`, `corporate.md` रिपो में नहीं — उनकी जगह `en-changes.md`.

## जो करना मना है
- पोज़ीशनिंग का फैसला बदलना ("शायद ब्रेन कोच ही ठीक है")
- हिंदी कॉपी "सुधारना", या अंग्रेज़ी कॉपी खुद लिखना
- एक फेज़ में तय पेज से ज़्यादा छूना
- मौजूदा फोटो बदलना
- नया डिज़ाइन सिस्टम, नया फ़ॉन्ट, नया रंग
- रिव्यू पर अंदाज़े से नतीजा-लेबल लगाना
- नकली सीट-गिनती या नकली उलटी गिनती
- बिना कहे कोई "सुधार"
