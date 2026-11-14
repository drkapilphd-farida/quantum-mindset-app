import type { Metadata } from "next";
import { currentAdminEmail } from "@/features/live-classes/admin/data";
import {
  paidSessions,
  readEvents,
  readLeadDetails,
} from "@/features/brain-unlock/admin/data";
import {
  buildSetStats,
  type SetStatRow,
} from "@/features/brain-unlock/setStats";
import {
  buildFunnel,
  type Breakdown,
  type StepRow,
} from "@/features/brain-unlock/funnel";
import { DEFAULT_SETTINGS } from "@/features/brain-unlock/settings";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Brain Unlock funnel — Admin",
  robots: { index: false, follow: false },
};

const LABELS: Record<string, string> = {
  landing: "Landed on the page",
  role_picked: "Picked a role",
  duo_chosen: "Chose Duo Mode (parents)",
  started: "Started Brain Unlock",
  check_done: "Finished Brain Check",
  unlock_speed_done: "⚡ Speed unlocked",
  unlock_memory_done: "🧠 Memory unlocked",
  unlock_focus_done: "🎯 Focus unlocked",
  report_view: "Saw the report",
  whatsapp_submitted: "Sent WhatsApp number (lead)",
  share_clicked: "Shared",
  plan_clicked: "Clicked a plan",
  payment_success: "Paid for Sharp Brain",
};

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined): string =>
  Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
const istDate = (ms: number): string =>
  new Date(ms + 5.5 * 3_600_000).toISOString().slice(0, 10);

