import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'

// Never invent testimonials, names, companies or numbers — this section
// renders nothing at all until executiveBrainWorkshopConfig.testimonials
// has at least one real entry.
export function ExecutiveWorkshopTestimonials(): React.JSX.Element | null {
  const testimonials = executiveBrainWorkshopConfig.testimonials

  if (testimonials.length === 0) return null

  return (
    <section className="border-b border-slate-200 bg-white px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">What participants say</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-[14.5px] leading-relaxed text-slate-600 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="mt-4 text-[13.5px] font-semibold text-slate-900">{testimonial.name}</p>
              <p className="text-[12px] text-slate-500">
                {testimonial.designation}, {testimonial.company}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
