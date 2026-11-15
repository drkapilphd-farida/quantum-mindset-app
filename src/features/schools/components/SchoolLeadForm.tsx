"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { normalizeIndianMobile } from "@/lib/phone/indianMobile";
import { readUtmParams } from "@/lib/analytics/utm";
import { trackLead } from "@/lib/analytics/conversions";
import { SITE_CONFIG_WHATSAPP_NUMBER } from "@/config/site.config";
import { SCHOOL_ROLES, SCHOOLS_COPY, type SchoolRole, type SchoolsLang } from "../copy";
import { monthLabel } from "../leadSchema";
import { submitSchoolLead } from "../actions";

// "Book a free pilot" (/schools). Saved by a Server Action (RLS insert-only
// table); on success: thank-you message + a WhatsApp button.

type FormState = {
  schoolName: string;
  city: string;
  contactName: string;
  role: SchoolRole | "";
  phone: string;
  email: string;
  students: string;
  preferredMonth: string;
  message: string;
  website: string;
};

const EMPTY: FormState = {
  schoolName: "",
  city: "",
  contactName: "",
  role: "",
  phone: "",
  email: "",
  students: "",
  preferredMonth: "",
  message: "",
  website: "",
};

const fieldClass =
  "min-h-12 w-full rounded-xl border-2 border-[var(--play-outline)] bg-card px-3.5 py-2.5 text-[16px] text-card-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/40";

export function SchoolLeadForm({ lang, months }: { lang: SchoolsLang; months: string[] }): React.JSX.Element {
  const c = SCHOOLS_COPY[lang].form;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneSchool, setDoneSchool] = useState<string | null>(null);
  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((cur) => ({ ...cur, [key]: e.target.value }));

  if (doneSchool !== null) {
    const wa = `https://wa.me/${SITE_CONFIG_WHATSAPP_NUMBER}?text=${encodeURIComponent(c.thanks.whatsappText(doneSchool))}`;
    return (
      <div className="play-card flex flex-col items-center gap-4 p-7 text-center sm:p-9" role="status" data-school-thanks>
        <p className="font-heading text-[28px] text-[var(--play-good)]">{c.thanks.title}</p>
        <p className="text-[17px]">{c.thanks.text}</p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#16a34a] px-6 py-3 font-heading text-[17px] text-white"
          data-school-thanks-whatsapp
        >
          <MessageCircle aria-hidden className="size-5" />
          {c.thanks.whatsapp}
        </a>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (normalizeIndianMobile(form.phone) === null) {
      setError(c.errors.phone);
      return;
    }
    setPending(true);
    setError(null);
    const result = await submitSchoolLead({ ...form, lang, utm: readUtmParams() }).catch(() => ({ success: false as const, error: c.errors.generic }));
    setPending(false);
    if (result.success) {
      trackLead("Sharp Brain for Schools", "form");
      setDoneSchool(form.schoolName.trim());
    } else {
      setError(result.error);
    }
  }

  const label = (id: string, text: string, optional = false): React.JSX.Element => (
    <label htmlFor={id} className="font-bold">
      {text}
      {optional && <span className="font-normal text-muted-foreground"> ({c.optional})</span>}
    </label>
  );

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="play-card relative flex flex-col gap-5 p-5 sm:p-7" data-school-form>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          {label("sl-school", c.school)}
          <input id="sl-school" name="schoolName" required minLength={2} maxLength={150} autoComplete="organization" value={form.schoolName} onChange={set("schoolName")} className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          {label("sl-city", c.city)}
          <input id="sl-city" name="city" required minLength={2} maxLength={100} autoComplete="address-level2" value={form.city} onChange={set("city")} className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          {label("sl-contact", c.contact)}
          <input id="sl-contact" name="contactName" required minLength={2} maxLength={100} autoComplete="name" value={form.contactName} onChange={set("contactName")} className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          {label("sl-role", c.role)}
          <select id="sl-role" name="role" required value={form.role} onChange={set("role")} className={fieldClass}>
            <option value="" disabled>
              {c.choose}
            </option>
            {SCHOOL_ROLES.map((r) => (
              <option key={r} value={r}>
                {c.roles[r]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          {label("sl-phone", c.phone)}
          <input
            id="sl-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            aria-describedby="sl-phone-hint"
            value={form.phone}
            onChange={set("phone")}
            className={fieldClass}
          />
          <span id="sl-phone-hint" className="text-[14px] text-muted-foreground">
            {c.phoneHint}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {label("sl-email", c.email, true)}
          <input id="sl-email" name="email" type="email" maxLength={254} autoComplete="email" value={form.email} onChange={set("email")} className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          {label("sl-students", c.students, true)}
          <input id="sl-students" name="students" type="number" inputMode="numeric" min={1} max={100000} value={form.students} onChange={set("students")} className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          {label("sl-month", c.month, true)}
          <select id="sl-month" name="preferredMonth" value={form.preferredMonth} onChange={set("preferredMonth")} className={fieldClass}>
            <option value="">{c.monthAny}</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m, lang)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {label("sl-message", c.message, true)}
        <textarea id="sl-message" name="message" maxLength={1000} rows={4} placeholder={c.messageHint} value={form.message} onChange={set("message")} className={`${fieldClass} min-h-28`} />
      </div>
      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor="sl-website">Website</label>
        <input id="sl-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
      </div>
      {error !== null && (
        <p role="alert" className="rounded-xl bg-[var(--play-warn-bg)] px-4 py-3 text-[15.5px] font-semibold text-[var(--play-warn)]" data-school-form-error>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-2xl border-[2.5px] border-[var(--play-outline)] bg-primary px-6 py-3 font-heading text-[18px] text-primary-foreground shadow-[0_4px_0_#4c1d95] disabled:opacity-60 dark:border-0"
        data-school-submit
      >
        {pending ? c.sending : c.submit}
      </button>
      <p className="text-[14px] text-muted-foreground">{c.privacy}</p>
    </form>
  );
}
