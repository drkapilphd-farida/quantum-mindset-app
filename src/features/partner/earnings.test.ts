import { describe, expect, it } from 'vitest'
import { formatInr, leadTag, normalizeIndianMobile, partnerEarnings, recoverText } from './earnings'

describe('partner earnings calculator', () => {
  it('uses ₹2,549 per Self student and ₹4,499 per Live student when Dr. Kapil teaches', () => {
    const e = partnerEarnings(10, 3, 'drKapil')
    expect(e.fromSelf).toBe(25490)
    expect(e.fromLive).toBe(13497)
    expect(e.monthly).toBe(38987)
    expect(e.yearly).toBe(38987 * 12)
    expect(e.recoverMonths).toBe(2) // ceil(45000 / 38987)
  })

  it('uses ₹7,649 per Live student when the partner teaches', () => {
    expect(partnerEarnings(0, 2, 'self').fromLive).toBe(15298)
  })

  it('has no payback period with 0 students', () => {
    const e = partnerEarnings(0, 0, 'drKapil')
    expect(e.monthly).toBe(0)
    expect(e.recoverMonths).toBeNull()
    expect(recoverText(e.recoverMonths)).toBe('Choose students')
  })

  it('says "about 1 month" when one month is enough', () => {
    expect(recoverText(partnerEarnings(40, 20, 'self').recoverMonths)).toBe('about 1 month')
    expect(recoverText(18)).toBe('about 18 months')
  })

  it('formats money in Indian style', () => {
    expect(formatInr(123456)).toBe('₹1,23,456')
    expect(formatInr(45000)).toBe('₹45,000')
    expect(formatInr(0)).toBe('₹0')
  })
})

describe('partner lead tag', () => {
  it('tags A when ready now or with EMI and already in touch with children or parents', () => {
    expect(leadTag('Yes, I have my own students', 'Yes, now')).toBe('A')
    expect(leadTag('I know people in my society/school', 'I need EMI')).toBe('A')
  })

  it('does not tag A without contact with children or parents', () => {
    expect(leadTag('Not yet', 'Yes, now')).toBe('C')
    expect(leadTag('Not yet', 'I need EMI')).toBe('C')
  })

  it('tags B for "In 1 month" and C for "Not now"', () => {
    expect(leadTag('Not yet', 'In 1 month')).toBe('B')
    expect(leadTag('Yes, I have my own students', 'In 1 month')).toBe('B')
    expect(leadTag('Yes, I have my own students', 'Not now')).toBe('C')
  })
})

describe('Indian mobile number', () => {
  it('accepts 10-digit numbers starting with 6–9, with or without +91 / 0', () => {
    expect(normalizeIndianMobile('9540123161')).toBe('+919540123161')
    expect(normalizeIndianMobile('+91 95401 23161')).toBe('+919540123161')
    expect(normalizeIndianMobile('095401-23161')).toBe('+919540123161')
    expect(normalizeIndianMobile('91 6000000000')).toBe('+916000000000')
  })

  it('rejects other numbers', () => {
    expect(normalizeIndianMobile('5540123161')).toBeNull()
    expect(normalizeIndianMobile('95401231')).toBeNull()
    expect(normalizeIndianMobile('+1 415 555 0100')).toBeNull()
    expect(normalizeIndianMobile('abcdefghij')).toBeNull()
  })
})
