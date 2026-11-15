import fs from "node:fs";
import { describe, expect, it } from "vitest";

// RLS shape of school_leads (founder brief: "insert only from the form; read
// only by admin"). The live check against a real database is in the staging
// e2e (anon read returns nothing; a crafted status/notes insert is refused).
const sql = fs.readFileSync("supabase/migrations/20261115000001_school_leads.sql", "utf8");
const code = sql.replace(/--.*$/gm, "");

describe("20261115000001_school_leads migration", () => {
  it("turns RLS on for both tables", () => {
    expect(code).toMatch(/ALTER TABLE public\.school_leads ENABLE ROW LEVEL SECURITY/);
    expect(code).toMatch(/ALTER TABLE public\.school_page_settings ENABLE ROW LEVEL SECURITY/);
  });

  it("has exactly one policy: INSERT on school_leads, only as a new lead without notes", () => {
    const policies = [...code.matchAll(/CREATE POLICY[\s\S]*?;/g)].map((m) => m[0]);
    expect(policies).toHaveLength(1);
    expect(policies[0]).toMatch(/ON public\.school_leads\s+FOR INSERT\s+TO anon, authenticated\s+WITH CHECK \(status = 'new' AND notes IS NULL\)/);
    expect(code).not.toMatch(/FOR (SELECT|UPDATE|DELETE|ALL)/);
    expect(code).not.toMatch(/GRANT /i);
  });

  it("has the six admin statuses", () => {
    expect(code).toContain("status IN ('new', 'contacted', 'pilot_booked', 'camp', 'program', 'not_now')");
  });

  it("is add-only (no DROP / ALTER of existing tables)", () => {
    expect(code).not.toMatch(/\bDROP\b/i);
    expect(code.match(/ALTER TABLE public\.(\w+)/g)?.every((m) => /school_leads|school_page_settings/.test(m))).toBe(true);
  });
});
