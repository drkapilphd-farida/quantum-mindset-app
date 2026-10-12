import type { Translator } from '@/lib/app-i18n/translate'
import { DIGITS_TOTAL, FACES_TOTAL, WORDS_TOTAL, type MemoryCheckResult } from '../memoryCheck'

// One memory check result (and the starting one, when there is one to compare
// with). No 'use client': renders on the result screen and the Progress page.

export function MemoryResultParts({
  result,
  before,
  t,
  dateLocale,
}: {
  result: MemoryCheckResult
  before: MemoryCheckResult | null
  t: Translator
  dateLocale: string
}): React.JSX.Element {
  const value = (b: number | undefined, a: number, total: number): string =>
    b === undefined ? t('training.memoryCheck.outOf', { value: a, total }) : `${b} → ${t('training.memoryCheck.outOf', { value: a, total })}`
  const rows: { key: string; label: string; text: string; detail?: string }[] = [
    {
      key: 'words',
      label: t('training.memoryCheck.partWords'),
      text: value(before?.words, result.words, WORDS_TOTAL),
      detail: t('training.memoryCheck.wordsDetail', { found: result.wordsFound, wrong: result.wrongTaps }),
    },
    { key: 'number', label: t('training.memoryCheck.partNumber'), text: value(before?.digits, result.digits, DIGITS_TOTAL) },
    { key: 'faces', label: t('training.memoryCheck.partFaces'), text: value(before?.faces, result.faces, FACES_TOTAL) },
  ]
  const date = (r: MemoryCheckResult): string => new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(r.takenAt))
  // "Start · Day 3 · 12 Oct 2026" / "Day 30 · 12 Nov 2026"
  const taken = (r: MemoryCheckResult): string =>
    r.phase === 'final'
      ? `${t('training.memoryCheck.day30Label')} · ${date(r)}`
      : `${t('training.memoryCheck.startLabel')} · ${r.day === null ? date(r) : t('training.memoryCheck.takenOn', { day: r.day, date: date(r) })}`

  return (
    <div className="flex flex-col gap-4" data-memory-result={result.score}>
      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <p className="text-sm font-semibold text-muted-foreground">{t('training.memoryCheck.score')}</p>
        <p className="mt-1 font-heading text-4xl font-bold text-foreground tabular-nums">
          {before !== null && <span className="text-2xl text-muted-foreground">{before.score} → </span>}
          {result.score}
          <span className="text-lg font-semibold text-muted-foreground"> / 100</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{t('training.memoryCheck.scoreExplain')}</p>
      </div>
      <dl className="flex flex-col divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
        {rows.map((row) => (
          <div key={row.key} className="flex items-start justify-between gap-3 px-5 py-3">
            <dt className="min-w-0 text-sm text-foreground">
              {row.label}
              {row.detail && <span className="block text-xs text-muted-foreground">{row.detail}</span>}
            </dt>
            <dd className="text-right text-sm font-semibold text-foreground tabular-nums">{row.text}</dd>
          </div>
        ))}
      </dl>
      <div className="text-xs text-muted-foreground">
        {before !== null && <p>{taken(before)}</p>}
        <p>{taken(result)}</p>
      </div>
    </div>
  )
}
