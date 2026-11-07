import { z } from 'zod'
import { normalizeIndianMobile } from '@/lib/phone/indianMobile'
import { AREA_OPTIONS } from '@/features/personal-sessions/personalSessionsCopy'

// /personal-sessions enquiry form — validated again on the server.
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
  area: z.enum(AREA_OPTIONS, { message: 'Please choose the kind of session.' }),
  change: z.string().trim().min(10, 'Please write a few words about what you would like to change, and why.').max(2000),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional(),
})

export type SessionEnquiryInput = z.input<typeof SessionEnquirySchema>
