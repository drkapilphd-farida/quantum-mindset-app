// Server only (service role). The Brain Unlock WhatsApp follow-ups: queued
// when a lead is saved, sent by the 15-minute scheduler (/api/cron/reminders).
// Stops for good when the lead buys Sharp Brain or sends STOP; each step can
// be turned off in /admin/brain-unlock-settings.
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import {
  isChatboxxConfigured,
  sendWhatsAppText,
} from "@/lib/whatsapp/chatboxx";
import {
  FOLLOWUP_DELAYS_MS,
  followupText,
  type FollowupContext,
  type FollowupStep,
} from "./messages";
import { getBrainUnlockSettings } from "./settingsServer";
import type { BuSettings } from "./settings";

const STEPS: readonly FollowupStep[] = ["instant", "h1", "d1", "d2", "d30"];
const MAX_ATTEMPTS = 3;
const BATCH = 50;

/** The steps to queue for a new lead, with their due times. Pure (tested). */
export function plannedFollowups(
  createdAtMs: number,
  s: BuSettings,
): { step: FollowupStep; dueAt: string }[] {
  if (!s.followups.enabled) return [];
  return STEPS.filter((step) => s.followups[step]).map((step) => ({
    step,
    dueAt: new Date(createdAtMs + FOLLOWUP_DELAYS_MS[step]).toISOString(),
  }));
}

export async function queueFollowups(
  leadId: string,
  createdAtMs: number,
  s: BuSettings,
): Promise<void> {
  const rows = plannedFollowups(createdAtMs, s).map((p) => ({
    lead_id: leadId,
    step: p.step,
    due_at: p.dueAt,
  }));
  if (rows.length === 0) return;
  const { error } = await createServiceClient()
    .from("brain_unlock_followups")
    .insert(rows);
  if (error)
    logger.warn("brain-unlock: follow-ups not queued", { code: error.code });
}

