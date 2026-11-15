import { describe, expect, it } from "vitest";
import { schoolLeadsCsv } from "./csv";
import type { SchoolLeadRecord } from "./leadStatus";

const row: SchoolLeadRecord = {
  id: "00000000-0000-4000-8000-000000000001",
  createdAt: "2026-11-15T06:30:00Z",
  schoolName: 'Sunrise "Public" School',
  city: "Vadodara",
  contactName: "=HYPERLINK(1)",
  role: "principal",
  phone: "+919876543210",
  email: null,
  students: 120,
  preferredMonth: "2026-12",
  message: "line 1\nline 2",
  lang: "hi",
  status: "pilot_booked",
  notes: "Call Monday",
  utm: "utm_source=meta",
};

describe("school leads CSV", () => {
  it("has a header, quoted cells, status labels and formula-safe values", () => {
    const csv = schoolLeadsCsv([row]);
    const [header] = csv.split("\n");
    expect(header).toBe('"Date (IST)","School","City","Contact","Role","Phone","Email","Students","Preferred month","Message","Status","Notes","Language","UTM"');
    expect(csv).toContain('"Sunrise ""Public"" School"');
    expect(csv).toContain(`"'=HYPERLINK(1)"`);
    expect(csv).toContain('"Principal"');
    expect(csv).toContain('"Pilot booked"');
    expect(csv).toContain('"\'+919876543210"');
    expect(csv.endsWith("\n")).toBe(true);
  });
});
