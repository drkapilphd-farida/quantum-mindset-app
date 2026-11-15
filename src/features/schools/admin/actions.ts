"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import { currentAdminEmail } from "@/features/live-classes/admin/data";
import { SCHOOL_LEAD_STATUSES } from "../leadStatus";
import { SchoolSettingsSchema } from "../settings";

// /admin/school-leads (status, notes) and /admin/school-page (settings,
// uploads). Server Actions can be called directly, so each one re-checks
// ADMIN_EMAILS itself.

type Result = { ok: true; message: string } | { ok: false; error: string };

const BUCKET = "school-media";

const LeadUpdate = z.object({
  id: z.string().uuid(),
  status: z.enum(SCHOOL_LEAD_STATUSES).optional(),
  notes: z.string().max(4000).optional(),
});

export async function updateSchoolLead(input: unknown): Promise<Result> {
  if ((await currentAdminEmail()) === null) return { ok: false, error: "Not authorized." };
  const parsed = LeadUpdate.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };
  const { id, status, notes } = parsed.data;
  const patch: { status?: string; notes?: string | null } = {};
  if (status !== undefined) patch.status = status;
  if (notes !== undefined) patch.notes = notes.trim() === "" ? null : notes.trim();
  if (Object.keys(patch).length === 0) return { ok: false, error: "Nothing to save." };
  const { error } = await createServiceClient().from("school_leads").update(patch).eq("id", id);
  if (error) {
    logger.warn("[school-leads] update failed", { code: error.code });
    return { ok: false, error: "Could not save. Please try again." };
  }
  revalidatePath("/admin/school-leads");
  return { ok: true, message: "Saved." };
}

export async function saveSchoolSettings(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail();
  if (admin === null) return { ok: false, error: "Not authorized." };
  const parsed = SchoolSettingsSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: `Please check “${first?.path.join(" → ") ?? "a field"}”: ${first?.message ?? "invalid value"}`,
    };
  }
  const { error } = await createServiceClient()
    .from("school_page_settings")
    .upsert({ id: 1, settings: parsed.data, updated_at: new Date().toISOString(), updated_by: admin });
  if (error) {
    logger.error("[school-page] save failed", { code: error.code });
    return { ok: false, error: "Could not save. Please try again." };
  }
  revalidatePath("/schools");
  revalidatePath("/admin/school-page");
  return { ok: true, message: "Saved. The Schools page shows the new settings now." };
}

const UPLOAD_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
} as const;

const UploadInput = z.object({
  slot: z.enum(["hero", "poster", "sample"]),
  contentType: z.enum(Object.keys(UPLOAD_TYPES) as [keyof typeof UPLOAD_TYPES, ...(keyof typeof UPLOAD_TYPES)[]]),
  size: z.number().int().min(1).max(15 * 1024 * 1024),
});

/** Step 1 of an upload: a one-time signed URL; the file then goes straight to the bucket. */
export async function schoolMediaUploadTarget(
  input: unknown,
): Promise<{ ok: true; path: string; token: string; publicUrl: string } | { ok: false; error: string }> {
  if ((await currentAdminEmail()) === null) return { ok: false, error: "Not authorized." };
  const parsed = UploadInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Use a JPG, PNG or WebP image, or an MP4 video, up to 15 MB." };
  const { slot, contentType } = parsed.data;
  if (slot !== "hero" && contentType === "video/mp4") return { ok: false, error: "Use an image here." };
  const path = `schools/${slot}-${Date.now()}.${UPLOAD_TYPES[contentType]}`;
  const storage = createServiceClient().storage.from(BUCKET);
  const { data, error } = await storage.createSignedUploadUrl(path);
  if (error || data === null) {
    logger.warn("[school-page] upload URL failed", { error: error?.message ?? "no data" });
    return { ok: false, error: "Could not start the upload. Please try again." };
  }
  return { ok: true, path, token: data.token, publicUrl: storage.getPublicUrl(path).data.publicUrl };
}
