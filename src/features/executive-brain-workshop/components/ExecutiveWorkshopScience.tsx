const SCIENCE_POINTS = [
  'Slow, exhale-focused breathing and cyclic sighing have been shown to reduce stress and improve mood (Stanford research, 2023).',
  'Naming emotions reduces activity in the brain’s alarm centre (UCLA research).',
  'Writing out worries before a high-pressure task improves performance (research published in Science, 2011).',
  '"If–Then" planning strongly improves follow-through on goals.',
] as const

export function ExecutiveWorkshopScience(): React.JSX.Element {
  return (
    <section className="border-b border-slate-200 bg-slate-50 px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">Built on research, taught for real life.</h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SCIENCE_POINTS.map((point) => (
            <div key={point} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[14.5px] leading-relaxed text-slate-600">{point}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[12.5px] text-slate-400">Workshop techniques are based on published research. Individual results vary.</p>
      </div>
    </section>
  )
}
