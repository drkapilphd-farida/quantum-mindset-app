// Server only (service role). /admin/followups: the follow-ups due for Dr.
// Kapil to send by hand, each with its message and wa.me link ready.
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import {
  followupText,
  waLink,
  type FollowupContext,
  type FollowupStep,
} from "../messages";
import {
  boughtLeadIds,
  isFollowupStep,
  paymentsSince,
  type LeadContact,
} from "../followups";
import { getBrainUnlockSettings } from "../settingsServer";
import type { BuSettings } from "../settings";

export const FOLLOWUP_VIEWS = ["due", "today", "overdue", "all"] as const;
export type FollowupView = (typeof FOLLOWUP_VIEWS)[number];

export type FollowupItem = {
  id: string;
  leadId: string;
  step: FollowupStep;
  dueAt: string;
  name: string;
  phone: string;
  role: string;
  lang: "en" | "hi";
  brainType: string;
  score: number | null;
  numbers: string[];
  campaign: string | null;
  text: string | null;
  wa: string | null;
};

type LeadRow = LeadContact & {
  first_name: string;
  role: string | null;
  lang: string;
  brain_type: string | null;
  unlock_score: number | null;
  utm_campaign: string | null;
  details: unknown;
};

/** Start of today and of tomorrow in India (IST, UTC+5:30), as ms. Pure (tested). */
export function istDayBounds(nowMs: number): { start: number; end: number } {
  const IST = 330 * 60_000;
  const day = 24 * 60 * 60_000;
  const start = Math.floor((nowMs + IST) / day) * day - IST;
  return { start, end: start + day };
}

/** Which view a due time falls in (a row can be in "due" and "today" at once). Pure (tested). */
export function inView(
  view: FollowupView,
  dueMs: number,
  nowMs: number,
): boolean {
  const { start, end } = istDayBounds(nowMs);
  if (view === "all") return true;
  if (view === "overdue") return dueMs < start;
  if (view === "today") return dueMs >= start && dueMs < end;
  return dueMs <= nowMs;
}

function contextFrom(
  lead: LeadRow,
  settings: BuSettings,
): FollowupContext | null {
  const d = lead.details;
  if (typeof d !== "object" || d === null) return null;
  const x = d as Partial<Pick<FollowupContext, "facts" | "role" | "links">>;
  if (x.facts === undefined || x.role === undefined || x.links === undefined)
    return null;
  return {
    facts: x.facts,
    role: x.role,
    links: x.links,
    settings,
    lang: lead.lang === "hi" ? "hi" : "en",
  };
}

/** Pending follow-ups (purchased / stopped leads are stopped here, never shown). */
export async function loadFollowups(nowMs: number = Date.now()): Promise<{
  items: FollowupItem[];
  campaigns: string[];
}> {
  const client = createServiceClient();
  const { data: rows, error } = await client
    .from("brain_unlock_followups")
    .select("id, lead_id, step, due_at")
    .eq("status", "pending")
    .order("due_at")
    .limit(1000);
  if (error || rows === null || rows.length === 0) {
    if (error) logger.warn("followups: read failed", { code: error.code });
    return { items: [], campaigns: [] };
  }
  const leadIds = [...new Set(rows.map((r) => r.lead_id))];
  const { data: leadData } = await client
    .from("speed_test_results")
    .select(
      "id, first_name, whatsapp_number, email, created_at, role, lang, brain_type, unlock_score, utm_campaign, details",
    )
    .in("id", leadIds);
  const leads = (leadData ?? []) as LeadRow[];
  const byId = new Map(leads.map((l) => [l.id, l]));

  const numbers = [...new Set(leads.map((l) => l.whatsapp_number))];
  const { data: optOuts } = await client
    .from("whatsapp_opt_outs")
    .select("whatsapp_number")
    .in("whatsapp_number", numbers);
  const optedOut = new Set((optOuts ?? []).map((o) => o.whatsapp_number));
  const earliest = leads.reduce(
    (m, l) => (l.created_at < m ? l.created_at : m),
    new Date(nowMs).toISOString(),
  );
  const bought = boughtLeadIds(leads, await paymentsSince(earliest));

  // Bought or stopped since: stop their queue now, so they never show again.
  const stopFor = async (ids: string[], reason: string): Promise<void> => {
    if (ids.length === 0) return;
    await client
      .from("brain_unlock_followups")
      .update({ status: "stopped", reason })
      .in("lead_id", ids)
      .eq("status", "pending");
  };
  await stopFor([...bought], "purchased");
  await stopFor(
    leads
      .filter((l) => !bought.has(l.id) && optedOut.has(l.whatsapp_number))
      .map((l) => l.id),
    "stop_requested",
  );

  const settings = await getBrainUnlockSettings();
  const items: FollowupItem[] = [];
  for (const r of rows) {
    const lead = byId.get(r.lead_id);
    if (
      lead === undefined ||
      !isFollowupStep(r.step) ||
      bought.has(lead.id) ||
      optedOut.has(lead.whatsapp_number)
    )
      continue;
    const ctx = contextFrom(lead, settings);
    const text = ctx === null ? null : followupText(r.step, ctx);
    const f = ctx?.facts;
    items.push({
      id: r.id,
      leadId: lead.id,
      step: r.step,
      dueAt: r.due_at,
      name: lead.first_name,
      phone: lead.whatsapp_number,
      role: lead.role ?? "",
      lang: lead.lang === "hi" ? "hi" : "en",
      brainType:
        lead.brain_type !== null && lead.brain_type in settings.brainTypes
          ? `${settings.brainTypes[lead.brain_type as keyof BuSettings["brainTypes"]].emoji} ${settings.brainTypes[lead.brain_type as keyof BuSettings["brainTypes"]].en.name}`
          : "",
      score: lead.unlock_score,
      numbers:
        f === undefined
          ? []
          : [
              `⚡ ${f.speed.before} → ${f.speed.counted ? f.speed.after : f.speed.before} WPM`,
              `🧠 ${f.memory.before}/5 → ${f.memory.forward}/5`,
              `🎯 ${f.focus.before}s → ${f.focus.after}s`,
            ],
      campaign: lead.utm_campaign,
      text,
      wa: text === null ? null : waLink(lead.whatsapp_number, text),
    });
  }
  const campaigns = [
    ...new Set(
      items
        .map((i) => i.campaign)
        .filter((c): c is string => c !== null && c !== ""),
    ),
  ].sort();
  return { items, campaigns };
}

/** For the admin menu badge: follow-ups due now. Never throws (0 on any error). */
export async function countDueFollowups(
  nowMs: number = Date.now(),
): Promise<number> {
  try {
    const { count, error } = await createServiceClient()
      .from("brain_unlock_followups")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .lte("due_at", new Date(nowMs).toISOString());
    return error ? 0 : (count ?? 0);
  } catch {
    return 0;
  }
}
