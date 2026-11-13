import { Resend } from "resend";
import { logger } from "@/lib/logger";
import {
  numberLines,
  type ReportFacts,
} from "@/features/brain-unlock/messages";
import type { BuSettings } from "@/features/brain-unlock/settings";

// Brain Unlock emails (Resend). Same posture as sendTestLeadNotification: no
// RESEND_API_KEY = skip (logged), never throws — the lead is saved first.
const DEFAULT_NOTIFY_EMAIL = "drkapilphd@gmail.com";

function client(): { resend: Resend; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("[brain-unlock] RESEND_API_KEY not set — skipping email");
    return null;
  }
  return {
    resend: new Resend(apiKey),
    from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
  };
}

const typeLabel = (
  s: BuSettings,
  f: Pick<ReportFacts, "brainType">,
  lang: "en" | "hi",
): string =>
  `${s.brainTypes[f.brainType].emoji} ${s.brainTypes[f.brainType][lang].name}`;

export async function sendBrainUnlockFounderEmail(lead: {
  firstName: string;
  whatsappNumber: string;
  email: string | null;
  lang: string;
  role: string;
  classBand: string | null;
  facts: ReportFacts;
  settings: BuSettings;
  utmSource: string | null;
  utmCampaign: string | null;
}): Promise<void> {
  const c = client();
  if (c === null) return;
  const f = lead.facts;
  try {
    const { error } = await c.resend.emails.send({
      from: c.from,
      to: process.env.TEST_LEAD_NOTIFY_EMAIL ?? DEFAULT_NOTIFY_EMAIL,
      subject: `New Brain Unlock lead — ${lead.firstName} · ${typeLabel(lead.settings, f, "en")} · ${f.score}/100`,
      text: [
        `New Brain Unlock lead:`,
        ``,
        `Name: ${lead.firstName}`,
        `WhatsApp: +${lead.whatsappNumber}  (https://wa.me/${lead.whatsappNumber})`,
        lead.email !== null ? `Email: ${lead.email}` : null,
        `Role: ${lead.role}${lead.classBand !== null ? ` · class ${lead.classBand}` : ""} · language ${lead.lang}`,
        `Brain Type: ${typeLabel(lead.settings, f, "en")} · Score ${f.score}/100`,
        ...numberLines(f, "en"),
        f.child !== undefined
          ? `\nChild (Duo Mode): ${typeLabel(lead.settings, f.child, "en")} · ${f.child.score}/100\n${numberLines(f.child, "en").join("\n")}`
          : null,
        ``,
        `Source: ${lead.utmSource ?? "direct"}${lead.utmCampaign !== null ? ` / ${lead.utmCampaign}` : ""}`,
        ``,
        `All leads: https://app.mindurmind.org.in/admin/test-leads`,
      ]
        .filter((l): l is string => l !== null)
        .join("\n"),
    });
    if (error)
      logger.warn("[brain-unlock] founder email failed", {
        error: error.message,
      });
  } catch (e) {
    logger.warn("[brain-unlock] founder email threw", {
      error: e instanceof Error ? e.message : "unknown",
    });
  }
}

export async function sendBrainUnlockReportEmail(input: {
  to: string;
  lang: "en" | "hi";
  facts: ReportFacts;
  settings: BuSettings;
  role: "parent" | "student" | "professional";
  links: { report: string; selfPaced: string; live: string };
}): Promise<void> {
  const c = client();
  if (c === null) return;
  const { facts: f, settings: s, lang } = input;
  const hi = lang === "hi";
  const t = s.brainTypes[f.brainType];
  try {
    const { error } = await c.resend.emails.send({
      from: c.from,
      to: input.to,
      subject: hi
        ? `आपकी Brain Unlock Report: ${t.emoji} ${t.hi.name}`
        : `Your Brain Unlock Report: ${t.emoji} ${t.en.name}`,
      text: [
        hi ? `नमस्ते ${f.firstName},` : `Hi ${f.firstName},`,
        ``,
        hi
          ? `ये रहा आपका Brain Unlock — आपने बदलाव खुद देखा:`
          : `Here is your Brain Unlock. You saw the change yourself:`,
        ``,
        `${typeLabel(s, f, lang)} — ${t[lang].line}`,
        `Brain Unlock Score: ${f.score}/100`,
        ...numberLines(f, lang),
        f.child !== undefined
          ? `\n${f.child.label}: ${typeLabel(s, f.child, lang)} · ${f.child.score}/100\n${numberLines(f.child, lang).join("\n")}`
          : null,
        ``,
        hi ? `आपका 30-दिन का plan:` : `Your 30-day plan:`,
        `⚡ ${s.goals.speed[lang]}`,
        `🧠 ${s.goals.memory[lang]}`,
        `🎯 ${s.goals.focus[lang]}`,
        ``,
        hi
          ? `ये सिर्फ़ 4 मिनट थे। Sharp Brain में यही 30 दिन रोज़ होता है, Dr. Kapil के साथ।`
          : `This was just 4 minutes. In Sharp Brain, this happens every day for 30 days, with Dr. Kapil.`,
        ``,
        `Self-paced ₹2,999: ${input.links.selfPaced}`,
        `Live batch ₹8,999: ${input.links.live}`,
        ``,
        hi
          ? `Brain Types नतीजा दिखाने का एक मज़ेदार तरीका हैं, कोई medical या psychological test नहीं।`
          : `Brain Types are a fun way to show your result, not a medical or psychological test.`,
        ``,
        `Dr. Kapil Dev Sharma · Mind Ur Mind`,
      ]
        .filter((l): l is string => l !== null)
        .join("\n"),
    });
    if (error)
      logger.warn("[brain-unlock] report email failed", {
        error: error.message,
      });
  } catch (e) {
    logger.warn("[brain-unlock] report email threw", {
      error: e instanceof Error ? e.message : "unknown",
    });
  }
}
