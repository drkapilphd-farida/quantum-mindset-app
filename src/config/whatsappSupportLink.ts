import { primaryCheckoutHref, programs, waLink } from './site.config'
// Direct WhatsApp click-to-chat link for Dr. Kapil Dev Sharma — lets
// prospective 30-Day Masterclass students ask about batch timing and
// enrollment before paying. Single source of truth so the dashboard hero
// and any future placement never risk drifting to two different numbers
// or pre-filled messages.
export const WHATSAPP_MASTERCLASS_INQUIRY_LINK =
  waLink(`Hi Dr. Kapil, I want to know more about the ${programs.sharpBrain.name}`)

// Same number, enrollment-intent message — for placements (like the
// /reviews success-stories page) where the visitor has already seen the
// proof and is ready to join, not just asking to learn more.
export const WHATSAPP_ENROLLMENT_INQUIRY_LINK =
  waLink(`Hi Dr. Kapil, I want to enroll in the ${programs.sharpBrain.name}`)


// Same number, per-city Offline QSR + EEG Workshop message (see the
// "Homepage, QSR & Multi-City EEG Rewrite" task) — replaces the old
// Vadodara-only WHATSAPP_VADODARA_EEG_INQUIRY_LINK now that the offline
// EEG track is offered across 6 cities (see eegWorkshopCities.ts), not
// just Vadodara. Message text is deliberately honest about a city's real
// status (waitlist vs. confirmed date) rather than implying every city
// already has a booked batch — same reasoning as
// buildResidentialWhatsAppLink below.
export function buildOfflineEegWorkshopWhatsAppLink(city: string, status: 'waitlist' | 'confirmed'): string {
  const intent =
    status === 'confirmed'
      ? `I want to register for the 2-day Sharp Brain Workshop in ${city}`
      : `I want to join the waitlist for the 2-day Sharp Brain Workshop in ${city}`
  return `https://wa.me/919540123161?text=${encodeURIComponent(`Hi Dr. Kapil, ${intent}`)}`
}

// Same number, program-agnostic message — for the homepage's floating
// widget and FAQ section, where the visitor may be asking about any of
// the five offers (Masterclass, Retreats, Mentoring, Course, Habit App),
// not specifically the Masterclass.
export const WHATSAPP_GENERAL_INQUIRY_LINK =
  'https://wa.me/919540123161?text=Hi%20Dr.%20Kapil,%20I%20have%20a%20question%20about%20your%20programs'

// Same number, 11-Day Online Retreat-specific message — for the
// dedicated /retreats/online-11-day landing page. No Razorpay payment
// link exists for the retreats (unlike the Masterclass's real ₹9,999
// link) — pricing and batch enrollment are WhatsApp-inquiry-based today,
// so this is the real primary conversion path for that page, not a
// placeholder standing in for a missing checkout.
export const WHATSAPP_RETREAT_INQUIRY_LINK =
  waLink(`Hi Dr. Kapil, I want to secure my spot in the ${programs.onlineRetreat.name}`)

// Same number, Residential Retreat-specific message — for the dedicated
// /retreats/residential landing page. Like the online retreat, there's no
// Razorpay payment link for the residential retreats (real pricing exists
// — ₹35,000/₹45,000 per person — but seat confirmation is handled
// personally by Dr. Kapil's team given the small-cohort, multi-venue
// logistics), so WhatsApp is the real primary booking path, not a
// placeholder standing in for a missing checkout.
export const WHATSAPP_RESIDENTIAL_INQUIRY_LINK =
  primaryCheckoutHref('residentialRetreat')

// Same number, 1-on-1 Personal Class-specific message — for the
// dedicated /mentoring/personal-class landing page. No hosted checkout
// or persisted application database exists for this offer (real pricing
// is fully customised per person, decided after the short conversation
// step) — WhatsApp is the real primary application path, same pattern
// as every other offer on this site without a dedicated backend yet.
export const WHATSAPP_MENTORING_INQUIRY_LINK =
  primaryCheckoutHref('oneOnOneCoaching')

// Same number, pre-application "Talk to Our Team" message — for a visitor
// on /franchise-individual who wants to ask a question first, not a
// substitute for the instant-apply link below.
export const WHATSAPP_FRANCHISE_TEAM_INQUIRY_LINK =
  'https://wa.me/919540123161?text=Hi%20Dr.%20Kapil,%20I%20have%20a%20question%20about%20the%20Trainer%20Partner%20Program'

// Same number, the actual primary conversion path on /franchise-individual —
// a single-tap "Apply Instantly via WhatsApp" CTA with no typed fields
// required upfront (replaced the old name/phone/city form, which added
// drop-off friction the WhatsApp conversation itself doesn't need; those
// details are simply given in the chat that opens).
export const WHATSAPP_FRANCHISE_INSTANT_APPLY_LINK =
  primaryCheckoutHref('franchise')

