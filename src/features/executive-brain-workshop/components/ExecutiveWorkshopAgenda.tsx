const AGENDA_BLOCKS = [
  {
    label: 'Morning',
    title: 'Measure & Reset',
    items: [
      'Your baseline: focus, reaction time, stress score',
      'How stress hijacks the brain',
      'The 90-Second Reset (signature tool)',
      'Live EEG demo',
    ],
  },
  {
    label: 'Late Morning',
    title: 'Stress Regulation',
    items: ['Cyclic sighing and resonance breathing', 'Naming emotions to calm the reactive brain', 'Recovery through NSDR / yoga nidra'],
  },
  {
    label: 'Afternoon',
    title: 'Focus & Mental Load',
    items: [
      'Brain-dump technique to clear mental overload',
      'Visual attention and focus sprints (from Quantum Speed Reading training)',
      'Single-tasking and digital hygiene',
    ],
  },
  {
    label: 'Evening',
    title: 'Decision Clarity & Response Control',
    items: [
      'The pre-mortem decision method',
      '"If–Then" plans for high-pressure situations',
      'Response-vs-reaction drill for meetings and difficult conversations',
      'Your Personal 12-Minute Performance Protocol',
    ],
  },
] as const

export function ExecutiveWorkshopAgenda(): React.JSX.Element {
  return (
    <section id="agenda" className="border-b border-slate-200 bg-slate-50 px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[12.5px] uppercase tracking-[0.14em] text-teal">The Day</p>
        <h2 className="mt-3 max-w-2xl text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">
          What you will learn and practise
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {AGENDA_BLOCKS.map((block, index) => (
            <div key={block.title} className="relative rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-8 flex-none items-center justify-center rounded-full bg-teal-soft text-[13px] font-bold text-teal">
                  {index + 1}
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">{block.label}</p>
                  <p className="text-[16.5px] font-bold text-slate-900">{block.title}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 pl-11">
                {block.items.map((item) => (
                  <li key={item} className="list-disc text-[14px] leading-relaxed text-slate-600 marker:text-teal">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
