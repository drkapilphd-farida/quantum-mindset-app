// A visible marker for content still waiting on Dr. Kapil Dev Sharma
// (doctorate wording, working hours, organisations list …). Shown on
// local and preview builds only — on production it renders nothing, so a
// TODO never reaches a real visitor. See next.config.ts `env`.
const SHOW = process.env.NEXT_PUBLIC_SHOW_CONTENT_TODOS === 'true'

export default function SiteTodo({ children }: { children: React.ReactNode }): React.JSX.Element | null {
  if (!SHOW) return null
  return (
    <p className="rounded-sm border border-dashed border-rose/60 bg-rose/5 px-3 py-2 font-mono text-[12px] text-rose">
      TODO (preview only): {children}
    </p>
  )
}
