# Memory Studio + Smart Reader — Step 0 plan

Branch `feat/memory-and-reader` (from main 4456d6f) · written 12 Oct 2026 · **approved 12 Oct with the decisions and scope change in section 0.** Where section 0 differs from the sections below, section 0 wins.

Rules for every build:
- Learner progress, scores, streaks, certificates and completed days are never changed or locked.
- Every learner-facing text is in all **8** app languages: EN, HI, KN, TA, TE, MR, GU and **BN**. (The brief says 7, but Bengali has been live since 7 Oct.)
- Pages are designed for a 360px phone first.
- Banned claims: "photographic memory", "read a book in an hour", "memorise a whole book", and percentage promises.
- Tests, type-check, lint and a local production build must pass. You get screenshots (EN + HI, Level 1 + a higher level) and a staging link.
- Nothing goes live without your **CONFIRM DEPLOY**. No production database change without your OK.

---

## 0. Approved 12 Oct — decisions and scope change

### Decisions
| # | Decision |
|---|---|
| 1 | Pictures are drawn in the app's own flat style, like the Memory Palace. |
| 2 | Name–Face uses illustrated faces drawn by the app: diverse Indian faces (skin tones, ages, hair, glasses, beard, bindi…), clearly not real people. No photo-realistic AI faces. |
| 3 | A learner who reaches Day 30 without a baseline takes the memory test, and their score is shown on its own, without a comparison. |
| 4 | Upload limit: **3 per learner per day**, set in `site.config`. |
| 5 | Voice for the first 4 Learn lessons (Story, Peg, Palace, Chapter) in **EN + HI** (≈ 29 Sarvam credits); captions only for the rest. Credits for the rest: see below. |
| 6 | KN, TA, TE, MR, GU and BN show the picture lists with **English labels** and the note "native version coming" until reviewers check them. All word lists are exported to `docs/translations/` for review. |
| 7 | The daily Dr. Kapil's note (70670eb) is approved for deploy; it ships on its own, separately from this work. |

### Scope change — Upload & Learn is no longer a separate section
a. The Document Studio / Upload & Learn page, the dashboard card, the welcome-screen choice and the menu entry are **hidden behind a flag (default off)**.
   - The code and all existing data stay.
   - `/document-studio` and `/library/*` redirect to the dashboard while the flag is off.
   - The 24 existing uploads stay in the database.

b. The **Smart Reader is built on the app's own passage library**, so every learner uses it in the daily plan without uploading anything.
   - The library has 18 EN + 18 HI passages today. They will be extended with longer, sectioned passages that have pre-written section questions, in EN and HI.
   - KN, TA, TE, MR, GU and BN use the English passages with the note "Practice text in English — native version coming", as today, until native passages are written and reviewed.
   - Questions are pre-written, so **reading the library costs no AI**.

c. **"Use your own material" exists only inside the 30-day plan, Days 22–29:** upload a PDF or paste text → Smart Reader → section questions → Chapter & Book method → review queue.
   - Kept: text reading from PDF/Word/pasted text, the 4 MB limit, AI cost logging and the 3-per-day limit.
   - Dropped from this path: web-page and YouTube import.

d. **Dropped:** the standalone AI extras (separate summary tool, multiple-choice/recall drills, explain-it-back challenge, story, subject lens, keyword icons) and the document library. The mind map survives only inside the Chapter & Book method.

### Effort and cost saved
| | Before | After |
|---|---|---|
| Translating the Upload & Learn page (≈ 1,500 lines of English-only screens) | ≈ 3 days | **0**, because it is hidden |
| Making the full upload analysis answer in KN, TE and BN | ≈ 1 day | **0**: only the Days 22–29 upload path needs section questions + key ideas, in one smaller AI call |
| Smart Reader build | ≈ 8–9 days | ≈ 6 days (one source path for the library; uploads plug into the same sections) |
| **Total programme** | ≈ 5–6 weeks | **≈ 4–5 weeks** |
| AI cost per Smart Reader session | ≈ ₹2.5–5 per upload, every time a learner reads | **₹0 for library reading**; ≈ ₹1.5–4 only for an own-material upload on Days 22–29 (max 3 a day) |

New work instead: longer EN + HI library passages with section questions (writing, ≈ 2 days), and later native passages for the other 6 languages (writers/reviewers).

