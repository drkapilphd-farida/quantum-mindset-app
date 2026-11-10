"use client";

import { createContext, useContext, useState } from "react";
import { PARTNER_PROGRAM } from "@/config/partnerProgram";
import { SHARP_BRAIN_REVIEW_CARDS, SHARP_BRAIN_REVIEW_GRID_CLASS } from "@/config/sharpBrainVideoReviews";
import { waLink } from "@/data/links";
import { readUtmParams } from "@/lib/analytics/utm";
import { trackLead } from "@/lib/analytics/conversions";
import { cancelWhatsAppHandoff, finishWhatsAppHandoff, openPendingWhatsAppTab } from "@/lib/whatsapp/handoff";
import { partnerApplicationMessage } from "@/lib/whatsapp/leadMessages";
import VideoReviewGrid from "@/components/VideoReviewGrid";
import { submitPartnerApplication } from "@/app/partner/actions/submitPartnerApplication";
import { CONTACT_OPTIONS, INVEST_OPTIONS, OCCUPATIONS, START_OPTIONS, formatInr, normalizeIndianMobile, partnerEarnings, recoverText, type LiveTeacher } from "../earnings";
import { partnerCopy } from "../partnerCopy";

// /partner interactive parts. The hero card and the calculator share one
// state, so the hero always shows the calculator's numbers.

type CalcState = { self: number; live: number; teacher: LiveTeacher };
type CalcValue = CalcState & { set: (next: Partial<CalcState>) => void };

const CalcContext = createContext<CalcValue | null>(null);

export function PartnerCalculatorProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [state, setState] = useState<CalcState>({
    self: PARTNER_PROGRAM.calculator.self.default,
    live: PARTNER_PROGRAM.calculator.live.default,
    teacher: "drKapil",
  });
  const value: CalcValue = { ...state, set: (next) => setState((current) => ({ ...current, ...next })) };
  return <CalcContext.Provider value={value}>{children}</CalcContext.Provider>;
}

function useCalc(): CalcValue {
  const value = useContext(CalcContext);
  if (value === null) throw new Error("useCalc must be used within PartnerCalculatorProvider");
  return value;
}

export function HeroEarningsCard(): React.JSX.Element {
  const c = partnerCopy.hero.card;
  const { self, live, teacher } = useCalc();
  const e = partnerEarnings(self, live, teacher);
  return (
    <div className="rounded-lg bg-panel2 p-6 sm:p-7" aria-live="polite" data-hero-earnings>
      <p className="text-[15px] text-ink-dim">{c.label}</p>
      <p className="mt-1 text-[44px] font-extrabold leading-[1.1] text-gold sm:text-[52px]" data-hero-monthly>
        {formatInr(e.monthly)}
      </p>
      <p className="mt-1 text-[16px] text-ink">{c.students(self, live)}</p>
      <div className="my-4 h-px bg-line-strong" />
      <p className="text-[15px] text-ink-dim">{c.back}</p>
      <p className="mt-0.5 text-[26px] font-extrabold" data-hero-recover>
        {recoverText(e.recoverMonths)}
      </p>
      <p className="mt-3 text-[13px] text-ink-dim">{c.note}</p>
    </div>
  );
}

function Slider({ id, label, value, min, max, onChange, note }: { id: string; label: string; value: number; min: number; max: number; onChange: (n: number) => void; note: string }): React.JSX.Element {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-4 text-[17px] font-semibold sm:text-[18px]">
        <span>{label}</span>
        <span className="text-[22px] font-extrabold text-[#1F3A8A]" aria-hidden="true">
          {value}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-11 w-full cursor-pointer accent-[#1F3A8A]"
        data-slider={id}
      />
      <p className="text-[14px] text-ink-dim">{note}</p>
    </div>
  );
}

