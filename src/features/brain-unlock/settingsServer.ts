// Server only (service role). Imported by server components and server actions.
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import { resolveSettings, type BuSettings } from "./settings";

/** The saved admin settings over the defaults. Never throws: the funnel must load even if the table is missing. */
export async function getBrainUnlockSettings(): Promise<BuSettings> {
  try {
    const { data, error } = await createServiceClient()
      .from("brain_unlock_settings")
      .select("settings")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      logger.warn("getBrainUnlockSettings: read failed, using defaults", {
        code: error.code,
      });
      return resolveSettings(null);
    }
    return resolveSettings(data?.settings ?? null);
  } catch {
    return resolveSettings(null);
  }
}