### Sarvam credits for the remaining voice
- One 90-second lesson is ≈ 1,200 characters ≈ 3.6 credits.
- After the first 4 lessons in EN + HI (≈ 29 credits) about **8 credits** are left.
- Lessons 5–8 in EN + HI: ≈ 29 credits.
- All 8 lessons in KN, TA, TE, MR, GU and BN: ≈ 173 credits (after their scripts are translated and reviewed).
- **Total ≈ 202 credits, plus ≈ 20% for retakes = buy ≈ 250 credits.** At the 3 credits per 1,000 characters rate used so far, that is about ₹250 (check the current price on the Sarvam page before buying).

### Release order (each: tests, staging, preview + screenshots, your CONFIRM DEPLOY)
| # | Release | DB |
|---|---|---|
| 1 | **Memory measurement** (20 words, 10-digit number, 5 name–face pairs), released on its own, before the 15 Oct batch. | none: results go into `exercise_results` |
| 2 | Review queue + dashboard Review card + Story + Peg (+ voice for their lessons) | `review_items`, `memory_creations` |
| 3 | Personal palaces | `memory_palaces` |
| 4 | Chapter & Book, plus the Days 22–29 own-material path; Upload & Learn hidden behind the flag | `chapter_maps` |
| 5 | Smart Reader on the passage library | `document_sections`, `reading_positions` |
| 6 | Number code, Name–Face method, Keyword, Acronyms | none |
| 7 | New 30-day plan (memory + review steps, days not yet reached) | none |
| 8 | Phase 2 focus exercises (Flanker, Go/No-Go, n-back, Visual Search, Focus Score) | — |

### Release 1 — memory measurement (how it works)
- **When:**
  - **Day 1** gets a required "Memory check" step, alongside the fair reading test. A Day 1 learner can't skip it.
  - **Learners already in the program who are on Days 2–7** see a "Take your memory baseline" card in the plan (optional, once). Their result is marked "Baseline · taken on Day N, date".
  - Learners past Day 7 don't get a baseline; on Day 30 their score is shown on its own (decision 3).
  - **Day 30** gets the same required step with an equivalent form.
- **The check (≈ 4 minutes, phone-first):**
  1. **20 words**, shown one at a time (2 s each).
  2. **A 10-digit number** (shown for 10 s, then typed on the number keypad). It also serves as the pause before word recall.
  3. **Word recall:** tap the words you saw in a grid of 40 (20 seen + 20 similar unseen). Score = words found − wrong taps, 0–20. Tapping is used instead of typing so children and all 8 scripts can do it on a phone in the same way.
  4. **5 name–face pairs** (6 s each), then match each face to its name.
- **Score:** each part as a percentage (words /20, digits in the right place /10, pairs /5), plus a **Memory score 0–100** = the average of the three. Day 30 shows "Day 1 → Day 30" for each part when a baseline exists; otherwise the score alone.
- **Fair forms:**
  - Form A (start) and Form B (Day 30) use different word lists of equally common, concrete words, and different faces and names.
  - The number is random each time.
  - Answers are checked **on the server** with a signed answer key (as in the fair reading test), so a result can't be faked from the browser.
- **Languages:**
  - Words come in all 8 languages. EN and HI are written by me; the other 6 are my translations of simple concrete nouns, marked "pending native review" and exported to `docs/translations/`.
  - Names are common Indian names from all regions, written in Devanagari for HI and in English letters elsewhere.
  - Words in the other 6 languages need native review **before the 15 Oct batch relies on them**. Otherwise those learners use the English list with the note (decision 6). The language used is saved with the result, so Day 1 and Day 30 are compared only in the same language.
- **Where it shows:** the result screen; a "Memory" card on the Progress page and in the parent view (baseline date/day, Day 30, change). The certificate is **not** changed in this release; adding memory to it needs your approval of a new design.

---

## 1. What exists today (read from the code and production, 12 Oct)

