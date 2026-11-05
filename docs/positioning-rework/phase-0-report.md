# फेज़ 0 — रिपोर्ट (सुरक्षा और ढाँचा)

कोई कॉपी नहीं बदली, कोई पेज नहीं बदला. सिर्फ रीडायरेक्ट, `data/` फ़ाइलें और यह सूची.

## 1. Tag और branch
- branch `positioning-rework` पहले से मौजूद थी (main + `BRIEF.md` वाला एक कमिट). उसी पर काम किया.
- tag `pre-rework-2026-11-05` लोकल में `main` (7364746) पर बना, पर **GitHub पर push नहीं हो पाया** (403 — Claude को इस रिपो में tag push की अनुमति नहीं).
  मालिक इसे खुद बना सकते हैं: GitHub → Releases → "Draft a new release" → tag `pre-rework-2026-11-05`, target `main`. या लोकल: `git tag pre-rework-2026-11-05 origin/main && git push origin pre-rework-2026-11-05`.

## 2. रीडायरेक्ट (`src/config/legacyRedirects.ts`, जिसे `next.config.ts` पढ़ता है)
रिपो में `next.config.js` नहीं, `next.config.ts` है; पुराने WordPress रीडायरेक्ट पहले से `legacyRedirects.ts` में थे. वहीं बदला.

| पुराना URL | पहले | अब |
|---|---|---|
| `/telepathy` | `/` | `/telepathy-workshop` |
| `/telepathycourse` | `/` | `/telepathy-workshop` |
| `/telepathy-mind-reading-offline` | (नहीं था, 404) | `/telepathy-workshop` |
| `/about-us-telepathy` | `/` | `/about` |
| `/testimonials` | `/#proof` | **नहीं बदला** — देखिए "अनिश्चित" |
| `/anxiety` | `/mentoring/overthinking-course` | वही (पहले से सही) |
| `/personalclass` | `/mentoring/personal-class` | वही (पहले से सही) |
| `/elementor-landing-page-1483` | `/` | वही (पहले से सही) |
| `/courses` | — | फेज़ 5 में |

dev सर्वर पर `curl` से जाँचा: हर एक 301 और सही `Location`.
ट्रेलिंग स्लैश (`/telepathy/`): पहले Next.js का अपना **308** `/telepathy` पर, फिर हमारा **301**. यानी पकड़ा जाता है, पर दो कदम में. इसे एक कदम का 301 बनाने के लिए `skipTrailingSlashRedirect` या middleware बदलना पड़ेगा — दोनों पूरे ऐप पर असर डालते हैं, इसलिए नहीं किया.

## 3. `data/` फ़ाइलें
- `src/data/links.ts`, `src/data/batches.ts` (+ `src/data/batches.test.ts`).
- पथ `data/` नहीं, `src/data/` रखा — रिपो में सारा कोड `src/` में है (`app/` = `src/app/`) और `@/` alias `src/` पर है. `reviews.csv` भी `src/data/reviews.csv` में रखिए.
- तालिका से भरा. `endDate` बीतने पर (IST, आखिरी दिन के बाद) बैच अपने-आप छिपता है: `upcomingBatch()`, `upcomingBatches()`. `FALLBACK_HI` / `FALLBACK_EN` export हैं.
- `linkOrWhatsApp(key, buttonText)`: `LINKS` का मान `[[...]]` हो तो `waLink(buttonText)` देता है — आगे के फेज़ों के बटन इसी से बनेंगे.
- अभी किसी पेज ने `data/` को इस्तेमाल नहीं किया (वह फेज़ 1 से).

## 4a. `/telepathy-workshop` पर चेकआउट (कोड से)
पेज: `src/app/telepathy-workshop/page.tsx` → `src/features/telepathy-workshop/…`. दाम `src/config/site.config.ts` (`TELEPATHY_WORKSHOP_FEE` = 7,999 → 5,999, जमा 1,000).

