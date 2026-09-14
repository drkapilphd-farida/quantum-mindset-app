// 30-Day Quantum Speed Reading Mastery + Live Cohort™ — the real,
// hosted Razorpay Payment Link for the ₹9,999 enrollment (raised from
// ₹4,999 as part of the science-backed neuro-cognitive repositioning —
// see qsrLanding.neuroCognitive in i18n.ts). A single source of truth so
// the dashboard hero and the pricing page never risk drifting to two
// different URLs. Completing this checkout takes real payment. Note:
// the automated webhook (masterclass-webhook/route.ts) grants access
// keyed off payment.captured events from whichever Payment Link the
// Razorpay Dashboard's webhook is actually subscribed to — if that
// webhook subscription was configured against the OLD link
// (h8zlaJ0), it needs to be repointed at this new one in the Razorpay
// Dashboard as well, or payments made here won't auto-grant access.
export const RAZORPAY_MASTERCLASS_PAYMENT_LINK = 'https://rzp.io/rzp/ydVYaANF'
