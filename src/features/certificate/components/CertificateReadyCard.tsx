'use client'

import Link from 'next/link'
import { Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'

export const CERTIFICATE_ROUTE = '/labs/sharp-brain/certificate'

/** Shown once Day 30 is complete: the way to the learner's certificate. */
export function CertificateReadyCard(): React.JSX.Element {
  const t = useAppT()
  return (
    <div className="mx-auto mt-6 flex w-full max-w-3xl flex-col gap-3 rounded-3xl border-2 border-amber-500/40 bg-amber-500/5 p-5 sm:flex-row sm:items-center sm:justify-between" data-certificate-card="true">
      <div className="flex items-center gap-3">
        <Award className="size-8 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="font-semibold text-foreground">{t('training.certificate.cardTitle')}</p>
      </div>
      <Button asChild size="lg" className="min-h-12 rounded-full">
        <Link href={CERTIFICATE_ROUTE}>{t('training.certificate.cardCta')}</Link>
      </Button>
    </div>
  )
}