// Same number, used by the Franchise/Individual Trainer application form
// (/franchise-individual) to hand off every submitted field — this is the
// real, primary submission path for that form (WhatsApp-first, per
// explicit instruction): opened directly on submit, not just an
// inquiry-before-paying link like the others in this file. The franchise
// page's own Server Action (submitFranchiseLead.ts) separately saves the
// same fields to `franchise_leads` as a best-effort backup record — that
// insert must never block or delay this WhatsApp redirect.
export function buildFranchiseApplicationWhatsAppLink(details: {
  name: string
  phone: string
  city: string
  background: string
  whyInterested: string
}): string {
  const lines = [
    'New Franchise Application',
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `City: ${details.city}`,
  ]
  if (details.background.trim().length > 0) {
    lines.push(`Background: ${details.background.trim()}`)
  }
  if (details.whyInterested.trim().length > 0) {
    lines.push(`Why interested: ${details.whyInterested.trim()}`)
  }
  return `https://wa.me/919540123161?text=${encodeURIComponent(lines.join('\n'))}`
}

// Same number, used by the Personal Class application form to hand off
// the name/phone/city/situation the visitor already typed — so Dr.
// Kapil's team has real context before the conversation starts, same
// technique as buildResidentialWhatsAppLink below.
export function buildMentoringApplicationWhatsAppLink(details: {
  name: string
  phone: string
  city: string
  situation: string
}): string {
  const lines = [
    `Hi Dr. Kapil, I want to apply for ${programs.oneOnOneCoaching.name}.`,
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `City: ${details.city}`,
  ]
  if (details.situation.trim().length > 0) {
    lines.push(`What I'm dealing with: ${details.situation.trim()}`)
  }
  return `https://wa.me/919540123161?text=${encodeURIComponent(lines.join('\n'))}`
}

// Same number, Overthinking Mastery Course-specific message — for the
// dedicated /mentoring/overthinking-course landing page. Checkout and
// billing for this offer happen entirely on Classplus (see
// overthinkingCoursePaymentLink.ts), not on this site — this WhatsApp
// link is only for pre-purchase questions, not the primary conversion
// path (the Classplus link is).
export const WHATSAPP_COURSE_INQUIRY_LINK =
  waLink(`Hi Dr. Kapil, I have a question about the ${programs.overthinkingReset.name}`)

// Same number, Overthinking Test (/mind-assessment) result hand-off —
// see the "Build the Overthinking Test Free Assessment" task. Uses the
// exact Hindi message template that task specified verbatim (not
// translated per site language toggle — this goes to Dr. Kapil's team,
// who work in Hindi, regardless of which language the visitor took the
// test in). Deliberately requires the visitor to tap Send themselves —
// this is a user-completed hand-off, not a silent auto-send (that would
// need the WhatsApp Business API, out of scope here). Called only after
// the lead is already saved via submitOverthinkingTestLead — this is a
// secondary, best-effort notification step, same division of
// responsibility as every other buildXWhatsAppLink in this file.
export function buildOverthinkingTestWhatsAppLink(details: {
  name: string
  overthinkingBand: string
  worryBand: string
  stressBand: string
}): string {
  const lines = [
    'नमस्ते, मैंने Overthinking Test पूरा किया है।',
    `नाम: ${details.name}`,
    `Overthinking Score: ${details.overthinkingBand}`,
    `Worry Score: ${details.worryBand}`,
    `Stress Score: ${details.stressBand}`,
    `कृपया मुझे ${programs.overthinkingReset.name} के बारे में जानकारी भेजें।`,
  ]
  return `https://wa.me/919540123161?text=${encodeURIComponent(lines.join('\n'))}`
}

// Same number, for placements on /retreats/residential that know which
// specific date or room type the visitor is interested in (a roadmap
// date card, a pricing tier) — pre-filling that detail into the message
// removes a step for the visitor and gives Dr. Kapil's team useful
// context before the conversation even starts.
export function buildResidentialWhatsAppLink(detail: string): string {
  return `https://wa.me/919540123161?text=${encodeURIComponent(`Hi Dr. Kapil, I want to secure my seat — ${detail}`)}`
}


// PREfrontal POWER (27 Sept 2026, Mumbai, ₹3,500, 40 seats) — same "no
// dedicated checkout exists yet" situation as the Retreats and Personal
// Class links above, so this is the real, working, primary registration
// path today (not a dead "#" placeholder), following the exact same
// WHATSAPP_*_INQUIRY_LINK pattern already established for every other
// date-bound/limited-seat live offer on this site. If a real payment
// link or booking form is set up later, only this one constant needs to
// change — every component importing it (hero, nav, mobile sticky bar,
// final CTA, and the homepage teaser section) updates automatically.
export const PREFRONTAL_POWER_REGISTRATION_URL =
  "https://wa.me/919540123161?text=Hi,%20I'm%20interested%20in%20attending%20PREfrontal%20POWER%20on%2027%20September%20in%20Mumbai.%20Please%20share%20the%20registration%20details."
