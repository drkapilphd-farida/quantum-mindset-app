# Sharp Brain — exercise audit

*Inspection only. Nothing in the app, the curriculum or any learner data was changed for this report.*
*Prepared 6 Oct 2026 from the code on `main` (commit `ddc3848`).*

---

## 1. The short version

The app still carries the shape of the old "Quantum Speed Reading" product: **60 exercises in the 30-day curriculum (4 a day)**, plus a 21-day journey and a separate visual-intelligence lab. The reading drills with comprehension checks and the memory grids are solid foundations. But four problems hold the program back more than any single exercise:

1. **Scores are not saved on the server.** `practice_sessions` stores only *which* exercise, *how long*, and *completed yes/no*. Every score, level and personal best lives only in the browser's local storage — lost on a new phone, invisible to the learner over 30 days, and unusable for a "Class 1 vs Class 7" style progress story. This is the single biggest weakness.
2. **About a quarter of the curriculum time goes to exercises that train nothing measurable**: guessing games (Zener Card Sprint, Hidden Target Grid), afterimage staring, and eye-movement "stretches". Research does not support eye exercises for reading speed, and guessing games carry real brand risk (ESP/"intuition").
3. **The 5 promised skills are not what the curriculum is organised around.** The four daily slots are Brain Gym · "Visual Focus & Memory" (internally still `right-brain-intuition`) · Visualisation · Reading. There is **no retention practice** (no spaced review, no active recall of what was read the day before) and **no mobile-discipline practice** in the 30-day program at all.
4. **Little adapts to the learner across the 30 days.** Most exercises reset to the same difficulty each session; the curriculum simply rotates exercises.

**Recommended direction:** keep ~20 exercises (mostly reading + memory), improve ~12, remove or replace ~15, merge ~10, and add five proven exercise types — adaptive n-back, active-recall + one-line summary after reading, spaced review of key facts, a memory-palace/peg trainer, and a focus timer with distraction log. Save scores on the server so learners can see each skill grow.

---

## 2. How each exercise was scored

| Score | Meaning |
|---|---|
| **Learning value** (1–10) | Does it train a real, trainable skill with research behind it (attention, working memory, reading fluency, comprehension, recall, visual processing, self-regulation)? |
| **UX** (1–10) | Clear instructions, immediate feedback, works on a phone, works in all 7 app languages. |
| **Difficulty** (1–10) | Adaptive levels; sensible progression across 30 days. |
| **Gamification** (1–10) | Score, streak, levels, personal best, visible progress. |
| **Measurability** (1–10) | Produces a meaningful number the learner can watch improve (and that is kept). |
| **Brand risk** (1–10) | **Higher = riskier.** Sounds like ESP, intuition, midbrain, "activation", photographic memory, or makes claims the science doesn't support. |

**Recommendation:** KEEP · IMPROVE (what to change) · MERGE (into what) · REMOVE (and what replaces it).

Notes that apply to almost every row:
- **Saved data:** unless stated otherwise, every exercise saves a `practice_sessions` row (duration + completed) and keeps its best score / level **only in the browser** (`qsr-…-best` local-storage keys). Measurability is therefore capped at 5 until scores move to the server.
- **Languages:** the exercises marked **🌐7** were translated in the 7-language release; all others still show English instructions in every language (UX capped at 6).
- **Minutes** are estimated from round counts and timers in the code (±1 min).

### Translated (🌐7) today
Eye Warm-up, Eye Stretch, Eye Span, Fixation Reduction, Regression Control, Reading Speed, RSVP, Phrase Reading (Idea Recognition), Sentence Reading (Idea Recognition), Color-Word Sync Grid, Dot Memory Grid, Word Flash Grid, Calm Breath Balance, Inner Voice Control, Peripheral Vision Activator (Schulte), and the shared result screens.

---

## 3. Full inventory and scores

### 3a. Daily slot 1 — "Brain Gym" (eye, breathing, visual warm-ups)

