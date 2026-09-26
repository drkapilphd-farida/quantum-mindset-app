// Hard rule: never mention any EEG device brand or model name anywhere
// on this page (copy, alt text, meta tags) — say "EEG" / "EEG
// brain-state demo" only. Never claim this is a medical test or
// diagnosis — the disclaimer line below says so explicitly.
export function ExecutiveWorkshopEegDemo(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-void px-6 py-20 text-ink sm:px-8 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full text-teal/20">
        <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true" focusable="false">
          <path
            d="M0,100 C50,70 100,130 150,100 C200,70 250,130 300,100 C350,70 400,130 450,100 C500,70 550,130 600,100 C650,70 700,130 750,100 C775,85 790,95 800,100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="font-mono text-[12.5px] uppercase tracking-[0.14em] text-teal-light">The Signature Moment</p>
        <h2 className="mt-4 text-[28px] font-bold tracking-tight sm:text-[36px]">See the change in your brain — live.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-dim">
          During the workshop, a live EEG brain-state demo is shown on screen with participant volunteers: the brain state before a 90-second reset,
          and after. Everyone watches stressed/busy brain activity shift towards a calm, focused state in real time.
        </p>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line-strong bg-panel p-6 text-left">
            <p className="text-[13px] font-semibold text-ink-faint uppercase tracking-wide">Every participant</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">
              Measures their own before-and-after with a simple focus test (attention/Stroop), reaction time, and a standard stress score — at the
              start of the workshop and again on Day 21.
            </p>
          </div>
          <div className="rounded-2xl border border-teal/40 bg-panel p-6 text-left">
            <p className="text-[13px] font-semibold text-teal-light uppercase tracking-wide">Executive 1:1 Track</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">Personal one-to-one EEG measurement is part of this track.</p>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-[12.5px] text-ink-faint">
          This is a live engagement demo, not a medical test or diagnosis. It does not produce a clinical report and is not a substitute for any
          medical or neurological assessment.
        </p>
      </div>
    </section>
  )
}
