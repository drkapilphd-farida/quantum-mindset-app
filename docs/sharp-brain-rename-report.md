# Sharp Brain™ rename — Phase 5B report

"Quantum Speed Reading" is now **Sharp Brain™ — Focus · Memory · Smart Reading**
across the website and the app. Internal IDs, database tables, API routes and
saved progress are unchanged, so existing users keep their data. Every old URL
redirects permanently.

External places to rename by hand: `docs/sharp-brain-offline-checklist.md`.

## 1. Main visible text (before → after)

| Where | Before | After |
|---|---|---|
| Program name | Quantum Speed Reading — 30-Day Live Program | Sharp Brain 30-Day Program |
| Program name (HI) | क्वांटम स्पीड रीडिंग — 30-दिवसीय लाइव प्रोग्राम | Sharp Brain 30-दिवसीय प्रोग्राम |
| Program outcome | Read faster with stronger comprehension and retention… | Focus, memory, smart reading and mobile discipline — improvement measured from your own Day 1 to Day 30. |
| Program page title | Quantum Speed Reading — 30-Day Live Program \| Dr. Kapil Dev Sharma | Sharp Brain™ — Focus · Memory · Smart Reading \| Dr. Kapil Dev Sharma |
| Program page H1 | (old QSR landing) | Sharp Brain™ — Focus · Memory · Smart Reading |
| Speed-test title | Free Reading Speed Test — Quantum Speed Reading | Free Reading Speed Test — Sharp Brain™ \| Mind Ur Mind |
| Free starter | 7-Day Free Focus & Reading Starter | Sharp Brain 7-Day Free Starter |
| Starter in app / certificate | 21-Day Focus & Reading Program | Sharp Brain 21-Day Starter |
| New formats | — | Sharp Brain Workshop · Sharp Brain Self-Learning · Sharp Brain for Schools |
| Mumbai QSR workshop | Quantum Speed Reading — Mumbai 2-Day Live Workshop | removed (page redirects to /programs/sharp-brain) |
| Trainer short bio | … · Quantum Speed Reading trainer since 2015 · … | … · Trainer in reading, focus and memory skills since 2015 · … |
| Trainer short bio (HI) | 2015 से क्वांटम स्पीड रीडिंग ट्रेनर | 2015 से रीडिंग, फोकस और मेमोरी स्किल्स के ट्रेनर |
| Trainer long bio | He was one of the first trainers to teach Quantum Speed Reading in India, since 2015, and has developed his own structured 30-day method. | He has trained learners in reading, focus and memory skills since 2015, and developed his own structured 30-day method, now called Sharp Brain™. |
| Franchise outcome | Run your own Quantum Speed Reading training business… | Run your own Sharp Brain™ training business… |
| Franchise WhatsApp text | …certified Quantum Speed Reading trainer partner. | …certified Sharp Brain trainer partner. |
| New WhatsApp texts | — | "…the next Sharp Brain Workshop." / "…Sharp Brain Self-Learning." / "…bring Sharp Brain to our school." |
| Nav → Programs → Brain | Quantum Speed Reading — 30-Day Live Program | Sharp Brain™ |
| Home card pain | "I read and study for hours but can't remember." | "I study for hours but can't remember." / "My child is lost in the phone." |
| Home card audience | For students, exam aspirants and professionals | For students, exam aspirants, professionals — and parents of children aged about 10–17 |
| Home card CTA | See the 30-day program | See Sharp Brain™ |
| Home card link "For my child" | #every-age | #parents |
| Home card note | Prefer in person? Offline workshops with a live EEG brain-state demo in 6 cities. | Focus · Memory · Smart Reading · Mobile Discipline — measured from your own Day 1 to Day 30. |
| Home FAQ | …offline Quantum Speed Reading workshops… | …offline Sharp Brain Workshops… |
| Home proof videos | (no label) | From earlier batches (the program was then called Quantum Speed Reading) |
| Executive workshop agenda | …(from Quantum Speed Reading training) | …(from Sharp Brain training) |
| App lab page titles | "<Exercise> — Quantum Speed Reading Lab™" | "<Exercise> — Sharp Brain Lab" |
| Document session dialog (screen reader) | — Quantum Session | — Learning Session |
| DB plan names (migration kept for Phase 7, applied just before deploy) | qsr-masterclass / qsr-app-continued display names | Sharp Brain 30-Day Program / Mind Ur Mind App — Continued Practice Access |
| Sharp Brain skill card "Smart Reading" | Speed reading with recall: … | Reading with recall: … (HI: याद रखते हुए पढ़ना: …) |
| Online retreat meta description | (listed telepathy etc.) | removed those claims; added ₹6,999 |

Hindi strings in `src/lib/i18n.ts` were changed the same way. Unused old blocks
(tier cards, old QSR landing, Mumbai landing, old nav/footer and so on) were
deleted rather than renamed.

## 2. New /programs/sharp-brain page, in order

a. H1 "Sharp Brain™ — Focus · Memory · Smart Reading", the parent line
   "From screen time to focus time", the positioning line (EN/HI) and two buttons
   (formats & prices, 7-Day Free Starter)

b. Three tabs: For Parents / For Students & Exam Aspirants / For Working
   Professionals. `#parents`, `#students` and `#professionals` open the matching tab.

c. The 5 skills (wording for unbuilt app features softened; see `docs/sharp-brain-deferred-claims.md`): Focus · Memory & Retention · Smart Reading · Visual Learning · Mobile Discipline

d. How it works

e. Formats & prices (the 30-Day Program at ₹9,999 through Razorpay, plus the
   Workshop and Self-Learning through WhatsApp until prices are set) and the guarantee box

f. For parents

g. Proof: verified testimonials (none yet), plus the older videos labelled
   "From earlier batches (the program was then called Quantum Speed Reading)"

h. Short trainer bio, the guarantee, and 8 FAQs including "Is this midbrain activation
   or blindfold reading?" and "What happened to Quantum Speed Reading?"

i. Final CTA with the 7-Day Free Starter, and the sticky mobile bar

The page also has FAQPage and Course JSON-LD and its own OG image.

## 3. Redirects (all permanent, 308)

| Old URL | New URL |
|---|---|
| /programs/quantum-speed-reading | /programs/sharp-brain |
| /programs/quantum-speed-reading/:path* (e.g. /speed-test) | /programs/sharp-brain/:path* |
| /programs/quantum-speed-reading-mumbai | /programs/sharp-brain |
| /labs/quantum-speed-reading | /labs/sharp-brain |
| /labs/quantum-speed-reading/:path* | /labs/sharp-brain/:path* |
| /labs/{quantum-speed-reading,sharp-brain}/quantum-hidden-target-grid | /labs/sharp-brain/hidden-target-grid |
| /labs/{…}/quantum-mental-rotation | /labs/sharp-brain/mental-rotation |
| /labs/{…}/esp-zener-telepathy | /labs/sharp-brain/zener-intuition |
| /labs/{…}/photographic-memory | /labs/sharp-brain/visual-memory |
| /labs/{…}/photographic-reading | /labs/sharp-brain/visual-reading |
| /labs/{…}/hemispheric-color-sync | /labs/sharp-brain/color-word-sync |
| /unified-quantum-session-preview(/:path*) | /unified-session-preview(/:path*) |
| /discover-learning-potential/reading/quantum-speed-reading-intro | /discover-learning-potential/reading/sharp-brain-intro |
| /preview/learning-projects/:id/quantum-journey | /preview/learning-projects/:id/learning-journey |

The journey, analytics, certificate and 30-day curriculum pages under
`/labs/quantum-speed-reading/...` are covered by the catch-all, including query
strings such as `?view=day&day=1`. Each redirect sends the old path straight to
its final new path in one step.

Source: `src/config/legacyRedirects.ts`, loaded by `next.config.ts`. The sitemap
contains 0 "quantum" URLs.

## 4. Renamed exercises

The internal exercise IDs, `labId: 'quantum-speed-reading'` and the storage keys
are unchanged, so saved progress stays attached.

| Old name | New name | Old path → new path |
|---|---|---|
| Right Brain Activation | Visual Focus Training | (name only) |
| Subvocalization Destroyer / Sub-vocalization | Inner Voice Control | /labs/sharp-brain/subvocalization-destroyer (slug kept) |
| Speed Reading / Pure Speed Reading / speed drills | Smart Reading with Recall | (name only) |
| Photographic Memory (wording) | Visual Memory Techniques | photographic-memory → visual-memory |
| Photographic Reading | Visual Memory Reading | photographic-reading → visual-reading |
| Quantum Mode | Deep Focus Mode | (name only) |
| Quantum Hidden Target Grid | Hidden Target Grid | quantum-hidden-target-grid → hidden-target-grid |
| Quantum Mental Rotation | Mental Object Rotation | quantum-mental-rotation → mental-rotation |
| ESP Zener Telepathy | Zener Card Attention Sprint | esp-zener-telepathy → zener-intuition |
| Sensory Hologram Builder | Sensory Imagery Builder | (name only; URL slug kept) |
| Fluid Energy Balancer | Calm Breath Balance | (name only; URL slug kept) |
| Hemispheric Color Sync | Color-Word Sync Grid | hemispheric-color-sync → color-word-sync |
| Tachistoscope (quantum wording) | Tachistoscope Multi-Word Blast | (name only) |
| Curriculum theme: Neural Awakening | Visual Warm-Up | — |
| Curriculum theme: Holographic Manifestation | Multi-Sensory Visualisation | — |
| Curriculum theme: Mind-Over-Matter Circuit | Integrated Focus Circuit | — |
| Curriculum theme: Subvocalization Awareness / Breakdown | Inner Voice Awareness / Control | — |
| Right-brain references in day plans | visual focus | — |

