import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { deviceType } from "./device";
import { buildFunnel, type EventRow } from "./funnel";

describe("device type on every visit (founder, 17 Nov 2026)", () => {
  it.each([
    ["Mozilla/5.0 (Linux; Android 14; SM-A146B) AppleWebKit/537.36 Chrome/131 Mobile Safari/537.36", 0, "mobile"],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148", 5, "mobile"],
    ["Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 Chrome/131 Safari/537.36", 5, "tablet"],
    ["Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15", 5, "tablet"],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15", 5, "tablet"],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15", 0, "desktop"],
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36", 0, "desktop"],
  ] as const)("%s → %s", (ua, touch, want) => {
    expect(deviceType(ua, touch)).toBe(want);
  });

  it("every funnel event carries the device; /admin/brain-unlock-funnel splits by it", () => {
    expect(fs.readFileSync("src/features/brain-unlock/tracking.ts", "utf8")).toContain("device: currentDevice()");
    const ev = (s: string, event: string, device?: string): EventRow => ({
      session_id: s, event, role: "student", duo: false, data: device === undefined ? {} : { device }, utm_campaign: null, created_at: "2026-11-17T06:00:00Z",
    });
    const f = buildFunnel([ev("a", "landing", "mobile"), ev("a", "report_view", "mobile"), ev("b", "landing", "desktop"), ev("c", "landing")], new Set(), { campaign: null, role: null });
    expect(Object.fromEntries(f.byDevice.map((b) => [b.key, b.landed]))).toEqual({ mobile: 1, desktop: 1, "(not recorded)": 1 });
    expect(f.byDevice.find((b) => b.key === "mobile")?.reports).toBe(1);
  });
});

describe("WhatsApp-first migration", () => {
  const sql = fs.readFileSync("supabase/migrations/20261117000001_brain_unlock_whatsapp_first.sql", "utf8").replace(/--.*$/gm, "");
  it("the number may be empty only for Brain Unlock leads; the format check stays", () => {
    expect(sql).toMatch(/ALTER COLUMN whatsapp_number DROP NOT NULL/);
    expect(sql).toMatch(/CHECK \(whatsapp_number IS NOT NULL OR test_kind = 'brain_unlock'\)/);
    expect(sql).not.toMatch(/speed_test_results_whatsapp_number_check/);
  });
});
