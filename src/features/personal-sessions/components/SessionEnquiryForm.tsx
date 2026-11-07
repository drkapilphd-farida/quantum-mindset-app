"use client";

import { useState } from "react";
import { waLink } from "@/data/links";
import { normalizeIndianMobile } from "@/lib/phone/indianMobile";
import { submitSessionEnquiry } from "@/app/personal-sessions/actions/submitSessionEnquiry";
import { AREA_OPTIONS, personalSessionsCopy } from "../personalSessionsCopy";

type FormState = { name: string; phone: string; city: string; area: string; change: string; website: string };
const EMPTY: FormState = { name: "", phone: "", city: "", area: "", change: "", website: "" };

const fieldClass =
  "min-h-11 w-full rounded-md border border-line-strong bg-void px-3 py-2.5 text-[17px] text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none";

export function SessionEnquiryForm(): React.JSX.Element {
  const c = personalSessionsCopy.enquiry;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const set = (key: keyof FormState) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  if (done) {
    const details = ["Personal Sessions enquiry", `Name: ${form.name}`, `City: ${form.city}`, `Kind of session: ${form.area}`, `What I would like to change: ${form.change}`].join("\n");
    return (
      <div className="rounded-lg bg-panel2 p-7 text-center sm:p-9" role="status" data-enquiry-thanks>
        <p className="text-[24px] font-extrabold text-gold sm:text-[28px]">{c.thanks.title}</p>
        <p className="mt-3 text-[17px] text-ink">{c.thanks.text}</p>
        <a href={waLink(details)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong px-6 py-2.5 text-[15px] font-semibold text-ink hover:bg-panel">
          {c.thanks.whatsapp}
        </a>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (normalizeIndianMobile(form.phone) === null) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPending(true);
    setError(null);
    const result = await submitSessionEnquiry(form);
    setPending(false);
    if (result.success) setDone(true);
    else setError(result.error);
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="relative flex flex-col gap-5 rounded-lg bg-panel2 p-6 sm:p-7" data-enquiry-form>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="se-name" className="font-semibold">
            {c.name}
          </label>
          <input id="se-name" type="text" required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={(e) => set("name")(e.target.value)} className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="se-phone" className="font-semibold">
            {c.phone}
          </label>
          <input id="se-phone" type="tel" inputMode="tel" required autoComplete="tel" aria-describedby="se-phone-hint" value={form.phone} onChange={(e) => set("phone")(e.target.value)} className={fieldClass} />
          <span id="se-phone-hint" className="text-[13px] text-ink-dim">
            {c.phoneHint}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="se-city" className="font-semibold">
            {c.city}
          </label>
          <input id="se-city" type="text" required minLength={2} maxLength={100} autoComplete="address-level2" value={form.city} onChange={(e) => set("city")(e.target.value)} className={fieldClass} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="se-area" className="font-semibold">
          {c.area}
        </label>
        <select id="se-area" required value={form.area} onChange={(e) => set("area")(e.target.value)} className={fieldClass}>
          <option value="">{c.choose}</option>
          {AREA_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="se-change" className="font-semibold">
          {c.change}
        </label>
        <textarea id="se-change" required minLength={10} maxLength={2000} rows={5} aria-describedby="se-change-hint" value={form.change} onChange={(e) => set("change")(e.target.value)} className={`${fieldClass} min-h-[132px]`} />
        <span id="se-change-hint" className="text-[13px] text-ink-dim">
          {c.changeHint}
        </span>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => set("website")(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {error !== null && (
        <p role="alert" className="rounded-md border border-rose/60 bg-rose-soft px-3 py-2 text-[15px] text-ink">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="min-h-12 rounded-md bg-gold px-6 py-3.5 text-[18px] font-extrabold text-[#1B1508] transition-transform hover:-translate-y-0.5 disabled:opacity-60" data-enquiry-submit>
        {pending ? c.sending : c.submit}
      </button>
      <p className="text-[13px] text-ink-dim">{c.privacy}</p>
    </form>
  );
}
