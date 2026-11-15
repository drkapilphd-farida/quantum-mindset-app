import { SCHOOLS_COPY } from "./copy";
import { SCHOOL_LEAD_STATUS_LABELS, type SchoolLeadRecord } from "./leadStatus";

// CSV of the school leads (admin export). Cells are quoted; a leading
// = + - @ is escaped so a spreadsheet never runs it as a formula.
const cell = (value: string): string => {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

export function schoolLeadsCsv(rows: readonly SchoolLeadRecord[]): string {
  const header = [
    "Date (IST)",
    "School",
    "City",
    "Contact",
    "Role",
    "Phone",
    "Email",
    "Students",
    "Preferred month",
    "Message",
    "Status",
    "Notes",
    "Language",
    "UTM",
  ];
  const lines = rows.map((r) =>
    [
      new Date(r.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      r.schoolName,
      r.city,
      r.contactName,
      SCHOOLS_COPY.en.form.roles[r.role as keyof typeof SCHOOLS_COPY.en.form.roles] ?? r.role,
      r.phone,
      r.email ?? "",
      r.students === null ? "" : String(r.students),
      r.preferredMonth ?? "",
      r.message ?? "",
      SCHOOL_LEAD_STATUS_LABELS[r.status],
      r.notes ?? "",
      r.lang,
      r.utm ?? "",
    ]
      .map(cell)
      .join(","),
  );
  return [header.map(cell).join(","), ...lines].join("\n") + "\n";
}
