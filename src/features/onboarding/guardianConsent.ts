// Parent / legal guardian consent (Phase 8). Shown as a required checkbox
// in onboarding (role = parent) and in both child-linking methods. The
// version string is stored with every consent record (guardian_consents).
//
// STATUS: pending legal review — see docs/guardian-consent.md. When the
// wording changes, bump GUARDIAN_CONSENT_VERSION so older records keep
// pointing at the text that was actually shown.

export const GUARDIAN_CONSENT_VERSION = 'v1-2026-09-28-pending-legal-review'

export const GUARDIAN_CONSENT_TEXT = {
  en: 'I am the parent or legal guardian of this child and I agree that Mind Ur Mind may store my child’s practice and assessment results to show progress to me and my child. I can ask for this data to be deleted at any time.',
  hi: 'मैं इस बच्चे का/की माता-पिता या कानूनी अभिभावक हूं और मैं सहमति देता/देती हूं कि Mind Ur Mind मेरे बच्चे के अभ्यास और असेसमेंट के परिणाम सुरक्षित रखे, ताकि प्रगति मुझे और मेरे बच्चे को दिखाई जा सके। मैं कभी भी यह डेटा हटाने का अनुरोध कर सकता/सकती हूं।',
} as const
