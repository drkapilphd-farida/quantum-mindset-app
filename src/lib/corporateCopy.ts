import { programs, waLink } from '@/config/site.config'

// /corporate — companies, schools and institutions (site-rebuild Phase 6).
// EN/HI copy in one place; program names come from site.config.

type Card = { title: string; desc: string }

export type CorporateCopy = {
  hero: { eyebrow: string; h1: string; sub: string; ctaPrimary: string; ctaSecondary: string }
  companies: { eyebrow: string; title: string; items: Card[]; executiveLink: string }
  schools: { eyebrow: string; title: string; items: Card[]; sharpBrainLink: string }
  gets: { eyebrow: string; title: string; items: Card[] }
  trainer: { eyebrow: string }
  organisations: { eyebrow: string }
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] }
  enquiry: {
    eyebrow: string
    title: string
    sub: string
    companyPlaceholder: string
    formatOptions: string[]
    whatsappIntro: string
    whatsappCta: string
  }
}

const en: CorporateCopy = {
  hero: {
    eyebrow: 'For organisations',
    h1: 'Brain performance programs for teams — calm, focus and clear decisions, measured before and after.',
    sub: 'For companies, schools and institutions — led by Dr. Kapil Dev Sharma, Brain, Mind & Meditation Coach.',
    ctaPrimary: 'Send an enquiry',
    ctaSecondary: 'Talk on WhatsApp',
  },
  companies: {
    eyebrow: 'For companies',
    title: 'Formats for corporate teams',
    items: [
      {
        title: 'Half-day leadership session',
        desc: 'A focused session for leadership teams on staying calm under pressure and making clearer decisions.',
      },
      {
        title: 'Full-day workshop',
        desc: `The ${programs.executiveWorkshop.name}, in-house for your team — calm, focus and decision-making, with before and after measures.`,
      },
      {
        title: 'Full-day + 21-day team follow-up',
        desc: 'The full-day workshop, then 21 days of short guided practice on WhatsApp so the habits stick.',
      },
    ],
    executiveLink: `See the ${programs.executiveWorkshop.name} →`,
  },
  schools: {
    eyebrow: 'For schools & colleges',
    title: 'Programs and talks for students',
    items: [
      {
        title: programs.sharpBrainSchools.name,
        desc: 'Focus, memory, smart reading and mobile discipline for students — the Sharp Brain™ method, delivered in your school.',
      },
      {
        title: 'Talks for schools and colleges',
        desc: 'Talks for students, teachers or parents on focus, memory, study habits and screen time.',
      },
    ],
    sharpBrainLink: 'See the Sharp Brain™ program →',
  },
  gets: {
    eyebrow: 'What you get',
    title: 'What your organisation gets',
    items: [
      {
        title: 'Before/after report',
        desc: 'Simple measures taken before and after the program, shared as a short report for HR, L&D or school leadership.',
      },
      {
        title: '21-day WhatsApp practice',
        desc: 'Short guided daily practices on WhatsApp for 21 days after the session (included in the follow-up format).',
      },
      {
        title: 'Practical tools',
        desc: 'Breathing, focus and decision techniques people can use at their desk or before an exam — no special equipment.',
      },
    ],
  },
  trainer: { eyebrow: 'Who leads it' },
  organisations: { eyebrow: 'Organisations we have worked with' },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you enquire',
    items: [
      {
        question: 'Can we get a GST invoice?',
        answer: 'Yes. Share your organisation’s billing and GST details with your enquiry and we will issue a GST invoice.',
      },
      {
        question: 'Who pays for the trainer’s travel?',
        answer:
          'For in-person sessions outside Vadodara, the trainer’s travel and stay are paid by the organisation, in addition to the program fee. We will show this separately in the quote.',
      },
      {
        question: 'What group size works?',
        answer: 'From about 10 people to 100+. Tell us your group size in the form and we will suggest the right format.',
      },
      {
        question: 'Online or offline?',
        answer:
          'Both. We run live online sessions and in-person sessions at your location. If your team is spread across cities, a live online format usually works best.',
      },
    ],
  },
  enquiry: {
    eyebrow: 'Enquiry',
    title: 'Tell us about your team or school',
    sub: 'Pricing on request — it depends on group size and format. We reply within 24 hours.',
    companyPlaceholder: 'Organisation (company / school / college)',
    formatOptions: [
      'Half-day leadership session',
      'Full-day workshop',
      'Full-day + 21-day team follow-up',
      programs.sharpBrainSchools.name,
      'Talk for a school or college',
    ],
    whatsappIntro: 'Hi, we would like to bring Dr. Kapil Dev Sharma to our organisation.',
    whatsappCta: 'Or talk to us on WhatsApp →',
  },
}

