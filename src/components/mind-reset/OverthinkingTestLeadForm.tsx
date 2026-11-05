"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { submitOverthinkingTestLead } from "@/app/mind-assessment/actions/submitOverthinkingTestLead";
import { OverthinkingTestLeadInputSchema } from "@/app/mind-assessment/actions/overthinkingTestLeadSchema";
import { buildOverthinkingTestWhatsAppLink } from "@/config/whatsappSupportLink";
import { nextBatchLabel, testLeadCopy, workshopHref } from "@/lib/testLeadCopy";

// Phase 5 — after the Overthinking Test result (copy/tests.md): name +
// WhatsApp number → the test's own existing lead path
// (submitOverthinkingTestLead: the overthinking_test_leads table, with an
// email fallback) and the existing pre-filled WhatsApp message with the
// three bands; then "Sent" + the nearest batch. Shown after the full
// result — never a gate in front of it. WhatsApp opens even if saving
// fails, so the visitor's report still reaches Dr. Kapil.
export default function OverthinkingTestLeadForm({
  scores,
  bands,
}: {
  scores: { overthinking: number; worry: number; stress: number };
  bands: { overthinking: string; worry: string; stress: string };
}): React.JSX.Element {
  const { lang } = useLanguage();
  const c = testLeadCopy[lang];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const nextBatch = nextBatchLabel(lang);

  async function send(): Promise<void> {
    const input = {
      fullName: name,
      whatsappNumber: phone,
      overthinkingScore: scores.overthinking,
      worryScore: scores.worry,
      stressScore: scores.stress,
      overallScore: scores.overthinking + scores.worry + scores.stress,
    };
    const parsed = OverthinkingTestLeadInputSchema.safeParse(input);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? null);
      return;
    }
    setError(null);
    setState("saving");
    // Opened during the tap so the phone allows it; pointed at WhatsApp once the lead is sent.
    const waWindow = window.open("", "_blank");
    const url = buildOverthinkingTestWhatsAppLink({ name: parsed.data.fullName, overthinkingBand: bands.overthinking, worryBand: bands.worry, stressBand: bands.stress });
    await submitOverthinkingTestLead(parsed.data).catch(() => null);
    if (waWindow !== null) waWindow.location.href = url;
    else window.location.href = url;
    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="mt-5 rounded-sm border border-line-strong bg-panel2 px-7 py-6 sm:px-9" data-lead-saved>
        <p className="text-[17px] font-bold text-ink">{c.sent}</p>
        {nextBatch !== null && (
          <p className="mt-2 text-[14.5px] text-ink-dim">
            {c.nextBatch} {nextBatch} →{" "}
            <Link href={workshopHref(lang)} className="font-semibold text-ink underline decoration-gold/60 underline-offset-4">
              {c.seeWorkshop}
            </Link>
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      className="mt-5 rounded-sm border border-line-strong bg-panel2 px-7 py-6 sm:px-9"
      onSubmit={(event) => {
        event.preventDefault();
        void send();
      }}
      data-lead-capture
    >
      <h3 className="text-[18px] font-bold text-ink">{c.title}</h3>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-dim">{c.sub}</p>
      <label className="sr-only" htmlFor="ot-name">
        {c.name}
      </label>
      <input id="ot-name" type="text" autoComplete="name" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} placeholder={c.name} className="mt-4 w-full rounded-sm border border-line-strong bg-void px-4 py-3 text-[15px] text-ink" />
      <label className="sr-only" htmlFor="ot-phone">
        {c.phone}
      </label>
      <input id="ot-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={c.phone} className="mt-2.5 w-full rounded-sm border border-line-strong bg-void px-4 py-3 text-[15px] text-ink" />
      <button type="submit" disabled={state === "saving" || name.trim() === "" || phone.trim() === ""} className="mt-4 inline-flex w-full items-center justify-center rounded-sm bg-rose px-7 py-[13px] text-[14.5px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b8757e] disabled:cursor-not-allowed disabled:opacity-50">
        {c.button}
      </button>
      <p className="mt-2.5 text-[12.5px] text-ink-faint">{c.small}</p>
      {error !== null && (
        <p role="alert" className="mt-2 text-[13.5px] font-semibold text-ink">
          {error}
        </p>
      )}
    </form>
  );
}
