/**
 * An Indian mobile number in +91XXXXXXXXXX form, or null. Accepts spaces,
 * dashes and brackets, an optional +91 / 91 / 0 prefix, and 10 digits
 * starting with 6–9. Shared by the /partner and /personal-sessions forms.
 */
export function normalizeIndianMobile(input: string): string | null {
  const digits = input.replace(/[\s\-()]/g, '')
  const match = /^(?:\+?91|0)?([6-9]\d{9})$/.exec(digits)
  return match?.[1] === undefined ? null : `+91${match[1]}`
}
