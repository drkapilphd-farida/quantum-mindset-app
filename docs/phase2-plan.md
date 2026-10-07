# Sharp Brain — Phase 2 plan

Branch `feat/phase2` · written 7 Oct 2026 · **plan only. No code is written until you approve it.**

Current live deployment (and rollback target for the first Phase 2 deploy): `dpl_EHM9RQJcfEQaEApJ8Nzgn9u9gb93`.

Rules that apply to every part:
- No learner loses progress, streaks, scores or certificates, and nothing a learner has open becomes locked.
- Every learner-facing text has entries in all 8 languages (EN, HI, KN, TA, TE, MR, GU, BN).
- Tests, type-check, lint and a local production build pass before I ask you to deploy.
- Every deploy needs your OK. After each one I send the new deployment ID, what to check on live, and the rollback ID.

Done while writing this plan: Rashmi (rashmipraveen30@gmail.com) signed up at 11:49 IST today. Her 3-month access was granted on the "Continued Practice Access" plan, from 7 Oct 2026 to 7 Jan 2027 23:59 IST. It ends automatically.

---

## ⚠ Found while planning: Day 26 is locked for almost everyone

Day 26 of the 30-day plan opens Word Flash on its own page. That page stays locked until all 6 Eye Foundation drills are finished. Eye Foundation isn't in the 30-day plan and nothing links to it, so a learner reaching Day 26 sees "Locked — complete Reading Preparation first" and can't finish Days 26–30.

This bug is older than Phase 1. Production today: nobody has reached Day 25 yet, but **2 learners have completed Day 20**, so the first learner reaches Day 26 in about 6 days. The fix is Part B step 2 (remove that one condition). **It ships in the first deploy, together with Part A.**

---

## Part A — Sidebar and Live Classes (first deploy)

**What changes**
1. Sidebar "Sharp Brain" opens `/labs/sharp-brain/thirty-day-curriculum` (the 30-day plan).
2. A new sidebar item "Live Classes" opens `/masterclasses`, with the label translated.
3. The `/masterclasses` page is translated: title, intro, tabs ("Masterclass" / "Parents Dashboard"), the upcoming-class list, the recordings list and the mentor card. The Parents tab is already translated. Class titles you type in the admin stay as typed.

**Files:** `src/components/NavLinks.tsx`, `src/app/(dashboard)/masterclasses/page.tsx`, `src/features/live-masterclass/components/{UpcomingCohortSchedule,RecordedMasterclassVault,MentorGuidanceCard}.tsx`, `src/lib/app-i18n/messages/<lang>/nav.json` and a new `liveClasses` section in `dashboard.json`.

**Database:** none.

**Risk to learners:** none. Only links and labels change.

**Bengali:** Bengali doesn't exist in the app until Part F. The Bengali entries for these new strings are written in Part F, and Part F's completeness test fails if any are missing.

**Test**
- Unit test: the sidebar items and their links for app and habit domains.
- The i18n tests: every new key exists in every language.
- At 360px, in English, Hindi and Tamil (the longest), check that "Live Classes" and the page fit.

---

## Part B — Eye Foundation carry-over

### What learners see today
- The 6 Eye Foundation pages (Eye Warm-up, Eye Stretch, Eye Span, Regression Control, Reading Speed, RSVP) still play the old drills.
- They aren't in the 30-day plan.
- The dashboard headline reads "X% through the Eye Foundation Module" for every learner, and the **Mind Score is calculated from Eye Foundation completion**. So nearly every learner sees 0% and a low score, whatever they did in the 30-day plan.

### What changes
1. **Redirect the 6 pages** (permanent redirects, like Phase 1):

   | Old page | Goes to | Why |
   |---|---|---|
   | Eye Warm-up | Calm Breathing | Calm Breathing replaced Eye Warm-up in Phase 1 |
   | Eye Stretch | Focus Warm-ups | eye-stretching drills were removed in Phase 1 |
   | Eye Span | Rapid Visual Span (new version) | same skill, new version with an answer step |
   | Regression Control | Guided Paragraph Reading | the current "keep moving forward" reading mode |
   | Reading Speed | the 30-day plan | speed is measured in the plan's checkpoints (Days 1, 7, 14, 21, 30) |
   | RSVP | **your decision** (see below) | |
   | `/labs/sharp-brain/preparation` (Eye Foundation hub) | the 30-day plan | |