| # | लिंक | बटन | रकम |
|---|---|---|---|
| 1 | `https://rzp.io/rzp/elNaxRB` (`TELEPATHY_SEAT_PAYMENT_LINK`, `site.config.ts:59`) | "Book your seat — ₹1,000" / "₹1,000 देकर अपनी seat book करें": नैव CTA, हीरो, हर बैच कार्ड, अंतिम CTA, मोबाइल sticky bar | **₹1,000** (Razorpay के बाद `/telepathy-workshop/booked` पर लौटता है) |
| 2 | `wa.me/919540123161` | "Pay full ₹5,999 now" / "पूरे ₹5,999 अभी दें" — हर बैच कार्ड | ₹5,999 (वॉट्सऐप संदेश, भुगतान नहीं) |
| 3 | `wa.me/919540123161` | "Questions? Chat on WhatsApp" — बैच कार्ड, अंतिम CTA, डेस्कटॉप पर गोल फ्लोटिंग बटन; नैव/फुटर का "Talk to us" | — |
| 4 | `razorpay.me/@mindurmindacademy` | **इस पेज पर नहीं मिला.** कोड में Executive workshop (`site.config.ts:355`) और रिट्रीट (`retreatPaymentLink.ts`) पर है | — |
| 5 | Classplus | **इस पेज पर नहीं मिला.** सिर्फ Overthinking course पर | — |

→ कोड के हिसाब से ₹1,000 वाला लिंक `https://rzp.io/rzp/elNaxRB` है. मालिक पुष्टि करें तो `LINKS.rzpTelepathyDeposit1000` में यही डालेंगे.
→ BRIEF चार चेकआउट (rzp.io, razorpay.me, classplus, WhatsApp) कहता है; `main` के कोड में razorpay.me और classplus इस पेज पर नहीं हैं. लाइव साइट यहाँ से नहीं खुली (नेटवर्क बंद), इसलिए लाइव पेज से मिलान नहीं कर सका.

## 4b. भाषा टॉगल
- टॉगल = `src/components/LanguageToggle.tsx`, सिर्फ `src/components/site/SiteNav.tsx` (और पुराने `PrefrontalPowerNav`) में.
- भाषा की स्थिति `src/context/LanguageContext.tsx` में, जो `src/app/layout.tsx` से **पूरी साइट और ऐप दोनों** को मिलती है. वही localStorage/cookie ऐप की 7-भाषा पसंद भी रखती है. डिफ़ॉल्ट अंग्रेज़ी; हिंदी सिर्फ टॉगल से (या ऐप में हिंदी चुनी हो तो).
- टॉगल इन पेजों पर दिखता है (SiteNav से): `/`, `/telepathy-workshop` (+ `/booked`), `/programs/sharp-brain`, `/reviews`, `/reading-memory-test`, `/mentoring/overthinking-course`, `/mind-assessment`, `/mentoring/personal-class`, `/retreats/online-11-day`, `/retreats/residential`, `/about`, `/gallery`, `/corporate`, `/contact`, `/franchise-individual`, 404 पेज. `/executive-brain-workshop` पर पहले से बंद है.
- टॉगल हटने पर जो हिंदी गायब होगी (आम विज़िटर के लिए):
  - `/` — `src/lib/homeCopy.ts` का पूरा `hi`, `HomeProof`/`HomeUpcoming` के हिंदी लेबल, नैव/फुटर के हिंदी लेबल
  - `/telepathy-workshop` — `telepathyWorkshopCopy.ts` के सारे `hi` (हाँ, `?lang=hi` वाला विज्ञापन लिंक फिर भी हिंदी खोलेगा — middleware + `[lang]` रूट)
  - `/programs/sharp-brain`, `/reviews`, `/reading-memory-test` — `src/lib/sharpBrainCopy.ts` `hi`
  - `/mentoring/overthinking-course`, `/mind-assessment`, `/mentoring/personal-class`, `/retreats/*` — `src/lib/i18n.ts` के हिंदी हिस्से
  - `/about`, `/gallery`, `/corporate`, `/contact`, `/franchise-individual` — `aboutCopy`, `corporateCopy`, `i18n.ts` के हिंदी हिस्से
