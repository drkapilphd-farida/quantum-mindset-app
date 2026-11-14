"use client";

import { useState } from "react";
import type { BuSettings } from "../settings";
import { saveBrainUnlockSettings, stopFollowupsForNumber } from "./actions";

// The founder's Brain Unlock settings form. Simple fields for everyday
// changes; score bands, Brain Types and goals as checked JSON (an invalid
// value is refused with the field name — the live page never breaks).

const input =
  "w-full rounded border border-border bg-background px-2 py-1.5 text-sm";
const label = "flex flex-col gap-1 text-sm font-medium";

export function SettingsForm({
  initial,
  followupPreview,
}: {
  initial: BuSettings;
  followupPreview: { step: string; text: string | null }[];
}): React.JSX.Element {
  const [s, setS] = useState<BuSettings>(initial);
  const [json, setJson] = useState({
    scoring: JSON.stringify(initial.scoring, null, 2),
    brainTypes: JSON.stringify(initial.brainTypes, null, 2),
    goals: JSON.stringify(initial.goals, null, 2),
  });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [stopPhone, setStopPhone] = useState("");
  const [stopMsg, setStopMsg] = useState<string | null>(null);

  async function save(): Promise<void> {
    setSaving(true);
    setMsg(null);
    let advanced: Pick<BuSettings, "scoring" | "brainTypes" | "goals">;
    try {
      advanced = {
        scoring: JSON.parse(json.scoring) as BuSettings["scoring"],
        brainTypes: JSON.parse(json.brainTypes) as BuSettings["brainTypes"],
        goals: JSON.parse(json.goals) as BuSettings["goals"],
      };
    } catch {
      setSaving(false);
      setMsg({ ok: false, text: "One of the JSON boxes is not valid JSON." });
      return;
    }
    const res = await saveBrainUnlockSettings({ ...s, ...advanced });
    setSaving(false);
    setMsg(
      res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error },
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Videos (YouTube unlisted IDs, 11 characters; empty = hidden)
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className={label}>
            15-sec intro video (screen 1)
            <input
              className={input}
              value={s.introVideoId}
              onChange={(e) => setS({ ...s, introVideoId: e.target.value })}
            />
          </label>
          <label className={label}>
            Demo video (+1 hour WhatsApp)
            <input
              className={input}
              value={s.demoVideoId}
              onChange={(e) => setS({ ...s, demoVideoId: e.target.value })}
            />
          </label>
          <label className={label}>
            Parent review (Ruchi ji)
            <input
              className={input}
              value={s.reviewVideoIds.parent}
              onChange={(e) =>
                setS({
                  ...s,
                  reviewVideoIds: {
                    ...s.reviewVideoIds,
                    parent: e.target.value,
                  },
                })
              }
            />
          </label>
          <label className={label}>
            Student review (Daksh)
            <input
              className={input}
              value={s.reviewVideoIds.student}
              onChange={(e) =>
                setS({
                  ...s,
                  reviewVideoIds: {
                    ...s.reviewVideoIds,
                    student: e.target.value,
                  },
                })
              }
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Real numbers strip (one per line — real students only)
        </h2>
        <textarea
          className={`${input} h-24 font-mono`}
          value={s.numbersStrip.join("\n")}
          onChange={(e) =>
            setS({
              ...s,
              numbersStrip: e.target.value
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean),
            })
          }
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Next live batch (real values only; empty = hidden)
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <label className={label}>
            Start date
            <input
              type="date"
              className={input}
              value={s.nextBatch.date}
              onChange={(e) =>
                setS({
                  ...s,
                  nextBatch: { ...s.nextBatch, date: e.target.value },
                })
              }
            />
          </label>
          <label className={label}>
            Seats left (empty = not shown)
            <input
              type="number"
              min={0}
              className={input}
              value={s.nextBatch.seatsLeft ?? ""}
              onChange={(e) =>
                setS({
                  ...s,
                  nextBatch: {
                    ...s.nextBatch,
                    seatsLeft:
                      e.target.value === ""
                        ? null
                        : Math.max(0, Math.round(Number(e.target.value))),
                  },
                })
              }
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          WhatsApp follow-ups (sent by you)
        </h2>
        <p className="text-sm text-muted-foreground">
          Nothing is sent automatically. Due messages wait in{" "}
          <a className="font-semibold underline" href="/admin/followups">
            /admin/followups
          </a>{" "}
          with a one-tap “Send on WhatsApp” button. Steps turned off here are
          skipped.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {(["enabled", "instant", "h1", "d1", "d2", "d30"] as const).map(
            (k) => (
              <label key={k} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={s.followups[k]}
                  onChange={(e) =>
                    setS({
                      ...s,
                      followups: { ...s.followups, [k]: e.target.checked },
                    })
                  }
                />
                {
                  {
                    enabled: "All on",
                    instant: "Instant report",
                    h1: "+1 hour demo",
                    d1: "+1 day review",
                    d2: "+2 days offer",
                    d30: "+30 days retake",
                  }[k]
                }
              </label>
            ),
          )}
        </div>
        <details className="rounded border border-border p-3 text-sm">
          <summary className="cursor-pointer font-medium">
            Preview the messages (sample lead)
          </summary>
          {followupPreview.map((p) => (
            <div key={p.step} className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground">
                {p.step}
              </p>
              <pre className="whitespace-pre-wrap rounded bg-muted/50 p-2 text-xs">
                {p.text ?? "(skipped: no video set)"}
              </pre>
            </div>
          ))}
        </details>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Score bands, Brain Types, Day-30 goals (JSON)
        </h2>
        {(["scoring", "brainTypes", "goals"] as const).map((k) => (
          <label key={k} className={label}>
            {k}
            <textarea
              className={`${input} h-56 font-mono text-xs`}
              value={json[k]}
              onChange={(e) => setJson({ ...json, [k]: e.target.value })}
              spellCheck={false}
            />
          </label>
        ))}
      </section>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-border bg-background py-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="rounded bg-primary px-5 py-2 font-semibold text-primary-foreground disabled:opacity-50"
          data-bu-save
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        {msg !== null && (
          <p
            className={`text-sm ${msg.ok ? "text-foreground" : "font-semibold text-destructive"}`}
          >
            {msg.text}
          </p>
        )}
      </div>

      <section className="space-y-2 rounded border border-border p-3">
        <h2 className="text-base font-semibold">
          Stop follow-ups for a number
        </h2>
        <p className="text-xs text-muted-foreground">
          If someone replies STOP (or asks you to stop), add their number here
          (or tap “Stop” on their row in /admin/followups).
        </p>
        <div className="flex gap-2">
          <input
            className={input}
            placeholder="98xxxxxxxx"
            value={stopPhone}
            onChange={(e) => setStopPhone(e.target.value)}
          />
          <button
            type="button"
            className="rounded border border-border px-3 text-sm font-semibold"
            onClick={() =>
              void stopFollowupsForNumber({ phone: stopPhone }).then((r) => {
                setStopMsg(r.ok ? r.message : r.error);
                if (r.ok) setStopPhone("");
              })
            }
          >
            Stop
          </button>
        </div>
        {stopMsg !== null && <p className="text-sm">{stopMsg}</p>}
      </section>
    </div>
  );
}
