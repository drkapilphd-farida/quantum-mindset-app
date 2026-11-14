// Server only (service role). A person's earlier Brain Unlock sets: leads from
// the same device, then every lead with the same phone or email (so a new
// phone or browser still gets new sets), plus the retake's own lead. Never
// throws: on any error the browser's memory alone decides.
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import {
  EMPTY_HISTORY,
  historyOf,
  setsFromDetails,
  type SetHistory,
} from "./sets";

type Row = {
  id: string;
  whatsapp_number: string;
  email: string | null;
  details: unknown;
};

export async function setHistoryFor(input: {
  deviceId: string;
  retakeOf: string | null;
}): Promise<{ history: SetHistory; last: SetHistory }> {
  try {
    const db = createServiceClient();
    const cols = "id, whatsapp_number, email, details";
    const { data: byDevice } = await db
      .from("speed_test_results")
      .select(cols)
      .eq("test_kind", "brain_unlock")
      .eq("details->>deviceId", input.deviceId)
      .limit(50);
    const rows = new Map<string, Row>(
      ((byDevice ?? []) as Row[]).map((r) => [r.id, r]),
    );
    let lastRow: Row | null = null;
    if (input.retakeOf !== null) {
      const { data } = await db
        .from("speed_test_results")
        .select(cols)
        .eq("id", input.retakeOf)
        .eq("test_kind", "brain_unlock")
        .maybeSingle();
      if (data !== null) {
        lastRow = data as Row;
        rows.set(lastRow.id, lastRow);
      }
    }
    const phones = [
      ...new Set([...rows.values()].map((r) => r.whatsapp_number)),
    ];
    const emails = [
      ...new Set(
        [...rows.values()]
          .map((r) => r.email)
          .filter((e): e is string => e !== null && e !== ""),
      ),
    ];
    if (phones.length > 0) {
      const { data } = await db
        .from("speed_test_results")
        .select(cols)
        .eq("test_kind", "brain_unlock")
        .in("whatsapp_number", phones)
        .limit(200);
      for (const r of (data ?? []) as Row[]) rows.set(r.id, r);
    }
    if (emails.length > 0) {
      const { data } = await db
        .from("speed_test_results")
        .select(cols)
        .eq("test_kind", "brain_unlock")
        .in("email", emails)
        .limit(200);
      for (const r of (data ?? []) as Row[]) rows.set(r.id, r);
    }
    const all = [...rows.values()].flatMap((r) => setsFromDetails(r.details));
    return {
      history: historyOf(all),
      last:
        lastRow === null
          ? EMPTY_HISTORY
          : historyOf(setsFromDetails(lastRow.details)),
    };
  } catch (e) {
    logger.warn("brain-unlock: set history not read", {
      error: e instanceof Error ? e.message : "unknown",
    });
    return { history: EMPTY_HISTORY, last: EMPTY_HISTORY };
  }
}
