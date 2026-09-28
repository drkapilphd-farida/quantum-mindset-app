# Sharp Brain page — wording to restore when app features ship

**Update (Phase 8, Item 11):** sections 1 and 4 are no longer restored by
hand. `src/lib/sharpBrainCopy.ts` switches them automatically with
`appFeatures.dayThirtyComparison`, using wording that matches what was built:
- Day 1: "A self-paced reading speed check, 5 comprehension questions and a
  2-minute attention task — your own baseline."
- Day 30: "The same measures again, with a different passage of the same
  level, compared with your Day 1 results."

In Phase 5B, the Sharp Brain page (`src/lib/sharpBrainCopy.ts`) was softened
to describe only what the app does today. Nothing says "coming soon". When a
feature below is built, restore its original wording (EN and HI), then tick it off.

## 1. Day 1 attention check (app item 11: Day 1 vs Day 30 assessment)

**What exists today:** the Day 1 baseline measures reading speed and comprehension only.

| Where | Current wording | Restore to |
|---|---|---|
| `how.steps[0].desc` EN | Reading speed and comprehension — your own baseline. | Reading speed, comprehension and a short attention check — your own baseline. |
| `how.steps[0].desc` HI | रीडिंग स्पीड और समझ — आपका अपना बेसलाइन। | रीडिंग स्पीड, समझ और एक छोटा ध्यान टेस्ट — आपका अपना बेसलाइन। |

## 2. Screen-time goal, focus sessions, streak (app item 12: Mobile Discipline module)

**What exists today:**
- The program teaches simple screen-time habits.
- A daily "phone kept away?" check-in exists, but only in the 21-day starter journey, not in the 30-day program.

| Where | Current wording | Restore to |
|---|---|---|
| `skills` → Mobile Discipline EN | Simple screen-time habits — phone away before practice, the 20-20-20 rule, posture and eye care. | A self-set screen-time goal, focus sessions and a daily streak — built into the program. |
| `skills` → Mobile Discipline HI | स्क्रीन-टाइम की आसान आदतें — अभ्यास से पहले फ़ोन दूर, 20-20-20 नियम, सही बैठना और आंखों की देखभाल। | खुद तय किया स्क्रीन-टाइम लक्ष्य, फोकस सेशन और दैनिक स्ट्रीक — प्रोग्राम में शामिल। |
| `audiences` → parents tab EN | (point removed) | A mobile-discipline routine your child sets and tracks |
| `audiences` → parents tab HI | (point removed) | मोबाइल-डिसिप्लिन की एक दिनचर्या, जिसे आपका बच्चा खुद तय और ट्रैक करता है |
| `parents.points[0]` EN | Simple screen-time habits: phone away before practice, the 20-20-20 rule, posture and eye care | A mobile-habit module: your child sets a daily screen-time goal, runs focus sessions and keeps a streak |
| `parents.points[0]` HI | स्क्रीन-टाइम की आसान आदतें: अभ्यास से पहले फ़ोन दूर, 20-20-20 नियम, सही बैठना और आंखों की देखभाल | मोबाइल-हैबिट मॉड्यूल: आपका बच्चा रोज़ का स्क्रीन-टाइम लक्ष्य तय करता है, फोकस सेशन करता है और स्ट्रीक बनाए रखता है |

## 3. Weekly WhatsApp parent update (app item 13)

**What exists today:** a parent view inside the app, showing reading speed, comprehension and consistency.

| Where | Current wording | Restore to |
|---|---|---|
| `parents.points[1]` EN | About 10 minutes of guided daily practice in the Mind Ur Mind App | A weekly progress update on WhatsApp, so you can see how practice is going |
| `parents.points[1]` HI | Mind Ur Mind App में रोज़ लगभग 10 मिनट का गाइडेड अभ्यास | WhatsApp पर साप्ताहिक प्रगति अपडेट, ताकि आप देख सकें कि अभ्यास कैसा चल रहा है |

## 4. Day 30 comparison (app item 11)

**What exists today:** reading speed and comprehension are tracked over time. There is no Day 30 re-test shown side by side with Day 1.

| Where | Current wording | Restore to |
|---|---|---|
| `hero.sub` EN | …build focus, memory and reading skills — with your progress tracked from Day 1. | …build focus, memory and reading skills — measured from Day 1 to Day 30. |
| `hero.sub` HI | …reading की skills — Day 1 से आपकी प्रगति ट्रैक होती है। | …reading की skills — Day 1 से Day 30 तक नापी हुई। |
| `how.title` EN | Measure, train, practise, track | Measure, train, practise, re-measure |
| `how.title` HI | मापें, सीखें, अभ्यास करें, प्रगति देखें | मापें, सीखें, अभ्यास करें, फिर मापें |
| `how.steps[3]` EN | Track your progress — Your reading speed and comprehension are tracked through the 30 days, so you can see how far you have come from Day 1. | Day 30 re-assessment — The same measures again, compared with your Day 1 results. |
| `how.steps[3]` HI | अपनी प्रगति देखें — पूरे 30 दिन आपकी रीडिंग स्पीड और समझ ट्रैक होती है… | दिन 30 दोबारा असेसमेंट — वही माप दोबारा, आपके दिन 1 के नतीजों से तुलना के साथ। |
| `audiences` → parents tab, last point EN | A parent view in the app showing reading speed, comprehension and practice consistency | You see the Day 1 and Day 30 results side by side |
| `audiences` → parents tab, last point HI | ऐप में अभिभावकों के लिए एक व्यू, जिसमें रीडिंग स्पीड, समझ और अभ्यास की नियमितता दिखती है | आप दिन 1 और दिन 30 के नतीजे साथ-साथ देखते हैं |
| `parents.points[2]` EN | A parent view in the app showing reading speed, comprehension and practice consistency | Day 1 and Day 30 results you can compare |
| `parents.points[2]` HI | ऐप में अभिभावकों के लिए एक व्यू, जिसमें रीडिंग स्पीड, समझ और अभ्यास की नियमितता दिखती है | दिन 1 और दिन 30 के नतीजे, जिनकी आप तुलना कर सकते हैं |

**Left unchanged on purpose:** the positioning line you specified ("…with
improvement measured from your own Day 1 to Day 30"). It is used in the hero,
the homepage card note and the registry. Reading speed and comprehension are
already measured from Day 1 and tracked through the 30 days.