| Area | What exists | Reuse? |
|---|---|---|
| **Shared exercise engine** (`src/features/exercise-core`) | 10-level engine, demo player, practice round, end screen. Scores, levels and personal bests are saved in `exercise_results`, with a free-form `details` field and the language. | **Yes, for every new method.** No new score table. |
| **Memory Palace** (`src/features/memory-palace`) | A fixed, voice-guided palace of 10 places in all 8 languages (AI voice "shubh", 544 audio files). 40 drawn object pictures. 10 levels. Recall straight away, later the same day, and the next day (8 h – 7 days). Used on Days 3, 7, 11, 15, 19, 23 and 27. Production has 2 palace results so far. | **Yes. It is extended, not rebuilt.** Personal palaces are added next to the guided one. |
| **Guided voice** (`src/features/guided-audio`) | Plays MP3 + caption lines from storage. Falls back to the browser voice, then to captions only. | Yes, for the 60–90 s "Learn" lessons (see decision 6). |
| **Upload & Learn** (`/document-studio`) | Upload a PDF, Word file, text, a web page or a YouTube transcript. Max 4 MB; free tier is 2 documents. The text is read out of the file, and **one AI call** (Claude Haiku 4.5) per upload, cached so the same text is never paid for twice, produces a summary, mind map ("spider notes"), keywords, up to 10 memory hooks, multiple-choice and recall questions, an explain-it-back challenge and a speed-reading view. | **Yes:** upload, text reading, cache, mind map and cost log. Only the reading experience is new. |
| **Upload use** | 24 documents by 8 learners in total; **1 in the last 30 days**. | Low use today, so a redesign is low-risk. |
| **AI cost per upload (measured)** | 56 successful calls, on average 2,709 input + 1,569 output tokens = **≈1.06 US cents ≈ ₹0.90**. Every call is already logged in `ai_cost_log`. | The admin cost view reads this log. |
| **Upload languages** | The AI answers in EN, HI, GU, MR and TA only. The Upload page itself is **English-only** (not translated). | KN, TE and BN must be added; the page must be translated. |
| **RSVP** (Speed Test "Brain Boost") | Shows one word at a fixed interval. No focus letter, no pauses at punctuation, no pause or rewind button. | Only the idea. The Smart Reader word engine is new. |
| **Flashcards** | Exist only in the old, unused `/preview/learning-projects` screens. | **No.** They are replaced by the one review queue. |
| **Spaced review** | **None anywhere.** The exercise audit scored Retention at 0%. | Built new, once, here. |
| **30-day plan** | 4 steps a day. The Memory Palace is on 7 days. Pace control (one new day per calendar day, ~10 min of practice and all steps) is live. 5 learners have started; the furthest is on Day 22. | New steps go only into days a learner hasn't reached. |

---

## 2. Merging with Phase 2 — what changes in the Phase 2 plan

"Phase 2" here means the original new-exercise work from the exercise audit, which was moved to the Phase 3 list as item 13 on 7 Oct. That work was:
- the new exercises: Flanker, Go/No-Go, n-back, Visual Search, and Read → recall → summary;
- "Yesterday's 5" spaced review;
- a Memory Palace / Peg trainer;
- the new 30-day plan, applied only to days a learner hasn't reached yet.

Parts A–G of the 7 Oct Phase 2 document are all done and live; nothing there changes.

| Phase 2 item | Before | Now |
|---|---|---|
| Memory Palace trainer | Build a new trainer | **No new trainer.** The live Memory Palace is extended here with up to 3 personal palaces of 10–20 stations, and the plan keeps using it. |
| Peg trainer ("Memory Palace: numbers (peg)", Day 15) | Separate Phase 2 exercise | **Built once here** as Memory Studio method 2 (Peg 1–10, then 1–20). The plan's Day 15 points to it. |
| "Yesterday's 5" spaced review | Separate daily review of reading | **Replaced by the shared review queue** (1, 3, 7, 14 and 30 days). It feeds both the dashboard "Review" card and a short review step in the plan days. |
| Read → recall → one-line summary | New reading exercise | **Becomes the Smart Reader's "After reading" step** (the learner's own summary, gentle AI feedback, flashcards). The plan's reading days use the Smart Reader. |
| Flashcards | Not in Phase 2 | One engine: flashcards are cards in the review queue. The old preview flashcards are not reused. |
| Memory baseline (audit item "Memory and retention", 3/10) | A word list with recall 10 minutes later | **Replaced by the Day 1 / Day 30 memory measurement**: 20 words, a 10-digit number and 5 name–face pairs, shown in the progress report. |
| Days 22–29 "own material" | Upload & Learn chapter + summary | Smart Reader + **Chapter & Book method**. |
| Flanker, Go/No-Go, n-back, Visual Search, Focus Score | Phase 2 | **Unchanged.** They are still built in Phase 2, after Memory Studio methods 1, 2, 6 and 7. |
| The new 30-day plan | One release | **Released in two steps.** (1) Once methods 1, 2, 6 and 7 are live: the memory step and a daily review step change in the days learners haven't reached. (2) Once the focus exercises exist: the focus step changes. |

