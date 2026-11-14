import { afterEach, describe, expect, it, vi } from "vitest";
import {
  followupText,
  reportChatText,
  waLink,
  type FollowupContext,
} from "./messages";
import { boughtLeadIds, dueAtFor, nextStep, stepAvailable } from "./followups";
import { inView, istDayBounds } from "./admin/followupsData";
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
  lang: "en",
  links: {
    report: "https://x.test/r?view=offer",
    selfPaced: "https://x.test/r?plan=self",
    live: "https://x.test/r?plan=live",
    retake: "https://x.test/r?utm_source=whatsapp",
  },
};
const hiCtx: FollowupContext = { ...ctx, lang: "hi" };

describe("“Get my report on WhatsApp” message (the visitor starts the chat)", () => {
  it("Hindi: the founder's wording with name, Brain Type and all three real numbers", () => {
    expect(reportChatText(facts, DEFAULT_SETTINGS, "hi")).toBe(
      [
        "Namaste Dr. Kapil 🙏 मैंने Brain Unlock challenge पूरा किया!",
        "नाम: Asha · Brain Type: 🚀 Hidden Sprinter",
        "⚡ Speed: 160 → 290 WPM",
        "🧠 Memory: 2/5 → 5/5",
        "🎯 Focus: 18.2s → 11.4s",
        "मुझे मेरा 30-day plan भेजिए।",
      ].join("\n"),
    );
  });
  it("English, and an uncounted speed shows the baseline as the 'after' (as on the card)", () => {
    const t = reportChatText(
      { ...facts, speed: { before: 160, after: 300, counted: false } },
      DEFAULT_SETTINGS,
      "en",
    );
    expect(t).toContain("I completed the Brain Unlock challenge!");
    expect(t).toContain("Name: Asha · Brain Type: 🚀 Hidden Sprinter");
    expect(t).toContain("⚡ Speed: 160 → 160 WPM");
    expect(t).toContain("Please send me my 30-day plan.");
  });
  it("Duo Mode adds the child's line", () => {
    const t = reportChatText(
      {
        ...facts,
        child: { ...facts, brainType: "magician", label: "Child" },
      },
      DEFAULT_SETTINGS,
      "en",
    );
    expect(t).toMatch(/Child: .*Memory Magician.*🧠 2\/5 → 5\/5/);
  });
  it("wa.me link to the business number with the text encoded", () => {
    const url = waLink("919540123161", "नमस्ते 🙏 a&b");
    expect(url.startsWith("https://wa.me/919540123161?text=")).toBe(true);
    expect(decodeURIComponent(url.split("?text=")[1]!)).toBe("नमस्ते 🙏 a&b");
  });
});

