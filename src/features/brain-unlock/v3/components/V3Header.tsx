'use client'

import type { V3Copy } from '../copyV3'
import { fill } from '../copyV3'

type V3HeaderProps = {
  c: V3Copy
  lang: 'en' | 'hi'
  /** 1–4; the result screen shows no round. */
  round: number | null
  /** 0–1, how much of the whole test is done. */
  progress: number
  onLang: (lang: 'en' | 'hi') => void
}

/** "Round X of 4", the progress bar and the language switch — on every screen. */
export function V3Header({ c, lang, round, progress, onLang }: V3HeaderProps): React.JSX.Element {
  return (
    <header className="sticky top-0 z-10 -mx-4 flex flex-col gap-2 bg-background/95 px-4 pt-3 pb-2 backdrop-blur" data-v3-round={round ?? 'result'}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold tracking-wide text-muted-foreground tabular-nums">{round !== null ? fill(c.roundOf, { n: round }) : '🧠 Sharp Brain™'}</p>
        <div className="flex rounded-full border border-border p-0.5 text-sm font-semibold" role="group" aria-label="Language">
          {(['en', 'hi'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onLang(l)}
              aria-pressed={lang === l}
              className={`min-h-9 rounded-full px-3 transition-colors ${lang === l ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              data-v3-lang-toggle={l}
            >
              {l === 'en' ? 'English' : 'हिंदी'}
            </button>
          ))}
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none" style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }} />
      </div>
    </header>
  )
}