A reading-sprint passage about the "right hemisphere" was rewritten as a passage
about smart reading and recall.

## 5. App-store / Play-store listing text

- **App name:** Mind Ur Mind App
- **Subtitle (30 characters max):** Sharp Brain · Calm Mind
- **Short description (80 characters max):** Focus, memory, smart reading & mobile discipline — measured Day 1 to Day 30.

**Full description:**

> Mind Ur Mind App is the practice companion for Dr. Kapil Dev Sharma's brain,
> mind and meditation programs.
>
> SHARP BRAIN™ — FOCUS · MEMORY · SMART READING
> A cognitive skills program for focus, memory, smart reading and mobile
> discipline — with improvement measured from your own Day 1 to Day 30.
> • About 10 minutes of guided daily practice
> • Visual Focus Training, Visual Memory Techniques, Inner Voice Control and
>   Smart Reading with Recall
> • A Day 1 baseline check and automatic progress tracking
> • Start free with the Sharp Brain 7-Day Free Starter
>
> From screen time to focus time — built for students, exam aspirants, working
> professionals, and parents who want their child to focus better.
>
> Also inside: the 21-Day Overthinking Reset and guided meditation practice.
>
> Designed by Dr. Kapil Dev Sharma, trainer in reading, focus and memory skills
> since 2015. No magic, no "midbrain activation" — just skills, practice and
> measured progress.

**Keywords:** focus, memory, concentration, reading comprehension, study skills,
screen time, students, exam preparation, brain training, meditation

## 6. Allowed remaining uses of "Quantum"

- **Visible to users on purpose:**
  - the "formerly called" label on the old videos;
  - the FAQ "What happened to Quantum Speed Reading?";
  - Dr. Preeti's testimonial quote. It is never edited, and it is hidden until she is verified.
- **Internal only:**
  - code identifiers (component and function names);
  - internal IDs and storage keys;
  - database tables (`daily_quantum_sessions` …);
  - API routes (`/api/quantum-*`);
  - CSS class names;
  - code comments.
- **Reading content:** practice passages about quantum physics as a subject, in the reading datasets.
- **Left unchanged for now (TODO):** the school login domain `@students.quantummind.internal` (see the checklist).

## 7. Full line-by-line log

This lists every source line changed by the rename pass (identical changes are
grouped).

