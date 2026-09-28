'use client'

import { useLanguage } from '@/context/LanguageContext'
import { contact, waLink } from '@/config/site.config'

// "Delete my child's data" request (Phase 8 consent). The guardian consent
// promises deletion on request; this gives the parent a direct way to ask.
// Requests are handled by the Mind Ur Mind team (see docs/guardian-consent.md).
const COPY = {
  en: {
    title: 'Delete my child’s data',
    body: 'You can ask us to delete your child’s practice and assessment results at any time. We confirm by email or WhatsApp once it is done.',
    email: 'Request by email',
    whatsapp: 'Request on WhatsApp',
    subject: 'Request: delete my child’s data',
    message: 'Hi, please delete my child’s practice and assessment data from the Mind Ur Mind App.',
  },
  hi: {
    title: 'मेरे बच्चे का डेटा हटाएं',
    body: 'आप कभी भी हमसे अपने बच्चे के अभ्यास और असेसमेंट के परिणाम हटाने का अनुरोध कर सकते हैं। डेटा हटने पर हम ईमेल या WhatsApp पर पुष्टि करेंगे।',
    email: 'ईमेल से अनुरोध करें',
    whatsapp: 'WhatsApp पर अनुरोध करें',
    subject: 'अनुरोध: मेरे बच्चे का डेटा हटाएं',
    message: 'नमस्ते, कृपया Mind Ur Mind App से मेरे बच्चे का अभ्यास और असेसमेंट डेटा हटा दें।',
  },
} as const

export function ChildDataDeletionRequest(): React.JSX.Element {
  const { lang } = useLanguage()
  const c = COPY[lang]
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.message)}`

  return (
    <section id="delete-child-data" className="space-y-3">
      <h2 className="text-base font-medium">{c.title}</h2>
      <p className="text-sm text-muted-foreground">{c.body}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <a href={mailto} className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium hover:bg-muted">
          {c.email}
        </a>
        <a
          href={waLink(c.message)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium hover:bg-muted"
        >
          {c.whatsapp}
        </a>
      </div>
    </section>
  )
}
