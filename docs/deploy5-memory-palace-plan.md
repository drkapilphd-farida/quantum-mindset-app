# Deploy 5 — Memory Palace (plan for approval)

Branch `feat/phase2` · 7 Oct 2026 · **plan only. No code until you approve.**
Builds on [memory-palace-script.md](memory-palace-script.md) (approved) and the voice files in `~/Documents/Projects/MindUrMind/Memory Palace audio (shubh)/` (8 languages × 67 lines, approved).

## 1. The exercise

**Session (about 5 minutes):**

| Step | What happens | Voice lines | Scored? |
|---|---|---|---|
| 0 | **Next-day recall** — only if a palace from an earlier session is waiting (see below) | common-17 | yes, as `next-day` |
| 1 | Settle | common-01 … 05 | — |
| 2 | Build the palace: front door, the route | common-06 … 08 | — |
| 3 | Place the objects: for each place, the place line, then the object line, with the object's picture | common-09, place-NN, object-N-NN, common-10 | — |
| 4 | Walk back | common-11, 12 | — |
| 5 | **Immediate recall**: for each place, in order, tap the object from 4 pictures | common-13 | yes, as `immediate` |
| 6 | Close | common-15, 16 | — |
| 7 | **End-of-session recall**: after the day's other steps (see below) | common-14 | yes, as `end-of-session` |

**When the end-of-session recall happens:**
- **In the 30-day plan:** the day's player adds one short step after the day's last exercise and before the checkpoint or celebration. The learner then walks the palace again and recalls the objects. The other exercises in between are the natural delay, about 10–20 minutes.
- **Opened on its own, outside the plan:** a card "Come back to check your palace" appears on the page later the same day, after at least 10 minutes. If the learner doesn't come back, nothing is saved for that step.

**Levels (shared 10-level trainer; the level is saved on the server and follows the learner):**

| Level | Places | Choices per place | Extra |
|---|---|---|---|
| 1–3 | 5 | 4 pictures from different sets | — |
| 4 | 6 | 4 | — |
| 5 | 7 | 4 | — |
| 6 | 8 | 4 | — |
| 7 | 8 | 4, including 1 look-alike | — |
| 8 | 9 | 4, with look-alikes | — |
| 9 | 10 | 4, with look-alikes | — |
| 10 | 10 | 6, with look-alikes | — |

- **Moving up:** two sessions in a row with at least 80% on immediate recall.
- **Moving down:** one session under 50%. The level never drops below 1, and a learner's level never resets.
- **Objects:** chosen at random from the 40, never repeating the previous session's objects, so the next-day recall can't be confused.

**Scores (3 rows in `exercise_results` per palace, no database change):**
- `exercise_id = 'memory-palace'`, with `score` and `accuracy_percent` = correct ÷ places × 100.
- `level_start` / `level_end` and `curriculum_day` are filled in as usual.
- `details` holds `{ phase: 'immediate' | 'end-of-session' | 'next-day', palaceId, places, objects: [ids], narrationLang, hoursSince?, delayLabel? }`, well under the 4 KB limit.
- **Yesterday's objects** are read back from the learner's own `immediate` row (`details.objects`), so no new table is needed.
- `content_lang` is left empty. The objects are pictures, so the score doesn't depend on a reading language. The narration language is kept in `details`.

**Skipped days (24-hour recall):**
- **When it's asked:** at the start of the learner's next session, whether that's a 30-day-plan day or opening Memory Palace, **12 hours to 7 days** after the palace was built.
  - Under 12 hours: not asked yet, because that still counts as the same day.
  - Over 7 days: not asked; the palace is marked expired and no score is saved.
- **Still scored after a gap, with a label by time:**

  | Hours since the palace was built | Label |
  |---|---|
  | 12–36 | **24 h** |
  | 36–60 | **48 h** |
  | 60 h – 7 days | **later (N days)** |

  Charts compare like with like: 24 h with 24 h.
- **Only the most recent waiting palace is asked**, so there's never a pile-up of old recalls.

**Mobile first:**
- **Tap targets:** at least 56 px; pictures are in a 2-column grid at 360 px.
- **Pictures:** 40 small bundled SVG icons (about 2–4 KB each, about 120 KB in total), not emoji. Phones before Android 10 show newer emoji (diya, flute, kettle, kite…) as empty boxes. Proposed source: **Twemoji** (free to use with attribution, CC BY 4.0; credited on the About page). 4 objects have no ready icon (blackboard, rangoli, spinning top, train whistle); simple matching icons will be drawn for those.
- **Slow internet:** the audio for the next line downloads while the current one plays (about 30 KB per line). The screen never waits on audio (see §3).
- **Reduced-motion setting:** respected; no flashing.

## 2. Where it goes

**30-day plan:** Memory Palace replaces Sensory Imagery Builder on **Days 3, 7, 11, 15, 19, 23 and 27**. Nothing else on those days changes.

| Day | Before | After |
|---|---|---|
| 3 | Cross-Lateral Tap · Color-Word Sync · **Sensory Imagery Builder** · Flash Recall Sprint | … · **Memory Palace** · … |
| 7 | Blink Recall · Word Flash Grid · **Sensory** · Sentence Reading | … · **Memory Palace** · … |
| 11 | Blink Recall · Deep Visualisation Recall · **Sensory** · Visual Memory Reading | … · **Memory Palace** · … |
| 15 | Rapid Visual Span · Dot Memory Grid · **Sensory** · Flash Recall Sprint | … · **Memory Palace** · … |
| 19 | Peripheral Flash · Color-Word Sync · **Sensory** · Sentence Reading | … · **Memory Palace** · … |
| 23 | Rapid Visual Span · Color-Word Sync · **Sensory** · Multi-Line Reading | … · **Memory Palace** · … |
| 27 | Cross-Lateral Tap · Word Flash Grid · **Sensory** · Number Flash | … · **Memory Palace** · … |

