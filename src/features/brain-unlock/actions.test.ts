import { afterEach, describe, expect, it, vi } from "vitest";
import { findPassage } from "./passages";
import { CHECK_POOL, CHECK_SETS, STORY_SETS } from "./words";
import type { RawRun } from "./types";

type Inserted = { table: string; row: Record<string, unknown> };

async function load(): Promise<{
  actions: typeof import("./actions");
  inserted: Inserted[];
  queued: string[];
  afterTasks: (() => Promise<void>)[];
}> {
  vi.resetModules();
  const inserted: Inserted[] = [];
  const queued: string[] = [];
  const afterTasks: (() => Promise<void>)[] = [];
  vi.doMock("@/lib/rateLimit", () => ({
    checkRateLimit: () => ({ allowed: true, retryAfterMs: 0 }),
    getClientIp: () => Promise.resolve("1.1.1.1"),
  }));
  vi.doMock("next/headers", () => ({
    headers: () => Promise.resolve(new Map([["host", "www.example.test"]])),
  }));
  vi.doMock("next/server", () => ({
    after: (fn: () => Promise<void>) => afterTasks.push(fn),
  }));
  vi.doMock("./settingsServer", async () => ({
    getBrainUnlockSettings: async () =>
      (await import("./settings")).DEFAULT_SETTINGS,
  }));
  vi.doMock("./followups", () => ({
    queueFollowups: (id: string) => (queued.push(id), Promise.resolve()),
  }));
  vi.doMock("@/lib/email/sendBrainUnlockEmails", () => ({
    sendBrainUnlockFounderEmail: () => Promise.resolve(),
    sendBrainUnlockReportEmail: () => Promise.resolve(),
  }));
  vi.doMock("@/lib/supabase/service", () => ({
    createServiceClient: () => ({
      from: (table: string) => ({
        insert: (row: Record<string, unknown>) => {
          inserted.push({ table, row });
          return {
            select: () => ({
              single: () =>
                Promise.resolve({
                  data: { id: "lead-uuid", created_at: "2026-11-14T06:00:00Z" },
                  error: null,
                }),
            }),
          };
        },
      }),
    }),
  }));
  return { actions: await import("./actions"), inserted, queued, afterTasks };
}

function run(who: RawRun["who"], role: RawRun["role"], set: "A" | "B"): RawRun {
  const checkSet = set === "A" ? "c1" : "c2";
  const storySet = set === "A" ? "s1" : "s2";
  const check = findPassage(role, "en", "check");
  const sharp = findPassage(role, "en", "sharp");
  const checkIds = CHECK_SETS[checkSet].map((w) => w.id);
  const story = STORY_SETS[storySet].map((w) => w.id);
  return {
    who,
    role,
    checkSet,
    storySet,
    checkPassageId: check.id,
    checkMs: 22_500, // ≈ 60 words → ~160 WPM
    checkAnswers: check.questions.map((q) => q.correctIndex),
    sharpPassageId: sharp.id,
    sharpMs: 27_000,
    sharpAnswers: sharp.questions.map((q) => q.correctIndex),
    memoryPicked: [checkIds[0]!, checkIds[1]!, CHECK_POOL[0]!.id],
    storyForward: story,
    storyBackward: [...story].reverse(),
    focusBefore: { ms: 18_000, errors: 1 },
    focusAfter: { ms: 11_000, errors: 0 },
  };
}

const base = {
  sessionId: "sess_12345678",
  firstName: "Asha",
  phone: "98123 45678",
  email: "",
  lang: "en" as const,
  classBand: "9-10" as const,
  utm: {
    utm_source: "meta",
    utm_medium: "whatsapp",
    utm_campaign: "sb_free_test_en",
  },
  pageUrl: "https://www.example.test/reading-memory-test?utm_source=meta",
};

