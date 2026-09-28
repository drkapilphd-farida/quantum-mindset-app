import { programs, verifiedTestimonialNames, type ProgramId } from './site.config'

// Every named testimonial on the site lives here (site-rebuild Phase 3).
//
// Rules:
// - Names, quotes and numbers are copied verbatim from what the person
//   said — never invent or edit them. The Hindi fields are the existing
//   translations of the same words, not new copy.
// - `verified` is derived from `verifiedTestimonialNames` in site.config.ts.
//   Only verified testimonials render anywhere; the rest stay here as data.
// - A testimonial only appears on its own program's page (see
//   `testimonialsForProgram`). The About page is the one exception: it
//   may show a mixed set with the program label visible.
// - `videoUrl` is set only when the video is certainly this person's.
//   The anonymous YouTube review grids (qsrVideoReviews.ts,
//   retreatVideoReviews.ts) are separate and stay unnamed.

type TestimonialData = {
  id: string
  name: string
  nameHi: string
  city: string
  cityHi: string
  role: string
  roleHi: string
  /** Null when the testimonial is an image (e.g. a WhatsApp screenshot in `photo`). */
  quote: string | null
  quoteHi: string | null
  program: ProgramId
  videoUrl: string | null
  photo: string | null
}

export type Testimonial = TestimonialData & { verified: boolean }

const TESTIMONIAL_DATA: readonly TestimonialData[] = [
  {
    id: 'ananya-r',
    name: 'Ananya R.',
    nameHi: 'अनन्या आर.',
    city: '',
    cityHi: '',
    role: '',
    roleHi: '',
    quote: 'I finished two books in the time it used to take me to finish one chapter.',
    quoteHi: 'जितने समय में पहले एक अध्याय पूरा होता था, अब उतने समय में दो किताबें पूरी हो जाती हैं।',
    program: 'sharpBrain',
    videoUrl: null,
    photo: null,
  },
  {
    id: 'karan-mehra',
    name: 'Karan Mehra',
    nameHi: 'करण मेहरा',
    city: 'Jaipur',
    cityHi: 'जयपुर',
    role: '',
    roleHi: '',
    quote: "The mental clarity and speed I've gained through these 30 days have drastically cut down my study and preparation time.",
    quoteHi: 'इन 30 दिनों में मिली मानसिक स्पष्टता और गति ने मेरे पढ़ाई और तैयारी के समय को काफी कम कर दिया है।',
    program: 'sharpBrain',
    videoUrl: null,
    photo: null,
  },
  {
    id: 'dr-preeti',
    name: 'Dr. Preeti',
    nameHi: 'डॉ. प्रीति',
    city: 'Mumbai',
    cityHi: 'मुंबई',
    role: '',
    roleHi: '',
    quote:
      'The Quantum Speed Reading workshop completely changed how I process medical journals; I can now scan through extensive research papers in a fraction of the usual time.',
    quoteHi:
      'क्वांटम स्पीड रीडिंग वर्कशॉप ने मेडिकल जर्नल्स पढ़ने का मेरा तरीका पूरी तरह बदल दिया; अब मैं विस्तृत शोध पत्रों को पहले से कहीं कम समय में पढ़ लेती हूं।',
    program: 'sharpBrain',
    videoUrl: null,
    photo: null,
  },
  {
    id: 'shailesh',
    name: 'Shailesh',
    nameHi: 'शैलेश',
    city: 'Ahmedabad',
    cityHi: 'अहमदाबाद',
    role: 'Business Owner',
    roleHi: 'व्यवसायी',
    quote: 'As a business owner, processing market reports and financial statements has become remarkably fast after attending this program.',
    quoteHi: 'एक व्यवसायी के रूप में, इस प्रोग्राम में शामिल होने के बाद मार्केट रिपोर्ट्स और वित्तीय विवरण पढ़ना काफी तेज़ हो गया है।',
    program: 'sharpBrain',
    videoUrl: null,
    photo: null,
  },
  {
    id: 'sudha',
    name: 'Sudha',
    nameHi: 'सुधा',
    city: 'Kolkata',
    cityHi: 'कोलकाता',
    role: '',
    roleHi: '',
    quote: 'Initially skeptical, but the 30-day practice streak genuinely improved my focus and overall reading comprehension beyond expectations.',
    quoteHi: 'शुरुआत में मुझे संदेह था, लेकिन 30-दिन की प्रैक्टिस स्ट्रीक ने मेरे फोकस और समग्र पठन-बोध को उम्मीद से कहीं बेहतर बना दिया।',
    program: 'sharpBrain',
    videoUrl: null,
    photo: null,
  },
  {
    id: 'vikram-malhotra',
    name: 'Vikram Malhotra',
    nameHi: 'विक्रम मल्होत्रा',
    city: 'Bengaluru',
    cityHi: 'बेंगलुरु',
    role: '',
    roleHi: '',
    quote: 'The combination of live sessions and daily app practice helped me break through a lifelong reading plateau.',
    quoteHi: 'लाइव सेशंस और रोज़ाना ऐप प्रैक्टिस के संयोजन ने मुझे जीवनभर की रीडिंग रुकावट से बाहर निकालने में मदद की।',
    program: 'sharpBrain',
    videoUrl: null,
    photo: null,
  },
  {
    id: 'amit-patel',
    name: 'Amit Patel',
    nameHi: 'अमित पटेल',
    city: 'Surat',
    cityHi: 'सूरत',
    role: '',
    roleHi: '',
    quote: 'A profound mental reboot — my retention power skyrocketed, and I now finish thick management books in a single sitting.',
    quoteHi: 'एक गहरा मानसिक रीबूट — मेरी स्मरण शक्ति काफी बढ़ गई, और अब मैं मोटी मैनेजमेंट किताबें एक ही बैठक में पूरी कर लेता हूं।',
    program: 'sharpBrain',
    videoUrl: null,
    photo: null,
  },
  {
    id: 'vikram-s',
    name: 'Vikram S.',
    nameHi: 'विक्रम एस.',
    city: '',
    cityHi: '',
    role: '',
    roleHi: '',
    quote: 'The Kundalini sessions alone were worth the entire eleven days.',
    quoteHi: 'अकेले कुंडलिनी सत्र ही पूरे ग्यारह दिनों के लायक थे।',
    program: 'onlineRetreat',
    videoUrl: null,
    photo: null,
  },
  {
    id: 'priya-m',
    name: 'Priya M.',
    nameHi: 'प्रिया एम.',
    city: '',
    cityHi: '',
    role: '',
    roleHi: '',
    quote: 'Six private sessions did what years of general advice never managed.',
    quoteHi: 'छह निजी सत्रों ने वह कर दिखाया जो वर्षों की सामान्य सलाह कभी नहीं कर पाई।',
    program: 'oneOnOneCoaching',
    videoUrl: null,
    photo: null,
  },
  {
    id: 'rohan-k',
    name: 'Rohan K.',
    nameHi: 'रोहन के.',
    city: '',
    cityHi: '',
    role: '',
    roleHi: '',
    quote: 'Twenty-one days, and the loop in my head finally went quiet.',
    quoteHi: 'इक्कीस दिन, और आखिरकार मेरे सिर का शोर शांत हो गया।',
    program: 'overthinkingReset',
    videoUrl: null,
    photo: null,
  },
  {
    id: 'dev-prakash',
    name: 'Dev Prakash',
    nameHi: 'देव प्रकाश',
    city: 'Mumbai',
    cityHi: 'मुंबई',
    role: 'Trainer partner',
    roleHi: 'ट्रेनर पार्टनर',
    quote: null,
    quoteHi: null,
    program: 'franchise',
    videoUrl: null,
    photo: '/trainer_testimonial_dev_prakash_whatsapp.jpg',
  },
  {
    id: 'saloni-shah',
    name: 'Saloni Shah',
    nameHi: 'सलोनी शाह',
    city: 'Delhi',
    cityHi: 'दिल्ली',
    role: 'Trainer partner',
    roleHi: 'ट्रेनर पार्टनर',
    quote: null,
    quoteHi: null,
    program: 'franchise',
    videoUrl: null,
    photo: '/trainer_testimonial_saloni_shah_whatsapp.jpg',
  },
  {
    id: 'sandeep-gupta',
    name: 'Sandeep Gupta',
    nameHi: 'संदीप गुप्ता',
    city: 'Kolkata',
    cityHi: 'कोलकाता',
    role: 'Trainer partner',
    roleHi: 'ट्रेनर पार्टनर',
    quote: null,
    quoteHi: null,
    program: 'franchise',
    videoUrl: null,
    photo: '/trainer_testimonial_sandeep_gupta_whatsapp.jpg',
  },
]

