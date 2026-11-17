"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setLeadPhone } from "./followupActions";

// A WhatsApp-only Brain Unlock lead ("via WhatsApp chat", founder 17 Nov
// 2026): find the chat with this Ref, then paste the number here — one field.
export function AddLeadNumber({ leadId, refCode }: { leadId: string; refCode: string }): React.JSX.Element {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <form
      className="flex flex-col gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        void (async () => {
          setBusy(true);
          const res = await setLeadPhone({ leadId, phone });
          setBusy(false);
          setMsg(res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error });
          if (res.ok) router.refresh();
        })();
      }}
      data-add-lead-number={leadId}
    >
      <span className="inline-flex w-fit items-center gap-1 rounded bg-[#dcfce7] px-2 py-0.5 text-xs font-bold text-[#166534]">
        via WhatsApp chat · Ref {refCode}
      </span>
      <span className="flex gap-1">
        <input
          type="tel"
          inputMode="tel"
          placeholder="Number from the chat"
          aria-label={`WhatsApp number for ${refCode}`}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-44 rounded border border-border bg-background px-2 py-1 text-sm"
        />
        <button type="submit" disabled={busy || phone.trim().length < 10} className="rounded bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {busy ? "Saving…" : "Add number"}
        </button>
      </span>
      {msg !== null && (
        <span role="status" className={`text-xs ${msg.ok ? "text-success" : "text-destructive"}`}>
          {msg.text}
        </span>
      )}
    </form>
  );
}
