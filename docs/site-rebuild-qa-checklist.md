# Site rebuild — final QA checklist (Phase 7)

Run this before merging `site-rebuild` into `main`.

## Banned words and old names

- [ ] **Scan rendered text, alt text, titles, meta tags, JSON-LD and link URLs on every sitemap page, in EN and HI, for:**
  - `Quantum` / `क्वांटम`
  - `QSR`
  - `right brain` / `right-brain`
  - `midbrain` (allowed only in the Sharp Brain FAQ question)
  - `photographic`
  - `telepathy`
  - `originator` / `India's first`
- [ ] **Allowed exception (hotfix, 28 Sep 2026):** the Starter sign-up link's `next=/labs/quantum-speed-reading/journey/1` (URL-encoded, in the link's address, not visible text). `habit.` still runs the older deployment, which only has that path. Change it back once `habit.` is served by this project.
- [ ] **Allowed exceptions:**
  - the "program was then called Quantum Speed Reading" label;
  - the FAQ "What happened to Quantum Speed Reading?";
  - the midbrain FAQ question.
- [ ] The sitemap has no URL containing `quantum`.
- [ ] Every old QSR URL redirects (see `docs/sharp-brain-rename-report.md` §3).
- [ ] Price, trainer and bio text match `src/config/site.config.ts`.

## Before deploy

- [ ] Apply `supabase/migrations/20260928000001_rename_plans_to_sharp_brain.sql` (plan display names), just before deploy.
- [ ] Check `docs/sharp-brain-deferred-claims.md`: restore the wording for any app feature that has shipped.

## Open TODOs (not blocking)

- [ ] School student login domain `@students.quantummind.internal`: left unchanged. Decide before the next school onboarding.
- [ ] Prices and payment links for the Sharp Brain Workshop and Sharp Brain Self-Learning.
- [ ] Doctorate wording (`trainer.doctorate`): hidden until provided.
- [ ] Working hours (`contact.hours`): hidden on /contact until provided.
- [ ] Organisations / schools / companies worked with (`organisationsWorkedWith`): section hidden until listed.
- [ ] Real workshop photos for /about and /gallery (gallery entries have no image yet).
- [x] /corporate FAQs: online and in-person sessions both offered; trainer's travel and stay outside Vadodara are paid by the organisation, shown separately in the quote.
- [x] /retreats/residential: stay included, travel to and from the venue not included (price block, room cards, FAQ).
- [ ] Waiting for your answer: which formats franchise partners can run. The franchise line currently lists the program's formats only.
- [x] Five "Quantum Speed Reading Demonstration" videos: keep them under the "from earlier batches" label. You will replace the thumbnails on YouTube (see the offline checklist).
- [ ] Preview-only TODO markers (`SiteTodo`) are hidden when `VERCEL_ENV === 'production'`; check that none appear on the live site after deploy.

## Known issue to fix in Phase 7

- [ ] **`/executive-brain-workshop` logs React hydration error #418.**
  - The countdown text is computed from `Date.now()` during render, so the server and browser output differ.
  - The page still works, but render the countdown only on the client.
