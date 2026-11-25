// Server only (service role). Imported by server actions.
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";

/** The "Ref: BU-…" of a saved lead, so the bot can match a chat to this session's card. */
export async function linkBrainTestRef(sessionId: string, ref: string): Promise<void> {
  try {
    await createServiceClient()
      .from("bt_progress")
      .upsert({ session_id: sessionId, ref }, { onConflict: "session_id", ignoreDuplicates: false });
  } catch (e) {
    logger.warn("linkBrainTestRef failed", {
      error: e instanceof Error ? e.message : "unknown",
    });
  }
}