describe("follow-up messages (sent by hand from /admin/followups)", () => {
  it("instant: thanks, Brain Type, real numbers, 30-day plan, both plans with links", () => {
    for (const c of [ctx, hiCtx]) {
      const t = followupText("instant", c)!;
      expect(t).toContain("🚀 Hidden Sprinter");
      expect(t).toContain("78/100");
      expect(t).toContain("160 → 290 WPM");
      expect(t).toContain("2/5 → 5/5");
      expect(t).toContain("18.2s → 11.4s");
      expect(t).toContain("₹2,999");
      expect(t).toContain("₹8,999");
      expect(t).toContain("https://x.test/r?plan=self");
      expect(t).toContain("https://x.test/r?plan=live");
      expect(t).toContain("धन्यवाद");
      expect(t.toLowerCase()).not.toContain("guarantee");
    }
    expect(followupText("instant", ctx)).toContain(
      DEFAULT_SETTINGS.goals.speed.en,
    );
    expect(followupText("instant", hiCtx)).toContain(
      DEFAULT_SETTINGS.goals.speed.hi,
    );
    expect(followupText("instant", ctx)).toContain("Your Brain Type");
    expect(followupText("instant", hiCtx)).toContain("आपका Brain Type");
  });
  it("English messages carry warm Hindi words in Devanagari", () => {
    for (const step of ["instant", "d1", "d2", "d30"] as const)
      expect(followupText(step, ctx)).toMatch(/[ऀ-ॿ]/);
  });
  it("an uncounted speed is shown as the real baseline only", () => {
    expect(
      followupText("instant", {
        ...ctx,
        facts: { ...facts, speed: { before: 160, after: 160, counted: false } },
      }),
    ).toContain("⚡ 160 WPM");
  });
  it("+1 hour: the demo video (skipped while none is set)", () => {
    expect(followupText("h1", ctx)).toBeNull();
    const s = { ...DEFAULT_SETTINGS, demoVideoId: "abcdefghijk" };
    expect(followupText("h1", { ...ctx, settings: s })).toContain(
      "https://youtu.be/abcdefghijk",
    );
    expect(followupText("h1", { ...hiCtx, settings: s })).toContain("2 मिनट");
  });
  it("+1 day: the parent review video; +2 days: the offer + batch date from settings; +30 days: retake", () => {
    expect(followupText("d1", ctx)).toContain(
      `https://youtu.be/${DEFAULT_SETTINGS.reviewVideoIds.parent}`,
    );
    expect(followupText("d2", ctx)).not.toContain("Next live batch");
    const batch = {
      ...DEFAULT_SETTINGS,
      nextBatch: { date: "2026-12-01", seatsLeft: 12 },
    };
    expect(followupText("d2", { ...ctx, settings: batch })).toContain(
      "Next live batch: 1 December (12 seats left)",
    );
    expect(followupText("d2", { ...hiCtx, settings: batch })).toContain(
      "12 seats बाकी",
    );
    expect(followupText("d30", ctx)).toContain(
      "Take Brain Unlock again and see how far you’ve come",
    );
    expect(followupText("d30", ctx)).toContain(
      "https://x.test/r?utm_source=whatsapp",
    );
    expect(followupText("d30", hiCtx)).toContain(
      "https://x.test/r?utm_source=whatsapp",
    );
  });
});

describe("follow-up steps and due times", () => {
  it("skips steps that are off or have nothing to send", () => {
    expect(stepAvailable("h1", DEFAULT_SETTINGS)).toBe(false); // no demo video
    expect(nextStep(null, DEFAULT_SETTINGS)).toBe("instant");
    expect(nextStep("instant", DEFAULT_SETTINGS)).toBe("d1");
    expect(nextStep("d1", DEFAULT_SETTINGS)).toBe("d2");
    expect(nextStep("d30", DEFAULT_SETTINGS)).toBeNull();
    const withDemo = { ...DEFAULT_SETTINGS, demoVideoId: "abcdefghijk" };
    expect(nextStep("instant", withDemo)).toBe("h1");
    const off = {
      ...DEFAULT_SETTINGS,
      followups: { ...DEFAULT_SETTINGS.followups, d2: false },
    };
    expect(nextStep("d1", off)).toBe("d30");
    const allOff = {
      ...DEFAULT_SETTINGS,
      followups: { ...DEFAULT_SETTINGS.followups, enabled: false },
    };
    expect(nextStep(null, allOff)).toBeNull();
  });
  it("the first step is due at lead time; later ones count from when the previous was done", () => {
    const t0 = Date.parse("2026-11-14T10:00:00.000Z");
    expect(dueAtFor("instant", null, t0)).toBe("2026-11-14T10:00:00.000Z");
    // Instant sent 3 hours late → +1 hour lands an hour after that send, not at once.
    expect(dueAtFor("h1", "instant", t0 + 3 * 3600_000)).toBe(
      "2026-11-14T14:00:00.000Z",
    );
    expect(dueAtFor("d1", "h1", t0)).toBe("2026-11-15T09:00:00.000Z");
    expect(dueAtFor("d30", "d2", t0)).toBe("2026-12-12T10:00:00.000Z");
  });
});

