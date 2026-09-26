const WEEKS = [
  { label: 'Week 1', title: 'Stress Reset' },
  { label: 'Week 2', title: 'Focus & Mental Load' },
  { label: 'Week 3', title: 'Decision Clarity' },
] as const

export function ExecutiveWorkshopFollowUp(): React.JSX.Element {
  return (
    <section className="border-b border-slate-200 bg-white px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[12.5px] uppercase tracking-[0.14em] text-teal">After the Workshop</p>
        <h2 className="mt-3 max-w-2xl text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">21-day WhatsApp follow-up</h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {WEEKS.map((week) => (
            <div key={week.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-teal">{week.label}</p>
              <p className="mt-1 text-[17px] font-bold text-slate-900">{week.title}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-2xl space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-[14.5px] text-slate-600">
            <span className="font-semibold text-slate-900">Every day on WhatsApp:</span> a short audio practice by Dr. Kapil Dev Sharma, a 12-minute task, and
            a 30-second daily log.
          </p>
          <p className="text-[14.5px] text-slate-600">
            <span className="font-semibold text-slate-900">Weekly:</span> a live online review call.
          </p>
          <p className="text-[14.5px] text-slate-600">
            <span className="font-semibold text-slate-900">Day 21:</span> re-measure and compare your before-and-after.
          </p>
        </div>

        <p className="mt-8 text-center text-[15.5px] font-medium text-slate-700">
          A one-day workshop gives insight. 21 days of practice builds the habit.
        </p>
      </div>
    </section>
  )
}
