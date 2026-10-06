# Sharp Brain exercises — Phase 1 report

*Branch `feat/exercises-phase1`. Migration applied to production on 6 Oct (approved); code not merged or deployed — waiting for “CONFIRM DEPLOY”.*

## What changed in Phase 1

1. **Scores are saved on the server.** New table `exercise_results` (one row per finished session: score, accuracy, level before/after, rounds, time, programme day, practice-or-not, content language). Learners can only read and add their own rows. Purely additive; rollback file included. The rebuilt exercises keep the level on the server, so it follows the learner to a new phone. Twelve other exercises now also save their score (the memory grids, Color-Word Sync, Deep Visualisation Recall, Color & Scene, Sensory Imagery, Cross-Lateral Tap, Fast Pattern Blinking, the Schulte drill and the WPM-based reading modes).
2. **One shared 10-level trainer** (`src/features/exercise-core`). Every rebuilt exercise has:
   - a 15-second "how to play" demo
   - a first-time practice round that doesn't count
   - feedback after every round
   - **3 good rounds → level up, 2 poor rounds → level down**: good is ≥ 85 % right, poor is < 60 %, so learners settle at about 70–85 % success
   - an end screen with score, level, personal best and **Play again**
   - all text in 7 languages
3. **Rebuilt exercises:**
   - **Mental Object Rotation:**
     - Levels 1–3: a flat shape, 45°/90° turns, 2 options, no timer.
     - Later levels: more options, mirror images, then a colour cube turned once and then twice.
     - After every answer, an animation shows the correct turn.
   - **Picture Memory Sprint** (was "Pictorial Essence Sprint"):
     - Vivid emoji pictures in six themes: animals, fruits, vehicles, places, music, everyday things.
     - Level 1: 3 pictures for 6 s, then 4 options.
     - Higher levels: more pictures and less time, "which was NOT shown?", and recall in order from Level 6.
   - **Dynamic Chunk Sliding:**
     - The current chunk is highlighted and a progress bar runs on top.
     - Chunks grow 1 → 2 → 3 words; the pace starts at 110 WPM.
     - Each passage is followed by 2–3 recall questions and a one-line summary.
     - Score = pace × comprehension (effective WPM).
   - **Vertical Chunk Sliding:**
     - A column, one word at a time at first; long words always shown alone.
     - A comprehension check follows each passage.
   - Both chunk exercises share 18 new short, factual passages in **English and Hindi**.
   - **Calm Breathing** replaces the "Calm Breath Balance" game:
     - Real guided breathing: hold the circle as it grows and breathe in, let go and breathe out as it shrinks.
     - 3 s in / 4 s out at Level 1, the classic 4–6 rhythm at Level 4, up to 5 s in / 2 s pause / 7 s out.
     - Rhythm is measured, and there's a "just follow" option with no tapping.
4. **Removed from the 30-day programme:**
   - Zener Card Sprint and Hidden Target Grid.
   - The eye-movement, staring and afterimage drills: Cardinal Stretches, Figure-8, Aura Edge, Tratak, Saccadic Jump, Expanding Circle, the circuit that bundled them, Theta Breathing, After-Image Gazing, and the Eye Foundation module (Eye Warm-up, Stretch, Span, Regression Control, Reading Speed, RSVP).
   - Replacements, with the plan now written as one explicit table in `curriculumDatabase.ts`:
     - Days 9/19/29 (were Zener) → Dot Memory Grid, Color-Word Sync, Picture Memory Sprint.
     - Days 10/20/30 (were Hidden Target) → Number Flash Grid, Dot Memory Grid, Dot Memory Grid.
     - Journey week 3: Zener → Dot Memory Grid.
     - The daily circuit no longer picks Zener or Hidden Target.
   - Their old links redirect, and the Day 2 / Day 22–29 titles that promised eye training were rewritten in all 7 languages.
5. **Easy starts on the other exercises:**
   - Number, Word and Image Flash Grids: round 1 now shows each item for 800–900 ms. It used to be about 330 ms each.
   - Dot Memory Grid: starts on a 4×4 grid with a 1.5-second first flash.
   - Fast Pattern Blinking: the symbol now shows for 400 ms instead of 220 ms.
   - Inner Voice Control: starts at 300 WPM. It used to start at 800, with no option below 600.
   - Reading modes: default to 200 WPM instead of 250.
