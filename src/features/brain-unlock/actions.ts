"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { createServiceClient } from "@/lib/supabase/service";
import type { Json } from "@/lib/supabase/types";
import { logger } from "@/lib/logger";
import { normalizeIndianMobile } from "@/lib/phone/indianMobile";
import {
  sendBrainUnlockFounderEmail,
  sendBrainUnlockReportEmail,
} from "@/lib/email/sendBrainUnlockEmails";
import { evaluateRun, InvalidRunError, type EvaluatedRun } from "./evaluate";
import { queueFollowups } from "./followups";
import { factsFrom, type ReportFacts } from "./messages";
import { countCorrect, passageById } from "./passages";
import { getBrainUnlockSettings } from "./settingsServer";
import {
  CLASS_BANDS,
  FUNNEL_EVENTS,
  RawRunSchema,
  ROLES,
  SessionIdSchema,
  UtmSchema,
  type Utm,
} from "./types";

// Brain Unlock server actions. The browser sends raw inputs only; every
// number that is saved or sent is recomputed here from the server's own
// answer key and word lists (./evaluate.ts).

const GENERIC_ERROR = "Something went wrong. Please try again.";

// ── Grading the two reading passages (for the ⚡ reveal card) ────────────────
const GradeSchema = z.object({
  checkPassageId: z.string().max(40),
  checkAnswers: z.array(z.number().int().min(-1).max(5)).max(4),
  sharpPassageId: z.string().max(40),
  sharpAnswers: z.array(z.number().int().min(-1).max(5)).max(4),
});

export type SpeedGrade = {
  checkCorrect: number;
  checkTotal: number;
  sharpCorrect: number;
  sharpTotal: number;
};

export async function gradeReading(
  input: unknown,
): Promise<{ ok: true; grade: SpeedGrade } | { ok: false; error: string }> {
  const parsed = GradeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: GENERIC_ERROR };
  const ip = await getClientIp();
  if (
    !checkRateLimit(`brain-unlock-grade:${ip}`, { max: 60, windowMs: 60_000 })
      .allowed
  )
    return { ok: false, error: "Too many attempts. Please wait a minute." };
  const check = passageById(parsed.data.checkPassageId);
  const sharp = passageById(parsed.data.sharpPassageId);
  if (check === null || sharp === null)
    return { ok: false, error: GENERIC_ERROR };
  return {
    ok: true,
    grade: {
      checkCorrect: countCorrect(check, parsed.data.checkAnswers),
      checkTotal: check.questions.length,
      sharpCorrect: countCorrect(sharp, parsed.data.sharpAnswers),
      sharpTotal: sharp.questions.length,
    },
  };
}

// ── Funnel events ────────────────────────────────────────────────────────────
const EventSchema = z.object({
  sessionId: SessionIdSchema,
  event: z.enum(FUNNEL_EVENTS).exclude(["payment_success"]),
  role: z.enum(ROLES).nullable().optional(),
  lang: z.enum(["en", "hi"]).optional(),
  duo: z.boolean().optional(),
  data: z
    .record(
      z.string().max(30),
      z.union([z.number(), z.string().max(60), z.boolean()]),
    )
    .optional(),
  utm: UtmSchema.optional(),
});

/** Fire-and-forget from the browser. Never throws, never stores personal details. */
export async function logBrainUnlockEvent(input: unknown): Promise<void> {
  const parsed = EventSchema.safeParse(input);
  if (!parsed.success) return;
  try {
    const ip = await getClientIp();
    if (
      !checkRateLimit(`brain-unlock-event:${ip}`, {
        max: 120,
        windowMs: 60_000,
      }).allowed
    )
      return;
    const { sessionId, event, role, lang, duo, data, utm } = parsed.data;
    const { error } = await createServiceClient()
      .from("brain_unlock_events")
      .insert({
        session_id: sessionId,
        event,
        role: role ?? null,
        lang: lang ?? null,
        duo: duo ?? false,
        data: data ?? {},
        utm_source: utm?.utm_source ?? null,
        utm_medium: utm?.utm_medium ?? null,
        utm_campaign: utm?.utm_campaign ?? null,
      });
    if (error)
      logger.warn("brain-unlock: event not saved", { code: error.code, event });
  } catch {
    // tracking must never break the funnel
  }
}

// ── The lead ─────────────────────────────────────────────────────────────────
const LeadSchema = z.object({
  sessionId: SessionIdSchema,
  firstName: z.string().trim().min(1).max(60),
  phone: z.string().trim().min(10).max(20),
  email: z
    .union([z.literal(""), z.string().trim().toLowerCase().email().max(254)])
    .optional(),
  lang: z.enum(["en", "hi"]),
  role: z.enum(ROLES),
  classBand: z.enum(CLASS_BANDS).nullable(),
  childClassBand: z.enum(CLASS_BANDS).nullable().optional(),
  duo: z.boolean(),
  runs: z.array(RawRunSchema).min(1).max(2),
  utm: UtmSchema.optional(),
  /** Absolute page URL, for the report links in WhatsApp and email (same site only). */
  pageUrl: z.string().url().max(2000),
});

export type SavedLead =
  | { ok: true; reports: EvaluatedRun[]; facts: ReportFacts }
  | { ok: false; error: string };

/** Stores the phone as digits with country code ("91…"), the leads table's format. */
function phoneDigits(raw: string): string | null {
  const indian = normalizeIndianMobile(raw);
  if (indian !== null) return indian.slice(1);
  const digits = raw.replace(/\D/g, "");
  return /^[0-9]{10,15}$/.test(digits) &&
    !raw.trim().startsWith("0") &&
    raw.trim().startsWith("+")
    ? digits
    : null;
}

