import type { Metadata } from "next";
import Link from "next/link";
import { currentAdminEmail } from "@/features/live-classes/admin/data";
import {
  FOLLOWUP_VIEWS,
  inView,
  loadFollowups,
  type FollowupView,
} from "@/features/brain-unlock/admin/followupsData";
import { FollowupRow } from "@/features/brain-unlock/admin/FollowupRow";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Follow-ups — Admin",
  robots: { index: false, follow: false },
};

// Brain Unlock WhatsApp follow-ups, sent by hand (WhatsApp Business app):
// Instant, +1 hour, +1 day, +2 days, +30 days. Leads who bought Sharp Brain
// or were stopped never show.

const LABELS: Record<FollowupView, string> = {
  due: "Due now",
  today: "Today",
  overdue: "Overdue",
  all: "All pending",
};

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

export default async function FollowupsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}): Promise<React.JSX.Element> {
  if ((await currentAdminEmail()) === null) return <p>Not authorized.</p>;
  const sp = await searchParams;
  const viewParam = one(sp.view);
  const view: FollowupView = (FOLLOWUP_VIEWS as readonly string[]).includes(
    viewParam ?? "",
  )
    ? (viewParam as FollowupView)
    : "due";
  const campaign = one(sp.campaign) ?? "";
  const nowMs = Date.now();
  const { items, campaigns } = await loadFollowups(nowMs);
  const byCampaign = items.filter(
    (i) => campaign === "" || i.campaign === campaign,
  );
  const shown = byCampaign.filter((i) =>
    inView(view, Date.parse(i.dueAt), nowMs),
  );
  const href = (v: FollowupView, c: string): string => {
    const q = new URLSearchParams();
    if (v !== "due") q.set("view", v);
    if (c !== "") q.set("campaign", c);
    const s = q.toString();
    return s === "" ? "/admin/followups" : `/admin/followups?${s}`;
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">WhatsApp follow-ups</h1>
        <p className="text-sm text-muted-foreground">
          Brain Unlock leads. Tap <b>Send on WhatsApp</b> (the message is typed
          in for you), send it, then tap <b>Done</b> — the next step gets its
          time. Anyone who bought Sharp Brain or was stopped is left out.
        </p>
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="Filter">
        {FOLLOWUP_VIEWS.map((v) => (
          <Link
            key={v}
            href={href(v, campaign)}
            className={`rounded px-3 py-1 text-sm font-semibold ${view === v ? "bg-primary text-primary-foreground" : "border border-border"}`}
            data-followup-view={v}
          >
            {LABELS[v]} (
            {
              byCampaign.filter((i) => inView(v, Date.parse(i.dueAt), nowMs))
                .length
            }
            )
          </Link>
        ))}
      </nav>
      {campaigns.length > 0 && (
        <nav
          className="flex flex-wrap items-center gap-2 text-xs"
          aria-label="Campaign"
        >
          <span className="text-muted-foreground">Campaign:</span>
          {["", ...campaigns].map((c) => (
            <Link
              key={c || "all"}
              href={href(view, c)}
              className={`rounded px-2 py-0.5 ${campaign === c ? "bg-muted font-semibold" : "border border-border"}`}
            >
              {c === "" ? "All" : c}
            </Link>
          ))}
        </nav>
      )}
      {shown.length === 0 ? (
        <p className="rounded border border-border p-4 text-sm text-muted-foreground">
          Nothing here right now. 🎉
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((item) => (
            <FollowupRow key={item.id} item={item} nowMs={nowMs} />
          ))}
        </ul>
      )}
    </div>
  );
}
