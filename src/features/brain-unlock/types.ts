import { z } from "zod";
import type { BuRole } from "./passages";
import type { WordSet } from "./words";

// Shapes shared by the browser and the server actions. The browser sends RAW
// inputs only (times, taps, answers); the server recomputes every number.

export const ROLES = [
  "parent",
  "student",
  "professional",
] as const satisfies readonly BuRole[];
export const CLASS_BANDS = ["5-8", "9-10", "11-12", "college"] as const;
export type ClassBand = (typeof CLASS_BANDS)[number];
export type BuLangCode = "en" | "hi";

const Id = z.string().trim().min(1).max(40);
const Ms = z
  .number()
  .int()
  .min(0)
  .max(30 * 60_000);
const Answers = z.array(z.number().int().min(-1).max(5)).max(4);
const Focus = z.object({ ms: Ms, errors: z.number().int().min(0).max(500) });

/** One player's raw run (two in Duo Mode: parent then child). */
export const RawRunSchema = z.object({
  who: z.enum(["me", "parent", "child"]),
  role: z.enum(ROLES),
  wordSet: z.enum(["A", "B"]),
  checkPassageId: Id,
  checkMs: Ms,
  checkAnswers: Answers,
  sharpPassageId: Id,
  /** Time the pacer took over the whole passage (Slower/Faster included). */
  sharpMs: Ms,
  sharpAnswers: Answers,
  memoryPicked: z.array(Id).max(5),
  storyForward: z.array(Id).max(5),
  storyBackward: z.array(Id).max(5),
  focusBefore: Focus,
  focusAfter: Focus,
});
export type RawRun = z.infer<typeof RawRunSchema>;

export type RunSetup = { who: RawRun["who"]; role: BuRole; wordSet: WordSet };

export const UtmSchema = z
  .object({
    utm_source: z.string().trim().max(120).optional(),
    utm_medium: z.string().trim().max(120).optional(),
    utm_campaign: z.string().trim().max(200).optional(),
    utm_term: z.string().trim().max(200).optional(),
    utm_content: z.string().trim().max(200).optional(),
  })
  .partial();
export type Utm = z.infer<typeof UtmSchema>;

export const SessionIdSchema = z.string().regex(/^[A-Za-z0-9_-]{8,64}$/);

export const FUNNEL_EVENTS = [
  "landing",
  "role_picked",
  "duo_chosen",
  "started",
  "check_done",
  "unlock_speed_done",
  "unlock_memory_done",
  "unlock_focus_done",
  "report_view",
  "whatsapp_submitted",
  "share_clicked",
  "plan_clicked",
  "payment_success",
] as const;
export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

/** Language from the ad campaign: "…_hi" → Hindi, "…_en" → English, otherwise null. */
export function langFromCampaign(
  campaign: string | null | undefined,
): BuLangCode | null {
  if (campaign === null || campaign === undefined) return null;
  const c = campaign.toLowerCase();
  if (/(^|[_-])hi($|[_-])/.test(c)) return "hi";
  if (/(^|[_-])en($|[_-])/.test(c)) return "en";
  return null;
}
