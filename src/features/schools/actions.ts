"use server";

import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { SCHOOLS_COPY } from "./copy";
import { leadRow, SchoolLeadSchema } from "./leadSchema";
import { sendSchoolLeadNotification } from "./email";

export type SubmitSchoolLeadResult = { success: true } | { success: false; error: string };

// /schools "Book a free pilot". Saved with the visitor's own (anon) client,
// so the table's RLS applies: insert only, as a new lead, no read-back.
// The email to Dr. Kapil is sent after the response (best-effort).
export async function submitSchoolLead(input: unknown): Promise<SubmitSchoolLeadResult> {
  const parsed = SchoolLeadSchema.safeParse(input);
  const lang = typeof input === "object" && input !== null && (input as { lang?: unknown }).lang === "hi" ? "hi" : "en";
  if (!parsed.success) {
    logger.warn("[school-leads] submit input failed validation", {
      issues: parsed.error.issues.map((issue) => issue.path.join(".")),
    });
    const first = parsed.error.issues[0];
    const errors = SCHOOLS_COPY[lang].form.errors;
    // The schema's messages are English; the Hindi page gets a Hindi line.
    const message = first?.path[0] === "phone" ? errors.phone : lang === "en" ? (first?.message ?? errors.check) : errors.check;
    return { success: false, error: message };
  }
  const lead = parsed.data;
  // Honeypot filled → a bot. Pretend it worked, save nothing.
  if (lead.website !== undefined && lead.website !== "") return { success: true };
  // A school books once; 5 requests per 10 minutes per IP is plenty.
  if (!checkRateLimit(`school-lead:${await getClientIp()}`, { max: 5, windowMs: 600_000 }).allowed) {
    return { success: false, error: SCHOOLS_COPY[lead.lang].form.errors.generic };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("school_leads").insert(leadRow(lead));
  if (error) {
    logger.warn("[school-leads] failed to save lead", { code: error.code });
    return { success: false, error: SCHOOLS_COPY[lead.lang].form.errors.generic };
  }

  after(async () => {
    await sendSchoolLeadNotification(lead);
  });
  return { success: true };
}