function withUtm(
  url: URL,
  utm: Utm,
  overrides: Record<string, string> = {},
): string {
  const u = new URL(url.toString());
  u.search = "";
  u.hash = "";
  for (const [k, v] of Object.entries(utm))
    if (typeof v === "string" && v !== "") u.searchParams.set(k, v);
  for (const [k, v] of Object.entries(overrides)) u.searchParams.set(k, v);
  return u.toString();
}

export async function saveBrainUnlockLead(input: unknown): Promise<SavedLead> {
  const parsed = LeadSchema.safeParse(input);
  if (!parsed.success) {
    const phoneIssue = parsed.error.issues.some((i) => i.path[0] === "phone");
    const emailIssue = parsed.error.issues.some((i) => i.path[0] === "email");
    const nameIssue = parsed.error.issues.some(
      (i) => i.path[0] === "firstName",
    );
    return {
      ok: false,
      error: phoneIssue
        ? "Enter a valid WhatsApp number."
        : emailIssue
          ? "Enter a valid email, or leave it empty."
          : nameIssue
            ? "Please enter your name."
            : GENERIC_ERROR,
    };
  }
  const ip = await getClientIp();
  if (
    !checkRateLimit(`brain-unlock-lead:${ip}`, { max: 5, windowMs: 60_000 })
      .allowed
  )
    return {
      ok: false,
      error: "Too many attempts. Please wait a minute and try again.",
    };
  const d = parsed.data;
  const phone = phoneDigits(d.phone);
  if (phone === null)
    return { ok: false, error: "Enter a valid WhatsApp number." };

  // Report links point at this site only.
  const host = (await headers()).get("host") ?? "";
  const page = new URL(d.pageUrl);
  if (host !== "" && page.host !== host)
    return { ok: false, error: GENERIC_ERROR };

  try {
    const settings = await getBrainUnlockSettings();
    const reports = d.runs.map((run) => evaluateRun(run, settings.scoring));
    const main = reports[0]!;
    const child = d.duo ? reports[1] : undefined;
    const childLabel = d.lang === "hi" ? "बच्चा" : "Child";
    const facts: ReportFacts = {
      ...factsFrom(d.firstName, main),
      ...(child !== undefined
        ? { child: { ...factsFrom(d.firstName, child), label: childLabel } }
        : {}),
    };
    const utm = d.utm ?? {};
    const report = new URL("/reading-memory-test", page);
    const links = {
      report: withUtm(report, utm, { view: "offer" }),
      selfPaced: withUtm(report, utm, { view: "offer", plan: "self" }),
      live: withUtm(report, utm, { view: "offer", plan: "live" }),
      retake: withUtm(report, {
        utm_source: "whatsapp",
        utm_medium: "followup",
        utm_campaign: "bu_retake_d30",
      }),
    };
    const sharp = passageById(d.runs[0]!.sharpPassageId);
    const comprehension = Math.round(
      (main.speedAfter.correct / Math.max(main.speedAfter.total, 1)) * 100,
    );
    const row = {
      whatsapp_number: phone,
      first_name: d.firstName,
      email: d.email === undefined || d.email === "" ? null : d.email,
      passage_id: sharp?.id ?? d.runs[0]!.sharpPassageId,
      lang: d.lang,
      wpm: main.speedAfterWpm,
      comprehension_percent: comprehension,
      effective_wpm: Math.round((main.speedAfterWpm * comprehension) / 100),
      status: "valid",
      test_kind: "brain_unlock",
      memory_correct: main.memoryForward,
      role: d.role,
      class_band: d.role === "professional" ? null : d.classBand,
      brain_type: main.brainType,
      unlock_score: main.score.total,
      duo: d.duo,
      session_id: d.sessionId,
      details: JSON.parse(
        JSON.stringify({
          facts,
          role: d.role,
          links,
          childClassBand: d.childClassBand ?? null,
          runs: reports,
        }),
      ) as Json,
      utm_source: utm.utm_source ?? null,
      utm_medium: utm.utm_medium ?? null,
      utm_campaign: utm.utm_campaign ?? null,
      utm_term: utm.utm_term ?? null,
      utm_content: utm.utm_content ?? null,
    };
    const client = createServiceClient();
    const { data: saved, error } = await client
      .from("speed_test_results")
      .insert(row)
      .select("id, created_at")
      .single();
    if (error || saved === null) {
      logger.error("saveBrainUnlockLead: insert failed", { code: error?.code });
      return { ok: false, error: GENERIC_ERROR };
    }
    await queueFollowups(saved.id, Date.parse(saved.created_at), settings);
    const email = row.email;
    // After the response: founder email and the visitor's report email. WhatsApp
    // follow-ups are sent by hand from /admin/followups (first step queued above).
    after(async () => {
      await Promise.all([
        sendBrainUnlockFounderEmail({
          firstName: d.firstName,
          whatsappNumber: phone,
          email,
          lang: d.lang,
          role: d.role,
          classBand: row.class_band,
          facts,
          settings,
          utmSource: row.utm_source,
          utmCampaign: row.utm_campaign,
        }),
        email === null
          ? Promise.resolve()
          : sendBrainUnlockReportEmail({
              to: email,
              lang: d.lang,
              facts,
              settings,
              links,
              role: d.role,
            }),
      ]);
    });
    return { ok: true, reports, facts };
  } catch (e) {
    if (!(e instanceof InvalidRunError))
      logger.error("saveBrainUnlockLead failed", {
        error: e instanceof Error ? e.message : "unknown",
      });
    return { ok: false, error: GENERIC_ERROR };
  }
}