| Before | After | Where |
|---|---|---|
| <section aria-busy="true" aria-label="Loading Quantum Speed Reading experience" className="mx-auto max-w-2xl space-y-10 px-6 py-16 sm:py-20"> | <section aria-busy="true" aria-label="Loading Sharp Brain experience" className="mx-auto max-w-2xl space-y-10 px-6 py-16 sm:py-20"> | `app/labs/sharp-brain/loading.tsx:8 (+1 more)` |
| title: 'Dynamic Chunk Sliding — Quantum Speed Reading Lab™', | title: 'Dynamic Chunk Sliding — Sharp Brain Lab', | `app/labs/sharp-brain/dynamic-chunk-sliding/page.tsx:5` |
| title: 'Progressive Chunk Reading™ — Quantum Speed Reading Lab™', | title: 'Progressive Chunk Reading™ — Sharp Brain Lab', | `app/labs/sharp-brain/progressive-chunk-reading/page.tsx:10` |
| title: 'Dot Memory Grid — Quantum Speed Reading Lab™', | title: 'Dot Memory Grid — Sharp Brain Lab', | `app/labs/sharp-brain/dot-memory-grid/page.tsx:5` |
| title: 'Saccadic Eye Jump™ — Quantum Speed Reading Lab™', | title: 'Saccadic Eye Jump™ — Sharp Brain Lab', | `app/labs/sharp-brain/saccadic-eye-jump/page.tsx:5` |
| title: 'Sensory Hologram Builder — Quantum Speed Reading Lab™', | title: 'Sensory Hologram Builder — Sharp Brain Lab', | `app/labs/sharp-brain/sensory-hologram-builder/page.tsx:5` |
| title: 'Rapid Recognition Drill™ — Quantum Speed Reading Lab™', | title: 'Rapid Recognition Drill™ — Sharp Brain Lab', | `app/labs/sharp-brain/word-flash/page.tsx:10` |
| title: 'Peripheral Expanding Circle™ — Quantum Speed Reading Lab™', | title: 'Peripheral Expanding Circle™ — Sharp Brain Lab', | `app/labs/sharp-brain/peripheral-expanding-circle/page.tsx:5` |
| title: 'Multi-Line Reading — Quantum Speed Reading Lab™', | title: 'Multi-Line Reading — Sharp Brain Lab', | `app/labs/sharp-brain/multi-line-reading/page.tsx:10` |
| title: '2-Minute Brain Gym Circuit™ — Quantum Speed Reading Lab™', | title: '2-Minute Brain Gym Circuit™ — Sharp Brain Lab', | `app/labs/sharp-brain/brain-gym-circuit/page.tsx:5` |
| title: 'Number Flash Grid — Quantum Speed Reading Lab™', | title: 'Number Flash Grid — Sharp Brain Lab', | `app/labs/sharp-brain/number-flash-grid/page.tsx:5` |
| title: 'Symbol Flash™ — Quantum Speed Reading Lab™', | title: 'Symbol Flash™ — Sharp Brain Lab', | `app/labs/sharp-brain/symbol-flash/page.tsx:8` |
| title: 'Paragraph Reading — Quantum Speed Reading Lab™', | title: 'Paragraph Reading — Sharp Brain Lab', | `app/labs/sharp-brain/paragraph-reading/page.tsx:10` |
| title: 'Quantum Hidden Target Grid — Quantum Speed Reading Lab™', | title: 'Hidden Target Grid — Sharp Brain Lab', | `app/labs/sharp-brain/hidden-target-grid/page.tsx:5` |
| title: 'Fixation Reduction — Quantum Speed Reading Lab™', | title: 'Fixation Reduction — Sharp Brain Lab', | `app/labs/sharp-brain/fixation-reduction/page.tsx:8` |
| title: 'Image Flash Grid — Quantum Speed Reading Lab™', | title: 'Image Flash Grid — Sharp Brain Lab', | `app/labs/sharp-brain/image-flash-grid/page.tsx:5` |
| title: 'Vertical Flash Recall & Retention Sprint — Quantum Speed Reading Lab™', | title: 'Vertical Flash Recall & Retention Sprint — Sharp Brain Lab', | `app/labs/sharp-brain/vertical-flash-recall/page.tsx:5` |
| title: 'Mixed Flash™ — Quantum Speed Reading Lab™', | title: 'Mixed Flash™ — Sharp Brain Lab', | `app/labs/sharp-brain/mixed-flash/page.tsx:8` |
| title: 'ESP Zener Card Telepathy Sprint — Quantum Speed Reading Lab™', | title: 'Zener Card Intuition Sprint — Sharp Brain Lab', | `app/labs/sharp-brain/zener-intuition/page.tsx:5` |
| title: 'Guided Paragraph Reading Mode — Quantum Speed Reading Lab™', | title: 'Guided Paragraph Reading Mode — Sharp Brain Lab', | `app/labs/sharp-brain/guided-paragraph-reading-mode/page.tsx:5` |
| title: 'Eye Stretch — Quantum Speed Reading Lab™', | title: 'Eye Stretch — Sharp Brain Lab', | `app/labs/sharp-brain/eye-stretch/page.tsx:10` |
| title: 'Quantum Speed Reading™', | title: 'Sharp Brain™', | `app/labs/sharp-brain/start/page.tsx:12` |
| title: 'Choose Your Reading Mode — Quantum Speed Reading™', | title: 'Choose Your Reading Mode — Sharp Brain™', | `app/labs/sharp-brain/start/mode/page.tsx:7` |
| title: 'Prepare to Read — Quantum Speed Reading™', | title: 'Prepare to Read — Sharp Brain™', | `app/labs/sharp-brain/start/prepare/page.tsx:16` |
| title: 'Reading — Quantum Speed Reading™', | title: 'Reading — Sharp Brain™', | `app/labs/sharp-brain/start/read/page.tsx:7` |
| title: 'Brain Challenge — Quantum Speed Reading™', | title: 'Brain Challenge — Sharp Brain™', | `app/labs/sharp-brain/start/read/quiz/page.tsx:8` |
| title: 'AI Reading Coach™ — Quantum Speed Reading™', | title: 'AI Reading Coach™ — Sharp Brain™', | `app/labs/sharp-brain/start/read/quiz/next-coming-soon/page.tsx:21` |
| title: 'Questions Coming Soon — Quantum Speed Reading™', | title: 'Questions Coming Soon — Sharp Brain™', | `app/labs/sharp-brain/start/read/questions-coming-soon/page.tsx:7` |
| title: 'Session Starting — Quantum Speed Reading™', | title: 'Session Starting — Sharp Brain™', | `app/labs/sharp-brain/start/session-coming-soon/page.tsx:9` |
| title: 'Choose a Passage — Quantum Speed Reading™', | title: 'Choose a Passage — Sharp Brain™', | `app/labs/sharp-brain/start/passage/page.tsx:17` |
| title: 'Phrase Reading Mode — Quantum Speed Reading Lab™', | title: 'Phrase Reading Mode — Sharp Brain Lab', | `app/labs/sharp-brain/phrase-reading-mode/page.tsx:5` |
| title: 'Brain Gym™ — Quantum Speed Reading Lab™', | title: 'Brain Gym™ — Sharp Brain Lab', | `app/labs/sharp-brain/brain-gym/page.tsx:5` |
| title: 'Quantum Mental Object Rotation — Quantum Speed Reading Lab™', | title: 'Mental Object Rotation — Sharp Brain Lab', | `app/labs/sharp-brain/mental-rotation/page.tsx:5` |
| title: 'Hemispheric Color-Word Sync Grid — Quantum Speed Reading Lab™', | title: 'Color-Word Sync Grid — Sharp Brain Lab', | `app/labs/sharp-brain/color-word-sync/page.tsx:5` |
| title: 'Deep Visualisation Recall — Quantum Speed Reading Lab™', | title: 'Deep Visualisation Recall — Sharp Brain Lab', | `app/labs/sharp-brain/visual-memory/page.tsx:5` |
| title: 'Reading Speed — Quantum Speed Reading Lab™', | title: 'Reading Speed — Sharp Brain Lab', | `app/labs/sharp-brain/reading-speed/page.tsx:10` |
| title: 'Regression Control — Quantum Speed Reading Lab™', | title: 'Regression Control — Sharp Brain Lab', | `app/labs/sharp-brain/regression-control/page.tsx:10` |
| title: 'Eye Warm-up — Quantum Speed Reading Lab™', | title: 'Eye Warm-up — Sharp Brain Lab', | `app/labs/sharp-brain/eye-warm-up/page.tsx:10` |
| title: 'Vertical Chunk Sliding — Quantum Speed Reading Lab™', | title: 'Vertical Chunk Sliding — Sharp Brain Lab', | `app/labs/sharp-brain/vertical-chunk-sliding/page.tsx:5` |
| title: 'High-Speed Pictorial Essence Sprint — Quantum Speed Reading Lab™', | title: 'High-Speed Pictorial Essence Sprint — Sharp Brain Lab', | `app/labs/sharp-brain/pictorial-essence-sprint/page.tsx:5` |
| title: 'Fluid Energy Balancer — Quantum Speed Reading Lab™', | title: 'Fluid Energy Balancer — Sharp Brain Lab', | `app/labs/sharp-brain/fluid-energy-balancer/page.tsx:5` |
| title: 'Sentence Reading — Quantum Speed Reading Lab™', | title: 'Sentence Reading — Sharp Brain Lab', | `app/labs/sharp-brain/sentence-reading/page.tsx:10` |
| title: 'Number Flash™ — Quantum Speed Reading Lab™', | title: 'Number Flash™ — Sharp Brain Lab', | `app/labs/sharp-brain/number-flash/page.tsx:8` |
| title: 'Cross-Lateral Tap™ — Quantum Speed Reading Lab™', | title: 'Cross-Lateral Tap™ — Sharp Brain Lab', | `app/labs/sharp-brain/cross-lateral-tap/page.tsx:5` |
| title: 'Sentence Reading Mode — Quantum Speed Reading Lab™', | title: 'Sentence Reading Mode — Sharp Brain Lab', | `app/labs/sharp-brain/sentence-reading-mode/page.tsx:5` |
| title: 'Paragraph Reading Mode — Quantum Speed Reading Lab™', | title: 'Paragraph Reading Mode — Sharp Brain Lab', | `app/labs/sharp-brain/paragraph-reading-mode/page.tsx:5` |
| title: 'Chunk Reading Intelligence™ — Quantum Speed Reading Lab™', | title: 'Chunk Reading Intelligence™ — Sharp Brain Lab', | `app/labs/sharp-brain/chunk-reading/page.tsx:5` |
| title: 'Vertical Word Reading — Quantum Speed Reading Lab™', | title: 'Vertical Word Reading — Sharp Brain Lab', | `app/labs/sharp-brain/vertical-word-reading/page.tsx:5` |
| title: 'Peripheral Flash™ — Quantum Speed Reading Lab™', | title: 'Peripheral Flash™ — Sharp Brain Lab', | `app/labs/sharp-brain/peripheral-flash/page.tsx:8` |
| title: 'RSVP — Quantum Speed Reading Lab™', | title: 'RSVP — Sharp Brain Lab', | `app/labs/sharp-brain/rsvp/page.tsx:10` |
| title: 'Dual-Stream Split Reader — Quantum Speed Reading Lab™', | title: 'Dual-Stream Split Reader — Sharp Brain Lab', | `app/labs/sharp-brain/dual-stream-split-reader/page.tsx:5` |
| title: 'Photographic Reading — Quantum Speed Reading Lab™', | title: 'Visual Memory Reading — Sharp Brain Lab', | `app/labs/sharp-brain/visual-reading/page.tsx:5` |
| title: 'Color & Scene Transformation Journey — Quantum Speed Reading Lab™', | title: 'Color & Scene Transformation Journey — Sharp Brain Lab', | `app/labs/sharp-brain/color-scene-transformation/page.tsx:5` |
| title: 'Eye Span — Quantum Speed Reading Lab™', | title: 'Eye Span — Sharp Brain Lab', | `app/labs/sharp-brain/eye-span/page.tsx:10` |
| title: 'Word Flash Grid — Quantum Speed Reading Lab™', | title: 'Word Flash Grid — Sharp Brain Lab', | `app/labs/sharp-brain/word-flash-grid/page.tsx:5` |
| title: 'Reading Preparation™ — Quantum Speed Reading Lab™', | title: 'Reading Preparation™ — Sharp Brain Lab', | `app/labs/sharp-brain/preparation/page.tsx:7` |
| title: 'Subvocalization Destroyer — Quantum Speed Reading Lab™', | title: 'Inner Voice Control — Sharp Brain Lab', | `app/labs/sharp-brain/subvocalization-destroyer/page.tsx:5` |
| title: 'Fast Pattern Blinking™ — Quantum Speed Reading Lab™', | title: 'Fast Pattern Blinking™ — Sharp Brain Lab', | `app/labs/sharp-brain/fast-pattern-blinking/page.tsx:5` |
| title: 'Phrase Reading™ — Quantum Speed Reading Lab™', | title: 'Phrase Reading™ — Sharp Brain Lab', | `app/labs/sharp-brain/phrase-reading/page.tsx:10` |
| title: 'After-Image / Complementary Color Gazing — Quantum Speed Reading Lab™', | title: 'After-Image / Complementary Color Gazing — Sharp Brain Lab', | `app/labs/sharp-brain/after-image-gazing/page.tsx:5` |
| title: 'Flash Recall & Retention Sprint — Quantum Speed Reading Lab™', | title: 'Flash Recall & Retention Sprint — Sharp Brain Lab', | `app/labs/sharp-brain/flash-recall-sprint/page.tsx:5` |
| {brand.appName}, offering Quantum Speed Reading, meditation and inner-mastery retreats, 1-on-1 mentoring, | {brand.appName}, offering Sharp Brain, meditation and inner-mastery retreats, 1-on-1 mentoring, | `app/privacy/page.tsx:39` |
| title: `Quantum Speed Reading™ — ${brand.name}`, | title: `Sharp Brain™ — ${brand.name}`, | `app/discover-learning-potential/reading/sharp-brain-intro/page.tsx:7` |
| description: 'A motivational bridge from Reading Discovery into your Quantum Speed Reading™ journey.', | description: 'A motivational bridge from Reading Discovery into your Sharp Brain™ journey.', | `app/discover-learning-potential/reading/sharp-brain-intro/page.tsx:8` |
| 🚀 Quantum Speed Reading™ | 🚀 Sharp Brain™ | `app/discover-learning-potential/reading/sharp-brain-intro/components/QuantumSpeedReadingIntroExperience.tsx:49` |
| <p className={cn(TYPOGRAPHY.label, 'text-primary')}>How Quantum Speed Reading™ Can Help</p> | <p className={cn(TYPOGRAPHY.label, 'text-primary')}>How Sharp Brain™ Can Help</p> | `app/discover-learning-potential/reading/sharp-brain-intro/components/QuantumSpeedReadingIntroExperience.tsx:97` |
| Quantum Speed Reading™ opens once you upload your first document. We&rsquo;ll bring you here the moment it&rsquo;s ready. | Sharp Brain™ opens once you upload your first document. We&rsquo;ll bring you here the moment it&rsquo;s ready. | `app/discover-learning-potential/reading/sharp-brain-intro/components/QuantumSpeedReadingIntroExperience.tsx:114` |
| 🚀 Start Quantum Speed Reading™ | 🚀 Start Sharp Brain™ | `app/discover-learning-potential/reading/sharp-brain-intro/components/QuantumSpeedReadingIntroExperience.tsx:118` |
| <p className="mt-3 font-heading text-xl font-bold text-foreground">🚀 Quantum Speed Reading™</p> | <p className="mt-3 font-heading text-xl font-bold text-foreground">🚀 Sharp Brain™</p> | `app/discover-learning-potential/reading/components/ReadingSummaryCard.tsx:185` |
| <p className="text-xs font-semibold tracking-widest text-primary uppercase">Quantum Speed Reading Sprint</p> | <p className="text-xs font-semibold tracking-widest text-primary uppercase">Smart Reading Sprint</p> | `app/unified-session-preview/components/QuantumReadingSprintPhase.tsx:302` |
| { id: 2, name: 'Right-Brain Activation' }, | { id: 2, name: 'Visual Focus Training' }, | `app/unified-session-preview/components/UnifiedQuantumSession.tsx:35` |
| { id: 3, name: 'Quantum Reading Sprint' }, | { id: 3, name: 'Smart Reading Sprint' }, | `app/unified-session-preview/components/UnifiedQuantumSession.tsx:36` |
| 2: 'Right-Brain Activation', | 2: 'Visual Focus Training', | `app/unified-session-preview/components/UnifiedQuantumSession.tsx:41` |
| 3: 'Quantum Reading Sprint', | 3: 'Smart Reading Sprint', | `app/unified-session-preview/components/UnifiedQuantumSession.tsx:42` |
| QSR Pro Circuit Complete! | Sharp Brain Circuit Complete! | `app/unified-session-preview/components/UnifiedQuantumSession.tsx:343` |
| Real-time coaching in a live QSR batch. We&rsquo;ll notify you the moment one is scheduled. | Real-time coaching in a live Sharp Brain batch. We&rsquo;ll notify you the moment one is scheduled. | `app/unified-session-preview/components/LiveMasterclassWaitlistCard.tsx:45` |
| 'esp-zener-telepathy': 'Telepathy Sprint Complete', | 'esp-zener-telepathy': 'Intuition Sprint Complete', | `app/unified-session-preview/components/RotatingVisualActivationPhase.tsx:26` |
| 'hemispheric-color-sync': 'Hemispheric Sync Complete', | 'hemispheric-color-sync': 'Color-Word Sync Complete', | `app/unified-session-preview/components/RotatingVisualActivationPhase.tsx:29` |
| <p className="text-xs font-semibold tracking-widest text-primary uppercase">Right-Brain Visual Activation</p> | <p className="text-xs font-semibold tracking-widest text-primary uppercase">Visual Focus Training</p> | `app/unified-session-preview/components/VisualActivationPhase.tsx:191` |
| structured around a measurable WPM/comprehension checkpoint the way Quantum Speed Reading is. | structured around a measurable WPM/comprehension checkpoint the way Sharp Brain is. | `app/refund-policy/page.tsx:80` |
| description: 'Real moments from Mind Ur Mind workshops, retreats, and Quantum Speed Reading sessions.', | description: 'Real moments from Mind Ur Mind workshops, retreats, and Sharp Brain sessions.', | `app/gallery/page.tsx:8` |
| Ur Mind program — Quantum Speed Reading, meditation and inner-mastery retreats, 1-on-1 mentoring, the | Ur Mind program — Sharp Brain, meditation and inner-mastery retreats, 1-on-1 mentoring, the | `app/terms/page.tsx:33` |
| `The story of ${trainer.name} and ${brand.name} (founded ${brand.foundedYear}) — ${trainer.years.total} years in education and mind training, Quantum Speed Reading trainer since ${trainer.qsrSinceYear}, based in ${brand.… | `The story of ${trainer.name} and ${brand.name} (founded ${brand.foundedYear}) — ${trainer.years.total} years in education and mind training, Sharp Brain trainer since ${trainer.qsrSinceYear}, based in ${brand.city}.`, | `app/about/page.tsx:12` |
| `${trainer.name} — brain, mind and meditation coach with ${trainer.years.total} years in education and mind training. Quantum Speed Reading, overthinking reset, meditation retreats, 1-on-1 coaching and corporate brain pe… | `${trainer.name} — brain, mind and meditation coach with ${trainer.years.total} years in education and mind training. Sharp Brain, overthinking reset, meditation retreats, 1-on-1 coaching and corporate brain performance … | `app/(marketing)/page.tsx:30` |
| 'quantum speed reading Vadodara', | 'sharp brain program Vadodara', | `app/(marketing)/page.tsx:43` |
| description: 'Real student video reviews of the Quantum Speed Reading — 30-Day Live Program on YouTube.', | description: 'Real student video reviews of the Sharp Brain — 30-Day Live Program on YouTube.', | `app/(marketing)/(legacy)/reviews/page.tsx:12` |
| Success Stories: See How Thousands of Students Mastered Quantum Speed Reading | Success Stories: See How Thousands of Students Built Their Sharp Brain Skills | `app/(marketing)/(legacy)/reviews/page.tsx:52` |
| Real students, in their own words — recorded across every batch of the 30-Day Quantum Speed Reading Mastery + Live Cohort. | Real students, in their own words — recorded across every batch of the Sharp Brain 30-Day Program + Live Classes. | `app/(marketing)/(legacy)/reviews/page.tsx:55` |
| 'The free first step before Quantum Speed Reading: about 10 minutes a day of focus, memory and reading drills. Days 1–7 are free; continue to Day 21 for a one-time ₹99 — never a subscription.', | 'The free first step before Sharp Brain: about 10 minutes a day of focus, memory and reading drills. Days 1–7 are free; continue to Day 21 for a one-time ₹99 — never a subscription.', | `app/programs/habit-builder/page.tsx:22` |
| title: 'Quantum Reading Journey', | title: 'Smart Reading Journey', | `app/preview/learning-projects/[id]/learning-journey/page.tsx:18` |
| title: 'Quantum Speed Reading', | title: 'Sharp Brain', | `app/preview/learning-projects/[id]/read/page.tsx:23` |
| description: 'An adaptive, week-by-week guided daily session across Reading, Intuition, Right Brain, and Visualisation.', | description: 'An adaptive, week-by-week guided daily session across Reading, Intuition, Visual Focus, and Visualisation.', | `app/(dashboard)/labs/sharp-brain/journey/[day]/page.tsx:27` |
| title: '30-Day Quantum Speed Reading Mastery Curriculum — Quantum Speed Reading Lab™', | title: 'Sharp Brain 30-Day Program Curriculum — Sharp Brain Lab', | `app/(dashboard)/labs/sharp-brain/thirty-day-curriculum/page.tsx:8` |
| Retake your Quantum Speed Reading assessment for a document to re-measure how you read it. | Retake your Smart Reading assessment for a document to re-measure how you read it. | `app/(dashboard)/settings/page.tsx:86` |
| { label: 'Right-Brain Visualization Depth', score: visualizationDepthScore, trendPercent: null }, | { label: 'Visualization Depth', score: visualizationDepthScore, trendPercent: null }, | `app/(dashboard)/progress/page.tsx:167` |
| QSR-Bundled Access™ (see the "Upload & Learn / QSR Bundling" | QSR-Bundled Access™ (see the "Upload & Learn / Sharp Brain bundle" | `app/(dashboard)/dashboard/QsrDashboard.tsx:143 (+1 more)` |
| included in the 30-Day QSR Masterclass, the exact same access | included in the 30-Day Sharp Brain Masterclass, the exact same access | `app/(dashboard)/dashboard/QsrDashboard.tsx:145` |
| description="Drop any PDF, textbook, or research paper. Our AI instantly converts it into Quantum Speed Reading drills, Mind Maps, and Neural Map Notes." | description="Drop any PDF, textbook, or research paper. Our AI instantly converts it into Smart Reading drills, Mind Maps, and Neural Map Notes." | `app/(dashboard)/dashboard/QsrDashboard.tsx:155` |
| Upload any PDF, textbook, or research paper — get Quantum Speed Reading drills, Smart Summaries, and Neural Map Notes. Your past uploads and study projects live here too. | Upload any PDF, textbook, or research paper — get Smart Reading drills, Smart Summaries, and Neural Map Notes. Your past uploads and study projects live here too. | `app/(dashboard)/document-studio/page.tsx:44` |
| Quantum Speed Reading Target | Smart Reading Target | `app/discover-welcome-preview/components/MindProfileDashboard.tsx:140` |
| <p className="text-xs text-muted-foreground">Quantum Target</p> | <p className="text-xs text-muted-foreground">Trained Target</p> | `app/discover-welcome-preview/components/MindProfileDashboard.tsx:152` |
| 🔥 Unlock 600+ WPM Quantum Speed Reading Now | 🔥 Unlock 600+ WPM Sharp Brain Now | `app/discover-welcome-preview/components/MindProfileDashboard.tsx:186` |
| return `This assessment only measured your baseline reading speed — and you're already near Quantum pace. Our Quantum Speed Reading Program is engineered to make 600+ WPM your sustained norm, with complete retention, not… | return `This assessment only measured your baseline reading speed — and you're already near a trained pace. Our Sharp Brain 30-Day Program is engineered to make 600+ WPM your sustained norm, with complete retention, not … | `app/discover-welcome-preview/components/mindProfileDataset.ts:105` |
| return `This assessment only measured your baseline reading speed — the speed your brain defaults to without training. Our Quantum Speed Reading Program is engineered to unlock 3-5x faster reading, up to 600+ WPM, with c… | return `This assessment only measured your baseline reading speed — the speed your brain defaults to without training. Our Sharp Brain 30-Day Program is engineered to unlock 3-5x faster reading, up to 600+ WPM, with comp… | `app/discover-welcome-preview/components/mindProfileDataset.ts:108` |
| title: 'Right-Brain Visualization', | title: 'Visualization Training', | `app/discover-welcome-preview/components/QuantumOfferPage.tsx:41` |
| title: 'Quantum Reading Speed', | title: 'Smart Reading Speed', | `app/discover-welcome-preview/components/QuantumOfferPage.tsx:58` |
| 'Awakens right-brain visual processing', | 'Trains visual processing', | `app/discover-welcome-preview/components/QuantumOfferPage.tsx:71` |
| <strong className="font-semibold text-foreground">Quantum potential is 600+ WPM</strong>, and it has never | <strong className="font-semibold text-foreground">Trained reading target: 600+ WPM</strong>, and it has never | `app/discover-welcome-preview/components/QuantumOfferPage.tsx:156` |
| <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">The Quantum Way</p> | <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">The Sharp Brain Way</p> | `app/discover-welcome-preview/components/QuantumOfferPage.tsx:262` |
| description: 'Start your own Quantum Speed Reading training business with a ready platform, marketing kit, and certification.', | description: 'Start your own Sharp Brain training business with a ready platform, marketing kit, and certification.', | `app/franchise-individual/page.tsx:9` |
| ? `I want to register for the 2-Day Offline QSR + EEG Workshop in ${city}` | ? `I want to register for the 2-day Sharp Brain Workshop in ${city}` | `config/whatsappSupportLink.ts:36` |
| : `I want to join the waitlist for the 2-Day Offline QSR + EEG Workshop in ${city}` | : `I want to join the waitlist for the 2-day Sharp Brain Workshop in ${city}` | `config/whatsappSupportLink.ts:37` |
| { videoId: 'UM9LBm0hh0Y', thumbnailSrc: '/qsr-videos/UM9LBm0hh0Y-thumb.jpg', label: 'Quantum Speed Reading Student' }, | { videoId: 'UM9LBm0hh0Y', thumbnailSrc: '/qsr-videos/UM9LBm0hh0Y-thumb.jpg', label: 'Student' }, | `config/qsrVideoReviews.ts:51` |
| { videoId: '1pvc5yHgJGU', thumbnailSrc: '/qsr-videos/1pvc5yHgJGU-thumb.jpg', label: 'Quantum Speed Reading Student' }, | { videoId: '1pvc5yHgJGU', thumbnailSrc: '/qsr-videos/1pvc5yHgJGU-thumb.jpg', label: 'Student' }, | `config/qsrVideoReviews.ts:52` |
| { videoId: 'B2HwCJwMPDQ', thumbnailSrc: '/qsr-videos/B2HwCJwMPDQ-thumb.jpg', label: 'Quantum Speed Reading Student' }, | { videoId: 'B2HwCJwMPDQ', thumbnailSrc: '/qsr-videos/B2HwCJwMPDQ-thumb.jpg', label: 'Student' }, | `config/qsrVideoReviews.ts:53` |
| { videoId: 'V_-iUWQarT4', thumbnailSrc: '/qsr-videos/V_-iUWQarT4-thumb.jpg', label: 'Quantum Speed Reading Student' }, | { videoId: 'V_-iUWQarT4', thumbnailSrc: '/qsr-videos/V_-iUWQarT4-thumb.jpg', label: 'Student' }, | `config/qsrVideoReviews.ts:54` |
| { videoId: 'QutuICwaKJ4', thumbnailSrc: '/qsr-videos/QutuICwaKJ4-thumb.jpg', label: 'Quantum Speed Reading Student' }, | { videoId: 'QutuICwaKJ4', thumbnailSrc: '/qsr-videos/QutuICwaKJ4-thumb.jpg', label: 'Student' }, | `config/qsrVideoReviews.ts:55` |
| { videoId: 'TpCltll0VFc', thumbnailSrc: '/qsr-videos/TpCltll0VFc-thumb.jpg', label: 'Quantum Speed Reading Student' }, | { videoId: 'TpCltll0VFc', thumbnailSrc: '/qsr-videos/TpCltll0VFc-thumb.jpg', label: 'Student' }, | `config/qsrVideoReviews.ts:56` |
| { videoId: 'uetG4y2SXTY', thumbnailSrc: '/qsr-videos/uetG4y2SXTY-thumb.jpg', label: 'Quantum Speed Reading Student' }, | { videoId: 'uetG4y2SXTY', thumbnailSrc: '/qsr-videos/uetG4y2SXTY-thumb.jpg', label: 'Student' }, | `config/qsrVideoReviews.ts:57` |
| { id: "qsr-01", src: undefined, alt: "Quantum Speed Reading masterclass session", category: "qsr" }, | { id: "qsr-01", src: undefined, alt: "Sharp Brain live class", category: "qsr" }, | `config/galleryPhotos.ts:26` |
| { id: "qsr-02", src: undefined, alt: "Quantum Speed Reading live class", category: "qsr" }, | { id: "qsr-02", src: undefined, alt: "Sharp Brain live class", category: "qsr" }, | `config/galleryPhotos.ts:27` |
| { id: "qsr-03", src: undefined, alt: "Quantum Speed Reading student practice", category: "qsr" }, | { id: "qsr-03", src: undefined, alt: "Sharp Brain student practice", category: "qsr" }, | `config/galleryPhotos.ts:28` |
| { id: "qsr-04", src: undefined, alt: "Quantum Speed Reading graduation moment", category: "qsr" }, | { id: "qsr-04", src: undefined, alt: "Sharp Brain graduation moment", category: "qsr" }, | `config/galleryPhotos.ts:29` |
| { id: 'quantum-speed-reading', emoji: '📖', title: 'Quantum Speed Reading™', description: 'Read using the AI Reading Engine.' }, | { id: 'quantum-speed-reading', emoji: '📖', title: 'Sharp Brain™', description: 'Read using the AI Reading Engine.' }, | `constants/learning/learningModes.ts:18` |
| 'Visual attention and focus sprints (from Quantum Speed Reading training)', | 'Visual attention and focus sprints (from Sharp Brain training)', | `features/executive-brain-workshop/components/ExecutiveWorkshopAgenda.tsx:22` |
| title: 'ESP Zener Card Telepathy Sprint™', | title: 'Zener Card Intuition Sprint', | `features/intuition-hub/intuitionHubModes.ts:21 (+1 more)` |
| title: 'Quantum Hidden Target Grid™', | title: 'Hidden Target Grid', | `features/intuition-hub/intuitionHubModes.ts:30 (+1 more)` |
| <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Quantum Mental Object Rotation™</p> | <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Mental Object Rotation</p> | `features/quantum-mental-rotation/components/QuantumMentalRotationCanvas.tsx:232` |
| <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Quantum Mental Object Rotation™</h1> | <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Mental Object Rotation</h1> | `features/quantum-mental-rotation/components/QuantumMentalRotationSettings.tsx:35` |
| <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Hemispheric Color-Word Sync Grid™</h1> | <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Color-Word Sync Grid</h1> | `features/hemispheric-color-sync/components/HemisphericColorSyncSettings.tsx:34` |
| <p className="mt-2 text-sm text-muted-foreground">Nice hemispheric control.</p> | <p className="mt-2 text-sm text-muted-foreground">Nice colour-word control.</p> | `features/hemispheric-color-sync/components/HemisphericColorSyncCompleteScreen.tsx:46` |
| <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Hemispheric Color-Word Sync Grid™</p> | <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Color-Word Sync Grid</p> | `features/hemispheric-color-sync/components/HemisphericColorSyncCanvas.tsx:192` |
| title: 'Hemispheric Color-Word Sync Grid™', | title: 'Color-Word Sync Grid', | `features/right-brain-hub/rightBrainHubModes.ts:39 (+1 more)` |
| purpose: 'Vibrant icons flash briefly across the grid — pure photographic recall, no words or numbers, 5 escalating rounds.', | purpose: 'Vibrant icons flash briefly across the grid — pure visual recall, no words or numbers, 5 escalating rounds.', | `features/right-brain-hub/rightBrainHubModes.ts:85` |
| <p className="mt-2 text-sm text-muted-foreground">Nice photographic recall.</p> | <p className="mt-2 text-sm text-muted-foreground">Nice visual recall.</p> | `features/image-flash-grid/components/ImageFlashGridCompleteScreen.tsx:41 (+1 more)` |
| <ReadingStatTile variant="card" label="Right Brain Photographic Score" value={`${scorePercent}%`} /> | <ReadingStatTile variant="card" label="Visual Memory Score" value={`${scorePercent}%`} /> | `features/photographic-memory/components/PhotographicMemoryCompleteScreen.tsx:51` |
| <p className={TYPOGRAPHY.label}>Quantum Recall Quiz™</p> | <p className={TYPOGRAPHY.label}>Recall Quiz</p> | `features/quantum-document-transformer/components/QuantumDocumentMcqQuizView.tsx:56` |
| <p className="mt-3 text-sm text-muted-foreground">Not yet attempted — complete a Quantum Session to see your mastery here.</p> | <p className="mt-3 text-sm text-muted-foreground">Not yet attempted — complete a Sharp Brain session to see your mastery here.</p> | `features/quantum-document-transformer/components/DocumentOutcomeProfileCard.tsx:42` |
| Practice this summary in Quantum Speed Reading Mode | Practice this summary in Smart Reading Mode | `features/quantum-document-transformer/components/QuantumDocumentDetailView.tsx:238` |
| 🚀 Start Quantum Speed Reading ({document.quizQuestions.length} recall question{document.quizQuestions.length !== 1 ? 's' : ''}) | 🚀 Start Sharp Brain ({document.quizQuestions.length} recall question{document.quizQuestions.length !== 1 ? 's' : ''}) | `features/quantum-document-transformer/components/QuantumDocumentDetailView.tsx:335` |
| <p className={TYPOGRAPHY.label}>Quantum Speed Reading™</p> | <p className={TYPOGRAPHY.label}>Sharp Brain™</p> | `features/quantum-document-transformer/components/QuantumDocumentSpeedReadingView.tsx:74` |
| completeSubline: 'Left and right brain, working together.', | completeSubline: 'Both sides of the body, working together.', | `features/brain-gym/configs/crossLateralTapConfig.ts:18` |
| <p className={cn(TYPOGRAPHY.label, 'text-muted-foreground')}>Quantum Speed Reading™</p> | <p className={cn(TYPOGRAPHY.label, 'text-muted-foreground')}>Sharp Brain™</p> | `features/quantum-speed-reading-runtime/components/QsrHub.tsx:118` |
| description="Start your first Quantum Speed Reading™ session for this document." | description="Start your first Sharp Brain™ session for this document." | `features/quantum-speed-reading-runtime/components/ReadingWorkspace.tsx:270` |
| export const POWERED_BY_LINE = 'Quantum Speed Reading™ · Memory Intelligence™ · Focus Intelligence™' | export const POWERED_BY_LINE = 'Sharp Brain™ · Memory Intelligence™ · Focus Intelligence™' | `features/discovery-upload-bridge/copy.ts:28` |
| <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">ESP Zener Card Telepathy Sprint™</p> | <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Zener Card Intuition Sprint</p> | `features/esp-zener-telepathy/components/EspZenerTelepathyCanvas.tsx:163` |
| <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">ESP Zener Card Telepathy Sprint™</h1> | <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Zener Card Intuition Sprint</h1> | `features/esp-zener-telepathy/components/EspZenerTelepathySettings.tsx:33` |
| label: 'Quantum Focus', | label: 'Deep Focus', | `features/vertical-chunk-sliding/verticalChunkSlidingDataset.ts:28` |
| 'A quantum mind holds one clear intention while filtering out every competing distraction that tries to pull it elsewhere.', | 'A focused mind holds one clear intention while filtering out every competing distraction that tries to pull it elsewhere.', | `features/vertical-chunk-sliding/verticalChunkSlidingDataset.ts:31` |
| 'Quantum focus treats attention as a genuinely limited resource, not an unlimited tap that can be split infinitely.', | 'Deep focus treats attention as a genuinely limited resource, not an unlimited tap that can be split infinitely.', | `features/vertical-chunk-sliding/verticalChunkSlidingDataset.ts:37` |
| <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Photographic Reading™</h1> | <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Visual Memory Reading</h1> | `features/photographic-reading/components/PhotographicReadingSettings.tsx:42` |
| non-linearly, the foundation of photographic memory. 3 quick questions check what stuck. | non-linearly, the foundation of visual memory. 3 quick questions check what stuck. | `features/photographic-reading/components/PhotographicReadingSettings.tsx:45` |
| <p className="mb-1 text-center text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Photographic Reading™</p> | <p className="mb-1 text-center text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Visual Memory Reading</p> | `features/photographic-reading/components/PhotographicReadingCanvas.tsx:280` |
| 'Read Bigger Chunks': 'Quantum Speed Reading™ trains your eyes to take in more words at once.', | 'Read Bigger Chunks': 'Sharp Brain™ trains your eyes to take in more words at once.', | `features/reading-discovery/buildQuantumSpeedReadingReason.ts:6` |
| 'Improve Reading Rhythm': 'Quantum Speed Reading™ builds a steady, natural reading rhythm.', | 'Improve Reading Rhythm': 'Sharp Brain™ builds a steady, natural reading rhythm.', | `features/reading-discovery/buildQuantumSpeedReadingReason.ts:7` |
| 'Reduce Eye Stops': 'Quantum Speed Reading™ trains fewer, longer eye movements across the line.', | 'Reduce Eye Stops': 'Sharp Brain™ trains fewer, longer eye movements across the line.', | `features/reading-discovery/buildQuantumSpeedReadingReason.ts:8` |
| 'Read Longer Comfortably': 'Quantum Speed Reading™ builds real stamina for longer, uninterrupted reading.', | 'Read Longer Comfortably': 'Sharp Brain™ builds real stamina for longer, uninterrupted reading.', | `features/reading-discovery/buildQuantumSpeedReadingReason.ts:9` |
| 'Improve Understanding': 'Quantum Speed Reading™ pairs speed with comprehension, together.', | 'Improve Understanding': 'Sharp Brain™ pairs speed with comprehension, together.', | `features/reading-discovery/buildQuantumSpeedReadingReason.ts:10` |
| const DEFAULT_QSR_REASON = 'Quantum Speed Reading™ builds on exactly where you are today.' | const DEFAULT_QSR_REASON = 'Sharp Brain™ builds on exactly where you are today.' | `features/reading-discovery/buildQuantumSpeedReadingReason.ts:13` |
| title: 'Quantum Mental Object Rotation™', | title: 'Mental Object Rotation', | `features/visualization-hub/visualizationHubModes.ts:22 (+1 more)` |
| title: 'Quantum Mode', | title: 'Deep Focus Mode', | `features/quantum-speed-reading/readingModes.ts:59` |
| { id: 'speed-explorer', title: 'Speed Explorer', description: 'Complete a session in Speed or Quantum reading mode.' }, | { id: 'speed-explorer', title: 'Speed Explorer', description: 'Complete a session in Speed or Deep Focus reading mode.' }, | `features/quantum-speed-reading/ai-reading-coach/achievementCatalogV2.ts:20` |
| Quantum Speed Reading™ | Sharp Brain™ | `features/quantum-speed-reading/components/QuantumReadingLanding.tsx:72 (+1 more)` |
| aria-label="Quantum Speed Reading passage" | aria-label="Smart Reading passage" | `features/quantum-speed-reading/components/reading-experience/ReadingExperience.tsx:508` |
| title: 'Subvocalization Destroyer™', | title: 'Inner Voice Control™', | `features/reading-hub/readingHubModes.ts:123 (+1 more)` |
| title: 'Photographic Reading™', | title: 'Visual Memory Reading', | `features/reading-hub/readingHubModes.ts:132 (+1 more)` |
| purpose: 'Meaningful word clusters flash across shifting screen quadrants, training non-linear reading and spatial photographic memory.', | purpose: 'Meaningful word clusters flash across shifting screen quadrants, training non-linear reading and spatial visual memory.', | `features/reading-hub/readingHubModes.ts:133` |
| <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Quantum Hidden Target Grid™</h1> | <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Hidden Target Grid</h1> | `features/quantum-hidden-target-grid/components/QuantumHiddenTargetGridSettings.tsx:33` |
| <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Quantum Hidden Target Grid™</p> | <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Hidden Target Grid</p> | `features/quantum-hidden-target-grid/components/QuantumHiddenTargetGridCanvas.tsx:133` |
| description={`Explore Quantum Speed Reading for free — enroll in the ${programs.sharpBrain.name} to unlock Document Mastery Studio.`} | description={`Explore Sharp Brain for free — enroll in the ${programs.sharpBrain.name} to unlock Document Mastery Studio.`} | `features/pricing/components/PricingPlansGrid.tsx:139` |
| 'Quantum Speed Reading & Active Recall sessions', | 'Smart Reading & Active Recall sessions', | `features/pricing/components/PricingPlansGrid.tsx:143` |
| 'Unlimited Quantum Speed Reading Sessions', | 'Unlimited Smart Reading Sessions', | `features/pricing/components/PricingPlansGrid.tsx:168` |
| <p className="text-lg font-semibold text-foreground">30-Day Quantum Speed Reading Mastery + Live Cohort</p> | <p className="text-lg font-semibold text-foreground">Sharp Brain 30-Day Program + Live Classes</p> | `features/pricing/components/PricingPlansGrid.tsx:226` |
| <p className="mb-1 text-center text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Subvocalization Destroyer™</p> | <p className="mb-1 text-center text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Inner Voice Control™</p> | `features/subvocalization-destroyer/components/SubvocalizationDestroyerCanvas.tsx:271` |
| <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Subvocalization Destroyer™</h1> | <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Inner Voice Control™</h1> | `features/subvocalization-destroyer/components/SubvocalizationDestroyerSettings.tsx:48` |
| title: 'Right-Brain Expansion & Subvocalization Destruction', | title: 'Visual Focus & Inner Voice Control', | `features/thirty-day-curriculum/curriculumDatabase.ts:45` |
| description: 'Deepen photographic, non-verbal recall and break the habit of silently voicing every word.', | description: 'Deepen visual, non-verbal recall and break the habit of silently voicing every word.', | `features/thirty-day-curriculum/curriculumDatabase.ts:47` |
| title: 'Holographic Manifestation & Mental Mastery', | title: 'Multi-Sensory Visualisation & Mental Mastery', | `features/thirty-day-curriculum/curriculumDatabase.ts:51` |
| title: 'Peak Quantum Speed Reading Mastery & Final Certification', | title: 'Peak Smart Reading Mastery & Final Certification', | `features/thirty-day-curriculum/curriculumDatabase.ts:57` |
| { day: 3, title: 'First Right-Brain Spark', focus: 'Introduce photographic, non-verbal recall alongside your reading warm-ups.' }, | { day: 3, title: 'First Visual Focus Session', focus: 'Introduce photographic, non-verbal recall alongside your reading warm-ups.' }, | `features/thirty-day-curriculum/curriculumDatabase.ts:100` |
| { day: 8, title: 'Right-Brain Expansion Begins', focus: 'Deepen photographic and intuitive recall training.' }, | { day: 8, title: 'Visual Focus Expansion Begins', focus: 'Deepen photographic and intuitive recall training.' }, | `features/thirty-day-curriculum/curriculumDatabase.ts:105` |
| { day: 11, title: 'Deeper Right-Brain Immersion', focus: 'Extend non-verbal recall span and grid complexity.' }, | { day: 11, title: 'Deeper Visual Focus Practice', focus: 'Extend non-verbal recall span and grid complexity.' }, | `features/thirty-day-curriculum/curriculumDatabase.ts:108` |
| { day: 13, title: 'Integration Circuit', focus: 'Combine right-brain and reading gains in one balanced session.' }, | { day: 13, title: 'Integration Circuit', focus: 'Combine visual-focus and reading gains in one balanced session.' }, | `features/thirty-day-curriculum/curriculumDatabase.ts:110` |
| { day: 14, title: 'Checkpoint — Right-Brain Review', focus: 'Re-measure WPM and comprehension to confirm right-brain-driven growth.' }, | { day: 14, title: 'Checkpoint — Visual Focus Review', focus: 'Re-measure WPM and comprehension to confirm right-brain-driven growth.' }, | `features/thirty-day-curriculum/curriculumDatabase.ts:111` |
| focus: 'Complete your final WPM and comprehension assessment and claim your Quantum Speed Reading Mastery certification.', | focus: 'Complete your final WPM and comprehension assessment and claim your Sharp Brain certification.', | `features/thirty-day-curriculum/curriculumDatabase.ts:134` |
| 'right-brain-intuition': 'Right-Brain / Intuition', | 'right-brain-intuition': 'Visual Focus / Intuition', | `features/thirty-day-curriculum/curriculumExerciseCatalog.ts:26` |
| title: 'Quantum Tachistoscope Multi-Word Blast', | title: 'Tachistoscope Multi-Word Blast', | `features/thirty-day-curriculum/curriculumExerciseCatalog.ts:52 (+1 more)` |
| <p className="text-xs font-semibold tracking-widest text-primary uppercase">30-Day Quantum Speed Reading Mastery Curriculum™</p> | <p className="text-xs font-semibold tracking-widest text-primary uppercase">Sharp Brain 30-Day Curriculum</p> | `features/thirty-day-curriculum/components/ThirtyDayCurriculumOverview.tsx:65` |
| Bring real reading material for &ldquo;{plan.theme.title}&rdquo; and practice Quantum Speed Reading on the real thing. | Bring real reading material for &ldquo;{plan.theme.title}&rdquo; and practice Sharp Brain on the real thing. | `features/thirty-day-curriculum/components/ThirtyDayCurriculumDayDetail.tsx:210` |
| All 30 days of the Quantum Speed Reading Mastery Curriculum™ — real WPM + comprehension checkpoints, and 7 live mentorship sessions with | All 30 days of the Sharp Brain 30-Day Curriculum — real WPM + comprehension checkpoints, and 7 live mentorship sessions with | `features/thirty-day-curriculum/components/MasterclassPaywallModal.tsx:40` |
| { exerciseId: 'quantum-mental-rotation', title: 'Quantum Mental Object Rotation™', domain: 'visualisation' }, | { exerciseId: 'quantum-mental-rotation', title: 'Mental Object Rotation', domain: 'visualisation' }, | `features/quantum-journey/quantumJourneyLevels.ts:51 (+1 more)` |
| { exerciseId: 'esp-zener-telepathy', title: 'ESP Zener Card Telepathy Sprint™', domain: 'intuition' }, | { exerciseId: 'esp-zener-telepathy', title: 'Zener Card Intuition Sprint', domain: 'intuition' }, | `features/quantum-journey/quantumJourneyLevels.ts:60` |
| { exerciseId: 'hemispheric-color-sync', title: 'Hemispheric Color-Word Sync Grid™', domain: 'right_brain' }, | { exerciseId: 'hemispheric-color-sync', title: 'Color-Word Sync Grid', domain: 'right_brain' }, | `features/quantum-journey/quantumJourneyLevels.ts:61` |
| spiritual: 'ESP Zener Card Telepathy™', | spiritual: 'Zener Card Intuition', | `features/quantum-journey/quantumJourneyLevels.ts:196` |
| right_brain: 'Right Brain', | right_brain: 'Visual Focus', | `features/quantum-journey/types.ts:11` |
| text: 'A common problem with fixed daily curriculums is that they treat every learner identically, regardless of where each person is genuinely struggling. The Mind Ur Mind App addresses this through Smart Weakness Targe… | text: 'A common problem with fixed daily curriculums is that they treat every learner identically, regardless of where each person is genuinely struggling. The Mind Ur Mind App addresses this through Smart Weakness Targe… | `features/quantum-journey/readingContent/quantumMindPrograms.ts:55` |
| { question: 'What domains does Smart Weakness Targeting track?', options: ['Reading, Writing, and Speaking', 'Intuition, Right Brain, and Visualisation', 'Math, Science, and History', 'Speed, Accuracy, and Memory only'],… | { question: 'What domains does Smart Weakness Targeting track?', options: ['Reading, Writing, and Speaking', 'Intuition, Visual Focus, and Visualisation', 'Math, Science, and History', 'Speed, Accuracy, and Memory only']… | `features/quantum-journey/readingContent/quantumMindPrograms.ts:57` |
| अब अपनी इस नई स्पीड को अपने खुद के डॉक्यूमेंट्स और किताबों पर आजमाएं — Get 30-Day QSR Pro Suite (App 2) with Upload Documents, Spider | अब अपनी इस नई स्पीड को अपने खुद के डॉक्यूमेंट्स और किताबों पर आजमाएं — Get 30-Day Sharp Brain Pro Suite (App 2) with Upload Documents, Spider | `features/quantum-journey/components/AppTwoFinaleUpsellCta.tsx:30` |
| 'dynamic-chunking': 'Quantum Chunk Reading™', | 'dynamic-chunking': 'Chunk Reading™', | `features/quantum-journey/components/QuantumJourneySession.tsx:114` |
| "Quantum Mindset & Habit Builder" spelled out near the wordmark, | "Sharp Brain 21-Day Starter" spelled out near the wordmark, | `components/AppSidebar.tsx:52` |
| 'quantum focus builds', | 'deep focus builds', | `components/qsr/visual-activation/QuantumTachistoscopeMultiWordBlast.tsx:66` |
| 'quantum stillness meets clarity', | 'deep stillness meets clarity', | `components/qsr/visual-activation/QuantumTachistoscopeMultiWordBlast.tsx:69` |
| <p className="text-xs font-semibold tracking-widest text-primary uppercase">Quantum Tachistoscope Multi-Word Blast</p> | <p className="text-xs font-semibold tracking-widest text-primary uppercase">Tachistoscope Multi-Word Blast</p> | `components/qsr/visual-activation/QuantumTachistoscopeMultiWordBlast.tsx:563` |
| <ComparisonBar label="Trained QSR target" value="550–600 WPM" percent={96} tone="teal" /> | <ComparisonBar label="Trained reading target" value="550–600 WPM" percent={96} tone="teal" /> | `components/qsr/speed-test/QsrSpeedTestExperience.tsx:444` |
| label: 'Right-Brain Visualization Depth', | label: 'Visualization Depth', | `components/mindScore/DimensionScoreGrid.tsx:127` |
| label: 'QSR / Holographic Recall', | label: 'Visual Recall', | `components/mindScore/DimensionScoreGrid.tsx:134` |
| title="21-Day Quantum Habit Journey" | title="Sharp Brain 21-Day Starter" | `components/welcome/ChooseLearningMethodExperience.tsx:155` |
| title="Quantum Speed Reading" | title="Sharp Brain" | `components/welcome/ChooseLearningMethodExperience.tsx:166` |
| points={['Peripheral Vision Activator, Rapid Recognition Drill, Quantum Chunk Reading', '7 Live Masterclasses with Dr. Kapil Dev Sharma']} | points={['Peripheral Vision Activator, Rapid Recognition Drill, Chunk Reading', '7 Live Masterclasses with Dr. Kapil Dev Sharma']} | `components/welcome/ChooseLearningMethodExperience.tsx:168` |
| <h2 className="mt-2 font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">⚡ 30-Day Quantum Speed Reading Mastery™</h2> | <h2 className="mt-2 font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">⚡ Sharp Brain 30-Day Program</h2> | `components/dashboard/ThirtyDayMasterclassHeroCard.tsx:69` |
| <p className="truncate text-xs text-slate-700 dark:text-slate-300">Reading · Intuition · Right Brain · Visualisation</p> | <p className="truncate text-xs text-slate-700 dark:text-slate-300">Reading · Intuition · Visual Focus · Visualisation</p> | `components/dashboard/TwentyOneDayJourneyCard.tsx:102` |
| { threshold: 75, message: 'Preparing Quantum Session...' }, | { threshold: 75, message: 'Preparing your session...' }, | `components/dashboard/AIDocumentTransformerWidget.tsx:57` |
| { threshold: 75, message: 'Generating quantum mind maps...' }, | { threshold: 75, message: 'Generating mind maps...' }, | `components/dashboard/AIDocumentTransformerWidget.tsx:63 (+1 more)` |
| answer: `Most programs run online and live. In-person options: offline Quantum Speed Reading workshops, the ${programs.executiveWorkshop.name} in Mumbai, and residential retreats in Lonavala and Rishikesh.`, | answer: `Most programs run online and live. In-person options: offline Sharp Brain Workshops, the ${programs.executiveWorkshop.name} in Mumbai, and residential retreats in Lonavala and Rishikesh.`, | `lib/homeCopy.ts:175` |
| answer: `ज़्यादातर प्रोग्राम ऑनलाइन और लाइव चलते हैं। व्यक्तिगत विकल्प: ऑफलाइन क्वांटम स्पीड रीडिंग वर्कशॉप, मुंबई में ${programs.executiveWorkshop.nameHi}, और लोनावला व ऋषिकेश में रेजिडेंशियल रिट्रीट्स।`, | answer: `ज़्यादातर प्रोग्राम ऑनलाइन और लाइव चलते हैं। व्यक्तिगत विकल्प: ऑफलाइन Sharp Brain वर्कशॉप, मुंबई में ${programs.executiveWorkshop.nameHi}, और लोनावला व ऋषिकेश में रेजिडेंशियल रिट्रीट्स।`, | `lib/homeCopy.ts:317` |
| if (score >= 800) return { rank: 'Quantum Master', description: 'Elite mastery across every dimension' } | if (score >= 800) return { rank: 'Sharp Brain Master', description: 'Elite mastery across every dimension' } | `lib/exercises/mindScore.ts:184` |
| "This chapter is concept-heavy and requires continuous reading. We recommend beginning with Quantum Speed Reading™ to improve comprehension before memory practice.", | "This chapter is concept-heavy and requires continuous reading. We recommend beginning with Sharp Brain™ to improve comprehension before memory practice.", | `lib/blueprint/recommendLearningMode.ts:42` |
| reason: 'A steady first read is the best place to start with this material. We recommend Quantum Speed Reading™ to build a solid foundation before anything else.', | reason: 'A steady first read is the best place to start with this material. We recommend Sharp Brain™ to build a solid foundation before anything else.', | `lib/blueprint/recommendLearningMode.ts:62` |
| 'Authentic Kriya Yoga, Prana, and cosmic energy — an intensive, live, 11-day journey through telepathy, aura reading, Samadhi meditation, chakra activation, Kundalini meditation, and astral projection. Guided nightly by … | 'Eleven nights of live, guided practice in traditional Kriya Yoga, pranayama and deep meditation — for a calmer mind, steadier emotions and better sleep. Guided nightly by Dr. Kapil Dev Sharma, teaching since 2014. Month… | `app/retreats/online-11-day/page.tsx` |
| title: 'Baseline & Neural Awakening' | title: 'Baseline & Visual Warm-Up' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| title: 'Foundation & Neural Awakening' | title: 'Foundation & Visual Warm-Up' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| focus: 'Introduce photographic, non-verbal recall alongside your reading warm-ups.' | focus: 'Introduce visual, non-verbal recall alongside your reading warm-ups.' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| focus: 'Deepen photographic and intuitive recall training.' | focus: 'Deepen visual and intuitive recall training.' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| focus: 'Re-measure WPM and comprehension to confirm right-brain-driven growth.' | focus: 'Re-measure WPM and comprehension to confirm real week-two growth.' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| title: 'Subvocalization Awareness' | title: 'Inner Voice Awareness' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| title: 'Subvocalization Breakdown' | title: 'Inner Voice Control' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| title: 'Holographic Manifestation Begins' | title: 'Multi-Sensory Visualisation Begins' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| title: 'Mind-Over-Matter Circuit' | title: 'Integrated Focus Circuit' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| focus: 'Re-measure WPM and comprehension to confirm mind-over-matter growth.' | focus: 'Re-measure WPM and comprehension to confirm real week-three growth.' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| description: 'Train vivid multi-sensory visualization and sustained mind-over-matter focus.' | description: 'Train vivid multi-sensory visualization and sustained focus.' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| focus: 'Eliminate backward eye movement for good.' | focus: 'Reduce backward eye movements while reading.' | `features/thirty-day-curriculum/curriculumDatabase.ts` |
| return 'Advanced Quantum Flow & Intuition' | return 'Advanced Focus Flow & Intuition' | `features/quantum-journey/quantumJourneyLevels.ts` |
| Week 2 expands into Right-Brain activation and visualization exercises | Week 2 expands into visual focus training and visualization exercises | `features/quantum-journey/readingContent/quantumMindPrograms.ts` |
| quantum-mind-tenants- | mind-ur-mind-tenants- | `features/school-dashboard/components/QuickActionsToolbar.tsx` |
| WhatsApp: Hi Dr. Kapil, I want to apply to become a certified Quantum Speed Reading trainer partner. | WhatsApp: Hi Dr. Kapil, I want to apply to become a certified Sharp Brain trainer partner. (from site.config) | `config/whatsappSupportLink.ts` |
| WhatsApp (Mumbai page): …the Mumbai in-person Quantum Speed Reading workshop (pilot batch) | Removed with the retired Mumbai page | `config/whatsappSupportLink.ts` |
| title="Pure Speed Reading" | title="Smart Reading with Recall" | `components/learning/ModeChoiceExperience.tsx` |
| ctaLabel="Start Speed Reading →" | ctaLabel="Start Smart Reading →" | `components/learning/ModeChoiceExperience.tsx` |
| label: 'Speed Reading Science', | label: 'Reading Science', | `features/vertical-chunk-sliding/verticalChunkSlidingDataset.ts` |
| — Quantum Session (screen-reader dialog title) | — Learning Session | `features/quantum-document-transformer/components/QuantumDocumentDetailView.tsx:360` |
| title: 'Sensory Hologram Builder — Sharp Brain Lab', | title: 'Sensory Imagery Builder — Sharp Brain Lab', | `app/labs/sharp-brain/sensory-hologram-builder/page.tsx:5` |
| title: 'Zener Card Intuition Sprint — Sharp Brain Lab', | title: 'Zener Card Attention Sprint — Sharp Brain Lab', | `app/labs/sharp-brain/zener-intuition/page.tsx:5` |
| title: 'Fluid Energy Balancer — Sharp Brain Lab', | title: 'Calm Breath Balance — Sharp Brain Lab', | `app/labs/sharp-brain/fluid-energy-balancer/page.tsx:5` |
| title: 'Zener Card Intuition Sprint', | title: 'Zener Card Attention Sprint', | `features/intuition-hub/intuitionHubModes.ts:21 (+1 more)` |
| <p className="mb-3 text-center text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Sensory Hologram Builder™</p> | <p className="mb-3 text-center text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Sensory Imagery Builder</p> | `features/sensory-hologram-builder/components/SensoryHologramBuilderCanvas.tsx:339` |
| <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Sensory Hologram Builder™</h1> | <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Sensory Imagery Builder</h1> | `features/sensory-hologram-builder/components/SensoryHologramBuilderSettings.tsx:55` |
| <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Zener Card Intuition Sprint</p> | <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Zener Card Attention Sprint</p> | `features/esp-zener-telepathy/components/EspZenerTelepathyCanvas.tsx:163` |
| <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Zener Card Intuition Sprint</h1> | <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Zener Card Attention Sprint</h1> | `features/esp-zener-telepathy/components/EspZenerTelepathySettings.tsx:33` |
| <p className="mb-3 text-center text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Fluid Energy Balancer™</p> | <p className="mb-3 text-center text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Calm Breath Balance</p> | `features/fluid-energy-balancer/components/FluidEnergyBalancerCanvas.tsx:385` |
| <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Fluid Energy Balancer™</h1> | <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Calm Breath Balance</h1> | `features/fluid-energy-balancer/components/FluidEnergyBalancerSettings.tsx:32` |
| title: 'Sensory Hologram Builder™', | title: 'Sensory Imagery Builder', | `features/visualization-hub/visualizationHubModes.ts:40 (+1 more)` |
| title: 'Fluid Energy Balancer™', | title: 'Calm Breath Balance', | `features/visualization-hub/visualizationHubModes.ts:49` |
| focus: 'Enter the Sensory Hologram Builder to train vivid, multi-sensory mental imagery.', | focus: 'Enter the Sensory Imagery Builder to train vivid, multi-sensory mental imagery.', | `features/thirty-day-curriculum/curriculumDatabase.ts:115` |
| { day: 16, title: 'Energy & Focus Balancing', focus: 'Train sustained, stable mental focus with the Fluid Energy Balancer.' }, | { day: 16, title: 'Energy & Focus Balancing', focus: 'Train sustained, stable mental focus with the Calm Breath Balance.' }, | `features/thirty-day-curriculum/curriculumDatabase.ts:117` |
| { id: 'fluid-energy-balancer', title: 'Fluid Energy Balancer™', href: '/labs/sharp-brain/fluid-energy-balancer', category: 'visualization' }, | { id: 'fluid-energy-balancer', title: 'Calm Breath Balance', href: '/labs/sharp-brain/fluid-energy-balancer', category: 'visualization' }, | `features/thirty-day-curriculum/curriculumExerciseCatalog.ts:149` |
| { exerciseId: 'esp-zener-telepathy', title: 'Zener Card Intuition Sprint', domain: 'intuition' }, | { exerciseId: 'esp-zener-telepathy', title: 'Zener Card Attention Sprint', domain: 'intuition' }, | `features/quantum-journey/quantumJourneyLevels.ts:60` |
| spiritual: 'Zener Card Intuition', | spiritual: 'Zener Card Attention', | `features/quantum-journey/quantumJourneyLevels.ts:196` |
| 'Trust your gut against a shuffled 25-card Zener deck and build streak multipliers.' | 'Keep your attention on a shuffled 25-card Zener deck and build streak multipliers.' | `features/intuition-hub/intuitionHubModes.ts` |
| building a vivid mental hologram of a life goal you choose. | building a vivid mental image of a life goal you choose. | `features/visualization-hub/visualizationHubModes.ts` |
| 'Hold two opposing energies — Earth & Gold, Air & Water — in perfect harmony against drifting fluctuations, 5 rounds of tightening focus.' | 'Keep two drifting elements — Earth & Gold, Air & Water — in balance as they fluctuate: 5 rounds of steadily tightening focus.' | `features/visualization-hub/visualizationHubModes.ts` |
