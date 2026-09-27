import Image from 'next/image'
import { localizeTestimonial, testimonialsForProgram } from '@/config/testimonials'

// Only verified testimonials about THIS workshop (src/config/testimonials.ts,
// program: executiveWorkshop). Reviews of other programs are never used as
// proof here — until real workshop reviews exist, the section hides itself.
export function ExecutiveWorkshopTestimonials(): React.JSX.Element | null {
  const testimonials = testimonialsForProgram('executiveWorkshop')
    .map((item) => localizeTestimonial(item, 'en'))
    .filter((item) => item.quote !== null)

  if (testimonials.length === 0) return null

  return (
    <section className="border-b border-slate-200 bg-white px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">What participants say</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
              {testimonial.photo !== null && (
                <div className="relative mb-4 size-12 overflow-hidden rounded-full border border-slate-200">
                  <Image src={testimonial.photo} alt={testimonial.name} fill sizes="48px" className="object-cover" />
                </div>
              )}
              <p className="flex-1 text-[14.5px] leading-relaxed text-slate-600 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="mt-4 text-[13.5px] font-semibold text-slate-900">{testimonial.name}</p>
              {testimonial.context !== '' && <p className="text-[12px] text-slate-500">{testimonial.context}</p>}
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-teal">{testimonial.programLabel}</p>
              {testimonial.videoUrl !== null && (
                <a
                  href={testimonial.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-[12px] font-semibold text-teal underline underline-offset-2"
                >
                  Watch video →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
