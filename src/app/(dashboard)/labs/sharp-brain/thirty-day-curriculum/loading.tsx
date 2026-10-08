// Page-shaped placeholder for the 30-day plan (speed fix 4): banner, plan
// header and the 30-day grid, so a tap shows the page's shape at once.
export default function Loading(): React.JSX.Element {
  return (
    <div aria-busy="true" aria-label="Loading your 30-day plan" className="mx-auto w-full max-w-3xl space-y-4" data-loading="plan">
      <div className="h-16 animate-pulse rounded-2xl bg-muted" />
      <div className="space-y-4 rounded-2xl border border-border/60 p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="h-7 w-64 max-w-full animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  )
}
