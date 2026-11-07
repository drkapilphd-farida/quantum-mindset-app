import { z } from 'zod'
import { normalizeIndianMobile } from '@/lib/phone/indianMobile'
import { PROGRAM_SLUGS } from '@/features/programs/programs'

// /personal-sessions booking form (Clarity Session request) — validated again
// on the server. `program` is a program slug or "not-sure".
export const NOT_SURE = 'not-sure' as const
const PROGRAM_VALUES = [NOT_SURE, ...PROGRAM_SLUGS] as [string, ...string[]]

export const SessionEnquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(100),
  phone: z
    .string()
    .trim()
    .transform((value, ctx) => {
      const mobile = normalizeIndianMobile(value)
      if (mobile === null) {
        ctx.addIssue({ code: 'custom', message: 'Please enter a valid 10-digit Indian mobile number.' })
        return z.NEVER
      }
      return mobile
    }),
  city: z.string().trim().min(2, 'Please enter your city.').max(100),
  program: z.enum(PROGRAM_VALUES, { message: 'Please choose a program, or "Not sure yet".' }),
  change: z.string().trim().min(10, 'Please write a few words about what you would like to change, and why.').max(2000),
  /** Page the request came from (program slug or "hub"), for the owner. */
  source: z.string().trim().max(60).optional(),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional(),
})

export type SessionEnquiryInput = z.input<typeof SessionEnquirySchema>
