import { MessageCircle } from 'lucide-react'
import { WHATSAPP_MASTERCLASS_INQUIRY_LINK } from '@/config/whatsappSupportLink'
import { getAppT } from '@/lib/app-i18n/server'

// Live Member Training Hub™ — a direct, real way to reach Dr. Kapil Dev
// Sharma. Deliberately quiet: a single plain link, not a promotional
// WhatsApp banner — this hub assumes you're already a member, not
// someone being sold to.
export async function MentorGuidanceCard(): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{t('dashboard.liveClasses.mentorTitle')}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t('dashboard.liveClasses.mentorBody')}</p>
      <a
        href={WHATSAPP_MASTERCLASS_INQUIRY_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        {t('dashboard.liveClasses.mentorCta')}
      </a>
    </div>
  )
}