- ध्यान दें: `homeCopy.ts:181` के FAQ में लिखा है "use the EN / हिंदी switch at the top" — टॉगल हटने पर यह गलत हो जाएगा.
- ध्यान दें: जिस यूज़र ने ऐप में हिंदी चुनी है, उसे टॉगल हटने के बाद भी वेबसाइट हिंदी में दिखेगी (साझा पसंद). `LanguageContext` ऐप से साझा है, उसे नहीं छूना चाहिए.

## 4c. Hardcoded तारीखें (टाइमर समेत)
| फ़ाइल | क्या |
|---|---|
| `src/config/telepathyWorkshopConfig.ts:107-124` | मुंबई 14–15 नवंबर, अहमदाबाद 21–22 नवंबर (ISO); वडोदरा/पुणे `null` |
| `src/config/telepathyWorkshopConfig.ts:51-56` | वॉट्सऐप संदेश "Mumbai, 14–15 Nov 2026", "Ahmedabad, 21–22 Nov 2026", वडोदरा "please share the date and venue" |
| `src/features/telepathy-workshop/telepathyWorkshopCopy.ts:266,272` | कार्ड पर दिखने वाली तारीख "14–15 Nov 2026" / "21–22 Nov 2026" (हिंदी भी) |
| `src/features/telepathy-workshop/components/Countdown.tsx` | **टाइमर** — `TELEPATHY_BATCHES` से अगला बैच (सब बीतने पर क्या दिखता है, फेज़ 5 में देखना है) |
| `src/config/executiveBrainWorkshopConfig.ts:35-39, 65` | 18 अक्टूबर 2026 (बीत चुकी), early bird 11 अक्टूबर; `ExecutiveWorkshopCountdown.tsx` **टाइमर** इसी से |
| `src/config/site.config.ts:347, 360-362` | Executive workshop "18 October 2026" (registry + upcoming events) |
| `src/config/site.config.ts:385` | एक और पुराना event, 27 सितंबर 2026 |
| `src/components/HomeAnnouncementStrip.tsx:16, 57` | 18/19 अक्टूबर 2026 — बीत चुकी, पट्टी अपने-आप छिप चुकी |
| `src/config/retiredPages.ts:7` | `/prefrontal-power-mumbai` 27 सितंबर के बाद redirect |
| `src/lib/i18n.ts:540, 646, 1805, 1911` (+ `ResidentialRoadmap.tsx`) | रिट्रीट: नवंबर 2026 लोनावला, फरवरी/जून/नवंबर 2027 |
| Sharp Brain (`features/sharp-brain-enrol`) | तारीखें कोड में नहीं, डेटाबेस/गणना से — hardcoded नहीं |

## 4d. फ़ाइल मैप — असली पथ
| BRIEF में | असली |
|---|---|
| `app/page.tsx` | `src/app/(marketing)/page.tsx` (सामग्री `src/components/home/*`, `src/lib/homeCopy.ts`) |
| `app/en/page.tsx` | नहीं है — नया बनेगा `src/app/en/page.tsx` |
| `app/telepathy-workshop/page.tsx` | `src/app/telepathy-workshop/page.tsx` → `src/features/telepathy-workshop/*`; `[lang]/page.tsx`, `booked/page.tsx` भी |
| `app/telepathy-workshop/online/page.tsx` | नहीं है. अभी `[lang]` रूट इसे 404 देता है; static `online/page.tsx` उससे ऊपर आएगा |
| `app/vadodara/page.tsx` | नहीं है |
| `app/reviews/page.tsx` | **पहले से है** — Sharp Brain के वीडियो रिव्यू का पेज (`src/app/reviews/page.tsx`) |
| `app/programs/sharp-brain/page.tsx` | `src/app/programs/sharp-brain/page.tsx` |
| `app/mentoring/overthinking-course/page.tsx` | `src/app/mentoring/overthinking-course/page.tsx` |
| `app/mentoring/personal-class/page.tsx` | `src/app/mentoring/personal-class/page.tsx` |
| `app/retreats/online-11-day/page.tsx`, `residential/page.tsx` | `src/app/retreats/…` |
| `app/executive-brain-workshop/page.tsx` | `src/app/executive-brain-workshop/page.tsx` |
| `app/corporate/page.tsx` | `src/app/corporate/page.tsx` (`CorporatePageContent.tsx`, `corporateCopy`) |
| `app/about/page.tsx` | `src/app/about/page.tsx` (`AboutPageContent.tsx`) |
| `app/gallery/page.tsx` | `src/app/gallery/page.tsx` (`GalleryPageContent.tsx`, फोटो सूची `src/config/galleryPhotos.ts`) |
| `/courses` | `src/app/(marketing)/(legacy)/courses/page.tsx` (+ `[slug]`, lessons) |
| `next.config.js` | `next.config.ts` + `src/config/legacyRedirects.ts` |
| `sitemap.xml` | `src/app/sitemap.ts` |
| ट्रेनर/फ्रैंचाइज़ पेज (फेज़ 6) | `src/app/franchise-individual/page.tsx` |
| `data/*` | `src/data/*` |

