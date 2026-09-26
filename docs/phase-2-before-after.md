# Site rebuild — Phase 2: before / after

Every visible text changed in Phase 2 (one source of truth: `src/config/site.config.ts`). Generated from the edit log; each row was an asserted, exact replacement.

- **Names:** Quantum Speed Reading — 30-Day Live Program · 7-Day Free Focus & Reading Starter (in-app: 21-Day Focus & Reading Program) · 21-Day Overthinking Reset · 1-on-1 Mind Coaching with Dr. Kapil · 11-Day Online Deep Meditation Retreat · Residential Meditation Retreats — Lonavala & Rishikesh · Mind Ur Mind App
- **Trainer:** every bio/stat/photo now renders through `<TrainerBio variant="short|long" />`.

Total logged changes: 384.

## 1. Meta titles, descriptions, OG images, JSON-LD

| File | Before | After |
|---|---|---|
| `app/retreats/residential/opengraph-image.tsx:3` | og:image alt: Residential Retreats — Lonavala & Rishikesh | og:image alt: Residential Meditation Retreats — Lonavala & Rishikesh |
| `app/retreats/residential/opengraph-image.tsx:10` | OG image heading: Residential Retreats — Lonavala & Rishikesh | OG image heading: Residential Meditation Retreats — Lonavala & Rishikesh |
| `app/retreats/online-11-day/opengraph-image.tsx:3` | og:image alt: 11-Day Online Meditation & Inner Mastery Retreat | og:image alt: 11-Day Online Deep Meditation Retreat |
| `app/retreats/online-11-day/opengraph-image.tsx:10` | OG image heading: 11-Day Online Meditation Retreat | OG image heading: 11-Day Online Deep Meditation Retreat |
| `app/programs/habit-builder/opengraph-image.tsx:3` | og:image alt: Quantum Mindset & Habit Builder | og:image alt: 7-Day Free Focus & Reading Starter |
| `app/programs/habit-builder/opengraph-image.tsx:10` | OG image heading: Quantum Mindset & Habit Builder — 21 Days | OG image heading: 7-Day Free Focus & Reading Starter |
| `app/mentoring/personal-class/opengraph-image.tsx:3` | og:image alt: Personal Class — 1-on-1 Mentoring | og:image alt: 1-on-1 Mind Coaching with Dr. Kapil |
| `app/mentoring/personal-class/opengraph-image.tsx:10` | OG image heading: Personal Class — 1-on-1 Mentoring | OG image heading: 1-on-1 Mind Coaching with Dr. Kapil |
| `app/mentoring/overthinking-course/opengraph-image.tsx:3` | og:image alt: The 21-Day Mind Reset System | og:image alt: 21-Day Overthinking Reset |
| `app/mentoring/overthinking-course/opengraph-image.tsx:10` | OG image heading: The 21-Day Mind Reset System | OG image heading: 21-Day Overthinking Reset |
| `app/programs/quantum-speed-reading/opengraph-image.tsx:3` | og:image alt: Quantum Speed Reading | og:image alt: Quantum Speed Reading — 30-Day Live Program |
| `app/programs/quantum-speed-reading/opengraph-image.tsx:10` | OG image heading: Quantum Speed Reading | OG image heading: Quantum Speed Reading — 30-Day Live Program |
| `app/programs/quantum-speed-reading/page.tsx:40` | <title> Quantum Speed Reading — Science-Backed Neuro-Cognitive Masterclass \| Dr. Kapil Dev Sharma | <title> Quantum Speed Reading — 30-Day Live Program \| Dr. Kapil Dev Sharma |
| `app/programs/quantum-speed-reading/page.tsx:102` | Course JSON-LD name: Quantum Speed Reading — 30-Day Masterclass | Course JSON-LD name: Quantum Speed Reading — 30-Day Live Program |
| `app/programs/habit-builder/page.tsx:18` | <title> Quantum Mindset & Habit Builder™ — 21-Day Program \| Mind Ur Mind | <title> 7-Day Free Focus & Reading Starter \| Mind Ur Mind |
| `app/mentoring/overthinking-course/page.tsx:28` | <title> The 21-Day Mind Reset System — Overthinking & Mental Clarity \| Dr. Kapil Dev Sharma | <title> 21-Day Overthinking Reset — Build Mental Clarity \| Dr. Kapil Dev Sharma |
| `app/mentoring/overthinking-course/page.tsx:78` | Course JSON-LD name: The 21-Day Mind Reset System | Course JSON-LD name: 21-Day Overthinking Reset |
| `app/mentoring/personal-class/page.tsx:22` | <title> Personal Class — 1-on-1 Intensive Mentoring — Dr. Kapil Dev Sharma | <title> 1-on-1 Mind Coaching with Dr. Kapil \| Mind Ur Mind |
| `app/retreats/online-11-day/page.tsx:27` | <title> 11-Day Online Meditation & Inner Mastery Retreat — Dr. Kapil Dev Sharma | <title> 11-Day Online Deep Meditation Retreat — Dr. Kapil Dev Sharma |
| `app/retreats/online-11-day/page.tsx:60` | Course JSON-LD name: 11-Day Online Meditation & Inner Mastery Retreat | Course JSON-LD name: 11-Day Online Deep Meditation Retreat |
| `app/retreats/residential/page.tsx:26` | <title> Residential Retreats — Lonavala & Rishikesh — Dr. Kapil Dev Sharma | <title> Residential Meditation Retreats — Lonavala & Rishikesh \| Dr. Kapil Dev Sharma |
| `lib/seo/personSchema.ts:13` | Person JSON-LD description: Brain, mind and meditation coach with 26 years in education and mind training. Founder of Mind Ur Mind (2014) and Quantum Speed Reading trainer since 2015. | Person JSON-LD description: 26 years in education and mind training · Quantum Speed Reading trainer since 2015 · 10,000+ learners · 500+ workshops (trainer.shortBio) |
| `lib/seo/personSchema.ts:17` | Person JSON-LD image: /founder-warm.jpg | Person JSON-LD image: /assets/dr-kapil-dev-sharma-executive.jpg |
| `lib/seo/personSchema.ts:20` | Person worksFor: 'Mind Ur Mind' (literal) | Person worksFor: brand.name |
| `lib/seo/organizationSchema.ts:13` | Organization name literal | brand.name |
| `lib/seo/organizationSchema.ts:15` | Organization JSON-LD logo: /founder-warm.jpg | Organization JSON-LD logo: /assets/dr-kapil-dev-sharma-executive.jpg |
| `lib/seo/organizationSchema.ts:16` | foundingDate literal '2014' | brand.foundedYear |
| `lib/seo/organizationSchema.ts:19` | founder name literal | trainer.name |
| `lib/seo/ogImage.tsx:13` | OG images (all pages) photo: founder-warm.jpg | OG images (all pages) photo: master /assets/dr-kapil-dev-sharma-executive.jpg |
| `app/opengraph-image.tsx:11` | Default OG eyebrow literal | brand.name |
| `app/opengraph-image.tsx:12` | Default OG heading literal 'Brain, Mind & Meditation Coach' | brand.positioning (same text) |
| `app/(marketing)/(legacy)/pricing/page.tsx:8` | /pricing (noindex) meta description: …subscription plans for the Quantum Mind app. | /pricing (noindex) meta description: …subscription plans for the Mind Ur Mind App. |
| `app/about/page.tsx:11` | (same text — your approved meta description) | numbers/names now read from site.config |
| `app/(marketing)/page.tsx:34` | (same text — your approved meta description) | numbers/names now read from site.config |
| `app/mentoring/personal-class/page.tsx:25` | (same text — kept as you asked) | number/name now read from site.config |

## 2. Trainer bio, stats and photo → <TrainerBio />

| File | Before | After |
|---|---|---|
| `features/executive-brain-workshop/components/ExecutiveWorkshopHero.tsx` | Hero photo caption: Dr. Kapil Dev Sharma · Mind Trainer & Life Coach · 20+ years | Hero photo caption: Dr. Kapil Dev Sharma · Brain, Mind & Meditation Coach · 26 years |
| `features/executive-brain-workshop/components/ExecutiveWorkshopTrainer.tsx` | About the Trainer: "Founder, Mind Ur Mind · Mind Trainer & Life Coach" + hand-written bio ("…over two decades of experience — 26 years in total… He is the creator of the Quantum Speed Reading programme, running since 2015…") + stats 10,000+ Students Guided / 500+ Workshops Delivered / 26 Years Experience; photo founder-warm.jpg | <TrainerBio variant="long" tone="light"> — title "Brain, Mind & Meditation Coach", longBio from site.config, stats 26 / 10,000+ Learners / 500+ Workshops / 2014 founded; master photo |
| `components/prefrontal-power/PrefrontalPowerTrainer.tsx` | Meet Your Trainer: "Dr. Kapil Sharma" · "Mind Trainer & Life Coach · 26 Years Experience" · "Over two decades of experience in mind training, meditation and human potential — turning what he's learned into a single, practical day."; photo dr-kapil-learning.png | <TrainerBio variant="long"> — "Dr. Kapil Dev Sharma", "Brain, Mind & Meditation Coach", longBio + stats from site.config; master photo |
| `components/HomeGuideSection.tsx` | Homepage guide card: credential "Professor · Researcher · Life Coach · 26 Years Experience", i18n bio, stats 26 Years Total / 15 Years Professor / 11 Years Coaching | <TrainerBio variant="long"> — title "Brain, Mind & Meditation Coach", longBio, stats 26 / 10,000+ / 500+ / 2014; master photo |
| `components/AboutPageContent.tsx` | About founder card (same credential/bio/3 stats as above) + a separate stats grid 10,000+ Students Guided / 500+ Workshops Delivered / 2014 Founded | <TrainerBio variant="long"> (stats shown once, from site.config); duplicate stats grid removed |
| `components/mentoring/MentoringGuide.tsx` | Personal Class guide card (same credential/bio/3 stats); photo dr-kapil-mentor.png | <TrainerBio variant="long" accent="rose">; master photo |
| `components/mind-reset/MindResetGuide.tsx` | Overthinking course guide card (same credential/bio/3 stats); photo founder-warm.jpg | <TrainerBio variant="long" accent="rose">; master photo |
| `components/mentoring/MentoringHero.tsx` | Hero guide card: "Dr. Kapil Dev Sharma" · "Professor · Researcher · Life Coach · 26 Years"; photo founder-warm.jpg | <TrainerBio variant="short"> — "Brain, Mind & Meditation Coach" + shortBio "26 years in education and mind training · Quantum Speed Reading trainer since 2015 · 10,000+ learners · 500+ workshops"; master photo |
| `components/qsr/QsrAuthority.tsx` | 4 credential cards: "English Professor (15+ Years Experience)", "India's First QSR Pioneer (Since 2015) — Introduced Quantum Speed Reading to India…", "10,000+ Students Guided", "500+ Workshops Delivered"; intro "Not a licensed instructor teaching someone else's system — the person who introduced it." | <TrainerBio variant="long"> — longBio ("…one of the first trainers to teach Quantum Speed Reading in India, since 2015, and has developed his own structured 30-day method.") + stats |
| `components/HeroSection.tsx` | Homepage hero photo: /images/dr-kapil-founder-hero.png (1.9 MB PNG, same image as master) | trainer.photo.src → /assets/dr-kapil-dev-sharma-executive.jpg (171 KB) |
| `components/GuideProfileCard.tsx` | Shared GuideProfileCard (bio/stats/photo passed in by each page) | Deleted — replaced everywhere by TrainerBio |

## 3. Page copy (src/lib/i18n.ts — English and Hindi)

