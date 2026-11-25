"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { createServiceClient } from "@/lib/supabase/service";
import type { Json } from "@/lib/supabase/types";
import { logger } from "@/lib/logger";
import { evaluateRun, InvalidRunError } from "./evaluate";
import { BT_TOKEN_RE, progressFacts, TOTAL_PHASES } from "./progress";
import { getBrainUnlockSettings } from "./settingsServer";
import { RawRunSchema, SessionIdSchema } from "./types";

// Brain Test v2 → WhatsApp (founder, 25 Nov 2026). The page saves its progress
// after every step; the database sends the card on WhatsApp (edge function
// `brain-test-send`) when the test is finished, or 10 minutes after the person
// stopped half-way. Only contacts who opened the test from the bot (?c=token)
// get it automatically; others are matched when their "Ref: BU-…" arrives.

const CARD_BUCKET = "wa-media";
const TokenSchema = z.string().regex(BT_TOKEN_RE);

/** First name for "Namaste Rahul ji" on the welcome screen, from the bot link token. */
export async function brainTestHello(
  input: unknown,
): Promise<{ ok: true; firstName: string | null } | { ok: false }> {
  const token = TokenSchema.safeParse(input);
  if (!token.success) return { ok: false };
  const ip = await getClientIp();
  if (!checkRateLimit(`bt-hello:${ip}`, { max: 20, windowMs: 60_000 }).allowed)
    return { ok: false };
  try {
    const { data } = await createServiceClient()
      .from("wa_contacts")
      .select("name")
      .eq("bt_token", token.data)
      .maybeSingle();
    if (data === null) return { ok: false };
    return { ok: true, firstName: firstNameOf(data.name ?? "") };
  } catch (e) {
    logger.error("brainTestHello failed", {
      error: e instanceof Error ? e.message : "unknown",
    });
    return { ok: false };
  }
}

const TITLES = new Set(["dr", "dr.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "er", "er.", "prof", "prof.", "shri", "smt", "ca", "adv"]);
function firstNameOf(full: string): string | null {
  const w = full
    .replace(/[^\p{L}\p{M}\s.]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const n = w.find((x) => !TITLES.has(x.toLowerCase()));
  return n === undefined ? null : n.slice(0, 30);
}

const CARD_RE = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/;
const ProgressSchema = z.object({
  sessionId: SessionIdSchema,
  token: TokenSchema.nullable(),
  lang: z.enum(["en", "hi"]),
  phasesDone: z.number().int().min(1).max(TOTAL_PHASES),
  run: RawRunSchema,
  /** The result card drawn in the browser (JPEG data URL, ≤ ~450 KB). */
  card: z.string().max(600_000).regex(CARD_RE).nullable(),
});

export type ProgressSaved = { ok: true; linked: boolean } | { ok: false };

export async function saveBrainTestProgress(input: unknown): Promise<ProgressSaved> {
  const parsed = ProgressSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const d = parsed.data;
  const ip = await getClientIp();
  if (!checkRateLimit(`bt-progress:${ip}`, { max: 30, windowMs: 60_000 }).allowed)
    return { ok: false };
  try {
    const settings = await getBrainUnlockSettings();
    const facts = progressFacts(evaluateRun(d.run, settings.scoring), d.phasesDone);
    const client = createServiceClient();

    let contactId: string | null = null;
    if (d.token !== null) {
      const { data } = await client
        .from("wa_contacts")
        .select("id")
        .eq("bt_token", d.token)
        .maybeSingle();
      contactId = data?.id ?? null;
    }

    let cardUrl: string | null = null;
    if (d.card !== null) {
      const bytes = Buffer.from(d.card.slice(d.card.indexOf(",") + 1), "base64");
      const path = `bt-cards/${d.sessionId}-${d.phasesDone}-${randomUUID().slice(0, 8)}.jpg`;
      const up = await client.storage
        .from(CARD_BUCKET)
        .upload(path, bytes, { contentType: "image/jpeg", upsert: true });
      if (up.error === null)
        cardUrl = client.storage.from(CARD_BUCKET).getPublicUrl(path).data.publicUrl;
      else logger.warn("saveBrainTestProgress: card upload failed");
    }

    // Never go backwards (a late call from an earlier step).
    const { data: prev } = await client
      .from("bt_progress")
      .select("phases_done, contact_id")
      .eq("session_id", d.sessionId)
      .maybeSingle();
    if (prev !== null && prev.phases_done > d.phasesDone)
      return { ok: true, linked: prev.contact_id !== null };

    const { error } = await client.from("bt_progress").upsert(
      {
        session_id: d.sessionId,
        token: d.token,
        contact_id: contactId ?? prev?.contact_id ?? null,
        lang: d.lang,
        role: d.run.role,
        phases_done: d.phasesDone,
        facts: facts as Json,
        ...(cardUrl !== null ? { card_url: cardUrl } : {}),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id" },
    );
    if (error !== null) {
      logger.error("saveBrainTestProgress: upsert failed", { code: error.code });
      return { ok: false };
    }
    return { ok: true, linked: (contactId ?? prev?.contact_id ?? null) !== null };
  } catch (e) {
    if (!(e instanceof InvalidRunError))
      logger.error("saveBrainTestProgress failed", {
        error: e instanceof Error ? e.message : "unknown",
      });
    return { ok: false };
  }
}
