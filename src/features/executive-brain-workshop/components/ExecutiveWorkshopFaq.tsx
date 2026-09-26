import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'

const FAQ_ITEMS = [
  { question: 'Do I need any prior experience?', answer: 'No. The workshop is designed for busy professionals with no prior training in this area.' },
  {
    question: 'What exactly is the EEG demo, is it safe?',
    answer:
      'It is a live engagement demo using a light, non-invasive headband that reads brain activity — not a medical test. It is completely safe and non-invasive.',
  },
  {
    question: 'Will I personally be measured?',
    answer:
      'Yes — everyone gets a focus test, reaction time and a standard stress score, before and after. Personal EEG measurement is part of the Executive 1:1 Track.',
  },
  {
    question: 'What happens after the workshop?',
    answer: '21 days of guided daily practice on WhatsApp, with a weekly live online review call and a Day 21 re-measurement.',
  },
  { question: 'How much time do I need daily?', answer: '12 minutes a day for the 21-day follow-up.' },
  { question: 'Is lunch included?', answer: 'Yes, lunch and tea are included on the workshop day.' },
  {
    question: 'Can my company sponsor me / get an invoice with GST?',
    answer: 'Yes — write to us with your company details and we will share a GST invoice.',
  },
  { question: 'Refund and transfer policy?', answer: null }, // filled from config below
  { question: 'Can we book this for our company?', answer: 'Yes — see the "For Corporate Teams" section above, or use the enquiry form.' },
] as const

// Exported so page.tsx's FAQPage JSON-LD is built from this exact same
// copy (see buildFaqPageSchema.ts's own "never separately maintained
// content" reasoning) rather than a second, driftable copy.
export function getResolvedExecutiveWorkshopFaqItems(): { question: string; answer: string }[] {
  const config = executiveBrainWorkshopConfig
  return FAQ_ITEMS.map((item) => ({ question: item.question, answer: item.answer ?? config.refundPolicyText }))
}

export function ExecutiveWorkshopFaq(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig

  return (
    <section id="faq" className="border-b border-slate-200 bg-slate-50 px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">Frequently asked questions</h2>

        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[15.5px] font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="mt-0.5 flex size-6 flex-none items-center justify-center rounded-full border border-slate-300 text-[13px] text-slate-500 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 pr-10 text-[15px] leading-relaxed text-slate-600">{item.answer ?? config.refundPolicyText}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
