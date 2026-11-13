import { afterEach, describe, expect, it, vi } from "vitest";
import { followupText, type FollowupContext } from "./messages";
import { DEFAULT_SETTINGS } from "./settings";

const facts: FollowupContext["facts"] = {
  firstName: "Asha",
  brainType: "sprinter",
  score: 78,
  speed: { before: 160, after: 290, counted: true },
  memory: { before: 2, forward: 5, backward: 5 },
  focus: { before: 18.2, after: 11.4 },
};
const ctx: FollowupContext = {
  facts,
  role: "parent",
  settings: DEFAULT_SETTINGS,
  links: {
    report: "https://x.test/r?view=offer",
    selfPaced: "https://x.test/r?plan=self",
    live: "https://x.test/r?plan=live",
    retake: "https://x.test/r?utm_source=whatsapp",
  },
};

describe("follow-up messages", () => {
  it("instant: report, Brain Type, real numbers, 30-day plan, both plans, STOP", () => {
    const t = followupText("instant", ctx)!;
    expect(t).toContain("🚀 Hidden Sprinter");
    expect(t).toContain("78/100");
    expect(t).toContain("160 → 290 WPM");
    expect(t).toContain("2/5 → 5/5");
    expect(t).toContain("18.2s → 11.4s");
    expect(t).toContain(DEFAULT_SETTINGS.goals.speed.en);
    expect(t).toContain("https://x.test/r?plan=self");
    expect(t).toContain("https://x.test/r?plan=live");
    expect(t).toContain("STOP");
    expect(t).toMatch(/[ऀ-ॿ]/); // warm Hindi words in Devanagari
    expect(t.toLowerCase()).not.toContain("guarantee");
  });
  it("an uncounted speed is shown as the real baseline only", () => {
    expect(
      followupText("instant", {
        ...ctx,
        facts: { ...facts, speed: { before: 160, after: 160, counted: false } },
      }),
    ).toContain("⚡ 160 WPM");
  });
  it("+1 hour is skipped until a demo video is set", () => {
    expect(followupText("h1", ctx)).toBeNull();
    expect(
      followupText("h1", {
        ...ctx,
        settings: { ...DEFAULT_SETTINGS, demoVideoId: "abcdefghijk" },
      }),
    ).toContain("https://youtu.be/abcdefghijk");
  });
  it("+1 day: the parent review video; +2 days: the offer with the batch date when set; +30 days: retake", () => {
    expect(followupText("d1", ctx)).toContain(
      `https://youtu.be/${DEFAULT_SETTINGS.reviewVideoIds.parent}`,
    );
    expect(followupText("d2", ctx)).not.toContain("Next live batch");
    expect(
      followupText("d2", {
        ...ctx,
        settings: {
          ...DEFAULT_SETTINGS,
          nextBatch: { date: "2026-12-01", seatsLeft: 12 },
        },
      }),
    ).toContain("Next live batch: 1 December (12 seats left)");
    expect(followupText("d30", ctx)).toContain(
      "https://x.test/r?utm_source=whatsapp",
    );
  });
});