### Memory step in the new plan (days learners haven't reached only)
| Days | Memory step |
|---|---|
| 1 | Memory measurement (baseline). Day 1 already has the fair reading test, so the memory part is kept to about 4 minutes. |
| 2–6 | Story method, Levels 1–3 |
| 7–10 | Peg 1–10, then a list on pegs |
| 11–14 | Personal Memory Palace (build your home palace, 10 stations) |
| 15–18 | Peg 1–20, Number Picture Code (first 30 pictures) |
| 19–21 | Palace at 15 stations; Name–Face |
| 22–29 | Chapter & Book method on the learner's own upload (4 days); Keyword method; the learner's own choice of method |
| 30 | Memory measurement (final) + "Day 1 vs Day 30" |
| From Day 2 | A **review step** of 2–5 minutes from the queue. It is skipped on days when nothing is due. |

Pace control stays as it is. All new steps count toward the ~10 minutes and toward "all steps finished".

---

## 3. Part 1 — Memory Studio

A new **Memory Studio** page (`/labs/sharp-brain/memory-studio`) lists the methods. Every method has the same 4 steps: **Learn** (60–90 s animated lesson) → **Guided practice** (Levels 1–10, with pictures) → **Use it on your own content** → **Recall** (now, and in the review queue). The learner always writes or edits the image or story; the AI only suggests (button "Suggest an idea").

| # | Method | What I build | Levels |
|---|---|---|---|
| 1 | Story / Link | Picture items in order. The learner types a short linking story; the AI can suggest one (funny, child-safe). Then recall in order. | L1 = 5 pictures → L10 = 20 words, no pictures |
| 2 | Peg 1–10 → 1–20 | EN: rhyme pegs (1 bun, 2 shoe…). Other languages: shape pegs (1 candle, 2 swan…). Learn the pegs first as flashcards, then hang a list on them; recall by number ("What was on 7?"). | L1 = pegs 1–5 → L10 = 20 items, mixed order |
| 6 | Memory Palace / Journey | Keeps the guided palace. **New:** the learner builds up to 3 personal palaces (home, school/office, route) by naming 10–20 stations in order. They are saved and reused, and items are placed on their own stations. | The current 10 levels, plus personal palaces of 15–20 stations at Levels 8–10 |
| 7 | Chapter & Book | (a) **Chapter Map:** 5–9 key ideas + a simple mind map from an upload; the learner can edit, merge or delete them. (b) **Chapter Journey:** the book is a building, each chapter a room, each key idea a station; numbers use the Number Picture Code. (c) **"Walk the chapter":** recall the ideas in order, then 5 questions. Weak ideas go to the review queue. Wording: "remember the key ideas and structure of a chapter or book". | Not levelled: depends on the chapter |
| 3 | Number Picture Code 00–99 | A ready set of 100 pictures: Major-system sounds for EN and HI, and a picture list for the other languages. Learn them 10 at a time as flashcards, then encode 4 → 6 → 8 → 12 digits, and dates as event + year scenes. | L1 = 4 digits → L10 = 12 digits + dates |
| 4 | Name–Face | **Illustrated faces drawn by the app**: never photos, never real people. Spot one feature → turn the name into a picture word → link the two. | L1 = 3 faces → L10 = 10 |
| 5 | Keyword | A sound-alike word + an image linking it to the meaning, for new words, science terms and foreign vocabulary. Ready-made word sets per language + "add your own words". | L1 = 3 words → L10 = 12 |
| 8 | Acronyms & first-letter sentences | A quick tool: type 5–8 items and build an acronym or sentence (the AI can suggest one). It goes straight to the review queue. | None |

**Memory measurement (Day 1 and Day 30):**
- 20-word list recall (a fixed set of equivalent lists, like the fair reading test), a 10-digit number, and 5 name–face pairs.
- Saved in `exercise_results` as `memory-benchmark`.
- Shown as "Day 1 → Day 30" in the progress report, the parent view and the certificate data.

**Spaced review engine (shared with Phase 2):**
- Every recall item goes into **one queue**: story lists, pegs, numbers, palace items, chapter ideas, flashcards and keywords.
- An item is due 1 → 3 → 7 → 14 → 30 days after it is added. "Remembered" moves it to the next step; "Forgot" moves it back one step and brings it back tomorrow.
- **Dashboard "Review" card:** shows only when something is due, has at most ~5 minutes of items (oldest first), and is skipped silently when nothing is due.

