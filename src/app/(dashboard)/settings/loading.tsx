// Page-shaped placeholder for Settings (speed fix 4): title and its sections.
export default function Loading(): React.JSX.Element {
  return (
    <div aria-busy="true" aria-label="Loading settings" className="space-y-6" data-loading="settings">
      <div className="space-y-2">
        <div className="h-7 w-32 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-60 max-w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="h-px bg-border" />
      <div className="max-w-md space-y-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
