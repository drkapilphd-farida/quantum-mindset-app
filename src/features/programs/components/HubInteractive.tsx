"use client";

import { createContext, useContext, useState } from "react";
import { normalizeIndianMobile } from "@/lib/phone/indianMobile";
import { waLink } from "@/data/links";
import { cancelWhatsAppHandoff, finishWhatsAppHandoff, openPendingWhatsAppTab } from "@/lib/whatsapp/handoff";
import { clarityRequestMessage } from "@/lib/whatsapp/leadMessages";
import { submitSessionEnquiry } from "@/app/personal-sessions/actions/submitSessionEnquiry";
import { GROUPS, say } from "../common";
import { HUB, QUIZ_NAMES, QUIZ_RESULTS, type ChipId, type Q1, type Q2 } from "../hubCopy";
import { PROGRAMS, getProgram, programHref, programsInGroup } from "../programs";
import type { ProgramLang, ProgramSlug } from "../types";

// /personal-sessions interactive parts. The quiz result button and
// ?program=<slug> both pre-select a program in the booking form.

type BookingState = { program: string; setProgram: (value: string) => void };
const BookingContext = createContext<BookingState | null>(null);

export function HubBookingProvider({ initialProgram, children }: { initialProgram: ProgramSlug | null; children: React.ReactNode }): React.JSX.Element {
  const [program, setProgram] = useState<string>(initialProgram ?? "");
  return <BookingContext.Provider value={{ program, setProgram }}>{children}</BookingContext.Provider>;
}

function useBooking(): BookingState {
  const value = useContext(BookingContext);
  if (value === null) throw new Error("useBooking must be used within HubBookingProvider");
  return value;
}

const pill = (on: boolean): string =>
  `min-h-11 rounded-full border-2 px-[18px] py-2.5 text-[16px] ${on ? "border-[#0E1B2C] bg-[#0E1B2C] font-extrabold text-white" : "border-[#C5CCD8] bg-white font-semibold text-[#0E1B2C]"}`;

