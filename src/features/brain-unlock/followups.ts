// Server only (service role). Brain Unlock WhatsApp follow-ups, sent BY HAND
// from the WhatsApp Business app (founder, 14 Nov 2026: no WhatsApp API).
// A lead gets its first step (Instant) when saved; in /admin/followups Dr.
// Kapil taps "Send on WhatsApp" (wa.me with the message typed in), then Done
// or Skip — only then does the next step get its due time. Nothing is sent
// automatically. A lead who has bought Sharp Brain, or whom he marks Stop
// (or who replied STOP), gets nothing more.
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import { FOLLOWUP_DELAYS_MS, type FollowupStep } from "./messages";
import type { BuSettings } from "./settings";

export const STEPS: readonly FollowupStep[] = [
  "instant",
  "h1",
  "d1",
  "d2",
  "d30",
];

export const STEP_LABELS: Readonly<Record<FollowupStep, string>> = {
  instant: "Instant",
  h1: "+1 hour",
  d1: "+1 day",
  d2: "+2 days",
  d30: "+30 days",
};

export function isFollowupStep(s: string): s is FollowupStep {
  return (STEPS as readonly string[]).includes(s);
}

/** Is this step turned on, and does it have something to send? Pure (tested). */
export function stepAvailable(step: FollowupStep, s: BuSettings): boolean {
  if (!s.followups.enabled || !s.followups[step]) return false;
  if (step === "h1") return s.demoVideoId !== "";
  if (step === "d1") return s.reviewVideoIds.parent !== "";
  return true;
}

/** The next step after `after` (null = the first), skipping unavailable ones. Pure (tested). */
export function nextStep(
  after: FollowupStep | null,
  s: BuSettings,
): FollowupStep | null {
  const from = after === null ? 0 : STEPS.indexOf(after) + 1;
  return STEPS.slice(from).find((step) => stepAvailable(step, s)) ?? null;
}

/**
 * When a step falls due. The first: lead time + its delay. Later ones: counted
 * from when the previous step was actually done, so a late send never makes
 * two messages land back to back. Pure (tested).
 */
export function dueAtFor(
  step: FollowupStep,
  previous: FollowupStep | null,
  fromMs: number,
): string {
  const gap =
    FOLLOWUP_DELAYS_MS[step] -
    (previous === null ? 0 : FOLLOWUP_DELAYS_MS[previous]);
  return new Date(fromMs + gap).toISOString();
}

/** A new lead: queue its first step (normally Instant, due now). */
export async function queueFollowups(
  leadId: string,
  createdAtMs: number,
  s: BuSettings,
): Promise<void> {
  const step = nextStep(null, s);
  if (step === null) return;
  const { error } = await createServiceClient()
    .from("brain_unlock_followups")
    .insert({
      lead_id: leadId,
      step,
      due_at: dueAtFor(step, null, createdAtMs),
    });
  if (error)
    logger.warn("brain-unlock: follow-up not queued", { code: error.code });
}

/** After Done / Skip: queue the step after `done` (if any). */
export async function queueNextFollowup(
  leadId: string,
  done: FollowupStep,
  doneAtMs: number,
  s: BuSettings,
): Promise<FollowupStep | null> {
  const step = nextStep(done, s);
  if (step === null) return null;
  const { error } = await createServiceClient()
    .from("brain_unlock_followups")
    .upsert(
      {
        lead_id: leadId,
        step,
        due_at: dueAtFor(step, done, doneAtMs),
        status: "pending",
      },
      { onConflict: "lead_id,step", ignoreDuplicates: true },
    );
  if (error)
    logger.warn("brain-unlock: next follow-up not queued", {
      code: error.code,
    });
  return step;
}

/** Last 10 digits of a number, for matching "+91…", "91…" and plain forms. */
export function last10(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

export type PaymentRow = {
  phone: string | null;
  email: string | null;
  created_at: string;
};
export type LeadContact = {
  id: string;
  whatsapp_number: string;
  email: string | null;
  created_at: string;
};

/** Leads who paid for Sharp Brain after their test (same phone or email). Pure (tested). */
export function boughtLeadIds(
  leads: readonly LeadContact[],
  payments: readonly PaymentRow[],
): Set<string> {
  const out = new Set<string>();
  for (const lead of leads) {
    const digits = last10(lead.whatsapp_number);
    const email = lead.email?.toLowerCase() ?? null;
    const hit = payments.some(
      (p) =>
        p.created_at >= lead.created_at &&
        ((digits.length === 10 &&
          p.phone !== null &&
          last10(p.phone) === digits) ||
          (email !== null && email !== "" && p.email?.toLowerCase() === email)),
    );
    if (hit) out.add(lead.id);
  }
  return out;
}

/**
 * Sharp Brain payments (masterclass_payments: Razorpay webhook payments and
 * manual enrolments) since the earliest of these leads.
 */
export async function paymentsSince(sinceIso: string): Promise<PaymentRow[]> {
  const { data, error } = await createServiceClient()
    .from("masterclass_payments")
    .select("phone, email, created_at")
    .gte("created_at", sinceIso)
    .limit(5000);
  if (error) {
    logger.warn("brain-unlock: payments not read", { code: error.code });
    return [];
  }
  return data ?? [];
}
