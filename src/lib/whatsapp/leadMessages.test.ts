import { describe, expect, it } from 'vitest'
import { clarityRequestMessage, partnerApplicationMessage } from './leadMessages'
import { waLink } from '@/data/links'

describe('lead WhatsApp messages', () => {
  it('puts every Clarity Session answer and the program name in the message', () => {
    const msg = clarityRequestMessage({ programName: 'Telepathy', name: 'Asha', phone: '+919540123161', city: 'Vadodara', change: 'I want calmer relationships.' })
    for (const part of ['Clarity Session', 'Program: Telepathy', 'Name: Asha', 'WhatsApp: +919540123161', 'City: Vadodara', 'I want calmer relationships.']) expect(msg).toContain(part)
  })

  it('puts every partner answer in the message, with the question', () => {
    const msg = partnerApplicationMessage({
      name: 'Ravi', phone: '+916000000000', city: 'Surat', occupation: 'Teacher / Tuition', contact: 'Not yet', invest: 'I need EMI', start: 'This month',
      questions: { occupation: 'What do you do now?', contact: 'Do you have direct contact with children or parents?', invest: 'Are you ready to invest?', start: 'When would you like to start?' },
    })
    for (const part of ['Sharp Brain Partner Program', 'Name: Ravi', 'City / Area: Surat', 'What do you do now? Teacher / Tuition', 'I need EMI', 'This month']) expect(msg).toContain(part)
  })

  it('opens the owner’s WhatsApp number', () => {
    expect(waLink('x')).toBe('https://wa.me/919540123161?text=x')
  })
})
