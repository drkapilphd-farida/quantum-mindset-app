import { FileText } from 'lucide-react'
import { getAppT } from '@/lib/app-i18n/server'

type DocumentMasteryCardProps = {
  documentsCompleted: number
  averageComprehensionPercent: number | null
}

// Section 5 — Document Mastery: how many documents have been uploaded
// and transformed (quantum_documents row count) alongside the average
// comprehension score across their quizzes.
export async function DocumentMasteryCard({ documentsCompleted, averageComprehensionPercent }: DocumentMasteryCardProps): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{t('progress.parent.documentMastery')}</p>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/[0.08]">
          <FileText className="size-6 text-primary" aria-hidden="true" />
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-bold tabular-nums text-foreground">{documentsCompleted}</p>
            <p className="text-xs text-muted-foreground">{t('progress.parent.documentsCompleted')}</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-foreground">{averageComprehensionPercent !== null ? `${averageComprehensionPercent}%` : '—'}</p>
            <p className="text-xs text-muted-foreground">{t('progress.parent.avgComprehension')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