| # | Exercise | Days | What the learner does | Min | Skill | Learn | UX | Diff | Gam | Meas | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Theta Breathing & Focal Anchor | 1, 16, 28 | Paced breathing while watching a glowing dot | 2 | Calm-discipline | 5 | 6 | 2 | 2 | 1 | **6** | **IMPROVE** → rename "Calm Breathing (2 min)"; drop "theta/alpha" brain-wave claims; add a simple before/after calm rating. |
| 2 | Cardinal Oculomotor Stretches | 2, 17, 29 | Follow a dot up/down/left/right | 1–2 | none | 2 | 6 | 1 | 2 | 1 | **5** | **REMOVE** — eye-muscle stretching does not speed reading (Rayner et al., 2016). Replace with adaptive Schulte (row 9). |
| 3 | Infinity Figure-8 Gliding | 3, 18, 30 | Follow a dot along a figure-8 | 1–2 | none | 2 | 6 | 1 | 2 | 1 | **5** | **REMOVE** — same reason; replace with Flanker attention drill (new). |
| 4 | Peripheral Flash Expander | 4, 19 | Spot flashes at the screen edges | 2 | visual processing | 4 | 6 | 3 | 3 | 3 | 4 | **MERGE** into Rapid Visual Span Expander (row 10). |
| 5 | Tachistoscope Multi-Word Blast | 5, 20 | Multi-word flashes, recall them | 2 | reading fluency (word recognition) | 5 | 6 | 4 | 3 | 3 | 3 | **MERGE** into Rapid Recognition Drill (row 49). |
| 6 | Aura Edge Color Pulsing | 6, 21 | Notice colour pulses at the edge of vision | 1–2 | none | 1 | 5 | 1 | 2 | 1 | **8** | **REMOVE** — "aura" wording; no trainable skill. |
| 7 | Blink-Trigger Micro-Recall | 7 | A word flashes for a blink, then recall it | 2 | memory (iconic → working memory) | 5 | 6 | 3 | 3 | 4 | 3 | **MERGE** into Word Flash Grid (row 25). |
| 8 | Tratak Afterimage Stretches | 8 | Stare at a target, close eyes, hold the afterimage | 2 | none (claimed: retention) | 1 | 5 | 1 | 2 | 1 | **7** | **REMOVE** — afterimages are a retinal effect, not memory; prolonged no-blink staring is uncomfortable for many. |
| 9 | Peripheral Vision Activator (Schulte grid) 🌐7 | 9 (+ journey wk 1) | Tap 1→25 in order on a shuffled grid | 1–2 | attention / visual search | 6 | 8 | 3 | 7 | 6 | 2 | **IMPROVE** → adaptive grid size (3×3 → 6×6), daily personal best on the server, rename "Number Hunt (Schulte grid)". Use as the default Day warm-up. |
| 10 | Rapid Visual Span Expander | 10 | Items flash around a fixation point, faster each round | 2 | visual processing | 5 | 6 | 6 | 5 | 5 | 3 | **KEEP** (absorbs row 4); claim only "take in more at a glance", not "eye span expansion". |
| 11 | Saccadic Eye Jump | 11 | Jump eyes between targets | 2 | none for reading | 2 | 6 | 3 | 5 | 3 | 4 | **REMOVE** — replace with Flanker attention drill. |
| 12 | Cross-Lateral Tap | 12 | A side lights up; tap the opposite side | 2 | inhibition / response control | 5 | 7 | 4 | 5 | 5 | **5** ("whole-brain" claim) | **IMPROVE** → keep the mechanic (it's a genuine go/no-go style response-inhibition task); remove "whole-brain coordination / Brain Gym" claims; add reaction-time personal best. |
| 13 | Fast Pattern Blinking | 13 | A symbol blinks; pick what you saw | 2 | visual processing | 4 | 7 | 4 | 5 | 5 | 2 | **MERGE** into Symbol Flash (row 51). |
| 14 | Peripheral Expanding Circle | 14 | Hold gaze centre while a circle widens | 2 | none for reading | 2 | 6 | 2 | 4 | 2 | 4 | **REMOVE**. |
| 15 | 2-Minute Brain Gym Circuit | 15 (+ journey wk 1) | Short sequence of the above | 2 | mixed | 3 | 6 | 2 | 5 | 2 | **5** | **REMOVE** from curriculum (its parts are being removed). |
| 16 | Eye Warm-up 🌐7 | 22 (+ journey) | Follow a dot to loosen eyes | 1 | none | 2 | 8 | 1 | 2 | 1 | 4 | **REMOVE** from curriculum (keep available as an optional comfort warm-up without claims). |
| 17 | Eye Stretch 🌐7 | 23 | Glance to edges and back | 1 | none | 2 | 8 | 1 | 2 | 1 | 4 | **REMOVE** (same). |
| 18a | Eye Span 🌐7 | 24 | Notice items around a centre dot | 1 | visual processing | 3 | 8 | 1 | 2 | 1 | 3 | **MERGE** into Rapid Visual Span Expander. |
| 18b | Regression Control 🌐7 | 25 | Follow a lead point forward | 1 | reading habit (no back-tracking) | 4 | 8 | 1 | 2 | 1 | 3 | **MERGE** into a guided-pacing mode of Phrase/Sentence Reading (a moving underline). |
| 18c | Fixation Reduction 🌐7 | lab only | Follow highlighted points along a line | 1 | reading habit | 3 | 8 | 1 | 2 | 1 | 3 | **MERGE** (same as 18b). |
| 18d | Reading Speed 🌐7 | 26 | Lines highlight at a set pace | 1 | reading fluency | 4 | 8 | 1 | 2 | 1 | 2 | **MERGE** into guided pacing (as 18b). |
| 18e | RSVP 🌐7 | 27 | Words appear one at a time at a fixed point | 1 | reading fluency (demo) | 4 | 8 | 2 | 2 | 2 | 3 | **IMPROVE** → only with a comprehension check and a comfortable pace; RSVP above ~300 WPM costs comprehension (Rayner et al., 2016) — present it as a pacing exercise, never as "how speed readers read". |

### 3b. Daily slot 2 — "Visual Focus & Memory" (internal name: `right-brain-intuition`)

| # | Exercise | Days | What the learner does | Min | Skill | Learn | UX | Diff | Gam | Meas | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 19 | Deep Visualisation Recall (`photographic-memory`) | 1, 11, 21 | Something flashes <1 s; pick the exact match from 4 near-identical options | 3 | visual memory / attention to detail | 6 | 6 | 6 | 7 | 6 | **6** (internal name "photographic") | **IMPROVE** → rename everywhere (route `/visual-memory` is fine; remove "photographic" from code names, page titles and copy); translate. |
| 20 | High-Speed Pictorial Essence Sprint | 2, 12, 22 | An icon flashes; spot its exact version among 4 | 3 | visual memory | 5 | 6 | 6 | 8 | 6 | 4 ("essences: cosmic, fire…") | **MERGE** with row 19 into one "Visual Detail Memory" exercise with adaptive levels. |
| 21 | Color-Word Sync Grid (Stroop) 🌐7 | 3, 13, 23 | Tap the WORD's meaning or the INK colour, as asked | 3 | attention / inhibition | 7 | 8 | 5 | 8 | 6 | 2 (internal name "hemispheric") | **IMPROVE** → adaptive time limit; save accuracy + reaction time on the server; drop "hemispheric" from internal names. |
| 22 | After-Image / Complementary Color Gazing | 4, 14, 24 | Stare without blinking, then report the afterimage colour ("no right answer") | 2 | none | 1 | 5 | 2 | 4 | 1 | **7** | **REMOVE** — no skill and no correct answer; replace with **Adaptive n-back** (new). |
| 23 | Dot Memory Grid 🌐7 | 5, 15, 25 | Dots flash on a grid; tap where they were | 3 | visuospatial working memory | 8 | 8 | 7 | 8 | 6 | 1 | **KEEP** + save level/accuracy on the server; let difficulty carry over between sessions. |
| 24 | Number Flash Grid | 6, 16, 26 | Digits flash in cells; type back what and where | 3 | working memory | 7 | 6 | 7 | 8 | 6 | 1 | **KEEP** + translate + server scores. |
| 25 | Word Flash Grid 🌐7 | 7, 17, 27 | Words flash in cells; recall word and place | 3 | working memory | 7 | 8 | 7 | 8 | 6 | 1 | **KEEP** (absorbs row 7) + server scores. |
| 26 | Image Flash Grid | 8, 18, 28 | Icons flash in cells; recall icon and place | 3 | visuospatial memory | 7 | 6 | 7 | 8 | 6 | 3 ("pure photographic recall" copy) | **IMPROVE** → copy fix ("visual memory"), translate, server scores. |
| 27 | **Zener Card Sprint** | 9, 19, 29 (+ journey wk 3, domain "intuition") | Guess a hidden card among 5 symbols | 2 | **none — chance only** | **1** | 6 | 1 | 7 | **1** | **10** | **REMOVE** — the score is pure luck (20% expected), so it cannot improve; Zener cards are the classic ESP test. Replace with **Adaptive n-back** (days 9, 19, 29). Remove the "intuition" domain from the journey. |
| 28 | **Hidden Target Grid** | 10, 20, 30 | Pick a box that may hide the target | 2 | **none — chance only** | **1** | 6 | 2 | 7 | **1** | **8** | **REMOVE** — guessing; replace with **Memory Palace / Peg trainer** (new) on days 10, 20, 30. |

### 3c. Daily slot 3 — "Visualisation"

| # | Exercise | Days | What the learner does | Min | Skill | Learn | UX | Diff | Gam | Meas | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 29 | Mental Object Rotation | 1, 5, 9, 13, 17, 21, 25, 29 | Memorise a 3D object, imagine it rotated, say which colour faces a direction | 3 | visuospatial working memory | 6 | 6 | 6 | 8 | 6 | 1 | **KEEP** but **use less** (8 days is too many); 3–4 days. Translate. |
| 30 | Color & Scene Transformation Journey | 2, 6, 10, 14, 18, 22, 26, 30 | A scene changes step by step; say what it became | 3 | visual memory / attention | 4 | 6 | 4 | 8 | 5 | 2 | **MERGE** into the Memory Palace trainer as a "picture the change" warm-up, or remove. 8 days is far too many. |
| 31 | **Sensory Imagery Builder** (`sensory-hologram-builder`) | 3, 7, 11, 15, 19, 23, 27 | Voice-guided imagery of a life goal (sight, touch, smell) | 3–4 | calm / motivation (not memory) | 4 | 6 | 1 | 3 | 1 | **6** ("hologram") | **IMPROVE & REPURPOSE** → make it the guided imagery *inside* the memory-palace trainer (imagery is what makes the method of loci work — Dresler et al., 2017), with recall at the end so it becomes measurable. Drop "hologram". Use 2–3 times, not 7. |
| 32 | **Calm Breath Balance** (`fluid-energy-balancer`) 🌐7 | 4, 8, 12, 16, 20, 24, 28 | Hold "Ground It"/"Lift It" to keep a drifting bar balanced ("Earth & Gold vs Air & Water energies") | 3 | sustained attention / fine control (not breathing) | 4 | 7 | 6 | 8 | 5 | **6** ("energies") | **IMPROVE** → the name promises breathing but there is none. Either (a) turn it into real paced breathing with a calm bar that follows a breath cycle, or (b) keep the balance game as "Steady Focus" and drop the energy story. 7 days is too many. |

### 3d. Daily slot 4 — "Reading Intelligence" (Smart Reading)

| # | Exercise | Days | What the learner does | Min | Skill | Learn | UX | Diff | Gam | Meas | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 33 | Dynamic Chunk Sliding | 1, 13 | Text moves in sliding chunks | 3 | reading fluency (chunking) | 5 | 6 | 6 | 6 | 5 | 2 | **MERGE** into Phrase Reading as a level. |
| 34 | Vertical Chunk Sliding | 2, 14 | Chunks slide vertically | 3 | reading fluency | 4 | 6 | 6 | 6 | 5 | 2 | **MERGE** (same). |
| 35 | Flash Recall & Retention Sprint | 3, 15 | Short texts flash; answer questions | 3 | reading + recall | 6 | 6 | 6 | 7 | 6 | 1 | **KEEP** (rename "Flash Recall") + translate. |
| 36 | Vertical Flash Recall | 4, 16 | Same, vertical layout | 3 | reading + recall | 5 | 6 | 6 | 7 | 6 | 1 | **MERGE** into row 35 as a layout option. |
| 37 | Vertical Word Reading | 5, 17 | Words in a vertical column | 3 | reading fluency | 4 | 6 | 6 | 6 | 5 | 1 | **MERGE** into Phrase Reading. |
| 38 | Phrase Reading (mode) | 6, 18 | Read phrase by phrase, comprehension questions | 4 | reading fluency + comprehension | 7 | 6 | 6 | 7 | 6 | 1 | **MERGE** with row 46 (two "Phrase Reading" exercises confuse learners). |
| 39 | Sentence Reading (mode) | 7, 19 | Read sentences, comprehension questions | 4 | comprehension | 7 | 6 | 6 | 7 | 6 | 1 | **MERGE** with row 47. |
| 40 | Paragraph Reading (mode) | 8, 20 | Read paragraphs, comprehension questions | 5 | comprehension | 8 | 6 | 6 | 7 | 6 | 1 | **MERGE** with row 48; keep the best of both. |
| 41 | Guided Paragraph Reading | 9, 21 | Paragraphs with a guided pace | 5 | reading fluency + comprehension | 7 | 6 | 6 | 7 | 6 | 1 | **KEEP** as the guided-pace level of Paragraph Reading. |
| 42 | Inner Voice Control 🌐7 | 10 | Very fast word stream, 3 memory questions | 3 | reading fluency | 4 | 8 | 5 | 6 | 5 | 3 (internal "destroyer") | **IMPROVE** → the claim "faster than your inner voice" overpromises; inner speech can't be switched off and isn't the bottleneck science suggests. Present as a fast-pacing challenge with comprehension. |
| 43 | Visual Memory Reading (`photographic-reading`) | 11 | Read with a visual-memory twist + questions | 3 | reading + recall | 5 | 6 | 6 | 7 | 5 | **6** (internal "photographic") | **MERGE** into Flash Recall; drop "photographic". |
| 44 | Dual-Stream Split Reader | 12 | Read two streams at once | 3 | divided attention | 2 | 6 | 6 | 6 | 5 | 4 | **REMOVE** — reading two texts at once trains multitasking, which harms comprehension. Replace with **Read → one-line summary** (new). |
| 45 | Multi-Line Reading | 23 | Find content across several lines + questions | 4 | reading fluency + comprehension | 6 | 6 | 7 | 7 | 6 | 1 | **KEEP** + translate. |
| 46 | Phrase Reading (Idea Recognition) 🌐7 | 22 | 5 levels of phrase meaning recognition | 4 | comprehension | 8 | 8 | 8 | 8 | 6 | 1 | **KEEP** (absorbs 33, 34, 37, 38). |
| 47 | Sentence Reading (Idea Recognition) 🌐7 | 24 | Themed chapters, whole-idea questions | 5 | comprehension | 8 | 8 | 8 | 8 | 6 | 1 | **KEEP** (absorbs 39). |
| 48 | Paragraph Reading (Meaning Block) | 25 | Paragraph meaning blocks + questions | 5 | comprehension | 8 | 6 | 8 | 8 | 6 | 1 | **KEEP** + translate (absorbs 40). |
| 49 | Rapid Recognition Drill (`word-flash`) | 26 (+ journey) | Words flash; adaptive speed; identify | 3 | word recognition | 6 | 6 | 8 | 8 | 6 | 1 | **KEEP** (absorbs 5) + translate. |
| 50 | Number Flash | 27 | Numbers flash; adaptive | 2 | visual processing | 4 | 6 | 8 | 8 | 6 | 1 | **MERGE** into one "Flash Recognition" exercise with word/number/symbol/mixed modes. |
| 51 | Symbol Flash | 28 | Symbols flash; adaptive | 2 | visual processing | 4 | 6 | 8 | 8 | 6 | 1 | **MERGE** (same). |
| 52 | Mixed Flash | 29 | Mixed items flash; adaptive | 2 | visual processing | 4 | 6 | 8 | 8 | 6 | 1 | **MERGE** (same). |
| 53 | Peripheral Flash | 30 | Items flash in the periphery; adaptive | 2 | visual processing | 4 | 6 | 8 | 8 | 6 | 2 | **MERGE** into Rapid Visual Span Expander. |
| 54 | Progressive Chunk Reading | 30 | Chunk sizes grow by level + questions | 5 | reading fluency + comprehension | 7 | 6 | 9 | 8 | 6 | 1 | **KEEP** (best progression design in the app) + translate. |

### 3e. Checkpoints (Days 1, 7, 14, 21, 30)
| Item | What it does | Verdict |
|---|---|---|
| WPM + comprehension check-in (RSVP passage + questions) | Measures true WPM × comprehension; Day-30 vs Day-1 comparison; stored on the server (`curriculum_day_completions`) | **KEEP** — the most valuable data in the app. **IMPROVE**: measure with *self-paced* reading (like the free Reading Speed Test), not RSVP, so the number reflects how the learner really reads. |

### 3f. 21-day journey (`habit.` app) — extra items not covered above
| Item | Verdict |
|---|---|
| Journey "intuition" domain (Zener) — week 3 | **REMOVE** (see row 27). |
| Reading modes inside the journey (sprint / phrase / vertical / sentence / paragraph / dynamic chunking) | Same verdicts as the matching curriculum rows. |
| **Distraction Parking Lot**, **Power-Three Goals Lock**, **Digital Detox streak** | **KEEP and reuse in the 30-day program** — they are the only mobile-discipline / self-regulation tools in the app today. |
| Baseline diagnostic (Day 1) and certificate | **KEEP**. |

### 3g. Visual-intelligence lab (`/labs/visual-intelligence`) — not in the curriculum
| Item | Verdict |
|---|---|
| Fixation drills (static dot, dynamic dot, multi-dot, peripheral, breath-sync) | **REMOVE from the app menu** — eye-fixation training has no evidence for reading; breath-sync overlaps with Calm Breathing. |
| Candle Tratak, Mandala Tratak, Image Persistence, Persistence Challenge, "Visual DNA", adaptive journey | **REMOVE** — staring/afterimage practices with a mystical framing; highest brand risk outside Zener. Keep the data; just hide the lab. |

---

## 4. The exercises you asked about specifically

- **Zener Card Sprint** — Learning value **1/10**, brand risk **10/10**. A guess among 5 symbols; the expected score is 20% no matter how much you practise, so it can never show progress — it can only teach learners that the app rewards luck. It is also the textbook ESP card. **Remove** (curriculum days 9, 19, 29 and journey week 3).
- **Hidden Target Grid** — **1/10**. Pick a box; every box is the target once per sprint, so the result is chance. **Remove** (days 10, 20, 30).
- **Other intuition/guessing** — the internal category is literally `right-brain-intuition`, and the journey has an `intuition` domain. Rename the category to **Memory** and drop the domain.
- **Eye exercises** (oculomotor stretches, figure-8, saccadic jumps, expanding circle, eye warm-up/stretch/span, fixation reduction, tratak, afterimage) — the research is consistent: reading speed is limited by language processing, not eye muscles, and eye-movement training does not make people read faster with understanding (Rayner, Schotter, Masson, Potter & Treiman, 2016). The instructions are mostly safe, but two are not ideal: long **no-blink staring** (tratak, after-image gazing) causes dry, uncomfortable eyes for many people. **Remove from the curriculum**; at most offer one short, optional "eye comfort break" with blinking and looking into the distance, without any speed claims.
- **Sensory Imagery Builder** — pleasant and calming, but as built it trains nothing measurable and appears on 7 days. Its real value is **imagery for memory**: mental imagery is what makes the memory-palace method work (Dresler et al., 2017). Repurpose it into the new Memory Palace trainer with a recall check at the end.
- **Multi-Sensory Visualisation** — this is the same exercise as the Sensory Imagery Builder (curriculum phase 3 "Multi-Sensory Visualisation") — same verdict.
- **Calm Breath Balance** — the name says breathing but the mechanic is a balance game ("Ground It / Lift It" against drifting "energies"). It does train sustained attention a little, but the mismatch confuses learners and the energy story is off-brand. Either make it real paced breathing (recommended — 2 minutes of slow breathing before practice is a reasonable, low-risk calming routine) or rename it "Steady Focus" and drop the energies.

---

## 5. Gaps — proven exercise types that are missing

Only those that fit the 5 skills and 10–15 minutes a day:

| New exercise | Skill | Why it belongs | Effort |
|---|---|---|---|
| **Adaptive n-back** (visual positions, 1-back → 3-back) | Memory (working memory) + Focus | The best-studied working-memory task; gains are mostly specific to the task (Melby-Lervåg & Hulme, 2013), so we present it as *practice*, not as an IQ booster. Gives a clean, rising number. | M (3–4 days) |
| **Read → recall → one-line summary** | Smart Reading + Retention | After each reading drill: close the text, write/choose the main idea in one line, then answer 2 recall questions. Retrieval practice is among the strongest learning techniques (Dunlosky et al., 2013; Karpicke & Roediger, 2008). | M (3 days) |
| **Spaced review of key facts** (2–3 minute daily "Yesterday's 5") | Retention | Short quizzes on what the learner read 1, 3 and 7 days ago. Spaced practice is the other technique rated "high utility" by Dunlosky et al. (2013). | M–L (4–5 days, needs saved content) |
| **Memory Palace / Peg trainer** (guided) | Memory | Teach one method (loci or number-peg), practise with 10 items, recall, then grow to 20. Real, large effects for lists (Dresler et al., 2017). Uses the Sensory Imagery Builder's narration. | L (5–6 days) |
| **Flanker attention drill** (adaptive) | Focus | Respond to the centre arrow, ignore the flankers; reaction time + accuracy. A standard attention task, quick and phone-friendly. | S (2 days) |
| **Focus timer with distraction log** | Mobile discipline | 10–25-minute study timer; each time the learner reaches for the phone, they tap "I got distracted" and note why. Weekly chart of distractions ↓ and focus minutes ↑. Reuses Distraction Parking Lot + Digital Detox. | M (3 days) |
| **Adaptive Schulte** | Focus | Already exists (row 9); add grid sizes and server personal bests. | S (1 day) |

---

## 6. Is the 30-day structure balanced?

**Today (per day: Brain Gym · Visual Focus & Memory · Visualisation · Reading):**

| Skill (as promised) | Share of curriculum time today | Comment |
|---|---|---|
| Focus | ~10% (Stroop, Schulte, Cross-Lateral) | Mostly hidden inside "Brain Gym" next to eye stretches. |
| Memory | ~25% (memory grids, rotation) | Good exercises, but 30% of the slot is lost to Zener/Hidden Target/afterimage. |
| Smart Reading | ~30% | Solid, but split across ~20 overlapping exercises with different names. |
| Retention | **0%** | No spaced review, no recall of yesterday's reading. |
| Mobile discipline | **0%** | Only exists in the 21-day journey. |
| No measurable skill | **~30%** | Eye drills, guessing, afterimages, imagery without recall, balance game. |

**Progression:** difficulty does not grow across the 30 days — exercises rotate on fixed cycles (every 4th or 10th day) and most restart at the same level each time. The checkpoint days (1, 7, 14, 21, 30) are in the right places; keep them.

### Proposed 30-day plan (≈12–14 minutes a day)

Every day has the same shape so learners build a habit: **Calm start (1) → Focus (2) → Memory (3) → Smart Reading (5–6) → Retention (2) → Focus timer check-in (≤1)**. Levels carry over from day to day, so the same exercise gets harder as the learner improves.

| Day | Calm (1 min) | Focus (2 min) | Memory (3 min) | Smart Reading (5–6 min) | Retention (2 min) | Total | Note |
|---|---|---|---|---|---|---|---|
| 1 ★ | Calm Breathing | Schulte (3×3) | Dot Memory Grid L1 | **Checkpoint**: self-paced reading + 5 questions | — | 13 | Baseline |
| 2 | Calm Breathing | Flanker L1 | Number Flash Grid | Phrase Reading L1 + one-line summary | Yesterday's 5 | 12 | |
| 3 | Calm Breathing | Color-Word (Stroop) | n-back 1-back | Phrase Reading L2 + summary | Yesterday's 5 | 13 | |
| 4 | Calm Breathing | Schulte (4×4) | Memory Palace: intro (5 items) | Flash Recall | Spaced review | 13 | |
| 5 | Calm Breathing | Cross-Lateral (go/no-go) | Word Flash Grid | Phrase Reading L3 + summary | Spaced review | 13 | |
| 6 | Calm Breathing | Flanker L2 | Visual Detail Memory | Rapid Recognition (words) | Spaced review | 12 | |
| 7 ★ | Calm Breathing | Schulte | Dot Memory Grid | **Checkpoint** | Week review | 14 | Week 1 report |
| 8 | Calm Breathing | Stroop L2 | n-back 2-back | Sentence Reading L1 + summary | Spaced review | 13 | |
| 9 | Calm Breathing | Flanker L3 | Memory Palace: 10 items | Sentence Reading L2 + summary | Spaced review | 14 | (was Zener) |
| 10 | Calm Breathing | Schulte (5×5) | Mental Rotation | Multi-Line Reading | Spaced review | 13 | (was Hidden Target) |
| 11 | Calm Breathing | Cross-Lateral L2 | Number Flash Grid L2 | Sentence Reading L3 + summary | Spaced review | 13 | |
| 12 | Calm Breathing | Stroop L3 | Word Flash Grid L2 | Read → recall → summary (long) | Spaced review | 14 | (was Dual-Stream) |
| 13 | Calm Breathing | Flanker L4 | n-back 2-back | Progressive Chunk Reading | Spaced review | 13 | |
| 14 ★ | Calm Breathing | Schulte | Dot Memory Grid | **Checkpoint** | Week review | 14 | Week 2 report |
| 15 | Calm Breathing | Rapid Visual Span | Memory Palace: numbers (peg) | Paragraph Reading L1 + summary | Spaced review | 14 | |
| 16 | Calm Breathing | Stroop L4 | Visual Detail Memory L2 | Paragraph Reading L2 + summary | Spaced review | 14 | |
| 17 | Calm Breathing | Flanker L5 | n-back 3-back | Guided Paragraph Reading | Spaced review | 14 | |
| 18 | Calm Breathing | Schulte (6×6) | Mental Rotation L2 | Paragraph Reading L3 + summary | Spaced review | 14 | |
| 19 | Calm Breathing | Cross-Lateral L3 | Memory Palace: 15 items | Rapid Recognition (mixed) | Spaced review | 13 | (was Zener) |
| 20 | Calm Breathing | Stroop L5 | Word Flash Grid L3 | Read → recall → summary (chapter) | Spaced review | 14 | (was Hidden Target) |
| 21 ★ | Calm Breathing | Schulte | Dot Memory Grid | **Checkpoint** | Week review | 14 | Week 3 report |
| 22–29 | Calm Breathing | rotate Flanker / Stroop / Schulte at personal level | rotate n-back / Memory Palace (20 items) / grids at personal level | **own material**: Upload & Learn chapter + summary on 4 of these days; Paragraph / Progressive Chunk on the others | Spaced review | 13–15 | Transfer to real reading |
| 30 ★ | Calm Breathing | Schulte | Memory Palace: final 20-item recall | **Final checkpoint** | 30-day review | 15 | Day 1 vs Day 30 report + certificate |

Plus, every day from Day 3: the **focus timer + distraction log** for the learner's own study time (outside the 13 minutes), with a one-tap check-in at the end of the daily session.

---

## 7. Gamification proposal (supports learning, not endless screen time)

- **Skill levels per skill** (Focus, Memory, Smart Reading, Retention, Mobile discipline) — each exercise feeds its skill; a level goes up only when accuracy stays high, never just for time spent.
- **Personal bests saved on the server** — visible on every result screen ("Best: 4-back · 2 days ago") and across devices.
- **Skill radar chart** on the progress page — Day 1 shape vs today.
- **Weekly streak, not daily** — "5 of 7 days this week" so one missed day doesn't break motivation; no streak for more than the daily session (the app should tell learners to stop after ~15 minutes).
- **A few meaningful badges** — first checkpoint, first 3-back, first 20-item memory palace, 7-day focus-timer habit, Day 30 complete. No badges for minutes spent.
- **Weekly report** (Days 7/14/21/30) — WPM × comprehension trend, each skill's level, distraction count trend.

---

## 8. Top 10 changes, ranked by impact on learner results and experience

| # | Change | Why it matters | Effort |
|---|---|---|---|
| 1 | **Save every exercise score/level on the server** (new `exercise_results` table; keep `practice_sessions`) | Without it no skill can be shown to improve, and progress is lost on a new phone. Unlocks everything below. | L (5–7 days incl. all exercises) |
| 2 | **Remove the guessing exercises** (Zener, Hidden Target) and the `intuition` naming | Removes the biggest brand risk; frees 6 curriculum slots + journey week 3. | S (1 day + replacements) |
| 3 | **Add Read → recall → one-line summary** after reading drills | Directly improves comprehension and retention — the outcome learners pay for. | M (3 days) |
| 4 | **Add spaced review ("Yesterday's 5")** | Retention is promised but absent today. | M–L (4–5 days) |
| 5 | **Remove eye-movement drills from the curriculum** (keep one optional comfort break) | Frees ~2 minutes a day for skills that transfer; removes unsupported claims. | S (1 day) |
| 6 | **Merge overlapping reading exercises** (≈20 → 8 with levels) | Clearer progression, less confusion ("which Phrase Reading?"), one place to translate. | L (5 days) |
| 7 | **Add adaptive n-back + Flanker** | Gives Memory and Focus clean, rising scores. | M (4–5 days) |
| 8 | **Memory Palace / Peg trainer** (repurposing the imagery builder) | The most striking "I can't believe I remembered 20 items" moment — great for retention and word of mouth. | L (5–6 days) |
| 9 | **Focus timer + distraction log in the 30-day program** | The only way to deliver the "Mobile discipline" promise; reuses journey components. | M (3 days) |
| 10 | **Checkpoint with self-paced reading** + skill radar + weekly report | Makes the Day 1 → Day 30 story honest and visible. | M (3–4 days) |

**Translation** of the remaining English-only exercises should follow the merge (#6) so only the final set is translated.

---

## 9. Keeping existing learners safe in any future change

- Day completion is stored **per day**, not per exercise — swapping an exercise inside a day does not change anyone's completed days, unlocks, streak, checkpoints or certificate eligibility.
- Keep old exercise IDs readable (historic `practice_sessions` rows), map removed exercises to their replacements in reports, and never delete history.
- Roll out the new day plan only for days a learner **hasn't completed yet**; completed days keep showing what they practised, and "Practice again" offers the new version.
- Migrate local personal bests once into the new server table on the learner's next visit, so nobody "loses" their bests.

---

## 10. Summary table — all exercises

| Exercise | Skill | Learn | Meas | Risk | Recommendation |
|---|---|---|---|---|---|
| Theta Breathing & Focal Anchor | Calm | 5 | 1 | 6 | Improve → "Calm Breathing" |
| Cardinal Oculomotor Stretches | — | 2 | 1 | 5 | Remove |
| Infinity Figure-8 Gliding | — | 2 | 1 | 5 | Remove |
| Peripheral Flash Expander | Visual | 4 | 3 | 4 | Merge → Rapid Visual Span |
| Tachistoscope Multi-Word Blast | Reading | 5 | 3 | 3 | Merge → Rapid Recognition |
| Aura Edge Color Pulsing | — | 1 | 1 | 8 | Remove |
| Blink-Trigger Micro-Recall | Memory | 5 | 4 | 3 | Merge → Word Flash Grid |
| Tratak Afterimage Stretches | — | 1 | 1 | 7 | Remove |
| Peripheral Vision Activator (Schulte) | Focus | 6 | 6 | 2 | Improve (adaptive sizes) |
| Rapid Visual Span Expander | Visual | 5 | 5 | 3 | Keep |
| Saccadic Eye Jump | — | 2 | 3 | 4 | Remove |
| Cross-Lateral Tap | Focus | 5 | 5 | 5 | Improve (no "whole-brain") |
| Fast Pattern Blinking | Visual | 4 | 5 | 2 | Merge → Flash Recognition |
| Peripheral Expanding Circle | — | 2 | 2 | 4 | Remove |
| 2-Minute Brain Gym Circuit | mixed | 3 | 2 | 5 | Remove |
| Eye Warm-up / Eye Stretch | — | 2 | 1 | 4 | Remove (optional comfort break) |
| Eye Span | Visual | 3 | 1 | 3 | Merge → Rapid Visual Span |
| Regression Control / Fixation Reduction / Reading Speed | Reading habit | 3–4 | 1 | 2–3 | Merge → guided pacing |
| RSVP | Reading | 4 | 2 | 3 | Improve (with comprehension) |
| Deep Visualisation Recall | Memory | 6 | 6 | 6 | Improve (drop "photographic") |
| Pictorial Essence Sprint | Memory | 5 | 6 | 4 | Merge → Visual Detail Memory |
| Color-Word Sync Grid (Stroop) | Focus | 7 | 6 | 2 | Improve (adaptive, server) |
| After-Image Gazing | — | 1 | 1 | 7 | Remove → n-back |
| Dot Memory Grid | Memory | 8 | 6 | 1 | **Keep** |
| Number Flash Grid | Memory | 7 | 6 | 1 | **Keep** |
| Word Flash Grid | Memory | 7 | 6 | 1 | **Keep** |
| Image Flash Grid | Memory | 7 | 6 | 3 | Improve (copy) |
| **Zener Card Sprint** | — | **1** | **1** | **10** | **Remove → n-back** |
| **Hidden Target Grid** | — | **1** | **1** | **8** | **Remove → Memory Palace** |
| Mental Object Rotation | Memory | 6 | 6 | 1 | Keep (fewer days) |
| Color & Scene Transformation | Memory | 4 | 5 | 2 | Merge / remove |
| Sensory Imagery Builder | Calm | 4 | 1 | 6 | Repurpose → Memory Palace |
| Calm Breath Balance | Focus | 4 | 5 | 6 | Improve (real breathing or rename) |
| Dynamic / Vertical Chunk Sliding | Reading | 4–5 | 5 | 2 | Merge → Phrase Reading |
| Flash Recall & Retention Sprint | Reading + Retention | 6 | 6 | 1 | **Keep** |
| Vertical Flash Recall | Reading | 5 | 6 | 1 | Merge → Flash Recall |
| Vertical Word Reading | Reading | 4 | 5 | 1 | Merge → Phrase Reading |
| Phrase / Sentence / Paragraph Reading (modes) | Reading | 7–8 | 6 | 1 | Merge with Idea-Recognition versions |
| Guided Paragraph Reading | Reading | 7 | 6 | 1 | **Keep** |
| Inner Voice Control | Reading | 4 | 5 | 3 | Improve (honest claim) |
| Visual Memory Reading | Reading | 5 | 5 | 6 | Merge → Flash Recall |
| Dual-Stream Split Reader | — | 2 | 5 | 4 | Remove → Read → summary |
| Multi-Line Reading | Reading | 6 | 6 | 1 | **Keep** |
| Phrase Reading (Idea Recognition) | Reading | 8 | 6 | 1 | **Keep** |
| Sentence Reading (Idea Recognition) | Reading | 8 | 6 | 1 | **Keep** |
| Paragraph Reading (Meaning Block) | Reading | 8 | 6 | 1 | **Keep** |
| Rapid Recognition Drill | Reading | 6 | 6 | 1 | **Keep** |
| Number / Symbol / Mixed / Peripheral Flash | Visual | 4 | 6 | 1–2 | Merge → Flash Recognition |
| Progressive Chunk Reading | Reading | 7 | 6 | 1 | **Keep** |
| Visual-intelligence lab (fixation, tratak, mandala, persistence) | — | 1–2 | 1–3 | 7–9 | Hide the lab |

---

### Sources (well-established reviews)
- Rayner, K., Schotter, E. R., Masson, M. E. J., Potter, M. C., & Treiman, R. (2016). *So much to read, so little time: How do we read, and can speed reading help?* Psychological Science in the Public Interest.
- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). *Improving students' learning with effective learning techniques.* Psychological Science in the Public Interest.
- Karpicke, J. D., & Roediger, H. L. (2008). *The critical importance of retrieval for learning.* Science.
- Melby-Lervåg, M., & Hulme, C. (2013). *Is working memory training effective? A meta-analytic review.* Developmental Psychology.
- Simons, D. J., et al. (2016). *Do "brain-training" programs work?* Psychological Science in the Public Interest.
- Dresler, M., et al. (2017). *Mnemonic training reshapes brain networks to support superior memory.* Neuron.