| File | Before | After |
|---|---|---|
| `lib/i18n.ts:44` | masterclassDesc: "The full 30-day curriculum, 7 live sessions with Dr. Sharma, and app access throughout — one-time.", | masterclassDesc: "The full 30-day curriculum, 7 live sessions with Dr. Kapil Dev Sharma, and app access throughout — one-time.", |
| `lib/i18n.ts:77` | "7 live masterclass sessions with Dr. Sharma", | "7 live masterclass sessions with Dr. Kapil Dev Sharma", |
| `lib/i18n.ts:98` | desc: "An intensive, live, 11-day journey through meditation and inner mastery disciplines — guided daily by Dr. Sharma.", | desc: "An intensive, live, 11-day journey through meditation and inner mastery disciplines — guided daily by Dr. Kapil Dev Sharma.", |
| `lib/i18n.ts:133` | desc: "Direct, private mentoring with Dr. Sharma, fully customized — for life stress and spiritual breakthroughs, not a replacement for therapy.", | desc: "Direct, private mentoring with Dr. Kapil Dev Sharma, fully customized — for life stress and spiritual breakthroughs, not a replacement for therapy.", |
| `lib/i18n.ts:729` | "Yes. Every program starts from zero. Quantum Speed Reading assumes no prior skill — Dr. Sharma has guided 10,000+ students from complete beginners to advanced practitioners since 2014.", | "Yes. Every program starts from zero. Quantum Speed Reading assumes no prior skill — Dr. Kapil Dev Sharma has guided 10,000+ students from complete beginners to advanced practitioners since 2014.", |
| `lib/i18n.ts:739` | "The 30-Day Quantum Speed Reading Live Masterclass is ₹9,999, one-time — the full curriculum, 7 live sessions with Dr. Sharma, and app access throughout, backed by our 100% Results Guarantee for online students. We don't offer free access to the program itself, but you can watch the free training video or take our free 2-minute Reading Speed Test first. Graduates who want continued app practice afterward can continue for ₹499/month.", | "The 30-Day Quantum Speed Reading Live Masterclass is ₹9,999, one-time — the full curriculum, 7 live sessions with Dr. Kapil Dev Sharma, and app access throughout, backed by our 100% Results Guarantee for online students. We don't offer free access to the program itself, but you can watch the free training video or take our free 2-minute Reading Speed Test first. Graduates who want continued app practice afterward can continue for ₹499/month.", |
| `lib/i18n.ts:778` | "Personal Class is private, custom-paced mentoring directly with Dr. Sharma — sessions are built entirely around your own goals and challenges, not a fixed curriculum. Apply to discuss fit and scheduling.", | "Personal Class is private, custom-paced mentoring directly with Dr. Kapil Dev Sharma — sessions are built entirely around your own goals and challenges, not a fixed curriculum. Apply to discuss fit and scheduling.", |
| `lib/i18n.ts:1192` | tag: "Weekly · Live with Dr. Sharma", | tag: "Weekly · Live with Dr. Kapil Dev Sharma", |
| `lib/i18n.ts:1194` | desc: "Interactive sessions across the 30 days where Dr. Sharma personally walks you through the technique in real time.", | desc: "Interactive sessions across the 30 days where Dr. Kapil Dev Sharma personally walks you through the technique in real time.", |
| `lib/i18n.ts:1351` | "No. The 30-day structure assumes zero prior skill and starts from your true baseline — Dr. Sharma has guided 10,000+ students through it since 2014, most of them starting as complete beginners.", | "No. The 30-day structure assumes zero prior skill and starts from your true baseline — Dr. Kapil Dev Sharma has guided 10,000+ students through it since 2014, most of them starting as complete beginners.", |
| `lib/i18n.ts:1356` | "About 10 minutes a day inside the app, plus one live masterclass session a week with Dr. Sharma. It's designed to fit around a full-time job or study schedule, not compete with it.", | "About 10 minutes a day inside the app, plus one live masterclass session a week with Dr. Kapil Dev Sharma. It's designed to fit around a full-time job or study schedule, not compete with it.", |
| `lib/i18n.ts:1366` | "The Masterclass itself is a fully paid, result-oriented program — ₹9,999 one-time for the full 30-day curriculum, all 7 live sessions with Dr. Sharma, and app access throughout. We don't offer free access to the program, because neither the app alone nor the live sessions alone deliver the result — they're built to work together. What is free: our 2-minute Reading Speed Test, and our free 45-minute live intro session with Dr. Sharma — see below.", | "The Masterclass itself is a fully paid, result-oriented program — ₹9,999 one-time for the full 30-day curriculum, all 7 live sessions with Dr. Kapil Dev Sharma, and app access throughout. We don't offer free access to the program, because neither the app alone nor the live sessions alone deliver the result — they're built to work together. What is free: our 2-minute Reading Speed Test, and our free 45-minute live intro session with Dr. Kapil Dev Sharma — see below.", |
| `lib/i18n.ts:1371` | "The full 30-day progressive app curriculum, all 7 live masterclass sessions with Dr. Sharma, WPM & comprehension tracking throughout, and app access for the full 30 days — a one-time enrollment, not a subscription. Once you finish the program, continued app practice is a separate ₹499/month option if you want it.", | "The full 30-day progressive app curriculum, all 7 live masterclass sessions with Dr. Kapil Dev Sharma, WPM & comprehension tracking throughout, and app access for the full 30 days — a one-time enrollment, not a subscription. Once you finish the program, continued app practice is a separate ₹499/month option if you want it.", |
| `lib/i18n.ts:1732` | desc: "Each night builds on the last, guided live by Dr. Sharma — never a theory you read about, always a practice you feel.", | desc: "Each night builds on the last, guided live by Dr. Kapil Dev Sharma — never a theory you read about, always a practice you feel.", |
| `lib/i18n.ts:1775` | desc: "Every batch is kept deliberately small so Dr. Sharma can actually guide you, not lecture at a crowd.", | desc: "Every batch is kept deliberately small so Dr. Kapil Dev Sharma can actually guide you, not lecture at a crowd.", |
| `lib/i18n.ts:1779` | desc: "Not pre-recorded, not delegated to an assistant instructor — Dr. Sharma, live, all 11 nights.", | desc: "Not pre-recorded, not delegated to an assistant instructor — Dr. Kapil Dev Sharma, live, all 11 nights.", |
| `lib/i18n.ts:1786` | desc: "Every one of the 11 nights, 7:30 PM to 10:30 PM, you're live with Dr. Sharma — not a video library you work through whenever it's convenient.", | desc: "Every one of the 11 nights, 7:30 PM to 10:30 PM, you're live with Dr. Kapil Dev Sharma — not a video library you work through whenever it's convenient.", |
| `lib/i18n.ts:1790` | desc: "A live guided session with Dr. Sharma every night of the retreat, 7:30 PM – 10:30 PM — real-time, not pre-recorded.", | desc: "A live guided session with Dr. Kapil Dev Sharma every night of the retreat, 7:30 PM – 10:30 PM — real-time, not pre-recorded.", |
| `lib/i18n.ts:1798` | desc: "Questions answered directly by Dr. Sharma during the retreat, not routed through a support ticket.", | desc: "Questions answered directly by Dr. Kapil Dev Sharma during the retreat, not routed through a support ticket.", |
| `lib/i18n.ts:1841` | "No particular belief system or prior experience is required. Kriya Yoga builds up gradually across the 11 nights — you bring your own openness, Dr. Sharma guides the method, step by step.", | "No particular belief system or prior experience is required. Kriya Yoga builds up gradually across the 11 nights — you bring your own openness, Dr. Kapil Dev Sharma guides the method, step by step.", |
| `lib/i18n.ts:1846` | "Every technique is taught step by step, live, with Dr. Sharma guiding the pace each night. That said, these are intensive practices — for a small number of people, deep meditative or energy-focused work can surface strong emotional experiences. We ask participants to share any relevant mental health history before the retreat, so pacing can be adjusted accordingly. This retreat is a personal and spiritual practice, not a substitute for licensed therapy or psychiatric care — if you're currently in treatment for a mental health condition, please consult your provider before joining.", | "Every technique is taught step by step, live, with Dr. Kapil Dev Sharma guiding the pace each night. That said, these are intensive practices — for a small number of people, deep meditative or energy-focused work can surface strong emotional experiences. We ask participants to share any relevant mental health history before the retreat, so pacing can be adjusted accordingly. This retreat is a personal and spiritual practice, not a substitute for licensed therapy or psychiatric care — if you're currently in treatment for a mental health condition, please consult your provider before joining.", |
| `lib/i18n.ts:1856` | "Each day includes a live session with Dr. Sharma from 7:30 PM to 10:30 PM, plus guided practice — the same window every day of the 11-day batch.", | "Each day includes a live session with Dr. Kapil Dev Sharma from 7:30 PM to 10:30 PM, plus guided practice — the same window every day of the 11-day batch.", |
| `lib/i18n.ts:2090` | "Every technique is taught step by step, under direct in-person supervision. That said, these are intensive practices — for a small number of people, deep meditative or energy-focused work can surface strong emotional experiences. We ask participants to share any relevant mental health history before the retreat, so Dr. Sharma can adjust pacing accordingly. This retreat is a personal and spiritual practice, not a substitute for licensed therapy or psychiatric care — if you're currently in treatment for a mental health condition, please consult your provider before joining.", | "Every technique is taught step by step, under direct in-person supervision. That said, these are intensive practices — for a small number of people, deep meditative or energy-focused work can surface strong emotional experiences. We ask participants to share any relevant mental health history before the retreat, so Dr. Kapil Dev Sharma can adjust pacing accordingly. This retreat is a personal and spiritual practice, not a substitute for licensed therapy or psychiatric care — if you're currently in treatment for a mental health condition, please consult your provider before joining.", |
| `lib/i18n.ts:2270` | "That's exactly what the short conversation step is for. You don't need a clear diagnosis before applying — just a sense of what's not working. Dr. Sharma helps identify the actual focus area during that first exchange, before any plan is proposed.", | "That's exactly what the short conversation step is for. You don't need a clear diagnosis before applying — just a sense of what's not working. Dr. Kapil Dev Sharma helps identify the actual focus area during that first exchange, before any plan is proposed.", |
| `lib/i18n.ts:2695` | masterclassDesc: "पूरा 30-दिवसीय पाठ्यक्रम, डॉ. शर्मा के साथ 7 लाइव सेशन, और पूरे समय ऐप एक्सेस — एकमुश्त।", | masterclassDesc: "पूरा 30-दिवसीय पाठ्यक्रम, डॉ. कपिल देव शर्मा के साथ 7 लाइव सेशन, और पूरे समय ऐप एक्सेस — एकमुश्त।", |
| `lib/i18n.ts:2728` | "डॉ. शर्मा के साथ 7 लाइव मास्टरक्लास सत्र", | "डॉ. कपिल देव शर्मा के साथ 7 लाइव मास्टरक्लास सत्र", |
| `lib/i18n.ts:2749` | desc: "ध्यान और आंतरिक मास्टरी के मुख्य अनुशासनों के माध्यम से एक गहन, लाइव, 11-दिवसीय यात्रा — प्रतिदिन डॉ. शर्मा द्वारा मार्गदर्शित।", | desc: "ध्यान और आंतरिक मास्टरी के मुख्य अनुशासनों के माध्यम से एक गहन, लाइव, 11-दिवसीय यात्रा — प्रतिदिन डॉ. कपिल देव शर्मा द्वारा मार्गदर्शित।", |
| `lib/i18n.ts:2784` | desc: "डॉ. शर्मा के साथ सीधा, निजी मार्गदर्शन, पूरी तरह कस्टमाइज़्ड — जीवन के तनाव और आध्यात्मिक सफलताओं के लिए, थेरेपी का विकल्प नहीं।", | desc: "डॉ. कपिल देव शर्मा के साथ सीधा, निजी मार्गदर्शन, पूरी तरह कस्टमाइज़्ड — जीवन के तनाव और आध्यात्मिक सफलताओं के लिए, थेरेपी का विकल्प नहीं।", |
| `lib/i18n.ts:3332` | "हां, बिल्कुल। हर कार्यक्रम शून्य से शुरू होता है। क्वांटम स्पीड रीडिंग में किसी पूर्व कौशल की ज़रूरत नहीं — डॉ. शर्मा ने 2014 से अब तक 10,000+ विद्यार्थियों को पूर्ण शुरुआती से उन्नत अभ्यासी तक मार्गदर्शन दिया है।", | "हां, बिल्कुल। हर कार्यक्रम शून्य से शुरू होता है। क्वांटम स्पीड रीडिंग में किसी पूर्व कौशल की ज़रूरत नहीं — डॉ. कपिल देव शर्मा ने 2014 से अब तक 10,000+ विद्यार्थियों को पूर्ण शुरुआती से उन्नत अभ्यासी तक मार्गदर्शन दिया है।", |
| `lib/i18n.ts:3342` | "30-दिवसीय क्वांटम स्पीड रीडिंग लाइव मास्टरक्लास की कीमत ₹9,999 है, एकमुश्त — पूरा पाठ्यक्रम, डॉ. शर्मा के साथ 7 लाइव सेशन, और पूरे समय ऐप एक्सेस, ऑनलाइन विद्यार्थियों के लिए हमारी 100% रिज़ल्ट गारंटी के साथ। हम प्रोग्राम का मुफ़्त एक्सेस नहीं देते, लेकिन आप पहले फ्री ट्रेनिंग वीडियो देख सकते हैं या हमारा मुफ़्त 2-मिनट स्पीड टेस्ट आज़मा सकते हैं। जो ग्रेजुएट्स बाद में भी ऐप अभ्यास जारी रखना चाहते हैं, वे ₹499/माह में जारी रख सकते हैं।", | "30-दिवसीय क्वांटम स्पीड रीडिंग लाइव मास्टरक्लास की कीमत ₹9,999 है, एकमुश्त — पूरा पाठ्यक्रम, डॉ. कपिल देव शर्मा के साथ 7 लाइव सेशन, और पूरे समय ऐप एक्सेस, ऑनलाइन विद्यार्थियों के लिए हमारी 100% रिज़ल्ट गारंटी के साथ। हम प्रोग्राम का मुफ़्त एक्सेस नहीं देते, लेकिन आप पहले फ्री ट्रेनिंग वीडियो देख सकते हैं या हमारा मुफ़्त 2-मिनट स्पीड टेस्ट आज़मा सकते हैं। जो ग्रेजुएट्स बाद में भी ऐप अभ्यास जारी रखना चाहते हैं, वे ₹499/माह में जारी रख सकते हैं।", |
| `lib/i18n.ts:3386` | "पर्सनल क्लास डॉ. शर्मा के साथ सीधे, निजी, कस्टम-पेस्ड मेंटरिंग है — सेशन पूरी तरह आपके अपने लक्ष्यों और चुनौतियों के आसपास बनाए जाते हैं, किसी फिक्स्ड कर्रिकुलम पर नहीं। फिट और शेड्यूलिंग पर चर्चा के लिए आवेदन करें।", | "पर्सनल क्लास डॉ. कपिल देव शर्मा के साथ सीधे, निजी, कस्टम-पेस्ड मेंटरिंग है — सेशन पूरी तरह आपके अपने लक्ष्यों और चुनौतियों के आसपास बनाए जाते हैं, किसी फिक्स्ड कर्रिकुलम पर नहीं। फिट और शेड्यूलिंग पर चर्चा के लिए आवेदन करें।", |
| `lib/i18n.ts:3737` | tag: "साप्ताहिक · डॉ. शर्मा के साथ लाइव", | tag: "साप्ताहिक · डॉ. कपिल देव शर्मा के साथ लाइव", |
| `lib/i18n.ts:3739` | desc: "30 दिनों में फैले इंटरैक्टिव सत्र, जहां डॉ. शर्मा व्यक्तिगत रूप से रीयल-टाइम में आपको तकनीक सिखाते हैं।", | desc: "30 दिनों में फैले इंटरैक्टिव सत्र, जहां डॉ. कपिल देव शर्मा व्यक्तिगत रूप से रीयल-टाइम में आपको तकनीक सिखाते हैं।", |
| `lib/i18n.ts:3870` | "नहीं। 30-दिवसीय संरचना यह मानकर चलती है कि आपको कोई पूर्व कौशल नहीं है और आपकी असली शुरुआत से आरंभ होती है — डॉ. शर्मा ने 2014 से अब तक 10,000+ विद्यार्थियों को इसमें मार्गदर्शन दिया है, जिनमें अधिकांश पूर्ण शुरुआती थे।", | "नहीं। 30-दिवसीय संरचना यह मानकर चलती है कि आपको कोई पूर्व कौशल नहीं है और आपकी असली शुरुआत से आरंभ होती है — डॉ. कपिल देव शर्मा ने 2014 से अब तक 10,000+ विद्यार्थियों को इसमें मार्गदर्शन दिया है, जिनमें अधिकांश पूर्ण शुरुआती थे।", |
| `lib/i18n.ts:3875` | "ऐप में लगभग 10 मिनट प्रतिदिन, साथ ही डॉ. शर्मा के साथ सप्ताह में एक लाइव मास्टरक्लास सत्र। यह पूर्णकालिक नौकरी या पढ़ाई के शेड्यूल के साथ फिट होने के लिए बनाया गया है, उससे टकराने के लिए नहीं।", | "ऐप में लगभग 10 मिनट प्रतिदिन, साथ ही डॉ. कपिल देव शर्मा के साथ सप्ताह में एक लाइव मास्टरक्लास सत्र। यह पूर्णकालिक नौकरी या पढ़ाई के शेड्यूल के साथ फिट होने के लिए बनाया गया है, उससे टकराने के लिए नहीं।", |
| `lib/i18n.ts:3885` | "मास्टरक्लास खुद एक पूरी तरह से भुगतान वाला, परिणाम-उन्मुख प्रोग्राम है — ₹9,999 एकमुश्त में पूरा 30-दिवसीय पाठ्यक्रम, डॉ. शर्मा के साथ सभी 7 लाइव सेशन, और पूरे समय ऐप एक्सेस मिलता है। हम प्रोग्राम का मुफ़्त एक्सेस नहीं देते, क्योंकि न तो अकेले ऐप और न ही अकेले लाइव सेशन पूरा परिणाम देते हैं — दोनों एक साथ काम करने के लिए बनाए गए हैं। जो मुफ़्त है: हमारा 2-मिनट रीडिंग स्पीड टेस्ट, और डॉ. शर्मा के साथ हमारा मुफ़्त 45-मिनट लाइव इंट्रो सेशन — नीचे देखें।", | "मास्टरक्लास खुद एक पूरी तरह से भुगतान वाला, परिणाम-उन्मुख प्रोग्राम है — ₹9,999 एकमुश्त में पूरा 30-दिवसीय पाठ्यक्रम, डॉ. कपिल देव शर्मा के साथ सभी 7 लाइव सेशन, और पूरे समय ऐप एक्सेस मिलता है। हम प्रोग्राम का मुफ़्त एक्सेस नहीं देते, क्योंकि न तो अकेले ऐप और न ही अकेले लाइव सेशन पूरा परिणाम देते हैं — दोनों एक साथ काम करने के लिए बनाए गए हैं। जो मुफ़्त है: हमारा 2-मिनट रीडिंग स्पीड टेस्ट, और डॉ. कपिल देव शर्मा के साथ हमारा मुफ़्त 45-मिनट लाइव इंट्रो सेशन — नीचे देखें।", |
| `lib/i18n.ts:3890` | "पूरा 30-दिवसीय प्रगतिशील ऐप पाठ्यक्रम, डॉ. शर्मा के साथ सभी 7 लाइव मास्टरक्लास सत्र, पूरे समय WPM व समझ की ट्रैकिंग, और पूरे 30 दिनों का ऐप एक्सेस — एक एकमुश्त नामांकन, कोई सब्सक्रिप्शन नहीं। प्रोग्राम पूरा करने के बाद, निरंतर ऐप अभ्यास एक अलग ₹499/माह विकल्प है, अगर आप चाहें।", | "पूरा 30-दिवसीय प्रगतिशील ऐप पाठ्यक्रम, डॉ. कपिल देव शर्मा के साथ सभी 7 लाइव मास्टरक्लास सत्र, पूरे समय WPM व समझ की ट्रैकिंग, और पूरे 30 दिनों का ऐप एक्सेस — एक एकमुश्त नामांकन, कोई सब्सक्रिप्शन नहीं। प्रोग्राम पूरा करने के बाद, निरंतर ऐप अभ्यास एक अलग ₹499/माह विकल्प है, अगर आप चाहें।", |
| `lib/i18n.ts:4227` | desc: "हर रात पिछली रात पर आधारित होती है, डॉ. शर्मा द्वारा लाइव मार्गदर्शित — कभी कोई सिद्धांत नहीं जिसे आप सिर्फ पढ़ें, हमेशा एक अभ्यास जिसे आप महसूस करें।", | desc: "हर रात पिछली रात पर आधारित होती है, डॉ. कपिल देव शर्मा द्वारा लाइव मार्गदर्शित — कभी कोई सिद्धांत नहीं जिसे आप सिर्फ पढ़ें, हमेशा एक अभ्यास जिसे आप महसूस करें।", |
| `lib/i18n.ts:4270` | desc: "हर बैच जानबूझकर छोटा रखा जाता है ताकि डॉ. शर्मा वास्तव में आपका मार्गदर्शन कर सकें, किसी भीड़ को भाषण न दे रहे हों।", | desc: "हर बैच जानबूझकर छोटा रखा जाता है ताकि डॉ. कपिल देव शर्मा वास्तव में आपका मार्गदर्शन कर सकें, किसी भीड़ को भाषण न दे रहे हों।", |
| `lib/i18n.ts:4274` | desc: "कोई पहले से रिकॉर्ड नहीं, किसी सहायक प्रशिक्षक को नहीं सौंपा गया — डॉ. शर्मा, लाइव, सभी 11 रातें।", | desc: "कोई पहले से रिकॉर्ड नहीं, किसी सहायक प्रशिक्षक को नहीं सौंपा गया — डॉ. कपिल देव शर्मा, लाइव, सभी 11 रातें।", |
| `lib/i18n.ts:4281` | desc: "11 में से हर रात, शाम 7:30 से रात 10:30 तक, आप डॉ. शर्मा के साथ लाइव होते हैं — कोई वीडियो लाइब्रेरी नहीं जिसे आप जब सुविधाजनक हो तब पूरा करें।", | desc: "11 में से हर रात, शाम 7:30 से रात 10:30 तक, आप डॉ. कपिल देव शर्मा के साथ लाइव होते हैं — कोई वीडियो लाइब्रेरी नहीं जिसे आप जब सुविधाजनक हो तब पूरा करें।", |
| `lib/i18n.ts:4285` | desc: "रिट्रीट की हर रात डॉ. शर्मा के साथ एक लाइव मार्गदर्शित सत्र, शाम 7:30 – रात 10:30 — रीयल-टाइम में, पहले से रिकॉर्ड नहीं।", | desc: "रिट्रीट की हर रात डॉ. कपिल देव शर्मा के साथ एक लाइव मार्गदर्शित सत्र, शाम 7:30 – रात 10:30 — रीयल-टाइम में, पहले से रिकॉर्ड नहीं।", |
| `lib/i18n.ts:4293` | desc: "रिट्रीट के दौरान सवालों के जवाब सीधे डॉ. शर्मा देते हैं, किसी सपोर्ट टिकट के ज़रिए नहीं।", | desc: "रिट्रीट के दौरान सवालों के जवाब सीधे डॉ. कपिल देव शर्मा देते हैं, किसी सपोर्ट टिकट के ज़रिए नहीं।", |
| `lib/i18n.ts:4336` | "किसी विशेष विश्वास प्रणाली या पूर्व अनुभव की ज़रूरत नहीं है। क्रिया योग 11 रातों में धीरे-धीरे आगे बढ़ता है — आप अपना खुलापन लाएं, डॉ. शर्मा हर कदम पर विधि बताएंगे।", | "किसी विशेष विश्वास प्रणाली या पूर्व अनुभव की ज़रूरत नहीं है। क्रिया योग 11 रातों में धीरे-धीरे आगे बढ़ता है — आप अपना खुलापन लाएं, डॉ. कपिल देव शर्मा हर कदम पर विधि बताएंगे।", |
| `lib/i18n.ts:4341` | "हर तकनीक चरण-दर-चरण, लाइव सिखाई जाती है, और हर रात डॉ. शर्मा गति का मार्गदर्शन करते हैं। फिर भी, ये गहन अभ्यास हैं — कुछ लोगों के लिए, गहरा ध्यान या ऊर्जा-केंद्रित कार्य तीव्र भावनात्मक अनुभव सामने ला सकता है। हम प्रतिभागियों से रिट्रीट से पहले किसी भी प्रासंगिक मानसिक स्वास्थ्य इतिहास को साझा करने का अनुरोध करते हैं, ताकि गति उसके अनुसार समायोजित की जा सके। यह रिट्रीट एक व्यक्तिगत और आध्यात्मिक अभ्यास है, लाइसेंस-प्राप्त थेरेपी या मनोरोग उपचार का विकल्प नहीं — यदि आप वर्तमान में किसी मानसिक स्वास्थ्य स्थिति के लिए उपचार ले रहे हैं, तो कृपया शामिल होने से पहले अपने चिकित्सक से सलाह लें।", | "हर तकनीक चरण-दर-चरण, लाइव सिखाई जाती है, और हर रात डॉ. कपिल देव शर्मा गति का मार्गदर्शन करते हैं। फिर भी, ये गहन अभ्यास हैं — कुछ लोगों के लिए, गहरा ध्यान या ऊर्जा-केंद्रित कार्य तीव्र भावनात्मक अनुभव सामने ला सकता है। हम प्रतिभागियों से रिट्रीट से पहले किसी भी प्रासंगिक मानसिक स्वास्थ्य इतिहास को साझा करने का अनुरोध करते हैं, ताकि गति उसके अनुसार समायोजित की जा सके। यह रिट्रीट एक व्यक्तिगत और आध्यात्मिक अभ्यास है, लाइसेंस-प्राप्त थेरेपी या मनोरोग उपचार का विकल्प नहीं — यदि आप वर्तमान में किसी मानसिक स्वास्थ्य स्थिति के लिए उपचार ले रहे हैं, तो कृपया शामिल होने से पहले अपने चिकित्सक से सलाह लें।", |
| `lib/i18n.ts:4351` | "हर दिन में डॉ. शर्मा के साथ शाम 7:30 से रात 10:30 तक एक लाइव सत्र और मार्गदर्शित अभ्यास शामिल है — 11-दिवसीय बैच के हर दिन यही समय।", | "हर दिन में डॉ. कपिल देव शर्मा के साथ शाम 7:30 से रात 10:30 तक एक लाइव सत्र और मार्गदर्शित अभ्यास शामिल है — 11-दिवसीय बैच के हर दिन यही समय।", |
| `lib/i18n.ts:4585` | "हर तकनीक चरण-दर-चरण सिखाई जाती है, सीधी व्यक्तिगत निगरानी में। फिर भी, ये गहन अभ्यास हैं — कुछ लोगों के लिए, गहरा ध्यान या ऊर्जा-केंद्रित कार्य तीव्र भावनात्मक अनुभव सामने ला सकता है। हम प्रतिभागियों से रिट्रीट से पहले किसी भी प्रासंगिक मानसिक स्वास्थ्य इतिहास को साझा करने का अनुरोध करते हैं, ताकि डॉ. शर्मा उसके अनुसार गति समायोजित कर सकें। यह रिट्रीट एक व्यक्तिगत और आध्यात्मिक अभ्यास है, लाइसेंस-प्राप्त थेरेपी या मनोरोग उपचार का विकल्प नहीं — यदि आप वर्तमान में किसी मानसिक स्वास्थ्य स्थिति के लिए उपचार ले रहे हैं, तो कृपया शामिल होने से पहले अपने चिकित्सक से सलाह लें।", | "हर तकनीक चरण-दर-चरण सिखाई जाती है, सीधी व्यक्तिगत निगरानी में। फिर भी, ये गहन अभ्यास हैं — कुछ लोगों के लिए, गहरा ध्यान या ऊर्जा-केंद्रित कार्य तीव्र भावनात्मक अनुभव सामने ला सकता है। हम प्रतिभागियों से रिट्रीट से पहले किसी भी प्रासंगिक मानसिक स्वास्थ्य इतिहास को साझा करने का अनुरोध करते हैं, ताकि डॉ. कपिल देव शर्मा उसके अनुसार गति समायोजित कर सकें। यह रिट्रीट एक व्यक्तिगत और आध्यात्मिक अभ्यास है, लाइसेंस-प्राप्त थेरेपी या मनोरोग उपचार का विकल्प नहीं — यदि आप वर्तमान में किसी मानसिक स्वास्थ्य स्थिति के लिए उपचार ले रहे हैं, तो कृपया शामिल होने से पहले अपने चिकित्सक से सलाह लें।", |
| `lib/i18n.ts:4765` | "यही वजह है कि संक्षिप्त बातचीत का चरण मौजूद है। आवेदन करने से पहले आपको स्पष्ट निदान की ज़रूरत नहीं — बस इतना अंदाज़ा काफी है कि क्या ठीक से काम नहीं कर रहा। डॉ. शर्मा उस पहली बातचीत में ही असली फोकस क्षेत्र पहचानने में मदद करते हैं, किसी भी योजना के प्रस्तावित होने से पहले।", | "यही वजह है कि संक्षिप्त बातचीत का चरण मौजूद है। आवेदन करने से पहले आपको स्पष्ट निदान की ज़रूरत नहीं — बस इतना अंदाज़ा काफी है कि क्या ठीक से काम नहीं कर रहा। डॉ. कपिल देव शर्मा उस पहली बातचीत में ही असली फोकस क्षेत्र पहचानने में मदद करते हैं, किसी भी योजना के प्रस्तावित होने से पहले।", |
| `lib/i18n.ts:50` | Hero credential chips: English Professor (15+ Years Experience) · India's First QSR Pioneer (Since 2015) · 10,000+ Students Guided \| Hero H1: India's First Science-Backed Quantum Speed Reading | Hero credential chips: 26 years in education and mind training · Quantum Speed Reading trainer since 2015 · 10,000+ learners · 500+ workshops \| Hero H1: Science-Backed Quantum Speed Reading |
| `lib/i18n.ts:43` | masterclassLabel: "Live Masterclass — ₹9,999", | Access model label: 30-Day Live Program — ₹9,999 |
| `lib/i18n.ts:57` | portraitTitle: "Founder, Mind Ur Mind", | Hero portrait caption: Brain, Mind & Meditation Coach |
| `lib/i18n.ts:60` | { value: "11 Days, Monthly", label: "Online Meditation & Inner Mastery Retreat" }, | Hero stat label: 11-Day Online Deep Meditation Retreat |
| `lib/i18n.ts:62` | { value: "1-on-1", label: "Personal Class" }, | Hero stat label: 1-on-1 Mind Coaching with Dr. Kapil |
| `lib/i18n.ts:69` | Program tier heading: Quantum Speed Reading / 30-Day Masterclass | Program tier heading: Quantum Speed Reading / 30-Day Live Program |
| `lib/i18n.ts:81` | cta: "Unlock 30-Day Masterclass", | CTA: Unlock the 30-Day Live Program |
| `lib/i18n.ts:93` | Program card title: 11-Day Online Meditation & Inner Mastery Retreat | Program card title: 11-Day Online Deep Meditation Retreat |
| `lib/i18n.ts:114` | title: "Residential Retreats", | Program card title: Residential Meditation Retreats — Lonavala & Rishikesh |
| `lib/i18n.ts:128` | title: "Personal Class — 1-on-1 Intensive Mentoring", | Program card title: 1-on-1 Mind Coaching with Dr. Kapil |
| `lib/i18n.ts:135` | cta: "Apply for 1-on-1 Mentoring", | CTA: Apply for 1-on-1 Mind Coaching |
| `lib/i18n.ts:140` | title: "Overthinking Mastery Course", | Program card title: 21-Day Overthinking Reset |
| `lib/i18n.ts:183` | Homepage program card title: Quantum Mind & Habit Builder | Homepage program card title: 7-Day Free Focus & Reading Starter |
| `lib/i18n.ts:190` | eyebrowLabel: "30-Day Masterclass · Flagship", | Card eyebrow: 30-Day Live Program · Flagship |
| `lib/i18n.ts:229` | mainScreenshotAlt: "The Quantum Mindset & Habit Builder dashboard — a real streak and daily continue screen", | Screenshot alt: The 21-Day Focus & Reading Program dashboard — a real streak… |
| `lib/i18n.ts:240` | desc: "A 2-day in-person extension of the Masterclass — live coaching, | Mumbai teaser: A 2-day in-person extension of the 30-Day Live Program — … |
| `lib/i18n.ts:298` | desc: "Daily exercises and structured challenges", programLabel: "Quantum Mind & Habit Builder" }, | Concept card label: 7-Day Free Focus & Reading Starter |
| `lib/i18n.ts:300` | programLabel: "1-on-1 Mentoring" }, | Concept card label: 1-on-1 Mind Coaching with Dr. Kapil |
| `lib/i18n.ts:305` | title: "Meet Dr. Kapil Sharma", | Homepage section H2: Meet Dr. Kapil Dev Sharma |
| `lib/i18n.ts:476` | Franchise 'Who You're Partnering With': "Dr. Kapil Dev Sharma has 26 years of experience as a mind trainer and coach. He developed the Quantum Speed Reading methodology in 2015…" + chips: 26 years as a mind trainer and coach · Developer of the Quantum Speed Reading methodology, since 2015 · 10,000+ students guided directly | Franchise 'Who You're Partnering With': trainer longBio + shortBio chips (26 years in education and mind training · Quantum Speed Reading trainer since 2015 · 10,000+ learners · 500+ workshops) |
| `lib/i18n.ts:536` | Franchise FAQ: 15–20% of each student enrollment goes to Mind Ur Mind Academy — … | Franchise FAQ: 15–20% of each student enrollment goes to Mind Ur Mind — … |
| `lib/i18n.ts:679` | program: "Personal Class", | Testimonial program label: 1-on-1 Mind Coaching with Dr. Kapil |
| `lib/i18n.ts:690` | program: "Overthinking Mastery", | Testimonial program label: 21-Day Overthinking Reset |
| `lib/i18n.ts:721` | FAQ: …Dr. Sharma has guided 10,000+ students from complete beginners to advanced practitioners since 2014. | FAQ: …Dr. Kapil Dev Sharma has taught it since 2015, and most learners start as complete beginners. |
| `lib/i18n.ts:729` | question: "How much does the QSR Masterclass cost, and what's included?", | FAQ question: How much does the Quantum Speed Reading — 30-Day Live Program cost, and what's included? |
| `lib/i18n.ts:731` | FAQ answer: The 30-Day Quantum Speed Reading Live Masterclass is ₹9,999, one-time — … | FAQ answer: The Quantum Speed Reading — 30-Day Live Program is ₹9,999, one-time — … |
| `lib/i18n.ts:746` | FAQ: …start with the free 7 days of Quantum Mind & Habit Builder before QSR. …apply for 1-on-1 Mentoring. | FAQ: …start with the 7-Day Free Focus & Reading Starter before QSR. …apply for 1-on-1 Mind Coaching with Dr. Kapil. |
| `lib/i18n.ts:749` | question: "Is Quantum Mind & Habit Builder really free?", | FAQ question: Is the 7-Day Free Focus & Reading Starter really free? |
| `lib/i18n.ts:765` | FAQ: Both. The 11-Day Online Meditation & Inner Mastery Retreat runs monthly…; Residential Retreats in Rishikesh and Lonavala run 3–4 times a year… | FAQ: Both. The 11-Day Online Deep Meditation Retreat runs monthly…; the Residential Meditation Retreats — Lonavala & Rishikesh run 3–4 times a year… |
| `lib/i18n.ts:768` | question: "How does 1-on-1 mentoring work?", | FAQ question: How does 1-on-1 Mind Coaching with Dr. Kapil work? |
| `lib/i18n.ts:770` | FAQ answer: Personal Class is private, custom-paced mentoring directly with Dr. Sharma — sessions are built… | FAQ answer: 1-on-1 Mind Coaching with Dr. Kapil is private, custom-paced coaching — sessions are built… |
| `lib/i18n.ts:796` | { label: "Quantum Mindset & Habit Builder", href: "/programs/habit-builder" }, | Footer link: 7-Day Free Focus & Reading Starter |
| `lib/i18n.ts:803` | { label: "Residential Retreats", href: "/retreats/residential" }, | Footer link: Residential Meditation Retreats — Lonavala & Rishikesh |
| `lib/i18n.ts:809` | { label: "Personal Class (1-on-1)", href: "/mentoring/personal-class" }, | Footer link: 1-on-1 Mind Coaching with Dr. Kapil |
| `lib/i18n.ts:810` | { label: "Overthinking Mastery", href: "/mentoring/overthinking-course" }, | Footer link: 21-Day Overthinking Reset |
| `lib/i18n.ts:814` | heading: "Quantum Mind App", | Footer column heading: Mind Ur Mind App |
| `lib/i18n.ts:815` | Footer link: Habit Builder — 7 Days Free, ₹99 One-Time | Footer link: 7-Day Free Focus & Reading Starter · ₹99 for Days 8–21 |
| `lib/i18n.ts:849` | About page: …one-on-one mentoring, and the Quantum Mind app — while staying rooted… | About page: …one-on-one mentoring, and the Mind Ur Mind App — while staying rooted… |
| `lib/i18n.ts` | Per-page trainer bio copies in i18n (About / Personal Class / Overthinking course guide cards, EN+HI): credential: "Professor · Researcher · Life Coach · 26 Years Experience", \| bio: "Dr. Kapil Dev Sharma brings 26 years of experience — 15 years as a professor and researcher in formal education, and 11 years as a life coach and mind trainer. That combination of academic rigour and direct coaching practice is what shapes how sessions are built.", \| credential: "Professor · Researcher · Life Coach · 26 Years Experience", \| bio: "Dr. Kapil Dev Sharma brings 26 years of experience — 15 years as a professor and researcher in formal education, and 11 years as a life coach and mind trainer. That combination of academic rigour and direct coaching practice is what shapes how sessions are built.", \| credential: "Professor · Researcher · Life Coach · 26 Years Experience", \| bio: "Dr. Kapil Dev Sharma brings 26 years of experience — 15 years as a professor and researcher in formal education, and 11 y … | Removed — TrainerBio reads title/longBio/stats from site.config; only eyebrow + quote remain per page |
| `lib/i18n.ts:1101` | QSR H2: Learn From The Person Who Brought QSR To India · intro: Not a licensed instructor teaching someone else's system — the person who introduced it. · 4 credential cards (English Professor (15+ Years Experience) / India's First QSR Pioneer (Since 2015) / 10,000+ Students Guided / 500+ Workshops Delivered) | QSR H2: Learn Directly From Dr. Kapil Dev Sharma · TrainerBio (longBio + stats from site.config); intro line and cards removed |
| `lib/i18n.ts:3596` | QSR H2 (HI): भारत में QSR लाने वाले व्यक्ति से सीखें · intro: किसी लाइसेंस-प्राप्त प्रशिक्षक से नहीं… बल्कि उस व्यक्ति से जिसने इसे शुरू किया। · cards: इंग्लिश प्रोफेसर (15+ वर्षों का अनुभव) / भारत में QSR के प्रणेता (2015 से) / … | QSR H2 (HI): डॉ. कपिल देव शर्मा से सीधे सीखें · TrainerBio (Hindi longBio + stats from site.config) |
| `lib/i18n.ts:1113` | Founder video intro: A short introduction from Dr. Kapil Dev Sharma — an English Professor with 15+ years of teaching experience, and India's first QSR pioneer, who introduced Quantum Speed Reading to the country in 2015. You're learning directly from the originator of the method, not a licensed instructor teaching someone else's system. | Founder video intro: A short introduction from Dr. Kapil Dev Sharma — 26 years in education and mind training, and a Quantum Speed Reading trainer since 2015. Hear how his 30-day method works before you decide. |
| `lib/i18n.ts:3608` | Founder video intro (HI): …एक इंग्लिश प्रोफेसर, जिनके पास 15+ वर्षों का शिक्षण अनुभव है, और भारत में QSR के प्रणेता… आप सीधे इस विधि के प्रणेता से सीख रहे हैं, किसी और की प्रणाली सिखाने वाले लाइसेंस-प्राप्त प्रशिक्षक से नहीं। | Founder video intro (HI): डॉ. कपिल देव शर्मा की ओर से एक संक्षिप्त परिचय — शिक्षा और माइंड ट्रेनिंग में 26 वर्ष, और 2015 से क्वांटम स्पीड रीडिंग ट्रेनर। फैसला करने से पहले सुनें कि उनकी 30-दिवसीय विधि कैसे काम करती है। |
| `lib/i18n.ts:945` | secondaryLine: "Secure checkout via Razorpay · 10,000+ students since 2014", | Checkout trust line: Secure checkout via Razorpay · 10,000+ learners · QSR trainer since 2015 |
| `lib/i18n.ts:1064` | title: "One Masterclass, Tailored for Every Age Group", | QSR H2: One Program, Tailored for Every Age Group |
| `lib/i18n.ts:1142` | QSR feature: Progressive cognitive drills… right inside the Quantum Mind app. | QSR feature: Progressive cognitive drills… right inside the Mind Ur Mind App. |
| `lib/i18n.ts:1210` | QSR bonus: The same AI-powered Document Studio available inside the Quantum Mind app — … | QSR bonus: The same AI-powered Document Studio available inside the Mind Ur Mind App — … |
| `lib/i18n.ts:1311` | QSR FAQ: …Dr. Sharma has guided 10,000+ students through it since 2014, most of them starting as complete beginners. | QSR FAQ: …Dr. Kapil Dev Sharma has taught Quantum Speed Reading since 2015, and most learners start as complete beginners. |
| `lib/i18n.ts:1321` | QSR FAQ: …have all completed this Masterclass. | QSR FAQ: …have all completed this program. |
| `lib/i18n.ts:1326` | QSR FAQ: The Masterclass itself is a fully paid, result-oriented program… | QSR FAQ: The Quantum Speed Reading — 30-Day Live Program itself is a fully paid, result-oriented program… |
| `lib/i18n.ts:1366` | QSR sticky bar: 30-Day Quantum Speed Reading Masterclass | QSR sticky bar: Quantum Speed Reading — 30-Day Live Program |
| `lib/i18n.ts:1373` | ariaLabel: "Chat with Dr. Kapil's team on WhatsApp about the Quantum Speed Reading Masterclass", | WhatsApp button label: …about the Quantum Speed Reading — 30-Day Live Program |
| `lib/i18n.ts:1383` | Mumbai teaser: A 2-day in-person extension of this Masterclass — … | Mumbai teaser: A 2-day in-person extension of this program — … |
| `lib/i18n.ts:1412` | Mumbai hero (unpublished page): A 2-day, in-person extension of the 30-Day Quantum Speed Reading Masterclass — … | Mumbai hero (unpublished page): A 2-day, in-person extension of the Quantum Speed Reading — 30-Day Live Program — … |
| `lib/i18n.ts:1414` | ctaPrimaryMeta: "₹9,999 · Same Price as the Online Masterclass", | Mumbai CTA meta: ₹9,999 · Same Price as the Online Program |
| `lib/i18n.ts:1489` | priceNote: "One-time — same price as the online Masterclass. | Mumbai price note: One-time — same price as the online program. … |
| `lib/i18n.ts:1519` | covers the online Masterclass applies here | Mumbai FAQ: The same Refund & Cancellation Policy that covers the online program applies here… |
| `lib/i18n.ts:1649` | headlineEm: "The 11-Day Online Meditation & Inner Mastery Retreat", | Online retreat H1: The 11-Day Online Deep Meditation Retreat |
| `lib/i18n.ts:1727` | desc: "12+ years personally guiding students through this exact path — not a recently-launched program chasing a trend.", | Retreat card: Personally guiding students through this exact path since 2014 — not a recently-launched program chasing a trend. |
| `lib/i18n.ts:1790` | title: "150+ real reviews, from 12+ years of real retreats", | Retreat H2: 150+ real reviews from real retreats since 2014 |
| `lib/i18n.ts:1844` | Retreat final CTA: …Twelve years, 150+ real students, one small cohort at a time. | Retreat final CTA: …Since 2014, 150+ real students, one small cohort at a time. |
| `lib/i18n.ts:1848` | text: "11-Day Online Meditation & Inner Mastery Retreat", | Online retreat sticky bar: 11-Day Online Deep Meditation Retreat |
| `lib/i18n.ts:1860` | eyebrow: "Residential Retreats · Since 2014 · Small Cohorts", | Residential eyebrow: Residential Meditation Retreats · Since 2014 · Small Cohorts |
| `lib/i18n.ts:1862` | headlineEm: "Residential Retreats in Lonavala & Rishikesh", | Residential H1: Residential Meditation Retreats — Lonavala & Rishikesh |
| `lib/i18n.ts:2078` | text: "Residential Retreats — Lonavala & Rishikesh", | Residential sticky bar: Residential Meditation Retreats — Lonavala & Rishikesh |
| `lib/i18n.ts:2085` | ariaLabel: "Chat with Dr. Kapil's team on WhatsApp about the Residential Retreats", | WhatsApp button label: …about the Residential Meditation Retreats — Lonavala & Rishikesh |
| `lib/i18n.ts:2215` | 1-on-1 FAQ: Group programs (like the 30-Day Masterclass or the 11-Day Retreat) run on a fixed schedule… | 1-on-1 FAQ: Group programs (like the Quantum Speed Reading — 30-Day Live Program or the 11-Day Online Deep Meditation Retreat) run on a fixed schedule… |
| `lib/i18n.ts:2235` | bubble: "Have questions about 1-on-1 Mentoring? Chat with Dr. Kapil's team instantly.", | WhatsApp bubble: Have questions about 1-on-1 Mind Coaching with Dr. Kapil? … |
| `lib/i18n.ts:2237` | ariaLabel: "Chat with Dr. Kapil's team about 1-on-1 Mentoring on WhatsApp", | WhatsApp button label: …about 1-on-1 Mind Coaching with Dr. Kapil on WhatsApp |
| `lib/i18n.ts:2240` | text: "Personal Class — 1-on-1 Intensive Mentoring", | 1-on-1 sticky bar: 1-on-1 Mind Coaching with Dr. Kapil |
| `lib/i18n.ts:2256` | productName: "The 21-Day Mind Reset System™", | Overthinking course product name: 21-Day Overthinking Reset |
| `lib/i18n.ts:2260` | CTA (×2): Start Your Mind Reset — ₹499 | CTA (×2): Start Your Overthinking Reset — ₹499 |
| `lib/i18n.ts:2398` | title: "Start Your Mind Reset Journey Today", | Pricing H2: Start Your Overthinking Reset Today |
| `lib/i18n.ts:2401` | Plan name: Mind Reset Starter | Plan name: Overthinking Reset — 1 Month |
| `lib/i18n.ts:2416` | Plan name: Mind Reset Extended | Plan name: Overthinking Reset — 6 Months |
| `lib/i18n.ts:2450` | question: "What is the 21-Day Mind Reset System™?", | FAQ question: What is the 21-Day Overthinking Reset? |
| `lib/i18n.ts:2508` | bubble: "Have questions about the 21-Day Mind Reset System? Chat with Dr. Kapil's team instantly.", | WhatsApp bubble: Have questions about the 21-Day Overthinking Reset? … |
| `lib/i18n.ts:2510` | ariaLabel: "Chat with Dr. Kapil's team about the 21-Day Mind Reset System on WhatsApp", | WhatsApp button label: …about the 21-Day Overthinking Reset on WhatsApp |
| `lib/i18n.ts:2513` | text: "The 21-Day Mind Reset System", | Overthinking sticky bar: 21-Day Overthinking Reset |
| `lib/i18n.ts:2608` | courseDesc: "The 21-Day Mind Reset System is a structured, daily Hindi program | Overthinking Test result: The 21-Day Overthinking Reset is a structured, daily Hindi program… |
| `lib/i18n.ts:2609` | courseCta: "Explore the 21-Day Mind Reset System", | Overthinking Test CTA: Explore the 21-Day Overthinking Reset |
| `lib/i18n.ts:2643` | Hero chips (HI): इंग्लिश प्रोफेसर (15+ वर्षों का अनुभव) · भारत में QSR के प्रणेता (2015 से) · 10,000+ विद्यार्थियों का मार्गदर्शन \| Hero H1 (HI): भारत की पहली विज्ञान-आधारित क्वांटम स्पीड रीडिंग | Hero chips (HI): शिक्षा और माइंड ट्रेनिंग में 26 वर्ष · 2015 से क्वांटम स्पीड रीडिंग ट्रेनर · 10,000+ विद्यार्थी · 500+ वर्कशॉप्स \| Hero H1 (HI): विज्ञान-आधारित क्वांटम स्पीड रीडिंग |
| `lib/i18n.ts:2636` | masterclassLabel: "लाइव मास्टरक्लास — ₹9,999", | Access label (HI): 30-दिवसीय लाइव प्रोग्राम — ₹9,999 |
| `lib/i18n.ts:2650` | portraitTitle: "संस्थापक, माइंड उर माइंड", | Hero portrait caption (HI): ब्रेन, माइंड व मेडिटेशन कोच |
| `lib/i18n.ts:2653` | label: "ऑनलाइन ध्यान एंड इनर मास्टरी रिट्रीट" }, | Hero stat (HI): 11-दिवसीय ऑनलाइन डीप मेडिटेशन रिट्रीट |
| `lib/i18n.ts:2655` | { value: "1-ऑन-1", label: "पर्सनल क्लास" }, | Hero stat (HI): डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग |
| `lib/i18n.ts:2662` | titleEm: "30-दिवसीय मास्टरक्लास", | Tier heading (HI): 30-दिवसीय लाइव प्रोग्राम |
| `lib/i18n.ts:2674` | cta: "30-दिवसीय मास्टरक्लास अनलॉक करें", | CTA (HI): 30-दिवसीय लाइव प्रोग्राम अनलॉक करें |
| `lib/i18n.ts:2686` | title: "11-दिवसीय ऑनलाइन ध्यान एंड इनर मास्टरी रिट्रीट", | Program card (HI): 11-दिवसीय ऑनलाइन डीप मेडिटेशन रिट्रीट |
| `lib/i18n.ts:2707` | title: "रेजिडेंशियल रिट्रीट", | Program card (HI): रेजिडेंशियल मेडिटेशन रिट्रीट्स — लोनावला व ऋषिकेश |
| `lib/i18n.ts:2721` | title: "पर्सनल क्लास — 1-ऑन-1 इंटेंसिव मेंटरिंग", | Program card (HI): डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग |
| `lib/i18n.ts:2728` | cta: "1-ऑन-1 मेंटरिंग के लिए आवेदन करें", | CTA (HI): 1-on-1 माइंड कोचिंग के लिए आवेदन करें |
| `lib/i18n.ts:2733` | title: "ओवरथिंकिंग मास्टरी कोर्स", | Program card (HI): 21-दिवसीय ओवरथिंकिंग रीसेट |
| `lib/i18n.ts:2769` | title: "Quantum Mind & Habit Builder", | Homepage program card (HI): 7-दिवसीय फ्री फोकस व रीडिंग स्टार्टर |
| `lib/i18n.ts:2776` | eyebrowLabel: "30-दिवसीय मास्टरक्लास · फ्लैगशिप", | Card eyebrow (HI): 30-दिवसीय लाइव प्रोग्राम · फ्लैगशिप |
| `lib/i18n.ts:2808` | mainScreenshotAlt: "Quantum Mindset & Habit Builder डैशबोर्ड — | Screenshot alt (HI): 21-दिवसीय फोकस व रीडिंग प्रोग्राम डैशबोर्ड — … |
| `lib/i18n.ts:2813` | desc: "मास्टरक्लास का एक 2-दिवसीय व्यक्तिगत विस्तार | Mumbai teaser (HI): 30-दिवसीय लाइव प्रोग्राम का एक 2-दिवसीय व्यक्तिगत विस्तार — … |
| `lib/i18n.ts:2863` | programLabel: "Quantum Mind & Habit Builder" }, | Concept label (HI): 7-दिवसीय फ्री फोकस व रीडिंग स्टार्टर |
| `lib/i18n.ts:2865` | programLabel: "1-ऑन-1 मेंटरिंग" }, | Concept label (HI): डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग |
| `lib/i18n.ts:2870` | title: "डॉ. कपिल शर्मा से मिलें", | Homepage H2 (HI): डॉ. कपिल देव शर्मा से मिलें |
| `lib/i18n.ts:3041` | bio: "डॉ. कपिल देव शर्मा को एक mind trainer और coach के रूप में 26 साल का अनुभव है। उन्होंने 2015 में Quantum Speed Reading मेथडोलॉजी बनाई, और तब से इसे लगातार एक structured, cognitive-science-based प्रोग्राम में विकसित किया है — यही कर्रिकुलम और ट्रेनिंग मेथड इस पार्टनर प्रोग्राम का आधार है।", | Franchise bio (HI): trainer.hi.longBio (…15 वर्ष प्रोफेसर… 11 वर्ष माइंड ट्रेनर… 2015 से भारत में क्वांटम स्पीड रीडिंग सिखाने वाले शुरुआती ट्रेनर्स में से एक…) |
| `lib/i18n.ts:3042` | Franchise chips (HI): mind trainer और coach के रूप में 26 साल · Quantum Speed Reading मेथडोलॉजी के निर्माता, 2015 से · 10,000+ विद्यार्थियों को सीधे गाइड किया | Franchise chips (HI): trainer.hi.shortBio |
| `lib/i18n.ts:3233` | program: "पर्सनल क्लास", | Testimonial label (HI): डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग |
| `lib/i18n.ts:3244` | program: "ओवरथिंकिंग मास्टरी", | Testimonial label (HI): 21-दिवसीय ओवरथिंकिंग रीसेट |
| `lib/i18n.ts:3266` | FAQ (HI): …डॉ. शर्मा ने 2014 से अब तक 10,000+ विद्यार्थियों को पूर्ण शुरुआती से उन्नत अभ्यासी तक मार्गदर्शन दिया है। | FAQ (HI): …डॉ. कपिल देव शर्मा 2015 से इसे सिखा रहे हैं, और अधिकांश विद्यार्थी पूर्ण शुरुआती के रूप में शुरू करते हैं। |
| `lib/i18n.ts:3274` | question: "QSR मास्टरक्लास की कीमत कितनी है, और इसमें क्या शामिल है?", | FAQ question (HI): क्वांटम स्पीड रीडिंग — 30-दिवसीय लाइव प्रोग्राम की कीमत कितनी है… |
| `lib/i18n.ts:3276` | FAQ answer (HI): 30-दिवसीय क्वांटम स्पीड रीडिंग लाइव मास्टरक्लास की कीमत ₹9,999 है… | FAQ answer (HI): क्वांटम स्पीड रीडिंग — 30-दिवसीय लाइव प्रोग्राम की कीमत ₹9,999 है… |
| `lib/i18n.ts:3291` | FAQ (HI): …QSR से पहले Quantum Mind & Habit Builder के मुफ़्त 7 दिनों से शुरू करें। …1-ऑन-1 मेंटरिंग के लिए आवेदन करें। | FAQ (HI): …QSR से पहले 7-दिवसीय फ्री फोकस व रीडिंग स्टार्टर से शुरू करें। …डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग के लिए आवेदन करें। |
| `lib/i18n.ts:3294` | question: "क्या Quantum Mind & Habit Builder वाकई मुफ़्त है?", | FAQ question (HI): क्या 7-दिवसीय फ्री फोकस व रीडिंग स्टार्टर वाकई मुफ़्त है? |
| `lib/i18n.ts:3310` | FAQ (HI): दोनों। 11-दिवसीय ऑनलाइन ध्यान एंड इनर मास्टरी रिट्रीट हर महीने चलता है…; ऋषिकेश और लोनावला में रेजिडेंशियल रिट्रीट वर्ष में 3–4 बार… | FAQ (HI): दोनों। 11-दिवसीय ऑनलाइन डीप मेडिटेशन रिट्रीट हर महीने चलता है…; रेजिडेंशियल मेडिटेशन रिट्रीट्स — लोनावला व ऋषिकेश वर्ष में 3–4 बार… |
| `lib/i18n.ts:3318` | question: "1-ऑन-1 मेंटरिंग कैसे काम करती है?", | FAQ question (HI): डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग कैसे काम करती है? |
| `lib/i18n.ts:3320` | FAQ answer (HI): पर्सनल क्लास डॉ. शर्मा के साथ सीधे, निजी, कस्टम-पेस्ड मेंटरिंग है — … | FAQ answer (HI): डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग निजी, कस्टम-पेस्ड कोचिंग है — … |
| `lib/i18n.ts:3335` | bubble: "रिट्रीट्स या मास्टरक्लास के बारे में सवाल हैं? | WhatsApp bubble (HI): रिट्रीट्स या 30-दिवसीय लाइव प्रोग्राम के बारे में सवाल हैं? … |
| `lib/i18n.ts:3346` | { label: "क्वांटम माइंडसेट एंड हैबिट बिल्डर", href: "/programs/habit-builder" }, | Footer link (HI): 7-दिवसीय फ्री फोकस व रीडिंग स्टार्टर |
| `lib/i18n.ts:3353` | { label: "रेजिडेंशियल रिट्रीट", href: "/retreats/residential" }, | Footer link (HI): रेजिडेंशियल मेडिटेशन रिट्रीट्स — लोनावला व ऋषिकेश |
| `lib/i18n.ts:3359` | { label: "पर्सनल क्लास (1-ऑन-1)", href: "/mentoring/personal-class" }, | Footer link (HI): डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग |
| `lib/i18n.ts:3360` | { label: "ओवरथिंकिंग मास्टरी", href: "/mentoring/overthinking-course" }, | Footer link (HI): 21-दिवसीय ओवरथिंकिंग रीसेट |
| `lib/i18n.ts:3364` | heading: "क्वांटम माइंड ऐप", | Footer heading (HI): Mind Ur Mind App |
| `lib/i18n.ts:3365` | links: [{ label: "Habit Builder — 7 दिन मुफ़्त, ₹99 एकमुश्त", href: "/programs/habit-builder" }], | Footer link (HI): 7-दिवसीय फ्री फोकस व रीडिंग स्टार्टर · दिन 8–21 के लिए ₹99 |
| `lib/i18n.ts:3399` | About (HI): …वन-ऑन-वन मेंटरिंग, और क्वांटम माइंड ऐप — … | About (HI): …वन-ऑन-वन मेंटरिंग, और Mind Ur Mind App — … |
| `lib/i18n.ts:3472` | secondaryLine: "Razorpay के ज़रिए सुरक्षित चेकआउट · 2014 से 10,000+ विद्यार्थी", | Checkout trust line (HI): Razorpay के ज़रिए सुरक्षित चेकआउट · 10,000+ विद्यार्थी · 2015 से QSR ट्रेनर |
| `lib/i18n.ts:3569` | title: "एक मास्टरक्लास, हर आयु वर्ग के लिए अनुकूलित", | QSR H2 (HI): एक प्रोग्राम, हर आयु वर्ग के लिए अनुकूलित |
| `lib/i18n.ts:3629` | desc: "आपकी अपनी गति से, हर दिन, क्वांटम माइंड ऐप के भीतर ही प्रगतिशील संज्ञानात्मक अभ्यास।", | QSR feature (HI): …Mind Ur Mind App के भीतर ही प्रगतिशील संज्ञानात्मक अभ्यास। |
| `lib/i18n.ts:3686` | desc: "Quantum Mind app के अंदर मौजूद वही AI-पावर्ड Document Studio | QSR bonus (HI): Mind Ur Mind App के अंदर मौजूद वही AI-पावर्ड Document Studio — … |
| `lib/i18n.ts:3772` | QSR FAQ (HI): …डॉ. शर्मा ने 2014 से अब तक 10,000+ विद्यार्थियों को इसमें मार्गदर्शन दिया है… | QSR FAQ (HI): …डॉ. कपिल देव शर्मा 2015 से क्वांटम स्पीड रीडिंग सिखा रहे हैं, और अधिकांश विद्यार्थी पूर्ण शुरुआती के रूप में शुरू करते हैं। |
| `lib/i18n.ts:3782` | ने यह मास्टरक्लास पूरा किया है। | QSR FAQ (HI): …ने यह प्रोग्राम पूरा किया है। |
| `lib/i18n.ts:3787` | "मास्टरक्लास खुद एक पूरी तरह से भुगतान वाला | QSR FAQ (HI): क्वांटम स्पीड रीडिंग — 30-दिवसीय लाइव प्रोग्राम खुद एक पूरी तरह से भुगतान वाला… |
| `lib/i18n.ts:3827` | text: "30-दिवसीय क्वांटम स्पीड रीडिंग मास्टरक्लास", | QSR sticky bar (HI): क्वांटम स्पीड रीडिंग — 30-दिवसीय लाइव प्रोग्राम |
| `lib/i18n.ts:3834` | ariaLabel: "क्वांटम स्पीड रीडिंग मास्टरक्लास के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें", | WhatsApp label (HI): क्वांटम स्पीड रीडिंग — 30-दिवसीय लाइव प्रोग्राम के बारे में… |
| `lib/i18n.ts:3839` | desc: "इस मास्टरक्लास का एक 2-दिवसीय व्यक्तिगत विस्तार | Mumbai teaser (HI): इस प्रोग्राम का एक 2-दिवसीय व्यक्तिगत विस्तार — … |
| `lib/i18n.ts:3849` | sub: "30-दिवसीय क्वांटम स्पीड रीडिंग मास्टरक्लास का एक 2-दिवसीय, व्यक्तिगत विस्तार | Mumbai hero (HI): क्वांटम स्पीड रीडिंग — 30-दिवसीय लाइव प्रोग्राम का एक 2-दिवसीय, व्यक्तिगत विस्तार — … |
| `lib/i18n.ts:3851` | ctaPrimaryMeta: "₹9,999 · ऑनलाइन मास्टरक्लास जैसी ही कीमत", | Mumbai CTA meta (HI): ₹9,999 · ऑनलाइन प्रोग्राम जैसी ही कीमत |
| `lib/i18n.ts:3926` | priceNote: "एकमुश्त — ऑनलाइन मास्टरक्लास जैसी ही कीमत। | Mumbai price note (HI): एकमुश्त — ऑनलाइन प्रोग्राम जैसी ही कीमत। … |
| `lib/i18n.ts:3956` | जो ऑनलाइन मास्टरक्लास को कवर करती है | Mumbai FAQ (HI): …जो ऑनलाइन प्रोग्राम को कवर करती है… |
| `lib/i18n.ts:4086` | headlineEm: "11-दिवसीय ऑनलाइन ध्यान एंड इनर मास्टरी रिट्रीट", | Online retreat H1 (HI): 11-दिवसीय ऑनलाइन डीप मेडिटेशन रिट्रीट |
| `lib/i18n.ts:4164` | desc: "इसी मार्ग पर विद्यार्थियों का व्यक्तिगत रूप से 12+ वर्षों से मार्गदर्शन — कोई हाल ही में शुरू हुआ ट्रेंड-आधारित कार्यक्रम नहीं।", | Retreat card (HI): इसी मार्ग पर 2014 से विद्यार्थियों का व्यक्तिगत रूप से मार्गदर्शन — … |
| `lib/i18n.ts:4227` | title: "12+ वर्षों के असली रिट्रीट्स से, 150+ असली समीक्षाएं", | Retreat H2 (HI): 2014 से असली रिट्रीट्स की 150+ असली समीक्षाएं |
| `lib/i18n.ts:4281` | Retreat final CTA (HI): …बारह साल, 150+ असली विद्यार्थी, … | Retreat final CTA (HI): …2014 से, 150+ असली विद्यार्थी, … |
| `lib/i18n.ts:4285` | text: "11-दिवसीय ऑनलाइन ध्यान एंड इनर मास्टरी रिट्रीट", | Online retreat sticky bar (HI): 11-दिवसीय ऑनलाइन डीप मेडिटेशन रिट्रीट |
| `lib/i18n.ts:4297` | eyebrow: "रेजिडेंशियल रिट्रीट्स · 2014 से · छोटे समूह", | Residential eyebrow (HI): रेजिडेंशियल मेडिटेशन रिट्रीट्स · 2014 से · छोटे समूह |
| `lib/i18n.ts:4299` | headlineEm: "लोनावला और ऋषिकेश में रेजिडेंशियल रिट्रीट्स", | Residential H1 (HI): रेजिडेंशियल मेडिटेशन रिट्रीट्स — लोनावला व ऋषिकेश |
| `lib/i18n.ts:4515` | text: "रेजिडेंशियल रिट्रीट्स — लोनावला और ऋषिकेश", | Residential sticky bar (HI): रेजिडेंशियल मेडिटेशन रिट्रीट्स — लोनावला व ऋषिकेश |
| `lib/i18n.ts:4520` | bubble: "रेजिडेंशियल रिट्रीट के बारे में सवाल हैं? | WhatsApp bubble (HI): रेजिडेंशियल मेडिटेशन रिट्रीट्स — लोनावला व ऋषिकेश के बारे में सवाल हैं? … |
| `lib/i18n.ts:4522` | ariaLabel: "रेजिडेंशियल रिट्रीट्स के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें", | WhatsApp label (HI): रेजिडेंशियल मेडिटेशन रिट्रीट्स — लोनावला व ऋषिकेश के बारे में… |
| `lib/i18n.ts:4652` | 1-on-1 FAQ (HI): ग्रुप प्रोग्राम्स (जैसे 30-दिवसीय मास्टरक्लास या 11-दिवसीय रिट्रीट) … | 1-on-1 FAQ (HI): ग्रुप प्रोग्राम्स (जैसे क्वांटम स्पीड रीडिंग — 30-दिवसीय लाइव प्रोग्राम या 11-दिवसीय ऑनलाइन डीप मेडिटेशन रिट्रीट) … |
| `lib/i18n.ts:4672` | bubble: "1-on-1 मेंटरिंग के बारे में सवाल हैं? डॉ. कपिल की टीम से तुरंत बात करें।", | WhatsApp bubble (HI): डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग के बारे में सवाल हैं? … |
| `lib/i18n.ts:4674` | ariaLabel: "1-on-1 मेंटरिंग के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें", | WhatsApp label (HI): डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग के बारे में… |
| `lib/i18n.ts:4677` | text: "पर्सनल क्लास — 1-on-1 इंटेंसिव मेंटरिंग", | 1-on-1 sticky bar (HI): डॉ. कपिल के साथ 1-on-1 माइंड कोचिंग |
| `lib/i18n.ts:4685` | productName: "द 21-डे माइंड रीसेट सिस्टम™", | Overthinking product name (HI): 21-दिवसीय ओवरथिंकिंग रीसेट |
| `lib/i18n.ts:4689` | ctaPrimary: "अपना माइंड रीसेट शुरू करें — ₹499", | CTA (HI, ×2): अपना ओवरथिंकिंग रीसेट शुरू करें — ₹499 |
| `lib/i18n.ts:4827` | title: "आज ही अपनी माइंड रीसेट यात्रा शुरू करें", | Pricing H2 (HI): आज ही अपना ओवरथिंकिंग रीसेट शुरू करें |
| `lib/i18n.ts:4830` | name: "माइंड रीसेट स्टार्टर", | Plan name (HI): ओवरथिंकिंग रीसेट — 1 महीना |
| `lib/i18n.ts:4845` | name: "माइंड रीसेट एक्सटेंडेड", | Plan name (HI): ओवरथिंकिंग रीसेट — 6 महीने |
| `lib/i18n.ts:4879` | question: "द 21-डे माइंड रीसेट सिस्टम™ क्या है?", | FAQ question (HI): 21-दिवसीय ओवरथिंकिंग रीसेट क्या है? |
| `lib/i18n.ts:4937` | bubble: "द 21-डे माइंड रीसेट सिस्टम के बारे में सवाल हैं? डॉ. कपिल की टीम से तुरंत बात करें।", | WhatsApp bubble (HI): 21-दिवसीय ओवरथिंकिंग रीसेट के बारे में सवाल हैं? … |
| `lib/i18n.ts:4939` | ariaLabel: "द 21-डे माइंड रीसेट सिस्टम के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें", | WhatsApp label (HI): 21-दिवसीय ओवरथिंकिंग रीसेट के बारे में… |
| `lib/i18n.ts:4942` | text: "द 21-डे माइंड रीसेट सिस्टम", | Overthinking sticky bar (HI): 21-दिवसीय ओवरथिंकिंग रीसेट |
| `lib/i18n.ts:5024` | courseDesc: "द 21-डे माइंड रीसेट सिस्टम एक संरचित, | Overthinking Test result (HI): 21-दिवसीय ओवरथिंकिंग रीसेट एक संरचित, दैनिक हिंदी प्रोग्राम है… |
| `lib/i18n.ts:5025` | courseCta: "द 21-डे माइंड रीसेट सिस्टम एक्सप्लोर करें", | Overthinking Test CTA (HI): 21-दिवसीय ओवरथिंकिंग रीसेट एक्सप्लोर करें |
| `lib/i18n.ts:946` | (same text, now from config) | Checkout trust line built from trainer.learners / trainer.qsrSinceYear |
| `lib/i18n.ts:3473` | (same text, now from config) | Checkout trust line (HI) built from config |
| `lib/i18n.ts:2092` | 1-on-1 headline: …with someone who's done this for 26 years. (typed number) | same text, number from trainer.years.total |
| `lib/i18n.ts:4529` | 1-on-1 headline (HI): …26 वर्षों से… (typed number) | same text, number from trainer.years.total |

