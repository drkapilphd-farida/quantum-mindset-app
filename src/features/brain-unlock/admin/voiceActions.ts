"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import { currentAdminEmail } from "@/features/live-classes/admin/data";
import { getBrainUnlockSettings } from "../settingsServer";
import { VOICE_LINES } from "../voiceLines";
import { cloneVoiceMp3, isSarvamConfigured } from "../voiceClone";

// /admin/brain-unlock-settings → "Voice lines": per line, replace with
// Dr. Kapil's own recording (MP3 straight to the public guided-audio bucket via
// a signed upload URL), regenerate in his cloned voice, or go back to the
// bundled file. Each change saves at once (settings.voiceLines). Admin only.

type Result =
  | { ok: true; message: string; url: string | null }
  | { ok: false; error: string };

const BUCKET = "guided-audio";
const LineInput = z
  .object({
    lang: z.enum(["en", "hi"]),
    id: z.string().regex(/^[a-z0-9-]{1,40}$/i),
  })
  .refine(
    (v) => VOICE_LINES[v.lang].some((l) => l.id === v.id),
    "Unknown line",
  );

async function setOverride(
  lang: "en" | "hi",
  id: string,
  url: string | null,
  admin: string,
): Promise<boolean> {
  const current = await getBrainUnlockSettings();
  const lines = { ...current.voiceLines[lang] };
  if (url === null) delete lines[id];
  else lines[id] = url;
  const settings = {
    ...current,
    voiceLines: { ...current.voiceLines, [lang]: lines },
  };
  const { error } = await createServiceClient()
    .from("brain_unlock_settings")
    .upsert({
      id: 1,
      settings,
      updated_at: new Date().toISOString(),
      updated_by: admin,
    });
  if (error) {
    logger.error("brain-unlock voice: save failed", { code: error.code });
    return false;
  }
  revalidatePath("/reading-memory-test");
  revalidatePath("/admin/brain-unlock-settings");
  return true;
}

const publicUrl = (path: string): string =>
  createServiceClient().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

/** Step 1 of an upload: a one-time signed URL for this line's new MP3. */
export async function voiceUploadTarget(
  input: unknown,
): Promise<
  { ok: true; path: string; token: string } | { ok: false; error: string }
> {
  if ((await currentAdminEmail()) === null)
    return { ok: false, error: "Not authorized." };
  const parsed = LineInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Unknown line." };
  const path = `brain-unlock/${parsed.data.lang}/${parsed.data.id}-${Date.now()}.mp3`;
  const { data, error } = await createServiceClient()
    .storage.from(BUCKET)
    .createSignedUploadUrl(path);
  if (error || data === null)
    return {
      ok: false,
      error: "Could not start the upload. Please try again.",
    };
  return { ok: true, path: data.path, token: data.token };
}

/** Step 2 of an upload: the file is in storage → make it this line's audio. */
export async function applyUploadedVoice(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail();
  if (admin === null) return { ok: false, error: "Not authorized." };
  const parsed = LineInput.and(
    z.object({
      path: z.string().regex(/^brain-unlock\/(en|hi)\/[a-z0-9-]+-\d+\.mp3$/i),
    }),
  ).safeParse(input);
  if (
    !parsed.success ||
    !parsed.data.path.startsWith(
      `brain-unlock/${parsed.data.lang}/${parsed.data.id}-`,
    )
  )
    return { ok: false, error: "Upload not recognised." };
  const url = publicUrl(parsed.data.path);
  return (await setOverride(parsed.data.lang, parsed.data.id, url, admin))
    ? { ok: true, message: "Your recording is live for this line.", url }
    : { ok: false, error: "Could not save. Please try again." };
}

/** Voice the line again in Dr. Kapil's cloned voice (Sarvam) and make it live. */
export async function regenerateVoiceLine(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail();
  if (admin === null) return { ok: false, error: "Not authorized." };
  const parsed = LineInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Unknown line." };
  if (!isSarvamConfigured())
    return {
      ok: false,
      error:
        "Regenerate needs the Sarvam API key on the live site (SARVAM_API_KEY in Vercel). Uploading your own recording works now.",
    };
  const { lang, id } = parsed.data;
  const text = VOICE_LINES[lang].find((l) => l.id === id)!.text;
  const mp3 = await cloneVoiceMp3(lang, id, text);
  if (mp3 === null)
    return {
      ok: false,
      error: "Sarvam could not voice this line just now. Please try again.",
    };
  const path = `brain-unlock/${lang}/${id}-${Date.now()}.mp3`;
  const { error } = await createServiceClient()
    .storage.from(BUCKET)
    .upload(path, mp3, { contentType: "audio/mpeg", upsert: false });
  if (error)
    return {
      ok: false,
      error: "Could not store the new audio. Please try again.",
    };
  const url = publicUrl(path);
  return (await setOverride(lang, id, url, admin))
    ? {
        ok: true,
        message:
          "New take is live. Press ▶ to listen; regenerate again if you don't like it.",
        url,
      }
    : { ok: false, error: "Could not save. Please try again." };
}

/** Back to the bundled cloned-voice file. */
export async function resetVoiceLine(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail();
  if (admin === null) return { ok: false, error: "Not authorized." };
  const parsed = LineInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Unknown line." };
  return (await setOverride(parsed.data.lang, parsed.data.id, null, admin))
    ? {
        ok: true,
        message: "Back to the standard file for this line.",
        url: null,
      }
    : { ok: false, error: "Could not save. Please try again." };
}