/** Last 10 digits of a number, for matching "+91…", "91…" and plain forms. */
export function last10(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

/** Has this lead paid for Sharp Brain since the lead was saved? (masterclass_payments, by phone or email) */
export async function hasPurchasedSince(
  phone: string,
  email: string | null,
  sinceIso: string,
): Promise<boolean> {
  const client = createServiceClient();
  const digits = last10(phone);
  if (digits.length === 10) {
    const { data } = await client
      .from("masterclass_payments")
      .select("id")
      .like("phone", `%${digits}`)
      .gte("created_at", sinceIso)
      .limit(1);
    if ((data ?? []).length > 0) return true;
  }
  if (email !== null && email !== "") {
    const { data } = await client
      .from("masterclass_payments")
      .select("id")
      .eq("email", email.toLowerCase())
      .gte("created_at", sinceIso)
      .limit(1);
    if ((data ?? []).length > 0) return true;
  }
  return false;
}

type DueRow = { id: string; lead_id: string; step: string; attempts: number };
type LeadRow = {
  id: string;
  whatsapp_number: string;
  email: string | null;
  created_at: string;
  details: unknown;
};

function isFollowupStep(s: string): s is FollowupStep {
  return (STEPS as readonly string[]).includes(s);
}

function contextFrom(
  details: unknown,
  settings: BuSettings,
): FollowupContext | null {
  if (typeof details !== "object" || details === null) return null;
  const d = details as {
    facts?: FollowupContext["facts"];
    role?: FollowupContext["role"];
    links?: FollowupContext["links"];
  };
  if (d.facts === undefined || d.role === undefined || d.links === undefined)
    return null;
  return { facts: d.facts, role: d.role, links: d.links, settings };
}

/** Sends every due follow-up. Returns counts only (no personal data). */
export async function sendBrainUnlockFollowups(
  nowMs: number = Date.now(),
): Promise<Record<string, number>> {
  const counts: Record<string, number> = {
    sent: 0,
    skipped: 0,
    stopped: 0,
    failed: 0,
  };
  try {
    const client = createServiceClient();
    const { data: due, error } = await client
      .from("brain_unlock_followups")
      .select("id, lead_id, step, attempts")
      .eq("status", "pending")
      .lte("due_at", new Date(nowMs).toISOString())
      .order("due_at")
      .limit(BATCH);
    if (error || due === null || due.length === 0) return counts;
    const settings = await getBrainUnlockSettings();
    const leadIds = [...new Set((due as DueRow[]).map((r) => r.lead_id))];
    const { data: leads } = await client
      .from("speed_test_results")
      .select("id, whatsapp_number, email, created_at, details")
      .in("id", leadIds);
    const leadById = new Map(
      ((leads ?? []) as LeadRow[]).map((l) => [l.id, l]),
    );
    const numbers = [
      ...new Set(((leads ?? []) as LeadRow[]).map((l) => l.whatsapp_number)),
    ];
    const { data: optOuts } = await client
      .from("whatsapp_opt_outs")
      .select("whatsapp_number")
      .in("whatsapp_number", numbers);
    const stopped = new Set((optOuts ?? []).map((o) => o.whatsapp_number));
    const purchased = new Map<string, boolean>();

    const finish = async (
      row: DueRow,
      status: "sent" | "skipped" | "stopped" | "failed" | "pending",
      reason: string | null,
      attempts = row.attempts,
    ): Promise<void> => {
      await client
        .from("brain_unlock_followups")
        .update({
          status,
          reason,
          attempts,
          ...(status === "sent"
            ? { sent_at: new Date(nowMs).toISOString() }
            : {}),
        })
        .eq("id", row.id);
      if (status !== "pending") counts[status] = (counts[status] ?? 0) + 1;
    };
    const stopAll = async (leadId: string, reason: string): Promise<void> => {
      const { data } = await client
        .from("brain_unlock_followups")
        .update({ status: "stopped", reason })
        .eq("lead_id", leadId)
        .eq("status", "pending")
        .select("id");
      counts.stopped = (counts.stopped ?? 0) + (data ?? []).length;
    };

    for (const row of due as DueRow[]) {
      const lead = leadById.get(row.lead_id);
      if (lead === undefined || !isFollowupStep(row.step)) {
        await finish(row, "skipped", "lead_missing");
        continue;
      }
      if (stopped.has(lead.whatsapp_number)) {
        await stopAll(lead.id, "stop_requested");
        continue;
      }
      if (!purchased.has(lead.id))
        purchased.set(
          lead.id,
          await hasPurchasedSince(
            lead.whatsapp_number,
            lead.email,
            lead.created_at,
          ),
        );
      if (purchased.get(lead.id) === true) {
        await stopAll(lead.id, "purchased");
        continue;
      }
      if (!settings.followups.enabled || !settings.followups[row.step]) {
        await finish(row, "skipped", "turned_off");
        continue;
      }
      const ctx = contextFrom(lead.details, settings);
      const text = ctx === null ? null : followupText(row.step, ctx);
      if (text === null) {
        await finish(
          row,
          "skipped",
          ctx === null ? "no_details" : "no_content",
        );
        continue;
      }
      if (!isChatboxxConfigured()) {
        await finish(row, "skipped", "whatsapp_api_not_configured");
        continue;
      }
      const res = await sendWhatsAppText(lead.whatsapp_number, text);
      if (res.ok) await finish(row, "sent", null, row.attempts + 1);
      else if (res.reason === "failed" && row.attempts + 1 < MAX_ATTEMPTS)
        await finish(row, "pending", "retrying", row.attempts + 1);
      else
        await finish(
          row,
          res.reason === "failed" ? "failed" : "skipped",
          res.reason,
          row.attempts + 1,
        );
    }
  } catch (e) {
    logger.error("brain-unlock: follow-up run failed", {
      error: e instanceof Error ? e.message : "unknown",
    });
  }
  return counts;
}