## 4. WhatsApp pre-filled messages

| File | Before | After |
|---|---|---|
| `config/whatsappSupportLink.ts:7` | WhatsApp pre-filled: Hi Dr. Kapil, I want to know more about the 30-Day Quantum Speed Reading Masterclass | WhatsApp pre-filled: Hi Dr. Kapil, I want to know more about the Quantum Speed Reading — 30-Day Live Program |
| `config/whatsappSupportLink.ts:13` | WhatsApp pre-filled: Hi Dr. Kapil, I want to enroll in the Masterclass | WhatsApp pre-filled: Hi Dr. Kapil, I want to enroll in the Quantum Speed Reading — 30-Day Live Program |
| `config/whatsappSupportLink.ts:54` | WhatsApp pre-filled: Hi Dr. Kapil, I want to secure my spot in the 11-Day Online Meditation & Inner Mastery Retreat | WhatsApp pre-filled: Hi Dr. Kapil, I want to secure my spot in the 11-Day Online Deep Meditation Retreat |
| `config/whatsappSupportLink.ts:64` | WhatsApp pre-filled: Hi Dr. Kapil, I want to secure my seat in a Residential Retreat | WhatsApp pre-filled: Hi Dr. Kapil, I want to secure my seat in the Residential Meditation Retreats — Lonavala & Rishikesh |
| `config/whatsappSupportLink.ts:73` | WhatsApp pre-filled: Hi Dr. Kapil, I want to apply for 1-on-1 Personal Class Mentoring | WhatsApp pre-filled: Hi Dr. Kapil, I want to apply for 1-on-1 Mind Coaching with Dr. Kapil. |
| `config/whatsappSupportLink.ts:82` | WhatsApp pre-filled: Hi Dr. Kapil, I have a question about the Quantum Mindset & Habit Builder | WhatsApp pre-filled: Hi Dr. Kapil, I have a question about the 7-Day Free Focus & Reading Starter |
| `config/whatsappSupportLink.ts:157` | WhatsApp pre-filled: Hi Dr. Kapil, I have a question about the Overthinking Mastery Course | WhatsApp pre-filled: Hi Dr. Kapil, I have a question about the 21-Day Overthinking Reset |
| `config/whatsappSupportLink.ts:139` | WhatsApp application form first line: Hi Dr. Kapil, I want to apply for 1-on-1 Personal Class Mentoring. | WhatsApp application form first line: Hi Dr. Kapil, I want to apply for 1-on-1 Mind Coaching with Dr. Kapil. |
| `config/whatsappSupportLink.ts:182` | WhatsApp (Overthinking Test hand-off): कृपया मुझे 21-Day Mind Reset System के बारे में जानकारी भेजें। | WhatsApp (Overthinking Test hand-off): कृपया मुझे 21-Day Overthinking Reset के बारे में जानकारी भेजें। |

