'use client'

import { useState } from 'react'
import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'
import { buildWhatsAppLink, readUtmParams } from '../utmTracking'
import { trackGaEvent } from '@/lib/analytics/ga4'
import { trackMetaPixelEvent } from '@/lib/analytics/metaPixel'

const TEAM_SIZE_OPTIONS = ['10–25', '26–50', '51–100', '100+'] as const
const FORMAT_OPTIONS = ['Half-day leadership session', 'Full-day workshop', 'Full-day + 21-day team follow-up'] as const

type FormState = {
  name: string
  designation: string
  company: string
  workEmail: string
  phone: string
  teamSize: string
  format: string
  city: string
  message: string
}

const EMPTY_FORM: FormState = {
  name: '',
  designation: '',
  company: '',
  workEmail: '',
  phone: '',
  teamSize: TEAM_SIZE_OPTIONS[0],
  format: FORMAT_OPTIONS[0],
  city: '',
  message: '',
}

function buildWhatsAppFallbackMessage(form: FormState): string {
  return [
    'Hi, we would like to bring the Executive Brain Performance Workshop to our team.',
    `Name: ${form.name}`,
    `Designation: ${form.designation}`,
    `Company: ${form.company}`,
    `Work email: ${form.workEmail}`,
    `Phone: ${form.phone}`,
    `Team size: ${form.teamSize}`,
    `Preferred format: ${form.format}`,
    `City: ${form.city}`,
    form.message !== '' ? `Message: ${form.message}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join('\n')
}

export function ExecutiveWorkshopCorporate(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]): void {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setStatus('submitting')

    trackGaEvent('corporate_enquiry_submit', { team_size: form.teamSize, format: form.format })
    trackMetaPixelEvent('Lead', { content_name: 'corporate_enquiry' })

    // No configured endpoint (executiveBrainWorkshopConfig.corporateFormEndpoint)
    // — WhatsApp is the real submission path, never a dead end.
    if (config.corporateFormEndpoint === '') {
      const message = buildWhatsAppFallbackMessage(form)
      window.open(buildWhatsAppLink(config.whatsappNumber, message), '_blank', 'noopener,noreferrer')
      setStatus('success')
      return
    }

    try {
      const response = await fetch(config.corporateFormEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, ...readUtmParams(), page: 'executive-brain-workshop' }),
      })
      if (!response.ok) throw new Error(`Form endpoint responded ${response.status}`)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section id="corporate" className="border-b border-slate-800 bg-void px-6 py-16 text-ink sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[24px] font-bold tracking-tight">Thank you — we&apos;ve received your enquiry.</h2>
          <p className="mt-3 text-[15px] text-ink-dim">
            Our team will get back to you shortly. If it&apos;s urgent, message us directly on{' '}
            <a
              href={buildWhatsAppLink(config.whatsappNumber, 'Hi, I just submitted a corporate enquiry for the Executive Brain Performance Workshop')}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal-light underline underline-offset-4"
            >
              WhatsApp
            </a>
            .
          </p>
        </div>
      </section>
    )
  }

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

        <form onSubmit={(event) => void handleSubmit(event)} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="rounded-lg border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-faint focus:border-teal focus:outline-none"
          />
          <input
            required
            placeholder="Designation"
            value={form.designation}
            onChange={(event) => updateField('designation', event.target.value)}
            className="rounded-lg border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-faint focus:border-teal focus:outline-none"
          />
          <input
            required
            placeholder="Company"
            value={form.company}
            onChange={(event) => updateField('company', event.target.value)}
            className="rounded-lg border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-faint focus:border-teal focus:outline-none"
          />
          <input
            required
            type="email"
            placeholder="Work email"
            value={form.workEmail}
            onChange={(event) => updateField('workEmail', event.target.value)}
            className="rounded-lg border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-faint focus:border-teal focus:outline-none"
          />
          <input
            required
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            className="rounded-lg border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-faint focus:border-teal focus:outline-none"
          />
          <input
            required
            placeholder="City"
            value={form.city}
            onChange={(event) => updateField('city', event.target.value)}
            className="rounded-lg border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-faint focus:border-teal focus:outline-none"
          />
          <select
            required
            aria-label="Team size"
            value={form.teamSize}
            onChange={(event) => updateField('teamSize', event.target.value)}
            className="rounded-lg border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink focus:border-teal focus:outline-none"
          >
            {TEAM_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                Team size: {option}
              </option>
            ))}
          </select>
          <select
            required
            aria-label="Preferred format"
            value={form.format}
            onChange={(event) => updateField('format', event.target.value)}
            className="rounded-lg border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink focus:border-teal focus:outline-none"
          >
            {FORMAT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Message (optional)"
            value={form.message}
            onChange={(event) => updateField('message', event.target.value)}
            rows={3}
            className="rounded-lg border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-faint focus:border-teal focus:outline-none sm:col-span-2"
          />

          {status === 'error' && (
            <p className="text-[13.5px] text-red-400 sm:col-span-2" role="alert">
              Something went wrong sending your enquiry. Please try WhatsApp instead, or try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex items-center justify-center rounded-full bg-teal px-7 py-3.5 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:col-span-2"
          >
            {status === 'submitting' ? 'Sending…' : 'Submit Enquiry'}
          </button>
        </form>

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
