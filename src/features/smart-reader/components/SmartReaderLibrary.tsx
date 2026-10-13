'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { findPassage, LIBRARY, passageMinutes } from '../library'
import { SmartReader } from './SmartReader'

// The Smart Reader's passage library (English and Hindi). Learners in the
// other languages choose which of the two to read in.
export function SmartReaderLibrary({ initialPassage }: { initialPassage: string | null }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [lang, setLang] = useState<'en' | 'hi'>(uiLang === 'hi' ? 'hi' : 'en')
  const [open, setOpen] = useState<string | null>(initialPassage)
  const passage = open === null ? null : findPassage(open)

  if (passage !== null)
    return <SmartReader title={passage.title} sections={passage.sections} source="library" sourceRef={passage.id} onExit={() => setOpen(null)} />

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-6" data-reader-library={lang}>
      <Link href="/memory-studio" className="flex items-center gap-1 self-start text-sm font-medium text-muted-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t('training.studio.title')}
      </Link>
      <div>
        <span className="inline-block rounded-full px-3 py-0.5 text-xs font-bold tracking-wider text-white uppercase" style={{ background: '#c2410c' }}>
          {t('training.reader.skill')}
        </span>
        <h1 className="mt-2 text-[2rem] text-foreground">{t('training.reader.libraryTitle')}</h1>
        <p className="mt-1 text-base text-muted-foreground">{t('training.reader.libraryDesc')}</p>
      </div>
      {uiLang !== 'en' && uiLang !== 'hi' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{t('training.reader.libraryLangNote')}</p>
          <div className="grid grid-cols-2 gap-2">
            {(['en', 'hi'] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} className={`play-option min-h-12 text-base font-bold ${lang === l ? 'ring-2 ring-primary' : ''}`} data-reader-lang={l}>
                {l === 'en' ? 'English' : 'हिंदी'}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {LIBRARY[lang].map((p) => (
          <button key={p.id} type="button" onClick={() => setOpen(p.id)} className="play-card flex items-center gap-4 p-4 text-left" data-reader-passage={p.id}>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{ background: 'color-mix(in srgb, #ea580c 20%, transparent)' }} aria-hidden="true">
              📖
            </span>
            <span className="min-w-0">
              <span className="block text-lg leading-tight font-bold text-foreground">{p.title}</span>
              <span className="block text-sm text-muted-foreground">
                {t('training.reader.sectionsN', { n: p.sections.length })} · {t('training.reader.minutes', { n: passageMinutes(p) })}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