## 5. Legal pages

| File | Before | After |
|---|---|---|
| `app/privacy/page.tsx:28` | meta description: …mentoring, and the Quantum Mind app. | meta description: …mentoring, and the Mind Ur Mind App. |
| `app/privacy/page.tsx:38` | …operates mindurmind.org.in and the Quantum Mind app, offering… | …operates mindurmind.org.in and the Mind Ur Mind App, offering… |
| `app/privacy/page.tsx:55` | Usage data from the Quantum Mind app — | Usage data from the Mind Ur Mind App — |
| `app/privacy/page.tsx:56` | …activity across the 30-Day Quantum Speed Reading Masterclass Curriculum and other exercises. | …activity across the Quantum Speed Reading — 30-Day Live Program curriculum and other exercises. |
| `app/privacy/page.tsx:66` | To operate the Quantum Mind app’s progress-tracking… | To operate the Mind Ur Mind App’s progress-tracking… |
| `app/terms/page.tsx:22` | meta description: …franchise program, and the Quantum Mind app. | meta description: …franchise program, and the Mind Ur Mind App. |
| `app/terms/page.tsx:33` | …1-on-1 mentoring, the Quantum Mind & Habit Builder app, and our self-paced courses… | …1-on-1 mentoring, the Mind Ur Mind App, and our self-paced courses… |
| `app/terms/page.tsx:67` | …continued-practice plan after completing the 30-Day Masterclass). | …continued-practice plan after completing the Quantum Speed Reading — 30-Day Live Program). |
| `app/terms/page.tsx:70` | …including the 30-Day Quantum Speed Reading Masterclass’s 100% Results Guarantee… | …including the Quantum Speed Reading — 30-Day Live Program’s 100% Results Guarantee… |
| `app/refund-policy/page.tsx:26` | meta description: Refund and cancellation terms for the 30-Day Quantum Speed Reading Masterclass, Quantum Mindset & Habit Builder, retreats, and other Mind Ur Mind programs. | meta description: Refund and cancellation terms for the Quantum Speed Reading — 30-Day Live Program, 7-Day Free Focus & Reading Starter, retreats, and other Mind Ur Mind programs. |
| `app/refund-policy/page.tsx:36` | …since our 30-Day Quantum Speed Reading Masterclass carries a specific results guarantee… | …since our Quantum Speed Reading — 30-Day Live Program carries a specific results guarantee… |
| `app/refund-policy/page.tsx:41` | H2: 30-Day Quantum Speed Reading Masterclass — 100% Results Guarantee | H2: Quantum Speed Reading — 30-Day Live Program — 100% Results Guarantee |
| `app/refund-policy/page.tsx:81` | H2: Other programs (Retreats, 1-on-1 Mentoring, Habit Builder, Courses) | H2: Other programs (Retreats, 1-on-1 Coaching, Focus & Reading Starter, Courses) |
| `app/refund-policy/page.tsx:83` | These programs don’t carry the Masterclass’s results guarantee… | These programs don’t carry the 30-Day Live Program’s results guarantee… |
| `app/refund-policy/page.tsx:93` | 1-on-1 Mentoring: refundable in full if canceled before your first session… | 1-on-1 Mind Coaching with Dr. Kapil: refundable in full if canceled before your first session… |
| `app/refund-policy/page.tsx:98` | Quantum Mind & Habit Builder: Days 1-7 are free… | 7-Day Free Focus & Reading Starter: Days 1-7 are free… |
| `app/refund-policy/page.tsx:103` | Self-paced courses (e.g. the Overthinking Mastery Course): | Self-paced courses (e.g. the 21-Day Overthinking Reset): |
| `features/legal/components/LegalPageShell.tsx:21` | Legal page default brand: Quantum Mind Learning Lab™ | Legal page default brand: Mind Ur Mind |