---

## 4. Part 2 — Smart Reader for Upload & Learn

**After upload:**
- Clean the text: remove page numbers and repeated headers/footers, and join broken lines.
- Split it into sections of ~300–500 words by headings and paragraphs.
- Tables, formulas and figures become a "View figure" card that pauses the reader.
- **30-second Preview:** an overview, the headings and 3 "find the answer" questions.

**Reading modes:** Guided Pacer (recommended for study), Phrase/Chunk (reuses the Phase 1 chunk code), RSVP Word Flash, Skim and Normal.
- RSVP shows a focus letter, adds small pauses at commas and full stops and a longer one at paragraph ends, and gives extra time to long words and numbers.
- Indian scripts: words split only at spaces; the focus mark covers a whole letter cluster (`Intl.Segmenter`), so a conjunct is never cut. For Indian scripts the RSVP focus mark is a soft underline on the whole cluster.

**Controls:**
- Tap anywhere or press space to pause/resume, plus a big pause button.
- "Back one sentence" and speed −/+ in steps of 25 WPM.
- **"I'm tired"** saves the place and offers a 1-minute break (breathing or eye break), then resumes there.
- The reading place is saved on the server, so it resumes on any device.
- A gentle break reminder after 12–15 minutes.

**Adaptive speed:**
- Start speed = the learner's own measured WPM (latest fair reading test, else the speed test) + 10%.
- After each section, 2–3 questions:
  - ≥ 85% correct → +5–10% speed next section;
  - 60–84% → same speed;
  - under 60% → −10% speed and a suggestion to switch to Guided Pacer.
- Each session shows **Effective Reading Speed = WPM × comprehension**.

**After reading:**
- The learner writes a one-line summary and gets gentle AI feedback.
- Then the key points and mind map, with flashcards made automatically from the key points (into the review queue).
- A **"Remember this chapter"** button opens the Chapter & Book method with these ideas.

**Privacy and limits:**
- Uploads stay private to the learner (row-level security, as today).
- The page shows: "Upload only material you have the right to use for personal study."
- A daily upload limit per learner, set in `site.config`.
- **Admin view:** AI cost per upload and per learner, from `ai_cost_log`.
- The Upload & Learn page is translated into all 8 languages, and the AI answers in all 8 (KN, TE and BN are added).

---

## 5. Database changes (additive only; staging first; production only with your OK)

One migration per build, each with a rollback file that drops only the new tables. **No existing table or row is changed.**

| Table | For | Main columns |
|---|---|---|
| `review_items` | Shared review queue | user, source (story/peg/number/palace/chapter/flashcard/keyword/name-face/acronym), source reference, front/back, language, step (0–5), `due_at`, last result, times reviewed |
| `memory_palaces` | Personal palaces | user, name, kind (home/school/route), stations (10–20 names in order); at most 3 per learner |
| `memory_creations` | The learner's own stories, peg images, codes and acronyms | user, method, items, the learner's text, level; so "Use it on your own content" can be reopened and reviewed |
| `document_sections` | Smart Reader sections | document, order, kind (text/figure), text, word count, questions (made once and kept) |
| `chapter_maps` | Chapter & Book | document, learner, key ideas (editable), mind map, edited yes/no |
| `reading_positions` | Resume on any device | user, document, section, word, mode, WPM, updated |

Scores (method results, reader sessions, memory measurement) go into the existing `exercise_results`. Every new table has row-level security: learners can only read and write their own rows. Writes go through the server.

---

## 6. AI calls and cost

The model stays Claude Haiku 4.5 (the same as uploads today). Prices: $1 per million input tokens and $5 per million output tokens; ₹ estimated at ₹88 per $1.

| Call | When | Typical cost |
|---|---|---|
| Today's upload analysis (summary, mind map, questions) | Once per upload, cached by content | **₹0.90 (measured)** |
| **New:** Preview + section questions + chapter key ideas | Once per upload, made section by section as the learner reaches them, and kept | ≈ **₹1.5** for a 4,000-word English chapter; ≈ ₹3–4 in Hindi or other Indian scripts (more tokens per word) |
| Summary feedback | Once per finished reading | ≈ ₹0.05 |
| "Suggest an idea" (story, peg image, keyword, acronym) | Only when the learner taps it; max 20 a day per learner | ≈ ₹0.02 each |
| **Total per upload** | | **≈ ₹2.5 (English) to ≈ ₹5 (Indian languages)**; worst case at the 24,000-character cap ≈ ₹8 |

