// /personal-sessions — 1-on-1 Personal Sessions with Dr. Kapil (owner,
// Nov 2026). English. Words: "support" and "coaching". No medical claims
// ("cure", "treatment", "therapy"), no promised outcomes. The process and
// the 7 / 14 / 21-day formats come from the earlier 1-on-1 page.

import { CLARITY_SESSION, EXPERIENCE_LINE } from '@/config/site.config'

/** Owner's wording: "Clarity Session — ₹2,100 (75 minutes). Your personal plan and package are discussed in this session." */
const clarity = `Clarity Session — ₹${CLARITY_SESSION.priceInr.toLocaleString('en-IN')} (${CLARITY_SESSION.minutes} minutes)`
const clarityLine = `${clarity}. Your personal plan and package are discussed in this session.`

export const AREA_OPTIONS = ['Mind & emotions', 'Performance', 'Spiritual practices (1-on-1)', 'Not sure yet'] as const
export type AreaOption = (typeof AREA_OPTIONS)[number]

export const personalSessionsCopy = {
  meta: {
    title: 'Personal Sessions with Dr. Kapil Dev Sharma — 1-on-1 Coaching | Mind Ur Mind',
    description:
      'Private 1-on-1 sessions with Dr. Kapil Dev Sharma: support for stress, anxiety and mindset; intuition and heart-brain coherence coaching for performance; and guided spiritual practices. Online or in person.',
  },
  nav: { cta: 'Enquire' },
  hero: {
    eyebrow: '1-ON-1 PERSONAL SESSIONS · DR. KAPIL DEV SHARMA',
    h1: 'Personal sessions with Dr. Kapil — coaching shaped around you',
    sub: 'Private, one-on-one support for your mind, your performance and your practice. Online or in person, at your own pace.',
    enquire: 'Send an enquiry',
    areas: 'See what we work on ↓',
    price: clarityLine,
    photoAlt: 'Dr. Kapil Dev Sharma',
  },
  groups: {
    title: 'What we work on',
    sub: 'Three kinds of sessions. Every plan is made for you after a short conversation.',
    items: [
      {
        id: 'mind',
        title: 'Mind & emotions',
        line: 'Support and coaching for what is going on inside.',
        badge: null,
        topics: [
          { name: 'Stress', text: 'Coaching to notice what builds your stress and practical ways to bring it down day to day.' },
          { name: 'Anxiety and panic', text: 'Support to recognise early signs and use breathing and grounding methods that help you stay steady.' },
          { name: 'Mindset coaching', text: 'Work on the beliefs and habits that hold you back, and build ones that move you forward.' },
          { name: 'Subconscious reprogramming', text: 'Guided practices to work with the deeper patterns behind your reactions and choices.' },
        ],
      },
      {
        id: 'performance',
        title: 'Performance',
        line: 'Coaching for clear decisions under pressure.',
        badge: null,
        topics: [
          { name: 'Intuition training for traders', text: 'Learn to notice fear and greed before they act, and to tell a clear inner signal from noise.' },
          { name: 'Heart-brain coherence for fear', text: 'A breathing and attention practice to stay calm and steady when it matters.' },
        ],
      },
      {
        id: 'spiritual',
        title: 'Spiritual practices',
        line: 'Guided personally by Dr. Kapil, one person at a time.',
        badge: '1-on-1 only',
        topics: [
          { name: 'Telepathy & intuition (1-on-1)', text: 'Practice for sharing feelings and intentions, and for trusting your inner voice — taught for your own purpose.' },
          { name: 'Aura reading', text: 'An introduction to sensing and understanding your own energy.' },
          { name: 'Chakra activation', text: 'Guided practice for working with the chakras, step by step.' },
          { name: 'Samadhi meditation', text: 'Deep meditation guidance at your own pace.' },
          { name: 'Kundalini meditation', text: 'A careful, guided kundalini practice.' },
          { name: 'Astral projection', text: 'Guided practice, taught gently and step by step.' },
        ],
      },
    ],
  },
  process: {
    title: 'How it works',
    steps: [
      { title: 'Send an enquiry', text: 'Tell us what you would like to change and why. A few lines are enough.' },
      { title: 'Clarity Session', text: `${clarity}: we understand your situation, and why you want to change it, before anything is suggested.` },
      { title: 'Your plan', text: 'A session plan made for you. You decide whether to go ahead — no pressure.' },
    ],
    formats: [
      { days: '7 days', tag: 'Focused', text: 'Daily sessions on one clear area.' },
      { days: '14 days', tag: 'Recommended', text: 'Two weeks for linked issues, with room to adjust.' },
      { days: '21 days', tag: 'In-depth', text: 'Three weeks for deeper, long-standing patterns.' },
    ],
    feeNote: clarityLine,
  },
  about: {
    eyebrow: 'Your coach',
    name: 'Dr. Kapil Dev Sharma',
    text: `${EXPERIENCE_LINE.en}. Every session is with Dr. Kapil himself.`,
  },
  enquiry: {
    title: 'Send an enquiry',
    sub: 'No commitment. Dr. Kapil reads every enquiry before the first conversation.',
    name: 'Name',
    phone: 'WhatsApp number',
    phoneHint: '10-digit Indian mobile number',
    city: 'City',
    area: 'Which kind of session interests you?',
    choose: 'Choose',
    change: 'What would you like to change in your life, and why?',
    changeHint: 'A few lines are enough.',
    submit: 'Send enquiry',
    sending: 'Sending…',
    privacy: 'Your details will only be used to reply to your enquiry.',
    thanks: {
      title: 'Thank you! We have received your enquiry.',
      text: 'We will reply on WhatsApp to set up a short conversation.',
      whatsapp: 'Send my enquiry on WhatsApp too',
    },
  },
  note: 'Personal sessions are coaching and personal-development support. They are not medical or psychological care and do not replace a doctor or therapist. If you are in crisis, please contact a doctor or emergency services.',
  faq: {
    title: 'Questions',
    items: [
      { question: 'Are sessions online or in person?', answer: 'Both. Choose what suits you — we fix this in the first conversation.' },
      { question: 'How much does it cost?', answer: clarityLine },
      {
        question: 'Is this therapy or medical care?',
        answer: 'No. These are coaching and personal-development sessions. If you are under a doctor’s care, please continue it, and tell us so we can plan around it.',
      },
      { question: 'Why are the spiritual practices 1-on-1 only?', answer: 'They are personal practices. Dr. Kapil guides each person at their own pace, so they are not taught in groups.' },
    ],
  },
} as const
