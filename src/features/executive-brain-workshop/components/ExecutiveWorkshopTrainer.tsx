import Image from 'next/image'

// Bio facts reused verbatim from the site's own existing About page
// (src/lib/i18n.ts's aboutPage/guide entries) — the one already-verified
// source of truth for these numbers, never invented for this page.
export function ExecutiveWorkshopTrainer(): React.JSX.Element {
  return (
    <section className="border-b border-slate-200 bg-white px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200">
          <Image src="/founder-warm.jpg" alt="Dr. Kapil Dev Sharma" fill sizes="(min-width: 1024px) 340px, 80vw" className="object-cover" />
        </div>

        <div>
          <p className="font-mono text-[12.5px] uppercase tracking-[0.14em] text-teal">About the Trainer</p>
          <h2 className="mt-3 text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">Dr. Kapil Dev Sharma</h2>
          <p className="mt-1 text-[14px] font-medium text-slate-500">Founder, Mind Ur Mind · Mind Trainer &amp; Life Coach</p>

          <p className="mt-5 text-[15.5px] leading-relaxed text-slate-600">
            Dr. Kapil Dev Sharma is the founder of Mind Ur Mind and a mind trainer and life coach with over two decades of experience — 26 years in
            total, including 15 years as a professor and researcher in formal education and 11 years as a life coach and mind trainer. He is the
            creator of the Quantum Speed Reading programme, running since 2015, and has trained students, professionals, schools and franchise
            partners across India.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
            <div>
              <p className="text-[22px] font-bold text-slate-900">10,000+</p>
              <p className="text-[12px] text-slate-500">Students Guided</p>
            </div>
            <div>
              <p className="text-[22px] font-bold text-slate-900">500+</p>
              <p className="text-[12px] text-slate-500">Workshops Delivered</p>
            </div>
            <div>
              <p className="text-[22px] font-bold text-slate-900">26</p>
              <p className="text-[12px] text-slate-500">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
