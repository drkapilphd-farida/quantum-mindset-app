import { z } from 'zod'
import { normalizeIndianMobile } from '@/lib/phone/indianMobile'
import { PROGRAM_SLUGS } from '@/features/programs/programs'
import { PLAN_IDS } from '@/features/programs/plans'

// /personal-sessions booking form (Clarity Session request) — validated again
// on the server. `program` is a program slug or "not-sure".
export const NOT_SURE = 'not-sure' as const
const PROGRAM_VALUES = [NOT_SURE, ...PROGRAM_SLUGS] as [string, ...string[]]
const PLAN_VALUES = [...PLAN_IDS] as [string, ...string[]]

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
  /** Clarity Session or one of the 5 plans (owner's plans brief). */
  plan: z.enum(PLAN_VALUES, { message: 'Please choose a plan.' }).optional(),
  /** Personal Retreat only: "Notify me about in-person retreats". */
  retreatNotify: z.boolean().optional(),
  /** Optional since the conversion brief (Nov 2026). */
  change: z.string().trim().max(2000).optional(),
  /** The visitor's utm_* params from the landing URL (conversion brief). */
  utm: z.record(z.string().max(40), z.string().trim().max(200)).optional(),
  /** Page the request came from (program slug or "hub"), for the owner. */
  source: z.string().trim().max(60).optional(),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional(),
})

export type SessionEnquiryInput = z.input<typeof SessionEnquirySchema>