describe("follow-up queue", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("queues instant, +1h, +1d, +2d, +30d; a step turned off in admin is not queued", async () => {
    const { plannedFollowups } = await import("./followups");
    const t0 = Date.UTC(2026, 10, 14, 6);
    const all = plannedFollowups(t0, DEFAULT_SETTINGS);
    expect(all.map((p) => p.step)).toEqual([
      "instant",
      "h1",
      "d1",
      "d2",
      "d30",
    ]);
    expect(Date.parse(all[1]!.dueAt) - t0).toBe(3_600_000);
    expect(Date.parse(all[4]!.dueAt) - t0).toBe(30 * 86_400_000);
    expect(
      plannedFollowups(t0, {
        ...DEFAULT_SETTINGS,
        followups: { ...DEFAULT_SETTINGS.followups, h1: false },
      }).map((p) => p.step),
    ).not.toContain("h1");
    expect(
      plannedFollowups(t0, {
        ...DEFAULT_SETTINGS,
        followups: { ...DEFAULT_SETTINGS.followups, enabled: false },
      }),
    ).toEqual([]);
  });

  type Call = { table: string; ops: [string, unknown[]][] };
  function fakeClient(answer: (c: Call) => unknown): {
    client: unknown;
    calls: Call[];
  } {
    const calls: Call[] = [];
    const client = {
      from: (table: string) => {
        const call: Call = { table, ops: [] };
        calls.push(call);
        const b: Record<string, unknown> = {};
        for (const op of [
          "select",
          "eq",
          "lte",
          "gte",
          "order",
          "limit",
          "in",
          "like",
          "update",
          "insert",
        ])
          b[op] = (...args: unknown[]) => (call.ops.push([op, args]), b);
        b.then = (resolve: (v: unknown) => void) =>
          resolve({ data: answer(call), error: null });
        return b;
      },
    };
    return { client, calls };
  }

  async function run(opts: {
    purchased: boolean;
    optedOut: boolean;
    chatboxx: boolean;
  }): Promise<{
    counts: Record<string, number>;
    calls: Call[];
    sent: string[];
  }> {
    const lead = {
      id: "lead-1",
      whatsapp_number: "919812345678",
      email: "a@b.co",
      created_at: "2026-11-14T06:00:00Z",
      details: { facts, role: "parent", links: ctx.links },
    };
    const { client, calls } = fakeClient((c) => {
      const op = (name: string): boolean => c.ops.some(([o]) => o === name);
      if (c.table === "brain_unlock_followups" && op("lte"))
        return [{ id: "f1", lead_id: "lead-1", step: "instant", attempts: 0 }];
      if (c.table === "speed_test_results") return [lead];
      if (c.table === "whatsapp_opt_outs")
        return opts.optedOut ? [{ whatsapp_number: lead.whatsapp_number }] : [];
      if (c.table === "masterclass_payments")
        return opts.purchased ? [{ id: "p1" }] : [];
      if (c.table === "brain_unlock_settings") return null;
      if (c.table === "brain_unlock_followups" && op("update") && op("select"))
        return [{ id: "f1" }, { id: "f2" }];
      return null;
    });
    const sent: string[] = [];
    vi.doMock("@/lib/supabase/service", () => ({
      createServiceClient: () => client,
    }));
    vi.doMock("@/lib/whatsapp/chatboxx", () => ({
      isChatboxxConfigured: () => opts.chatboxx,
      sendWhatsAppText: (_to: string, text: string) => (
        sent.push(text),
        Promise.resolve({ ok: true })
      ),
    }));
    const { sendBrainUnlockFollowups } = await import("./followups");
    return {
      counts: await sendBrainUnlockFollowups(
        Date.parse("2026-11-14T06:05:00Z"),
      ),
      calls,
      sent,
    };
  }

  const updates = (calls: Call[]): unknown[] =>
    calls
      .filter((c) => c.table === "brain_unlock_followups")
      .flatMap((c) =>
        c.ops.filter(([o]) => o === "update").map(([, a]) => a[0]),
      );

  it("stops every pending follow-up once the lead has bought Sharp Brain", async () => {
    const { counts, calls, sent } = await run({
      purchased: true,
      optedOut: false,
      chatboxx: true,
    });
    expect(sent).toEqual([]);
    expect(updates(calls)).toContainEqual({
      status: "stopped",
      reason: "purchased",
    });
    expect(counts.stopped).toBe(2);
  });

  it("respects STOP", async () => {
    const { calls, sent } = await run({
      purchased: false,
      optedOut: true,
      chatboxx: true,
    });
    expect(sent).toEqual([]);
    expect(updates(calls)).toContainEqual({
      status: "stopped",
      reason: "stop_requested",
    });
  });

  it("until Chatboxx is connected, due messages are marked skipped (never piled up)", async () => {
    const { calls, sent } = await run({
      purchased: false,
      optedOut: false,
      chatboxx: false,
    });
    expect(sent).toEqual([]);
    expect(updates(calls)).toContainEqual({
      status: "skipped",
      reason: "whatsapp_api_not_configured",
      attempts: 0,
    });
  });

  it("sends the instant report when connected", async () => {
    const { calls, sent } = await run({
      purchased: false,
      optedOut: false,
      chatboxx: true,
    });
    expect(sent).toHaveLength(1);
    expect(sent[0]).toContain("Hidden Sprinter");
    expect(updates(calls)).toContainEqual(
      expect.objectContaining({ status: "sent", attempts: 1 }),
    );
  });
});
