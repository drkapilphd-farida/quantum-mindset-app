'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import type { StudioLang } from '../content'
import type { ChapterIdea } from '../chapterBook'
import { createChapterMap, deleteChapterMap, listChapterMaps, type ChapterMap } from '../chapterActions'
import { listMyPalaces } from '../palaceActions'
import { STATION_SUGGESTIONS, type MyPalace } from '../palaces'
import { chapterLesson, CHAPTER_LESSON_ID } from '../lessons'
import { ChapterEditor } from './ChapterEditor'
import { ChapterMindMap } from './ChapterMindMap'
import { ChapterWalk } from './ChapterWalk'
import { MethodHome } from './MethodHome'
import { MethodLesson } from './MethodLesson'

type Mode = { name: 'home' } | { name: 'lesson' } | { name: 'new' } | { name: 'list' } | { name: 'edit'; map: ChapterMap } | { name: 'view'; map: ChapterMap } | { name: 'walk'; map: ChapterMap; journey: boolean }

// Chapter & Book: remember the key ideas and structure of a chapter or a book.
export function ChapterBookExperience(): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const lang: StudioLang = uiLang === 'hi' ? 'hi' : 'en'
  const [mode, setMode] = useState<Mode>({ name: 'home' })
  const [maps, setMaps] = useState<ChapterMap[] | null>(null)
  const [palaces, setPalaces] = useState<MyPalace[]>([])
  const lesson = useMemo(() => chapterLesson(t), [t])
  const reload = useCallback(() => {
    void listChapterMaps().then(setMaps)
    void listMyPalaces().then(setPalaces)
  }, [])
  useEffect(reload, [reload])
  const defaultStations = STATION_SUGGESTIONS.home[lang]
  const stationsFor = (map: ChapterMap): readonly string[] => palaces.find((p) => p.id === map.palaceId && p.stations.length >= map.ideas.length)?.stations ?? defaultStations

  const wrap = (title: string, children: React.ReactNode): React.JSX.Element => (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
      <h1 className="font-heading text-2xl font-bold break-words text-foreground">{title}</h1>
      {children}
    </div>
  )

  if (mode.name === 'lesson') return <MethodLesson narrationId={CHAPTER_LESSON_ID} title={t('training.studio.chapterTitle')} lines={lesson} onDone={() => setMode({ name: 'new' })} />
  if (mode.name === 'new') return wrap(t('training.studio.chapterNew'), <NewChapter onCreated={(map) => (reload(), setMode({ name: 'edit', map }))} onBack={() => setMode({ name: 'home' })} />)
  if (mode.name === 'edit')
    return wrap(
      mode.map.title,
      <ChapterEditor
        map={mode.map}
        palaces={palaces}
        defaultStations={defaultStations}
        onSaved={(ideas: ChapterIdea[], palaceId: string | null) => {
          const map = { ...mode.map, ideas, palaceId, questions: mode.map.questions.filter((q) => q.idea < ideas.length) }
          reload()
          setMode({ name: 'walk', map, journey: true })
        }}
      />,
    )
  if (mode.name === 'walk')
    return wrap(
      mode.map.title,
      <ChapterWalk mapId={mode.map.id} title={mode.map.title} ideas={mode.map.ideas} questions={mode.map.questions} stations={stationsFor(mode.map)} skipJourney={!mode.journey} onDone={() => (reload(), setMode({ name: 'list' }))} />,
    )
  if (mode.name === 'view')
    return wrap(
      mode.map.title,
      <>
        <ChapterMindMap title={mode.map.title} ideas={mode.map.ideas} />
        <Button size="lg" className="min-h-12 rounded-full" onClick={() => setMode({ name: 'walk', map: mode.map, journey: false })} data-chapter-walk-again="true">
          {t('training.studio.chapterWalkAgain')}
        </Button>
        <Button variant="outline" size="lg" className="min-h-12 rounded-full" onClick={() => setMode({ name: 'walk', map: mode.map, journey: true })}>
          {t('training.studio.chapterJourneyAgain')}
        </Button>
        <Button variant="outline" size="lg" className="min-h-12 rounded-full" onClick={() => setMode({ name: 'edit', map: mode.map })}>
          {t('training.studio.edit')}
        </Button>
        <Button variant="ghost" size="lg" className="min-h-12 rounded-full" onClick={() => void deleteChapterMap({ id: mode.map.id }).then(() => (reload(), setMode({ name: 'list' })))}>
          {t('training.studio.delete')}
        </Button>
      </>,
    )
  if (mode.name === 'list') {
    const books = new Map<string, ChapterMap[]>()
    for (const m of maps ?? []) books.set(m.bookTitle ?? '', [...(books.get(m.bookTitle ?? '') ?? []), m])
    return wrap(
      t('training.studio.chapterMine'),
      <>
        {(maps ?? []).length === 0 && <p className="text-sm text-muted-foreground">{t('training.studio.chapterNone')}</p>}
        {[...books.entries()].map(([book, list]) => (
          <section key={book} className="flex flex-col gap-2">
            {book && <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{book}</h2>}
            {list.map((m) => (
              <button key={m.id} type="button" onClick={() => setMode({ name: 'view', map: m })} className="flex flex-col items-start rounded-2xl border border-border/60 bg-card p-4 text-left" data-chapter-card={m.id}>
                <span className="font-semibold break-words text-foreground">{m.title}</span>
                <span className="text-sm text-muted-foreground">{t('training.studio.ideasN', { count: m.ideas.length })}</span>
              </button>
            ))}
          </section>
        ))}
        <Button variant="ghost" size="lg" className="min-h-12 rounded-full" onClick={() => setMode({ name: 'home' })}>
          {t('training.studio.back')}
        </Button>
      </>,
    )
  }
  const count = maps?.length ?? 0
  return (
    <MethodHome
      title={t('training.studio.chapterTitle')}
      description={t('training.studio.chapterDesc')}
      actions={[
        { key: 'learn', icon: 'learn', label: t('training.studio.learn'), sub: t('training.studio.learnSub'), onClick: () => setMode({ name: 'lesson' }), primary: count === 0 },
        { key: 'new', icon: 'own', label: t('training.studio.chapterNew'), sub: t('training.studio.chapterNewSub'), onClick: () => setMode({ name: 'new' }), primary: count > 0 },
        { key: 'list', icon: 'practise', label: t('training.studio.chapterMine'), sub: t('training.studio.chaptersN', { count }), onClick: () => setMode({ name: 'list' }) },
      ]}
    />
  )
}

