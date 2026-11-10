import { CLARITY_SESSION } from '@/config/site.config'
import type { Bi } from '@/features/programs/types'

// /clarity-session and /clarity-session/booked (owner's conversion brief,
// Nov 2026). English word for word; Hindi pending the owner's approval.

const price = `₹${CLARITY_SESSION.priceInr.toLocaleString('en-IN')}`
const minutes = CLARITY_SESSION.minutes

export const CLARITY_PAGE = {
  meta: {
    title: { en: `Clarity Session · ${price} · ${minutes} minutes — 1-on-1 with Dr. Kapil | Mind Ur Mind`, hi: `क्लैरिटी सेशन · ${price} · ${minutes} मिनट — डॉ. कपिल के साथ 1-on-1 | मन उर मन` },
    description: {
      en: `Clarity Session · ${price} · ${minutes} minutes · 1-on-1 with Dr. Kapil · includes your first personal meditation / therapy session recording`,
      hi: `क्लैरिटी सेशन · ${price} · ${minutes} मिनट · डॉ. कपिल के साथ 1-on-1 · आपकी पहली पर्सनल मेडिटेशन / थेरेपी सेशन रिकॉर्डिंग शामिल`,
    },
  },
  recap: {
    en: `Clarity Session · ${price} · ${minutes} minutes · 1-on-1 with Dr. Kapil · includes your first personal meditation / therapy session recording`,
    hi: `क्लैरिटी सेशन · ${price} · ${minutes} मिनट · डॉ. कपिल के साथ 1-on-1 · आपकी पहली पर्सनल मेडिटेशन / थेरेपी सेशन रिकॉर्डिंग शामिल`,
  } as Bi,
  pay: { en: `Pay ${price} and choose your time`, hi: `${price} पे करें और अपना समय चुनें` } as Bi,
  paying: { en: 'Opening payment…', hi: 'पेमेंट खुल रहा है…' } as Bi,
  payError: { en: 'The payment could not be opened. Please try again, or message us on WhatsApp.', hi: 'पेमेंट नहीं खुल सका। कृपया फिर से कोशिश करें, या WhatsApp पर मैसेज करें।' } as Bi,
}

export const BOOKED_PAGE = {
  title: { en: 'Payment received — now choose your time.', hi: 'पेमेंट मिल गया — अब अपना समय चुनिए।' } as Bi,
  note: {
    en: 'You will get a confirmation on email and WhatsApp. To reschedule, use the link in your confirmation.',
    hi: 'आपको ईमेल और WhatsApp पर कन्फ़र्मेशन मिलेगा। समय बदलने के लिए कन्फ़र्मेशन में दिया गया लिंक इस्तेमाल करें।',
  } as Bi,
  calendarTitle: { en: 'Choose your time for the Clarity Session', hi: 'क्लैरिटी सेशन के लिए अपना समय चुनिए' } as Bi,
}

/** Sent only when neither Razorpay keys nor the payment link are set yet. */
export const CLARITY_WHATSAPP_MESSAGE = `Hi Dr. Kapil, I would like to book a Clarity Session (${price}).`
/** Thank-you page fallback while the Cal.com link is not set. */
export const BOOKED_WHATSAPP_MESSAGE = 'Hi Dr. Kapil, I have paid for the Clarity Session. Please help me choose a time.'
