-- ─────────────────────────────────────────────────────────────────────────────
-- 20260919000001_fix_qsr_masterclass_stale_price
--
-- Fixes a real stale-price bug (see the "Fix 30-Day Curriculum Pricing +
-- Permanent Day Access" task): the qsr-masterclass plan's price was raised
-- to ₹9,999 across every real UI surface (masterclassPaymentLink.ts, the
-- MasterclassPaywallModal, the dashboard/finale upsell cards) and the real
-- Razorpay Payment Link itself back on 20260826000001 — but this row's
-- own price_cents was never updated in that pass, and was still seeded at
-- 499900 (₹4,999). Nothing in the live UI actually reads plans.price_cents
-- for this plan today (confirmed by repo-wide search — every display
-- pulls from the hardcoded ₹9,999 strings instead), so this wasn't a
-- user-visible bug yet, but it was exactly the kind of second, silently-
-- drifted price source the task asked to eliminate before it becomes one.
--
-- 499900 -> 999900 (₹4,999.00 -> ₹9,999.00, in paise).
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE public.plans
SET price_cents = 999900
WHERE key = 'qsr-masterclass' AND price_cents = 499900;
