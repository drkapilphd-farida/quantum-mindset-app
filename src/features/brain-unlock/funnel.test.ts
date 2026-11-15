import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { buildDropOff, buildFunnel, type EventRow } from "./funnel";
import { FUNNEL_EVENTS } from "./types";

const ev = (
  session: string,
  event: string,
  extra: Partial<EventRow> = {},
): EventRow => ({
  session_id: session,
  event,
  role: null,
  duo: false,
  data: {},
  utm_campaign: "sb_free_test_en",
  created_at: "2026-11-14T06:00:00Z",
  ...extra,
});

const events: EventRow[] = [
  ev("a", "landing"),
  ev("a", "role_picked", { role: "parent" }),
  ev("a", "started", { role: "parent" }),
  ev("a", "check_done", { role: "parent" }),
  ev("a", "unlock_speed_done", {
    role: "parent",
    data: { before: 160, after: 290, counted: true },
  }),
  ev("a", "unlock_memory_done", {
    role: "parent",
    data: { before: 2, after: 5 },
  }),
  ev("a", "unlock_focus_done", {
    role: "parent",
    data: { before: 18000, after: 11000 },
  }),
  ev("a", "report_view", { role: "parent", data: { type: "sprinter" } }),
  ev("a", "whatsapp_submitted", { role: "parent" }),
  ev("b", "landing", { utm_campaign: "sb_free_test_hi" }),
  ev("b", "role_picked", { role: "student", utm_campaign: "sb_free_test_hi" }),
  ev("b", "started", { role: "student", utm_campaign: "sb_free_test_hi" }),
  ev("b", "unlock_speed_done", {
    role: "student",
    utm_campaign: "sb_free_test_hi",
    data: { before: 200, after: 180, counted: false },
  }),
  ev("c", "landing"),
  ev("c", "landing"), // a reload never counts twice
];

describe("Brain Unlock funnel", () => {
  it("counts unique sessions per step with % of the previous step and of landing", () => {
    const f = buildFunnel(events, new Set(["a"]), {
      campaign: null,
      role: null,
    });
    const s = Object.fromEntries(f.steps.map((x) => [x.event, x]));
    expect(s.landing!.sessions).toBe(3);
    expect(s.role_picked!.sessions).toBe(2);
    expect(s.role_picked!.ofPrevious).toBe(66.7);
    expect(s.report_view!.sessions).toBe(1);
    expect(s.payment_success!.sessions).toBe(1);
    expect(s.payment_success!.ofLanding).toBe(33.3);
  });
  it("filters by campaign and by role", () => {
    expect(
      buildFunnel(events, new Set(), {
        campaign: "sb_free_test_hi",
        role: null,
      }).steps[0]!.sessions,
    ).toBe(1);
    expect(
      buildFunnel(events, new Set(), { campaign: null, role: "parent" })
        .steps[0]!.sessions,
    ).toBe(1);
  });
  it("averages before/after per superpower (speed only when it counted) and Brain Type counts", () => {
    const f = buildFunnel(events, new Set(), { campaign: null, role: null });
    expect(f.averages.speed).toEqual({ n: 1, before: 160, after: 290 });
    expect(f.averages.memory).toEqual({ n: 1, before: 2, after: 5 });
    expect(f.averages.focus).toEqual({ n: 1, beforeS: 18, afterS: 11 });
    expect(f.brainTypes).toEqual([{ type: "sprinter", count: 1 }]);
  });
  it("breaks down by campaign and role", () => {
    const f = buildFunnel(events, new Set(["a"]), {
      campaign: null,
      role: null,
    });
    expect(f.byCampaign.find((b) => b.key === "sb_free_test_en")).toEqual({
      key: "sb_free_test_en",
      landed: 2,
      reports: 1,
      leads: 1,
      plans: 0,
      paid: 1,
    });
    expect(f.byRole.find((b) => b.key === "student")?.landed).toBe(1);
  });
});

describe("where people left mid-challenge", () => {
  const t = (min: number, sec = 0): string => new Date(Date.UTC(2026, 10, 14, 6, min, sec)).toISOString();
  const path = (session: string, steps: [string, number][], extra: Partial<EventRow> = {}): EventRow[] =>
    steps.map(([event, min]) => ev(session, event, { created_at: t(min), role: "student", lang: "en", ...extra }));
  const rows: EventRow[] = [
    // left in the Brain Check
    ...path("checkLeaver1", [["landing", 0], ["role_picked", 0], ["started", 1]]),
    ...path("checkLeaver2", [["landing", 0], ["started", 0]], { lang: "hi", role: "parent" }),
    // left in the memory story after 3 minutes (started 1, check 3, speed 4)
    ...path("memLeaver", [["landing", 0], ["started", 1], ["check_done", 3], ["unlock_speed_done", 4]]),
    // left in the focus grid
    ...path("focusLeaver", [["started", 0], ["check_done", 2], ["unlock_speed_done", 3], ["unlock_memory_done", 5]]),
    // finished
    ...path("done", [["started", 0], ["check_done", 2], ["unlock_speed_done", 4], ["unlock_memory_done", 6], ["unlock_focus_done", 7], ["report_view", 7]]),
    // started twice in the same tab: counts once, from the second start (left in Speed)
    ...path("restart", [["started", 0], ["started", 10], ["check_done", 12]]),
    // never started: not counted
    ...path("browser", [["landing", 0], ["role_picked", 0]]),
  ];

  it("puts each person at the stage they were in, with the time played", () => {
    const d = buildDropOff(rows, { campaign: null, role: null });
    expect(d.started).toBe(6);
    expect(d.reachedReport).toBe(1);
    const left = Object.fromEntries(d.rows.map((r) => [r.stage, r.left]));
    expect(left).toEqual({ check: 2, speed: 1, memory: 1, focus: 1, report: 0 });
    const by = Object.fromEntries(d.sessions.map((x) => [x.session, x]));
    expect(by.memLea?.playedSeconds).toBe(180);
    expect(by.focusL?.playedSeconds).toBe(300);
    expect(by.restar?.playedSeconds).toBe(120);
    expect(by.checkL).toBeDefined();
    expect(d.rows.find((r) => r.stage === "check")?.avgPlayedSeconds).toBe(0);
    expect(d.rows.find((r) => r.stage === "check")?.reached).toBe(6);
    expect(d.rows.find((r) => r.stage === "focus")?.reached).toBe(2);
  });

  it("averages how long finishers took per stage", () => {
    const d = buildDropOff(rows, { campaign: null, role: null });
    // Brain Check finishers: memLeaver 2 min, focusLeaver 2, done 2, restart 2.
    expect(d.rows.find((r) => r.stage === "check")?.avgStageSeconds).toBe(120);
    // Memory finishers: focusLeaver 2 min, done 2 min.
    expect(d.rows.find((r) => r.stage === "memory")?.avgStageSeconds).toBe(120);
  });

  it("follows the role filter", () => {
    const d = buildDropOff(rows, { campaign: null, role: "parent" });
    expect(d.started).toBe(1);
    expect(d.sessions[0]?.lang).toBe("hi");
  });
});

describe("funnel events", () => {
  it("the database allows exactly the events the code sends (latest migration)", () => {
    const sql = fs.readFileSync("supabase/migrations/20261115000002_brain_unlock_submit_events.sql", "utf8");
    const list = /CHECK \(event IN \(([\s\S]*?)\)\)/.exec(sql)?.[1] ?? "";
    const allowed = [...list.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]).sort();
    expect(allowed).toEqual([...FUNNEL_EVENTS].sort());
  });
});