## 4e. Subdomain routing और साझा कंपोनेंट
- एक ही Next.js deployment तीनों host चलाता है. अलग फ़ोल्डर नहीं — `src/middleware.ts` + `src/lib/domains/appDomain.ts` host के पहले लेबल से तय करते हैं:
  - `habit.` पर `/` → `/welcome/choose-method`; `app.` पर `/` → `/welcome/choose-method`.
  - ऐप के रूट (`/labs/sharp-brain…`, `/memory-studio`, `/preview`…) गलत domain पर हों तो `/dashboard`.
  - `WEBSITE_ONLY_PATHS` (`/telepathy-workshop`, `/booked`) `app.` पर खुलें तो `www` पर भेजे जाते हैं.
  - बाकी सारे वेबसाइट पेज (जैसे `/about`) `app.` और `habit.` पर भी खुलते हैं — रोक नहीं है.
- वेबसाइट और ऐप में साझा: `src/app/layout.tsx` (फ़ॉन्ट, थीम, `LanguageProvider`, Meta Pixel, ConversionTracker), `LanguageContext`, `src/lib/i18n.ts`, `src/config/site.config.ts` (programs, `waLink`, दाम — ऐप के पेज भी पढ़ते हैं), `next.config.ts` (CSP headers, redirects — हर host पर लागू), `src/middleware.ts`, 404 पेज (`not-found.tsx` → `NotFoundContent` → SiteNav + Footer).
- ऐप के पेज SiteNav / Footer / LanguageToggle / WhatsAppWidget **नहीं** इस्तेमाल करते (ऐप का अपना AppSidebar/Topbar है). इसलिए नैव/फुटर बदलने से ऐप पर असर नहीं, सिवाय 404 पेज के.
- आगे के फेज़ों में जिन फ़ाइलों को छूने से ऐप पर असर पड़ सकता है:
  - `src/middleware.ts` — मत छुइए. (नए पेज `/en`, `/vadodara`, `/telepathy-workshop/online`, `/reviews` अपने-आप `WEBSITE_ONLY_PATHS` में नहीं आएँगे, यानी `app.` पर भी खुलेंगे — इसमें जोड़ना है तो middleware छूना होगा → मालिक तय करें.)
  - `src/app/layout.tsx`, `src/context/LanguageContext.tsx`, `src/lib/app-i18n/*` — मत छुइए.
  - `next.config.ts` — redirects ठीक है (हर host पर लागू होंगे); **CSP** बदलना ऐप पर भी लागू होगा. फेज़ 3 का Google Maps iframe (`maps.google.com`) और फेज़ 7 के YouTube iframe/थंबनेल (`youtube.com`, `img.youtube.com`) अभी CSP में नहीं हैं — CSP में केवल `www.google.com`, `youtube-nocookie.com` और `i.ytimg.com` (next/image से) की इजाज़त है. बिना CSP बदले नक्शा/वीडियो नहीं चलेगा.
  - `src/config/site.config.ts`, `src/lib/i18n.ts` — कई जगह साझा; सिर्फ वेबसाइट वाले मान बदलें.
  - `src/components/Footer.tsx`, `src/components/site/SiteNav.tsx` — ऐप पर नहीं, पर 404 पेज पर असर.
  - `src/app/sitemap.ts` — सिर्फ वेबसाइट.