6. **Progress is safe.**
   - Day completion is stored per *day*, so changing a day's exercises never changes anyone's completed days, unlocks, streak, checkpoints or certificate.
   - Completed days still show as completed. "Practice again" now plays the new exercises.
   - The removed exercises' old practice history is kept untouched.

## Scores (before → after)

Scale 1–10, higher is better for all seven. "Before" comes from the audit (6 Oct). Brand safety = 11 − the audit's brand-risk score.

### Rebuilt in Phase 1

| Exercise | Learning | Skill fit | UX (7 lang) | Difficulty | Gamification | Measurability | Brand safety |
|---|---|---|---|---|---|---|---|
| Mental Object Rotation | 6 → 7 | 6 → 7 | 6 → 9 | 6 → 10 | 8 → 9 | 6 → 9 | 10 → 10 |
| Picture Memory Sprint (was Pictorial Essence) | 5 → 8 | 6 → 9 | 6 → 9 | 6 → 10 | 8 → 9 | 6 → 9 | 7 → 10 |
| Dynamic Chunk Sliding | 5 → 9 | 6 → 10 | 6 → 8 ¹ | 6 → 9 | 6 → 8 | 5 → 9 | 9 → 10 |
| Vertical Chunk Sliding | 4 → 8 | 5 → 9 | 6 → 8 ¹ | 6 → 9 | 6 → 8 | 5 → 9 | 9 → 10 |
| Calm Breathing (replaces Calm Breath Balance + Theta Breathing) | 4 → 7 | 3 → 8 | 7 → 9 | 6 → 8 | 8 → 7 ² | 5 → 8 | 5 → 10 |

¹ Interface in 7 languages; the passages are in English and Hindi only, with the existing "practice text coming soon" note for the other languages.
² Deliberately calmer: no points race, just rhythm and a slower level.

**What still keeps these below 10:**
- Weekly streak, badges and skill radar (Phase 3).
- Native-language passages for kn/ta/te/mr/gu (needs native writers).
- For rotation: research shows the gains are mostly specific to the task, so its learning value is capped honestly.

### Kept, improved in Phase 1 (easy start and/or server-saved score)

| Exercise | Learning | Skill fit | UX | Difficulty | Gamification | Measurability | Brand safety | Next |
|---|---|---|---|---|---|---|---|---|
| Dot Memory Grid | 8 → 8 | 8 | 8 | 7 → 8 | 8 | 6 → 8 | 10 | 10-level trainer in Phase 2 |
| Number Flash Grid | 7 | 8 | 6 | 7 → 8 | 8 | 6 → 8 | 10 | same |
| Word Flash Grid | 7 | 8 | 8 | 7 → 8 | 8 | 6 → 8 | 10 | same |
| Image Flash Grid | 7 | 8 | 6 | 7 → 8 | 8 | 6 → 8 | 8 | same + copy fix |
| Color-Word Sync (Stroop) | 7 | 8 | 8 | 5 | 8 | 6 → 8 | 9 | adaptive timer (Phase 2) |
| Deep Visualisation Recall | 6 | 7 | 6 | 6 | 7 | 6 → 8 | 5 | drop "photographic" internal name (Phase 3 merge) |
| Color & Scene Transformation | 4 | 5 | 6 | 4 | 8 | 5 → 7 | 9 | merge / Memory Palace (Phase 2) |
| Sensory Imagery Builder | 4 | 4 | 6 | 1 | 3 | 1 → 4 | 5 | becomes Memory Palace imagery (Phase 2) |
| Schulte drill (Peripheral Vision Activator) | 6 | 8 | 8 | 3 | 7 | 6 → 8 | 9 | adaptive 3×3 → 7×7 (Phase 2) |
| Cross-Lateral Tap | 5 | 7 | 7 | 4 | 5 | 5 → 8 | 6 | becomes Go/No-Go (Phase 2) |
| Fast Pattern Blinking | 4 | 6 | 7 | 4 → 6 | 5 | 5 → 8 | 9 | merge into Flash Recognition (Phase 3) |
| Inner Voice Control | 4 | 6 | 8 | 5 → 7 | 6 | 5 → 7 | 8 | honest pacing copy (Phase 3) |
| Phrase / Sentence / Paragraph / Guided Paragraph Reading (modes) | 7–8 | 9 | 6 | 6 → 7 | 7 | 6 → 7 | 10 | merge with Idea-Recognition versions (Phase 3) |
| Vertical Word Reading | 4 | 7 | 6 | 6 → 7 | 6 | 5 → 7 | 10 | merge (Phase 3) |

