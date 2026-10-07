# Phase 3 · Item 1 — Fair Reading Speed Test (plan for approval)

Branch `feat/phase3-fair-reading-test` · 7 Oct 2026 · **plan only. No code until you approve.**

## Why

Today's checkpoints (Days 1, 7, 14, 21, 30) flash words at a speed the app sets, starting from the learner's last result, and each checkpoint uses a different passage that gets longer over the 30 days. So Day 1 and Day 30 aren't the same test, and part of any "improvement" is the app raising its own pace. The guarantee needs a test where only the learner changed.

## 1. The test

**Same difficulty every time: matched test passages ("forms")**
- Every passage is an original short story (no prior knowledge helps), **300 words ± 10**, in plain everyday language. Original stories also mean no learner has met them in the free speed test.
- Each passage is matched on length and on measurable difficulty, then checked by a human:
  - **English:** Flesch–Kincaid grade **6–7**, average sentence length **14–17 words**, at most 3% uncommon words.
  - **Hindi:** **16–19 words per sentence**, everyday vocabulary (no Sanskrit-heavy or technical words), checked by you as a native speaker.
- **5 questions per passage**, always the same mix: 2 facts stated in the text, 1 order/number, 1 main idea, 1 inference. 4 options each; the correct option's position is balanced across forms.
- **Counterbalancing:** each learner is randomly given Form A or Form B for Day 1, and the *other* one for Day 30. Any tiny difference between the two forms then averages out across learners instead of flattering or penalising everyone. A learner never sees the same passage twice.