## 5. तथ्य-जाँच — "12 साल", "12 years", "twelve years", "2014 से", "10,000", "10000"

### `copy/`
| फ़ाइल:लाइन | पाठ | किसके बारे में |
|---|---|---|
| `home-hi.md:7` | "2 दिन का लाइव वर्कशॉप, वडोदरा। 12 साल से सिखा रहे हैं, 10,000+ लोग, 300+ वीडियो।" | कुल (नियम वाला वाक्य ही है) — पर उसी वाक्य में वर्कशॉप के ठीक बाद, पढ़ने वाला इसे वर्कशॉप से जोड़ सकता है. **मालिक देखें** |
| `home-hi.md:15` | प्रूफ पट्टी "12 साल · 10,000+ लोग · 300+ वीडियो रिव्यू · 4 शहर" | कुल — पर पट्टी टेलीपैथी वाले हीरो के नीचे है. **मालिक देखें** |
| `home-hi.md:54` | "12 साल में 10,000 लोगों ने यही किया है।" | कुल (विज्ञान/अध्यात्म सेक्शन, सब प्रोग्राम) ✓ |
| `home-en.md:7` | "A 2-day live workshop in Vadodara. 12 years, 10,000+ people, 300+ video reviews." | हिंदी की तरह "teaching" शब्द नहीं — अंग्रेज़ी में यह वर्कशॉप के आंकड़े जैसा पढ़ा जाता है. **मालिक देखें** |
| `home-en.md:14` | Proof strip "12 years · 10,000+ people · 300+ video reviews · 4 cities" | कुल — `home-hi.md:15` जैसा. **मालिक देखें** |
| `home-en.md:52` | "10,000 people have done this over 12 years." | कुल ✓ |
| `about.md:19` | "Twelve years, 10,000 people, 300+ videos later." | कुल ✓ |
| `about.md:37` | "आज 12 साल, 10,000 लोग, 300 से ज़्यादा वीडियो।" | कुल ✓ |
"2014 से" `copy/` में कहीं नहीं.

### मौजूदा कोड (`src/`)
| फ़ाइल:लाइन | पाठ | किसके बारे में |
|---|---|---|
| `features/telepathy-workshop/telepathyWorkshopCopy.ts:20` | meta: "…taught by Dr. Kapil Dev Sharma — to 10,000+ people over 12 years…" | **टेलीपैथी ✗** |
| `…telepathyWorkshopCopy.ts:21` | meta: "…12 साल में 10,000+ लोगों को सिखाई गई…" | **टेलीपैथी ✗** |
| `…telepathyWorkshopCopy.ts:47` | हीरो उपशीर्षक: "…to 10,000+ people over 12 years." | **टेलीपैथी ✗** |
| `…telepathyWorkshopCopy.ts:48` | हीरो उपशीर्षक: "…12 साल में 10,000+ लोगों को सिखाया है।" | **टेलीपैथी ✗** |
| `…telepathyWorkshopCopy.ts:57` | ट्रस्ट पट्टी "12 — years of workshops / साल से वर्कशॉप" | **टेलीपैथी ✗** (खोज-शब्द अलग-अलग लिखे हैं, इसलिए हाथ से पकड़ा) |
| `…telepathyWorkshopCopy.ts:58` | ट्रस्ट पट्टी "10,000+ — people trained / लोग प्रशिक्षित" | **टेलीपैथी ✗** |
| `…telepathyWorkshopCopy.ts:221` | गैलरी शीर्षक "Moments From 12 Years of Workshops / 12 साल की वर्कशॉप की झलकियाँ" | **टेलीपैथी ✗** |
| `…telepathyWorkshopCopy.ts:248` | About: "…has been teaching it for 12 years. In that time, more than 10,000 people have learned Telepathy…" | **टेलीपैथी ✗** |
| `…telepathyWorkshopCopy.ts:249` | About: "…पिछले 12 साल से सिखा रहे हैं। इस दौरान 10,000 से ज़्यादा लोग उनसे Telepathy… सीख चुके हैं" | **टेलीपैथी ✗** |
| `config/site.config.ts:33` (`LEARNERS`) → bio/stats (`:111, 116, 123, 128`) | "10,000+ learners / विद्यार्थी" | कुल ✓ |
| `lib/i18n.ts:313, 392-393, 456, 510, 526, 621` | "Since 2014" (रिट्रीट/मेडिटेशन) | रिट्रीट/कुल ✓ (टेलीपैथी नहीं) |
| `lib/i18n.ts:1578, 1657-1658, 1721, 1775, 1791, 1886` | "2014 से" (रिट्रीट, हिंदी) | रिट्रीट/कुल ✓ |
| `app/retreats/residential/page.tsx:29` | meta "…since 2014…" | रिट्रीट ✓ |
| `components/retreat/RetreatAuthority.tsx:14`, `components/FranchisePageContent.tsx:92`, `app/retreats/online-11-day/page.tsx:44` | कोड-कमेंट (दिखते नहीं) | — |
बाकी "10000" मिलान (migration फ़ाइलों के नाम, गणित के स्थिरांक) सामग्री नहीं हैं.

