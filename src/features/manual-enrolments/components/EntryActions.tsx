"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  checkManualAccess,
  deleteManualEnrolment,
  updateManualEnrolment,
} from "../actions";
import { AccessVerdictNote } from "./AccessVerdictNote";
import {
  PAYMENT_MODE_LABEL,
  PAYMENT_MODES,
  SEAT_LABEL,
  SEAT_OFFERS,
  type AccessVerdict,
  type PaymentMode,
  type SeatOffer,
} from "../rules";
import { RefundButton } from "./RefundButton";

type Entry = {
  id: string;
  amountInr: number | null;
  mode: PaymentMode;
  paidOn: string;
  offer: SeatOffer | null;
  refunded: boolean;
  inWindow: boolean;
};

const field =
  "min-h-9 rounded-md border border-border bg-background px-2 text-sm";

// Per entry: Edit (amount, mode, date, seat), Delete (entered by mistake —
// two taps; not a refund) and Refund.
export function EntryActions({
  entry,
  today,
}: {
  entry: Entry;
  today: string;
}): React.JSX.Element {
  const [mode, setMode] = useState<"idle" | "edit" | "delete">("idle");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [access, setAccess] = useState<AccessVerdict | null>(null);
  const [form, setForm] = useState({
    amount: String(entry.amountInr ?? ""),
    payMode: entry.mode,
    paidOn: entry.paidOn,
    seat: (entry.offer ?? "") as string,
  });

  if (mode === "edit")
    return (
      <form
        className="flex min-w-64 flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const res = await updateManualEnrolment({
              id: entry.id,
              amountInr: Number(form.amount.replace(/[^\d]/g, "")),
              mode: form.payMode,
              paidOn: form.paidOn,
              offer: form.seat === "" ? null : (form.seat as SeatOffer),
            });
            if (res.ok) setMode("idle");
            else setError(res.error);
          });
        }}
        data-manual-edit-form={entry.id}
      >
        <input
          inputMode="numeric"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          aria-label="Amount (₹)"
          className={field}
          data-manual-edit-amount="true"
        />
        <div className="flex gap-1">
          {PAYMENT_MODES.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={form.payMode === m}
              onClick={() => setForm((f) => ({ ...f, payMode: m }))}
              className={`min-h-9 flex-1 rounded-md border px-1 text-xs ${form.payMode === m ? "border-primary bg-primary/10 font-semibold" : "border-border"}`}
              data-manual-edit-mode={m}
            >
              {PAYMENT_MODE_LABEL[m]}
            </button>
          ))}
        </div>
        <input
          type="date"
          max={today}
          value={form.paidOn}
          onChange={(e) => setForm((f) => ({ ...f, paidOn: e.target.value }))}
          aria-label="Payment date"
          className={field}
        />
        <select
          value={form.seat}
          onChange={(e) => setForm((f) => ({ ...f, seat: e.target.value }))}
          aria-label="Seat"
          className={field}
        >
          {SEAT_OFFERS.map((o) => (
            <option key={o} value={o}>
              {SEAT_LABEL[o]}
            </option>
          ))}
          <option value="">{SEAT_LABEL.none}</option>
        </select>
        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={pending}
            data-manual-edit-save="true"
          >
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setMode("idle")}
          >
            Cancel
          </Button>
        </div>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </form>
    );

  if (mode === "delete")
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const res = await deleteManualEnrolment({ id: entry.id });
              if (!res.ok) setError(res.error);
            })
          }
          data-manual-delete-confirm={entry.id}
        >
          {pending ? "Deleting…" : "Confirm delete (entered by mistake)"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setMode("idle")}>
          Cancel
        </Button>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setMode("edit")}
          data-manual-edit={entry.id}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setMode("delete")}
          data-manual-delete={entry.id}
        >
          Delete
        </Button>
        {!entry.refunded && (
          <RefundButton id={entry.id} inWindow={entry.inWindow} />
        )}
        {!entry.refunded && (
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() =>
              start(async () => {
                setError(null);
                setAccess(null);
                const res = await checkManualAccess({ id: entry.id });
                if (res.ok) setAccess(res.access);
                else setError(res.error);
              })
            }
            data-manual-check-access={entry.id}
          >
            {pending ? "Checking…" : "Check access"}
          </Button>
        )}
      </div>
      {access && <AccessVerdictNote verdict={access} />}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