### Kept, not yet changed (honest flags)

| Exercise | Learning | Skill fit | UX | Difficulty | Gamification | Measurability | Brand safety | Plan |
|---|---|---|---|---|---|---|---|---|
| Rapid Visual Span Expander | 5 | 5 | 6 | 6 | 5 | 3 ³ | 8 | replace with Visual Search (Phase 2) |
| Peripheral Flash Expander | 4 | 4 | 6 | 3 | 3 | 1 ³ | 7 | replace with Flanker (Phase 2) |
| Tachistoscope Multi-Word Blast | 5 | 6 | 6 | 4 | 3 | 1 ³ | 8 | merge into Rapid Recognition (Phase 3) |
| Blink-Trigger Micro-Recall | 5 | 6 | 6 | 3 | 3 | 1 ³ | 8 | merge into Word Flash Grid (Phase 3) |
| Flash Recall Sprint / Vertical Flash Recall | 6 / 5 | 8 | 6 | 6 | 7 | 6 | 10 | merge (Phase 3) |
| Visual Memory Reading | 5 | 7 | 6 | 6 | 7 | 5 | 5 | merge (Phase 3) |
| Dual-Stream Split Reader | 2 | 3 | 6 | 6 | 6 | 5 | 7 | replace with Read → Recall → Summary (Phase 2) |
| Reading Expansion module (Phrase / Multi-Line / Sentence / Paragraph — Idea Recognition) | 6–8 | 9 | 6–8 | 8 | 8 | 6 | 10 | keep; server scores (Phase 3) |
| Flash Intelligence pack (Word / Number / Symbol / Mixed / Peripheral Flash) | 4–6 | 6 | 6 | 8 | 8 | 6 | 9–10 | merge into one Flash Recognition (Phase 3) |
| Progressive Chunk Reading | 7 | 9 | 6 | 9 | 8 | 6 | 10 | keep + translate |

³ These four are watch-only drills: the learner never answers anything, so there is nothing to score. They're the first candidates for the Phase 2 focus exercises.

### Removed from the programme

| Exercise | Before (L / UX / D / G / M / Safety) | Why |
|---|---|---|
| Zener Card Sprint | 1 / 6 / 1 / 7 / 1 / 1 | pure chance; classic ESP test |
| Hidden Target Grid | 1 / 6 / 2 / 7 / 1 / 3 | pure chance |
| After-Image Gazing | 1 / 5 / 2 / 4 / 1 / 4 | no skill, no right answer, no-blink staring |
| Tratak Afterimage Stretches | 1 / 5 / 1 / 2 / 1 / 4 | staring; afterimages are not memory |
| Cardinal Oculomotor Stretches · Figure-8 · Saccadic Eye Jump · Expanding Circle · Aura Edge Pulsing | 1–2 / 5–6 / 1–3 / 2–5 / 1–3 / 3–7 | eye-muscle drills don't improve reading |
| 2-Minute Brain Gym Circuit | 3 / 6 / 2 / 5 / 2 / 6 | bundled the drills above |
| Theta Breathing & Focal Anchor | 5 / 6 / 2 / 2 / 1 / 5 | replaced by Calm Breathing |
| Eye Warm-up / Eye Stretch / Eye Span | 2–3 / 8 / 1 / 2 / 1 / 7–8 | eye drills |
| Regression Control / Reading Speed / RSVP | 4 / 8 / 1–2 / 2 / 1–2 / 8–9 | locked behind the Eye Foundation module; return merged into the reading exercises in Phase 3 |
| Calm Breath Balance | 4 / 7 / 6 / 8 / 5 / 5 | replaced by real guided breathing |

