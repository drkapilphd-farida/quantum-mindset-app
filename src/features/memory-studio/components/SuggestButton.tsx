'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import { suggestIdea } from '../actions'

type Request = { kind: 'story'; items: string[]; lang: string } | { kind: 'peg'; peg: string; n: number; item: string; lang: string } | { kind: 'face'; name: string; feature: string; lang: string } | { kind: 'keyword'; word: string; meaning: string; lang: string } | { kind: 'acronym'; letters: string; items: string[]; lang: string }

// "Suggest an idea": the AI only suggests; the learner's own text box gets the
// idea to change and make their own. Never fills in without a tap.
export function SuggestButton({ request, onIdea }: { request: Request; onIdea: (text: string) => void }): React.JSX.Element {
  const t = useAppT()
  const [state, setState] = useState<'idle' | 'busy' | 'limit' | 'error'>('idle')
  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-h-10 self-start rounded-full"
        disabled={state === 'busy' || state === 'limit'}
        onClick={() => {
          setState('busy')
          void suggestIdea(request).then((res) => {
            if (res.ok) {
              onIdea(res.text)
              setState('idle')
            } else setState(res.error === 'limit' ? 'limit' : 'error')
          })
        }}
        data-suggest="true"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        {state === 'busy' ? t('training.studio.suggesting') : t('training.studio.suggest')}
      </Button>
      {state === 'limit' && <p className="text-xs text-muted-foreground">{t('training.studio.suggestLimit')}</p>}
      {state === 'error' && <p className="text-xs text-muted-foreground">{t('training.studio.suggestError')}</p>}
    </div>
  )
}
