const AUDIENCE = [
  'CEOs, founders and business owners',
  'Senior managers and team leaders',
  'Doctors, CAs, lawyers and other high-pressure professionals',
  'HR and L&D heads evaluating the programme for their teams',
] as const

export function ExecutiveWorkshopAudience(): React.JSX.Element {
  return (
    <section className="border-b border-slate-200 bg-slate-50 px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">Who this is for</h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 text-[14.5px] font-medium text-slate-700">
              {item}
            </div>
          ))}
        </div>

        <p className="mt-6 text-[13px] text-slate-500">
          Not for: this is not a treatment for anxiety, depression or any medical condition. People needing that should consult a qualified
          professional.
        </p>
      </div>
    </section>
  )
}