function StepTable({ rows }: { rows: StepRow[] }): React.JSX.Element {
  const max = Math.max(...rows.map((r) => r.sessions), 1);
  return (
    <table className="w-full min-w-[640px] text-sm">
      <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
        <tr>
          <th className="p-2">Step</th>
          <th className="p-2">People</th>
          <th className="p-2">of previous step</th>
          <th className="p-2">of landed</th>
          <th className="p-2 w-1/3" />
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={r.event}
            className="border-t border-border"
            data-funnel-step={r.event}
          >
            <td className="p-2 font-medium">{LABELS[r.event] ?? r.event}</td>
            <td className="p-2 tabular-nums">{r.sessions}</td>
            <td
              className={`p-2 tabular-nums ${r.ofPrevious !== null && r.ofPrevious < 60 ? "font-semibold text-destructive" : ""}`}
            >
              {r.ofPrevious === null
                ? "—"
                : `${r.ofPrevious}% (drop ${Math.round((100 - r.ofPrevious) * 10) / 10}%)`}
            </td>
            <td className="p-2 tabular-nums">
              {r.ofLanding === null ? "—" : `${r.ofLanding}%`}
            </td>
            <td className="p-2">
              <div
                className="h-2.5 rounded-full bg-primary"
                style={{ width: `${(r.sessions / max) * 100}%` }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BreakdownTable({
  title,
  rows,
}: {
  title: string;
  rows: Breakdown[];
}): React.JSX.Element {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
            <tr>
              <th className="p-2">{title.replace("By ", "")}</th>
              <th className="p-2">Landed</th>
              <th className="p-2">Report</th>
              <th className="p-2">Leads</th>
              <th className="p-2">Lead %</th>
              <th className="p-2">Plan clicks</th>
              <th className="p-2">Paid</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="p-2 text-muted-foreground" colSpan={7}>
                  No data yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-border">
                <td className="p-2 font-medium">{r.key}</td>
                <td className="p-2 tabular-nums">{r.landed}</td>
                <td className="p-2 tabular-nums">{r.reports}</td>
                <td className="p-2 tabular-nums">{r.leads}</td>
                <td className="p-2 tabular-nums">
                  {r.landed === 0
                    ? "—"
                    : `${Math.round((r.leads / r.landed) * 1000) / 10}%`}
                </td>
                <td className="p-2 tabular-nums">{r.plans}</td>
                <td className="p-2 tabular-nums">{r.paid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SetTable({
  title,
  unit,
  rows,
}: {
  title: string;
  unit: string;
  rows: SetStatRow[];
}): React.JSX.Element {
  const withWpm = rows.some((r) => r.wpm !== null);
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm" data-set-table={title}>
        <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
          <tr>
            <th className="p-2">{title}</th>
            <th className="p-2">People</th>
            <th className="p-2">Average {unit}</th>
            {withWpm && <th className="p-2">Avg WPM</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="p-2 text-muted-foreground" colSpan={4}>
                No data yet.
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr
              key={r.id}
              className={`border-t border-border ${r.harder ? "bg-amber-50" : ""}`}
            >
              <td className="p-2 font-medium">
                {r.id}
                {r.harder && (
                  <span className="ml-2 text-xs font-semibold text-amber-800">
                    ⚠ looks harder
                  </span>
                )}
              </td>
              <td className="p-2 tabular-nums">{r.n}</td>
              <td className="p-2 tabular-nums">
                {unit === "/5" ? `${r.avg}/5` : `${Math.round(r.avg)}%`}
              </td>
              {withWpm && <td className="p-2 tabular-nums">{r.wpm ?? "—"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function BrainUnlockFunnelPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}): Promise<React.JSX.Element> {
  if ((await currentAdminEmail()) === null) return <p>Not authorized.</p>;
  const sp = await searchParams;
  const now = Date.now();
  const from = /^\d{4}-\d{2}-\d{2}$/.test(one(sp.from))
    ? one(sp.from)
    : istDate(now - 13 * 86_400_000);
  const to = /^\d{4}-\d{2}-\d{2}$/.test(one(sp.to)) ? one(sp.to) : istDate(now);
  const campaign = one(sp.campaign).trim() || null;
  const role = ["parent", "student", "professional"].includes(one(sp.role))
    ? one(sp.role)
    : null;
  const fromIso = new Date(`${from}T00:00:00+05:30`).toISOString();
  const toIso = new Date(
    new Date(`${to}T00:00:00+05:30`).getTime() + 86_400_000,
  ).toISOString();

  const [{ rows, truncated }, paid, leadDetails] = await Promise.all([
    readEvents(fromIso, toIso),
    paidSessions(fromIso, toIso),
    readLeadDetails(fromIso, toIso),
  ]);
  const sets = buildSetStats(leadDetails);
  const f = buildFunnel(rows, paid, { campaign, role });
  const campaigns = [
    ...new Set(rows.map((r) => r.utm_campaign ?? "(none)")),
  ].sort();
  const typeName = (t: string): string => {
    const bt =
      DEFAULT_SETTINGS.brainTypes[
        t as keyof typeof DEFAULT_SETTINGS.brainTypes
      ];
    return bt === undefined ? t : `${bt.emoji} ${bt.en.name}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Brain Unlock funnel</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Where people drop off, step by step (unique visitors; a reload never
          counts twice). Dates are IST. Paid = a Brain Unlock lead whose phone
          or email later paid for Sharp Brain.
        </p>
      </div>

      <form
        className="flex flex-wrap items-end gap-3 rounded-md border border-border p-3 text-sm"
        method="get"
      >
        <label className="flex flex-col gap-1">
          From
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="rounded border border-border bg-background px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          To
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="rounded border border-border bg-background px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          Campaign
          <select
            name="campaign"
            defaultValue={campaign ?? ""}
            className="rounded border border-border bg-background px-2 py-1"
          >
            <option value="">All</option>
            {campaigns.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          Role
          <select
            name="role"
            defaultValue={role ?? ""}
            className="rounded border border-border bg-background px-2 py-1"
          >
            <option value="">All</option>
            <option value="parent">Parent</option>
            <option value="student">Student</option>
            <option value="professional">Professional</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded bg-primary px-4 py-1.5 font-semibold text-primary-foreground"
        >
          Show
        </button>
      </form>
      {truncated && (
        <p className="text-sm font-semibold text-destructive">
          Showing the first 50,000 events only — pick a shorter date range.
        </p>
      )}

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Funnel</h2>
        <div className="overflow-x-auto rounded-md border border-border">
          <StepTable rows={f.steps} />
        </div>
        <p className="text-xs text-muted-foreground">
          Side steps:{" "}
          {f.side.map((s) => `${LABELS[s.event]} ${s.sessions}`).join(" · ")} ·
          Duo sessions {f.duoSessions}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border p-4">
          <p className="text-xs text-muted-foreground">
            ⚡ Reading speed (counted runs, n = {f.averages.speed.n})
          </p>
          <p className="text-xl font-semibold tabular-nums">
            {f.averages.speed.before} → {f.averages.speed.after} WPM
          </p>
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-xs text-muted-foreground">
            🧠 Memory (n = {f.averages.memory.n})
          </p>
          <p className="text-xl font-semibold tabular-nums">
            {f.averages.memory.before}/5 → {f.averages.memory.after}/5
          </p>
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-xs text-muted-foreground">
            🎯 Focus grid (n = {f.averages.focus.n})
          </p>
          <p className="text-xl font-semibold tabular-nums">
            {f.averages.focus.beforeS}s → {f.averages.focus.afterS}s
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Brain Types</h2>
        <ul className="flex flex-wrap gap-2 text-sm">
          {f.brainTypes.length === 0 && (
            <li className="text-muted-foreground">No reports yet.</li>
          )}
          {f.brainTypes.map((t) => (
            <li
              key={t.type}
              className="rounded-full border border-border px-3 py-1"
            >
              {typeName(t.type)} ·{" "}
              <strong className="tabular-nums">{t.count}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2" data-set-stats>
        <h2 className="text-lg font-semibold">Word sets and passages</h2>
        <p className="text-xs text-muted-foreground">
          Average score per set (leads in this date range). A set with at least
          5 people and 15% or more below the overall average is marked.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SetTable title="Brain Check set" unit="/5" rows={sets.check} />
          <SetTable title="Story set" unit="/5" rows={sets.story} />
          <SetTable
            title="Brain Check passage"
            unit="% right"
            rows={sets.checkPassage}
          />
          <SetTable
            title="Speed (RSVP) passage"
            unit="% right"
            rows={sets.sharpPassage}
          />
        </div>
      </section>

      <BreakdownTable title="By campaign" rows={f.byCampaign} />
      <BreakdownTable title="By role" rows={f.byRole} />
    </div>
  );
}
