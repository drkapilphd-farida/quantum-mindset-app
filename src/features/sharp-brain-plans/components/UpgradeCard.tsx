'use client'

import { waLink } from '@/config/site.config'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import { trackWhatsAppContact } from '@/lib/analytics/conversions'
import { fillTemplate, formatSessionDate } from '@/features/live-classes/liveClasses'

/**
 * Self-paced learners only, for 7 days after joining: "Want live classes?
 * Upgrade to the live batch within 7 days for ₹6,000" → WhatsApp with their
 * email filled in. The caller decides whether the window is still open.
 */
export function UpgradeCard({ email, endsAtMs }: { email: string; endsAtMs: number }): React.JSX.Element {
  const t = useAppT()
  const htmlLang = LANGUAGES[useUiLang()].htmlLang
  const href = waLink(fillTemplate(t('training.liveClasses.upgrade.whatsapp'), { email }))
  return (
    <div className="play-card mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center" data-upgrade-card="true">
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-foreground">{t('training.liveClasses.upgrade.title')}</p>
        <p className="text-sm text-foreground">{t('training.liveClasses.upgrade.body')}</p>
        <p className="text-xs text-muted-foreground tabular-nums">{fillTemplate(t('training.liveClasses.upgrade.until'), { date: formatSessionDate(new Date(endsAtMs).toISOString(), htmlLang) })}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppContact('Self-paced upgrade')}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-500"
        data-upgrade-whatsapp="true"
      >
        {t('training.liveClasses.upgrade.cta')}
      </a>
    </div>
  )
}
