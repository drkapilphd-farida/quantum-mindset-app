// Server only (service role), admin pages only — callers check the admin first.
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import { last10 } from "../followups";
import type { EventRow } from "../funnel";

const PAGE = 1000;
const MAX_ROWS = 50_000;

/** Every funnel event in [fromIso, toIso), paged (PostgREST returns at most 1,000 rows per request). */
export async function readEvents(
  fromIso: string,
  toIso: string,
): Promise<{ rows: EventRow[]; truncated: boolean }> {
  const client = createServiceClient();
  const rows: EventRow[] = [];
  for (let offset = 0; offset < MAX_ROWS; offset += PAGE) {
    const { data, error } = await client
      .from("brain_unlock_events")
      .select("session_id, event, role, duo, data, utm_campaign, created_at")
      .gte("created_at", fromIso)
      .lt("created_at", toIso)
      .order("id")
      .range(offset, offset + PAGE - 1);
    if (error) {
      logger.error("brain-unlock admin: events read failed", {
        code: error.code,
      });
      break;
    }
    rows.push(...((data ?? []) as EventRow[]));
    if ((data ?? []).length < PAGE) return { rows, truncated: false };
  }
  return { rows, truncated: rows.length >= MAX_ROWS };
}

/** Sessions whose Brain Unlock lead later paid for Sharp Brain (matched by phone or email, after the lead). */
export async function paidSessions(
  fromIso: string,
  toIso: string,
): Promise<Set<string>> {
  const client = createServiceClient();
  const { data: leads } = await client
    .from("speed_test_results")
    .select("session_id, whatsapp_number, email, created_at")
    .eq("test_kind", "brain_unlock")
    .gte("created_at", fromIso)
    .lt("created_at", toIso)
    .limit(5000);
  const list = (leads ?? []).filter(
    (l): l is typeof l & { session_id: string } => l.session_id !== null,
  );
  if (list.length === 0) return new Set();
  const { data: payments } = await client
    .from("masterclass_payments")
    .select("phone, email, created_at")
    .gte("created_at", fromIso)
    .limit(5000);
  const paid = new Set<string>();
  for (const lead of list) {
    const digits = last10(lead.whatsapp_number);
    const email = lead.email?.toLowerCase() ?? null;
    const hit = (payments ?? []).some(
      (p) =>
        p.created_at >= lead.created_at &&
        ((p.phone !== null && last10(p.phone) === digits) ||
          (email !== null && p.email?.toLowerCase() === email)),
    );
    if (hit) paid.add(lead.session_id);
  }
  return paid;
}