The removed exercises' pages still exist in the lab (except Zener and Hidden Target, which redirect), so nobody hits a broken link.

## Not done in Phase 1 (by design or open)

- The optional 30-second eye relaxation break (palming / looking far away) isn't built. The brief allowed "at most one", so I left it out. Say if you want it.
- The 21-day journey's week 1 still uses Eye Warm-up and the 2-Minute Brain Gym Circuit. Your instruction covered the 30-day programme and journey week 3. Shall I replace these too?
- The visual-intelligence lab (Candle/Mandala Tratak etc.) is untouched and not linked from the programme.
- Phase 2 (new exercises and the new 30-day plan) and Phase 3 (merging the reading variants, gamification) are not started.


## Update after review (6 Oct)

- **Migration applied to production** after an export of the learner-progress tables to `~/MindUrMind-db-backups/before-exercise-results-2026-10-06/`. The export includes `curriculum_day_completions`, `curriculum_day_practice_attempts`, `practice_sessions`, `exercise_progress` and the migration list, plus the rollback SQL. A schema dump needs Docker, which isn't installed. Row counts were unchanged afterwards, and anonymous writes are blocked.
- **The four watch-only drills now have an answer step.** Each ends with "What did you see? Pick 1 of 4", with 10 levels and a saved score:
  - Rapid Visual Span
  - Peripheral Flash
  - Multi-Word Flash (was Tachistoscope)
  - Blink Recall

  Level 1 shows things for 1.5 s (0.9 s for one word). They keep their ids, so history continues, and each has its own page.

  New scores:

  | Drill | Learning | Fit | UX | Difficulty | Gamification | Measurability | Safety |
  |---|---|---|---|---|---|---|---|
  | Rapid Visual Span | 5 → 6 | 5 → 7 | 6 → 9 | 6 → 10 | 5 → 9 | 3 → 9 | 8 → 10 |
  | Peripheral Flash | 4 → 5 | 4 → 6 | 6 → 9 | 3 → 10 | 3 → 9 | 1 → 9 | 7 → 10 |
  | Multi-Word Flash | 5 → 7 | 6 → 8 | 6 → 8 | 4 → 10 | 3 → 9 | 1 → 9 | 8 → 10 |
  | Blink Recall | 5 → 6 | 6 → 7 | 6 → 8 | 3 → 10 | 3 → 9 | 1 → 9 | 8 → 10 |

- **Optional 30-second eye relaxation break** (20-20-20: look about 6 m away for 20 s, then 10 s palming). It's offered before each reading step in the day player. Skippable, no score, no claims.
- **21-day journey week 1:**
  - Calm Breathing replaces Eye Warm-up.
  - The Color-Word grid, at an easy 4-second pace, replaces the 2-Minute circuit.
  - The week is now called "Foundation & Focus".
- **"Brain Gym" is gone from every visible label**, now "Focus Warm-Up" in 7 languages. The website's skill list (EN/HI) now names only exercises that are actually in the programme.

## Tests and checks

- Unit tests: 5,112 passing.
  - The 2 failures in `getModuleProgress.test.ts` also fail on unchanged `main`; they're pre-existing and unrelated.
  - New tests cover: the level engine, breathing patterns, rotation (including a check that the cube animation turns faces exactly as the answer key does), picture levels, chunking, the passage bank, and the curriculum (no removed exercise on any day, no repeats within a day).
- Type-check and lint: clean.
- A full Level 1 Mental Rotation session on staging saved: `score 196, accuracy 100 %, level 1 → 2, rounds 3`.
- 360px screenshots in English and Hindi, at Level 1 and a higher level, for every rebuilt exercise.

## To go live (needs your OK)

1. Apply migration `20261007000001_exercise_results` to production (additive; rollback `supabase/rollbacks/20261007000001_exercise_results.down.sql`).
2. Merge `feat/exercises-phase1` to main and deploy.

Until step 1, the preview can't save scores to production (it falls back to the phone), because the preview uses the production database.
