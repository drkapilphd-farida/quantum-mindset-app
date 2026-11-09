// Pre-filled WhatsApp messages for the lead forms: every answer, labelled,
// one per line (sent to wa.me/919540123161 via waLink).

export type ClarityRequest = { programName: string; planName: string; retreatNotify?: boolean; name: string; phone: string; city: string; change: string }

export function clarityRequestMessage(r: ClarityRequest): string {
  return [
    'Hi Dr. Kapil, I would like to book a Clarity Session.',
    `Program: ${r.programName}`,
    `Plan: ${r.planName}`,
    ...(r.retreatNotify === true ? ['Notify me about in-person retreats (Rishikesh / Lonavala): Yes'] : []),
    `Name: ${r.name}`,
    `WhatsApp: ${r.phone}`,
    `City: ${r.city}`,
    `What I would like to change in my life, and why: ${r.change}`,
  ].join('\n')
}

export type PartnerApplicationAnswers = {
  name: string
  phone: string
  city: string
  occupation: string
  contact: string
  invest: string
  start: string
  questions: { occupation: string; contact: string; invest: string; start: string }
}

export function partnerApplicationMessage(a: PartnerApplicationAnswers): string {
  return [
    'Hi Dr. Kapil, I have applied for the Sharp Brain Partner Program.',
    'Program: Sharp Brain Partner Program',
    `Name: ${a.name}`,
    `WhatsApp: ${a.phone}`,
    `City / Area: ${a.city}`,
    `${a.questions.occupation} ${a.occupation}`,
    `${a.questions.contact} ${a.contact}`,
    `${a.questions.invest} ${a.invest}`,
    `${a.questions.start} ${a.start}`,
  ].join('\n')
}
