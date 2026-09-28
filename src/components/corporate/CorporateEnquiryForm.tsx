'use client'

import { useState } from 'react'
import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'
import { buildWhatsAppLink, readUtmParams } from '@/features/executive-brain-workshop/utmTracking'
import { trackGaEvent } from '@/lib/analytics/ga4'
import { trackLead } from '@/lib/analytics/conversions'

// Corporate / school enquiry form, shared by /executive-brain-workshop
// (#corporate) and /corporate. Posts to executiveBrainWorkshopConfig
// .corporateFormEndpoint when one is configured; otherwise WhatsApp is the
// real submission path, never a dead end.

const TEAM_SIZE_OPTIONS = ['10–25', '26–50', '51–100', '100+'] as const

type Lang = 'en' | 'hi'

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

const LABELS = {
  en: {
    name: 'Name',
    designation: 'Designation',
    company: 'Company',
    workEmail: 'Work email',
    phone: 'Phone',
    city: 'City',
    teamSize: 'Team size',
    format: 'Preferred format',
    message: 'Message (optional)',
    submit: 'Submit Enquiry',
    sending: 'Sending…',
    error: 'Something went wrong sending your enquiry. Please try WhatsApp instead, or try again.',
    successTitle: 'Thank you — we’ve received your enquiry.',
    successBody: 'Our team will get back to you shortly. If it’s urgent, message us directly on',
  },
  hi: {
    name: 'नाम',
    designation: 'पद',
    company: 'संस्था का नाम',
    workEmail: 'ऑफिस ईमेल',
    phone: 'फ़ोन',
    city: 'शहर',
    teamSize: 'समूह का आकार',
    format: 'पसंदीदा फॉर्मेट',
    message: 'संदेश (वैकल्पिक)',
    submit: 'पूछताछ भेजें',
    sending: 'भेजा जा रहा है…',
    error: 'आपकी पूछताछ भेजने में समस्या हुई। कृपया WhatsApp पर संपर्क करें, या फिर से कोशिश करें।',
    successTitle: 'धन्यवाद — हमें आपकी पूछताछ मिल गई है।',
    successBody: 'हमारी टीम जल्द ही आपसे संपर्क करेगी। ज़रूरी हो तो सीधे संदेश भेजें:',
  },
} as const

type CorporateEnquiryFormProps = {
  /** Source page — sent with the enquiry and to analytics. */
  page: string
  formatOptions: readonly string[]
  /** First line of the pre-filled WhatsApp message. */
  whatsappIntro: string
  /** Placeholder for the organisation field, e.g. "Company / school / college". */
  companyPlaceholder?: string
  lang?: Lang
}

const fieldClass =
  'rounded-lg border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-faint focus:border-teal focus:outline-none'

export function CorporateEnquiryForm({
  page,
  formatOptions,
  whatsappIntro,
  companyPlaceholder,
  lang = 'en',
}: CorporateEnquiryFormProps): React.JSX.Element {
  const config = executiveBrainWorkshopConfig
  const l = LABELS[lang]
  const [form, setForm] = useState<FormState>({
    name: '',
    designation: '',
    company: '',
    workEmail: '',
    phone: '',
    teamSize: TEAM_SIZE_OPTIONS[0],
    format: formatOptions[0] ?? '',
    city: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]): void {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function whatsappMessage(): string {
    return [
      whatsappIntro,
      `Name: ${form.name}`,
      `Designation: ${form.designation}`,
      `Organisation: ${form.company}`,
      `Work email: ${form.workEmail}`,
      `Phone: ${form.phone}`,
      `Group size: ${form.teamSize}`,
      `Preferred format: ${form.format}`,
      `City: ${form.city}`,
      form.message !== '' ? `Message: ${form.message}` : null,
    ]
      .filter((line): line is string => line !== null)
      .join('\n')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setStatus('submitting')

    trackGaEvent('corporate_enquiry_submit', { team_size: form.teamSize, format: form.format, page })
    trackLead(page === 'corporate' ? 'Corporate & school enquiry' : 'Executive workshop corporate enquiry', 'form')

    if (config.corporateFormEndpoint === '') {
      window.open(buildWhatsAppLink(config.whatsappNumber, whatsappMessage()), '_blank', 'noopener,noreferrer')
      setStatus('success')
      return
    }

    try {
      const response = await fetch(config.corporateFormEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, ...readUtmParams(), page }),
      })
      if (!response.ok) throw new Error(`Form endpoint responded ${response.status}`)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="mt-8 rounded-sm border border-teal/40 bg-panel p-6 text-center" role="status">
        <p className="text-[20px] font-bold text-ink">{l.successTitle}</p>
        <p className="mt-3 text-[15px] text-ink-dim">
          {l.successBody}{' '}
          <a
            href={buildWhatsAppLink(config.whatsappNumber, `${whatsappIntro} (enquiry submitted)`)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal-light underline underline-offset-4"
          >
            WhatsApp
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <input required aria-label={l.name} placeholder={l.name} value={form.name} onChange={(event) => updateField('name', event.target.value)} className={fieldClass} />
      <input
        required
        aria-label={l.designation}
        placeholder={l.designation}
        value={form.designation}
        onChange={(event) => updateField('designation', event.target.value)}
        className={fieldClass}
      />
      <input
        required
        aria-label={l.company}
        placeholder={companyPlaceholder ?? l.company}
        value={form.company}
        onChange={(event) => updateField('company', event.target.value)}
        className={fieldClass}
      />
      <input
        required
        type="email"
        aria-label={l.workEmail}
        placeholder={l.workEmail}
        value={form.workEmail}
        onChange={(event) => updateField('workEmail', event.target.value)}
        className={fieldClass}
      />
      <input required type="tel" aria-label={l.phone} placeholder={l.phone} value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className={fieldClass} />
      <input required aria-label={l.city} placeholder={l.city} value={form.city} onChange={(event) => updateField('city', event.target.value)} className={fieldClass} />
      <select required aria-label={l.teamSize} value={form.teamSize} onChange={(event) => updateField('teamSize', event.target.value)} className={fieldClass}>
        {TEAM_SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {l.teamSize}: {option}
          </option>
        ))}
      </select>
      <select required aria-label={l.format} value={form.format} onChange={(event) => updateField('format', event.target.value)} className={fieldClass}>
        {formatOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <textarea
        aria-label={l.message}
        placeholder={l.message}
        value={form.message}
        onChange={(event) => updateField('message', event.target.value)}
        rows={3}
        className={`${fieldClass} sm:col-span-2`}
      />

      {status === 'error' && (
        <p className="text-[13.5px] text-red-400 sm:col-span-2" role="alert">
          {l.error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center rounded-full bg-teal px-7 py-3.5 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:col-span-2"
      >
        {status === 'submitting' ? l.sending : l.submit}
      </button>
    </form>
  )
}
