import { trackGaEvent } from "@/lib/analytics/ga4";
import { trackLead } from "@/lib/analytics/conversions";
import { readUtmParams } from "@/lib/analytics/utm";
import { logBrainUnlockEvent } from "./actions";
import type { BuRole } from "./passages";
import type { FunnelEvent } from "./types";

// Brain Unlock funnel tracking (browser). Each step goes to our own table
// (for /admin/brain-unlock-funnel) and to GA4, always with the visit's UTM
// tags. Meta: Lead when the WhatsApp form is sent (Contact/InitiateCheckout
// are fired by the existing WhatsApp and checkout helpers). No personal
// details are ever sent.

const SESSION_KEY = "bu_session";

function randomId(): string {
  try {
    return crypto.randomUUID().replace(/-/g, "");
  } catch {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
  }
}

/** One id per browser tab visit (kept across a reload), joins the events and the lead. */
export function sessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing !== null && /^[A-Za-z0-9_-]{8,64}$/.test(existing))
      return existing;
    const id = randomId();
    window.sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return (memoryId ??= randomId());
  }
}
let memoryId: string | null = null;

export type TrackContext = {
  role: BuRole | null;
  lang: "en" | "hi";
  duo: boolean;
};

export function trackBu(
  event: FunnelEvent,
  ctx: TrackContext,
  data?: Record<string, number | string | boolean>,
): void {
  if (typeof window === "undefined") return;
  const utm = readUtmParams();
  logBrainUnlockEvent({
    sessionId: sessionId(),
    event,
    role: ctx.role,
    lang: ctx.lang,
    duo: ctx.duo,
    ...(data !== undefined ? { data } : {}),
    utm,
  }).catch(() => undefined);
  const params: Record<string, string | number> = {
    step: event,
    lang: ctx.lang,
    duo: ctx.duo ? 1 : 0,
    ...utm,
  };
  if (ctx.role !== null) params.role = ctx.role;
  for (const [k, v] of Object.entries(data ?? {}))
    params[k] = typeof v === "boolean" ? (v ? 1 : 0) : v;
  trackGaEvent("brain_unlock_step", params);
  if (event === "whatsapp_submitted")
    trackLead("Brain Unlock", "whatsapp_report");
}
