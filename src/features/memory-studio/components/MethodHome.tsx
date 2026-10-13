'use client'

import Link from 'next/link'
import { ArrowLeft, BookOpen, Dumbbell, ListChecks, type LucideIcon } from 'lucide-react'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'

export const MEMORY_STUDIO_ROUTE = '/memory-studio'

export type MethodAction = { key: string; label: string; sub?: string; icon: 'learn' | 'practise' | 'own'; onClick: () => void; primary?: boolean }

const ICONS: Record<MethodAction['icon'], LucideIcon> = { learn: BookOpen, practise: Dumbbell, own: ListChecks }

// A method's start screen: what it is for, then Learn / Practise / Own list.
export function MethodHome({ title, description, actions }: { title: string; description: string; actions: readonly MethodAction[] }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-6" data-method-home={title}>
      <Link href={MEMORY_STUDIO_ROUTE} className="flex items-center gap-1 self-start text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t('training.studio.title')}
      </Link>
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.skills.memory')}</p>
        <h1 className="mt-1 text-[1.75rem] text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-3">
        {actions.map((a) => {
          const Icon = ICONS[a.icon]
          return (
            <button
              key={a.key}
              type="button"
              onClick={a.onClick}
              className={`play-card flex min-h-[4.5rem] items-center gap-4 p-4 text-left ${a.primary ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
              data-method-action={a.key}
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: '#7c3aed' }}>
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-bold text-foreground">{a.label}</span>
                {a.sub && <span className="block text-sm text-muted-foreground">{a.sub}</span>}
              </span>
            </button>
          )
        })}
      </div>
      {uiLang !== 'en' && uiLang !== 'hi' && <p className="text-xs text-muted-foreground">{t('training.studio.nativeNote')}</p>}
    </div>
  )
}
