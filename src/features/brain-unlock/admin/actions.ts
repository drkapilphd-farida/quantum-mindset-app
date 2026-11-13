"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import { normalizeIndianMobile } from "@/lib/phone/indianMobile";
import { currentAdminEmail } from "@/features/live-classes/admin/data";
import { SettingsSchema } from "../settings";

// /admin/brain-unlock-settings: save the settings row (validated), and stop
// WhatsApp follow-ups for a number (STOP received another way). Admin only.

type Result = { ok: true; message: string } | { ok: false; error: string };

export async function saveBrainUnlockSettings(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail();
  if (admin === null) return { ok: false, error: "Not authorized." };
  const parsed = SettingsSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: `Please check “${first?.path.join(" → ") ?? "a field"}”: ${first?.message ?? "invalid value"}`,
    };
  }
  const { error } = await createServiceClient()
    .from("brain_unlock_settings")
    .upsert({
      id: 1,
      settings: parsed.data,
      updated_at: new Date().toISOString(),
      updated_by: admin,
    });
  if (error) {
    logger.error("saveBrainUnlockSettings failed", { code: error.code });
    return { ok: false, error: "Could not save. Please try again." };
  }
  revalidatePath("/reading-memory-test");
  revalidatePath("/admin/brain-unlock-settings");
  return { ok: true, message: "Saved. The page uses the new settings now." };
}

export async function stopFollowupsForNumber(input: unknown): Promise<Result> {
  if ((await currentAdminEmail()) === null)
    return { ok: false, error: "Not authorized." };
  const parsed = z
    .object({ phone: z.string().trim().min(10).max(20) })
    .safeParse(input);
  const indian = parsed.success
    ? normalizeIndianMobile(parsed.data.phone)
    : null;
  if (indian === null)
    return { ok: false, error: "Enter a valid Indian mobile number." };
  const number = indian.slice(1);
  const client = createServiceClient();
  const { error } = await client
    .from("whatsapp_opt_outs")
    .upsert({ whatsapp_number: number });
  if (error) return { ok: false, error: "Could not save. Please try again." };
  const { data: leads } = await client
    .from("speed_test_results")
    .select("id")
    .eq("whatsapp_number", number);
  const ids = (leads ?? []).map((l) => l.id);
  if (ids.length > 0)
    await client
      .from("brain_unlock_followups")
      .update({ status: "stopped", reason: "stop_requested" })
      .in("lead_id", ids)
      .eq("status", "pending");
  return { ok: true, message: "Done — no more follow-ups to this number." };
}