With a limit of **3 uploads per learner per day**, the worst case is ≈ ₹25 per learner per day. Realistically it is far lower: today the whole app sees about one upload a month.

There is **no AI cost** for method practice, faces (drawn by the app), pictures, review or the memory measurement.

---

## 7. Risks

1. **Size.** This is the largest piece of work so far: 8 methods + a reader + a review engine + the measurement, ≈ 6 builds over about 5–6 weeks. To limit risk, each build ships on its own.
2. **Translation volume and native review.** Word lists for pegs, the 100 number pictures and keywords are **language-specific, not translations**. EN and HI can be done well. KN, TA, TE, MR, GU and BN need native checking before learners rely on them. Until then, those languages can show the EN picture lists, with a note.
3. **Pictures.** About 160 new drawings (pegs, 100 number pictures, story items), in the same flat style as the 40 Memory Palace pictures. Generated in code, so there's no image cost, but it is a lot of drawing work.
4. **PDF text quality.** Many Hindi PDFs use old fonts (Kruti Dev etc.), so the text comes out unreadable. I'll detect this and ask the learner to paste the text instead of showing nonsense.
5. **Tables and formulas** are spotted by rules and won't always be right; at worst a table is shown as a figure card.
6. **First learners reach Day 30 around 15 Oct**, before this ships. They have no Day 1 memory baseline. The report would show their Day 30 result only, with an honest note (see decision 4).
7. **The Day 1 length** grows with the memory measurement. Keep it to ≈ 4 minutes.
8. **Child safety of AI suggestions.** The prompt enforces child-safe, kind and non-violent content; the learner can always edit it.
9. **Preview builds use the production database.** All tests run on staging or a local server against staging, as before.

---

## 8. Build order (each one: tests, screenshots, staging, your approval)

| # | Build | Contains | DB |
|---|---|---|---|
| 1 | Review engine + Story + Peg | `review_items`, dashboard Review card, Memory Studio page, methods 1 and 2, **memory measurement** (so new learners get a Day 1 baseline as early as possible) | `review_items`, `memory_creations` |
| 2 | Personal palaces | Method 6 extension | `memory_palaces` |
| 3 | Chapter & Book | Method 7, using the existing upload + mind map | `chapter_maps` |
| 4 | Smart Reader | Sections, preview, 5 modes, controls, adaptive speed, after-reading, translated Upload page, upload limit, admin cost view | `document_sections`, `reading_positions` |
| 5 | Number code, Name–Face, Keyword, Acronyms | Methods 3, 4, 5 and 8 | none |
| 6 | New 30-day plan, step 1 | Memory + review steps on days not yet reached (Phase 2) | none |
| then | Phase 2 focus exercises | Flanker, Go/No-Go, n-back, Visual Search, Focus Score; plan step 2 | — |

---

## 9. Decisions needed

1. **Approve this plan** and the merged Phase 2 order (Memory Studio first; focus exercises after).
2. **Pictures:** drawn in the app's own flat style, like the Memory Palace (recommended, free), **or** commissioned illustrations?
3. **Faces for Name–Face:** illustrated faces drawn by the app from parts such as hair, glasses and face shape (recommended: clearly not real people, no cost), **or** AI-generated images (cost, and they can look like real people)?
4. **Learners who reach Day 30 before the memory measurement exists:** show their Day 30 result with "no Day 1 baseline" (recommended), **or** don't show memory in their report?
5. **Daily upload limit:** 3 per learner per day (recommended)? The free tier keeps its 2-document total.
6. **Voice for the "Learn" lessons:** about 37 Sarvam credits are left (3 credits per 1,000 characters). One 90-second lesson is ≈ 1,200 characters, so all 8 lessons in 8 languages would need ≈ 230 credits. Options: animated captions without voice first (recommended), **or** voice for the first 4 methods in EN + HI only (≈ 29 credits).
7. **The old "Speed reading" tab** in Upload & Learn: replace it with the Smart Reader (recommended)?
8. **Keyword and Number Picture Code in KN, TA, TE, MR, GU, BN:** use the EN picture list with a note until native reviewers check them (recommended)?
