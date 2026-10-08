// Page-shaped placeholder for Live Classes (speed fix 4): title, "My classes"
// with its 7 rows, and the upcoming class cards.
export default function Loading(): React.JSX.Element {
  return (
    <div aria-busy="true" aria-label="Loading live classes" className="space-y-6" data-loading="live-classes">
      <div className="space-y-2">
        <div className="h-8 w-56 max-w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="h-10 w-64 max-w-full animate-pulse rounded-lg bg-muted" />
      <div className="space-y-3 rounded-2xl border border-border/60 p-5">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="size-7 shrink-0 animate-pulse rounded-full bg-muted" />
            <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  )
}