export function EarningsCalculator(): React.JSX.Element {
  const c = partnerCopy.calculator;
  const { self, live, teacher, set } = useCalc();
  const e = partnerEarnings(self, live, teacher);
  const toggle = (value: LiveTeacher, label: string): React.JSX.Element => {
    const on = teacher === value;
    return (
      <button
        type="button"
        aria-pressed={on}
        onClick={() => set({ teacher: value })}
        className={`min-h-11 rounded-md border-2 px-4 py-2.5 text-[16px] transition-colors ${on ? "border-[#1F3A8A] bg-[#1F3A8A] font-bold text-white" : "border-line-strong bg-panel font-semibold text-ink hover:border-[#1F3A8A]"}`}
        data-teacher={value}
      >
        {label}
      </button>
    );
  };
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_1fr]">
      <div className="flex flex-col gap-7">
        <Slider id="partner-self" label={c.self.label} value={self} min={PARTNER_PROGRAM.calculator.self.min} max={PARTNER_PROGRAM.calculator.self.max} onChange={(n) => set({ self: n })} note={c.self.note} />
        <Slider
          id="partner-live"
          label={c.live.label}
          value={live}
          min={PARTNER_PROGRAM.calculator.live.min}
          max={PARTNER_PROGRAM.calculator.live.max}
          onChange={(n) => set({ live: n })}
          note={teacher === "drKapil" ? c.liveNote.drKapil : c.liveNote.self}
        />
        <div role="group" aria-labelledby="partner-teacher">
          <p id="partner-teacher" className="text-[17px] font-semibold sm:text-[18px]">
            {c.teacher.question}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {toggle("drKapil", c.teacher.drKapil)}
            {toggle("self", c.teacher.self)}
          </div>
        </div>
      </div>
      <div className="warm-dark flex flex-col gap-4 rounded-lg p-6 sm:p-7" aria-live="polite" data-calc-result>
        <div>
          <p className="text-[15px] text-ink-dim">{c.result.monthly}</p>
          <p className="text-[44px] font-extrabold leading-[1.15] text-gold sm:text-[48px]" data-calc-monthly>
            {formatInr(e.monthly)}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 rounded-md bg-panel2 p-3">
            <p className="text-[13px] text-ink-dim">{c.result.fromSelf}</p>
            <p className="text-[20px] font-extrabold">{formatInr(e.fromSelf)}</p>
          </div>
          <div className="flex-1 rounded-md bg-panel2 p-3">
            <p className="text-[13px] text-ink-dim">{c.result.fromLive}</p>
            <p className="text-[20px] font-extrabold">{formatInr(e.fromLive)}</p>
          </div>
        </div>
        <div>
          <p className="text-[15px] text-ink-dim">{c.result.back}</p>
          <p className="text-[26px] font-extrabold" data-calc-recover>
            {recoverText(e.recoverMonths)}
          </p>
        </div>
        <div>
          <p className="text-[15px] text-ink-dim">{c.result.yearly}</p>
          <p className="text-[26px] font-extrabold">{formatInr(e.yearly)}</p>
        </div>
        <p className="text-[13px] leading-relaxed text-ink-dim">{c.result.note}</p>
      </div>
    </div>
  );
}

/** The 7 Sharp Brain Shorts: 4 first, the rest behind "See more reviews". Thumbnail first, play on click. */
const FIRST_REVIEWS = 4;