2. **Word Flash unlock:** remove the "Eye Foundation must be complete" condition from the Word Flash page. Inside the plan, Days 26 → 30 still run Word → Number → Symbol → Mixed → Peripheral Flash in order. *(Ships in the first deploy.)*
3. **Nothing locks.**
   - Removing a condition can only open things.
   - No `exercise_progress` rows are changed or deleted. Learners who did Eye Foundation keep those records.
   - **Dashboard headline:** changes to "Day X of 30 · N days complete".
   - **Mind Score:** uses the 30-day plan instead of Eye Foundation, taking whichever is higher of the old Eye Foundation percentage and the 30-day-plan percentage. That way **nobody's score can go down**.
4. **Remove old drill components** once no page imports them. The final list is checked by a build-time search, but the candidates are:
   - the old Visual Activation Suite (`src/components/qsr/visual-activation/`, except the Schulte drill the Focus Warm-ups menu still uses)
   - the old eye drills in `src/features/brain-gym/` (Saccadic Jump, Expanding Circle, the circuit)
   - After-Image Gazing
   - the old Rapid Visual Span feature
   - the 6 Eye Foundation experiences
   - the Eye Foundation module definition, once the Mind Score no longer reads it

**Files:**
- `next.config` / `src/config/legacyRedirects.ts`
- `src/app/labs/sharp-brain/word-flash/page.tsx`
- `src/lib/exercises/queries/exerciseGatingRegistry.ts`
- `src/app/(dashboard)/dashboard/QsrDashboard.tsx`
- `src/app/(dashboard)/progress/page.tsx`
- `src/app/unified-session-preview/page.tsx`
- `src/features/thirty-day-curriculum/curriculumGatedExercises.ts`
- `src/lib/subscription/proGatedQuantumSpeedReadingExercises.ts`
- `src/features/quantum-speed-reading/readingPreparationSteps.ts`
- `dashboard.json` (all languages)
- deletions as listed above

**Database:** none.

**Risk:** low. Completed days, streak, checkpoints and certificates are stored per day or per session, not per Eye Foundation drill, and nothing is deleted from the database.

### What each learner sees after this change
| | Before | After |
|---|---|---|
| **Day 1 learner** | Dashboard: "0% through the Eye Foundation Module"; low Mind Score | "Day 1 of 30 · 0 days complete"; Mind Score follows the 30-day plan. Sidebar "Sharp Brain" opens their plan. Day 1 itself is unchanged. |
| **Day 12 learner** | Days 1–11 done; dashboard still "0% Eye Foundation"; would be **locked at Day 26** | Days 1–11 still done; "Day 12 of 30 · 11 days complete"; Mind Score same or higher. Day 26 opens Word Flash directly. |
| **Finished learner** (none yet in production) | All 30 days done, but Word Flash may have been locked on Day 26 | All 30 days stay done; Word Flash and the other flash drills stay open; old eye links redirect; checkpoint results and certificates unchanged. |

**Test**
- Unit tests: the redirect list; Word Flash allowed without Eye Foundation; Mind Score never lower than before (old and new inputs); dashboard text.
- Build and test that every redirect goes where it should and that no deleted file is still imported.
- A local server against **staging**, with test accounts at Day 1, Day 12 and Day 26.

**Decision needed — RSVP page:**
- (a) redirect to the 30-day plan (recommended: RSVP already lives inside the reading steps), or
- (b) keep it as a standalone reading drill.

---

## Part C — Sensory Hologram Builder

### 1. What it becomes — choose one (no work starts until you choose)

**Option 1 — Memory Palace (method of loci)**
- **How it works:** the voice walks the learner through a familiar place (their home, room by room). They place 5 → 10 items along the route, one vivid image each, using sight, touch and smell. They then recall the items in order straight away, and again at the end of the day's session (delayed recall).
- **Why:**
  - It's the best-known memory technique with research behind it.
  - It produces a real, scored memory number, immediate *and* delayed, which the app doesn't measure anywhere today (see Part G item 2).
  - It directly supports the "Memory" promise.
  - Cost: a new script (about 60–80 lines per language). The 56 goal visualisations would be retired.

