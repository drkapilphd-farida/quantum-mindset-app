import { afterEach, describe, expect, it, vi } from "vitest";
import { SchoolLeadSchema } from "./leadSchema";

const lead = SchoolLeadSchema.parse({
  schoolName: "Sunrise Public School",
  city: "Vadodara",
  contactName: "A. Sharma",
  role: "vice_principal",
  phone: "9876543210",
  email: "office@sunrise.example",
  students: 120,
  preferredMonth: "2027-01",
  message: "Class 8",
  lang: "hi",
  utm: { utm_source: "meta" },
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("School lead email", () => {
  it("has every field and a one-tap WhatsApp reply", async () => {
    const { schoolLeadEmail } = await import("./email");
    const { subject, text } = schoolLeadEmail(lead);
    expect(subject).toBe("New school pilot request — Sunrise Public School (Vadodara)");
    for (const part of ["Sunrise Public School", "Vadodara", "A. Sharma (Vice principal)", "+919876543210", "office@sunrise.example", "Students: 120", "January 2027", "Hindi", "Class 8", "utm_source=meta", "https://wa.me/919876543210?text=", "/admin/school-leads"])
      expect(text).toContain(part);
  });

  it("is sent to drkapilphd@gmail.com through Resend", async () => {
    const sent: { to: string; subject: string }[] = [];
    vi.doMock("resend", () => ({
      Resend: class {
        emails = { send: (m: { to: string; subject: string }) => (sent.push(m), Promise.resolve({ error: null })) };
      },
    }));
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("SCHOOL_LEAD_NOTIFY_EMAIL", undefined as unknown as string);
    const { sendSchoolLeadNotification } = await import("./email");
    expect(await sendSchoolLeadNotification(lead)).toBe(true);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.to).toBe("drkapilphd@gmail.com");
  });

  it("is skipped (never throws) without a Resend key, and on a Resend error", async () => {
    vi.doMock("resend", () => ({
      Resend: class {
        emails = { send: () => Promise.reject(new Error("down")) };
      },
    }));
    vi.stubEnv("RESEND_API_KEY", "");
    const { sendSchoolLeadNotification } = await import("./email");
    expect(await sendSchoolLeadNotification(lead)).toBe(false);
    vi.stubEnv("RESEND_API_KEY", "test-key");
    expect(await sendSchoolLeadNotification(lead)).toBe(false);
  });
});
