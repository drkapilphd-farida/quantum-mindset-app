// Server only (service role): the school leads for /admin/school-leads and its CSV export.
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";
import { utmToLine } from "@/lib/analytics/utmLine";
import { isSchoolLeadStatus, type SchoolLeadRecord } from "../leadStatus";

type Row = {
  id: string;
  created_at: string;
  school_name: string;
  city: string;
  contact_name: string;
  role: string;
  phone: string;
  email: string | null;
  students: number | null;
  preferred_month: string | null;
  message: string | null;
  lang: string;
  status: string;
  notes: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
};

export function toRecord(r: Row): SchoolLeadRecord {
  const utm = Object.fromEntries(
    (["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const).map((k) => [k, r[k] ?? ""]),
  );
  return {
    id: r.id,
    createdAt: r.created_at,
    schoolName: r.school_name,
    city: r.city,
    contactName: r.contact_name,
    role: r.role,
    phone: r.phone,
    email: r.email,
    students: r.students,
    preferredMonth: r.preferred_month,
    message: r.message,
    lang: r.lang,
    status: isSchoolLeadStatus(r.status) ? r.status : "new",
    notes: r.notes,
    utm: utmToLine(utm),
  };
}

/** Newest first. Never throws: an error shows an empty list (and is logged). */
export async function listSchoolLeads(): Promise<SchoolLeadRecord[]> {
  const { data, error } = await createServiceClient()
    .from("school_leads")
    .select(
      "id, created_at, school_name, city, contact_name, role, phone, email, students, preferred_month, message, lang, status, notes, utm_source, utm_medium, utm_campaign, utm_term, utm_content",
    )
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) {
    logger.warn("[school-leads] list failed", { code: error.code });
    return [];
  }
  return ((data ?? []) as Row[]).map(toRecord);
}
