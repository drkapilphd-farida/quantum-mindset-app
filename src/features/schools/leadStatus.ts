// School lead statuses (admin /admin/school-leads) and the record shape the
// admin page works with. Pure — shared by the server and the client table.
export const SCHOOL_LEAD_STATUSES = ["new", "contacted", "pilot_booked", "camp", "program", "not_now"] as const;
export type SchoolLeadStatus = (typeof SCHOOL_LEAD_STATUSES)[number];

export const SCHOOL_LEAD_STATUS_LABELS: Record<SchoolLeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  pilot_booked: "Pilot booked",
  camp: "Camp",
  program: "Program",
  not_now: "Not now",
};

export const isSchoolLeadStatus = (v: string): v is SchoolLeadStatus =>
  (SCHOOL_LEAD_STATUSES as readonly string[]).includes(v);

export type SchoolLeadRecord = {
  id: string;
  createdAt: string;
  schoolName: string;
  city: string;
  contactName: string;
  role: string;
  phone: string;
  email: string | null;
  students: number | null;
  preferredMonth: string | null;
  message: string | null;
  lang: string;
  status: SchoolLeadStatus;
  notes: string | null;
  /** "utm_source=meta, utm_campaign=…" or null. */
  utm: string | null;
};