describe("saveBrainUnlockLead", () => {
  afterEach(() => vi.resetModules());

  it("saves the lead with server-computed numbers, role, class, Brain Type, UTM, and queues the follow-ups", async () => {
    const { actions, inserted, queued, afterTasks } = await load();
    const res = await actions.saveBrainUnlockLead({
      ...base,
      role: "student",
      duo: false,
      runs: [run("me", "student", "A")],
    });
    expect(res.ok).toBe(true);
    const row = inserted[0]!.row;
    expect(inserted[0]!.table).toBe("speed_test_results");
    expect(row).toMatchObject({
      whatsapp_number: "919812345678",
      test_kind: "brain_unlock",
      role: "student",
      class_band: "9-10",
      duo: false,
      utm_source: "meta",
      utm_campaign: "sb_free_test_en",
      session_id: "sess_12345678",
      status: "valid",
    });
    const details = row.details as {
      runs: {
        memoryBefore: number;
        memoryForward: number;
        memoryBackward: number;
        speedCounted: boolean;
      }[];
      links: { selfPaced: string };
    };
    expect(details.runs[0]).toMatchObject({
      memoryBefore: 2,
      memoryForward: 5,
      memoryBackward: 5,
      speedCounted: true,
    });
    expect(details.links.selfPaced).toContain("utm_campaign=sb_free_test_en");
    expect(details.links.selfPaced).toContain(
      "https://www.example.test/reading-memory-test",
    );
    expect(typeof row.brain_type).toBe("string");
    expect(queued).toEqual(["lead-uuid"]);
    expect(afterTasks).toHaveLength(1);
  });

  it("saves which sets each player got, the device id, and a retake link carrying the lead id", async () => {
    const { actions, inserted } = await load();
    const device = "11111111-2222-4333-8444-555555555555";
    const res = await actions.saveBrainUnlockLead({
      ...base,
      role: "parent",
      duo: true,
      deviceId: device,
      runs: [run("parent", "parent", "A"), run("child", "student", "B")],
    });
    expect(res.ok).toBe(true);
    const row = inserted[0]!.row;
    const details = row.details as {
      sets: { checkSet: string; storySet: string; checkPassageId: string }[];
      deviceId: string;
      links: { retake: string };
    };
    expect(details.sets.map((x) => `${x.checkSet}.${x.storySet}`)).toEqual([
      "c1.s1",
      "c2.s2",
    ]);
    expect(details.sets[1]!.checkPassageId).toContain("bu-student-en-check");
    expect(details.deviceId).toBe(device);
    expect(details.links.retake).toContain(`retake=${String(row.id)}`);
    expect(details.links.retake).toContain("utm_campaign=bu_retake_d30");
  });

  it("refuses words that were never on this set's pick screen", async () => {
    const { actions } = await load();
    const res = await actions.saveBrainUnlockLead({
      ...base,
      role: "student",
      duo: false,
      runs: [{ ...run("me", "student", "A"), memoryPicked: ["gorilla"] }],
    });
    expect(res.ok).toBe(false);
  });

  it("Duo Mode saves both results under one lead (the parent’s number)", async () => {
    const { actions, inserted } = await load();
    const res = await actions.saveBrainUnlockLead({
      ...base,
      role: "parent",
      duo: true,
      childClassBand: "9-10",
      runs: [run("parent", "parent", "A"), run("child", "student", "B")],
    });
    expect(res.ok).toBe(true);
    expect(inserted).toHaveLength(1);
    const details = inserted[0]!.row.details as {
      runs: { who: string }[];
      facts: { child?: { score: number } };
    };
    expect(details.runs.map((r) => r.who)).toEqual(["parent", "child"]);
    expect(details.facts.child).toBeDefined();
    expect(inserted[0]!.row.duo).toBe(true);
  });

  it("wrong answers never count the pacer speed, whatever the browser sends", async () => {
    const { actions, inserted } = await load();
    const r = run("me", "student", "A");
    await actions.saveBrainUnlockLead({
      ...base,
      role: "student",
      duo: false,
      runs: [{ ...r, sharpAnswers: [-1, -1] }],
    });
    const details = inserted[0]!.row.details as {
      runs: {
        speedCounted: boolean;
        speedAfterWpm: number;
        speedBefore: { wpm: number };
      }[];
    };
    expect(details.runs[0]!.speedCounted).toBe(false);
    expect(details.runs[0]!.speedAfterWpm).toBe(
      details.runs[0]!.speedBefore.wpm,
    );
  });

  it("rejects a bad number, an unknown passage and a foreign page URL", async () => {
    const { actions, inserted } = await load();
    expect(
      await actions.saveBrainUnlockLead({
        ...base,
        phone: "12345",
        role: "student",
        duo: false,
        runs: [run("me", "student", "A")],
      }),
    ).toEqual({ ok: false, error: "Enter a valid WhatsApp number." });
    expect(
      (
        await actions.saveBrainUnlockLead({
          ...base,
          role: "student",
          duo: false,
          runs: [{ ...run("me", "student", "A"), sharpPassageId: "nope" }],
        })
      ).ok,
    ).toBe(false);
    expect(
      (
        await actions.saveBrainUnlockLead({
          ...base,
          pageUrl: "https://evil.test/x",
          role: "student",
          duo: false,
          runs: [run("me", "student", "A")],
        })
      ).ok,
    ).toBe(false);
    expect(inserted).toHaveLength(0);
  });
});

describe("gradeReading", () => {
  it("checks answers on the server key", async () => {
    const { actions } = await load();
    const check = findPassage("parent", "hi", "check");
    const sharp = findPassage("parent", "hi", "sharp");
    const res = await actions.gradeReading({
      checkPassageId: check.id,
      checkAnswers: [check.questions[0]!.correctIndex],
      sharpPassageId: sharp.id,
      sharpAnswers: [sharp.questions[0]!.correctIndex, -1],
    });
    expect(res).toEqual({
      ok: true,
      grade: { checkCorrect: 1, checkTotal: 1, sharpCorrect: 1, sharpTotal: 2 },
    });
  });
});