describe("stop after purchase", () => {
  const lead = {
    id: "L1",
    whatsapp_number: "919812345678",
    email: "a@x.in",
    created_at: "2026-11-14T10:00:00Z",
  };
  it("matches a later payment by phone (any format) or email", () => {
    expect(
      boughtLeadIds(
        [lead],
        [
          {
            phone: "+91 98123 45678",
            email: null,
            created_at: "2026-11-15T00:00:00Z",
          },
        ],
      ).has("L1"),
    ).toBe(true);
    expect(
      boughtLeadIds(
        [lead],
        [{ phone: null, email: "A@X.IN", created_at: "2026-11-15T00:00:00Z" }],
      ).has("L1"),
    ).toBe(true);
  });
  it("ignores payments before the test, and other people", () => {
    expect(
      boughtLeadIds(
        [lead],
        [
          {
            phone: "9812345678",
            email: null,
            created_at: "2026-11-01T00:00:00Z",
          },
        ],
      ).size,
    ).toBe(0);
    expect(
      boughtLeadIds(
        [lead],
        [
          {
            phone: "9800000000",
            email: "b@x.in",
            created_at: "2026-11-15T00:00:00Z",
          },
        ],
      ).size,
    ).toBe(0);
  });
});

describe("/admin/followups filters (India time)", () => {
  const now = Date.parse("2026-11-14T12:00:00Z"); // 5:30 pm IST
  it("today runs midnight to midnight IST", () => {
    const { start, end } = istDayBounds(now);
    expect(new Date(start).toISOString()).toBe("2026-11-13T18:30:00.000Z");
    expect(new Date(end).toISOString()).toBe("2026-11-14T18:30:00.000Z");
  });
  it("due / today / overdue / all", () => {
    const yesterday = Date.parse("2026-11-13T10:00:00Z");
    const thisMorning = Date.parse("2026-11-14T03:00:00Z");
    const tonight = Date.parse("2026-11-14T16:00:00Z");
    expect(
      [yesterday, thisMorning, tonight].map((d) => inView("due", d, now)),
    ).toEqual([true, true, false]);
    expect(
      [yesterday, thisMorning, tonight].map((d) => inView("today", d, now)),
    ).toEqual([false, true, true]);
    expect(
      [yesterday, thisMorning, tonight].map((d) => inView("overdue", d, now)),
    ).toEqual([true, false, false]);
    expect(inView("all", tonight + 9e9, now)).toBe(true);
  });
});

// ── The buttons (Done / Skip / Stop) against a fake database ──
type Row = {
  id: string;
  lead_id: string;
  step: string;
  status: string;
  due_at?: string;
  reason?: string | null;
};
type Query = {
  select: () => Query;
  eq: (k: string, v: unknown) => Query;
  in: (k: string, v: unknown[]) => Query;
  update: (p: Record<string, unknown>) => Query;
  upsert: (r: Record<string, unknown>) => Promise<{ error: null }>;
  maybeSingle: () => Promise<{ data: unknown }>;
  then: (res: (v: { data: unknown; error: null }) => void) => void;
};
type FakeDb = {
  client: { from: (name: string) => Query };
  optOuts: string[];
  inserted: Row[];
};
function fakeDb(
  rows: Row[],
  leads: { id: string; whatsapp_number: string }[],
): FakeDb {
  const optOuts: string[] = [];
  const inserted: Row[] = [];
  const table = (name: string): Query => {
    const filters: [string, string, unknown][] = [];
    let patch: Record<string, unknown> | null = null;
    const match = (r: Record<string, unknown>): boolean =>
      filters.every(([op, k, v]) =>
        op === "eq" ? r[k] === v : (v as unknown[]).includes(r[k]),
      );
    const source = (): Record<string, unknown>[] =>
      name === "brain_unlock_followups"
        ? rows
        : name === "speed_test_results"
          ? leads
          : [];
    const q: Query = {
      select: () => q,
      eq: (k: string, v: unknown) => (filters.push(["eq", k, v]), q),
      in: (k: string, v: unknown[]) => (filters.push(["in", k, v]), q),
      update: (p: Record<string, unknown>) => ((patch = p), q),
      upsert: (r: Record<string, unknown>) => {
        if (name === "whatsapp_opt_outs")
          optOuts.push(r.whatsapp_number as string);
        if (name === "brain_unlock_followups") inserted.push(r as Row);
        return Promise.resolve({ error: null });
      },
      maybeSingle: () =>
        Promise.resolve({ data: source().find(match) ?? null }),
      then: (res: (v: { data: unknown; error: null }) => void) => {
        const hit = source().filter(match);
        if (patch !== null) for (const r of hit) Object.assign(r, patch);
        res({ data: hit, error: null });
      },
    };
    return q;
  };
  return { client: { from: table }, optOuts, inserted };
}

