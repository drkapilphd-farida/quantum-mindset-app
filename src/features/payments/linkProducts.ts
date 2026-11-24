// Razorpay payment-link products (owner, 24 Nov 2026). These links carry no
// "product" note, so a captured payment is matched by its exact amount.
// Products bought through our own Checkout (Online Retreat, Clarity Session)
// carry a product note and are handled before this table is consulted.

export type LinkProductId = 'sb-workshop-499' | 'sb-live-4999' | 'sb-offline-registration' | 'telepathy-999'

export type LinkProduct = {
  id: LinkProductId
  amountInr: number
  name: { en: string; hi: string }
  /** What happens next, told to the buyer (email) and used in the WhatsApp template. */
  next: { en: string; hi: string }
  /** The owner's follow-up task in the Command Center. */
  task: string
}

export const LINK_PRODUCTS: readonly LinkProduct[] = [
  {
    id: 'sb-workshop-499',
    amountInr: 499,
    name: { en: 'Sharp Brain 2-Day Online Workshop', hi: 'Sharp Brain 2 दिन की ऑनलाइन वर्कशॉप' },
    next: { en: 'The workshop dates and Zoom link reach you on this WhatsApp number.', hi: 'वर्कशॉप की तारीख़ और Zoom लिंक इसी WhatsApp नंबर पर आएँगे।' },
    task: 'Send workshop dates + Zoom link',
  },
  {
    id: 'sb-live-4999',
    amountInr: 4999,
    name: { en: 'Sharp Brain Live Online (30 days)', hi: 'Sharp Brain लाइव ऑनलाइन (30 दिन)' },
    next: { en: 'Your batch starts Mon 14 Dec, 8 PM. The Zoom link and app access reach you on this WhatsApp number.', hi: 'आपका बैच सोमवार 14 दिसंबर, रात 8 बजे से है। Zoom लिंक और ऐप एक्सेस इसी WhatsApp नंबर पर आएँगे।' },
    task: 'Send Zoom link + app access (Live batch 14 Dec)',
  },
  {
    id: 'sb-offline-registration',
    amountInr: 3000,
    name: { en: 'Sharp Brain Offline Workshop + EEG (registration)', hi: 'Sharp Brain ऑफ़लाइन वर्कशॉप + EEG (रजिस्ट्रेशन)' },
    next: {
      en: 'Your seat is registered. As soon as 10 seats fill in your city, we will ask you on WhatsApp which date suits you. The remaining ₹5,999 is paid once your date is confirmed. If no batch forms within 60 days, you can take a full refund or keep the amount for the next date.',
      hi: 'आपकी सीट रजिस्टर हो गई है। आपके शहर में 10 सीटें भरते ही हम WhatsApp पर आपसे पूछेंगे कि कौन-सी तारीख़ ठीक है। बाक़ी ₹5,999 तारीख़ पक्की होने पर देने होंगे। 60 दिन में बैच नहीं बना तो पूरे पैसे वापस ले सकते हैं या अगली तारीख़ के लिए रख सकते हैं।',
    },
    task: 'Ask city (Vadodara/Ahmedabad) + preferred dates',
  },
  {
    id: 'telepathy-999',
    amountInr: 999,
    name: { en: 'Telepathy & Intuition Online Workshop', hi: 'टेलीपैथी और इनट्यूशन ऑनलाइन वर्कशॉप' },
    next: { en: 'The dates of this month’s batch and the Zoom link reach you on this WhatsApp number.', hi: 'इस महीने के बैच की तारीख़ और Zoom लिंक इसी WhatsApp नंबर पर आएँगे।' },
    task: 'Send this month’s telepathy dates + Zoom link',
  },
]

/** The payment-link product for an INR payment of `amountPaise`, if any. */
export function linkProductForAmount(amountPaise: number, currency: string): LinkProduct | null {
  if (currency !== 'INR') return null
  return LINK_PRODUCTS.find((p) => p.amountInr * 100 === amountPaise) ?? null
}
