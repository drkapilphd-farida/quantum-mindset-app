"use client";

import { useState } from "react";
import { SCHOOLS_COPY } from "../copy";
import { monthLabel } from "../leadSchema";
import {
  SCHOOL_LEAD_STATUSES,
  SCHOOL_LEAD_STATUS_LABELS,
  type SchoolLeadRecord,
  type SchoolLeadStatus,
} from "../leadStatus";
import { updateSchoolLead } from "./actions";

// /admin/school-leads: one card per school. Status saves at once; notes save
// with their own button. Filter by status; the CSV link exports everything.

const field = "rounded-md border border-input bg-background px-3 py-2 text-sm";

function LeadCard({ lead }: { lead: SchoolLeadRecord }): React.JSX.Element {
  const [status, setStatus] = useState<SchoolLeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saved, setSaved] = useState(lead.notes ?? "");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(patch: { status?: SchoolLeadStatus; notes?: string }): Promise<void> {
    setBusy(true);
    setMsg(null);
    const res = await updateSchoolLead({ id: lead.id, ...patch });
    setBusy(false);
    setMsg(res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error });
    if (!res.ok && patch.status !== undefined) setStatus(lead.status);
    if (res.ok && patch.notes !== undefined) setSaved(patch.notes);
  }

  const role = SCHOOLS_COPY.en.form.roles[lead.role as keyof typeof SCHOOLS_COPY.en.form.roles] ?? lead.role;
  return (
    <li className="flex flex-col gap-3 rounded-lg border p-4" data-school-lead={lead.id}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold">{lead.schoolName}</p>
          <p className="text-sm text-muted-foreground">
            {lead.city} · {new Date(lead.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
            {lead.lang === "hi" ? " · Hindi page" : ""}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="sr-only">Status</span>
          <select
            className={field}
            value={status}
            disabled={busy}
            data-school-lead-status
            onChange={(e) => {
              const next = e.target.value as SchoolLeadStatus;
              setStatus(next);
              void save({ status: next });
            }}
          >
            {SCHOOL_LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {SCHOOL_LEAD_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <div>
          <dt className="inline text-muted-foreground">Contact: </dt>
          <dd className="inline">
            {lead.contactName} ({role})
          </dd>
        </div>
        <div>
          <dt className="inline text-muted-foreground">WhatsApp: </dt>
          <dd className="inline">
            <a className="underline" href={`https://wa.me/${lead.phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer">
              {lead.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="inline text-muted-foreground">Email: </dt>
          <dd className="inline">{lead.email ?? "—"}</dd>
        </div>
        <div>
          <dt className="inline text-muted-foreground">Students: </dt>
          <dd className="inline">{lead.students ?? "—"}</dd>
        </div>
        <div>
          <dt className="inline text-muted-foreground">Preferred month: </dt>
          <dd className="inline">{lead.preferredMonth === null ? "Not sure yet" : monthLabel(lead.preferredMonth, "en")}</dd>
        </div>
        {lead.utm !== null && (
          <div>
            <dt className="inline text-muted-foreground">UTM: </dt>
            <dd className="inline break-all">{lead.utm}</dd>
          </div>
        )}
      </dl>
      {lead.message !== null && <p className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{lead.message}</p>}
      <div className="flex flex-col gap-2">
        <label htmlFor={`notes-${lead.id}`} className="text-sm font-medium">
          Notes
        </label>
        <textarea
          id={`notes-${lead.id}`}
          className={`${field} min-h-20`}
          maxLength={4000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          data-school-lead-notes
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            disabled={busy || notes === saved}
            onClick={() => void save({ notes })}
            data-school-lead-save-notes
          >
            Save notes
          </button>
          {msg !== null && (
            <span role="status" className={`text-sm ${msg.ok ? "text-success" : "text-destructive"}`}>
              {msg.text}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export function SchoolLeadsTable({ rows }: { rows: SchoolLeadRecord[] }): React.JSX.Element {
  const [filter, setFilter] = useState<SchoolLeadStatus | "all">("all");
  const counts = Object.fromEntries(SCHOOL_LEAD_STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length])) as Record<SchoolLeadStatus, number>;
  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["all", ...SCHOOL_LEAD_STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`rounded-full border px-3 py-1 text-sm ${filter === s ? "bg-primary text-primary-foreground" : ""}`}
          >
            {s === "all" ? `All (${rows.length})` : `${SCHOOL_LEAD_STATUS_LABELS[s]} (${counts[s]})`}
          </button>
        ))}
        <a href="/admin/school-leads/export" className="ml-auto rounded-md border px-3 py-1.5 text-sm font-medium" data-school-leads-export>
          Export CSV
        </a>
      </div>
      {shown.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">No school leads here yet.</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </ul>
      )}
    </div>
  );
}
