import { getAppT } from '@/lib/app-i18n/server'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import { getMemoryCheckResults } from '../actions'
import { memoryBeforeAfter } from '../memoryCheck'
import { MemoryResultParts } from './MemoryResultParts'

// Progress page: the learner's memory check — the starting one (with its
// date and plan day), and Day 30 compared with it when both exist.
export async function MemoryCheckCard(): Promise<React.JSX.Element | null> {
  const [{ t, lang }, results] = await Promise.all([getAppT(), getMemoryCheckResults()])
  const baseline = results.find((r) => r.phase === 'baseline') ?? null
  const final = results.find((r) => r.phase === 'final') ?? null
  const latest = final ?? baseline
  if (latest === null) return null
  const pair = memoryBeforeAfter({ baseline, final })
  return (
    <section className="flex flex-col gap-3" data-memory-check-card="true">
      <h2 className="font-heading text-lg font-bold text-foreground">{t('training.memoryCheck.progressTitle')}</h2>
      <MemoryResultParts result={latest} before={pair?.before ?? null} t={t} dateLocale={LANGUAGES[lang].htmlLang} />
      {final !== null && pair === null && <p className="text-sm text-muted-foreground">{t('training.memoryCheck.noBaseline')}</p>}
    </section>
  )
}