const hi: CorporateCopy = {
  hero: {
    eyebrow: 'संस्थाओं के लिए',
    h1: 'टीमों के लिए ब्रेन परफॉर्मेंस प्रोग्राम — शांति, फोकस और स्पष्ट निर्णय, पहले और बाद में नापे हुए।',
    sub: 'कंपनियों, स्कूलों और संस्थानों के लिए — डॉ. कपिल देव शर्मा, ब्रेन, माइंड व मेडिटेशन कोच के मार्गदर्शन में।',
    ctaPrimary: 'पूछताछ भेजें',
    ctaSecondary: 'WhatsApp पर बात करें',
  },
  companies: {
    eyebrow: 'कंपनियों के लिए',
    title: 'कॉर्पोरेट टीमों के लिए फॉर्मेट',
    items: [
      { title: 'हाफ-डे लीडरशिप सेशन', desc: 'लीडरशिप टीमों के लिए एक केंद्रित सेशन — दबाव में शांत रहना और स्पष्ट निर्णय लेना।' },
      {
        title: 'फुल-डे वर्कशॉप',
        desc: `${programs.executiveWorkshop.nameHi}, आपकी टीम के लिए इन-हाउस — शांति, फोकस और निर्णय क्षमता, पहले और बाद के माप के साथ।`,
      },
      { title: 'फुल-डे + 21-दिन टीम फॉलो-अप', desc: 'फुल-डे वर्कशॉप, फिर WhatsApp पर 21 दिन का छोटा गाइडेड अभ्यास, ताकि आदतें टिकें।' },
    ],
    executiveLink: `${programs.executiveWorkshop.nameHi} देखें →`,
  },
  schools: {
    eyebrow: 'स्कूल व कॉलेज के लिए',
    title: 'विद्यार्थियों के लिए प्रोग्राम और टॉक',
    items: [
      {
        title: programs.sharpBrainSchools.nameHi,
        desc: 'विद्यार्थियों के लिए फोकस, मेमोरी, स्मार्ट रीडिंग और मोबाइल डिसिप्लिन — Sharp Brain™ विधि, आपके स्कूल में।',
      },
      { title: 'स्कूल और कॉलेज के लिए टॉक', desc: 'विद्यार्थियों, शिक्षकों या अभिभावकों के लिए फोकस, मेमोरी, पढ़ाई की आदतों और स्क्रीन-टाइम पर टॉक।' },
    ],
    sharpBrainLink: 'Sharp Brain™ प्रोग्राम देखें →',
  },
  gets: {
    eyebrow: 'आपको क्या मिलता है',
    title: 'आपकी संस्था को क्या मिलता है',
    items: [
      { title: 'पहले/बाद की रिपोर्ट', desc: 'प्रोग्राम से पहले और बाद के सरल माप, HR, L&D या स्कूल प्रबंधन के लिए एक छोटी रिपोर्ट के रूप में।' },
      { title: '21-दिन WhatsApp अभ्यास', desc: 'सेशन के बाद 21 दिन तक WhatsApp पर छोटे गाइडेड दैनिक अभ्यास (फॉलो-अप फॉर्मेट में शामिल)।' },
      { title: 'व्यावहारिक टूल्स', desc: 'सांस, फोकस और निर्णय की तकनीकें, जिन्हें लोग अपनी डेस्क पर या परीक्षा से पहले इस्तेमाल कर सकते हैं — किसी खास उपकरण के बिना।' },
    ],
  },
  trainer: { eyebrow: 'कौन सिखाते हैं' },
  organisations: { eyebrow: 'जिन संस्थाओं के साथ हमने काम किया है' },
  faq: {
    eyebrow: 'सवाल',
    title: 'पूछताछ से पहले',
    items: [
      { question: 'क्या हमें GST इनवॉइस मिल सकता है?', answer: 'हां। अपनी पूछताछ के साथ संस्था की बिलिंग और GST जानकारी भेजें, हम GST इनवॉइस जारी करेंगे।' },
      {
        question: 'ट्रेनर की यात्रा का खर्च कौन देता है?',
        answer: 'वडोदरा से बाहर इन-पर्सन सेशन के लिए ट्रेनर की यात्रा और ठहरने का खर्च संस्था देती है, जो प्रोग्राम फीस के अलावा है। हम इसे कोटेशन में अलग से दिखाएंगे।',
      },
      { question: 'समूह कितना बड़ा हो सकता है?', answer: 'लगभग 10 लोगों से 100+ तक। फॉर्म में समूह का आकार बताएं, हम सही फॉर्मेट सुझाएंगे।' },
      {
        question: 'ऑनलाइन या ऑफलाइन?',
        answer: 'दोनों। हम लाइव ऑनलाइन सेशन और आपकी जगह पर इन-पर्सन सेशन, दोनों करते हैं। अगर आपकी टीम अलग-अलग शहरों में है, तो आमतौर पर लाइव ऑनलाइन फॉर्मेट सबसे अच्छा रहता है।',
      },
    ],
  },
  enquiry: {
    eyebrow: 'पूछताछ',
    title: 'अपनी टीम या स्कूल के बारे में बताएं',
    sub: 'कीमत पूछने पर — यह समूह के आकार और फॉर्मेट पर निर्भर करती है। हम 24 घंटे में जवाब देते हैं।',
    companyPlaceholder: 'संस्था (कंपनी / स्कूल / कॉलेज)',
    formatOptions: ['हाफ-डे लीडरशिप सेशन', 'फुल-डे वर्कशॉप', 'फुल-डे + 21-दिन टीम फॉलो-अप', programs.sharpBrainSchools.nameHi, 'स्कूल या कॉलेज के लिए टॉक'],
    whatsappIntro: 'नमस्ते, हम डॉ. कपिल देव शर्मा को अपनी संस्था में आमंत्रित करना चाहते हैं।',
    whatsappCta: 'या WhatsApp पर बात करें →',
  },
}

export const corporateCopy = { en, hi } as const

export const CORPORATE_WHATSAPP_LINK = waLink('Hi Dr. Kapil, we would like to bring a program to our organisation.')
