"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STEP_LABELS } from "../followups";
import type { FollowupItem } from "./followupsData";
import { markFollowup } from "./followupActions";

// One follow-up: who, their numbers, the step, the message — and the buttons.
// "Send on WhatsApp" opens wa.me/<their number> with the message typed in
// (WhatsApp Business app / web); after sending, tap Done.

const btn =
  "rounded border border-border px-3 py-1.5 text-sm font-semibold disabled:opacity-50";

const when = (iso: string): string =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

export function FollowupRow({
  item,
  nowMs,
}: {
  item: FollowupItem;
  nowMs: number;
}): React.JSX.Element {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [handled, setHandled] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const due = Date.parse(item.dueAt);
  const overdue = due < nowMs - 60 * 60_000;

  const act = async (action: "done" | "skip" | "stop"): Promise<void> => {
    if (
      action === "stop" &&
      !window.confirm(`Stop all follow-ups to ${item.name}?`)
    )
      return;
    setPending(true);
    const res = await markFollowup({ id: item.id, action });
    setPending(false);
    setMsg(res.ok ? res.message : res.error);
    // Handled: fold the row at once; the refreshed list then drops it.
    if (res.ok) setHandled(true);
    router.refresh();
  };

  if (handled)
    return (
      <li
        className="rounded-lg border border-border p-3 text-sm text-muted-foreground"
        data-followup-handled
      >
        {item.name} · {STEP_LABELS[item.step]} — {msg}
      </li>
    );

  return (
    <li
      className="flex flex-col gap-2 rounded-lg border border-border p-3"
      data-followup={item.step}
      data-followup-lead={item.leadId}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
          {STEP_LABELS[item.step]}
        </span>
        <span className="font-semibold">{item.name}</span>
        <span className="text-xs text-muted-foreground">
          {item.role} · {item.lang.toUpperCase()}
          {item.campaign !== null && item.campaign !== ""
            ? ` · ${item.campaign}`
            : ""}
        </span>
        <span
          className={`ml-auto text-xs ${overdue ? "font-semibold text-destructive" : "text-muted-foreground"}`}
        >
          {due <= nowMs ? (overdue ? "Overdue since " : "Due ") : "Due at "}
          {when(item.dueAt)}
        </span>
      </div>
      <p className="text-sm">
        {item.brainType}
        {item.score !== null ? ` · ${item.score}/100` : ""}
        {item.numbers.length > 0 ? ` · ${item.numbers.join(" · ")}` : ""}
      </p>
      {item.text !== null ? (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground">
            Message
          </summary>
          <pre
            className="mt-1 whitespace-pre-wrap rounded bg-muted/50 p-2"
            lang={item.lang}
          >
            {item.text}
          </pre>
        </details>
      ) : (
        <p className="text-xs text-muted-foreground">
          Nothing to send for this step (e.g. no video set) — tap Skip.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {item.wa !== null && (
          <a
            href={item.wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpened(true)}
            className="rounded bg-[#0b7a3e] px-3 py-1.5 text-sm font-bold text-white"
            data-followup-wa
          >
            Send on WhatsApp
          </a>
        )}
        <button
          type="button"
          className={`${btn} ${opened ? "border-[#0b7a3e] bg-[#0b7a3e]/10" : ""}`}
          disabled={pending}
          onClick={() => void act("done")}
          data-followup-done
        >
          ✓ Done
        </button>
        <button
          type="button"
          className={btn}
          disabled={pending}
          onClick={() => void act("skip")}
        >
          Skip
        </button>
        <button
          type="button"
          className={btn}
          disabled={pending}
          onClick={() => void act("stop")}
        >
          Stop
        </button>
      </div>
      {msg !== null && <p className="text-xs">{msg}</p>}
    </li>
  );
}