## 6. App screens, dashboards, certificates, misc

| File | Before | After |
|---|---|---|
| `app/discover-learning-potential/reading/page.tsx:5` | <title> Reading Discovery™ — Quantum Mind Learning Lab™ | <title> Reading Discovery™ — Mind Ur Mind |
| `app/discover-learning-potential/reading/quantum-speed-reading-intro/page.tsx:6` | <title> Quantum Speed Reading™ — Quantum Mind Learning Lab™ | <title> Quantum Speed Reading™ — Mind Ur Mind |
| `app/discover-learning-potential/memory/page.tsx:5` | <title> Memory Discovery™ — Quantum Mind Learning Lab™ | <title> Memory Discovery™ — Mind Ur Mind |
| `app/discover-learning-potential/who-is-learning/page.tsx:5` | <title> Who Are You Learning With Today? — Quantum Mind Learning Lab™ | <title> Who Are You Learning With Today? — Mind Ur Mind |
| `app/discover-learning-potential/ai-profile/page.tsx:18` | <title> Your AI Learning Profile — Quantum Mind Learning Lab™ | <title> Your AI Learning Profile — Mind Ur Mind |
| `app/discover-learning-potential/learning-potential/page.tsx:5` | <title> Your Learning Potential — Quantum Mind Learning Lab™ | <title> Your Learning Potential — Mind Ur Mind |
| `app/discover-learning-potential/focus/page.tsx:5` | <title> Focus Discovery™ — Quantum Mind Learning Lab™ | <title> Focus Discovery™ — Mind Ur Mind |
| `app/discover-learning-potential/upload-bridge/page.tsx:5` | <title> Your Learning Profile Is Ready — Quantum Mind Learning Lab™ | <title> Your Learning Profile Is Ready — Mind Ur Mind |
| `app/labs/quantum-speed-reading/journey/baseline-diagnostic/page.tsx:7` | <title> Baseline Reading Speed Diagnostic™ — Quantum Mindset & Habit Builder™ | <title> Baseline Reading Speed Diagnostic™ — 21-Day Focus & Reading Program |
| `app/(dashboard)/labs/quantum-speed-reading/journey/[day]/page.tsx:25` | <title> Quantum Mindset & Habit Builder™ | <title> 21-Day Focus & Reading Program |
| `app/(dashboard)/labs/quantum-speed-reading/journey/analytics/page.tsx:12` | <title> Analytics Dashboard™ — Quantum Mindset & Habit Builder™ | <title> Analytics Dashboard™ — 21-Day Focus & Reading Program |
| `app/(dashboard)/labs/quantum-speed-reading/journey/analytics/page.tsx:53` | Analytics eyebrow: Quantum Mindset & Habit Builder™ | Analytics eyebrow: 21-Day Focus & Reading Program |
| `app/(dashboard)/labs/quantum-speed-reading/journey/certificate/page.tsx:13` | <title> Your Completion Certificate™ — Quantum Mindset & Habit Builder™ | <title> Your Completion Certificate™ — 21-Day Focus & Reading Program |
| `app/(dashboard)/labs/quantum-speed-reading/journey/certificate/page.tsx:14` | description: Your official Quantum Mindset & Habit Builder™ completion certificate. | description: Your official 21-Day Focus & Reading Program completion certificate. |
| `app/(dashboard)/labs/quantum-speed-reading/journey/certificate/page.tsx:61` | Certificate page eyebrow: Quantum Mindset & Habit Builder™ | Certificate page eyebrow: 21-Day Focus & Reading Program |
| `features/quantum-journey/certificate/components/CompletionCertificate.tsx:44` | Certificate title: Quantum Mindset & Habit Builder™ | Certificate title: 21-Day Focus & Reading Program |
| `features/quantum-journey/certificate/components/CompletionCertificate.tsx:52` | …has successfully completed all 21 real days of the Quantum Mindset & Habit Builder™ program… | …has successfully completed all 21 real days of the 21-Day Focus & Reading Program… |
| `features/quantum-journey/certificate/components/CompletionCertificate.tsx:103` | Certificate footer: Quantum Mind Learning Lab™ | Certificate footer: Mind Ur Mind App |
| `features/quantum-journey/components/GrandCelebrationScreen.tsx:83` | Quantum Mindset & Habit Builder™ Complete | 21-Day Focus & Reading Program Complete |
| `features/quantum-journey/baselineDiagnostic/components/BaselineDiagnosticExperience.tsx:104` | Every day of your Quantum Mindset & Habit Builder™ journey… | Every day of your 21-Day Focus & Reading Program journey… |
| `components/dashboard/TwentyOneDayJourneyCard.tsx:66` | Dashboard card title: Quantum Mindset & Habit Builder™ | Dashboard card title: 21-Day Focus & Reading Program |
| `app/(dashboard)/dashboard/HabitDashboard.tsx:56` | Day N of your 21-Day Quantum Habit Builder. | Day N of your 21-Day Focus & Reading Program. |
| `components/welcome/ChooseLearningMethodExperience.tsx:126` | Welcome wordmark: Quantum Mind | Welcome wordmark: Mind Ur Mind App |
| `components/welcome/ChooseLearningMethodExperience.tsx:131` | Welcome H1: Quantum Mindset & Habit Builder | Welcome H1: 21-Day Focus & Reading Program |
| `lib/domains/domainTagline.ts:15` | habit subdomain tagline: Quantum Mindset & Habit Builder™ | habit subdomain tagline: 21-Day Focus & Reading Program |
| `features/quantum-journey/readingContent/quantumMindPrograms.ts:26` | Reading passage: The Quantum Mindset & Habit Builder™ program is structured in three distinct weeks… | Reading passage: The 21-Day Focus & Reading Program is structured in three distinct weeks… |
| `app/(marketing)/(legacy)/layout.tsx:38` | Legacy header wordmark: Quantum Mind Learning Lab™ | Legacy header wordmark: Mind Ur Mind App |
| `app/(marketing)/(legacy)/layout.tsx:71` | Legacy footer name: Quantum Mind Learning Lab™ | Legacy footer name: Mind Ur Mind App |
| `app/(marketing)/(legacy)/layout.tsx:82` | Legacy footer ©: Quantum Mind Learning Lab™ | Legacy footer ©: Mind Ur Mind |
| `app/(marketing)/(legacy)/certificates/[token]/page.tsx:72` | Public certificate issuer: Quantum Mind Learning Lab™ | Public certificate issuer: Mind Ur Mind App |
| `app/(marketing)/(legacy)/reviews/page.tsx:120` | Reviews video iframe title: Quantum Mind Learning Lab™ | Reviews video iframe title: Mind Ur Mind |
| `app/preview/layout.tsx:30` | Preview shell brand label: Quantum Mind Learning Lab™ | Preview shell brand label: Mind Ur Mind App |
| `app/(auth)/layout.tsx:23` | Login/sign-up wordmark: Quantum Mind Learning Lab™ | Login/sign-up wordmark: Mind Ur Mind App |
| `components/shell/AppShell.tsx:165` | App shell wordmark: Quantum Mind Learning Lab™ | App shell wordmark: Mind Ur Mind App |
| `app/(dashboard)/library/[id]/page.tsx:35` | Library reader wordmark: Quantum Mind | Library reader wordmark: Mind Ur Mind App |
| `app/discover-welcome-preview/components/QuantumOfferPage.tsx:137` | Offer page wordmark: Quantum Mind | Offer page wordmark: Mind Ur Mind App |
| `app/discover-welcome-preview/components/DiscoverWelcome.tsx:57` | Discover welcome wordmark: Quantum Mind | Discover welcome wordmark: Mind Ur Mind App |
| `components/AppSidebar.tsx:47` | App sidebar fallback wordmark: Quantum Mind | App sidebar fallback wordmark: Mind Ur Mind App |
| `components/Topbar.tsx:72` | Top bar fallback wordmark (×2): Quantum Mind | Top bar fallback wordmark (×2): Mind Ur Mind App |
| `features/visual-intelligence/components/dashboard/NeuralEvolutionCenterpiece.tsx:19` | The global architecture for Quantum Mind Learning Lab™. | The global architecture for Mind Ur Mind App. |
| `features/visual-intelligence/components/dna/NeuralEvolutionIndexPanel.tsx:18` | The global architecture for Quantum Mind Learning Lab™. | The global architecture for Mind Ur Mind App. |
| `app/labs/visual-intelligence/dashboard/page.tsx:98` | Share text: …-day streak. — Quantum Mind Learning Lab™ | Share text: …-day streak. — Mind Ur Mind App |
| `components/NavLinks.tsx:44` | App nav label: 30-Day Masterclass | App nav label: 30-Day Live Program |
| `components/dashboard/ThirtyDayMasterclassHeroCard.tsx:56` | Dashboard hero card title: 30-Day Masterclass | Dashboard hero card title: Quantum Speed Reading — 30-Day Live Program |
| `app/(dashboard)/dashboard/QsrDashboard.tsx:169` | Dashboard section title: Masterclass | Dashboard section title: Quantum Speed Reading — 30-Day Live Program |
| `features/quantum-speed-reading/components/FixationReductionExperience.tsx:26` | Next-stage link: 30-Day Masterclass | Next-stage link: 30-Day Live Program |
| `features/parent-dashboard/components/CurriculumProgressCard.tsx:25` | No 30-Day Masterclass days completed yet. | No 30-Day Live Program days completed yet. |
| `features/pricing/components/PricingPlansGrid.tsx:138` | …enroll in the Masterclass to unlock Document Mastery Studio. | …enroll in the Quantum Speed Reading — 30-Day Live Program to unlock Document Mastery Studio. |
| `features/pricing/components/PricingPlansGrid.tsx:148` | Document Mastery Studio (Upload & Learn) — included with the 30-Day Masterclass | Document Mastery Studio (Upload & Learn) — included with the Quantum Speed Reading — 30-Day Live Program |
| `app/preview/subscription/page.tsx:52` | …unlock unlimited AI document transformations, the 30-Day Masterclass, and more. | …unlock unlimited AI document transformations, the Quantum Speed Reading — 30-Day Live Program, and more. |
| `app/(marketing)/(legacy)/reviews/page.tsx:91` | Real testimonials… across every batch of the 30-Day Masterclass. | Real testimonials… across every batch of the Quantum Speed Reading — 30-Day Live Program. |
| `components/dashboard/AIDocumentTransformerWidget.tsx:659` | Badge: Included with the Masterclass | Badge: Included with the 30-Day Live Program |
| `components/dashboard/AIDocumentTransformerWidget.tsx:681` | Included with the 30-Day Quantum Speed Reading Masterclass — turn any PDF… | Included with the Quantum Speed Reading — 30-Day Live Program — turn any PDF… |
| `app/api/quantum-documents/transform/route.ts:98` | Error: Document Mastery Studio is included with the 30-Day Quantum Speed Reading Masterclass — enroll to unlock it. | Error: Document Mastery Studio is included with the Quantum Speed Reading — 30-Day Live Program — enroll to unlock it. |
| `features/quantum-document-transformer/actions/importQuantumDocumentFromUrl.ts:61` | Error: Document Mastery Studio is included with the 30-Day Quantum Speed Reading Masterclass — enroll to unlock it. | Error: Document Mastery Studio is included with the Quantum Speed Reading — 30-Day Live Program — enroll to unlock it. |
| `components/auth/QuantumMindAppLogin.tsx:55` | …Purchase the ₹499 plan or join the 30-Day Quantum Speed Reading Live Masterclass to continue. | …Purchase the ₹499 plan or join the Quantum Speed Reading — 30-Day Live Program to continue. |
| `components/qsr/speed-test/QsrSpeedTestExperience.tsx:467` | Button: See the 30-Day Masterclass → | Button: See the 30-Day Live Program → |
| `config/executiveBrainWorkshopConfig.ts:113` | Pricing feature: 4 private one-to-one sessions with Dr. Sharma over 21 days | Pricing feature: 4 private one-to-one sessions with Dr. Kapil Dev Sharma over 21 days |
| `config/executiveBrainWorkshopConfig.ts:182` | Testimonial programme label: Personal Class (Mentoring) | Testimonial programme label: 1-on-1 Mind Coaching with Dr. Kapil |
| `config/onlineRetreatGalleryPhotos.ts:14` | Photo alt: Dr. Sharma guiding a live practice | Photo alt: Dr. Kapil Dev Sharma guiding a live practice |
| `features/executive-brain-workshop/components/ExecutiveWorkshopFollowUp.tsx:25` | …a short audio practice by Dr. Sharma… | …a short audio practice by Dr. Kapil Dev Sharma… |
| `features/executive-brain-workshop/components/ExecutiveWorkshopTestimonials.tsx:19` | H2: What participants say about Dr. Sharma's… | H2: What participants say about Dr. Kapil Dev Sharma's… |
| `components/prefrontal-power/PrefrontalPowerHero.tsx:96` | Hero photo alt: Dr. Kapil Sharma, trainer of PREfrontal POWER | Hero photo alt: Dr. Kapil Dev Sharma, trainer of PREfrontal POWER |
| `config/executiveBrainWorkshopConfig.ts:164` | Testimonial programme label (×3): Quantum Speed Reading | Testimonial programme label (×3): Quantum Speed Reading — 30-Day Live Program |
| `public/manifest.json:2` | PWA manifest name: Quantum Mind | PWA manifest name: Mind Ur Mind App |
| `public/manifest.json:3` | PWA short_name: Quantum Mind | PWA short_name: Mind Ur Mind |
| `public/manifest.json:4` | PWA description: AI-powered adaptive learning platform. Master in-demand skills with personalized courses and intelligent tutoring. | PWA description: Mind Ur Mind — Brain, Mind & Meditation Coach. Sharp Brain. Calm Mind. Better Life. |
| `components/brand/LivingBrainLogo.tsx:117` | Logo screen-reader label: Quantum Mind Living Brain Logo | Logo screen-reader label: Mind Ur Mind logo |
| `app/(auth)/login/page.tsx:41` | Login card: Sign in to your Quantum Mind account | Login card: Sign in to your Mind Ur Mind App account |
| `app/discover-welcome-preview/components/QuantumOfferPage.tsx:217` | Offer preview H2: The 5 Pillars of Quantum Mind | Offer preview H2: The 5 Pillars of the Mind Ur Mind App |
| `app/discover-welcome-preview/components/QuantumOfferPage.tsx:311` | Offer preview CTA: Claim My Full Quantum Mind Program Access | Offer preview CTA: Claim My Full Mind Ur Mind App Access |
| `features/parent-dashboard/components/PremiumUpsellCard.tsx:35` | Upsell: Available on Quantum Mind Pro | Upsell: Available on Mind Ur Mind Pro |
| `features/parent-dashboard/components/PremiumUpsellCard.tsx:52` | Upsell button: Upgrade to Quantum Mind Pro | Upsell button: Upgrade to Mind Ur Mind Pro |
| `components/exercises/ProLockedScreen.tsx:27` | Pro lock: …Upgrade to Quantum Mind Pro to unlock… | Pro lock: …Upgrade to Mind Ur Mind Pro to unlock… |
| `lib/exercises/actions/savePracticeSession.ts:59` | Error: This exercise requires Quantum Mind Pro. | Error: This exercise requires Mind Ur Mind Pro. |
| `features/school-dashboard/components/PortalAuthShell.tsx:19` | School/partner portal login wordmark: Quantum Mind | School/partner portal login wordmark: Mind Ur Mind App |
| `components/InstallButton.tsx:108` | Install dialog: Install Quantum Mind | Install dialog: Install Mind Ur Mind App |
| `components/InstallButton.tsx:111` | Install dialog: Add Quantum Mind to your Home Screen… | Install dialog: Add Mind Ur Mind App to your Home Screen… |
| `components/InstallButton.tsx:112` | Install dialog: Add Quantum Mind to your device… | Install dialog: Add Mind Ur Mind App to your device… |
| `components/InstallButton.tsx:133` | Install help: …keep using Quantum Mind for a bit… | Install help: …keep using Mind Ur Mind App for a bit… |
| `components/learning/CameraCaptureExperience.tsx:160` | Camera permission: Quantum Mind needs camera access… | Camera permission: The Mind Ur Mind App needs camera access… |
| `components/welcome/RecordAndLearnExperience.tsx:173` | Mic permission: Quantum Mind needs microphone access… | Mic permission: The Mind Ur Mind App needs microphone access… |
| `components/learning/NewLearningProjectWizard.tsx:548` | In-app label: Quantum Mind™ | In-app label: Mind Ur Mind App |
| `components/welcome/ArrivalExperience.tsx:89` | In-app label: Quantum Mind™ | In-app label: Mind Ur Mind App |
| `components/welcome/ArrivalExperience.tsx:98` | Welcome H1: Welcome to Quantum Mind. | Welcome H1: Welcome to the Mind Ur Mind App. |
| `features/quantum-journey/readingContent/types.ts:26` | Reading category: Quantum Mind Programs | Reading category: Mind Ur Mind App Programs |
| `features/quantum-journey/readingContent/quantumMindPrograms.ts:13` | Reading passage: Quantum Mind is built around three core pillars… | Reading passage: The Mind Ur Mind App is built around three core pillars… |
| `features/quantum-journey/readingContent/quantumMindPrograms.ts:41` | Reading passage: …Quantum Mind instead calculates a "True WPM"… | Reading passage: …the Mind Ur Mind App instead calculates a "True WPM"… |
| `features/quantum-journey/readingContent/quantumMindPrograms.ts:55` | Reading passage: Quantum Mind addresses this through Smart Weakness Targeting… | Reading passage: The Mind Ur Mind App addresses this through Smart Weakness Targeting… |
| `public/datasets/english/beginner.json:41` | Reading dataset author: Quantum Mind Learning Lab™ | Reading dataset author: Mind Ur Mind |
| `public/datasets/hindi/beginner.json:49` | Reading dataset author: Quantum Mind Learning Lab™ | Reading dataset author: Mind Ur Mind |

