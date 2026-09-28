# Parent / guardian consent (Phase 8)

**Status: PENDING LEGAL REVIEW.** The wording below was supplied by Dr. Kapil
Dev Sharma on 28 Sep 2026 for the Sharp Brain app features. Please have it
reviewed, for example against India's Digital Personal Data Protection Act
2023 (verifiable parental consent for under-18s), before the features that
use it are switched on.

**Version stored with each record:** `v1-2026-09-28-pending-legal-review`
(`src/features/onboarding/guardianConsent.ts`). If the wording changes, bump
the version so older records keep pointing at the text that was actually
shown.

## Wording

**English:** I am the parent or legal guardian of this child and I agree that
Mind Ur Mind may store my child's practice and assessment results to show
progress to me and my child. I can ask for this data to be deleted at any
time.

**Hindi:** मैं इस बच्चे का/की माता-पिता या कानूनी अभिभावक हूं और मैं सहमति
देता/देती हूं कि Mind Ur Mind मेरे बच्चे के अभ्यास और असेसमेंट के परिणाम
सुरक्षित रखे, ताकि प्रगति मुझे और मेरे बच्चे को दिखाई जा सके। मैं कभी भी यह
डेटा हटाने का अनुरोध कर सकता/सकती हूं। (Translation also to be reviewed.)

## Where it is shown (required checkbox)

1. **Onboarding** (`/welcome/about-you`, and Settings → About you), when
   role = "Parent setting up for a child".
   Stored context: `onboarding`.
2. **Parent creates a child account** from the parent dashboard (Item 13).
   Stored context: `create_child`.
3. **Parent links an existing child account** with a one-time email code
   (Item 13). Stored context: `link_child`.

## How it is stored

Table `public.guardian_consents`: guardian user, child user (when linking),
context, wording version, language shown (en/hi), and time accepted. Records
are only ever added, never edited. RLS lets a user read and add their own
records only.

## Deletion requests

Settings → "Delete my child's data" (shown to parents): a request by email
(info@mindurmind.org.in) or WhatsApp.

**Deadline: every deletion request must be acted on within 7 days of
receipt, and the parent must be told once it is done** (reply by the same
channel: email or WhatsApp). Log the date received and the date completed. Until a self-service delete exists, the
Mind Ur Mind team handles each request by hand:

1. Confirm the requester is the linked parent.
2. Delete the child's practice and assessment rows.
3. Reply to confirm.

Item 13 adds the per-child version for linked child accounts.
