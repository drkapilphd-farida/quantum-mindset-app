'use client'

import Link from 'next/link'
import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'
import { ORGANISATIONS_HREF } from '@/config/navigation'
import { CorporateEnquiryForm } from '@/components/corporate/CorporateEnquiryForm'

const FORMAT_OPTIONS = ['Half-day leadership session', 'Full-day workshop', 'Full-day + 21-day team follow-up'] as const

export function ExecutiveWorkshopCorporate(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig

  return (
    <section id="corporate" className="border-b border-slate-800 bg-void px-6 py-16 text-ink sm:px-8 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-[12.5px] uppercase tracking-[0.14em] text-teal-light">For Corporate Teams</p>
        <h2 className="mt-3 text-[26px] font-bold tracking-tight sm:text-[32px]">
          Bring the Executive Brain Performance Workshop to your team.
        </h2>
        <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-dim">
          An in-house programme for leadership teams, managers and high-pressure departments — at your office or offsite, anywhere in India.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FORMAT_OPTIONS.map((format) => (
            <div key={format} className="rounded-xl border border-line-strong bg-panel px-4 py-3 text-[13.5px] text-ink-dim">
              {format}
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {[
            'Calmer leadership under pressure',
            'Better meeting and decision quality',
            'Reduced burnout signs',
            'Measurable before/after data for HR/L&D',
          ].map((outcome) => (
            <p key={outcome} className="text-[13.5px] text-ink-dim">
              · {outcome}
            </p>
          ))}
        </div>

        <p className="mt-6 text-[14px] font-semibold text-ink">Pricing on request — depends on team size and format.</p>

        <CorporateEnquiryForm
          page="executive-brain-workshop"
          formatOptions={FORMAT_OPTIONS}
          whatsappIntro="Hi, we would like to bring the Executive Brain Performance Workshop to our team."
        />

        <Link href={ORGANISATIONS_HREF} className="mt-5 inline-flex text-[14px] font-semibold text-teal-light underline underline-offset-4">
          For Corporate Teams & Schools — all formats →
        </Link>

        {config.brochurePdfUrl !== '' && (
          <a
            href={config.brochurePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-medium text-teal-light underline underline-offset-4"
          >
            Download corporate brochure →
          </a>
        )}
      </div>
    </section>
  )
}