## 7. AI prompts (server-side, not shown to visitors)

| File | Before | After |
|---|---|---|
| `lib/ai/generatePersistenceChallengeCoachMessage.ts:59` | AI prompt: …founder and lead mentor of Quantum Mind Learning Lab™… | AI prompt: …founder and lead mentor of Mind Ur Mind… |
| `lib/ai/generateVisualDnaCoachMessage.ts:49` | AI prompt: …founder and lead mentor of Quantum Mind Learning Lab™… | AI prompt: …founder and lead mentor of Mind Ur Mind… |
| `lib/ai/generateFixationCoachMessage.ts:52` | AI prompt: …founder and lead mentor of Quantum Mind Learning Lab™… | AI prompt: …founder and lead mentor of Mind Ur Mind… |
| `lib/ai/generateMentorMessage.ts:66` | AI prompt: …founder and lead mentor of Quantum Mind Learning Lab™… | AI prompt: …founder and lead mentor of Mind Ur Mind… |
| `lib/ai/generateAdaptiveCoachMessage.ts:60` | AI prompt: …part of Quantum Mind Learning Lab's Visual Intelligence Lab™ | AI prompt: …part of the Mind Ur Mind App's Visual Intelligence Lab™ |
| `features/ai-mentor-runtime/ai/buildMentorSystemPrompt.ts:22` | AI prompt: You are the AI Mentor for Quantum Mind Learning Lab™ | AI prompt: You are the AI Mentor for Mind Ur Mind App |
| `lib/ai/generateMindScoreInsights.ts:77` | AI prompt: You are the AI Intelligence Analyst for Quantum Mind Learning Lab™ | AI prompt: You are the AI Intelligence Analyst for Mind Ur Mind App |
| `lib/ai/prompts/quantumDocumentTransformerPrompt.ts:24` | AI prompt: You are the AI Document Transformer for Quantum Mind Learning Lab™ | AI prompt: You are the AI Document Transformer for Mind Ur Mind App |
| `lib/ai/prompts/journeyCompletionSummaryPrompt.ts:22` | AI prompt: …completed all 21 real days of their Quantum Mindset & Habit Builder™ journey. | AI prompt: …completed all 21 real days of their 21-Day Focus & Reading Program journey. |
## 8. Follow-up after review

| File | Before | After |
|---|---|---|
| `config/site.config.ts` | Long bio (EN): …and 11 years as a mind trainer, life coach and meditation teacher. | …and more than a decade as a mind trainer, life coach and meditation teacher. |
| `config/site.config.ts` | Long bio (HI): …और 11 वर्ष माइंड ट्रेनर, लाइफ कोच और मेडिटेशन शिक्षक के रूप में। | …और एक दशक से अधिक समय से माइंड ट्रेनर, लाइफ कोच और मेडिटेशन शिक्षक के रूप में। |
| `app/discover-welcome-preview/components/QuantumOfferPage.tsx` | Your Quantum Mind Is Waiting to Be Unlocked. | Your Mind Is Waiting to Be Unlocked. |
| `app/discover-welcome-preview/components/QuantumOfferPage.tsx` | This is where conscious effort ends and Quantum Mind begins. | This is where conscious effort ends and real change begins. |
| `components/TrainerBio.tsx` | (no doctorate line) | Doctorate line renders only when `trainer.doctorate` is set — hidden while it is a TODO |
| `context/LanguageContext.tsx` | `<html lang>` stayed "en" when Hindi was restored from a previous visit | `<html lang="hi">` set on restore too |
