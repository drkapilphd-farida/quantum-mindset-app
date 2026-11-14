"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import { currentAdminEmail } from "@/features/live-classes/admin/data";
import { isFollowupStep, queueNextFollowup } from "../followups";
import { getBrainUnlockSettings } from "../settingsServer";

// /admin/followups buttons. Done = sent from WhatsApp → the next step gets its
// due time. Skip = not this one → the next step gets its due time. Stop = no
// more messages to this number (any lead with it). Admin only.

type Result = { ok: true; message: string } | { ok: false; error: string };

const Input = z.object({
  id: z.string().uuid(),
  action: z.enum(["done", "skip", "stop"]),
});

export async function markFollowup(input: unknown): Promise<Result> {
  if ((await currentAdminEmail()) === null)
    return { ok: false, error: "Not authorized." };
  const parsed = Input.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };
  const { id, action } = parsed.data;
  const client = createServiceClient();
  const now = Date.now();

  const { data: row } = await client
    .from("brain_unlock_followups")
    .select("id, lead_id, step, status")
    .eq("id", id)
    .maybeSingle();
  if (row === null || row.status !== "pending" || !isFollowupStep(row.step))
    return { ok: false, error: "Already handled — refresh the page." };

  if (action === "stop") {
    const { data: lead } = await client
      .from("speed_test_results")
      .select("whatsapp_number")
      .eq("id", row.lead_id)
      .maybeSingle();
    if (lead === null) return { ok: false, error: "Lead not found." };
    const { error } = await client
      .from("whatsapp_opt_outs")
      .upsert({ whatsapp_number: lead.whatsapp_number });
    if (error) return { ok: false, error: "Could not save. Please try again." };
    const { data: same } = await client
      .from("speed_test_results")
      .select("id")
      .eq("whatsapp_number", lead.whatsapp_number);
    await client
      .from("brain_unlock_followups")
      .update({ status: "stopped", reason: "stopped_by_admin" })
      .in(
        "lead_id",
        (same ?? []).map((l) => l.id),
      )
      .eq("status", "pending");
    refresh();
    return {
      ok: true,
      message: "Stopped — no more follow-ups to this number.",
    };
  }

  // Only the first tap counts (two tabs, double taps): the update must still find it pending.
  const { data: updated, error } = await client
    .from("brain_unlock_followups")
    .update(
      action === "done"
        ? {
            status: "sent",
            sent_at: new Date(now).toISOString(),
            reason: "sent_by_hand",
          }
        : { status: "skipped", reason: "skipped_by_admin" },
    )
    .eq("id", id)
    .eq("status", "pending")
    .select("id");
  if (error) {
    logger.warn("markFollowup failed", { code: error.code });
    return { ok: false, error: "Could not save. Please try again." };
  }
  if ((updated ?? []).length === 0)
    return { ok: false, error: "Already handled — refresh the page." };
  const next = await queueNextFollowup(
    row.lead_id,
    row.step,
    now,
    await getBrainUnlockSettings(),
  );
  refresh();
  return {
    ok: true,
    message:
      next === null
        ? "Done — that was the last follow-up."
        : "Done — the next follow-up is scheduled.",
  };
}

function refresh(): void {
  revalidatePath("/admin/followups");
  revalidatePath("/admin", "layout"); // the menu badge
}