**Self-paced, honest timing** (reusing the free speed test's engine):
- "Start reading" shows the passage and starts the timer; the learner reads at their own speed and taps **Done**.
- **Done** unlocks only after the end of the passage has been on screen.
- The start and stop times are recorded by the **server**, so the result can't be faked from the device.
- The passage is then **hidden**, and the 5 questions follow (no looking back, so comprehension is real).

**Scoring:**

| Measure | How |
|---|---|
| Reading speed (WPM) | words ÷ minutes from Start to Done |
| Comprehension | correct ÷ 5 × 100% |
| **Effective speed** | **WPM × comprehension %** (e.g. 250 WPM × 80% = 200) |

All three are shown separately. **Validity rules** (same as the free test):
- **Over 700 WPM:** the passage can't have been read, so the result isn't saved and the learner retakes with a **reserve passage** (Form R), never the same text.
- **Under 60% comprehension:** saved honestly, with a gentle "read for meaning first" note.

**Language:**
- **English and Hindi now.** The learner picks the language at the baseline, and **the Day 30 test is locked to the same language** (WPM isn't comparable across languages).
- Other languages later, with the same rules.

## 2. Where it goes in the 30-day plan

| Day | Today | After |
|---|---|---|
| 1 | flashed-word check-in (app-paced) | **Fair baseline** (Form A or B) |
| 7 · 14 · 21 | flashed-word check-ins | **Recommended:** self-paced check-ins with Forms C, D, E, so the 30-day progress line uses one consistent method. Needs 3 more passages per language. |
| 30 | flashed-word final | **Fair final test** (the other of Form A / B) |

Practice again on a checkpoint day uses practice passages, never the test forms, so the forms stay fresh.

## 3. Before/after result screen (shareable)

- **On Day 30:** a result card shows **Day 1 → Day 30** for WPM, comprehension and effective speed, each with its change (e.g. "+38%"), the test language, and the learner's first name exactly as stored.
- **Sharing:** **Share** (the phone's share sheet, e.g. WhatsApp) and **Download** produce an image built from the free test's existing share-card code.
  - The card shows only first name, numbers and dates: no email and no full name.
- The same card feeds **item 2 (the 30-day certificate)**.

## 4. Data

- **New table `reading_tests`** (add-only migration). Each learner can only read and add their own rows; there is no update.
  - Columns: `user_id`, `kind` (baseline / checkpoint / final / retake), `curriculum_day`, `form_id`, `lang`, `word_count`, `elapsed_ms`, `wpm`, `comprehension_percent`, `effective_wpm`, `status`, the answers, `created_at`.
  - It's needed for the guarantee report, the certificate and the admin export.
- **The checkpoint days' summary** keeps being written to `curriculum_day_completions` (`raw_wpm`, `true_wpm` = effective speed, comprehension), so the dashboard and Progress page keep working.
- **No existing rows are changed or deleted.**

## 5. Learners who already did Day 1

Their Day 1 baseline was flashed-word, so it isn't comparable with the new final test. At the 7 Oct check, 4 production accounts had completed days. My proposal:

- **One-time fair baseline:** at the start of their next session, before the day's first step, they're asked once: "New, fairer reading test — 4 minutes." They can postpone once ("Tomorrow"), and then it's required, since it's the basis of the guarantee.
- **Honest window:** their before/after compares this baseline with Day 30 and says so: "Baseline taken on Day 12."
- **Old results stay:** their earlier flashed-word results stay visible in history as "earlier check-ins (different method)", but never appear in the before/after or on the certificate.
- **Learners who join after launch** simply take the fair test on Day 1.

## 6. Sample passages for review

### English — Form A: "The Lantern Maker" (310 words, Flesch–Kincaid grade 6.3, 15.5 words/sentence)

> Every evening at six, Meera Joshi unlocks a narrow blue door on Station Road and carries out her folding table. The table soon holds more than forty paper lanterns, each one painted by hand. Meera has sold lanterns at the night market for eleven years, but she never planned to.
>
> She trained as a nurse and worked at the district hospital until a back injury forced her to stop. During the long months of rest, her neighbour's son brought her a box of old school paints and a stack of rice paper. He asked if she could make a lantern for his sister's birthday. Meera spent three days on the first one. It leaked light from every corner, but the little girl loved it.
>
> Word spread along the street. Soon people were knocking on her door with requests: a lantern shaped like a fish, one painted with the names of a whole family, one that looked like the moon. Meera began to keep a list on the back of her kitchen calendar. When the list reached sixty names, her brother suggested she take a table at the market.
>
> The first night, she sold only two lanterns. The second night, it rained, and she sold none. On the third night, a schoolteacher bought twenty lanterns for a class festival, and Meera stayed awake until four in the morning painting the last six.
>
> Today she teaches a free class every Sunday at the community hall. Most of her students are children, but the oldest is a retired bus driver who is seventy-eight. Meera says her most important lesson is patience: the paint must dry completely before the paper is folded, or the colours run.
>
> She still keeps every request list. The old calendars are stacked in a cupboard, and the oldest one has a small burn mark from the very first lantern.

**Questions** (✓ = correct; options are shuffled on screen):
1. *(fact)* What was Meera's job before she made lanterns? — **A nurse ✓** · A schoolteacher · A bus driver · A painter
2. *(fact)* Who asked her to make the first lantern? — **Her neighbour's son ✓** · Her brother · A schoolteacher · Her daughter
3. *(order/number)* What happened on her second night at the market? — **It rained and she sold none ✓** · She sold only two · She sold twenty · She stayed up until four
4. *(main idea)* What is the passage mainly about? — **How a hobby begun during recovery became Meera's work and teaching ✓** · How to paint paper lanterns · The history of the night market · Why lanterns are popular at festivals
5. *(inference)* Why does Meera most likely keep the old request lists? — **They remind her how her work began and grew ✓** · She needs them for her accounts · Customers ask to see them · The market requires records

### Hindi — Form A: "चलती-फिरती लाइब्रेरी" (303 words, 17.8 words/sentence)

> हर मंगलवार सुबह सात बजे, सुनीता यादव अपनी पुरानी नीली वैन में किताबों के बक्से रखती हैं और गाँवों की ओर निकल पड़ती हैं। वैन के दोनों ओर लकड़ी की अलमारियाँ लगी हैं, जिनमें लगभग चार सौ किताबें आ जाती हैं। पिछले नौ साल से वह आसपास के बारह गाँवों में यही चलती-फिरती लाइब्रेरी चला रही हैं।
>
> सुनीता एक बैंक में क्लर्क हैं। एक दिन उनकी भतीजी ने शिकायत की कि उसके स्कूल में पढ़ने के लिए कहानी की एक भी किताब नहीं है। सुनीता ने अपने घर से बीस किताबें निकालीं और रविवार को स्कूल के बाहर एक चादर बिछाकर रख दीं। उस दिन तीस से ज़्यादा बच्चे आए, और शाम तक एक भी किताब वापस नहीं आई।
>
> अगले हफ़्ते सारी किताबें लौट आईं, साथ में बच्चों के हाथ से लिखी कुछ चिट्ठियाँ भी, जिनमें और किताबें माँगी गई थीं। सुनीता ने अपने दोस्तों से पुरानी किताबें इकट्ठी करनी शुरू कीं। कुछ पड़ोसी अपने बच्चों की पुरानी कहानियों की किताबें भी दे गए। जब किताबें दो सौ के पार हो गईं, तो उनके पति ने सुझाव दिया कि वह हर मंगलवार की छुट्टी लेकर वैन से गाँवों में जाएँ।
>
> शुरुआत आसान नहीं थी। पहली बार बारिश में वैन कीचड़ में फँस गई, और किसानों को धक्का देकर उसे निकालना पड़ा। दूसरी बार एक गाँव में किसी को पता ही नहीं था कि वैन क्यों आई है, इसलिए कोई नहीं आया।
>
> आज हर गाँव में एक बच्चा 'लाइब्रेरी दोस्त' है, जो बाकी बच्चों को वैन के आने की ख़बर देता है और लौटाई गई किताबों का हिसाब रखता है। सुनीता कहती हैं कि उनका सबसे ज़रूरी नियम एक ही है: किताब लौटाते समय हर बच्चा उसकी कहानी में से एक बात सुनाता है।
>
> उनकी सबसे पुरानी किताब, कहानियों की एक फटी हुई किताब, आज भी वैन के आगे वाले खाने में रखी है।

**प्रश्न** (✓ = सही):
1. *(तथ्य)* सुनीता क्या काम करती हैं? — **बैंक में क्लर्क ✓** · स्कूल में अध्यापिका · किसान · वैन ड्राइवर
2. *(तथ्य)* लाइब्रेरी शुरू करने का ख़याल किसकी शिकायत से आया? — **उनकी भतीजी ✓** · उनके पति · एक किसान · स्कूल के प्रिंसिपल
3. *(क्रम/संख्या)* पहली बार बारिश में क्या हुआ? — **वैन कीचड़ में फँस गई ✓** · कोई बच्चा नहीं आया · किताबें भीग गईं · वैन ख़राब हो गई
4. *(मुख्य विचार)* यह अंश मुख्य रूप से किस बारे में है? — **एक छोटी शुरुआत कैसे गाँवों की चलती-फिरती लाइब्रेरी बन गई ✓** · बच्चों को किताबें क्यों पढ़नी चाहिए · गाँवों में सड़कों की हालत · बैंक की नौकरी के फ़ायदे
5. *(अनुमान)* हर गाँव में 'लाइब्रेरी दोस्त' होने से क्या पता चलता है? — **बच्चे ख़ुद लाइब्रेरी की ज़िम्मेदारी लेने लगे हैं ✓** · सुनीता अब गाँवों में नहीं जातीं · किताबें अब बेची जाती हैं · वैन हर दिन आती है

The Hindi passage is an original Hindi story, not a translation, so it reads naturally. Hindi and English results are never compared with each other.

## 7. Content needed

| | English | Hindi |
|---|---|---|
| Form A, B (Day 1 / Day 30, counterbalanced) | 2 | 2 |
| Form R (retake reserve) | 1 | 1 |
| Forms C, D, E (Days 7/14/21, recommended) | 3 | 3 |
| **Total** | **6** | **6** |

I'll write them all to the same rules. Each one gets the length/difficulty check in code (a test fails if a passage drifts outside the targets), and you review the Hindi.

## 8. Shipping

- **Deploy 6:** the test engine, the forms, the Day 1 / Day 30 integration, the one-time fair baseline for existing learners, the before/after card, and the `reading_tests` migration (staging first, then production with your approval).
- **Testing:** on staging, a new learner's Day 1, a Day 12 learner taking the one-time baseline, and a simulated Day 30 learner seeing the before/after card. In English and Hindi, at 360 px.
- **Then items 2 (certificate) and 3 (attendance)**, as you set.

## 9. Decisions for you

1. Approve the test design (300 ± 10 words, the difficulty targets, 5 questions in the fixed mix, counterbalanced Forms A/B, server timing, no looking back).
2. **Days 7/14/21:** switch to self-paced check-ins too (recommended; 3 more passages per language), or keep the flashed-word check-ins there?
3. **Existing learners:** a one-time fair baseline at their next session, with one postponement allowed, and their report showing "Baseline taken on Day N". OK?
4. **Validity:** a retake with the reserve passage when over 700 WPM; under 60% comprehension saved with a note. OK?
5. Review the 2 sample passages and their questions. Approved, or edits?
6. Approve the add-only `reading_tests` table (staging, then production).
