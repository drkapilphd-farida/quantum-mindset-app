// Server only (service role). Imported by the /schools page and admin.
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import { DEFAULT_SCHOOL_SETTINGS, resolveSchoolSettings, type SchoolSettings } from "./settings";

/** The saved admin settings over the defaults. Never throws: the page must load even if the table is missing. */
export async function getSchoolSettings(): Promise<SchoolSettings> {
  try {
    const { data, error } = await createServiceClient()
      .from("school_page_settings")
      .select("settings")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      logger.warn("getSchoolSettings: read failed, using defaults", { code: error.code });
      return DEFAULT_SCHOOL_SETTINGS;
    }
    return resolveSchoolSettings(data?.settings ?? null);
  } catch {
    return DEFAULT_SCHOOL_SETTINGS;
  }
}
