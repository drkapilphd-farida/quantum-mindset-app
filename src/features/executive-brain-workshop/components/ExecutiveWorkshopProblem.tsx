const PAIN_POINTS = [
  { title: 'Constant mental overload and brain fog', desc: 'Too many open loops, not enough clear thinking time.' },
  { title: 'Reacting in meetings and regretting it later', desc: 'The sharp reply or the shutdown you wish you’d handled differently.' },
  { title: 'Decisions postponed or made in panic', desc: 'Either stuck, or rushed — rarely the calm middle ground.' },
  { title: 'Tired mind, poor sleep, never really switching off', desc: 'The workday follows you home, every day.' },
] as const

export function ExecutiveWorkshopProblem(): React.JSX.Element {
  return (
    <section className="border-b border-slate-200 bg-white px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">
          Pressure is not the problem. How your brain responds to it is.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAIN_POINTS.map((point) => (
            <div key={point.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-[15px] font-semibold text-slate-900">{point.title}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-500">{point.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-[15.5px] leading-relaxed text-slate-600">
          Under pressure the brain&rsquo;s thinking centre (prefrontal cortex) goes offline and the stress response takes over. The good news: this
          can be trained.
        </p>
      </div>
    </section>
  )
}