export function PartnerReviews(): React.JSX.Element {
  const [all, setAll] = useState(false);
  const videos = all ? SHARP_BRAIN_REVIEW_CARDS : SHARP_BRAIN_REVIEW_CARDS.slice(0, FIRST_REVIEWS);
  const gridClass = SHARP_BRAIN_REVIEW_GRID_CLASS.replace("lg:grid-cols-7", all ? "lg:grid-cols-7" : "lg:grid-cols-4");
  return (
    <div>
      <VideoReviewGrid videos={videos} aspectRatioClassName="aspect-[9/16]" gridClassName={gridClass} className="mt-8" />
      {!all && SHARP_BRAIN_REVIEW_CARDS.length > FIRST_REVIEWS && (
        <button
          type="button"
          onClick={() => setAll(true)}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md border-2 border-[#1F3A8A] px-6 py-2.5 text-[16px] font-bold text-[#1F3A8A] transition-colors hover:bg-[#EEF2FB]"
          data-more-reviews
        >
          {partnerCopy.proof.more}
        </button>
      )}
    </div>
  );
}

type FormState = { name: string; phone: string; city: string; occupation: string; contact: string; invest: string; start: string; website: string };
const EMPTY: FormState = { name: "", phone: "", city: "", occupation: "", contact: "", invest: "", start: "", website: "" };

const fieldClass =
  "min-h-11 w-full rounded-md border border-line-strong bg-void px-3 py-2.5 text-[17px] text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none";

function SelectField({ id, label, value, options, onChange, placeholder }: { id: string; label: string; value: string; options: readonly string[]; onChange: (v: string) => void; placeholder: string }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <select id={id} required value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PartnerApplyForm(): React.JSX.Element {
  const c = partnerCopy.apply;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const set = (key: keyof FormState) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const message = (): string =>
    partnerApplicationMessage({
      ...form,
      questions: { occupation: c.occupation, contact: c.contact, invest: c.invest, start: c.start },
    });

  if (done) {
    const details = message();
    return (
      <div className="rounded-lg bg-panel2 p-7 text-center sm:p-9" role="status" data-apply-thanks>
        <p className="text-[24px] font-extrabold text-gold sm:text-[28px]">{c.thanks.title}</p>
        <p className="mt-3 text-[17px] text-ink">{c.thanks.text}</p>
        <a
          href={waLink(details)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong px-6 py-2.5 text-[15px] font-semibold text-ink hover:bg-panel"
        >
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
    // Opened during the tap (phones block it later); pointed at WhatsApp once saved.
    const tab = openPendingWhatsAppTab();
    setPending(true);
    setError(null);
    const result = await submitPartnerApplication({ ...form, utm: readUtmParams() });
    setPending(false);
    if (result.success) {
      trackLead("Sharp Brain Partner Program", "form");
      finishWhatsAppHandoff(tab, waLink(message()));
      setDone(true);
    } else {
      cancelWhatsAppHandoff(tab);
      setError(result.error);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="flex flex-col gap-5 rounded-lg bg-panel2 p-6 sm:p-7" noValidate={false} data-apply-form>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pa-name" className="font-semibold">
            {c.name}
          </label>
          <input id="pa-name" type="text" required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={(event) => set("name")(event.target.value)} className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pa-phone" className="font-semibold">
            {c.phone}
          </label>
          <input
            id="pa-phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            aria-describedby="pa-phone-hint"
            value={form.phone}
            onChange={(event) => set("phone")(event.target.value)}
            className={fieldClass}
          />
          <span id="pa-phone-hint" className="text-[13px] text-ink-dim">
            {c.phoneHint}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pa-city" className="font-semibold">
            {c.city}
          </label>
          <input id="pa-city" type="text" required minLength={2} maxLength={100} autoComplete="address-level2" value={form.city} onChange={(event) => set("city")(event.target.value)} className={fieldClass} />
        </div>
      </div>
      <SelectField id="pa-q1" label={c.occupation} value={form.occupation} options={OCCUPATIONS} onChange={set("occupation")} placeholder={c.choose} />
      <SelectField id="pa-q2" label={c.contact} value={form.contact} options={CONTACT_OPTIONS} onChange={set("contact")} placeholder={c.choose} />
      <SelectField id="pa-q3" label={c.invest} value={form.invest} options={INVEST_OPTIONS} onChange={set("invest")} placeholder={c.choose} />
      <SelectField id="pa-q4" label={c.start} value={form.start} options={START_OPTIONS} onChange={set("start")} placeholder={c.choose} />
      {/* Honeypot: hidden from people and screen readers. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(event) => set("website")(event.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {error !== null && (
        <p role="alert" className="rounded-md border border-rose/60 bg-rose-soft px-3 py-2 text-[15px] text-ink">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 rounded-md bg-gold px-6 py-3.5 text-[18px] font-extrabold text-[#1B1508] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        data-apply-submit
      >
        {pending ? c.sending : c.submit}
      </button>
      <p className="text-[13px] text-ink-dim">{c.privacy}</p>
    </form>
  );
}
