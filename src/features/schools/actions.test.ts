import { afterEach, describe, expect, it, vi } from "vitest";

type Inserted = { table: string; row: Record<string, unknown> };

async function load(opts: { insertError?: boolean; allowed?: boolean } = {}): Promise<{
  submit: typeof import("./actions").submitSchoolLead;
  inserted: Inserted[];
  emailed: unknown[];
  afterTasks: (() => Promise<void>)[];
}> {
  vi.resetModules();
  const inserted: Inserted[] = [];
  const emailed: unknown[] = [];
  const afterTasks: (() => Promise<void>)[] = [];
  vi.doMock("next/server", () => ({ after: (fn: () => Promise<void>) => afterTasks.push(fn) }));
  vi.doMock("@/lib/rateLimit", () => ({
    checkRateLimit: () => (opts.allowed === false ? { allowed: false, retryAfterMs: 1000 } : { allowed: true }),
    getClientIp: () => Promise.resolve("1.1.1.1"),
  }));
  vi.doMock("./email", () => ({ sendSchoolLeadNotification: (lead: unknown) => (emailed.push(lead), Promise.resolve(true)) }));
  // The visitor's own (anon) client — RLS applies; insert without a read-back.
  vi.doMock("@/lib/supabase/server", () => ({
    createClient: () =>
      Promise.resolve({
        from: (table: string) => ({
          insert: (row: Record<string, unknown>) => {
            inserted.push({ table, row });
            return Promise.resolve({ error: opts.insertError === true ? { code: "42501", message: "rls" } : null });
          },
        }),
      }),
  }));
  vi.doMock("@/lib/supabase/service", () => ({
    createServiceClient: () => {
      throw new Error("the form must not use the service role");
    },
  }));
  const { submitSchoolLead } = await import("./actions");
  return { submit: submitSchoolLead, inserted, emailed, afterTasks };
}

const form = {
  schoolName: "Sunrise Public School",
  city: "Vadodara",
  contactName: "A. Sharma",
  role: "principal",
  phone: "9876543210",
  email: "",
  students: "80",
  preferredMonth: "",
  message: "",
  website: "",
  lang: "en",
  utm: { utm_source: "google" },
};

afterEach(() => vi.resetModules());

describe("submitSchoolLead", () => {
  it("saves the lead to school_leads and emails Dr. Kapil after the response", async () => {
    const { submit, inserted, emailed, afterTasks } = await load();
    expect(await submit(form)).toEqual({ success: true });
    expect(inserted).toHaveLength(1);
    expect(inserted[0]?.table).toBe("school_leads");
    expect(inserted[0]?.row).toMatchObject({ school_name: "Sunrise Public School", phone: "+919876543210", students: 80, utm_source: "google", lang: "en" });
    expect(emailed).toHaveLength(0);
    for (const t of afterTasks) await t();
    expect(emailed).toHaveLength(1);
  });

  it("refuses a bad phone with the right message in each language, and saves nothing", async () => {
    const { submit, inserted } = await load();
    expect(await submit({ ...form, phone: "12345" })).toEqual({ success: false, error: "Please enter a valid 10-digit Indian mobile number." });
    expect(await submit({ ...form, phone: "12345", lang: "hi" })).toEqual({ success: false, error: "कृपया 10 अंकों का सही भारतीय mobile number लिखिए।" });
    expect(await submit({ ...form, schoolName: "", lang: "hi" })).toEqual({ success: false, error: "कृपया सारी ज़रूरी जानकारी भरिए।" });
    expect(inserted).toHaveLength(0);
  });

  it("pretends success for a bot (honeypot filled) and saves nothing", async () => {
    const { submit, inserted, afterTasks } = await load();
    expect(await submit({ ...form, website: "http://spam" })).toEqual({ success: true });
    expect(inserted).toHaveLength(0);
    expect(afterTasks).toHaveLength(0);
  });

  it("reports a failed save and sends no email", async () => {
    const { submit, afterTasks } = await load({ insertError: true });
    const r = await submit(form);
    expect(r.success).toBe(false);
    expect(afterTasks).toHaveLength(0);
  });

  it("stops after too many requests from one IP", async () => {
    const { submit, inserted } = await load({ allowed: false });
    expect((await submit(form)).success).toBe(false);
    expect(inserted).toHaveLength(0);
  });
});
