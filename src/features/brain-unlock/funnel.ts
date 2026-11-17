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
  lang?: string | null;
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
  "whatsapp_opened",
  "lead_submit_tried",
  "lead_save_failed",
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
  /** Mobile / tablet / desktop (recorded from 17 Nov 2026). */
  byDevice: Breakdown[];
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

/** Each session's campaign (the one it landed with) and role (the one it picked), and the filter on them. */
function sessionFilter(
  events: readonly EventRow[],
  filter: FunnelFilter,
): {
  campaignOf: Map<string, string>;
  roleOf: Map<string, string>;
  keep: (s: string) => boolean;
} {
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
  return { campaignOf, roleOf, keep };
}

export function buildFunnel(
  events: readonly EventRow[],
  paidSessions: ReadonlySet<string>,
  filter: FunnelFilter,
): FunnelReport {
  const { campaignOf, roleOf, keep } = sessionFilter(events, filter);
  const rows = events.filter((e) => keep(e.session_id));
  const deviceOf = new Map<string, string>();
  for (const e of rows) {
    const d = field(e.data, "device");
    if (typeof d === "string" && !deviceOf.has(e.session_id)) deviceOf.set(e.session_id, d);
  }

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
    byDevice: breakdown((s) => deviceOf.get(s) ?? "(not recorded)"),
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

// ── Where people left mid-challenge (founder, 15 Nov 2026) ──────────────────
// For every session that started but never saw the report: the stage it was
// in when it stopped (the one after its last finished step), and the time
// from "started" to that last finished step. The exact moment someone left is
// not recorded, so this is how long they had played at least. A session that
// started again (same tab) counts from its last start.

export const DROP_STAGES = ["check", "speed", "memory", "focus", "report"] as const;
export type DropStage = (typeof DROP_STAGES)[number];

/** The event that ends each stage. */
const STAGE_END: Record<DropStage, FunnelEvent> = {
  check: "check_done",
  speed: "unlock_speed_done",
  memory: "unlock_memory_done",
  focus: "unlock_focus_done",
  report: "report_view",
};

export type DroppedSession = {
  session: string;
  lang: string | null;
  role: string | null;
  duo: boolean;
  startedAt: string;
  stage: DropStage;
  /** From "started" to the last finished step (0 = left in the Brain Check). */
  playedSeconds: number;
};

export type DropRow = {
  stage: DropStage;
  /** People who left during this stage. */
  left: number;
  /** People who reached this stage (finished the one before). */
  reached: number;
  /** Average time played before leaving (start → last finished step). */
  avgPlayedSeconds: number | null;
  /** How long the people who finished this stage took for it, on average. */
  avgStageSeconds: number | null;
};

export type DropOff = {
  started: number;
  reachedReport: number;
  rows: DropRow[];
  sessions: DroppedSession[];
};

export function buildDropOff(
  events: readonly EventRow[],
  filter: FunnelFilter,
): DropOff {
  const { roleOf, keep } = sessionFilter(events, filter);
  const bySession = new Map<string, EventRow[]>();
  for (const e of events) {
    if (!keep(e.session_id)) continue;
    const list = bySession.get(e.session_id) ?? [];
    list.push(e);
    bySession.set(e.session_id, list);
  }
  const ms = (iso: string): number => Date.parse(iso);
  const stageTimes = new Map<DropStage, number[]>(DROP_STAGES.map((st) => [st, []]));
  const reached = new Map<DropStage, number>(DROP_STAGES.map((st) => [st, 0]));
  const dropped: DroppedSession[] = [];
  let started = 0;
  let reachedReport = 0;
  for (const [session, list] of bySession) {
    const sorted = [...list].sort((a, b) => ms(a.created_at) - ms(b.created_at));
    const lastStart = sorted.map((e) => e.event).lastIndexOf("started");
    if (lastStart === -1) continue;
    started += 1;
    const run = sorted.slice(lastStart);
    const t0 = ms(run[0]!.created_at);
    const at = (ev: FunnelEvent): number | null => {
      const e = run.find((x) => x.event === ev);
      return e === undefined ? null : ms(e.created_at);
    };
    let prev = t0;
    let stage: DropStage | null = null;
    for (const st of DROP_STAGES) {
      reached.set(st, (reached.get(st) ?? 0) + 1);
      const end = at(STAGE_END[st]);
      if (end === null) {
        stage = st;
        break;
      }
      stageTimes.get(st)!.push((end - prev) / 1000);
      prev = end;
    }
    if (stage === null) {
      reachedReport += 1;
      continue;
    }
    dropped.push({
      session: session.slice(0, 6),
      lang: run.find((e) => e.lang)?.lang ?? sorted.find((e) => e.lang)?.lang ?? null,
      role: roleOf.get(session) ?? null,
      duo: sorted.some((e) => e.duo || e.event === "duo_chosen"),
      startedAt: run[0]!.created_at,
      stage,
      playedSeconds: Math.round((prev - t0) / 1000),
    });
  }
  const mean = (xs: number[]): number | null =>
    xs.length === 0 ? null : Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);
  return {
    started,
    reachedReport,
    rows: DROP_STAGES.map((stage) => {
      const left = dropped.filter((d) => d.stage === stage);
      return {
        stage,
        left: left.length,
        reached: reached.get(stage) ?? 0,
        avgPlayedSeconds: mean(left.map((d) => d.playedSeconds)),
        avgStageSeconds: mean(stageTimes.get(stage) ?? []),
      };
    }),
    sessions: dropped.sort((a, b) => ms(a.startedAt) - ms(b.startedAt)),
  };
}
