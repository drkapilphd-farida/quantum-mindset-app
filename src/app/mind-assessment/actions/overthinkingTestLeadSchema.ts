import { z } from 'zod'

// Basic 10-digit Indian mobile format, per explicit spec (stricter than
// leadCaptureSchema.ts's international-permissive pattern, deliberately
// — this form's own copy promises "10-digit mobile number"). Accepts an
// optional +91/91 prefix and common separators, but the core number
// must be 10 digits starting 6–9 (India's real mobile number ranges).
const INDIAN_MOBILE_PATTERN = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/

// Lives in its own plain module rather than inside submitOverthinkingTestLead.ts
// — a 'use server' file may only export async functions, so anything
// else exported from it (like this schema) silently breaks at the
// client/server boundary. Both the Server Action and the client-side
// form import this shared schema from here instead — same pattern as
// leadCaptureSchema.ts.
export const OverthinkingTestLeadInputSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your name.').max(100),
  whatsappNumber: z
    .string()
    .trim()
    .regex(INDIAN_MOBILE_PATTERN, 'Please enter a valid 10-digit Indian mobile number.'),
  overthinkingScore: z.number().int().min(0).max(20),
  worryScore: z.number().int().min(0).max(20),
  stressScore: z.number().int().min(0).max(20),
  overallScore: z.number().int().min(0).max(60),
})

export type OverthinkingTestLeadInput = z.infer<typeof OverthinkingTestLeadInputSchema>