**Option 2 — Visualise & Recall (keeps today's guided scenes)**
- **How it works:** the same calm guided visualisation for a chosen goal (career, health, etc.). Afterwards, 3 quick questions about details in the scene (for example, "What did the air smell of?"), and a 1–5 vividness rating.
- **Why:**
  - It keeps the motivational, meditative experience learners already have.
  - It reuses the 56 goal scripts and the recordings you'd make.
  - It turns an unscored exercise into a scored one with little new writing.
  - Downside: it measures listening and imagery attention, not a memory technique learners can use for study.

My recommendation: **Option 1** if the memory guarantee is the priority; **Option 2** if you want the lowest effort and to keep the meditation feel. Until you choose, hold the goal-line recordings. The 13 common lines are safe to record now, since both options open and close the same way.

### 2. Quick win (ships on its own, before the decision)
- Pitch 1.0 instead of 0.85. The lowered pitch is a big part of the robotic sound.
- A new voice ranking for the narration language:
  1. an Indian voice for that language (`en-IN`, `hi-IN`, `kn-IN` …), else any voice in that language
  2. voices whose names mark them as natural or neural ("Natural", "Neural", "Enhanced", "Premium", "Google")
  3. the browser's online voices before installed ones, because online voices are usually far better quality on Chrome/Android
  4. a male voice only as the last tie-breaker
- Speed stays at 0.75.

**Files:** `src/features/sensory-hologram-builder/hologramVoiceSelection.ts` (+ test), `components/SensoryHologramBuilderCanvas.tsx`.

**Database:** none. **Risk:** none (sound only).

**Test:**
- Unit tests with realistic voice lists from Chrome Android, iPhone Safari and Windows Edge.
- A manual listen on your phone.

---

## Part D — Recorded voice system (infrastructure only)

**What changes**
1. **A reusable module, `src/features/guided-audio/`,** for any guided exercise.
   - An exercise provides an ordered list of lines `{ id, text }` and the narration language.
   - The module plays them one at a time, keeps the on-screen caption in sync, and handles pause and resume.
   - It preloads the next line while the current one plays.
   - On iPhone, audio is unlocked by the learner's first tap on "Begin", as Safari requires.
2. **Storage:** a new public-read Supabase Storage bucket `guided-audio`, with files at `guided-audio/<exercise>/<lang>/<lineId>.mp3`.
   - Each language folder has a `manifest.json` listing which lines exist and how long each one is.
   - Only the server (service key) can upload.
3. **Fallback for each line:**
   - Play the recorded MP3.
   - If it's missing from the manifest, fails to load, or doesn't start within 4 seconds, use the browser voice (the improved one from Part C).
   - If the device has no voice, show the timed caption.
   - Because the manifest says in advance which files exist, the app never waits on a missing file.
4. **Narration language follows the app language** (all 8).
   - Today the script exists only in English and Hindi. For KN, TA, TE, MR, GU and BN the captions and voice use the English script, with the "coming soon" note, until those scripts are translated and reviewed.
   - The narration language is recorded with the session.
5. **Stable line IDs in the code**, matching your recording spreadsheet: `common-01` … `common-13`, then `<goal>-<phase>-<n>`. A test fails if the code and the spreadsheet ever disagree.
6. **Recording-prep script `scripts/guided-audio/prepare.mjs`.**
   - Takes your WAV/MP3 files and:
     - trims the silence at the start and end
     - levels the volume (EBU R128 loudness, −16 LUFS)
     - converts to mono 64 kbps MP3
   - Checks each file name against the expected line IDs and reports missing or unknown files.
   - Writes the manifest with the real durations.
   - A second script, `upload.mjs`, uploads to **staging** by default. Production needs an explicit flag and your OK.
7. **Test with sample lines:**
   - Make 3 sample lines with the Mac's built-in voice (2 English, 1 Hindi), run them through the prep script, and upload them to the **staging** bucket.
   - Play a session locally against staging and check: recorded lines play, a deliberately missing line falls back to the browser voice, and turning voices off falls back to captions.
   - The fallback logic gets unit tests, plus one browser test.

**Files:**
- new: `src/features/guided-audio/*`, `scripts/guided-audio/*`, the migration that creates the bucket
- changed: the Sensory Hologram narration script and canvas

**Database:** one additive migration that creates the `guided-audio` bucket and its policy (public read; no learner can write). Staging first; production only with your OK. Rollback file included.

**Risk:** none for learners. Until files are uploaded, playback falls back to the browser voice, exactly as today.

**AI voice estimate for 6 languages (KN, TA, TE, MR, GU, BN)**
- The full Sensory Hologram script is about 29,400 characters per language. For 6 languages that's about 176,000 characters per pass, or about 440,000 allowing for retakes.
- These scripts must first be translated (349 lines per language) and reviewed by native speakers.

| Provider | Price | 6 languages, one pass | With retakes | Notes |
|---|---|---|---|---|
| **Sarvam Bulbul v3** (recommended) | ₹3 per 1,000 chars | about ₹530 | about ₹1,320 | India-focused; **supports Bengali**, plus all 5 other languages |
| Google Chirp 3 HD | $30 per 1M chars | about $5 | about $13 | check per-language voice quality |
| ElevenLabs | Pro plan $99/month | | one month | couldn't confirm support for these 5 languages |

The 13 common lines alone are about 700 characters per language, so a few rupees.

Sources: [Sarvam API pricing](https://www.sarvam.ai/api-pricing), [Sarvam text-to-speech](https://www.sarvam.ai/text-to-speech), [Google Cloud TTS pricing](https://cloud.google.com/text-to-speech/pricing), [ElevenLabs pricing](https://elevenlabs.io/pricing).

---

## Part E — The 2 failing old tests

`src/lib/exercises/queries/getModuleProgress.test.ts` (2 tests, failing since August, before Phase 1).

**Why they fail:** the tests expect an exercise the learner already **completed** to show as **locked** whenever an earlier exercise in the same sequence isn't completed. The code deliberately keeps completed exercises open. That matches your rule that nothing a learner had should become locked.

**Fix:** update the 2 tests to expect what the code does (completed stays completed; only the next incomplete exercise is "current"; the rest are locked). Don't change the code.

**Database:** none. **Risk:** none.

---

## Part F — Bengali (বাংলা), the 8th language

**What changes**
1. **Language list:**
   - `bn` added with the label "বাংলা", review status "pending".
   - It appears automatically everywhere the app's picker is used: login and signup, the top bar, Settings and Welcome.
   - The **website** has its own English/Hindi toggle and stays as it is. A Bengali learner sees website pages in English, the same as Kannada today.
2. **Translations:** all 14 message files, about 1,328 strings (about 36,000 characters).
   - This covers menus, the 30-day plan, day titles, exercise instructions, Part A's new strings and every other string Kannada has today.
   - They're added to the review spreadsheets as `docs/translations/bn.csv`, marked "pending native-speaker review", and `status.json` is refreshed (it's out of date: it lists 1,017 keys; there are 1,328 today).
3. **Practice text stays English**, with the note "Practice text in English — Bengali coming soon". This is automatic: no practice content exists for `bn`.
4. **Dr. Kapil's Note stays English for Bengali** (`mentorNoteLang`).
5. **Font:** Noto Sans Bengali loads only when Bengali is selected, the same way Kannada/Tamil/Telugu/Gujarati load today, so it renders the same on Android, iPhone and desktop.
   - Numbers use Western digits (0–9), like the other languages, so WPM and scores look the same everywhere.
6. **Overflow check:**
   - An automated browser check at 360px and 768px on the main screens in Bengali flags any text wider than its button or card.
   - Screenshots for you; you check on an Android phone and an iPhone.
7. **Reading speed in Bengali mode is saved as English reading** (`content_lang = en`). This is automatic and covered by a test.
8. **Tests:** a test fails if any learner-facing key is missing or empty in **any** of the 8 languages, including Bengali. Today a missing key silently falls back to English.

**Files:**
- `src/lib/app-i18n/languages.ts`
- `src/lib/app-i18n/messages/bn/*.json` (new)
- `src/app/layout.tsx` and `globals.css` (font)
- `src/lib/ai/generateMentorMessage.ts`
- `src/lib/app-i18n/i18n.test.ts`
- `scripts/i18n-csv.mjs`
- `docs/translations/bn.csv`

**Database:** one additive migration. `profiles.preferred_language` currently accepts only the 7 existing codes, so a learner's Bengali choice couldn't be saved. The migration adds `bn` to the allowed values. Rollback file included. The `content_lang` columns don't change (Bengali reading is saved as `en`).

**Risk:** none for existing learners. Only a new option is added.

**Need from you:** a native Bengali reviewer when one is available (not blocking).

---

## Shipping order (separate small deploys)

| # | Deploy | Contains | DB change | Why this order |
|---|---|---|---|---|
| 1 | **Sidebar + Day 26 fix** | Part A + the Word Flash unlock (Part B step 2) | none | first learner reaches Day 26 in about 6 days |
| 2 | Eye Foundation cleanup | the rest of Part B + Part E | none | redirects, dashboard and Mind Score, removal of old drills |
| 3 | Voice quick win | Part C step 2 | none | small, independent |
| 4 | Bengali | Part F | `preferred_language` adds `bn` | biggest text change; also adds the Bengali entries for deploys 1–3 |
| 5 | Recorded voice system | Part D | `guided-audio` bucket | can go live before recordings exist (falls back to the browser voice); upload your recordings when ready |
| — | Sensory Hologram rebuild | Part C step 1 | maybe | after you choose Option 1 or 2; separate plan section |

Each deploy: tests, type-check, lint, a local production build, then your OK. After it, I send the new deployment ID, what to check on live, and the rollback ID (the previous deployment).

---

## Part G — Promise vs app audit (read-only)

What we promise: visible improvement in **Focus, Memory, Reading Speed and Retention** through 7 live classes + 30 days of app practice, with a guarantee.

These scores come from reading the code and production counts on 7 Oct 2026. Items marked *(estimate)* weren't measured on devices.

| # | Promise point | Score | What exists today | What's missing | To reach 10/10 |
|---|---|---|---|---|---|
| 1 | Measurable before/after (WPM + comprehension) | **5** | Mandatory Day 1 baseline plus checkpoints on Days 7/14/21/30, each saving WPM, comprehension and "true WPM" on the server. Trends on the Progress page and in the parent view. | (a) The speed is the pace the app flashes words at, starting from the learner's last result. Part of any improvement comes from the app raising its own pace, not the learner reading faster. (b) Passages get longer and differ each time, so Day 1 and Day 30 aren't comparable tests. (c) No single "Day 1 vs Day 30" report. | A **self-paced** reading test (the learner reads, then taps "done") with **equivalent passages** of fixed length and difficulty on Day 1 and Day 30, plus fixed comprehension questions. A one-page improvement report: WPM, comprehension and effective WPM, before → after, in the learner's language. |
| 2 | Memory and retention | **3** | Since Phase 1, memory games (Dot, Number, Word and Image grids, Picture Memory) save scores and levels. Checkpoint comprehension is immediate retention. | No delayed recall anywhere. No memory baseline or final test. The dashboard "memory score" comes from Document Studio, not the program. | A short standard memory test on Day 1 and Day 30: a word list with immediate recall, then delayed recall about 10 minutes later in the same session. Plus retention questions on the reading test after a delay. Part C Option 1 adds daily delayed recall. |
| 3 | Focus | **2** | Focus is trained (Schulte grid, Color-Word, glimpse drills). Schulte times and Color-Word accuracy are saved. | Not measured as a score. The dashboard "focus score" comes from an old drill nobody does now, so it's empty. | A 2-minute **Focus Score** on Day 1 and Day 30: Schulte 5×5 time + Color-Word (Stroop) accuracy and reaction time + Go/No-Go errors, combined into 0–100. Simple, standard and repeatable. |
| 4 | Guarantee eligibility | **3** | Completed 30-day-plan days per learner are stored. Paid enrolments by batch are in the admin. | **Live-class attendance isn't tracked at all.** No per-learner view of "attended X/7 classes, completed Y/30 days". No export. | An attendance record per class (mark it in the admin, or join via the app link). An admin table per batch with attended/7, days/30, baseline vs final, and an eligible yes/no. CSV export. |
| 5 | Daily habit | **3** | A daily streak; Practice Again on completed days. | No reminders (no push, no WhatsApp). No recovery after a missed day. Day 31 has no next step. | A WhatsApp reminder at the learner's chosen time (via a WhatsApp Business provider), plus a nudge after 1 missed day. A gentle streak rule (1 free missed day per week). A Day 31 "maintenance plan" (3 short sessions a week) leading to Continued Practice Access. |
| 6 | Parent view | **6** | A Parents tab and dashboard toggle, translated: today's status, 30-day progress, reading-speed trend, comprehension, consistency. | Mostly numbers and charts, with no plain-language summary. Parents use the child's login. | A one-paragraph weekly summary in plain language ("Riya practised 5 of 7 days; reading speed up 18%"), and optionally sent to the parent on WhatsApp weekly. |
| 7 | Shareable result | **3** | Only the older 21-day journey has a certificate with start and final WPM. | **The paid 30-day program has no certificate or result card.** | A Day 30 certificate and a shareable result card (image) with before → after for speed, comprehension, memory and focus, the learner's name exactly as stored, and a verification link. |
| 8 | Admin view for you | **2** | Paid enrolments by batch (payment details). | No progress per learner. No "falling behind" list. No expiring access (such as Rashmi's 3-month plan). No completion rates. | An admin dashboard: learners behind schedule (days missed), access expiring in the next 14 days, completion rate per batch and day, checkpoint averages. |
| 9 | Regional practice content | **2** | Hindi exists for the short chunk-reading passages and the reading test. Everything else is English. | Passages, word lists, RSVP text and reading tests in Hindi and the other 6 languages. | Start with Hindi (largest audience): a passage set and word lists of matched difficulty, then one language at a time with native writers. The language-separated speed records are already in place. |
| 10 | Mobile experience | **5** *(estimate)* | Layouts checked at 360px. Indian-script fonts load only when needed. About 170 KB of shared JavaScript. | Not measured on a low-end Android phone or a slow network. Some pages load about 420 KB of JavaScript. Accessibility (screen reader, contrast, text size) not audited. | A Lighthouse and real-device check on a ₹8–10k Android phone on throttled 3G. A budget of under 3 s to interactive on the Day page. Lazy-load heavy exercises. An accessibility pass. |
| 11 | First-time experience | **6** *(estimate)* | Welcome → choose path → the 30-day plan; Day 1 starts with the baseline test. | Not tested with real new learners. The dashboard headline was about Eye Foundation (fixed in Part B). | Make one big "Start Day 1" button the first thing on the dashboard for a new learner. A 20-second "how your 30 days work" card. Watch 3 new learners use it. |

### Phase 3 roadmap (ordered by impact on student results and on the guarantee)

| Order | Item | Audit # | Before scaling ads? |
|---|---|---|---|
| 1 | Fair reading test: same length and difficulty on Day 1 and Day 30, self-paced (not app-paced), fixed comprehension questions; **effective speed = WPM × comprehension %**; improvement report | 1 | **Must-have** |
| 2 | Day 30 certificate and shareable result card with before → after numbers | 7 | **Must-have** |
| 3 | Live-class attendance + guarantee-eligibility table + CSV export | 4 | **Must-have** |
| 4 | **Pace control:** one new day unlocks per calendar day + a minimum practice time before a day counts as complete (details below) | 5 | **Must-have** (results need daily practice; protects the guarantee) |
| 5 | Memory test (immediate + delayed) and Focus Score, on Day 1 and Day 30 | 2, 3 | **Must-have** (both are promised) |
| 6 | WhatsApp reminders + missed-day nudge + gentle streak rule | 5 | **Must-have** (completion drives results) |
| 7 | Admin dashboard: falling behind, expiring access, completion rates | 8 | **Must-have** |
| 8 | Low-end Android speed and accessibility pass | 10 | **Must-have** (ad traffic is mostly mobile) |
| 9 | First-time "Start Day 1" flow + usability check with 3 new learners | 11 | Should-have |
| 10 | Day 31 maintenance plan → Continued Practice Access | 5 | Should-have |
| 11 | Plain-language weekly parent summary (+ WhatsApp) | 6 | Should-have |
| 12 | Hindi practice content, then the other languages one by one | 9 | Should-have (Hindi), later (others) |
| 13 | The original Phase 2 items: new exercises (Visual Search, Flanker, Go/No-Go, Read → Recall → Summary) and the new 30-day plan, applied only to days a learner hasn't reached | — | Later (keep it after the measurement work, so improvements can be measured) |
| 14 | Lint clean-up of `scripts/` and `public/sw.js` (list below) | — | Low priority |

**Item 4 — pace control (proposal)**

Why: one paid learner completed Days 1–22 in 14 hours (14 Sep); a test account did 7 days in 5 minutes (4 Sep). Improvement comes from spaced, daily practice. A 30-day result squeezed into one afternoon can't deliver the promise, and it makes the guarantee impossible to judge.
- **One new day per calendar day (India time):** Day N opens on the calendar day after Day N-1 was completed, at midnight IST. Completed days always stay open, and Practice Again stays unlimited.
- **Minimum practice time:** a day counts as complete only after about 10 minutes of active practice that day, summed from the exercises' own timers (time when the tab isn't visible doesn't count), plus finishing all of that day's steps. Checkpoint days still need the reading check.
- **Enforced on the server**, in the same place that checks "Day N-1 complete" today, so it can't be bypassed from the browser.
- **Existing learners keep everything:** completed days, unlocked days, streaks and checkpoint results are untouched. The rule applies only to days completed after it goes live. The learner with the Day 3 gap is left as is (your decision, 7 Oct).
- **Exceptions:** an admin switch per learner (for example a reviewer, or a learner catching up after illness), and the dev/staging unlock for testing. Test accounts on production should use that switch, not real days.
- **Learner message (all 8 languages):** "Day N opens tomorrow — your brain grows between sessions." With a countdown, and a "Practise again" link for days already done.
- **Decide before building:** the minimum minutes (suggest 10), whether a missed day stays open until done (suggested), and the IST midnight rule.

**Item 14 — lint clean-up (50 errors, 4 warnings; none is in app code)**

| File | Problems |
|---|---|
| `scripts/admin/provisionUser.mjs` | no-console ×13, explicit-function-return-type ×2 |
| `scripts/admin/revokeUserAccess.mjs` | no-console ×10, explicit-function-return-type ×2 |
| `scripts/i18n-csv.mjs` | explicit-function-return-type ×10, no-console ×3, no-unused-expressions ×4 (warnings) |
| `scripts/i18n-labels.mjs` | explicit-function-return-type ×4, no-console ×1 |
| `scripts/i18n-catalog.mjs` | explicit-function-return-type ×1, no-console ×1 |
| `scripts/i18n-seed.mjs` | explicit-function-return-type ×1, no-console ×1 |
| `public/sw.js` | explicit-function-return-type ×1 |

These are command-line scripts and the service worker, where printing to the console is the intended output. The fix is an ESLint override for `scripts/**` (allow `console`; the scripts are plain JavaScript files, so drop the return-type rule) plus a return type in `sw.js`, then add the whole repo to the CI lint.

Note: item 13 was the original Phase 2 scope; moved to Phase 3 with your OK (7 Oct). Your Phase 2 list (A–F) doesn't include it, so I've moved it into Phase 3.

---

## What I need from you

**Decisions**
1. Approve this plan (or tell me what to change).
2. Part B — RSVP page: (a) redirect to the 30-day plan, recommended, or (b) keep it as a drill.
3. Part C — Sensory Hologram: Option 1 (Memory Palace) or Option 2 (Visualise & Recall).
4. Mind Score (Part B): OK to base it on the 30-day plan, keeping whichever is higher of the old and new value so nobody's score drops?
5. Phase 3: OK to move the original Phase 2 items (new exercises + new plan) there?

**Recordings**
- The 13 common lines in English and Hindi (rows `common-01` … `common-13` in `~/Documents/Projects/MindUrMind/Guided voice scripts/Sensory Hologram voice scripts (EN + HI).xlsx`). Hold the goal lines until decision 3.

**Approvals (each asked again at the time)**
- Deploys 1–5.
- The production migrations: `preferred_language` adds `bn` (deploy 4) and the `guided-audio` bucket (deploy 5).
- Uploading your recordings to production storage.

**Not blocking**
- A native Bengali reviewer (and reviewers for KN, TA, TE, MR, GU, already pending).
