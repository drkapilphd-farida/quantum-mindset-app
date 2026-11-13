import type { BrainTypeId } from "./settings";
import type { FunnelEvent } from "./types";

// /admin/brain-unlock-funnel: pure aggregation of the funnel events (tested).
// Counts unique sessions per step; a session's campaign is the one it landed
// with, its role the one it picked.

export type EventRow = {
  session_id: string;
  event: string;
  role: string | null;
  duo: boolean;
  data: unknown;
  utm_campaign: string | null;
  created_at: string;
};

/** The main path, in order; drop % is against the previous main step. */
export const MAIN_STEPS: readonly FunnelEvent[] = [
  "landing",
  "role_picked",
  "started",
  "check_done",
  "unlock_speed_done",
  "unlock_memory_done",
  "unlock_focus_done",
  "report_view",
  "whatsapp_submitted",
  "plan_clicked",
  "payment_success",
];
/** Side steps: shown with their count, no drop. */
export const SIDE_STEPS: readonly FunnelEvent[] = [
  "duo_chosen",
  "share_clicked",
];

export type FunnelFilter = { campaign: string | null; role: string | null };
export type StepRow = {
  event: FunnelEvent;
  sessions: number;
  ofPrevious: number | null;
  ofLanding: number | null;
};
export type Breakdown = {
  key: string;
  landed: number;
  reports: number;
  leads: number;
  plans: number;
  paid: number;
};
export type Averages = {
  speed: { n: number; before: number; after: number };
  memory: { n: number; before: number; after: number };
  focus: { n: number; beforeS: number; afterS: number };
};
export type FunnelReport = {
  steps: StepRow[];
  side: StepRow[];
  byCampaign: Breakdown[];
  byRole: Breakdown[];
  averages: Averages;
  brainTypes: { type: string; count: number }[];
  duoSessions: number;
};

const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;
const field = (data: unknown, key: string): unknown =>
  typeof data === "object" && data !== null
    ? (data as Record<string, unknown>)[key]
    : undefined;
const pct = (a: number, b: number): number | null =>
  b === 0 ? null : Math.round((a / b) * 1000) / 10;
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : Math.round(xs.reduce((s, x) => s + x, 0) / xs.length);

export function buildFunnel(
  events: readonly EventRow[],
  paidSessions: ReadonlySet<string>,
  filter: FunnelFilter,
): FunnelReport {
  const campaignOf = new Map<string, string>();
  const roleOf = new Map<string, string>();
  for (const e of events) {
    if (!campaignOf.has(e.session_id) && e.utm_campaign !== null)
      campaignOf.set(e.session_id, e.utm_campaign);
    if (
      e.role !== null &&
      (e.event === "role_picked" || !roleOf.has(e.session_id))
    )
      roleOf.set(e.session_id, e.role);
  }
  const keep = (s: string): boolean =>
    (filter.campaign === null ||
      (campaignOf.get(s) ?? "(none)") === filter.campaign) &&
    (filter.role === null || roleOf.get(s) === filter.role);
  const rows = events.filter((e) => keep(e.session_id));

  const sessionsBy = new Map<string, Set<string>>();
  const add = (event: string, s: string): void => {
    const set = sessionsBy.get(event) ?? new Set<string>();
    set.add(s);
    sessionsBy.set(event, set);
  };
  for (const e of rows) add(e.event, e.session_id);
  for (const s of paidSessions) if (keep(s)) add("payment_success", s);
  const count = (ev: string): number => sessionsBy.get(ev)?.size ?? 0;

  const landing = count("landing");
  const steps: StepRow[] = MAIN_STEPS.map((event, i) => ({
    event,
    sessions: count(event),
    ofPrevious: i === 0 ? null : pct(count(event), count(MAIN_STEPS[i - 1]!)),
    ofLanding: i === 0 ? null : pct(count(event), landing),
  }));
  const side: StepRow[] = SIDE_STEPS.map((event) => ({
    event,
    sessions: count(event),
    ofPrevious: null,
    ofLanding: pct(count(event), landing),
  }));

  const breakdown = (keyOf: (s: string) => string): Breakdown[] => {
    const groups = new Map<string, Breakdown>();
    const touch = (key: string): Breakdown => {
      const g = groups.get(key) ?? {
        key,
        landed: 0,
        reports: 0,
        leads: 0,
        plans: 0,
        paid: 0,
      };
      groups.set(key, g);
      return g;
    };
    const inc = (ev: string, prop: keyof Omit<Breakdown, "key">): void => {
      for (const s of sessionsBy.get(ev) ?? []) touch(keyOf(s))[prop] += 1;
    };
    inc("landing", "landed");
    inc("report_view", "reports");
    inc("whatsapp_submitted", "leads");
    inc("plan_clicked", "plans");
    inc("payment_success", "paid");
    return [...groups.values()].sort((a, b) => b.landed - a.landed);
  };

  const speedB: number[] = [];
  const speedA: number[] = [];
  const memB: number[] = [];
  const memA: number[] = [];
  const focB: number[] = [];
  const focA: number[] = [];
  const types = new Map<string, number>();
  const seen = new Set<string>();
  for (const e of rows) {
    const once = `${e.session_id}:${e.event}`;
    if (seen.has(once)) continue;
    seen.add(once);
    const b = num(field(e.data, "before"));
    const a = num(field(e.data, "after"));
    if (
      e.event === "unlock_speed_done" &&
      b !== null &&
      a !== null &&
      field(e.data, "counted") === true
    ) {
      speedB.push(b);
      speedA.push(a);
    }
    if (e.event === "unlock_memory_done" && b !== null && a !== null) {
      memB.push(b);
      memA.push(a);
    }
    if (e.event === "unlock_focus_done" && b !== null && a !== null) {
      focB.push(b);
      focA.push(a);
    }
    if (e.event === "report_view") {
      const t = field(e.data, "type");
      if (typeof t === "string") types.set(t, (types.get(t) ?? 0) + 1);
    }
  }

  return {
    steps,
    side,
    byCampaign: breakdown((s) => campaignOf.get(s) ?? "(none)"),
    byRole: breakdown((s) => roleOf.get(s) ?? "(not picked)"),
    averages: {
      speed: { n: speedB.length, before: avg(speedB), after: avg(speedA) },
      memory: {
        n: memB.length,
        before:
          Math.round(
            (memB.reduce((s, x) => s + x, 0) / Math.max(memB.length, 1)) * 10,
          ) / 10,
        after:
          Math.round(
            (memA.reduce((s, x) => s + x, 0) / Math.max(memA.length, 1)) * 10,
          ) / 10,
      },
      focus: {
        n: focB.length,
        beforeS: Math.round(avg(focB) / 100) / 10,
        afterS: Math.round(avg(focA) / 100) / 10,
      },
    },
    brainTypes: [...types.entries()]
      .map(([type, c]) => ({ type: type as BrainTypeId | string, count: c }))
      .sort((a, b) => b.count - a.count),
    duoSessions: new Set(rows.filter((e) => e.duo).map((e) => e.session_id))
      .size,
  };
}