export const TESTIMONIALS: readonly Testimonial[] = TESTIMONIAL_DATA.map((item) => ({
  ...item,
  verified: verifiedTestimonialNames.includes(item.name),
}))

/** Verified testimonials for one program's own page. */
export function testimonialsForProgram(program: ProgramId): readonly Testimonial[] {
  return TESTIMONIALS.filter((item) => item.verified && item.program === program)
}

/** Verified testimonials across all programs — About page only (show the program label). */
export function testimonialsForAboutPage(): readonly Testimonial[] {
  return TESTIMONIALS.filter((item) => item.verified && item.quote !== null)
}

export type LocalizedTestimonial = {
  id: string
  name: string
  quote: string | null
  /** "City · Role" when known, otherwise empty. */
  context: string
  programLabel: string
  videoUrl: string | null
  photo: string | null
}

export function localizeTestimonial(item: Testimonial, lang: 'en' | 'hi'): LocalizedTestimonial {
  const hi = lang === 'hi'
  const context = (hi ? [item.cityHi, item.roleHi] : [item.city, item.role]).filter((part) => part !== '').join(' · ')
  return {
    id: item.id,
    name: hi ? item.nameHi : item.name,
    quote: hi ? item.quoteHi : item.quote,
    context,
    programLabel: hi ? programs[item.program].nameHi : programs[item.program].name,
    videoUrl: item.videoUrl,
    photo: item.photo,
  }
}