The next-day recall then lands at the start of Days 4, 8, 12, 16, 20, 24 and 28.

**Existing learners:**
- Completion is stored per day, not per exercise, so completed days stay complete, and unlocks, streaks and checkpoints don't change.
- Practice again on a completed day plays Memory Palace.
- Sensory Hologram's old best scores were only ever stored in the browser. They stay there, untouched, and are just no longer shown.

**Redirect:** `/labs/sharp-brain/sensory-hologram-builder` permanently redirects (301) to `/labs/sharp-brain/memory-palace`.

**Also updated:**
- The exercise catalog: title, href and category.
- The 30-day-plan text in all 8 languages where it mentions multi-sensory imagery: the Day 15 and Day 18 descriptions and the phase 3 description.
- The Progress page's "visualisation depth" tile, which read Sensory's stored best. It now shows **Memory** (the last 7 days of immediate recall).
- The old Sensory Hologram code is deleted once nothing imports it, the same as in Deploy 2.

## 3. Audio (Part D playback system)

**Reusable module:** `src/features/guided-audio/`. A `useGuidedNarration(lines, lang)` hook plus a `<GuidedCaption>` component.

**Line by line, in this order:**
1. **Recorded MP3** from `guided-audio/memory-palace/<lang>/<id>.mp3`, if the language's `manifest.json` lists it.
2. **The device's own voice**, using the Part C ranking extended to all 8 language tags (`kn-IN`, `bn-IN`, …), if the file is missing, fails to load, or hasn't started after 4 seconds.
3. **A timed caption only** (duration from the manifest, or estimated), if the device has no voice either.

**Details:**
- **Preloading:** the next line's MP3 downloads while the current one plays. The manifest is fetched once per session.
- **iPhone:** audio is unlocked by the learner's tap on "Begin".
- **Language:** narration follows the app language for all 8. Captions show the same line from `script/<lang>.json`, highlighted as it plays, and only the active language's script is loaded.
- **Controls:** mute/unmute, a volume slider, and **"Replay this line"**. The mute and volume settings are remembered on that device.
- **Pauses:** pause and resume stop the audio and the step timer together.

**Storage (approved, add-only):**
- **Bucket:** a migration creates the `guided-audio` bucket, which anyone can read and only the server can upload to.
- **Upload script:** `scripts/guided-audio/upload.mjs` uploads the 8 language folders (536 MP3s + 8 manifests, about 18 MB).
- **Order:** staging first, then production after your approval of this plan. MP3 files are cached for a year; the manifest for an hour.

**No more Sarvam credits are needed.**

## 4. Testing

1. **Unit tests:**
   - next-day recall timing and labels (12 h / 36 h / 60 h / 7 days, expiry, latest palace only)
   - level changes
   - choice building (no repeats, look-alikes from level 7)
   - the audio fallback order (missing file → device voice; no voice → caption; 4-second start timeout)
   - the 30-day-plan change (only Days 3/7/11/15/19/23/27 changed)
   - the redirect
   - the 8-language completeness test for the new strings
2. **Staging, full session, in English, Hindi and Kannada.** This runs a local production build against staging, with the audio uploaded to the staging bucket.
   - **What's checked:** the voice, captions in sync, mute/volume/replay, the 3 scores saved, and next-day recall offered after its time window.
   - **Faking the time:** the test sets the waiting palace's `played_at` back 25 h and 50 h on the staging test account.
   - **Fallback check:** one run with the MP3 blocked, to confirm the device voice takes over.
3. **Mid-course learner (Day 12):**
   - On staging I'll set up `STAGING_USER_CHILDB`, currently with no days, as a Day 12 learner: completions for Days 1–11 written directly into the staging test account.
   - Then I'll confirm Days 1–11 stay complete, Day 12 is open, Day 12 starts with the next-day recall from Day 11's palace, and nothing is locked or reset.
   - Practice again on Day 3 plays Memory Palace and keeps the original Day 3 result.
4. **The usual checks:** type-check, lint, all tests, a local production build, and a screenshot pass at 360 px. CI runs again on the push.

## 5. Shipping order

1. Bucket migration: staging, then production (approved, add-only).
2. Upload the audio: staging, then **production after you approve this plan**.
3. Code (Deploy 5): I give you `git push origin <sha>:main` and watch the build.

**Rollback:** the previous deployment. The audio and bucket are harmless if left in place.

## 6. Decisions for you

1. Skipped-day rule: 12 hours to 7 days, labelled 24 h / 48 h / later, and expired after 7 days. OK?
2. End-of-session recall outside the 30-day plan: the "come back later today" card, or skip it there?
3. Pictures: Twemoji SVGs with credit on the About page, plus 4 simple matching icons drawn for the missing ones. OK?
4. Progress page: replace the old "visualisation depth" tile with **Memory** (7-day immediate recall). OK?
5. Day 12 test: OK to write test completions (Days 1–11) for the staging account `STAGING_USER_CHILDB`? Staging only.
