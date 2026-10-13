import type { ChapterIdea } from '../chapterBook'

// A simple mind map: the chapter in the middle, its key ideas around it (in
// order, numbered), each with its few supporting points.
export function ChapterMindMap({ title, ideas }: { title: string; ideas: readonly ChapterIdea[] }): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3" data-mind-map={ideas.length}>
      <div className="max-w-full rounded-full border-2 border-primary bg-primary/10 px-5 py-2 text-center font-heading text-lg font-bold break-words text-foreground">{title}</div>
      <div className="h-3 w-px bg-primary/40" aria-hidden="true" />
      <ol className="grid w-full grid-cols-1 gap-2 min-[480px]:grid-cols-2">
        {ideas.map((idea, i) => (
          <li key={i} className="rounded-2xl border border-border/60 bg-card p-3">
            <p className="flex gap-2 font-semibold break-words text-foreground">
              <span className="text-primary tabular-nums">{i + 1}.</span>
              {idea.title}
            </p>
            {idea.points.length > 0 && (
              <ul className="mt-1 list-disc pl-8 text-sm text-muted-foreground">
                {idea.points.map((p, j) => (
                  <li key={j} className="break-words">
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
