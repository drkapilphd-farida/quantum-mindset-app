import type { AccessVerdict } from '../rules'

// Green "✅ Access verified" or a red warning with the reason (admin only).
export function AccessVerdictNote({ verdict }: { verdict: AccessVerdict }): React.JSX.Element {
  return (
    <p
      role={verdict.ok ? 'status' : 'alert'}
      className={`rounded-md border px-3 py-2 text-sm font-medium ${verdict.ok ? 'border-emerald-600/40 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-destructive/50 bg-destructive/10 text-destructive'}`}
      data-access-verdict={verdict.ok ? 'verified' : 'blocked'}
    >
      {verdict.ok ? verdict.text : `⚠️ ${verdict.text}`}
    </p>
  )
}