function NewChapter({ onCreated, onBack }: { onCreated: (map: ChapterMap) => void; onBack: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [title, setTitle] = useState('')
  const [book, setBook] = useState('')
  const [text, setText] = useState('')
  const [source, setSource] = useState<'paste' | 'upload'>('paste')
  const [busy, setBusy] = useState<'reading' | 'thinking' | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const words = text.split(/\s+/).filter(Boolean).length

  const upload = async (file: File): Promise<void> => {
    setBusy('reading')
    setMessage(null)
    const body = new FormData()
    body.append('file', file)
    const res = (await fetch('/api/chapter-book/extract', { method: 'POST', body }).then((r) => r.json()).catch(() => ({ ok: false, error: 'unreadable' }))) as { ok: boolean; title?: string; text?: string; error?: string }
    setBusy(null)
    if (!res.ok) return setMessage(t(res.error === 'too-large' ? 'training.studio.chapterTooLarge' : res.error === 'type' ? 'training.studio.chapterFileType' : 'training.studio.chapterUnreadable'))
    setSource('upload')
    setText(res.text ?? '')
    if (title.trim() === '' && res.title) setTitle(res.title.slice(0, 120))
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (title.trim() === '') return setMessage(t('training.studio.needTitle'))
        setBusy('thinking')
        setMessage(null)
        void createChapterMap({ title: title.trim(), bookTitle: book.trim() || undefined, text, source, lang: uiLang }).then((res) => {
          setBusy(null)
          if (res.ok) return onCreated(res.map)
          setMessage(
            t(
              res.error === 'garbled'
                ? 'training.studio.chapterGarbled'
                : res.error === 'too-short'
                  ? 'training.studio.chapterTooShort'
                  : res.error === 'limit'
                    ? 'training.studio.chapterLimit'
                    : 'training.studio.chapterUnavailable',
            ),
          )
        })
      }}
      data-chapter-new="true"
    >
      <p className="text-sm text-muted-foreground">{t('training.studio.chapterNewIntro')}</p>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.chapterName')}</span>
        <input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base" data-chapter-title="true" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.chapterBookName')}</span>
        <input value={book} maxLength={120} onChange={(e) => setBook(e.target.value)} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.chapterUpload')}</span>
        <input type="file" accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0])} className="text-sm" data-chapter-file="true" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.chapterText')}</span>
        <textarea
          value={text}
          onChange={(e) => (setText(e.target.value), setSource((s) => (s === 'upload' ? 'upload' : 'paste')))}
          rows={10}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          data-chapter-text="true"
        />
        <span className="text-xs text-muted-foreground tabular-nums">{t('training.studio.wordsN', { count: words })}</span>
      </label>
      <p className="text-xs text-muted-foreground">{t('training.studio.chapterRights')}</p>
      {message && (
        <p role="alert" className="text-sm text-destructive" data-chapter-message="true">
          {message}
        </p>
      )}
      <Button type="submit" size="lg" className="min-h-12 rounded-full" disabled={busy !== null || words < 1} data-chapter-make="true">
        {busy === 'reading' ? t('training.studio.chapterReading') : busy === 'thinking' ? t('training.studio.chapterThinking') : t('training.studio.chapterMake')}
      </Button>
      <Button type="button" variant="ghost" size="lg" className="min-h-12 rounded-full" onClick={onBack}>
        {t('training.studio.back')}
      </Button>
    </form>
  )
}