describe("markFollowup (Done / Skip / Stop)", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("@/lib/supabase/service");
    vi.doUnmock("@/features/live-classes/admin/data");
    vi.doUnmock("next/cache");
    vi.doUnmock("./settingsServer");
  });
  async function load(
    db: FakeDb,
    admin: string | null = "admin@x.in",
  ): Promise<typeof import("./admin/followupActions").markFollowup> {
    vi.resetModules();
    vi.doMock("@/lib/supabase/service", () => ({
      createServiceClient: () => db.client,
    }));
    vi.doMock("@/features/live-classes/admin/data", () => ({
      currentAdminEmail: () => Promise.resolve(admin),
    }));
    vi.doMock("next/cache", () => ({ revalidatePath: () => undefined }));
    vi.doMock("./settingsServer", () => ({
      getBrainUnlockSettings: () => Promise.resolve(DEFAULT_SETTINGS),
    }));
    return (await import("./admin/followupActions")).markFollowup;
  }
  const ID = "11111111-1111-4111-8111-111111111111";

  it("Done marks it sent and schedules the next step", async () => {
    const db = fakeDb(
      [{ id: ID, lead_id: "L1", step: "instant", status: "pending" }],
      [],
    );
    const res = await (await load(db))({ id: ID, action: "done" });
    expect(res.ok).toBe(true);
    expect(db.inserted.map((r) => r.step)).toEqual(["d1"]); // no demo video → +1 day next
  });
  it("Skip also schedules the next step; a second tap is refused", async () => {
    const db = fakeDb(
      [{ id: ID, lead_id: "L1", step: "d2", status: "pending" }],
      [],
    );
    const mark = await load(db);
    expect((await mark({ id: ID, action: "skip" })).ok).toBe(true);
    expect(db.inserted.map((r) => r.step)).toEqual(["d30"]);
    expect((await mark({ id: ID, action: "skip" })).ok).toBe(false);
  });
  it("Stop opts the number out and stops every pending step for it", async () => {
    const rows = [
      { id: ID, lead_id: "L1", step: "d1", status: "pending" },
      { id: "x2", lead_id: "L2", step: "instant", status: "pending" },
    ];
    const db = fakeDb(rows, [
      { id: "L1", whatsapp_number: "919812345678" },
      { id: "L2", whatsapp_number: "919812345678" },
    ]);
    expect((await (await load(db))({ id: ID, action: "stop" })).ok).toBe(true);
    expect(db.optOuts).toEqual(["919812345678"]);
    expect(rows.map((r) => r.status)).toEqual(["stopped", "stopped"]);
    expect(db.inserted).toEqual([]);
  });
  it("admins only", async () => {
    const db = fakeDb(
      [{ id: ID, lead_id: "L1", step: "instant", status: "pending" }],
      [],
    );
    expect((await (await load(db, null))({ id: ID, action: "done" })).ok).toBe(
      false,
    );
  });
});
