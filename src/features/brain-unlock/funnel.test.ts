import { describe, expect, it } from "vitest";
import { buildFunnel, type EventRow } from "./funnel";

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