→ `/telepathy-workshop` पर 9 जगह टेलीपैथी के साथ "12 years/12 साल" या "10,000" है. कुछ नहीं बदला — मालिक तय करें (फेज़ 1 में लागू होगा).

## अनिश्चित / आपको देखना है
1. **`/reviews` पहले से है** (Sharp Brain वीडियो रिव्यू). BRIEF इसे "नया" मानता है. फेज़ 7 में यह पेज बदलेगा/हटेगा — URL वही रहेगा, पर मौजूदा Sharp Brain रिव्यू पेज का क्या होगा, मालिक तय करें. इसी वजह से `/testimonials` अभी भी `/#proof` (होमपेज) पर है, बदला नहीं — BRIEF का "फेज़ 7 तक `/` पर" इससे पूरा होता है.
2. **₹1,000 जमा — सिर्फ वडोदरा या सभी शहर?** BRIEF तालिका में "₹1,000 पर सीट पक्की" सिर्फ वडोदरा पर; पर `copy/telepathy.md` की ₹1,000 वाली लाइन सब शहरों के लिए है, और मौजूदा पेज पर हर शहर ₹1,000 से बुक होता है. `batches.ts` में `depositInr` अभी सिर्फ वडोदरा पर.
3. **होमपेज शहर-लाइन का क्रम:** BRIEF फेज़ 4 में `मुंबई 14–15 · ऑनलाइन 17–19 · अहमदाबाद 21–22 · वडोदरा 28–29`, पर `copy/home-hi.md:13` में `मुंबई 14–15 · अहमदाबाद 21–22 · वडोदरा 28–29 · ऑनलाइन 17–19`. कौन-सा सही?
4. `venueEn` (मुंबई, अहमदाबाद, वडोदरा) `copy/` में नहीं — खाली छोड़ा. (मौजूदा कोड में अंग्रेज़ी पते हैं, जैसे "Hotel Silver Cloud, Ashram Road, Ahmedabad" — इस्तेमाल करें?)
5. `timeHi`: वडोदरा और ऑनलाइन के लिए `copy/` से ("सुबह 9:30 – शाम 6:00", "रात 7:30 – 10:00"); मुंबई/अहमदाबाद के लिए वही समय वडोदरा वाले शब्दों में.
6. चेकआउट: razorpay.me और classplus `/telepathy-workshop` पर कोड में नहीं मिले (ऊपर 4a).
7. tag `pre-rework-2026-11-05` GitHub पर push नहीं हुआ (ऊपर 1).
8. ट्रेलिंग स्लैश वाले पुराने URL: 308 + 301, दो कदम (ऊपर 2).
9. CSP: फेज़ 3 (Maps iframe) और फेज़ 7 (YouTube) के लिए `next.config.ts` का CSP बदलना पड़ेगा, जो ऐप पर भी लागू होता है (ऊपर 4e).
10. नए पेज `app.`/`habit.` पर भी खुलेंगे जब तक middleware में न जोड़ें (ऊपर 4e).
