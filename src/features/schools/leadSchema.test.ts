import { describe, expect, it } from "vitest";
import { leadRow, monthLabel, SchoolLeadSchema, upcomingMonths } from "./leadSchema";

const valid = {
  schoolName: "  Sunrise Public School ",
  city: "Vadodara",
  contactName: "A. Sharma",
  role: "principal",
  phone: "098765 43210",
  email: " Office@Sunrise.example ",
  students: "120",
  preferredMonth: "2026-12",
  message: "Class 8 and 9",
  lang: "hi",
  utm: { utm_source: "meta", utm_campaign: "schools", fbclid: "x" },
};

describe("Book a free pilot: validation", () => {
  it("accepts a full form and normalises it", () => {
    const r = SchoolLeadSchema.parse(valid);
    expect(r).toMatchObject({
      schoolName: "Sunrise Public School",
      phone: "+919876543210",
      email: "office@sunrise.example",
      students: 120,
      preferredMonth: "2026-12",
      message: "Class 8 and 9",
      lang: "hi",
    });
  });

  it("accepts only the required fields (email, students, month, message are optional)", () => {
    const r = SchoolLeadSchema.parse({ schoolName: "ABC School", city: "Pune", contactName: "Ravi", role: "teacher", phone: "9876543210", email: "", students: "", preferredMonth: "", message: "" });
    expect(r).toMatchObject({ email: null, students: null, preferredMonth: null, message: null, lang: "en" });
  });

  it.each([
    ["school name", { schoolName: "A" }],
    ["city", { city: "" }],
    ["contact name", { contactName: " " }],
    ["role", { role: "owner" }],
    ["phone (too short)", { phone: "98765" }],
    ["phone (landline / starts with 5)", { phone: "5876543210" }],
    ["email", { email: "not-an-email" }],
    ["students (0)", { students: "0" }],
    ["students (decimal)", { students: "12.5" }],
    ["month", { preferredMonth: "2026-13" }],
    ["message (too long)", { message: "x".repeat(1001) }],
  ])("refuses a bad %s", (_name, patch) => {
    expect(SchoolLeadSchema.safeParse({ ...valid, ...patch }).success).toBe(false);
  });

  it("maps to the school_leads row, keeping only utm_* keys", () => {
    const row = leadRow(SchoolLeadSchema.parse(valid));
    expect(row).toEqual({
      school_name: "Sunrise Public School",
      city: "Vadodara",
      contact_name: "A. Sharma",
      role: "principal",
      phone: "+919876543210",
      email: "office@sunrise.example",
      students: 120,
      preferred_month: "2026-12",
      message: "Class 8 and 9",
      lang: "hi",
      utm_source: "meta",
      utm_medium: null,
      utm_campaign: "schools",
      utm_term: null,
      utm_content: null,
    });
    expect(row).not.toHaveProperty("status");
    expect(row).not.toHaveProperty("notes");
  });
});

describe("Preferred month list", () => {
  it("is the next 12 months in IST, across the year end", () => {
    // 30 Nov 2026 20:00 UTC = 1 Dec 2026 01:30 IST.
    const months = upcomingMonths(new Date("2026-11-30T20:00:00Z"));
    expect(months).toHaveLength(12);
    expect(months[0]).toBe("2026-12");
    expect(months[1]).toBe("2027-01");
    expect(months[11]).toBe("2027-11");
  });
  it("labels months in English and Hindi", () => {
    expect(monthLabel("2026-12", "en")).toBe("December 2026");
    expect(monthLabel("2026-12", "hi")).toContain("2026");
    expect(monthLabel("2026-12", "hi")).toMatch(/[ऀ-ॿ]/);
  });
});