export function HubPrograms({ lang }: { lang: ProgramLang }): React.JSX.Element {
  const [chip, setChip] = useState<ChipId>("all");
  const shown = programsInGroup(chip);
  const c = HUB.programs;
  return (
    <>
      <div role="group" aria-label={say(c.filterLabel, lang)} className="flex flex-wrap gap-2.5" data-chips>
        {c.chips.map((item) => (
          <button key={item.id} type="button" aria-pressed={chip === item.id} onClick={() => setChip(item.id)} className={pill(chip === item.id)} data-chip={item.id}>
            {say(item.label, lang)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5" data-program-cards>
        {shown.map((p) => {
          const g = GROUPS[p.group];
          return (
            <a
              key={p.slug}
              href={programHref(p.slug, lang)}
              className="flex min-h-[190px] flex-col gap-2.5 rounded-[16px] border-[1.5px] border-[#E3E6EC] bg-white p-[22px] text-[#0E1B2C] no-underline transition-colors hover:border-[#0E1B2C]"
              data-program-card={p.slug}
            >
              <span className="self-start rounded-full px-2.5 py-[3px] text-[13px] font-extrabold" style={{ background: g.tagBg, color: g.tagFg }}>
                {say(g.label, lang)}
              </span>
              <span className="text-[22px] font-extrabold leading-[1.25]">{say(p.name, lang)}</span>
              <span className="text-[16px] text-[#4A5568]">{say(p.line, lang)}</span>
              <span className="mt-auto text-[16px] font-extrabold text-[#1F3A8A]">{lang === "hi" ? "और जानिए →" : "Learn more →"}</span>
            </a>
          );
        })}
      </div>
    </>
  );
}

const opt = (on: boolean): string =>
  `min-h-12 rounded-[12px] border-2 px-4 py-3.5 text-left text-[17px] ${on ? "border-[#1F3A8A] bg-[#1F3A8A] font-extrabold text-white" : "border-[#C5CCD8] bg-white font-semibold text-[#0E1B2C]"}`;

export function HubQuiz({ lang }: { lang: ProgramLang }): React.JSX.Element {
  const c = HUB.quiz;
  const { setProgram } = useBooking();
  const [q1, setQ1] = useState<Q1 | null>(null);
  const [q2, setQ2] = useState<Q2 | null>(null);
  const result = q1 !== null && q2 !== null ? QUIZ_RESULTS[`${q1}-${q2}`] : null;
  const nameOf = (slug: ProgramSlug): string => say(QUIZ_NAMES[slug] ?? getProgram(slug).name, lang);
  return (
    <div className="flex flex-col gap-6 rounded-[18px] bg-white p-7">
      <div className="flex flex-col gap-3">
        <p className="text-[20px] font-extrabold">{say(c.q1, lang)}</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
          {c.q1Options.map((o) => (
            <button key={o.id} type="button" aria-pressed={q1 === o.id} onClick={() => setQ1(o.id)} className={opt(q1 === o.id)} data-q1={o.id}>
              {say(o.label, lang)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-[20px] font-extrabold">{say(c.q2, lang)}</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
          {c.q2Options.map((o) => (
            <button key={o.id} type="button" aria-pressed={q2 === o.id} onClick={() => setQ2(o.id)} className={opt(q2 === o.id)} data-q2={o.id}>
              {say(o.label, lang)}
            </button>
          ))}
        </div>
      </div>
      {result !== null ? (
        <div className="flex flex-col gap-3 rounded-[14px] bg-[#0E1B2C] p-6 text-white" aria-live="polite" data-quiz-result>
          <p className="text-[15px] font-semibold text-[#F2A93B]">{say(c.resultEyebrow, lang)}</p>
          <p className="text-[28px] font-extrabold leading-[1.25]">
            <a href={programHref(result[0], lang)} className="text-white underline decoration-[#F2A93B] underline-offset-4">
              {nameOf(result[0])}
            </a>{" "}
            +{" "}
            <a href={programHref(result[1], lang)} className="text-white underline decoration-[#F2A93B] underline-offset-4">
              {nameOf(result[1])}
            </a>
          </p>
          <p className="text-[17px] text-[#D6DCE8]">{say(c.resultLine, lang)}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#book"
              onClick={() => setProgram(result[0])}
              className="inline-flex min-h-11 items-center rounded-[10px] bg-[#F2A93B] px-[22px] py-3 text-[17px] font-extrabold text-[#0E1B2C] hover:bg-[#E39A2A]"
              data-quiz-book
            >
              {say(c.resultButton, lang)}
            </a>
          </div>
        </div>
      ) : (
        <p className="text-[16px] text-[#4A5568]">{say(c.noResult, lang)}</p>
      )}
    </div>
  );
}

type FormState = { name: string; phone: string; city: string; change: string; website: string };
const EMPTY: FormState = { name: "", phone: "", city: "", change: "", website: "" };
const field = "min-h-11 w-full rounded-[8px] border border-[#3A4B66] bg-[#0E1B2C] p-3 text-[17px] text-white focus:border-[#F2A93B] focus:outline-none";

export function HubBookingForm({ lang, source }: { lang: ProgramLang; source: string }): React.JSX.Element {
  const c = HUB.book;
  const { program, setProgram } = useBooking();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const set = (key: keyof FormState) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  if (sent) {
    return (
      <div className="flex flex-col gap-2.5 rounded-[18px] bg-[#16263D] p-9 text-center" role="status" data-booking-thanks>
        <p className="text-[28px] font-extrabold text-[#F2A93B]">{say(c.thanksTitle, lang)}</p>
        <p className="text-[18px] text-[#D6DCE8]">{say(c.thanksText, lang)}</p>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (normalizeIndianMobile(form.phone) === null) {
      setError(say(c.phoneError, lang));
      return;
    }
    // Opened during the tap (phones block it later); pointed at WhatsApp once saved.
    const tab = openPendingWhatsAppTab();
    setPending(true);
    setError(null);
    const result = await submitSessionEnquiry({ ...form, program, source });
    setPending(false);
    if (result.success) {
      const programName = program === "" || program === "not-sure" ? say(c.notSure, "en") : getProgram(program as ProgramSlug).name.en;
      finishWhatsAppHandoff(tab, waLink(clarityRequestMessage({ programName, name: form.name, phone: form.phone, city: form.city, change: form.change })));
      setSent(true);
    } else {
      cancelWhatsAppHandoff(tab);
      setError(result.error);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="relative flex flex-col gap-4 rounded-[18px] bg-[#16263D] p-7" data-booking-form>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bName" className="font-semibold">
            {say(c.name, lang)}
          </label>
          <input id="bName" type="text" required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={(e) => set("name")(e.target.value)} className={field} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bPhone" className="font-semibold">
            {say(c.phone, lang)}
          </label>
          <input id="bPhone" type="tel" inputMode="tel" required autoComplete="tel" value={form.phone} onChange={(e) => set("phone")(e.target.value)} className={field} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bCity" className="font-semibold">
            {say(c.city, lang)}
          </label>
          <input id="bCity" type="text" required minLength={2} maxLength={100} autoComplete="address-level2" value={form.city} onChange={(e) => set("city")(e.target.value)} className={field} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bProg" className="font-semibold">
          {say(c.program, lang)}
        </label>
        <select id="bProg" required value={program} onChange={(e) => setProgram(e.target.value)} className={field} data-program-select>
          <option value="">{say(c.choose, lang)}</option>
          <option value="not-sure">{say(c.notSure, lang)}</option>
          {PROGRAMS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {say(p.name, lang)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bWhy" className="font-semibold">
          {say(c.change, lang)}
        </label>
        <textarea id="bWhy" rows={4} required minLength={10} maxLength={2000} value={form.change} onChange={(e) => set("change")(e.target.value)} className={field} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => set("website")(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {error !== null && (
        <p role="alert" className="rounded-[8px] border border-[#F2A93B]/60 bg-[#0E1B2C] px-3 py-2 text-[15px]">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="min-h-12 rounded-[10px] bg-[#F2A93B] p-4 text-[19px] font-extrabold text-[#0E1B2C] hover:bg-[#E39A2A] disabled:opacity-60" data-booking-submit>
        {pending ? say(c.sending, lang) : say(c.submit, lang)}
      </button>
      <p className="text-[13px] text-[#AEB8CA]">{say(c.note, lang)}</p>
    </form>
  );
}
