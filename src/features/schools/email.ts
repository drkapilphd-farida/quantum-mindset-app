import { Resend } from "resend";
import { logger } from "@/lib/logger";
import { SCHOOLS_COPY } from "./copy";
import { monthLabel, type SchoolLead } from "./leadSchema";

// /schools "Book a free pilot" → email to Dr. Kapil (founder brief). Same
// Resend setup and "unconfigured = skip, never throw" rule as the partner
// form. The email has a one-tap WhatsApp link to reply to the school.
export const SCHOOL_LEAD_NOTIFY_EMAIL = "drkapilphd@gmail.com";

export function schoolLeadEmail(lead: SchoolLead): { subject: string; text: string } {
  const role = SCHOOLS_COPY.en.form.roles[lead.role];
  const reply = `https://wa.me/${lead.phone.replace("+", "")}?text=${encodeURIComponent(
    `Namaste ${lead.contactName}, thank you for booking a free Sharp Brain pilot for ${lead.schoolName}. — Dr. Kapil Dev Sharma, Mind Ur Mind`,
  )}`;
  const utm = Object.entries(lead.utm ?? {})
    .filter(([k, v]) => k.startsWith("utm_") && v !== "")
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
  return {
    subject: `New school pilot request — ${lead.schoolName} (${lead.city})`,
    text: [
      "New \"Book a free pilot\" request (/schools)",
      "",
      `School: ${lead.schoolName}`,
      `City: ${lead.city}`,
      `Contact: ${lead.contactName} (${role})`,
      `WhatsApp: ${lead.phone}`,
      `Email: ${lead.email ?? "—"}`,
      `Students: ${lead.students ?? "—"}`,
      `Preferred month: ${lead.preferredMonth === null ? "Not sure yet" : monthLabel(lead.preferredMonth, "en")}`,
      `Page language: ${lead.lang === "hi" ? "Hindi" : "English"}`,
      `Message: ${lead.message ?? "—"}`,
      ...(utm !== "" ? [`UTM: ${utm}`] : []),
      "",
      "Reply on WhatsApp (one tap):",
      reply,
      "",
      "All school leads: /admin/school-leads",
    ].join("\n"),
  };
}

/** Best-effort: never throws; false when not sent. */
export async function sendSchoolLeadNotification(lead: SchoolLead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("[school-leads] RESEND_API_KEY not set — skipping email notification");
    return false;
  }
  try {
    const { subject, text } = schoolLeadEmail(lead);
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to: process.env.SCHOOL_LEAD_NOTIFY_EMAIL ?? SCHOOL_LEAD_NOTIFY_EMAIL,
      subject,
      text,
    });
    if (error) {
      logger.warn("[school-leads] failed to send notification email", { error: error.message });
      return false;
    }
    return true;
  } catch (e) {
    logger.warn("[school-leads] notification email threw", { error: e instanceof Error ? e.message : "unknown" });
    return false;
  }
}
