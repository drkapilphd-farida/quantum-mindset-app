import { z } from 'zod'
import { CONTACT_OPTIONS, INVEST_OPTIONS, OCCUPATIONS, START_OPTIONS, normalizeIndianMobile } from '@/features/partner/earnings'

// /partner apply form — validated again on the server. Lives outside the
// 'use server' file, which may only export async functions.
export const PartnerApplicationSchema = z.object({
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
  city: z.string().trim().min(2, 'Please enter your city or area.').max(100),
  occupation: z.enum(OCCUPATIONS, { message: 'Please choose what you do now.' }),
  contact: z.enum(CONTACT_OPTIONS, { message: 'Please answer the question about children and parents.' }),
  invest: z.enum(INVEST_OPTIONS, { message: 'Please answer the question about the partner fee.' }),
  start: z.enum(START_OPTIONS, { message: 'Please choose when you would like to start.' }),
  /** Honeypot — must stay empty (hidden from people, filled by bots). */
  website: z.string().max(0).optional(),
})

export type PartnerApplicationInput = z.input<typeof PartnerApplicationSchema>
export type PartnerApplication = z.output<typeof PartnerApplicationSchema>
