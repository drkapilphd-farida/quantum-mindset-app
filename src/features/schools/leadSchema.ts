import { z } from "zod";
import { normalizeIndianMobile } from "@/lib/phone/indianMobile";
import { SCHOOL_ROLES } from "./copy";

// "Book a free pilot" (/schools) — validated again on the server. Lives
// outside the 'use server' file, which may only export async functions.

const optionalText = (max: number): z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | null, string | undefined>> =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === undefined || v === "" ? null : v));

/** The next 12 months as YYYY-MM (IST), for the "Preferred month" list. */
export function upcomingMonths(now: Date = new Date(), count = 12): string[] {
  const [y, m] = now
    .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
    .split("-")
    .map(Number) as [number, number];
  return Array.from({ length: count }, (_, i) => {
    const total = y * 12 + (m - 1) + i;
    return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
  });
}

/** "2026-12" → "December 2026" / "दिसंबर 2026". */
export function monthLabel(ym: string, lang: "en" | "hi"): string {
  const [y, m] = ym.split("-").map(Number) as [number, number];
  return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const SchoolLeadSchema = z.object({
  schoolName: z.string().trim().min(2, "Please enter the school name.").max(150),
  city: z.string().trim().min(2, "Please enter the city.").max(100),
  contactName: z.string().trim().min(2, "Please enter your name.").max(100),
  role: z.enum(SCHOOL_ROLES, { message: "Please choose your role." }),
  phone: z
    .string()
    .trim()
    .transform((value, ctx) => {
      const mobile = normalizeIndianMobile(value);
      if (mobile === null) {
        ctx.addIssue({ code: "custom", message: "Please enter a valid 10-digit Indian mobile number." });
        return z.NEVER;
      }
      return mobile;
    }),
  email: z
    .string()
    .trim()
    .max(254)
    .optional()
    .transform((v) => (v === undefined || v === "" ? null : v.toLowerCase()))
    .refine((v) => v === null || z.email().safeParse(v).success, "Please enter a valid email, or leave it empty."),
  students: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v, ctx) => {
      if (v === undefined || v === "") return null;
      const n = typeof v === "number" ? v : Number(v);
      if (!Number.isInteger(n) || n < 1 || n > 100000) {
        ctx.addIssue({ code: "custom", message: "Please enter the number of students (or leave it empty)." });
        return z.NEVER;
      }
      return n;
    }),
  preferredMonth: z
    .string()
    .optional()
    .transform((v) => (v === undefined || v === "" ? null : v))
    .refine((v) => v === null || /^\d{4}-(0[1-9]|1[0-2])$/.test(v), "Please choose a month."),
  message: optionalText(1000),
  lang: z.enum(["en", "hi"]).default("en"),
  /** The visitor's utm_* params from the landing URL. */
  utm: z.record(z.string().max(40), z.string().trim().max(200)).optional(),
  /** Honeypot — hidden from people, filled by bots: the action then pretends success and saves nothing. */
  website: z.string().max(500).optional(),
});

export type SchoolLeadInput = z.input<typeof SchoolLeadSchema>;
export type SchoolLead = z.output<typeof SchoolLeadSchema>;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/** The insert row for school_leads (status/notes left to their defaults). */
export function leadRow(lead: SchoolLead): {
  school_name: string;
  city: string;
  contact_name: string;
  role: string;
  phone: string;
  email: string | null;
  students: number | null;
  preferred_month: string | null;
  message: string | null;
  lang: string;
} & Partial<Record<(typeof UTM_KEYS)[number], string | null>> {
  const utm = Object.fromEntries(
    UTM_KEYS.map((k) => [k, (lead.utm?.[k] ?? "").slice(0, 200) || null]),
  ) as Record<(typeof UTM_KEYS)[number], string | null>;
  return {
    school_name: lead.schoolName,
    city: lead.city,
    contact_name: lead.contactName,
    role: lead.role,
    phone: lead.phone,
    email: lead.email,
    students: lead.students,
    preferred_month: lead.preferredMonth,
    message: lead.message,
    lang: lead.lang,
    ...utm,
  };
}
