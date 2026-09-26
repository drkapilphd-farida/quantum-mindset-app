import { BrainCircuit, Compass, Gauge, MessageSquareText, Timer, TrendingUp } from 'lucide-react'

const BENEFITS = [
  { icon: Timer, title: 'Calm in under 90 seconds', desc: 'Before any high-stakes moment.' },
  { icon: BrainCircuit, title: 'Longer, deeper focus', desc: 'With less mental fatigue.' },
  { icon: Compass, title: 'Clearer, less impulsive decisions', desc: 'A structured way to think under pressure.' },
  { icon: MessageSquareText, title: 'Better response in meetings and conflict', desc: 'Respond, not react.' },
  { icon: Gauge, title: 'A personal 12-minute daily protocol', desc: 'Simple enough to actually keep doing.' },
  { icon: TrendingUp, title: 'Your own before/after numbers', desc: 'Measured, not just felt.' },
] as const

export function ExecutiveWorkshopBenefits(): React.JSX.Element {
  return (
    <section className="border-b border-slate-200 bg-white px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">What you walk away with</h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="rounded-2xl border border-slate-200 p-6">
              <benefit.icon className="size-6 text-teal" aria-hidden="true" strokeWidth={1.75} />
              <p className="mt-4 text-[15.5px] font-semibold text-slate-900">{benefit.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
