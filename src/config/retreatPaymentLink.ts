// 11-Day Online Deep Meditation Retreat — checkout link used by every
// booking button (hero, booking section, sticky bar, final CTA, nav).
//
// site-rebuild Phase 5 follow-up: the retreat fee is ₹6,999 (site.config).
// The previous fixed-amount Payment Link (https://rzp.io/rzp/ULFp3DJ,
// "11 Days Online Retreat") charges ₹9,999 and can't be changed from here,
// so checkout now uses the payer-entered-amount page, with the note
// "Pay ₹6,999 on the next screen, then send the screenshot on WhatsApp"
// shown under every booking button (RetreatPaymentNote.tsx). Retire the
// ₹9,999 link in the Razorpay dashboard; if a fixed ₹6,999 link is
// created later, put it here and remove the note.
export const RAZORPAY_RETREAT_PAYMENT_LINK = 'https://razorpay.me/@mindurmindacademy'
